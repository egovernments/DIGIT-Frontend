
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const isValidCoord = (v) =>
  v && typeof v.lat === "number" && typeof v.lng === "number";

const MapView = ({ visits = [] }) => {
  const mapRef = useRef(null);
  const markersRef = useRef(null); // L.LayerGroup for markers+polyline

  useEffect(() => {
    // Initialize map once
    if (!mapRef.current) {
      const initialCenter = isValidCoord(visits[0]) ? [visits[0].lat, visits[0].lng] : [0, 0];

      mapRef.current = L.map("map", {
        center: initialCenter,
        zoom: 13,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(mapRef.current);

      // layer group to hold visit markers and polyline
      markersRef.current = L.layerGroup().addTo(mapRef.current);
    }

    const map = mapRef.current;
    const layerGroup = markersRef.current;

    // Defensive: ensure layerGroup exists
    if (layerGroup && typeof layerGroup.clearLayers === "function") {
      layerGroup.clearLayers();
    }

    // Prepare valid positions
    const positions = (visits || [])
      .filter(isValidCoord)
      .map((v) => [v.lat, v.lng]);

    if (positions.length) {
      // Add markers for valid visits
      (visits || []).forEach((v, i) => {
        if (!isValidCoord(v)) return;

        const lat = Number(v.lat);
        const lng = Number(v.lng);
        const time = v && v.time ? String(v.time) : "Unknown time";

        L.marker([lat, lng])
          .bindPopup(`<b>Visit ${i + 1}</b><br/>Time: ${time}`)
          .addTo(layerGroup);
      });

      // Add polyline if more than 1 point
      if (positions.length > 1 && typeof L.polyline === "function") {
        L.polyline(positions, { color: "blue" }).addTo(layerGroup);
      }

      // Fit bounds (with small padding) only if map exists
      if (map && typeof map.fitBounds === "function") {
        try {
          map.fitBounds(positions, { padding: [30, 30] });
        } catch (err) {
          // ignore if fitBounds fails
          // console.warn("fitBounds failed", err);
        }
      }
    }

    // If container was hidden/resized, ensure leaflet recalculates
    setTimeout(() => {
      if (map && typeof map.invalidateSize === "function") {
        map.invalidateSize();
      }
    }, 100);

    // Optional cleanup: remove map entirely on unmount to free resources
    // Uncomment if you prefer full teardown on unmount
    /*
    return () => {
      if (map && typeof map.remove === "function") {
        map.remove();
        mapRef.current = null;
        markersRef.current = null;
      }
    };
    */

    // keep effect dependencies simple
  }, [visits]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div id="map" style={{ flex: 2, minHeight: "100%" }}></div>
      <div style={{ flex: 1, padding: "1rem", overflowY: "auto", background: "#fafafa" }}>
        <h3>Visits</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {(visits || []).map((v, i) => {
            const hasCoords = isValidCoord(v);
            const lat = hasCoords ? Number(v.lat).toFixed(6) : "N/A";
            const lng = hasCoords ? Number(v.lng).toFixed(6) : "N/A";
            const time = v && v.time ? String(v.time) : "Unknown time";

            return (
              <li key={i} style={{ marginBottom: "0.5rem" }}>
                <b>{i + 1}.</b> ({lat}, {lng})
                <br />
                <small>{time}</small>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default MapView;
