// Importing necessary modules
import { Button, CustomDropdown, Dropdown, MultiSelectDropdown, Toast, TreeSelect } from "@egovernments/digit-ui-components";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ZoomControl from "../../components/ZoomControl";
import CustomScaleControl from "../../components/CustomScaleControl";
import { MapLayerIcon } from "../../icons/MapLayerIcon";
import { NorthArrow } from "../../icons/NorthArrow";
import { Info } from "@egovernments/digit-ui-svg-components";
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
  const { isLoading, data } = Digit.Hooks.useCustomMDMS("mz", "hcm-microplanning", [
    { name: "BaseMapLayers" },
    { name: "Schemas" },
    { name: "UIConfiguration" },
  ]);

  // Setting up state variables
  const [editable, setEditable] = useState(true);
  const { t } = useTranslation();
  var [map, setMap] = useState(null);
  var [_mapNode, set__mapNode] = useState("map");
  const [layers, setLayer] = useState();
  const [validationSchemas, setValidationSchemas] = useState([]);
  const [filterDataOrigin, setFilterDataOrigin] = useState({});
  const [dataAvailability, setDataAvailability] = useState("true");
  const [toast, setToast] = useState();
  const [baseMaps, setBaseMaps] = useState({});
  const [selectedBaseMap, setSelectedBaseMap] = useState({});
  const [selectedBaseMapName, setSelectedBaseMapName] = useState("");
  const [showBaseMapSelector, setShowBaseMapSelector] = useState(false);

  // Effect to initialize map when data is fetched
  useEffect(() => {
    if (!data) return;
    let UIConfiguration = data["hcm-microplanning"]["UIConfiguration"];
    if (UIConfiguration) {
      const filterDataOriginList = UIConfiguration.find((item) => item.name === "mapping");
      setFilterDataOrigin(filterDataOriginList);
    }
    const BaseMapLayers = data["hcm-microplanning"]["BaseMapLayers"];
    let schemas = data["hcm-microplanning"]["Schemas"];
    if (schemas) setValidationSchemas(schemas);
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
  }, [data]);

  useEffect(() => {
    if (filterDataOrigin && Object.keys(filterDataOrigin).length !== 0) {
      extractGeoData(campaignType, microplanData, filterDataOrigin, validationSchemas, setToast, setDataAvailability, t);
    }
  }, [filterDataOrigin]);

  // change the baseMap
  useEffect(() => {});

  // Function to initialize map
  const init = (id, defaultBaseMap) => {
    if (map !== null) return;

    let mapConfig = {
      center: [-23.799434, 33.561285],
      zoomControl: false,
      zoom: 6,
      scrollwheel: true,
    };

    let map_i = L.map(id, mapConfig);
    var verticalBounds = L.latLngBounds(
      L.latLng(-90, -180), 
      L.latLng(85, 180) 
    );
    map_i.on("drag", function () {
      map_i.panInsideBounds(verticalBounds, { animate: false });
    });
    const defaultBaseLayer = defaultBaseMap?.layer.addTo(map_i);
    setSelectedBaseMap(defaultBaseLayer);
    setMap(map_i);
  };

  const handleBaseMapToggle = (newBaseMap) => {
    if (map) {
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
    }
  };

  // Rendering component
  return (
    <div className={`jk-header-btn-wrapper mapping-section ${editable ? "" : "non-editable-component"}`}>
      <div className="heading">
        <p>{t("MAPPING")}</p>
      </div>
      <div className="mapping-body-container">
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

            <div className="filter-controllers">
              <Button variation={"secondary"} className={"button-secondary"} label={t("CLEAR_ALL")} />
              <Button className={"button-primary"} label={t("FILTER")} />
            </div>
          </div>
        </div>
        <div className="map-container">
          {/* Container for map */}
          <div ref={(node) => (_mapNode = node)} className="map" id="map">
            <div className="top-right-map-subcomponents">
              <div className="icon-first">
                <BaseMapSwitcher
                  baseMaps={baseMaps}
                  showBaseMapSelector={showBaseMapSelector}
                  setShowBaseMapSelector={setShowBaseMapSelector}
                  handleBaseMapToggle={handleBaseMapToggle}
                  selectedBaseMapName={selectedBaseMapName}
                  t={t}
                />
              </div>
              <div className="icon-rest">
                <Info width={"1.667rem"} height={"1.667rem"} fill={"rgba(255, 255, 255, 1)"} />
              </div>
            </div>
            <div className="bottom-left-map-subcomponents">
              <ZoomControl map={map} t={t} />
              <div className="north-arrow">
                <NorthArrow width={"2.5rem"} height={"2.5rem"} fill={"rgba(255, 255, 255, 1)"} />
              </div>
              <CustomScaleControl map={map} />
            </div>
          </div>
        </div>
      </div>
      {toast && toast.state === "error" && (
        <Toast style={{ bottom: "5.5rem", zIndex: "9999999" }} label={toast.message} isDleteBtn onClose={() => setToast(null)} error />
      )}
    </div>
  );
};

