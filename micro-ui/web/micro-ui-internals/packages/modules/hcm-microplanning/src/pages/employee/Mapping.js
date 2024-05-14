// Importing necessary modules
import {
  Button,
  Card,
  CardLabel,
  CustomDropdown,
  Dropdown,
  Header,
  MultiSelectDropdown,
  Toast,
  TreeSelect,
  Modal,
} from "@egovernments/digit-ui-components";
import L, { map } from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ZoomControl from "../../components/ZoomControl";
import CustomScaleControl from "../../components/CustomScaleControl";
import { MapLayerIcon } from "../../icons/MapLayerIcon";
import { NorthArrow } from "../../icons/NorthArrow";
import { FilterAlt, Info } from "@egovernments/digit-ui-svg-components";
import { CardSectionHeader, InfoIconOutline, LoaderWithGap } from "@egovernments/digit-ui-react-components";
import {
  processHierarchyAndData,
  findParent,
  fetchDropdownValues,
  findChildren,
  calculateAggregateForTree,
} from "../../utils/processHierarchyAndData";
import { EXCEL, GEOJSON, SHAPEFILE } from "../../configs/constants";
import { tourSteps } from "../../configs/tourSteps";
import { useMyContext } from "../../utils/context";
import { CloseButton, ModalHeading } from "../../components/CommonComponents";
import { PopulationSvg } from "../../icons/Svg";
import chroma from "chroma-js";

const page = "mapping";

