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
import Schema from "../../configs/Schemas.json";
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
    // let schemas = data["hcm-microplanning"]["Schemas"];
    let schemas = Schema?.Schemas;
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
    const geojson = prepareGeojson(boundaryData, "ALL");

    // if(geojson)
    console.log(addGeojsonToMap(map, geojson));
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
          dropDownOptions: [...dataMap[item.boundaryType]].map((data) => ({ name: data, code: data, boundaryType: item.boundaryType })),
        };
      else return item;
    });
    setProcessedHierarchy(processedHierarchyTemp);
  }, [boundaryData, hierarchy]);

  const handleSelection = (e) => {
    let tempData = {};
    e.forEach((item) => {
      if (tempData[item?.[1]?.boundaryType]) tempData[item?.[1]?.boundaryType] = [...tempData[item?.[1]?.boundaryType], item?.[1]?.name];
      else tempData[item?.[1]?.boundaryType] = [item?.[1]?.name];
    });
    console.log("selections", tempData);
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
                {console.log(item?.dropDownOptions)}
                <MultiSelectDropdown
                  selected={boundarySelections?.[item?.boundaryType]}
                  label={"blabla"}
                  style={{ maxWidth: "23.75rem", margin: 0 }}
                  type={"multiselectdropdown"}
                  t={t}
                  options={item?.dropDownOptions}
                  optionsKey="name"
                  onSelect={handleSelection}
                  ServerStyle={{ position: "sticky", maxHeight: "15rem" }}
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
          console.log(files[fileData]);
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

              // extract dada
              console.log(Object.values(files[fileData]?.data));
              var { hierarchyLists, hierarchicalData } = processHierarchyAndData(hierarchy, Object.values(files[fileData]?.data));
              if (filterDataOrigin?.boundriesDataOrigin && filterDataOrigin?.boundriesDataOrigin.includes(fileData))
                setBoundary = { ...setBoundary, [fileData]: { hierarchyLists, hierarchicalData } };
              else if (filterDataOrigin?.layerDataOrigin && filterDataOrigin?.layerDataOrigin.includes(fileData))
                setFilter = { ...setFilter, [fileData]: { hierarchyLists, hierarchicalData } };
              break;
            }
            case "GeoJSON":
            case "Shapefile":
              dataAvailabilityCheck = dataAvailabilityCheck === "partial" ? "partial" : dataAvailabilityCheck === "false" ? "partial" : "true"; // Update data availability for GeoJSON or Shapefile
              // Extract keys from the first feature's properties
              var keys = Object.keys(files[fileData]?.mappedData.features[0].properties);
              keys.push("feature");

              // Extract corresponding values for each feature
              const values = files[fileData]?.mappedData?.features.map((feature) => {
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

  console.log(setBoundary, setFilter);
  setBoundaryData((previous) => ({ ...previous, ...setBoundary }));
  setFilterData((previous) => ({ ...previous, ...setFilter }));
};

const prepareGeojson = (boundaryData, selection) => {
  let geojsonRawFeatures = [];
  if (selection == "ALL") {
    for (let data of Object.values(boundaryData)) {
      const tempList = fetchFeatures(data?.hierarchicalData);
      console.log("tempList", tempList);
    }
  }
  return [
    {
      type: "Feature",
      properties: {},
      geometry: {
        coordinates: [
          [
            [40.188448985600814, -10.660068568603492],
            [35.19616098538114, -11.910583088074588],
            [35.14163839729292, -14.368277351798866],
            [35.18739126202129, -16.532332178003855],
            [34.04151920874003, -15.299883549627438],
            [33.122381578920454, -14.428431962891153],
            [31.25626119395085, -15.782388281195963],
            [33.207822620574944, -17.627841401248986],
            [32.84449605031611, -21.05056806074147],
            [31.00321346916303, -22.853508698154457],
            [31.939524780326792, -26.720591196238836],
            [33.49388775933767, -26.98786182588011],
            [35.68685874638962, -24.448499065948766],
            [35.068551734441826, -20.091153292255783],
            [37.89752637767572, -17.841808757821923],
            [41.92559279741067, -15.343081245085685],
            [40.188448985600814, -10.660068568603492],
          ],
        ],
        type: "Polygon",
      },
    },
  ];
  return;
};

const fetchFeatures = (data, parameter = "ALL", outputList = []) => {
  if (parameter === "ALL") {
    // outputList(Object.values(data).flatMap(item=>item?.data?.feature))
    let tempStorage = [];
    for (let [entityKey, entityValue] of Object.entries(data)) {
      console.log("112", entityKey, entityValue);
      if (entityValue?.children)
        tempStorage = [...tempStorage, entityValue?.data?.feature, ...fetchFeatures(entityValue?.children, parameter, outputList)];
      else tempStorage = [...tempStorage, entityValue?.data?.feature];
    }
    return tempStorage;
  } else if (Array.isArray(parameter)) {
    let tempStorage = [];
    for (let [entityKey, entityValue] of Object.entries(data)) {
      console.log("112", entityKey, entityValue);
      if (parameter.includes(entityKey)) {
        if (entityValue?.children)
          tempStorage = [...tempStorage, entityValue?.data?.feature, ...fetchFeatures(entityValue?.children, parameter , outputList)];
        else tempStorage = [...tempStorage, entityValue?.data?.feature];
      } else {
        if (entityValue?.children) tempStorage = [...tempStorage, ...fetchFeatures(entityValue?.children, parameter ,  outputList)];
      }
    }
    return tempStorage;
  }
};

const addGeojsonToMap = (map, geojson) => {
  if (!map || !geojson) return false;
  const geojsonLayer = L.geoJSON(geojson);
  geojsonLayer.addTo(map);
  return true;
};

// Exporting Mapping component
export default Mapping;
