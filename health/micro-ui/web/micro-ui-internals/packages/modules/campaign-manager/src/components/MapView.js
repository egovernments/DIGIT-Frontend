import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapView = ({ fileData }) => {
  const mapRef = useRef(null);
  const [geoJsonData, setGeoJsonData] = useState(null);

  // Define layers for different map views
  const layers = {
    "Street Map": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }),
    "Satellite": L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenTopoMap',
    }),
    "Topography": L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenTopoMap contributors',
    }),
    "Light Theme": L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; CARTO',
    }),
  };

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
    // Initialize the map only once
    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        center: [-12.5, 37.8],
        zoom: 6,
        layers: [layers["Street Map"]], // Set the default layer
      });

      L.control.layers(layers, null, { position: "topright" }).addTo(mapRef.current);


      // Add zoom control to the map
      L.control.zoom({
        position: "bottomleft", // Position of zoom buttons
      }).addTo(mapRef.current);
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

      geoJsonLayer.addTo(mapRef.current);
      mapRef.current.fitBounds(geoJsonLayer.getBounds());
    };

    if (geoJsonData) {
      // Clear previous GeoJSON layers before adding new data
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.GeoJSON) {
          mapRef.current.removeLayer(layer);
        }
      });

      addGeoJsonLayer(geoJsonData);
    }
  }, [geoJsonData]);

  return (
    <div>
      <div id="map" style={{ height: "100vh", width: "100%" , display: "inline-block" }}></div>
    </div>
  );
};

export default MapView;
