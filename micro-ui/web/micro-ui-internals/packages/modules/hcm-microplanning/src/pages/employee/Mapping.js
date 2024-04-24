// Importing necessary modules
import { Button, Card, CardLabel, CustomDropdown, Dropdown, Header, MultiSelectDropdown, Toast, TreeSelect } from "@egovernments/digit-ui-components";
import L, { map } from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ZoomControl from "../../components/ZoomControl";
import CustomScaleControl from "../../components/CustomScaleControl";
import { MapLayerIcon } from "../../icons/MapLayerIcon";
import { NorthArrow } from "../../icons/NorthArrow";
import { Info } from "@egovernments/digit-ui-svg-components";
import { CardSectionHeader, InfoIconOutline } from "@egovernments/digit-ui-react-components";
import processHierarchyAndData from "../../utils/processHierarchyAndData";

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

  //fetch campaign data
  const { id = "" } = Digit.Hooks.useQueryParams();
  const { isLoading: isCampaignLoading, data: campaignData } = Digit.Hooks.microplan.useSearchCampaign(
    {
      CampaignDetails: {
        tenantId: Digit.ULBService.getCurrentTenantId(),
        ids: [id],
      },
    },
    {
      enabled: !!id,
    }
  );

  // request body for boundary hierarchy api
  const reqCriteria = {
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    params: {},
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId: Digit.ULBService.getStateId(),
        hierarchyType: campaignData?.hierarchyType,
      },
    },
    config: {
      enabled: !!campaignData?.hierarchyType,
      select: (data) => {
        return data?.BoundaryHierarchy?.[0]?.boundaryHierarchy || [];
      },
    },
  };
  const { isLoading: ishierarchyLoading, data: hierarchy } = Digit.Hooks.useCustomAPIHook(reqCriteria);

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
  const [boundaryData, setBoundaryData] = useState({}); // State for boundary data
  const [filterData, setFilterData] = useState({}); // State for facility data
  const [boundarySelections, setBoundarySelections] = useState([]);

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
      // Check if all the data is present or not, if it is then extract it in a format that can be used for mapping and other mapping related operations
      extractGeoData(
        campaignType,
        microplanData,
        filterDataOrigin,
        validationSchemas,
        setToast,
        setDataAvailability,
        hierarchy,
        setBoundaryData,
        setFilterData,
        t
      );
    }
  }, [filterDataOrigin, hierarchy]);

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
    var verticalBounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(85, 180));
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

  useEffect(() => {
    // const geojson = prepareGeojson(boundaryData,selection);
    const geojsons = prepareGeojson(boundaryData, "ALL");
    if (geojsons) addGeojsonToMap(map, geojsons);
    const bounds = findBounds(geojsons);
    console.log(geojsons, bounds);
    if (bounds) map?.fitBounds(bounds);
  }, [boundaryData]);

  // Rendering component
  return (
    <div className={`jk-header-btn-wrapper mapping-section ${editable ? "" : "non-editable-component"}`}>
      <Header className="heading">{t("MAPPING")}</Header>
      <Card className="mapping-body-container" style={{ margin: "0", padding: "0" }}>
        <Card className="map-container">
          {/* Container for map */}
          <BoundarySelection
            boundarySelections={boundarySelections}
            setBoundarySelections={setBoundarySelections}
            boundaryData={boundaryData}
            hierarchy={hierarchy}
            t={t}
          />
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
        </Card>
      </Card>
      {toast && toast.state === "error" && (
        <Toast style={{ bottom: "5.5rem", zIndex: "9999999" }} label={toast.message} isDleteBtn onClose={() => setToast(null)} error />
      )}
    </div>
  );
};

