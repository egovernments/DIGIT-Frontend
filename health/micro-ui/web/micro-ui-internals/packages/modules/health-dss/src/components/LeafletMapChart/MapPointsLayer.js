import { useEffect, useRef } from "react";
import L from "leaflet";
import { scaleQuantile } from "d3-scale";

// Sequential ramp: density is a magnitude, not a good/bad axis, so a diverging red-green scale
// would read as a judgement it is not making. Mirrored by .digit-leaflet-cluster-legend-bar.
export const CLUSTER_COLOR_RANGE = ["#FFE9A8", "#FFD24D", "#FFA424", "#F76707", "#D9480F", "#A02C0A"];
const CLUSTER_MIN_RADIUS = 5;
const CLUSTER_MAX_RADIUS = 22;
// Individual households are all one thing, so they get one size and one colour.
const POINT_RADIUS = 4;
const POINT_COLOR = "#C84C0E";

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const buildClusters = (rows, renderer, pane, t, onZoomTo) => {
  const counts = rows.map((r) => Number(r?.c) || 0);
  // reduce, not Math.max(...counts): the bucket cap is in the thousands and spreading that many
  // arguments sits needlessly close to the engine's argument limit.
  const maxCount = counts.reduce((m, c) => (c > m ? c : m), 1);
  const color = scaleQuantile().domain(counts).range(CLUSTER_COLOR_RANGE);

  const markers = [];
  rows.forEach((row) => {
    const lat = num(row?.lat);
    const lon = num(row?.lon);
    if (lat === null || lon === null) return;
    const count = Number(row?.c) || 0;
    const members = Number(row?.m) || 0;

    const marker = L.circleMarker([lat, lon], {
      renderer,
      pane,
      // sqrt so area tracks the count. Scaling radius linearly makes a 10x bucket look 100x,
      // which misreads the data rather than merely looking wrong.
      radius: CLUSTER_MIN_RADIUS + (CLUSTER_MAX_RADIUS - CLUSTER_MIN_RADIUS) * Math.sqrt(count / maxCount),
      fillColor: color(count),
      fillOpacity: 0.78,
      color: "#FFFFFF",
      weight: 1,
    });

    marker.bindTooltip(
      `<table class="digit-leaflet-tooltip-table">` +
        `<tr><td class="digit-leaflet-tooltip-label">${t("DSS_MAP_HOUSEHOLDS")}</td>` +
        `<td class="digit-leaflet-tooltip-value">${count.toLocaleString()}</td></tr>` +
        (members
          ? `<tr><td class="digit-leaflet-tooltip-label">${t("DSS_MAP_MEMBERS")}</td>` +
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

const buildPoints = (rows, renderer, pane, t) => {
  const markers = [];
  rows.forEach((row) => {
    const lat = num(row?.lat);
    const lon = num(row?.lon);
    if (lat === null || lon === null) return;

    const marker = L.circleMarker([lat, lon], {
      renderer,
      pane,
      radius: POINT_RADIUS,
      fillColor: POINT_COLOR,
      fillOpacity: 0.85,
      color: "#FFFFFF",
      weight: 1,
    });

    const members = Number(row?.m) || 0;
    const title = row?.name || row?.id || t("DSS_MAP_HOUSEHOLD");
    marker.bindTooltip(
      `<strong>${title}</strong>` +
        (members
          ? `<table class="digit-leaflet-tooltip-table">` +
            `<tr><td class="digit-leaflet-tooltip-label">${t("DSS_MAP_MEMBERS")}</td>` +
            `<td class="digit-leaflet-tooltip-value">${members.toLocaleString()}</td></tr></table>`
          : ""),
      { sticky: true, className: "digit-leaflet-tooltip" }
    );
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
 */
export const useMapPointsLayer = (mapRef, rendering, { pane, maxZoom, t, enabled }) => {
  const layerRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return undefined;

    if (layerRef.current) {
      layerRef.current.remove();
      layerRef.current = null;
    }
    if (!enabled || !rendering?.rows?.length) return undefined;

    if (!rendererRef.current) {
      rendererRef.current = L.canvas({ pane, padding: 0.5 });
    }

    const zoomTo = (lat, lon) => map.setView([lat, lon], Math.min(map.getZoom() + 2, maxZoom));
    const markers =
      rendering.kind === "points"
        ? buildPoints(rendering.rows, rendererRef.current, pane, t)
        : buildClusters(rendering.rows, rendererRef.current, pane, t, zoomTo);

    if (!markers.length) return undefined;
    layerRef.current = L.layerGroup(markers).addTo(map);

    // Deliberately no fitBounds: the GeoJSON layer owns the viewport, and in viewport mode
    // refitting on every fetch would fight the pan the user just made.
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rendering, enabled, pane, maxZoom, t]);

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
};
