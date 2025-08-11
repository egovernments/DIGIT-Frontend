import React, { memo, useEffect, useRef, useState, Fragment } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fileData } from "./fileData";
import { Card, Button } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import BoundaryFilter from "./BoundaryFilter";
import BaseMapSwitcher from "./BaseMapSwitcher";
import { useMyContext } from "../utils/context";
import * as DigitSvgs from "@egovernments/digit-ui-svg-components";
import CustomScaleControl from "./CustomScaleControl";
import MapFilterIndex from "./MapFilterIndex";
import FilterSection from "./FilterSection";
import ChoroplethSelection from "./ChoroplethSelection";
import { FilterAlt } from "@egovernments/digit-ui-svg-components";
import {
  enableMapInteractions,
  disableMapInteractions,
  removeAllLayers,
  filterBoundarySelection,
  findBounds,
  addGeojsonToMap,
  addFilterProperties,
  addChoroplethProperties,
  prepareGeojson,
  extractGeoData,
} from "../utils/mappingUtils";
import { CardSectionHeader, InfoIconOutline, LoaderWithGap, Modal, Header } from "@egovernments/digit-ui-react-components";

// Ensure Leaflet default icons are overridden
if (typeof L !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNCA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMjAuNTQ5IDIgMjcgOC40NTEgMjcgMTdDMjcgMzEuNSAxMiA0MSAxMiA0MUMxMiA0MSAtMyAzMS41IC0zIDE3Qy0zIDguNDUxIDMuNTUxIDIgMTIgMloiIGZpbGw9IiNGNDc3MzgiLz4KPHBhdGggZD0iTTEyIDExQzE0LjIwOTEgMTEgMTYgMTIuNzkwOSAxNiAxNUMxNiAxNy4yMDkxIDE0LjIwOTEgMTkgMTIgMTlDOS43OTA5IDE5IDggMTcuMjA5MSA4IDE1QzggMTIuNzkwOSA5Ljc5MDkgMTEgMTIgMTFaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNCA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMjAuNTQ5IDIgMjcgOC40NTEgMjcgMTdDMjcgMzEuNSAxMiA0MSAxMiA0MUMxMiA0MSAtMyAzMS41IC0zIDE3Qy0zIDguNDUxIDMuNTUxIDIgMTIgMloiIGZpbGw9IiNGNDc3MzgiLz4KPHBhdGggZD0iTTEyIDExQzE0LjIwOTEgMTEgMTYgMTIuNzkwOSAxNiAxNUMxNiAxNy4yMDkxIDE0LjIwOTEgMTkgMTIgMTlDOS43OTA5IDE5IDggMTcuMjA5MSA4IDE1QzggMTIuNzkwOSA5Ljc5MDkgMTEgMTIgMTFaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
    shadowUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDEiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA0MSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAuNSIgY3k9IjIwLjUiIHI9IjE4LjUiIGZpbGw9ImJsYWNrIiBvcGFjaXR5PSIwLjIiLz4KPC9zdmc+Cg=='
  });
}

// Add CSS for custom markers
const markerStyles = `
  <style>
    .custom-svg-icon {
      background: transparent !important;
      border: none !important;
    }
    .custom-svg-icon svg {
      display: block;
      width: 100%;
      height: 100%;
    }
    .leaflet-marker-icon {
      background: transparent !important;
    }
    
    /* Override all marker icons in the marker pane */
    .leaflet-pane.leaflet-marker-pane img.leaflet-marker-icon {
      display: none !important;
    }
    
    /* Force all markers to use our custom styling */
    .leaflet-marker-icon[src*="marker-icon"] {
      display: none !important;
    }
    
    /* Hide any default marker images */
    .leaflet-marker-icon[src*="marker-icon-2x.png"],
    .leaflet-marker-icon[src*="marker-icon.png"] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
    }
    
    /* Ensure our custom markers are visible */
    .leaflet-marker-icon.custom-svg-icon {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
    
    /* Override any remaining default markers */
    .leaflet-marker-icon:not(.custom-svg-icon) {
      display: none !important;
    }
  </style>
`;

