export const LOCALITY = "Locality";

export const EXCEL = "Excel";

export const GEOJSON = "GeoJSON";

export const SHAPEFILE = "Shapefile";

export const commonColumn = "boundaryCode";

export const ACCEPT_HEADERS = {
  GeoJSON: "application/geo+json",
  Shapefile: "application/shapefile",
  Excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

// Define the colors of the gradient for choropleth mapping
export const colors = [
  { percent: 0, color: "#edd1cf" },
  { percent: 100, color: "#b52626" },
];
