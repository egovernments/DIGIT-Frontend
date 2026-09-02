import { useEffect, useRef, useState } from "react";
import L from "leaflet";

// Web-mercator tile edge in degrees of longitude at a given geotile precision.
const TILE_COUNT = (precision) => Math.pow(2, precision);

const DEFAULT_SCALING = { mode: "boundary", precision: 11 };

// Nullish coalescing survives untranspiled into the "modern" bundle, which the app's webpack
// cannot parse. A plain || is not a substitute here: hitsCap 0 is how boundary mode asks for no
// raw documents, and || would silently turn that into 2000.
const orDefault = (value, fallback) => (value === undefined || value === null ? fallback : value);
const DEBOUNCE_MS = 250;
// geotile_grid tops out here; beyond ~22 a cell is smaller than GPS error anyway.
const MAX_GEOTILE_PRECISION = 29;

/**
 * Snaps a viewport to whole geotile cells at the given precision.
 *
 * Two viewports a few metres apart snap to the same rectangle, so the react-query key is
 * unchanged and a small pan costs nothing. Padding is applied first, in tiles, so the fetched
 * region extends past the screen and ordinary panning never leaves it.
 */
const snapBounds = (bounds, precision, padding) => {
  const n = TILE_COUNT(precision);
  const lonToX = (lon) => ((lon + 180) / 360) * n;
  const latToY = (lat) => {
    const clamped = Math.max(-85.05112878, Math.min(85.05112878, lat));
    const rad = (clamped * Math.PI) / 180;
    return ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n;
  };
  const xToLon = (x) => (x / n) * 360 - 180;
  const yToLat = (y) => {
    const m = Math.PI - (2 * Math.PI * y) / n;
    return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(m) - Math.exp(-m)));
  };

  let x0 = lonToX(bounds.getWest());
  let x1 = lonToX(bounds.getEast());
  let y0 = latToY(bounds.getNorth());
  let y1 = latToY(bounds.getSouth());

  const padX = ((x1 - x0) * (padding - 1)) / 2;
  const padY = ((y1 - y0) * (padding - 1)) / 2;
  x0 = Math.floor(x0 - padX);
  x1 = Math.ceil(x1 + padX);
  y0 = Math.floor(y0 - padY);
  y1 = Math.ceil(y1 + padY);

  return {
    bboxTopLat: yToLat(Math.max(0, y0)),
    bboxTopLon: xToLon(Math.max(0, x0)),
    bboxBotLat: yToLat(Math.min(n, y1)),
    bboxBotLon: xToLon(Math.min(n, x1)),
  };
};

/**
 * Resolves the request parameters for the point layer.
 *
 * Two modes, chosen per drill depth by the chart's `scaling` array:
 *
 *   boundary  – bbox is the whole world and precision is fixed. Zoom and pan are not inputs,
 *               so panning around a province never refetches.
 *   viewport  – precision follows the zoom and the bbox follows the screen. A refetch happens
 *               only when the viewport leaves the padded region already fetched, or when the
 *               precision step changes; both are checked before anything is requested.
 *
 * Returned params are merged into the chart API `filters`, where the backend picks up only the
 * ones the chart declares under queryParams.
 */
export const useMapPoints = ({ map, scaling, chainIndex, enabled }) => {
  const [params, setParams] = useState(null);
  // The region already fetched, used to decide whether a move needs a new request at all.
  const fetchedRef = useRef(null);

  // Last entry repeats for anything deeper, so the hierarchy can grow without a code change.
  const policy = (scaling?.length ? scaling[Math.min(chainIndex, scaling.length - 1)] : null) || DEFAULT_SCALING;
  const isViewport = policy.mode === "viewport";

  // Boundary mode has no viewport inputs at all — resolve once and leave it alone.
  useEffect(() => {
    if (!enabled || isViewport) return;
    fetchedRef.current = null;
    setParams({
      precision: orDefault(policy.precision, DEFAULT_SCALING.precision),
      // 0 hits: boundary mode never plots individual documents, and asking for none keeps a
      // country-wide query from dragging back thousands of _source payloads it would discard.
      hitsCap: 0,
    });
  }, [enabled, isViewport, policy.precision]);

  useEffect(() => {
    if (!enabled || !isViewport || !map) return;

    const offset = orDefault(policy.zoomOffset, 3);
    const maxPrecision = Math.min(orDefault(policy.maxPrecision, 22), MAX_GEOTILE_PRECISION);
    const padding = orDefault(policy.bboxPadding, 1.5);
    const hitsCap = orDefault(policy.hitsCap, 2000);

    const resolve = () => {
      const precision = Math.max(1, Math.min(maxPrecision, Math.round(map.getZoom()) + offset));
      const bounds = map.getBounds();

      // The guard that makes small pans free: still inside what we already have, at the same
      // precision, so there is nothing new to ask for.
      const prev = fetchedRef.current;
      if (prev && prev.precision === precision && prev.bounds.contains(bounds)) return;

      const bbox = snapBounds(bounds, precision, padding);
      fetchedRef.current = {
        precision,
        bounds: L.latLngBounds(
          [bbox.bboxBotLat, bbox.bboxTopLon],
          [bbox.bboxTopLat, bbox.bboxBotLon]
        ),
      };
      setParams({
        precision,
        hitsCap,
        // Count only far enough to answer "more than hitsCap?" — the UI needs nothing else.
        trackTotalHitsUpTo: hitsCap + 1,
        ...bbox,
      });
    };

    let timer;
    const onMove = () => {
      clearTimeout(timer);
      timer = setTimeout(resolve, DEBOUNCE_MS);
    };

    resolve();
    map.on("moveend", onMove);
    return () => {
      clearTimeout(timer);
      map.off("moveend", onMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, isViewport, map, policy.zoomOffset, policy.maxPrecision, policy.bboxPadding, policy.hitsCap, chainIndex]);

  // Drilling to a different boundary invalidates the fetched region.
  useEffect(() => {
    fetchedRef.current = null;
  }, [chainIndex]);

  return { params, mode: policy.mode, hitsCap: isViewport ? orDefault(policy.hitsCap, 2000) : 0 };
};

/**
 * Picks what to draw from one response carrying both renderings.
 *
 * `exact` distinguishes "the total is 1,840" from "the total is at least 2,001" — ES stops
 * counting at trackTotalHitsUpTo, so an inexact total is by definition over the cap.
 */
export const selectRendering = (dataset, hitsCap) => {
  if (!dataset) return { kind: "clusters", rows: [], total: 0, truncated: false };
  const total = Number(dataset.total) || 0;
  const exact = dataset.exact !== false;
  const usePoints = hitsCap > 0 && exact && total <= hitsCap && (dataset.points?.length || 0) > 0;
  const rows = usePoints ? dataset.points : dataset.clusters || [];
  return {
    kind: usePoints ? "points" : "clusters",
    rows,
    total,
    exact,
    // geotile_grid gives no "everything else" counter, so a full bucket list is the only
    // signal that sparse cells were dropped. Saying so beats a map that looks complete.
    truncated: !usePoints && rows.length > 0 && rows.length >= (dataset.bucketCap || 4000),
  };
};