function checkTruthyKeys(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] && !(Array.isArray(obj[key]) && obj[key].length === 0)) {
        return true;
      }
    }
  }
  return false;
}

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
  var reqCriteria = {
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    params: {},
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId: Digit.ULBService.getStateId(),
        // hierarchyType:  "Microplan",
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
  // request body for boundary hierarchy api
  var reqCriteria = {
    url: `/boundary-service/boundary/_search`,
    params: { codes: Digit.ULBService.getCurrentTenantId(), tenantId: Digit.ULBService.getCurrentTenantId() },
    body: {},
    config: {
      select: (data) => {
        return data?.Boundary || {};
      },
    },
  };
  const { isLoading: isBoundaryLoading, data: Boundary } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  // Setting up state variables
  const [editable, setEditable] = useState(true);
  const { t } = useTranslation();
  var [map, setMap] = useState(null);
  var [_mapNode, set__mapNode] = useState("map");
  const [layers, setLayer] = useState([]);
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
  const [boundarySelections, setBoundarySelections] = useState({});
  const [isboundarySelectionSelected, setIsboundarySelectionSelected] = useState(false);
  const { state, dispatch } = useMyContext();
  const [chloroplethProperty, setChloroplethProperty] = useState("targetPopulation");
  const basemapRef = useRef();
  const filterBoundaryRef = useRef();

  // Set TourSteps
  useEffect(() => {
    const tourData = tourSteps(t)?.[page] || {};
    if (state?.tourStateData?.name === page) return;
    dispatch({
      type: "SETINITDATA",
      state: { tourStateData: tourData },
    });
  }, []);

  // Effect to initialize map when data is fetched
  useEffect(() => {
    if (!state || !Boundary) return;
    let UIConfiguration = state?.UIConfiguration;
    if (UIConfiguration) {
      const filterDataOriginList = UIConfiguration.find((item) => item.name === "mapping");
      setFilterDataOrigin(filterDataOriginList);
    }
    const BaseMapLayers = state?.BaseMapLayers;
    let schemas = state?.Schemas;
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
      init(_mapNode, defaultBaseMap, Boundary);
    }
  }, [state?.UIConfiguration, state?.Schemas, state?.BaseMapLayers, Boundary]);

  useEffect(() => {
    if (map && filterDataOrigin && Object.keys(filterDataOrigin).length !== 0) {
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
  const init = (id, defaultBaseMap, Boundary) => {
    if (map !== null) return;

    let bounds;

    let mapConfig = {
      center: [0, 0],
      zoomControl: false,
      zoom: 2,
      scrollwheel: true,
      minZoom: 2,
    };

    let map_i = L.map(id, mapConfig);
    var verticalBounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(85, 180));
    map_i.on("drag", function () {
      map_i.panInsideBounds(verticalBounds, { animate: true });
    });
    map_i.on("zoom", function () {
      map_i.panInsideBounds(verticalBounds, { animate: true });
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

  // Showing all the validd uploaded data on the map
  useEffect(() => {
    const geojsons = prepareGeojson(boundaryData, "ALL");
    if (geojsons) {
      addGeojsonToMap(map, geojsons, t);
    }

    // setting bounds if they exist
    let bounds = findBounds(geojsons);
    if (bounds) {
      map?.fitBounds(bounds);
    } else {
      if (Boundary) {
        let bounds = findBounds(Boundary);
        if (bounds) map?.fitBounds(L.latLngBounds(bounds));
      }
    }
  }, [boundaryData]);

  // showing selected boundary data
  useEffect(() => {
    if (!boundarySelections && !chloroplethProperty) return;
    let style = {
      fillColor: "rgba(255, 107, 43, 1)",
      weight: 2,
      opacity: 1,
      color: "rgba(255, 255, 255, 1)",
      fillOpacity: 0.22,
      fill: "rgb(4,136,219)",
    };
    const filteredSelection = filterSelection(boundaryData, boundarySelections);
    // addGeojsonToMap(map, baseDatalayers, t);
    removeAllLayers(map, layers);
    let newLayer = [];
    let geojsonLayer;
    // if (chloroplethProperty) {
    //   style.fillOpacity = 0.7;
    //   style.opacity = 0.7
    //   const chloroplethGeojson = prepareGeojson(boundaryData, "ALL", style) || [];
    //   geojsonLayer = addGeojsonToMap(map, chloroplethGeojson, t, chloroplethProperty);
    //   if (geojsonLayer) {
    //     newLayer.push(geojsonLayer);
    //     style.fillOpacity = 0.22;
    //   }
    // }
    // style.fillOpacity = 0.7
    //   style.opacity = 1
    const geojsons = prepareGeojson(boundaryData, filteredSelection, style);
    geojsonLayer = addGeojsonToMap(map, geojsons, t);
    if (geojsons) {
      if (geojsonLayer) newLayer.push(geojsonLayer);
      let bounds = findBounds(geojsons);
      if (bounds) map.fitBounds(bounds);
    }
    setLayer(newLayer);
  }, [boundarySelections, chloroplethProperty]);

  const handleOutsideClickAndSubmitSimultaneously = useCallback(() => {
    if (isboundarySelectionSelected) setIsboundarySelectionSelected(false);
    if (showBaseMapSelector) setShowBaseMapSelector(false);
  }, [isboundarySelectionSelected, showBaseMapSelector, setIsboundarySelectionSelected, setShowBaseMapSelector]);
  Digit?.Hooks.useClickOutside(filterBoundaryRef, handleOutsideClickAndSubmitSimultaneously, isboundarySelectionSelected, { capture: true });
  Digit?.Hooks.useClickOutside(basemapRef, handleOutsideClickAndSubmitSimultaneously, showBaseMapSelector, { capture: true });

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
            filterBoundaryRef={filterBoundaryRef}
            isboundarySelectionSelected={isboundarySelectionSelected}
            setIsboundarySelectionSelected={setIsboundarySelectionSelected}
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
                  basemapRef={basemapRef}
                  t={t}
                />
              </div>
              <div className="icon-rest filter-icon">
                <p>{t("FILTER")}</p>
                <div className="icon">
                  <FilterAlt width={"1.667rem"} height={"1.667rem"} fill={"rgba(255, 255, 255, 1)"} />
                </div>
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

const BoundarySelection = memo(
  ({
    boundarySelections,
    setBoundarySelections,
    boundaryData,
    hierarchy,
    filterBoundaryRef,
    isboundarySelectionSelected,
    setIsboundarySelectionSelected,
    t,
  }) => {
    const [processedHierarchy, setProcessedHierarchy] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmationModal, setShowConformationModal] = useState(false);
    // Filtering out dropdown values
    useEffect(() => {
      if (!boundaryData || !hierarchy) return;
      let processedHierarchyTemp = fetchDropdownValues(
        boundaryData,
        processedHierarchy.length !== 0 ? processedHierarchy : hierarchy,
        boundarySelections
      );
      setProcessedHierarchy(processedHierarchyTemp);
      setIsLoading(false);
    }, [boundaryData, hierarchy, boundarySelections]);

    const handleClearAll = () => {
      setShowConformationModal(true);
    };

    const handleSubmitConfModal = () => {
      setBoundarySelections({});
      setShowConformationModal(false);
    };

    const handleCancelConfModal = () => {
      setShowConformationModal(false);
    };

    return (
      <div className={`filter-by-boundary  ${!isboundarySelectionSelected ? "height-control" : ""}`} ref={filterBoundaryRef}>
        {isLoading && <LoaderWithGap text={"LOADING"} />}
        <Button
          icon="FilterAlt"
          variation="secondary"
          className="button-primary"
          textStyles={{ width: "fit-content" }}
          label={t("BUTTON_FILTER_BY_BOUNDARY")}
          onClick={() => setIsboundarySelectionSelected((previous) => !previous)}
        />
        <Card className={`boundary-selection ${!isboundarySelectionSelected ? "display-none" : ""}`}>
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
                  ServerStyle={(item?.dropDownOptions || []).length > 5 ? { height: "13.75rem" } : {}}
                  type={"multiselectdropdown"}
                  t={t}
                  options={item?.dropDownOptions || []}
                  optionsKey="name"
                  onSelect={(e) =>
                    Digit.Utils.microplan.handleSelection(
                      e,
                      item?.boundaryType,
                      boundarySelections,
                      hierarchy,
                      setBoundarySelections,
                      boundaryData,
                      setIsLoading
                    )
                  }
                />
              </div>
            ))}
            {checkTruthyKeys(boundarySelections) && (
              <div>
                <Button
                  label={t("CLEAR_ALL")}
                  variation="primary"
                  type="button"
                  onClick={handleClearAll}
                  className={"header-btn"}
                  style={{ marginTop: "2rem", width: "14rem" }}
                />
              </div>
            )}
            {showConfirmationModal && (
              <Modal
                popupStyles={{ width: "fit-content", borderRadius: "0.25rem" }}
                popupModuleActionBarStyles={{
                  display: "flex",
                  flex: 1,
                  justifyContent: "space-between",
                  padding: 0,
                  width: "100%",
                  padding: "0 0 1rem 1.3rem",
                }}
                popupModuleMianStyles={{ padding: 0, margin: 0, maxWidth: "31.188rem" }}
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  border: "0.063rem solid rgba(244, 119, 56, 1)",
                }}
                headerBarMainStyle={{ padding: 0, margin: 0 }}
                headerBarMain={<ModalHeading style={{ fontSize: "1.5rem" }} label={t("CLEAR_ALL")} />}
                headerBarEnd={<CloseButton clickHandler={() => setShowConformationModal(false)} style={{ padding: "0.4rem 0.8rem 0 0" }} />}
                actionCancelLabel={t("YES")}
                actionCancelOnSubmit={handleSubmitConfModal}
                actionSaveLabel={t("NO")}
                actionSaveOnSubmit={handleCancelConfModal}
              >
                <div className="modal-body">
                  <p className="modal-main-body-p">{t("CLEAR_ALL_CONFIRMATION_MSG")}</p>
                </div>
              </Modal>
            )}
          </div>
        </Card>
      </div>
    );
  }
);

