// Importing necessary modules
import { CustomDropdown, Dropdown, MultiSelectDropdown, TreeSelect } from "@egovernments/digit-ui-components";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Mapping component definition
const Mapping = ({
  campaignType = "SMC",
  microplanData,
  setMicroplanData,
  checkDataCompletion,
  setCheckDataCompletion,
  currentPage,
  pages,
  ...props
}) => {
  // Fetching data using custom MDMS hook
  const { isLoading, data } = Digit.Hooks.useCustomMDMS("mz", "hcm-microplanning", [{ name: "BaseMapLayers" }]);

  // Setting up state variables
  const [editable, setEditable] = useState(true);
  const { t } = useTranslation();
  var [map, setMap] = useState(null);
  var [_mapNode, set__mapNode] = useState("map");
  const [layers, setLayer] = useState();

  // Effect to initialize map when data is fetched
  useEffect(() => {
    if (!data) return;
    const BaseMapLayers = data["hcm-microplanning"]["BaseMapLayers"];
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
        if (!defaultBaseMap) defaultBaseMap = layer;
        baseMaps[item.name] = layer;
      }
    });
    var overlayMaps = {};
    if (!map) {
      init(_mapNode, baseMaps, overlayMaps, defaultBaseMap);
    }
  }, [data]);

  // Function to initialize map
  const init = (id, baseMaps, overlayMaps, defaultBaseMap) => {
    if (map !== null) return;

    let mapConfig = {
      center: [-24.749434, 32.961285],
      zoomControl: false,
      zoom: 8,
      scrollwheel: true,
      layers: defaultBaseMap,
    };

    let map_i = L.map(id, mapConfig);

    var customControl = L.control.layers(baseMaps, overlayMaps).addTo(map_i);
    // L.control.zoom({ position: "bottomleft" }).addTo(map_i);
    // L.control.scale({ position: "bottomleft" }).addTo(map_i);

    setMap(map_i);
  };

  // Rendering component
  return (
    <div className={`jk-header-btn-wrapper mapping-section ${editable ? "" : "non-editable-component"}`}>
      <div className="heading">
        <p>{t("MAPPING")}</p>
      </div>
      <div className="mapping-body-comtainer">
        <div className="filter-container">
          <p className="filter-heading">{t("MAPPING_FILTER_HEADING")}</p>
          <p className="instructions">{t("MAPPING_FILTER_INSTRUCTIONS")}</p>
          <div>
            <p>{t("MAPPING_FILTER_BOUNDARIES")}</p>
            <div className="dropdown">
              {/* Dropdown for boundaries */}
              <Dropdown type={"treemultiselect"} t={t} config={{}} select={() => {}} />
            </div>

            <p>{t("MAPPING_FILTER_LAYERS")}</p>
            <div className="dropdown">
              {/* Dropdown for layers */}
              <Dropdown type={"treemultiselect"} t={t} config={{}} select={() => {}} />
            </div>

            <p>{t("MAPPING_FILTER_VIRTUALISATIONS")}</p>
            <div className="dropdown">
              {/* Dropdown for virtualizations */}
              <Dropdown type={"treemultiselect"} t={t} config={{}} select={() => {}} />
            </div>
          </div>
        </div>
        <div className="map-container">
          {/* Container for map */}
          <div ref={(node) => (_mapNode = node)} id="map" />
        </div>
      </div>
    </div>
  );
};

// Exporting Mapping component
export default Mapping;
