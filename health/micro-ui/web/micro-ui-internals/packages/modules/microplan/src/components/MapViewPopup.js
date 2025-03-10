import { Button, PopUp } from "@egovernments/digit-ui-components";
import React, { useEffect, useRef, useState, Fragment } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import * as DigitSvgs from "@egovernments/digit-ui-svg-components";
import CustomScaleControl from "./CustomScaleControl";
import BaseMapSwitcher from "./BaseMapSwitcher";

// Utility function to introduce a delay
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const removeAllLayers = (map) => {
  if (!map || !map._layers) {
    console.error("Map or layers are undefined");
    return;
  }

  Object.values(map._layers).forEach((layer) => {
    if (layer?.remove) {
      map.removeLayer(layer);
    }
  });
};

const ViewElement = ({ type, label }) => {
  const renderIcon = () => {
    switch (type) {
      case "Village":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="0.5" y="0.5" width="23" height="23" rx="3.5" fill="#C2C80E" stroke="#D6D5D4" />
            <path
              d="M5 18V10.5L9.5 6L14 10.5V18H10.25V14.25H8.75V18H5ZM8.75 12.75H10.25V11.25H8.75V12.75ZM15.5 18V9.88125L11.6188 6H13.7375L17 9.2625V18H15.5ZM18.5 18V8.64375L15.8563 6H17.975L20 8.025V18H18.5Z"
              fill="white"
            />
          </svg>
        );
      case "Facility":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="0.5" y="0.5" width="23" height="23" rx="3.5" fill="#C84C0E" stroke="#D6D5D4" />
            <path
              d="M5 18V10.5L9.5 6L14 10.5V18H10.25V14.25H8.75V18H5ZM8.75 12.75H10.25V11.25H8.75V12.75ZM15.5 18V9.88125L11.6188 6H13.7375L17 9.2625V18H15.5ZM18.5 18V8.64375L15.8563 6H17.975L20 8.025V18H18.5Z"
              fill="white"
            />
          </svg>
        );
    }
  };
  return (
    <div className="map-view-element-wrapper" style={{ display: "flex" }}>
      <div className="map-view-element-icon">{renderIcon()}</div>
      <div className="map-view-element-label">{label}</div>
    </div>
  );
};