const BoundarySelection = memo(({ boundarySelections, setBoundarySelections, boundaryData, hierarchy, t }) => {
  const [isboundarySelectionSelected, setIsboundarySelectionSelected] = useState(false);
  const [processedHierarchy, setProcessedHierarchy] = useState([]);

  // Filtering out dropdown values
  useEffect(() => {
    if (!boundaryData || !hierarchy) return;
    let dataMap = {};
    Object.values(boundaryData)?.forEach((item) => {
      Object.entries(item?.hierarchyLists)?.forEach(([key, value]) => {
        if (value) {
          if (dataMap?.[key]) dataMap[key] = new Set([...dataMap[key], ...value]);
          else dataMap[key] = new Set([...value]);
        }
      });
    });
    let processedHierarchyTemp = hierarchy.map((item) => {
      if (dataMap?.[item?.boundaryType])
        return {
          ...item,
          dropDownOptions: [...dataMap[item.boundaryType]].map((data) => ({
            name: data,
            code: data,
            boundaryType: item?.boundaryType,
            parentBoundaryType: item?.parentBoundaryType,
          })),
        };
      else return item;
    });
    setProcessedHierarchy(processedHierarchyTemp);
  }, [boundaryData, hierarchy]);

  const handleSelection = (e) => {
    let tempData = {};
    let TempHierarchy = _.cloneDeep(processedHierarchy);
    e.forEach((item) => {
      // Enpty previous options
      let index = TempHierarchy.findIndex((e) => e?.parentBoundaryType === item?.[1]?.boundaryType);
      if (index !== -1) {
        TempHierarchy[index].dropDownOptions = [];
      }
    });
    e.forEach((item) => {
      // insert new data into tempData
      if (tempData[item?.[1]?.boundaryType]) tempData[item?.[1]?.boundaryType] = [...tempData[item?.[1]?.boundaryType], item?.[1]];
      else tempData[item?.[1]?.boundaryType] = [item?.[1]];

      // Filter the options
      let index = TempHierarchy.findIndex((e) => e?.parentBoundaryType === item?.[1]?.boundaryType);
      if (index !== -1) {
        const tempData = findFilteredData(item?.[1]?.name, item?.[1]?.boundaryType, boundaryData);
        if (tempData) TempHierarchy[index].dropDownOptions = [...TempHierarchy[index].dropDownOptions, ...tempData];
      }
    });
    setProcessedHierarchy(TempHierarchy);
    setBoundarySelections((previous) => ({ ...previous, ...tempData }));
  };

  return (
    <div className="filter-by-boundary">
      <Button
        icon="FilterAlt"
        variation="secondary"
        className="button-primary"
        textStyles={{ width: "fit-content" }}
        label={t("BUTTON_FILTER_BY_BOUNDARY")}
        onClick={() => setIsboundarySelectionSelected((previous) => !previous)}
      />
      {isboundarySelectionSelected && (
        <Card className="boundary-selection">
          <div className="header-section">
            <CardSectionHeader>{t("SELECT_A_BOUNDARY")}</CardSectionHeader>
            <InfoIconOutline width="1.8rem" fill="rgba(11, 12, 12, 1)" />
          </div>
          <div className="hierarchy-selection-container">
            {processedHierarchy?.map((item, index) => (
              <div key={index} className="hierarchy-selection-element">
                <CardLabel style={{ padding: 0, margin: 0 }}>{t(item?.boundaryType)}</CardLabel>
                <MultiSelectDropdown
                  selected={boundarySelections?.[item?.boundaryType]}
                  style={{ maxWidth: "23.75rem", margin: 0 }}
                  type={"multiselectdropdown"}
                  t={t}
                  options={item?.dropDownOptions}
                  optionsKey="name"
                  onSelect={handleSelection}
                  ServerStyle={{ position: "sticky", maxHeight: "15rem", zIndex: 600 }}
                />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
});

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

const extractGeoData = (
  campaignType,
  microplanData,
  filterDataOrigin,
  validationSchemas,
  setToast,
  setDataAvailability,
  hierarchy,
  setBoundaryData,
  setFilterData,
  t
) => {
  if (!hierarchy) return;

  let setBoundary = {};
  let setFilter = {};

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
        let latLngColumns =
          Object.entries(schema?.schema?.Properties || {})
            .reduce((acc, [key, value]) => {
              if (value?.isLocationDataColumns) {
                acc.push(key);
              }
              return acc;
            }, [])
            .map((item) => t(item)) || [];

        // Check if file contains latitude and longitude columns
        if (files[fileData]?.data) {
          if (dataAvailabilityCheck == "initialStage") dataAvailabilityCheck = "true";
          // Check file type and update data availability accordingly
          switch (files[fileData]?.fileType) {
            case "Excel": {
              let columnList = Object.values(files[fileData]?.data)[0][0];
              let check = true;
              if (latLngColumns) {
                for (let colName of latLngColumns) {
                  check = check && columnList.includes(t(colName)); // Check if columns exist in the file
                }
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

              // has lat lon a points
              const convertedData = Object.values(files[fileData]?.data)?.map((item) =>
                item?.map((row, rowIndex) => {
                  if (rowIndex === 0) {
                    if (row.indexOf("features") === -1) {
                      row.push("feature");
                    }
                    return row;
                  }
                  const latIndex = item?.[0].findIndex((cell) => cell === "lat");
                  const lonIndex = item?.[0].findIndex((cell) => cell === "long");
                  if (latIndex !== -1 && lonIndex !== -1) {
                    const lat = row[latIndex];
                    const lon = row[lonIndex];
                    const feature = {
                      type: "Feature",
                      properties: {},
                      geometry: {
                        type: "Point",
                        coordinates: [lon, lat],
                      },
                    };
                    row.push(feature);
                  } else {
                    row.push(null);
                  }
                  return row;
                })
              );

              console.log(convertedData);
              // extract dada
              var { hierarchyLists, hierarchicalData } = processHierarchyAndData(hierarchy, convertedData);
              if (filterDataOrigin?.boundriesDataOrigin && filterDataOrigin?.boundriesDataOrigin.includes(fileData))
                setBoundary = { ...setBoundary, [fileData]: { hierarchyLists, hierarchicalData } };
              else if (filterDataOrigin?.layerDataOrigin && filterDataOrigin?.layerDataOrigin.includes(fileData))
                setFilter = { ...setFilter, [fileData]: { hierarchyLists, hierarchicalData } };
              console.log(hierarchicalData);
              break;
            }
            case "GeoJSON":
            case "Shapefile":
              dataAvailabilityCheck = dataAvailabilityCheck === "partial" ? "partial" : dataAvailabilityCheck === "false" ? "partial" : "true"; // Update data availability for GeoJSON or Shapefile
              // Extract keys from the first feature's properties
              var keys = Object.keys(files[fileData]?.data.features[0].properties);
              keys.push("feature");

              // Extract corresponding values for each feature
              const values = files[fileData]?.data?.features.map((feature) => {
                // list with features added to it
                const temp = keys.map((key) => {
                  if (feature.properties[key] === "") {
                    return null;
                  }
                  if (key === "feature") return feature;
                  return feature.properties[key];
                });
                return temp;
              });
              // Group keys and values into the desired format
              let data = { [files[fileData]?.fileName]: [keys, ...values] };
              // extract dada
              var { hierarchyLists, hierarchicalData } = processHierarchyAndData(hierarchy, Object.values(data));
              if (filterDataOrigin?.boundriesDataOrigin && filterDataOrigin?.boundriesDataOrigin.includes(fileData))
                setBoundary = { ...setBoundary, [fileData]: { hierarchyLists, hierarchicalData } };
              else if (filterDataOrigin?.layerDataOrigin && filterDataOrigin?.layerDataOrigin.includes(fileData))
                setFilter = { ...setFilter, [fileData]: { hierarchyLists, hierarchicalData } };
              console.log(hierarchicalData);
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

  setBoundaryData((previous) => ({ ...previous, ...setBoundary }));
  setFilterData((previous) => ({ ...previous, ...setFilter }));
};

//prepare geojson to show on the map
const prepareGeojson = (boundaryData, selection) => {
  let geojsonRawFeatures = [];
  if (selection == "ALL") {
    for (let data of Object.values(boundaryData)) {
      const templist = fetchFeatures(data?.hierarchicalData);
      if (templist?.length !== 0) geojsonRawFeatures = [...geojsonRawFeatures, ...templist];
    }
  } else if (Array.isArray(selection)) {
    for (let data of Object.values(boundaryData)) {
      const templist = fetchFeatures(data?.hierarchicalData, selection);
      if (templist?.length !== 0) geojsonRawFeatures = [...geojsonRawFeatures, ...templist];
    }
  }

  return geojsonRawFeatures.filter(Boolean);
};
const fetchFeatures = (data, parameter = "ALL", outputList = []) => {
  if (parameter === "ALL") {
    // outputList(Object.values(data).flatMap(item=>item?.data?.feature))
    let tempStorage = [];
    for (let [entityKey, entityValue] of Object.entries(data)) {
      if (entityValue?.children)
        tempStorage = [...tempStorage, entityValue?.data?.feature, ...fetchFeatures(entityValue?.children, parameter, outputList)];
      else tempStorage = [...tempStorage, entityValue?.data?.feature];
    }
    return tempStorage;
  } else if (Array.isArray(parameter)) {
    let tempStorage = [];
    for (let [entityKey, entityValue] of Object.entries(data)) {
      if (parameter.includes(entityKey)) {
        if (entityValue?.children)
          tempStorage = [...tempStorage, entityValue?.data?.feature, ...fetchFeatures(entityValue?.children, parameter, outputList)];
        else tempStorage = [...tempStorage, entityValue?.data?.feature];
      } else {
        if (entityValue?.children) tempStorage = [...tempStorage, ...fetchFeatures(entityValue?.children, parameter, outputList)];
      }
    }
    return tempStorage;
  }
};

// Filters data for dropdown with when a parent is selected
const findFilteredData = (name, boundaryType, boundaryData) => {
  let geojsonRawFeatures = [];
  for (let data of Object.values(boundaryData)) {
    const templist = findFilteredDataHierarchyTraveler(data?.hierarchicalData, name, boundaryType);
    if (templist?.length !== 0) geojsonRawFeatures = [...geojsonRawFeatures, ...templist];
  }
  return geojsonRawFeatures;
};
const findFilteredDataHierarchyTraveler = (data, name, boundaryType) => {
  if (!data) return;
  let tempStorage = [];
  for (let [entityKey, entityValue] of Object.entries(data)) {
    if (entityKey === name && entityValue?.boundaryType === boundaryType)
      tempStorage = [
        ...tempStorage,
        ...Object.values(entityValue?.children)?.map((item) => ({
          name: item?.name,
          code: item?.name,
          boundaryType: item?.boundaryType,
          parentBoundaryType: boundaryType,
        })),
      ];
    else if (entityValue?.children) tempStorage = [...tempStorage, ...findFilteredDataHierarchyTraveler(entityValue?.children, name, boundaryType)];
  }
  return tempStorage;
};

const addGeojsonToMap = (map, geojson) => {
  if (!map || !geojson) return false;
  const geojsonLayer = L.geoJSON(geojson,{
    style: function(feature) {
      return {
        fillColor: 'rgb(0,0,0,0)', 
        weight: 2,
        opacity: 1,
        color: 'rgba(176, 176, 176, 1)',
        dashArray: '3',
        fillOpacity: 0
      };
    }
  });
  geojsonLayer.addTo(map);
  return true;
};

// Find bounds for multiple geojson together
const findBounds = (data, buffer = 0.1) => {
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

// Exporting Mapping component
export default Mapping;
