import { useCallback, useEffect, useRef } from "react";
import L from "leaflet";
import { scaleQuantile } from "d3-scale";

// Sequential ramp: density is a magnitude, not a good/bad axis, so a diverging red-green scale
// would read as a judgement it is not making. Used when the chart config names no colours.
export const CLUSTER_COLOR_RANGE = ["#FFE9A8", "#FFD24D", "#FFA424", "#F76707", "#D9480F", "#A02C0A"];
const CLUSTER_MIN_RADIUS = 5;
const CLUSTER_MAX_RADIUS = 22;
// Individual households are all one thing, so they get one size and one colour.
const POINT_RADIUS = 4;
const POINT_COLOR = "#C84C0E";
const ICON_SIZE = 22;

/**
 * Marker shapes for the individual-point rendering, on a 24x24 viewBox.
 *
 * `anchorBottom` is for shapes whose meaningful position is their tip rather than their
 * middle — a pin points at its coordinate, a badge sits on it.
 */
export const POINT_SHAPES = {
  pin: {
    path:
      "M12 2C7.9 2 4.6 5.3 4.6 9.4c0 5.5 7.4 12.6 7.4 12.6s7.4-7.1 7.4-12.6C19.4 5.3 16.1 2 12 2zm0 10.2a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6z",
    anchorBottom: true,
  },
  warning: {
    path: "M12 3.2 1.6 21h20.8L12 3.2zm.9 13.9h-1.8v-1.8h1.8v1.8zm0-3.2h-1.8V9.4h1.8v4.5z",
    anchorBottom: false,
  },
  facility: {
    path: "M3 21V9.5L12 3l9 6.5V21h-6v-6H9v6H3z",
    anchorBottom: false,
  },
};

// Icons are DOM nodes in the marker pane, not canvas paths, so each one costs a real element
// and a layout. That is exactly the cost the canvas path exists to avoid, so past this many
// rows the shape request is ignored and circles are drawn instead — a slow map is a worse
// answer than a differently-shaped one. Sparse layers (facilities, warehouses, alerts) sit
// far below this; household points do not.
const MAX_ICON_MARKERS = 1500;

const iconSvg = (shape, size, color) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">` +
  `<path d="${POINT_SHAPES[shape].path}" fill="${color}" stroke="#FFFFFF" stroke-width="1.2" stroke-linejoin="round"/>` +
  `</svg>`;

// A configured size is only usable if it is a positive number — 0, "" and a typo'd string all
// have to fall back rather than produce invisible or NaN-radius markers.
const positive = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

/**
 * Resolves a point layer's appearance from its chart config, falling back to the defaults above.
 *
 * Config lives on the chart entry in ChartApiConfig.json — every key optional:
 *
 *   "style": {
 *     "clusterColors": ["#FFE9A8", "#FFA424", "#A02C0A"],   // ramp, light -> dark
 *     "pointColor": "#C84C0E",
 *     "clusterMinRadius": 5,     // px, radius of the smallest bucket
 *     "clusterMaxRadius": 22,    // px, radius of the densest bucket
 *     "pointRadius": 4,          // px, individual points when shape is "circle"
 *     "shape": "circle",         // circle | pin | warning | facility
 *     "iconSize": 22             // px, bounding box for the non-circle shapes
 *   }
 *
 * `shape` applies to the individual-point rendering only. Clusters stay circles whatever it
 * says: a cluster encodes its household count in its area, and an icon has no area to vary.
 *
 * `clusterColors` takes either a list or a single colour string. A single colour is not a
 * special case in the code — scaleQuantile with a one-entry range maps every bucket to it —
 * so "constant colour" and "ramp" are the same setting with different arity.
 *
 * Sequential means one hue getting darker. A list of unrelated hues would encode density as
 * identity and misread the data, so keep the steps on one hue when overriding.
 */
export const resolvePointStyle = (layer) => {
  const style = layer?.style || {};
  const configured = style.clusterColors;
  const clusterColors = (Array.isArray(configured) ? configured : configured ? [configured] : []).filter(Boolean);
  const clusterMinRadius = positive(style.clusterMinRadius, CLUSTER_MIN_RADIUS);
  return {
    clusterColors: clusterColors.length ? clusterColors : CLUSTER_COLOR_RANGE,
    pointColor: style.pointColor || POINT_COLOR,
    clusterMinRadius,
    // Never below the minimum: an inverted pair would shrink markers as density rose, which
    // reads as the opposite of the data.
    clusterMaxRadius: Math.max(clusterMinRadius, positive(style.clusterMaxRadius, CLUSTER_MAX_RADIUS)),
    pointRadius: positive(style.pointRadius, POINT_RADIUS),
    // Unknown shape names fall back rather than throwing — config is edited by hand.
    shape: POINT_SHAPES[style.shape] ? style.shape : "circle",
    iconSize: positive(style.iconSize, ICON_SIZE),
  };
};