const BaseMapSwitcher = ({ baseMaps, showBaseMapSelector, setShowBaseMapSelector, handleBaseMapToggle, selectedBaseMapName, t }) => {
  if (!baseMaps) return null;

  return (
    <div className="base-map-selector">
      <div className="icon-first" onClick={() => setShowBaseMapSelector((previous) => !previous)}>
        <MapLayerIcon width={"1.667rem"} height={"1.667rem"} fill={"rgba(255, 255, 255, 1)"} />
      </div>
      <div className="base-map-area-wrapper">
        {showBaseMapSelector && (
          <div className="base-map-area">
            {Object.entries(baseMaps).map(([name, baseMap], index) => {
              return (
                <div key={index} className={`base-map-entity ${name == selectedBaseMapName ? "selected" : ""}`}>
                  <img
                    className="base-map-img"
                    key={index}
                    src={generatePreviewUrl(baseMap?.metadata?.url, [-24.749434, 32.961285], 5)}
                    alt={name}
                    onClick={() => handleBaseMapToggle(name)}
                  />
                  <p>{t(name)}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const generatePreviewUrl = (baseMapUrl, center = [0, 0], zoom = 5) => {
  const lon = Math.floor(((center[1] + 180) / 360) * Math.pow(2, zoom));
  const lat = Math.floor(
    ((1 - Math.log(Math.tan((center[0] * Math.PI) / 180) + 1 / Math.cos((center[0] * Math.PI) / 180)) / Math.PI) / 2) * Math.pow(2, zoom)
  );
  if (baseMapUrl) {
    return baseMapUrl.replace("{z}", zoom).replace("{x}", lat).replace("{y}", lon);
  }
  // Return a default preview URL or handle this case as needed
  return "default-preview-url.jpg"; // todo
};

// get schema for validation
const getSchema = (campaignType, type, section, schemas) => {
  return schemas.find((schema) => {
    if (!schema.campaignType) {
      return schema.type === type && schema.section === section;
    }
    return schema.campaignType === campaignType && schema.type === type && schema.section === section;
  });
};

const extractGeoData = (campaignType, microplanData, filterDataOrigin, validationSchemas, setToast, setDataAvailability, t) => {
  // Check if microplanData and its upload property exist
  if (microplanData && microplanData?.upload) {
    let files = microplanData?.upload;
    let dataAvailabilityCheck = "initialStage"; // Initialize data availability check
    // Loop through each file in the microplan upload
    for (let fileData in files) {
      // Check if the file is not part of boundary or layer data origins
      if (
        !(filterDataOrigin?.boundriesDataOrigin && filterDataOrigin?.boundriesDataOrigin.includes(fileData)) &&
        !(filterDataOrigin?.layerDataOrigin && filterDataOrigin?.layerDataOrigin.includes(fileData))
      ) {
        dataAvailabilityCheck = "false"; // Set data availability to false if file not found in data origins
      }

      // If data availability is not false, proceed with further checks
      if (dataAvailabilityCheck !== false) {
        if (files[fileData]?.error) {
          dataAvailabilityCheck =
            dataAvailabilityCheck === "partial"
              ? "partial"
              : dataAvailabilityCheck === "false" || dataAvailabilityCheck === "initialStage"
              ? "false"
              : "partial";
          continue;
        }
        if (!files[fileData]?.fileType || !files[fileData]?.section) continue; // Skip files with errors or missing properties

        // Get validation schema for the file
        let schema = getSchema(campaignType, files[fileData]?.fileType, files[fileData]?.section, validationSchemas);
        let latLngColumns = schema?.schema?.locationDataColumns || [];

        // Check if file contains latitude and longitude columns
        if (latLngColumns?.length && files[fileData]?.data) {
          if (dataAvailabilityCheck == "initialStage") dataAvailabilityCheck = "true";
          // Check file type and update data availability accordingly
          switch (files[fileData]?.fileType) {
            case "Excel": {
              let columnList = Object.values(files[fileData]?.data)[0][0];
              let check = true;
              for (let colName of latLngColumns) {
                check = check && columnList.includes(t(colName)); // Check if columns exist in the file
              }
              dataAvailabilityCheck = check
                ? dataAvailabilityCheck === "partial"
                  ? "partial"
                  : dataAvailabilityCheck === "false"
                  ? "partial"
                  : "true"
                : dataAvailabilityCheck === "partial"
                ? "partial"
                : dataAvailabilityCheck === "false"
                ? "false"
                : "partial"; // Update data availability based on column check
              break;
            }
            case "Geojson":
            case "Shapefiles":
              dataAvailabilityCheck = dataAvailabilityCheck === "partial" ? "partial" : dataAvailabilityCheck === "false" ? "partial" : "true"; // Update data availability for GeoJSON or Shapefiles
              break;
          }
        }
      }
    }

    // Set overall data availability
    setDataAvailability(dataAvailabilityCheck);

    // Combine boundary and layer data origins
    const combineList = [...filterDataOrigin?.boundriesDataOrigin, ...filterDataOrigin?.layerDataOrigin];

    // Section wise check
    if (dataAvailabilityCheck == "true") {
      let sectionWiseCheck = true;
      combineList.forEach((item) => (sectionWiseCheck = Object.keys(files).includes(item) && sectionWiseCheck));
      if (!sectionWiseCheck) dataAvailabilityCheck = "partial"; // Update data availability if section-wise check fails
    }

    // Update data availability based on conditions
    if (dataAvailabilityCheck == "initialStage" && (combineList.length === 0 || Object.keys(files).length === 0)) dataAvailabilityCheck = "false";
    switch (dataAvailabilityCheck) {
      case "false":
      case undefined:
        // Set warning toast message for no data to show
        setToast({
          state: "error",
          message: t("MAPPING_NO_DATA_TO_SHOW"),
        });
        break;
      case "partial":
        // Set warning toast message for partial data to show
        setToast({
          state: "error",
          message: t("MAPPING_PARTIAL_DATA_TO_SHOW"),
        });
        break;
    }
  } else {
    setToast({
      state: "error",
      message: t("MAPPING_NO_DATA_TO_SHOW"),
    });
  }
};

// Exporting Mapping component
export default Mapping;
