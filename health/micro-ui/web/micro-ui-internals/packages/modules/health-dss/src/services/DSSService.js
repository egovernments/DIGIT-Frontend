import axios from "axios";

export const DSSService = {
  getDashboardGeoJsonConfig: async (url) => {
    try {
      const response = await axios.get(url);
      return response?.data; // Properly return the response
    } catch (error) {
      return {}; // Return an empty array on error
    }
  },
};