// The legend bar has to show the same ramp the markers use, so it is generated from the same
// resolved colours rather than kept in step by hand in the stylesheet.
export const clusterGradient = (clusterColors) => {
  const stops = clusterColors.length > 1 ? clusterColors : [clusterColors[0], clusterColors[0]];
  return `linear-gradient(90deg, ${stops
    .map((c, i) => `${c} ${Math.round((i / (stops.length - 1)) * 100)}%`)
    .join(", ")})`;
};

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// i18next hands back the key itself when the bundle has no entry, which put literal
// "DSS_MAP_HOUSEHOLDS" text in the tooltips. Translate when there is a translation, otherwise
// show the plain word — same fallback the rest of the map UI uses.
const labelFor = (t, key, fallback) => {
  const translated = t(key);
  return translated && translated !== key ? translated : fallback;
};

const buildClusters = (rows, t, onZoomTo, style) => {
  const counts = rows.map((r) => Number(r?.c) || 0);
  // reduce, not Math.max(...counts): the bucket cap is in the thousands and spreading that many
  // arguments sits needlessly close to the engine's argument limit.
  const maxCount = counts.reduce((m, c) => (c > m ? c : m), 1);
  const color = scaleQuantile().domain(counts).range(style.clusterColors);

  const markers = [];
  rows.forEach((row) => {
    const lat = num(row?.lat);
    const lon = num(row?.lon);
    if (lat === null || lon === null) return;
    const count = Number(row?.c) || 0;
    const members = Number(row?.m) || 0;

    const marker = L.circleMarker([lat, lon], {
      // sqrt so area tracks the count. Scaling radius linearly makes a 10x bucket look 100x,
      // which misreads the data rather than merely looking wrong.
      radius: style.clusterMinRadius + (style.clusterMaxRadius - style.clusterMinRadius) * Math.sqrt(count / maxCount),
      fillColor: color(count),
      fillOpacity: 0.78,
      color: "#FFFFFF",
      weight: 1,
    });

    marker.bindTooltip(
      `<table class="digit-leaflet-tooltip-table">` +
        `<tr><td class="digit-leaflet-tooltip-label">${labelFor(t, "DSS_MAP_HOUSEHOLDS", "Households")}</td>` +
        `<td class="digit-leaflet-tooltip-value">${count.toLocaleString()}</td></tr>` +
        (members
          ? `<tr><td class="digit-leaflet-tooltip-label">${labelFor(t, "DSS_MAP_MEMBERS", "Members")}</td>` +
            `<td class="digit-leaflet-tooltip-value">${members.toLocaleString()}</td></tr>`
          : "") +
        `</table>`,
      { sticky: true, className: "digit-leaflet-tooltip" }
    );

    // A bucket is a grid cell, not an administrative unit, so there is no boundary to select.
    // Zooming in is the only meaningful drill, and it is also what eventually flips the layer
    // over to individual households.
    marker.on("click", () => onZoomTo(lat, lon));
    markers.push(marker);
  });
  return markers;
};

// Both point builders show the same readout; only the mark differs.
const pointTooltip = (row, t) => {
  const members = Number(row?.m) || 0;
  const title = row?.name || row?.id || labelFor(t, "DSS_MAP_HOUSEHOLD", "Household");
  return (
    `<strong>${title}</strong>` +
    (members
      ? `<table class="digit-leaflet-tooltip-table">` +
        `<tr><td class="digit-leaflet-tooltip-label">${labelFor(t, "DSS_MAP_MEMBERS", "Members")}</td>` +
        `<td class="digit-leaflet-tooltip-value">${members.toLocaleString()}</td></tr></table>`
      : "")
  );
};

/**
 * Individual points as icons — a DOM marker per row, so only reached for sparse layers.
 *
 * One L.divIcon instance is shared by every marker: Leaflet calls createIcon() per marker and
 * keeps no per-marker state on it, so building thousands of identical icon objects would be
 * pure waste.
 */
const buildIconPoints = (rows, t, style) => {
  const { shape, iconSize } = style;
  const icon = L.divIcon({
    html: iconSvg(shape, iconSize, style.pointColor),
    // Cleared in CSS — L.divIcon otherwise ships a white box and a border around the glyph.
    className: "digit-leaflet-point-icon",
    iconSize: [iconSize, iconSize],
    iconAnchor: POINT_SHAPES[shape].anchorBottom ? [iconSize / 2, iconSize] : [iconSize / 2, iconSize / 2],
  });

  const markers = [];
  rows.forEach((row) => {
    const lat = num(row?.lat);
    const lon = num(row?.lon);
    if (lat === null || lon === null) return;
    const marker = L.marker([lat, lon], { icon, keyboard: false });
    marker.bindTooltip(pointTooltip(row, t), { sticky: true, className: "digit-leaflet-tooltip" });
    markers.push(marker);
  });
  return markers;
};

