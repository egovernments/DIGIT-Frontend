import React, { memo, useEffect, useRef, useState, Fragment } from "react";
import L from "leaflet";
import proj4 from "proj4";
import "leaflet/dist/leaflet.css";
import { Card, Button ,Dropdown ,Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import * as DigitSvgs from "@egovernments/digit-ui-svg-components";
import BoundaryFilter from "./BoundaryFilter";
import MapFilterIndex from "./MapFilterIndex";
import CustomScaleControl from "./CustomScaleControl"; 
import BaseMapSwitcher from "./BaseMapSwitcher";
import { jsonReader } from "../utils/jsonReader";
import { Header } from "@egovernments/digit-ui-react-components";

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

const ViewMap = ({filterOptions}) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [filterSelections, setFilterSelections] = useState([]);
  const [baseMaps, setBaseMaps] = useState({});
  const [showBaseMapSelector, setShowBaseMapSelector] = useState(false);
  const [selectedBaseMap, setSelectedBaseMap] = useState({});
  const [selectedBaseMapName, setSelectedBaseMapName] = useState("");
  const basemapRef = useRef();
  const mapRef = useRef(null);
  var [map, setMap] = useState(null);
  var [_mapNode, set__mapNode] = useState("map");
  const [loader, setLoader] = useState(false);
  const [geoJsonData , setGeoJsonData] = useState();
  const [selectedBoundary , setSelectedBoundary] = useState();
  const [showToast, setShowToast] = useState(null);
  const EPSG_3857 = "EPSG:3857";
  const EPSG_4326 = "EPSG:4326";
  // Effect to initialize map when data is fetched
  useEffect(() => {
    const BaseMapLayers = [
      {
        name: "Street Map",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        minZoom: 1,
        maxZoom: 20,
        attribution: "&copy; OpenStreetMap contributors",
      },
      {
        name: "Satellite",
        url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        minZoom: 1,
        maxZoom: 20,
        attribution: "&copy; OpenTopoMap",
      },
      {
        name: "Topography",
        url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        minZoom: 1,
        maxZoom: 20,
        attribution: "&copy; OpenTopoMap contributors",
      },
      {
        name: "Light Theme",
        url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        minZoom: 1,
        maxZoom: 20,
        attribution: "&copy; CARTO",
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

  // Function to initialize map
  const init = (id, defaultBaseMap) => {
    if (mapRef.current) return;

    let mapConfig = {
      center: [0, 0],
      zoomControl: false,
      zoom: 3,
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
  };

  const isValidGeoJSON = (geoJson) => {
    try {
        if (geoJson?.type === "FeatureCollection" || geoJson?.type === "GeometryCollection") {
            return true;
      }
      throw new Error("Invalid GeoJSON structure");
    } catch (error) {
      console.error("GeoJSON validation error:", error);
      return false;
    }
  };

useEffect(() => {
    if (map && geoJsonData) {
    //   removeAllLayers(map);
  
      // Validate GeoJSON data before adding to the map
      if (isValidGeoJSON(geoJsonData)) {
        try {
          const geoJsonLayer = L.geoJSON(geoJsonData).addTo(map);
          const bounds = geoJsonLayer.getBounds();
  
          if (bounds?.isValid()) {
            const southWest = proj4(EPSG_3857, EPSG_4326, [
              bounds._southWest.lng,
              bounds._southWest.lat,
            ]);
            const northEast = proj4(EPSG_3857, EPSG_4326, [
              bounds._northEast.lng,
              bounds._northEast.lat,
            ]);
  
            map.fitBounds([
              [southWest[1], southWest[0]],
              [northEast[1], northEast[0]],
            ]);
          }
        } catch (e) {
          console.error("Failed to add GeoJSON layer", e);
          setShowToast({ label: t("INVALID_GEOJSON_FILE"), isError: "error" });
        }
      } else {
        setShowToast({ label: t("INVALID_GEOJSON_FILE"), isError: "error" });
      }
    }
  }, [map, geoJsonData, selectedBaseMap]);
  

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    // Fetch the GeoJSON data from the URL
  
    const fetchGeoJson = async () => {
      if (filterOptions) {

        let boundaryKey;

        if (selectedBoundary) {
          // Use the selected boundary type if provided
          boundaryKey = filterOptions[selectedBoundary];
        } else {
          // Dynamically determine the "country" boundary by fetching the first valid key
          const countryBoundary = Object.entries(filterOptions).find(
            ([key, value]) => Array.isArray(value) && value.length > 0
          );
          boundaryKey = countryBoundary ? countryBoundary[1] : null;
        }
        if (boundaryKey && boundaryKey.length > 0) {
          const data = await jsonReader({ fileStoreId: boundaryKey[0] }); 
          setGeoJsonData(data);
        } else {
          console.warn(`No data found for ${selectedBoundary}`);
        }
      }
    };
  
    fetchGeoJson();
  }, [filterOptions, selectedBoundary]);

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

  const handleBoundarySelect = (value) =>{
    setSelectedBoundary(value);
  }

  return (
    <>
      <Card className="mapping-body-container" style={{ margin: "0", padding: "0" }}>
        <Card className="map-container-main">
          <BoundaryFilter
          t={t}
          filterOptions = {filterOptions}
          onSelectBoundary={(value) => {
            handleBoundarySelect(value?.boundaryType);
          }}
          />
          <div ref={set__mapNode} className="map" id="map" style={{ height: "80vh", width: "100%", display: "inline-block", zIndex: "20" }}>
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
              {filterSelections && filterSelections.length > 0 && (
                <MapFilterIndex filterSelections={filterSelections} MapFilters={MapFilters} t={t} />
              )}
            </div>
          </div>
        </Card>
      </Card>
      {showToast && <Toast label={showToast.label} type={showToast.isError} onClose={() => setShowToast(null)} />}
    </>
  );
};

export default ViewMap;