const BaseMapSwitcher = ({ baseMaps, showBaseMapSelector, setShowBaseMapSelector, handleBaseMapToggle, selectedBaseMapName, basemapRef, t }) => {
  if (!baseMaps) return null;

  return (
    <div className="base-map-selector">
      <div className="icon-first" onClick={() => setShowBaseMapSelector((previous) => !previous)}>
        <p>{t("LAYERS")}</p>
        <div className="icon">
          <MapLayerIcon width={"1.667rem"} height={"1.667rem"} fill={"rgba(255, 255, 255, 1)"} />
        </div>
      </div>
      <div className="base-map-area-wrapper" ref={basemapRef}>
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

const calculateAggregateForTreeMicroplanWrapper = (entity) => {
  if (!entity || typeof entity !== "object") return {};
  let newObject = {};
  for (let [key, value] of Object.entries(entity)) {
    if (!value?.["hierarchicalData"]) continue;
    let aggregatedTree = calculateAggregateForTree(value?.["hierarchicalData"]);
    newObject[key] = { ...value, hierarchicalData: aggregatedTree };
  }
  return newObject;
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
    let files = _.cloneDeep(microplanData?.upload);
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
            case EXCEL: {
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
                  let properties = {};
                  row.map((e, index) => {
                    properties[item?.[0]?.[index]] = e;
                  });
                  if (latIndex !== -1 && lonIndex !== -1) {
                    const lat = row[latIndex];
                    const lon = row[lonIndex];
                    const feature = {
                      type: "Feature",
                      properties: properties,
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

              // extract dada
              var { hierarchyLists, hierarchicalData } = processHierarchyAndData(hierarchy, convertedData);
              if (filterDataOrigin?.boundriesDataOrigin && filterDataOrigin?.boundriesDataOrigin.includes(fileData))
                setBoundary = { ...setBoundary, [fileData]: { hierarchyLists, hierarchicalData } };
              else if (filterDataOrigin?.layerDataOrigin && filterDataOrigin?.layerDataOrigin.includes(fileData))
                setFilter = { ...setFilter, [fileData]: { hierarchyLists, hierarchicalData } };
              break;
            }
            case GEOJSON:
            case SHAPEFILE:
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
  setBoundary = calculateAggregateForTreeMicroplanWrapper(setBoundary);
  setFilter = calculateAggregateForTreeMicroplanWrapper(setFilter);
  setBoundaryData((previous) => ({ ...previous, ...setBoundary }));
  setFilterData((previous) => ({ ...previous, ...setFilter }));
};

//prepare geojson to show on the map
const prepareGeojson = (boundaryData, selection, style = {}) => {
  if (!boundaryData || Object.keys(boundaryData).length === 0) return [];
  let geojsonRawFeatures = [];
  if (selection == "ALL") {
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
const fetchFeatures = (data, parameter = "ALL", outputList = [], style = {}) => {
  let tempStorage = [];
  if (parameter === "ALL") {
    // outputList(Object.values(data).flatMap(item=>item?.data?.feature))
    for (let [entityKey, entityValue] of Object.entries(data)) {
      if (entityValue?.data?.feature) {
        let feature = entityValue.data.feature;
        feature.properties["name"] = entityKey;
        feature.properties["style"] = style;
        if (entityValue?.children) tempStorage = [...tempStorage, feature, ...fetchFeatures(entityValue?.children, parameter, outputList, style)];
        else tempStorage = [...tempStorage, feature];
      } else {
        tempStorage = [...tempStorage, ...fetchFeatures(entityValue?.children, parameter, outputList, style)];
      }
    }
    return tempStorage;
  } else if (Array.isArray(parameter)) {
    for (let [entityKey, entityValue] of Object.entries(data)) {
      if (parameter.includes(entityKey) && entityValue && entityValue.data && entityValue.data.feature) {
        let feature = entityValue.data.feature;
        feature.properties["name"] = entityKey;
        feature.properties["style"] = style;
        if (entityValue?.children) tempStorage = [...tempStorage, feature, ...fetchFeatures(entityValue?.children, parameter, outputList, style)];
        else tempStorage = [...tempStorage, feature];
      } else {
        if (entityValue?.children) tempStorage = [...tempStorage, ...fetchFeatures(entityValue?.children, parameter, outputList, style)];
      }
    }
    return tempStorage;
  }
};

const addGeojsonToMap = (map, geojson, t, chloroplethProperty = undefined) => {
  if (!map || !geojson) return false;
  // Calculate min and max values of the property
  const values = geojson.map((feature) => feature.properties[chloroplethProperty]) || [];
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  // Define the colors of the gradient
  const colors = [
    { percent: 0, color: "#FF7373" },
    { percent: 50, color: "#FFFFFF" },
    { percent: 100, color: "#BA2900" },
  ];
  const geojsonLayer = L.geoJSON(geojson, {
    style: function (feature) {
      let color;
      if (chloroplethProperty) color = interpolateColor(feature.properties[chloroplethProperty] || [], minValue, maxValue, colors);
      console.log(color);
      if (Object.keys(feature.properties.style).length !== 0 && !chloroplethProperty) {
        return feature.properties.style;
      } else {
        return {
          // fillColor: "rgb(0,0,0,0)",
          ...(feature.properties.style ? feature.properties.style : {}),
          weight: 2,
          opacity: 1,
          color: "rgba(176, 176, 176, 1)",
          fillColor: chloroplethProperty ? color : "rgb(0,0,0,0)",
          fillOpacity: chloroplethProperty ? (feature?.properties?.style?.fillOpacity ? feature.properties.style.fillOpacity : 0.7) : 0,
        };
      }
    },
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {
        icon: MapMarker(feature.properties.style),
      });
    },
    onEachFeature: function (feature, layer) {
      if (feature.properties) {
        let popupContent = "<div style='background-color: white; padding: 0rem;'>";
        popupContent += "<table style='border-collapse: collapse;'>";
        popupContent +=
          "<div style='font-family: Roboto;font-size: 1.3rem;font-weight: 700;text-align: left; color:rgba(11, 12, 12, 1);'>" +
          feature.properties["name"] +
          "</div>";
        for (let prop in feature.properties) {
          if (prop !== "name" && prop !== "style")
            popupContent +=
              "<tr><td style='font-family: Roboto;font-size: 0.8rem;font-weight: 700;text-align: left; color:rgba(80, 90, 95, 1);padding-right:1rem'>" +
              t(prop) +
              "</td><td>" +
              feature.properties[prop] +
              "</td></tr>";
        }
        popupContent += "</table></div>";
        layer.bindPopup(popupContent);
      }
    },
  });
  geojsonLayer.addTo(map);
  return geojsonLayer;
};

function interpolateColor(value, minValue, maxValue, colors) {
  // Handle case where min and max values are the same
  if (minValue === maxValue) {
    // Return a default color or handle the case as needed
    return colors[0].color;
  }

  // Normalize the value to a percentage between 0 and 100
  const percent = ((value - minValue) / (maxValue - minValue)) * 100;
  // Find the two colors to interpolate between
  let lowerColor, upperColor;
  for (let i = 0; i < colors.length - 1; i++) {
    if (percent >= colors[i].percent && percent <= colors[i + 1].percent) {
      lowerColor = colors[i];
      upperColor = colors[i + 1];
      break;
    }
  }
  // Interpolate between the two colors
  const t = (percent - lowerColor.percent) / (upperColor.percent - lowerColor.percent);
  return chroma.mix(lowerColor.color, upperColor.color, t, "lab").hex();
}

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

const filterSelection = (boundaryData, boundarySelections) => {
  if (Object.keys(boundaryData).length === 0 || Object.keys(boundarySelections).length === 0) return [];
  let selectionList = [];
  Object.values(boundarySelections).forEach((item) => (selectionList = [...selectionList, ...item.map((e) => e.name)]));
  const set1 = new Set(selectionList);
  selectionList = selectionList.filter((item) => {
    const children = findChildren([item], Object.values(boundaryData)?.[0]?.hierarchicalData);
    if (children) {
      let childrenList = getAllKeys(children);
      const nonePresent = childrenList.every((item) => !set1.has(item));
      const allPresent = childrenList.every((item) => set1.has(item));
      return nonePresent ? true : allPresent ? true : false;
    } else {
      return true;
    }
  });
  return selectionList;
};

// Recursive function to extract all keys
const getAllKeys = (obj, keys = []) => {
  for (let [key, value] of Object.entries(obj)) {
    keys.push(key);
    if (value.children) {
      getAllKeys(value.children, keys);
    }
  }
  return keys;
};

// Remove all layers from the map
const removeAllLayers = (map, layer) => {
  if (!map) return;
  layer.forEach((layer) => {
    map.removeLayer(layer);
  });
};
// Map-Marker
const MapMarker = (style = {}) => {
  return L.divIcon({
    className: "custom-svg-icon",
    html: PopulationSvg(style),
    iconAnchor: [25, 50],
  });
};

// Exporting Mapping component
export default Mapping;
