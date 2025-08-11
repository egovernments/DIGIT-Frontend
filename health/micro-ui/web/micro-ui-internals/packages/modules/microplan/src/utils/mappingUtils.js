import L from "leaflet";
import "leaflet/dist/leaflet.css";
import chroma from "chroma-js";
import * as DigitSvgs from "@egovernments/digit-ui-svg-components";
import { processHierarchyAndData, findChildren, calculateAggregateForTree } from "./processHierarchyAndData";
import { EXCEL, GEOJSON, SHAPEFILE, MapChoroplethGradientColors } from "../configs/constants";

const IconCollection = {...DigitSvgs };

// Override Leaflet's default icon to prevent 404 errors
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNCA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMjAuNTQ5IDIgMjcgOC40NTEgMjcgMTdDMjcgMzEuNSAxMiA0MSAxMiA0MUMxMiA0MSAtMyAzMS41IC0zIDE3Qy0zIDguNDUxIDMuNTUxIDIgMTIgMloiIGZpbGw9IiNGNDc3MzgiLz4KPHBhdGggZD0iTTEyIDExQzE0LjIwOTEgMTEgMTYgMTIuNzkwOSAxNiAxNUMxNiAxNy4yMDkxIDE0LjIwOTEgMTkgMTIgMTlDOS43OTA5IDE5IDggMTcuMjA5MSA4IDE1QzggMTIuNzkwOSA5Ljc5MDkgMTEgMTIgMTFaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNCA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMjAuNTQ5IDIgMjcgOC40NTEgMjcgMTdDMjcgMzEuNSAxMiA0MSAxMiA0MUMxMiA0MSAtMyAzMS41IC0zIDE3Qy0zIDguNDUxIDMuNTUxIDIgMTIgMloiIGZpbGw9IiNGNDc3MzgiLz4KPHBhdGggZD0iTTEyIDExQzE0LjIwOTEgMTEgMTYgMTIuNzkwOSAxNiAxNUMxNiAxNy4yMDkxIDE0LjIwOTEgMTkgMTIgMTlDOS43OTA5IDE5IDggMTcuMjA5MSA4IDE1QzggMTIuNzkwOSA5Ljc5MDkgMTEgMTIgMTFaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
  shadowUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDEiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA0MSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAuNSIgY3k9IjIwLjUiIHI9IjE4LjUiIGZpbGw9ImJsYWNrIiBvcGFjaXR5PSIwLjIiLz4KPC9zdmc+Cg=='
});

// Override the L.marker function to ensure all markers use custom icons
const originalMarker = L.marker;
L.marker = function(latlng, options) {
  // If no icon is specified, use our custom MapMarker
  if (!options || !options.icon) {
    options = options || {};
    options.icon = MapMarker({});
  }
  return originalMarker.call(this, latlng, options);
};