const ViewMap = ({ lat, long, type }) => {
  const { t } = useTranslation();
  const [baseMaps, setBaseMaps] = useState({});
  const [showBaseMapSelector, setShowBaseMapSelector] = useState(false);
  const [selectedBaseMap, setSelectedBaseMap] = useState({});
  const [selectedBaseMapName, setSelectedBaseMapName] = useState("");
  const basemapRef = useRef();
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  var [map, setMap] = useState(null);
  var [_mapNode, set__mapNode] = useState("map");
  const [showToast, setShowToast] = useState(null);

  // Effect to initialize map
  useEffect(() => {
    // move basic basemap layers to mdms
    const BaseMapLayers = [
      {
        name: "Street Map",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        minZoom: 1,
        maxZoom: 20,
        attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
      },
      {
        name: "Satellite",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        minZoom: 1,
        maxZoom: 20,
        attribution: "Tiles &copy; <a href='https://www.esri.com/en-us/home'>Esri</a>",
      },
      {
        name: "Topography",
        url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        minZoom: 1,
        maxZoom: 20,
        attribution:
          "Map data &copy; <a href='https://www.opentopomap.org/'>OpenTopoMap</a>, " +
          "<a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
      },
      {
        name: "Light Theme",
        url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        minZoom: 1,
        maxZoom: 20,
        attribution:
          "&copy; <a href='https://carto.com/'>CARTO</a>, " +
          "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
      },
    ];
    if (!BaseMapLayers || (BaseMapLayers && BaseMapLayers.length === 0)) return;
    let baseMaps = {};
    let defaultBaseMap = undefined;
    BaseMapLayers.forEach((item) => {
      if (item.url) {
        const layer = L.tileLayer(item.url, {
          minZoom: item?.minZoom,
          maxZoom: item?.maxZoom,
          attribution: item?.attribution,
        });
        baseMaps[item?.name] = {
          metadata: item,
          layer,
        };
        if (!defaultBaseMap)
          defaultBaseMap = {
            name: item?.name,
            layer,
          };
      }
    });
    setSelectedBaseMapName(defaultBaseMap?.name);
    setBaseMaps(baseMaps);
    if (!map) {
      init(_mapNode, defaultBaseMap);
    }
  }, []);

  // custom svg icon as a marker
  const customSVGIcon = L.divIcon({
    className: "custom-marker",
    html:
      type === "Village"
        ? `
<svg xmlns="http://www.w3.org/2000/svg" width="27" height="39" viewBox="0 0 27 39" fill="none">
<path d="M13.5 0C6.05571 0 0 6.123 0 13.65C0 23.8875 13.5 39 13.5 39C13.5 39 27 23.8875 27 13.65C27 6.123 20.9443 0 13.5 0Z" fill="#C84C0E"/>
</svg>
    `
        : `
<svg xmlns="http://www.w3.org/2000/svg" width="27" height="39" viewBox="0 0 27 39" fill="none">
<path d="M13.5 0C6.05571 0 0 6.123 0 13.65C0 23.8875 13.5 39 13.5 39C13.5 39 27 23.8875 27 13.65C27 6.123 20.9443 0 13.5 0Z" fill="#42BBFF"/>
</svg>
    `,
    iconSize: [40, 40], // Adjust based on your SVG size
    iconAnchor: [20, 40], // Positioning so it aligns properly
    popupAnchor: [0, -40],
  });

  // Function to initialize map
  const init = (id, defaultBaseMap) => {
    if (mapRef.current) return;

    let mapConfig = {
      center: [lat || 0, long || 0],
      zoomControl: false,
      zoom: 12,
      scrollwheel: true,
      minZoom: 3,
    };

    let map_i = L.map(id, mapConfig);

    mapRef.current = map_i;

    // Add the zoom control manually at the bottom left
    L.control
      .zoom({
        position: "bottomleft", // Position it at the bottom left
      })
      .addTo(map_i);
    const defaultBaseLayer = defaultBaseMap?.layer.addTo(map_i);
    setSelectedBaseMap(defaultBaseLayer);
    setMap(map_i);

    addMarker(lat || 0, long || 0, map_i);
  };

  // Function to add/update marker
  const addMarker = (latitude, longitude, mapInstance) => {
    if (!mapInstance) return;

    // Remove existing marker if present
    if (markerRef.current) {
      mapInstance.removeLayer(markerRef.current);
    }

    // Create new marker
    const marker = L.marker([latitude, longitude], { draggable: false, icon: customSVGIcon })
      .bindPopup(`<b>Location</b><br>Lat: ${latitude}<br>Long: ${longitude}`)
      .openPopup();

    // Add marker to the map
    marker.addTo(mapInstance);
    markerRef.current = marker;
  };

  // Effect to update marker and recenter when lat/long changes
  useEffect(() => {
    if (map) {
      map.setView([lat, long], 12); // Recenter map
      addMarker(lat, long, map);
    }
  }, [lat, long, type]);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  const handleBaseMapToggle = (newBaseMap) => {
    const currentBaseLayer = selectedBaseMap;
    if (currentBaseLayer) {
      currentBaseLayer.remove();
    }
    const newBaseLayer = baseMaps[newBaseMap].layer.addTo(map);
    // Add the new base layer to the bottom of the layer stack
    newBaseLayer.addTo(map);

    // Update the baseLayer state
    setSelectedBaseMap(newBaseLayer);
    setSelectedBaseMapName(newBaseMap);
  };

  return (
    <>
      <Card className="mapping-body-container" style={{ margin: "0", padding: "0" }}>
        <Card className="map-container-main">
          <div ref={set__mapNode} className="map" id="map" style={{ width: "100%", display: "inline-block", zIndex: "20" }}>
            <div className="top-right-map-subcomponents">
              <div className="icon-first">
                <BaseMapSwitcher
                  baseMaps={baseMaps}
                  showBaseMapSelector={showBaseMapSelector}
                  setShowBaseMapSelector={setShowBaseMapSelector}
                  handleBaseMapToggle={handleBaseMapToggle}
                  selectedBaseMapName={selectedBaseMapName}
                  basemapRef={basemapRef}
                  t={t}
                />
              </div>
            </div>
            <div className="bottom-left-map-subcomponents">
              <div className="north-arrow">{DigitSvgs.NorthArrow && <DigitSvgs.NorthArrow width={"40px"} height={"40px"} fill={"#FFFFFF"} />}</div>
              <CustomScaleControl map={map} t={t} />
            </div>
            <div className="bottom-right-map-subcomponents">
              <ViewElement label={type} type={type} />
            </div>
          </div>
        </Card>
      </Card>
      {showToast && <Toast label={showToast.label} type={showToast.isError} onClose={() => setShowToast(null)} />}
    </>
  );
};

const MapViewPopup = ({ setShowPopup, type, bounds,heading }) => {
  const { t } = useTranslation();
  return (
    <PopUp
      className={"custom-popup-boundary"}
      type={"default"}
      heading={heading} 
      onClose={() => {
        setShowPopup(false);
      }}
      onOverlayClick={() => {
        setShowPopup(false);
      }}
      footerChildren={[
        <Button
          type={"button"}
          size={"large"}
          variation={"primary"}
          label={t("Close")}
          onClick={() => {
            setShowPopup(false);
          }}
          style={{ width: "12.5rem" }}
        />,
      ]}
      sortFooterChildren={true}
    >
      <ViewMap lat={bounds?.latitude} long={bounds?.longitude} type={type} />
    </PopUp>
  );
};

const MapViewPopupWrapper = (
  {
    type = "Village",
    bounds = { latitude: -25.953724, longitude: 32.588711 },
    buttonLabel = "ViewMap",
    buttonTitle = "ViewMap",
    popupHeading = "Village A" 
    // remove hardcoded default values after implementation
  }
) => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Button
        label={buttonLabel}
        onClick={() => {
          setShowPopup(true);
        }}
        type="button"
        title={buttonTitle}
      />
      {showPopup && (
        <MapViewPopup
          setShowPopup={setShowPopup}
          type={type}
          bounds={bounds}
          heading={popupHeading}
        />
      )}
    </>
  );
};

export default MapViewPopupWrapper;