const buildPoints = (rows, t, style) => {
  const markers = [];
  rows.forEach((row) => {
    const lat = num(row?.lat);
    const lon = num(row?.lon);
    if (lat === null || lon === null) return;

    const marker = L.circleMarker([lat, lon], {
      radius: style.pointRadius,
      fillColor: style.pointColor,
      fillOpacity: 0.85,
      color: "#FFFFFF",
      weight: 1,
    });

    marker.bindTooltip(pointTooltip(row, t), { sticky: true, className: "digit-leaflet-tooltip" });
    markers.push(marker);
  });
  return markers;
};

/**
 * Draws the point layer imperatively onto an existing Leaflet map.
 *
 * Rendering these through React — one component per row — would put thousands of nodes through
 * reconciliation on every pan, which is the exact cost the server-side bucketing exists to avoid.
 * Leaflet re-projects the canvas itself as the map moves, so this only re-runs when the data
 * changes, never on pan or zoom.
 *
 * The markers pass no `renderer` and no `pane`, so they land in the map's own canvas alongside
 * the choropleth. That is deliberate: a second canvas on a higher pane covers the whole viewport
 * and swallows every pointer event, leaving the polygons beneath unhoverable. Sharing one
 * renderer lets Leaflet's own hit-testing pick the topmost path under the cursor — a marker where
 * there is one, the polygon otherwise. Draw order decides "topmost", hence bringToFront below.
 *
 * @returns {Function} bringToFront — re-raises the markers above a rebuilt choropleth.
 */
export const useMapPointsLayer = (mapRef, rendering, { maxZoom, t, language, style, enabled }) => {
  const layerRef = useRef(null);
  // i18n runs with bindI18nStore: "added", so every localisation bundle that lands hands
  // useTranslation a brand-new `t`. Depending on that identity here tore down and rebuilt
  // every marker — thousands of them — each time one arrived. The ref keeps tooltip text
  // current, and `language` decides when a rebuild is actually owed: it only moves on a real
  // language switch, which is the one case where already-built tooltip HTML is stale.
  const tRef = useRef(t);
  tRef.current = t;

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return undefined;

    if (layerRef.current) {
      layerRef.current.remove();
      layerRef.current = null;
    }
    if (!enabled || !rendering?.rows?.length) return undefined;

    const zoomTo = (lat, lon) => map.setView([lat, lon], Math.min(map.getZoom() + 2, maxZoom));
    // Reads through the ref, so the builders always see the live `t` without it being a dep.
    const translate = (key) => tRef.current(key);
    // Clusters are always circles — their area is the encoding. Icons are offered for the
    // individual-point rendering, and only while the row count keeps DOM markers affordable.
    const useIcons =
      rendering.kind === "points" && style.shape !== "circle" && rendering.rows.length <= MAX_ICON_MARKERS;
    if (rendering.kind === "points" && style.shape !== "circle" && !useIcons) {
      console.warn(
        `[map] ${rendering.rows.length} points exceeds the ${MAX_ICON_MARKERS}-marker icon budget; drawing circles instead.`
      );
    }

    let markers;
    if (rendering.kind !== "points") markers = buildClusters(rendering.rows, translate, zoomTo, style);
    else if (useIcons) markers = buildIconPoints(rendering.rows, translate, style);
    else markers = buildPoints(rendering.rows, translate, style);

    if (!markers.length) return undefined;
    layerRef.current = L.layerGroup(markers).addTo(map);

    // Deliberately no fitBounds: the GeoJSON layer owns the viewport, and in viewport mode
    // refitting on every fetch would fight the pan the user just made.
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rendering, enabled, maxZoom, language, style]);

  // Unmount cleanup — the map instance outlives individual renderings.
  useEffect(
    () => () => {
      if (layerRef.current) {
        layerRef.current.remove();
        layerRef.current = null;
      }
    },
    []
  );

  // Rebuilding the choropleth appends its polygons after the markers in the shared renderer,
  // which would both paint over them and steal their hover. The caller re-raises the markers
  // once the new layer is in. Stable identity so it can be called from an effect safely.
  return useCallback(() => {
    layerRef.current?.eachLayer((marker) => marker.bringToFront?.());
  }, []);
};