export const generatePreviewUrl = (baseMapUrl, center = [0, 0], zoom = 5) => {
  const lon = Math.floor(((center[1] + 180) / 360) * Math.pow(0, zoom));
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
export const getSchema = (campaignType, type, section, schemas) => {
  return schemas.find((schema) => {
    if (!schema.campaignType) {
      return schema.type === type && schema.section === section;
    }
    return schema.campaignType === campaignType && schema.type === type && schema.section === section;
  });
};

export const calculateAggregateForTreeMicroplanWrapper = (entity) => {
  if (!entity || typeof entity !== "object") return {};
  let newObject = {};
  for (let [key, value] of Object.entries(entity)) {
    if (!value?.["hierarchicalData"]) continue;
    let aggregatedTree = calculateAggregateForTree(value?.["hierarchicalData"]);
    newObject[key] = { ...value, hierarchicalData: aggregatedTree };
  }
  return newObject;
};

export const extractGeoData = (
  campaignType,
  microplanData,
  filterDataOrigin,
  validationSchemas,
  setToast,
  setDataAvailability,
  hierarchy,
  setBoundaryData,
  setFilterData,
  setFilterProperties,
  setFilterSelections,
  setFilterPropertyNames,
  state,
  setChoroplethProperties,
  setDataCompleteness,
  t
) => {
  if (!hierarchy) return;

  const initializeDataAvailability = (microplanData) => (microplanData?.upload ? "initialStage" : undefined);

  const checkFileActivity = (fileData) => fileData.active;

  const checkFileSection = (fileData, filterDataOrigin) =>
    filterDataOrigin?.boundriesDataOrigin?.includes(fileData?.section) || filterDataOrigin?.layerDataOrigin?.includes(fileData?.section);

  const getFileValidationSchema = (campaignType, fileData, validationSchemas) =>
    getSchema(campaignType, fileData?.fileType, fileData?.section, validationSchemas);

  const updateDataAvailabilityCheck = (dataAvailabilityCheck, condition, partialState) =>
    condition ? partialState : dataAvailabilityCheck === "initialStage" ? "false" : partialState;

  const handleFileDataError = (dataAvailabilityCheck, fileData) =>
    fileData?.error ? updateDataAvailabilityCheck(dataAvailabilityCheck, true, "partial") : dataAvailabilityCheck;

  const addResourcesToFilteredData = (data, resources, hypothesisAssumptionsList, formulaConfiguration, microplanData, t) =>
    Digit.Utils.microplan.addResourcesToFilteredDataToShow(
      data,
      resources,
      hypothesisAssumptionsList,
      formulaConfiguration,
      microplanData?.microplanPreview?.userEditedResources || [],
      t
    );

  const processFileData = (
    fileData,
    schema,
    filterDataOrigin,
    virtualizationPropertiesCollector,
    filterPropertiesCollector,
    filterPropertieNameCollector,
    resources,
    hypothesisAssumptionsList,
    formulaConfiguration,
    t
  ) => {
    const properties = Object.entries(schema?.schema?.Properties || {});
    const latLngColumns = [];
    const filterProperty = [];

    for (const [key, value] of properties) {
      if (value?.isLocationDataColumns) latLngColumns.push(t(key));
      if (filterDataOrigin?.layerDataOrigin?.includes(fileData?.section) && value?.isFilterPropertyOfMapSection) filterProperty.push(key);
      if (value?.isVisualizationPropertyOfMapSection && filterDataOrigin?.boundriesDataOrigin?.includes(fileData?.section))
        virtualizationPropertiesCollector.add(key);
    }

    filterProperty.forEach((property) => filterPropertieNameCollector.add(property));

    return { latLngColumns, filterProperty };
  };

  const processExcelFile = (fileData, latLngColumns, resources, formulaConfiguration, hypothesisAssumptionsList, schema, t) => {
    let dataAvailabilityCheck = "true";
    const columnList = Object.values(fileData?.data)?.[0]?.[0];
    const check = latLngColumns?.every((colName) => columnList?.includes(t(colName)));

    if (!check) dataAvailabilityCheck = "partial";

    let dataWithResources = Object.values(fileData?.data);
    if (resources && formulaConfiguration && hypothesisAssumptionsList && schema?.showResourcesInMappingSection) {
      dataWithResources = dataWithResources.map((item) =>
        addResourcesToFilteredData(item, resources, hypothesisAssumptionsList, formulaConfiguration, microplanData, t)
      );
    }

    const hasLocationData = dataWithResources.some((item) => item.some((row) => row.includes("lat") && row.includes("long")));

    const convertedData = dataWithResources.map((item) =>
      item.map((row, rowIndex) => {
        if (rowIndex === 0) {
          if (row.indexOf("features") === -1) row.push("feature");
          return row;
        }
        const latIndex = item[0].findIndex((cell) => cell === "lat");
        const lonIndex = item[0].findIndex((cell) => cell === "long");
        const properties = item[0].reduce((acc, cell, index) => ({ ...acc, [cell]: row[index] }), {});
        const feature =
          latIndex !== -1 && lonIndex !== -1
            ? {
                type: "Feature",
                properties,
                geometry: {
                  type: "Point",
                  coordinates: [row[lonIndex], row[latIndex]],
                },
              }
            : null;
        row.push(feature);
        return row;
      })
    );

    return { dataAvailabilityCheck, hasLocationData, convertedData };
  };

  const processGeoJsonFile = (fileData, filterProperty, resources, formulaConfiguration, hypothesisAssumptionsList, t) => {
    const dataAvailabilityCheck = "true";
    const keys = [...Object.keys(fileData?.data.features[0].properties), "feature"];
    const values = fileData?.data.features.map((feature) => keys.map((key) => (key === "feature" ? feature : feature.properties[key] || null)));

    let dataWithResources = [[...keys], ...values];
    if (resources && formulaConfiguration && hypothesisAssumptionsList) {
      dataWithResources = addResourcesToFilteredData(dataWithResources, resources, hypothesisAssumptionsList, formulaConfiguration, microplanData, t);
    }
    const processedDataWithResources = dataWithResources.map((item, index) => {
      if (index === 0) return item;
      const featureIndex = keys.length - 1;
      const newProperties = keys.concat(resources).reduce((acc, key, i) => (key !== "feature" ? { ...acc, [key]: item[i] } : acc), {});
      item[featureIndex] = { ...item[featureIndex], properties: newProperties };
      return item;
    });

    return { dataAvailabilityCheck, dataWithResources: processedDataWithResources };
  };

  const updateFilterPropertiesCollector = (fileData, filterProperty, filterPropertiesCollector) => {
    filterProperty.forEach((item) => {
      Object.values(fileData?.data).forEach((data) => {
        const filterPropertyIndex = data[0].indexOf(item);
        if (filterPropertyIndex !== -1) data.slice(1).forEach((e) => filterPropertiesCollector.add(e[filterPropertyIndex]));
      });
    });
  };

  const setAvailabilityAndToastMessages = (dataAvailabilityCheck, combineList, files, setToast, t) => {
    if (dataAvailabilityCheck === "true") {
      const sectionWiseCheck = combineList.every((item) => Object.keys(files).includes(item));
      if (!sectionWiseCheck) dataAvailabilityCheck = "partial";
    }

    if (dataAvailabilityCheck === "initialStage" && (combineList.length === 0 || Object.keys(files).length === 0)) dataAvailabilityCheck = "false";

    const toastMessages = {
      false: { state: "warning", message: t("MAPPING_NO_DATA_TO_SHOW") },
      partial: { state: "warning", message: t("MAPPING_PARTIAL_DATA_TO_SHOW") },
      undefined: { state: "error", message: t("MAPPING_NO_DATA_TO_SHOW") },
    };

    setToast(toastMessages[dataAvailabilityCheck]);
    return dataAvailabilityCheck;
  };

  const setFinalDataAndProperties = (
    dataAvailabilityCheck,
    setBoundary,
    setFilter,
    setBoundaryData,
    setFilterData,
    setFilterProperties,
    setFilterSelections,
    setFilterPropertyNames,
    filterPropertiesCollector,
    filterPropertieNameCollector,
    virtualizationPropertiesCollector,
    setChoroplethProperties,
    resources
  ) => {
    setDataCompleteness(dataAvailabilityCheck);
    setBoundary = calculateAggregateForTreeMicroplanWrapper(setBoundary);
    setFilter = calculateAggregateForTreeMicroplanWrapper(setFilter);
    setBoundaryData((previous) => ({ ...previous, ...setBoundary }));
    setFilterData((previous) => ({ ...previous, ...setFilter }));
    setFilterProperties([...filterPropertiesCollector]);
    setFilterSelections([...filterPropertiesCollector]);
    setFilterPropertyNames([...filterPropertieNameCollector]);
    const tempVirtualizationPropertiesCollectorArray = [...virtualizationPropertiesCollector];
    if (tempVirtualizationPropertiesCollectorArray.length !== 0)
      setChoroplethProperties([...tempVirtualizationPropertiesCollectorArray, ...(resources || [])]);
  };

  let setBoundary = {};
  let setFilter = {};
  const virtualizationPropertiesCollector = new Set();
  const filterPropertiesCollector = new Set();
  const filterPropertieNameCollector = new Set();
  const resources = state?.Resources?.find((item) => item.campaignType === campaignType)?.data;
  const hypothesisAssumptionsList = microplanData?.hypothesis;
  const formulaConfiguration = microplanData?.ruleEngine;

  let dataAvailabilityCheck = initializeDataAvailability(microplanData);
  if (!dataAvailabilityCheck) return setToast({ state: "error", message: t("MAPPING_NO_DATA_TO_SHOW") });

  const files = _.cloneDeep(microplanData.upload);
  for (const fileData of files) {
    if (!checkFileActivity(fileData) || !checkFileSection(fileData, filterDataOrigin)) {
      dataAvailabilityCheck = "false";
      continue;
    }

    if (!fileData?.fileType || !fileData?.section) continue;

    const schema = getFileValidationSchema(campaignType, fileData, validationSchemas);
    dataAvailabilityCheck = handleFileDataError(dataAvailabilityCheck, fileData);

    const { latLngColumns, filterProperty } = processFileData(
      fileData,
      schema,
      filterDataOrigin,
      virtualizationPropertiesCollector,
      filterPropertiesCollector,
      filterPropertieNameCollector,
      resources,
      hypothesisAssumptionsList,
      formulaConfiguration,
      t
    );

    if (fileData?.data && Object.keys(fileData?.data).length > 0) {
      switch (fileData?.fileType) {
        case EXCEL:
          const { dataAvailabilityCheck: excelDataAvailabilityCheck, hasLocationData, convertedData } = processExcelFile(
            fileData,
            latLngColumns,
            resources,
            formulaConfiguration,
            hypothesisAssumptionsList,
            schema,
            t
          );
          dataAvailabilityCheck = excelDataAvailabilityCheck;
          if (hasLocationData) updateFilterPropertiesCollector(fileData, filterProperty, filterPropertiesCollector);
          const { hierarchyLists: excelHierarchyLists, hierarchicalData: excelHierarchicalData } = processHierarchyAndData(hierarchy, convertedData);
          if (filterDataOrigin?.boundriesDataOrigin?.includes(fileData.section))
            setBoundary = { ...setBoundary, [fileData.section]: { hierarchyLists: excelHierarchyLists, hierarchicalData: excelHierarchicalData } };
          else if (filterDataOrigin?.layerDataOrigin?.includes(fileData.section))
            setFilter = { ...setFilter, [fileData.section]: { hierarchyLists: excelHierarchyLists, hierarchicalData: excelHierarchicalData } };
          break;
        case GEOJSON:
        case SHAPEFILE:
          const { dataAvailabilityCheck: geoJsonDataAvailabilityCheck, dataWithResources } = processGeoJsonFile(
            fileData,
            filterProperty,
            resources,
            formulaConfiguration,
            hypothesisAssumptionsList,
            t
          );
          dataAvailabilityCheck = geoJsonDataAvailabilityCheck;
          const { hierarchyLists: geoJsonHierarchyLists, hierarchicalData: geoJsonHierarchicalData } = processHierarchyAndData(hierarchy, [
            dataWithResources,
          ]);
          if (filterDataOrigin?.boundriesDataOrigin?.includes(fileData.section))
            setBoundary = {
              ...setBoundary,
              [fileData.section]: { hierarchyLists: geoJsonHierarchyLists, hierarchicalData: geoJsonHierarchicalData },
            };
          else if (filterDataOrigin?.layerDataOrigin?.includes(fileData.section))
            setFilter = { ...setFilter, [fileData.section]: { hierarchyLists: geoJsonHierarchyLists, hierarchicalData: geoJsonHierarchicalData } };
          break;
        default:
          break;
      }
    }
  }

  const combineList = [...(filterDataOrigin?.boundriesDataOrigin || []), ...(filterDataOrigin?.layerDataOrigin || [])];
  dataAvailabilityCheck = setAvailabilityAndToastMessages(dataAvailabilityCheck, combineList, files, setToast, t);

  setFinalDataAndProperties(
    dataAvailabilityCheck,
    setBoundary,
    setFilter,
    setBoundaryData,
    setFilterData,
    setFilterProperties,
    setFilterSelections,
    setFilterPropertyNames,
    filterPropertiesCollector,
    filterPropertieNameCollector,
    virtualizationPropertiesCollector,
    setChoroplethProperties,
    resources
  );
};

//prepare geojson to show on the map
export const prepareGeojson = (boundaryData, selection, style = {}) => {
  if (!boundaryData || Object.keys(boundaryData).length === 0) return [];
  let geojsonRawFeatures = [];
  if (selection === "ALL") {
    for (let data of Object.values(boundaryData)) {
      const templist = fetchFeatures(data?.hierarchicalData, selection, [], style);
      if (templist?.length !== 0) geojsonRawFeatures = [...geojsonRawFeatures, ...templist];
    }
  } else if (Array.isArray(selection)) {
    for (let data of Object.values(boundaryData)) {
      const templist = fetchFeatures(data?.hierarchicalData, selection, [], style);
      if (templist?.length !== 0) geojsonRawFeatures = [...geojsonRawFeatures, ...templist];
    }
  }

  return geojsonRawFeatures.filter(Boolean);
};
export const fetchFeatures = (data, parameter = "ALL", outputList = [], addOn = {}) => {
  let tempStorage = [];
  if (parameter === "ALL") {
    // outputList(Object.values(data).flatMap(item=>item?.data?.feature))
    for (let [entityKey, entityValue] of Object.entries(data)) {
      if (entityValue?.data?.feature) {
        let feature = entityValue.data.feature;
        feature.properties["name"] = entityKey;
        feature.properties["addOn"] = addOn;
        if (entityValue?.children) tempStorage = [...tempStorage, feature, ...fetchFeatures(entityValue?.children, parameter, outputList, addOn)];
        else tempStorage = [...tempStorage, feature];
      } else {
        tempStorage = [...tempStorage, ...fetchFeatures(entityValue?.children, parameter, outputList, addOn)];
      }
    }
    return tempStorage;
  }
  if (Array.isArray(parameter)) {
    for (let [entityKey, entityValue] of Object.entries(data)) {
      if (parameter.includes(entityKey) && entityValue && entityValue.data && entityValue.data.feature) {
        let feature = entityValue.data.feature;
        feature.properties["name"] = entityKey;
        feature.properties["addOn"] = addOn;
        if (entityValue?.children) tempStorage = [...tempStorage, feature, ...fetchFeatures(entityValue?.children, parameter, outputList, addOn)];
        else tempStorage = [...tempStorage, feature];
      }
      if (entityValue?.children) tempStorage = [...tempStorage, ...fetchFeatures(entityValue?.children, parameter, outputList, addOn)];
    }
    return tempStorage;
  }
};

export const addChoroplethProperties = (geojson, choroplethProperty, filteredSelection) => {
  // Calculate min and max values of the property
  const values = geojson.map((feature) => feature.properties[choroplethProperty]).filter((item) => !!item || item === 0) || [];
  if (!values || values.length === 0) return [];
  const convertedValues = values.map((item) => (!isNaN(item) ? item : 0));
  const minValue = Math.min(...convertedValues);
  const maxValue = Math.max(...convertedValues);

  // Create a new geojson object
  const newGeojson = geojson.map((feature) => {
    const newFeature = { ...feature, properties: { ...feature.properties, addOn: { ...feature.properties.addOn } } };
    let color;

    if (choroplethProperty) {
      color = interpolateColor(newFeature.properties[choroplethProperty], minValue, maxValue, MapChoroplethGradientColors);
    }

    newFeature.properties.addOn.fillColor = color;
    newFeature.properties.addOn.color = "rgba(0, 0, 0, 1)";
    if (!filteredSelection || filteredSelection.length === 0 || filteredSelection.includes(newFeature.properties.name)) {
      newFeature.properties.addOn.fillOpacity = 1;
    } else {
      newFeature.properties.addOn.fillOpacity = 0.4;
      newFeature.properties.addOn.opacity = 0.7;
    }

    return newFeature;
  });
  return newGeojson;
};

/**
 * filterGeojsons : json
 * filterSelection : array
 * MapFilters :
 */
export const addFilterProperties = (filterGeojsons, filterSelections, filterPropertyNames, iconMapping) => {
  try {
    if (!filterGeojsons || !iconMapping || !filterSelections) return [];
    let newFilterGeojson = [];
    filterGeojsons.forEach((item) => {
      if (filterPropertyNames && filterPropertyNames.length !== 0 && item.properties) {
        let icon;
        filterPropertyNames.forEach((name) => {
          if (item.properties[name]) {
            let temp = item.properties[name];
            if (!filterSelections.includes(temp)) return;
            temp = iconMapping?.find((e) => e?.name == temp)?.icon?.marker;
            
            // Create custom SVG icons based on the marker type instead of using React components
            let svgHtml;
            switch (temp) {
              case "WarehouseMarker":
                svgHtml = `
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="8" width="24" height="20" fill="#4A90E2" stroke="#FFFFFF" stroke-width="2"/>
                    <rect x="8" y="12" width="4" height="4" fill="#FFFFFF"/>
                    <rect x="20" y="12" width="4" height="4" fill="#FFFFFF"/>
                    <rect x="8" y="20" width="4" height="4" fill="#FFFFFF"/>
                    <rect x="20" y="20" width="4" height="4" fill="#FFFFFF"/>
                  </svg>
                `;
                break;
              case "ChurchMarker":
                svgHtml = `
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 4L28 16H24V28H8V16H4L16 4Z" fill="#8B4513" stroke="#FFFFFF" stroke-width="2"/>
                    <rect x="14" y="16" width="4" height="12" fill="#FFFFFF"/>
                    <circle cx="16" cy="8" r="2" fill="#FFD700"/>
                  </svg>
                `;
                break;
              default:
                // Use default marker for unknown types
                icon = DefaultMapMarker({});
                newFilterGeojson.push({ ...item, properties: { ...item?.properties, addOn: { ...item?.properties?.addOn, icon: icon } } });
                return;
            }
            
            if (svgHtml) {
              icon = L.divIcon({
                className: "custom-svg-icon",
                html: svgHtml,
                iconAnchor: [16, 32],
                iconSize: [32, 32],
              });
              newFilterGeojson.push({ ...item, properties: { ...item?.properties, addOn: { ...item?.properties?.addOn, icon: icon } } });
            }
          }
        });
      }
      return item;
    });
    return newFilterGeojson;
  } catch (error) {
    console.error(error.message);
  }
};

/**
 * map: map
 * geojson: geojson
 * t: translator
 */

export const addGeojsonToMap = (map, geojson, t) => {
  try {
    if (!map || !geojson) return false;
    const geojsonLayer = L.geoJSON(geojson, {
      style: (feature) => {
        if (Object.keys(feature.properties.addOn).length !== 0) {
          return feature.properties.addOn;
        }
        return {
          weight: 2,
          opacity: 1,
          color: "rgba(176, 176, 176, 1)",
          fillColor: "rgb(0,0,0,0)",
          // fillColor: choroplethProperty ? color : "rgb(0,0,0,0)",
          fillOpacity: 0,
          // fillOpacity: choroplethProperty ? (feature?.properties?.style?.fillOpacity ? feature.properties.style.fillOpacity : 0.7) : 0,
        };
      },
      pointToLayer: (feature, latlng) => {
        // Always use custom markers, never fall back to default Leaflet markers
        if (feature.properties.addOn && feature.properties.addOn.icon) {
          let icon = feature.properties.addOn.icon;
          if (icon) {
            return L.marker(latlng, {
              icon: icon,
            });
          }
        }
        // Use our custom MapMarker for all points
        return L.marker(latlng, {
          icon: MapMarker(feature.properties.addOn || {}),
        });
      },
      onEachFeature: (feature, layer) => {
        let popupContent;
        popupContent = "<div class='map-pop-up'>";
        popupContent += "<table style='border-collapse: collapse;'>";
        popupContent += `<div style='font-family: Roboto;font-size: 1.3rem;font-weight: 700;text-align: left; color:rgba(11, 12, 12, 1);'>${feature.properties["name"]}</div>`;
        for (let prop in feature.properties) {
          if (prop !== "name" && prop !== "addOn" && prop !== "feature") {
            let data = feature.properties[prop] ? feature.properties[prop] : t("NO_DATA");
            popupContent +=
              "<tr style='padding-top:0.5rem;'><td style='padding-top:0.5rem; font-family: Roboto;font-size: 0.8rem;font-weight: 700;text-align: left; color:rgba(80, 90, 95, 1);padding-right:1rem'>" +
              t(prop) +
              "</td><td>" +
              data +
              "</td></tr>";
          }
        }
        popupContent += "</table></div>";
        layer.bindPopup(popupContent, {
          minWidth: "28rem",
          padding: "0",
        });
        // Adjust map here when pop up closes
        layer.on("popupclose", () => {
          map.fitBounds(geojsonLayer.getBounds());
        });
        layer.on({
          mouseover: (e) => {
            const layer = e.target;
            if (layer.feature.properties.addOn && !layer.feature.properties.addOn.child) {
              return;
            }
            if (layer.setStyle)
              layer.setStyle({
                weight: 2.7,
                opacity: 1,
                color: "rgba(255, 255, 255, 1)",
              });
            // layer.openPopup();
          },
          mouseout: (e) => {
            const layer = e.target;
            if (layer.feature.properties.addOn && !layer.feature.properties.addOn.child) {
              return;
            }
            if (layer.setStyle) {
              if (layer.feature.properties.addOn && Object.keys(layer.feature.properties.addOn).length !== 0)
                layer.setStyle({
                  ...layer.feature.properties.addOn,
                });
              else
                layer.setStyle({
                  weight: 2,
                  color: "rgba(176, 176, 176, 1)",
                });
            }
            // layer.closePopup();
          },
        });
      },
    });
    geojsonLayer.addTo(map);
    return geojsonLayer;
  } catch (error) {
    console.error(error.message);
  }
};

export const interpolateColor = (value, minValue, maxValue, colors) => {
  // Handle case where min and max values are the same
  if (minValue === maxValue) {
    // Return a default color or handle the case as needed
    return colors[0].color;
  }

  // Normalize the value to a percentage between 0 and 100
  const percent = !isNaN(value) ? ((value - minValue) / (maxValue - minValue)) * 100 : 0;
  // Find the two colors to interpolate between
  let lowerColor, upperColor;
  for (let i = 0; i < colors.length - 1; i++) {
    if (!isNaN(percent) && percent >= colors[i].percent && percent <= colors[i + 1].percent) {
      lowerColor = colors[i];
      upperColor = colors[i + 1];
      break;
    }
  }
  // Interpolate between the two colors
  const t = (percent - lowerColor.percent) / (upperColor.percent - lowerColor.percent);
  return chroma.mix(lowerColor.color, upperColor.color, t, "lab").hex();
};

// Find bounds for multiple geojson together
export const findBounds = (data, buffer = 0.1) => {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  // Initialize variables to store bounds
  var minLat = Number.MAX_VALUE;
  var maxLat = -Number.MAX_VALUE;
  var minLng = Number.MAX_VALUE;
  var maxLng = -Number.MAX_VALUE;

  // Iterate through the data to find bounds
  data.forEach(function (feature) {
    if (!feature || !feature.geometry || !feature.geometry.type || !feature.geometry.coordinates) {
      return null;
    }

    var coords = feature.geometry.coordinates;
    var geometryType = feature.geometry.type;

    switch (geometryType) {
      case "Point":
        var coord = coords;
        var lat = coord[1];
        var lng = coord[0];
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
        break;
      case "MultiPoint":
        coords.forEach(function (coord) {
          var lat = coord[1];
          var lng = coord[0];
          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);
          minLng = Math.min(minLng, lng);
          maxLng = Math.max(maxLng, lng);
        });
        break;
      case "LineString":
      case "MultiLineString":
      case "Polygon":
      case "MultiPolygon":
        coords.forEach(function (polygons) {
          if ((geometryType === "Polygon" || geometryType === "MultiPolygon") && Array.isArray(polygons[0][0])) {
            polygons.forEach(function (coordinates) {
              coordinates.forEach(function (coord) {
                if (!Array.isArray(coord) || coord.length !== 2 || typeof coord[0] !== "number" || typeof coord[1] !== "number") {
                  return null;
                }

                var lat = coord[1];
                var lng = coord[0];
                minLat = Math.min(minLat, lat);
                maxLat = Math.max(maxLat, lat);
                minLng = Math.min(minLng, lng);
                maxLng = Math.max(maxLng, lng);
              });
            });
          } else {
            polygons.forEach(function (coord) {
              if (!Array.isArray(coord) || coord.length !== 2 || typeof coord[0] !== "number" || typeof coord[1] !== "number") {
                return null;
              }

              var lat = coord[1];
              var lng = coord[0];
              minLat = Math.min(minLat, lat);
              maxLat = Math.max(maxLat, lat);
              minLng = Math.min(minLng, lng);
              maxLng = Math.max(maxLng, lng);
            });
          }
        });
        break;
      default:
        return null;
    }
  });

  // Check if valid bounds found
  if (minLat === Number.MAX_VALUE || maxLat === -Number.MAX_VALUE || minLng === Number.MAX_VALUE || maxLng === -Number.MAX_VALUE) {
    return null;
  }
  // Apply buffer to bounds
  minLat -= buffer;
  maxLat += buffer;
  minLng -= buffer;
  maxLng += buffer;

  // Set bounds for the Leaflet map
  var bounds = [
    [minLat, minLng],
    [maxLat, maxLng],
  ];

  return bounds;
};

