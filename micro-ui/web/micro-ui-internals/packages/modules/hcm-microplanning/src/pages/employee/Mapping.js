// Importing necessary modules
import { Button, CustomDropdown, Dropdown, MultiSelectDropdown, Toast, TreeSelect } from "@egovernments/digit-ui-components";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
        if (!defaultBaseMap) defaultBaseMap = layer;
        baseMaps[item.name] = layer;
      }
    });
    var overlayMaps = {};
    if (!map) {
      init(_mapNode, baseMaps, overlayMaps, defaultBaseMap);
    }
  }, [data]);

  useEffect(() => {
    if (filterDataOrigin && Object.keys(filterDataOrigin).length !== 0) {
      extractExcelGeoData(campaignType, microplanData, filterDataOrigin, validationSchemas, setToast, setDataAvailability, t);
    }
  }, [filterDataOrigin]);

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

            <div className="filter-controllers">
              <Button variation={"secondary"} className={"button-secondary"} label={t("CLEAR_ALL")} />
              <Button className={"button-primary"} label={t("FILTER")} />
            </div>
          </div>
        </div>
        <div className="map-container">
          {/* Container for map */}
          <div ref={(node) => (_mapNode = node)} className="map" id="map" />
        </div>
      </div>
      {toast && toast.state === "warning" && (
        <Toast style={{ bottom: "5.5rem", zIndex: "9999999" }} label={toast.message} isDleteBtn onClose={() => setToast(null)} error />
      )}
    </div>
  );
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

const extractExcelGeoData = (campaignType, microplanData, filterDataOrigin, validationSchemas, setToast, setDataAvailability, t) => {
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
        if (dataAvailabilityCheck == "initialStage") dataAvailabilityCheck = "true"; 
        if (files[fileData]?.error) {
          dataAvailabilityCheck = dataAvailabilityCheck === "partial" ? "partial" : dataAvailabilityCheck === "false" ? "false" : "partial";
          continue;
        }
        console.log(dataAvailabilityCheck)
        if (!files[fileData]?.fileType || !files[fileData]?.section) continue; // Skip files with errors or missing properties

        // Get validation schema for the file
        let schema = getSchema(campaignType, files[fileData]?.fileType, files[fileData]?.section, validationSchemas);
        let latLngColumns = schema?.schema?.locationDataColumns || [];

        // Check if file contains latitude and longitude columns
        if (latLngColumns?.length && files[fileData]?.data) {

          // Check file type and update data availability accordingly
          switch (files[fileData]?.fileType) {
            case "Excel": {
              let columnList = Object.values(files[fileData]?.data)[0][0];
              let check = true;
              for (let colName of latLngColumns) {
                check = check && columnList.includes(t(colName)); // Check if columns exist in the file
              }
              if (check === true)
                dataAvailabilityCheck = dataAvailabilityCheck === "partial" ? "partial" : dataAvailabilityCheck === "false" ? "partial" : "true"; // Update data availability based on column check
              if (check === false)
                dataAvailabilityCheck = dataAvailabilityCheck === "partial" ? "partial" : dataAvailabilityCheck === "false" ? "false" : "partial"; // Update data availability based on column check
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
          state: "warning",
          message: t("MAPPING_NO_DATA_TO_SHOW"),
        });
        break;
      case "partial":
        // Set warning toast message for partial data to show
        setToast({
          state: "warning",
          message: t("MAPPING_PARTIAL_DATA_TO_SHOW"),
        });
        break;
    }
  }
};


// Exporting Mapping component
export default Mapping;
