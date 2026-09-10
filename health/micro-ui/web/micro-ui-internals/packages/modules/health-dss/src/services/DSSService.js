import axios from "axios";

const S3_BASE = "https://central-instance-assets.s3.af-south-1.amazonaws.com";
// Mounted in example/src/setupProxy.js. S3 sends no CORS headers for this bucket, so on
// localhost the request has to go through the dev server instead of straight at the bucket.
const S3_PROXY_PATH = "/map-config-assets";

// Codes are compared with case and separators ignored: MDMS entries are hand-maintained, and
// "ADMIN_NI_01_KADUNA", "admin-ni-01-kaduna" and "Admin Ni 01 Kaduna" all mean the same boundary.
const normaliseCode = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

export const DSSService = {
  /**
   * Finds a boundary's GeoJSON url in MDMS map-config.GeoJsonMapping.
   *
   * Matched on the boundary CODE. Older mapping entries are keyed on the boundary NAME
   * instead, so the last attempt is a normalised compare that catches both — a name-keyed
   * tenant keeps working while its mapping is migrated to codes.
   */
  resolveGeoJsonUrl: (geoJsonConfig, selector) => {
    const mappings = geoJsonConfig?.MdmsRes?.["map-config"]?.GeoJsonMapping;
    if (!selector || !Array.isArray(mappings) || !mappings.length) return null;

    const target = normaliseCode(selector);
    const hit =
      // Exact first, so a mapping that distinguishes two codes only by case still wins.
      mappings.find((m) => m?.code === selector) ||
      mappings.find((m) => normaliseCode(m?.code) === target);

    if (!hit?.url) {
      console.warn(`[geojson] no map-config.GeoJsonMapping entry for "${selector}"`);
      return null;
    }
    return hit.url;
  },


  // The map reads mapData.geoJSON, but a bucket may hold either the wrapped object or a bare
  // FeatureCollection. Accept both rather than making the upload format load-bearing.
  normaliseGeoJsonPayload: (data) => {
    if (!data) return {};
    if (data.geoJSON) return data;
    if (data.type === "FeatureCollection" || data.type === "Feature") return { geoJSON: data };
    return data;
  },

  getDashboardGeoJsonConfig: async (url) => {
    // No mapping for this boundary — don't fire a request at an undefined URL
    if (!url) return {};
    try {
      const response = await axios.get(url);
      return DSSService.normaliseGeoJsonPayload(response?.data);
    } catch (error) {
      console.warn(`[geojson] failed to load ${url}`, error?.message);
      return {};
    }
  },
};