export const filterBoundarySelection = (boundaryData, boundarySelections) => {
  if (Object.keys(boundaryData).length === 0 || Object.keys(boundarySelections).length === 0) return [];
  let selectionList = [];
  Object.values(boundarySelections).forEach((item) => (selectionList = [...selectionList, ...item.map((e) => e.name)]));
  let childrenList = [];
  const set1 = new Set(selectionList);
  selectionList = selectionList.filter((item) => {
    const children = findChildren([item], Object.values(boundaryData)?.[0]?.hierarchicalData);
    if (children) {
      let childrenKeyList = getAllKeys(children);
      childrenList = [...childrenList, ...childrenKeyList];
      const nonePresent = childrenKeyList.every((item) => !set1.has(item));
      const allPresent = childrenKeyList.every((item) => set1.has(item));
      return nonePresent ? true : allPresent ? true : false;
    }
    return true;
  });
  return { filteredSelection: selectionList, childrenList };
};

// Recursive function to extract all keys
export const getAllKeys = (obj, keys = []) => {
  for (let [key, value] of Object.entries(obj)) {
    keys.push(key);
    if (value.children) {
      getAllKeys(value.children, keys);
    }
  }
  return keys;
};

// Remove all layers from the map
export const removeAllLayers = (map, layer) => {
  if (!map) return;
  layer.forEach((layer) => {
    map.removeLayer(layer);
  });
};
// Map-Marker
export const MapMarker = (style = {}) => {
  // Create a simple SVG marker as HTML string instead of using React components
  const svgHtml = `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="12" fill="${style.fill || '#F47738'}" stroke="${style.stroke || '#FFFFFF'}" stroke-width="2"/>
      <circle cx="16" cy="16" r="6" fill="${style.innerFill || '#FFFFFF'}"/>
    </svg>
  `;
  
  return L.divIcon({
    className: "custom-svg-icon",
    html: svgHtml,
    iconAnchor: [16, 32],
    iconSize: [32, 32],
  });
};

export const DefaultMapMarker = (style = {}) => {
  // Create a default marker as HTML string
  const svgHtml = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
            fill="${style.fill || '#F47738'}"/>
    </svg>
  `;
  
  return L.divIcon({
    className: "custom-svg-icon",
    html: svgHtml,
    iconAnchor: [12, 24],
    iconSize: [24, 24],
  });
};

export const disableMapInteractions = (map) => {
  if (!map) return;
  map.dragging.disable();
  map.scrollWheelZoom.disable();
  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.boxZoom.disable();
  map.keyboard.disable();
};

export const enableMapInteractions = (map) => {
  if (!map) return;
  map.dragging.enable();
  map.scrollWheelZoom.enable();
  map.touchZoom.enable();
  map.doubleClickZoom.enable();
  map.boxZoom.enable();
  map.keyboard.enable();
};