// Utility function to introduce a delay
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MapViewComponent = () => {
  const { t } = useTranslation();
  const url = Digit.Hooks.useQueryParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const {
    isLoading: isLoadingCampaignObject,
    data: campaignObject,
    error: errorCampaign,
    refetch: refetchCampaign,
  } = Digit.Hooks.microplanv1.useSearchCampaign(
    {
      CampaignDetails: {
        tenantId,
        ids: [url?.campaignId],
      },
    },
    {
      enabled: url?.campaignId ? true : false,
    }
  );

  const [jurisdiction, setjurisdiction] = useState([]);
  const [isboundarySelectionSelected, setIsboundarySelectionSelected] = useState(false);
  const [filterSelections, setFilterSelections] = useState([]);
  const [filterProperties, setFilterProperties] = useState();
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const { state, dispatch } = useMyContext();
  const hierarchy = state?.hierarchyType;
  const BoundaryMain = campaignObject?.boundaries;
  const [boundary, setBoundary] = useState(BoundaryMain);
  const [boundarySelections, setBoundarySelections] = useState({});
  const [baseMaps, setBaseMaps] = useState({});
  const [showBaseMapSelector, setShowBaseMapSelector] = useState(false);
  const [selectedBaseMap, setSelectedBaseMap] = useState({});
  const [selectedBaseMapName, setSelectedBaseMapName] = useState("");
  const basemapRef = useRef();
  const showFilterOptionRef = useRef();
  var [map, setMap] = useState(null);
  var [_mapNode, set__mapNode] = useState("map");
  const [loader, setLoader] = useState(false);

  const [choroplethProperties, setChoroplethProperties] = useState([]);
  const [showChoroplethOptions, setShowChoroplethOptions] = useState(false);
  const [choroplethProperty, setChoroplethProperty] = useState();
  const [dataCompleteness, setDataCompleteness] = useState();
  const filterBoundaryRef = useRef();
  const showChoroplethOptionRef = useRef();

  const MapFilters = [
    {
      name: "Warehouse",
      icon: {
        index: "Warehouse",
        marker: "WarehouseMarker",
      },
    },
    {
      name: "Church",
      icon: {
        index: "Church",
        marker: "ChurchMarker",
      },
    },
  ];

  // Effect to initialize map when data is fetched
  useEffect(() => {
    if (!state || !boundary) return;
    const BaseMapLayers = [
      {
        name: "Satellite",
        url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        minZoom: 1,
        maxZoom: 20,
        attribution: "&copy; OpenTopoMap",
      },
      {
        name: "Street Map",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        minZoom: 1,
        maxZoom: 20,
        attribution: "&copy; OpenStreetMap contributors",
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
      init(_mapNode, defaultBaseMap, boundary);
    }
  }, [boundary]);

  // Function to initialize map
  const init = (id, defaultBaseMap, boundary) => {
    if (map !== null) return;

    // let bounds = findBounds(boundary);

    let mapConfig = {
      center: [0, 0],
      zoomControl: false,
      zoom: 3,
      scrollwheel: true,
      minZoom: 3,
    };

    let map_i = L.map(id, mapConfig);

    // Add custom marker styles to the map container
    const mapContainer = document.getElementById(id);
    if (mapContainer) {
      mapContainer.insertAdjacentHTML('beforeend', markerStyles);
    }

    // Function to replace default markers with custom ones
    const replaceDefaultMarkers = () => {
      const defaultMarkers = document.querySelectorAll('.leaflet-marker-icon[src*="marker-icon"]');
      defaultMarkers.forEach(marker => {
        if (!marker.classList.contains('custom-svg-icon')) {
          marker.style.display = 'none';
          marker.style.visibility = 'hidden';
          marker.style.opacity = '0';
        }
      });
    };

    // Set up a mutation observer to watch for new markers
    const observer = new MutationObserver(replaceDefaultMarkers);
    if (mapContainer) {
      observer.observe(mapContainer, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'class']
      });
    }

    // Add the zoom control manually at the bottom left
    L.control
      .zoom({
        position: "bottomleft", // Position it at the bottom left
      })
      .addTo(map_i);

    var verticalBounds = L.latLngBounds(L.latLng(-90, -170), L.latLng(85, 190));
    map_i.on("drag", () => {
      map_i.panInsideBounds(verticalBounds, { animate: true });
    });
    map_i.on("zoom", () => {
      map_i.panInsideBounds(verticalBounds, { animate: true });
    });
    const defaultBaseLayer = defaultBaseMap?.layer.addTo(map_i);
    // if (bounds) map_i.fitBounds(bounds);
    setSelectedBaseMap(defaultBaseLayer);
    setMap(map_i);
  };
  useEffect(() => {
    if (campaignObject?.boundaries) {
      setBoundary(campaignObject?.boundaries);
      const boundaryCodes = campaignObject?.boundaries.map((boundary) => boundary.code);
      setjurisdiction(boundaryCodes);
    }
  }, [campaignObject]);

  // Custom hook to fetch census data based on microplanId and boundaryCode
  const reqCriteriaResource = {
    url: `/census-service/_search`,
    body: {
      CensusSearchCriteria: {
        tenantId: tenantId,
        source: url?.microplanId,
        jurisdiction: jurisdiction,
      },
    },
    config: {
      enabled: jurisdiction && jurisdiction.length > 0 ? true : false,
    },
  };

  const { isLoading, data: censusData, isFetching, refetch } = Digit.Hooks.useCustomAPIHook(reqCriteriaResource);


  const { isLoading: isLoadingPlanObject, data: planObject, error: errorPlan, refetch: refetchPlan } = Digit.Hooks.microplanv1.useSearchPlanConfig(
    {
      PlanConfigurationSearchCriteria: {
        tenantId,
        id: url?.microplanId,
      },
    },
    {
      enabled: true,
    }
  );

  const reqCriteriaForPlanFacility = {
    url: `/plan-service/plan/facility/_search`,
    params: {},
    body: {
      PlanFacilitySearchCriteria: {
        tenantId: tenantId,
        planConfigurationId: url?.microplanId,
      },
    },
    config: {
      enabled: true,
    },
  };
  const {
    isLoading: isFacilitySearchLoading,
    data: facilitySearchData,
    isFetching: isFacilitySearchFetching,
    refetch2,
    revalidate,
  } = Digit.Hooks.useCustomAPIHook(reqCriteriaForPlanFacility);


  // showing selected boundary data
  useEffect(async () => {
    if (!boundarySelections && !choroplethProperty && !filterSelections) return;
    // setLoader("LOADING");
    await delay(100);
    try {
      removeAllLayers(map, layers);
      const { filteredSelection, childrenList } = filterBoundarySelection(boundary, boundarySelections);
      let newLayer = [];
      let addOn = {
        fillColor: "rgba(255, 107, 43, 0)",
        weight: 3.5,
        opacity: 1,
        color: "rgba(176, 176, 176, 1)",
        fillOpacity: 0,
        fill: "rgb(4,136,219,1)",
        child: !childrenList || childrenList.length === 0, // so that this layer also has mounse in and mouse out events
      };
      let geojsonsBase = prepareGeojson(boundary, "ALL", addOn);
      if (geojsonsBase) {
        let baseLayer = addGeojsonToMap(map, geojsonsBase, t);
        if (baseLayer) newLayer.push(baseLayer);
        let bounds = findBounds(geojsonsBase);
        if (bounds) map.fitBounds(bounds);
      }

      addOn = {
        fillColor: "rgba(255, 107, 43, 1)",
        weight: 2.5,
        opacity: 1,
        color: "rgba(255, 255, 255, 1)",
        fillOpacity: 0.22,
        fill: "rgb(4,136,219)",
      };

      let geojsonLayer;
      if (choroplethProperty) {
        if (dataCompleteness === "partial" || dataCompleteness === "false" || dataCompleteness === undefined) {
          // setToast({
          //   state: "warning",
          //   message: t("DISPLAYING_DATA_ONLY_FOR_UPLOADED_BOUNDARIES"),
          // });
        }

        let choroplethGeojson = prepareGeojson(boundary, "ALL", { ...addOn, child: true, fillColor: "rgb(0,0,0,0)" }) || [];
        if (choroplethGeojson && choroplethGeojson.length !== 0)
          choroplethGeojson = addChoroplethProperties(choroplethGeojson, choroplethProperty, filteredSelection);
        geojsonLayer = addGeojsonToMap(map, choroplethGeojson, t);
        if (geojsonLayer) {
          newLayer.push(geojsonLayer);
        }
      }
      geojsonLayer = null;
      const geojsons = prepareGeojson(boundaryData, filteredSelection, addOn);
      if (geojsons && geojsons.length > 0) {
        geojsonLayer = addGeojsonToMap(map, geojsons, t);
        newLayer.push(geojsonLayer);
        let bounds = findBounds(geojsons);
        if (bounds) map.fitBounds(bounds);
      }

      const childrenGeojson = prepareGeojson(boundary, childrenList, { ...addOn, opacity: 0, fillOpacity: 0, child: true });
      let childrenGeojsonLayer = addGeojsonToMap(map, childrenGeojson, t);
      if (childrenGeojsonLayer) newLayer.push(childrenGeojsonLayer);

      //filters
      const filterGeojsons = prepareGeojson(filterData, filteredSelection && filteredSelection.length !== 0 ? filteredSelection : "ALL", addOn);
      const filterGeojsonWithProperties = addFilterProperties(filterGeojsons, filterSelections, filterPropertyNames, state?.MapFilters);
      let filterGeojsonLayer = addGeojsonToMap(map, filterGeojsonWithProperties, t);
      if (filterGeojsonLayer) newLayer.push(filterGeojsonLayer);

      setLayer(newLayer);
    } catch (error) {
      console.error("Error while adding geojson to map: ", error.message);
    }
    setLoader(false);
  }, [boundarySelections, choroplethProperty, filterSelections]);

  useEffect(() => {
    // Fetch the GeoJSON data from the URL
    const fetchGeoJson = async () => {
      try {
        const response = await fetch(fileData?.url);
        const data = await response.json();
        setGeoJsonData(data);
      } catch (error) {
        console.error("Error fetching GeoJSON data:", error);
      }
    };

    fetchGeoJson();
  }, [fileData?.url]);

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
      <Header className="heading" styles={{ marginBottom: "1.5rem" }}>
        {t("MAPPING")}
      </Header>
      <Card className="mapping-body-container" style={{ margin: "0", padding: "0" }}>
        <Card className="map-container-main">
          <BoundaryFilter
            boundarySelections={boundarySelections}
            setBoundarySelections={setBoundarySelections}
            // boundaryData={boundaryData}
            // filterBoundaryRef={filterBoundaryRef}
            isboundarySelectionSelected={isboundarySelectionSelected}
            setIsboundarySelectionSelected={setIsboundarySelectionSelected}
            t={t}
            boundary={boundary}
            setBoundary={setBoundary}
            hierarchy={hierarchy}
          />
          <div ref={set__mapNode} className="map" id="map" style={{ height: "100vh", width: "100%", display: "inline-block", zIndex: "20" }}>
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
              {/* <FilterSection
                filterProperties={filterProperties}
                showFilterOptionRef={showFilterOptionRef}
                showFilterOptions={showFilterOptions}
                setShowFilterOptions={setShowFilterOptions}
                filterSelections={filterSelections}
                setFilterSelections={setFilterSelections}
                t={t}
              /> */}
              {filterProperties && Object.keys(filterProperties).length !== 0 && (
                <FilterSection
                  filterProperties={filterProperties}
                  showFilterOptionRef={showFilterOptionRef}
                  showFilterOptions={showFilterOptions}
                  setShowFilterOptions={setShowFilterOptions}
                  filterSelections={filterSelections}
                  setFilterSelections={setFilterSelections}
                  t={t}
                />
              )}
              <ChoroplethSelection
                choroplethProperties={choroplethProperties}
                showChoroplethOptions={showChoroplethOptions}
                setShowChoroplethOptions={setShowChoroplethOptions}
                showChoroplethOptionRef={showChoroplethOptionRef}
                choroplethProperty={choroplethProperty}
                setChoroplethProperty={setChoroplethProperty}
                t={t}
              />
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
      {/* {loader && <LoaderWithGap text={t(loader)} />} */}
    </>
  );
};

export default MapViewComponent;
