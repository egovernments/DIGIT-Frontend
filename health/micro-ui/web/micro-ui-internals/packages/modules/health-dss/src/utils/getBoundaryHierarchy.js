const DEFAULT_BOUNDARY_DEPTH = 4;

// The legacy "level-N" vocabulary is confined to toLevelMap below; this array is the
// representation the maps tab actually works with.
const LEVEL_WORDS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

/**
 * Ordered root -> leaf list of boundary types, derived from the
 * boundary-hierarchy-definition response. That payload is an unordered edge list where
 * the root is the entry with parentBoundaryType: null.
 *
 * Original casing is preserved: boundary-relationships matches boundaryType on it.
 * `active` is ignored, matching processBoundaryHierarchy in ViewDashboard — excluding an
 * inactive middle level would orphan everything beneath it.
 *
 * @returns e.g. ["Country", "State", "LGA", "Ward", "Health Facility", "Community"]
 */
export const orderBoundaryHierarchy = (boundaryHierarchy) => {
  if (!Array.isArray(boundaryHierarchy) || !boundaryHierarchy.length) return [];

  const childByParent = new Map();
  boundaryHierarchy.forEach(({ boundaryType, parentBoundaryType }) => {
    if (boundaryType && parentBoundaryType) {
      childByParent.set(parentBoundaryType.toLowerCase(), boundaryType);
    }
  });

  const root = boundaryHierarchy.find((item) => item?.boundaryType && !item?.parentBoundaryType)?.boundaryType;
  if (!root) return [];

  // Bounded by the input length so a malformed cyclic hierarchy cannot spin forever.
  const ordered = [];
  let current = root;
  while (current && ordered.length < boundaryHierarchy.length) {
    ordered.push(current);
    current = childByParent.get(current.toLowerCase());
  }
  return ordered;
};

/**
 * How deep the maps tab fetches boundaries and offers dropdowns. Set at deployment time
 * via the hosted globalConfigs.js; absent or unusable values fall back to DEFAULT_BOUNDARY_DEPTH,
 * and the result is clamped so a stale config can never exceed the real hierarchy.
 */
export const getBoundaryDepth = (hierarchy) => {
  const configured = Number(window?.globalConfigs?.getConfig("DSS_MAPS_BOUNDARY_DEPTH"));
  const depth = Number.isFinite(configured) && configured > 0 ? Math.floor(configured) : DEFAULT_BOUNDARY_DEPTH;
  return Math.min(depth, hierarchy?.length || 0);
};

/**
 * Adapter for the older map charts (Map.js, LatLongMap.js, HeatMapChart.js, StackedTable.js,
 * ...) which still read the { boundaryType: "level-N" } shape from session storage.
 * Keeping this derived from the ordered array means nobody hand-authors those strings.
 */
export const toLevelMap = (hierarchy) =>
  (hierarchy || []).reduce((acc, boundaryType, index) => {
    if (index < LEVEL_WORDS.length) acc[boundaryType.toLowerCase()] = `level-${LEVEL_WORDS[index]}`;
    return acc;
  }, {});
