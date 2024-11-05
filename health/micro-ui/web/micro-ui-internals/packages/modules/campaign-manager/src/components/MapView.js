import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapView = ({ fileData }) => {
  const mapRef = useRef(null);
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    // Fetch the GeoJSON data from the URL
    const fetchGeoJson = async () => {
      try {
        const response = await fetch(fileData.url);
        const data = await response.json();
        setGeoJsonData(data);
      } catch (error) {
        console.error("Error fetching GeoJSON data:", error);
      }
    };

    fetchGeoJson();
  }, [fileData.url]);

  useEffect(() => {
    if (mapRef.current === null) {
      // Initialize the map only once
      mapRef.current = L.map("map", {
        center: [-12.5, 37.8], // Center on Mozambique's approximate location
        zoom: 6,
        zoomControl: true,
        layers: [
          // L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          // }),
        ],
      });
    }

    // Function to add GeoJSON data to the map
    const addGeoJsonLayer = (data) => {
      const geoJsonLayer = L.geoJSON(data, {
        style: {
          color: "#3388ff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.3,
        },
        onEachFeature: (feature, layer) => {
          const { district_name, population_1 } = feature.properties;
          layer.bindPopup(
            `<strong>District:</strong> ${district_name}<br/><strong>Population:</strong> ${population_1}`
          );
        },
      });

      // Add the GeoJSON layer to the map
      geoJsonLayer.addTo(mapRef.current);

      // Fit the map bounds to the district coordinates
      const bounds = geoJsonLayer.getBounds();
      mapRef.current.fitBounds(bounds);
    };

    // Add GeoJSON layer if data is available
    if (geoJsonData) {
      // Remove any existing GeoJSON layers before adding new data
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.GeoJSON) {
          mapRef.current.removeLayer(layer);
        }
      });

      addGeoJsonLayer(geoJsonData);
    }
  }, [geoJsonData]);

  return <div id="map" style={{ height: "100vh", width: "100%" }}></div>;
};

export default MapView;
