import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LatLngBounds } from "leaflet";
import { Loader,Chip } from "@egovernments/digit-ui-components";
import LatLongMap from "./LatLongMap";
import NoData from "../../NoData";
import GenericChart from "../../GenericChart";
import FilterContext from "../../FilterContext";
import { getTitleHeading } from "../../../utils/locale";
import { getQueryParam } from "../../../utils/getQueryParam";
import { isLevelOneBoundary } from "../../../utils/isLevelOneBoundary";

const LatLongMapChart = ({ data, chartName, pageZoom }) => {
  const { t } = useTranslation();
  const toFilterCase = (str) => {
    if (str) {
      return str.toLowerCase();
    }
  };
  const { value } = useContext(FilterContext);
  const copyOfValue = Object.assign({}, value);
  const chartId = data.charts.filter((c) => c.chartType === "points")?.[0].id;
  const subHeader = t(`SUB_${chartName}`);
  const boundaryType = getQueryParam("boundaryType");
  const boundaryValue = getQueryParam("boundaryValue");
  const boundaryLevelMap = Digit.SessionStorage.get("levelMap")
  const mapData = useRef({});
  const pointProps = useRef({});
  const tableData = useRef({});
  const [locationKeyState, setLocationKeyState] = useState("");

  const [filterStack, setFilterStack] = useState({value: copyOfValue});
  const [boundaryLevel, setBoundaryLevel] = useState(
    filterStack?.value?.filters?.boundaryType
      ? toFilterCase(filterStack.value.filters.boundaryType)
      : boundaryType
  );
  const [filterFeature, setFilterFeature] = useState(null);
  const projectSelected = Digit.SessionStorage.get("projectSelected");
  const boundaries = projectSelected?.boundaries;
  const nationalMap = boundaries?.[0]?.country?.[0]?.toLowerCase() || "national-map";
  const isLevelOne = isLevelOneBoundary(boundaryLevelMap, boundaryType);
  const filterBoundaryValue = filterStack?.value?.filters?.boundaryType;
  const [mapSelector, setMapSelector] = useState(
    !isLevelOne ?
    (
      filterBoundaryValue != null && filterBoundaryValue !== ''
      ? filterStack?.value?.filters?.[filterBoundaryValue]?.toLowerCase()
      : filterStack?.value?.filters?.[boundaryType]?.toLowerCase()
    )
    : nationalMap
  );
  const [drillDownChart, setDrillDownChart] = useState("none");
  const [chartKey, setChartKey] = useState(chartId);
  const [drillDownStack, setDrillDownStack] = useState([{ id: chartId, label: mapSelector, boundary: boundaryLevel }]);

  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const { campaignNumber } = Digit.Hooks.useQueryParams();

  useEffect(() => {
    setChartKey(chartId);
    return () => {
      setChartKey("");
    };
  }, [filterStack, chartId]);

  useEffect(() => {
    const boundaryLevel = filterStack?.value?.filters?.boundaryType;
    const boundaryName = filterStack?.value?.filters?.[boundaryLevel]
    if (
      boundaryLevel && boundaryLevelMap?.[boundaryLevel] != undefined && boundaryLevelMap?.[boundaryLevel] !== "level-one" ||
      boundaryLevelMap?.[boundaryType] != undefined && boundaryLevelMap?.[boundaryType] !== "level-one"
    ){
      setMapSelector(boundaryName ? boundaryName?.toLowerCase().replaceAll(" ", "_"): boundaryValue.toLowerCase().replaceAll(" ", "_"));
      setBoundaryLevel(toFilterCase(boundaryLevel ? boundaryLevel : boundaryType));

    }
  }, [filterStack]);

  useEffect(() => {
    if (drillDownStack?.length > 0) {
      setChartKey(drillDownStack[drillDownStack.length-1].id);
      setDrillDownChart("none");
    }
  }, [drillDownStack]);

  const { data: geoJsonConfig, isLoading: isGeoJsonLoading } = Digit.Hooks.useCustomMDMS(
    Digit?.ULBService?.getStateId(),
    "map-config",
    [{ name: "GeoJsonMapping" }],
    {},
    { schemaCode: "map-config.GeoJsonMapping" }
  );
   const { isLoading, data: mapConfigData } = Digit.Hooks.DSS.useDSSGeoJson(Digit?.ULBService?.getStateId(), "GeoJsonMapping", [mapSelector?.toLowerCase().replaceAll(" ", "_")], geoJsonConfig,{
    // Ensure the second query only runs if the first query is successful
    enabled: !isGeoJsonLoading
  });

  mapData.current = mapConfigData || {};

  const addlFilter = locationKeyState?.length ? { locationKey: locationKeyState.toUpperCase() } : {};

  const generateTable = (chart, value) => {
    const { id, chartType } = chart;
    const tenantId = Digit?.ULBService?.getCurrentTenantId();
    const aggregationRequestDto = {
      visualizationCode: id,
      visualizationType: chartType,
      queryType: "",
      requestDate: { ...value?.requestDate, startDate: value?.range?.startDate?.getTime(), endDate: value?.range?.endDate?.getTime() },
      filters: { ...value?.filters, campaignNumber: campaignNumber },
      aggregationFactors: null,
    };
    const { isLoading, data: response } = Digit.Hooks.DSS.useGetChartV2(aggregationRequestDto);

    if (isLoading) {
      return <Loader className={"digit-center-loader"}/>;
    }
    response?.responseData?.data?.forEach((d) => {
      let plotLabel = response?.responseData?.plotLabel;
      d?.plots?.forEach((p) => {
        let obj = {};
        let plotName = p.name;
        obj[plotLabel] = p.name;
        obj[d.headerName] = p.value;
        if (tableData.current.hasOwnProperty(plotName)) {
          tableData.current[plotName] = { ...tableData.current[plotName], ...obj };
        } else {
          tableData.current[plotName] = obj;
        }
      });
    });
  };

  const generateMarkers = (chart, value, addlFilter, tenantId) => {
    const chartId = chart?.id;
    const aggregationRequestDto = {
      visualizationCode: chartKey,
      visualizationType: "table",
      queryType: "",
      requestDate: { ...value?.requestDate, startDate: value?.range?.startDate?.getTime(), endDate: value?.range?.endDate?.getTime() },
      filters: {...filterStack?.value?.filters, ...filterFeature,campaignNumber:campaignNumber
      },
      aggregationFactors: null,
    };
    const { isLoading:isFetchingChart, data: response } = Digit.Hooks.DSS.useGetChartV2(aggregationRequestDto);


    useEffect(() => {
      setDrillDownChart(response?.responseData?.drillDownChartId || "none");
    }, [response]);

    const chartData = () => {
      let locationObject = {};
      response?.responseData?.data?.forEach((item) => {
        const value = item.plots?.filter((p) => p.symbol === "number" && p.name !== "latitude" && p.name !== "longitude")?.[0]?.value;
        locationObject[item.headerName?.toLowerCase()] = value;
      });
      return locationObject;
    };

    const markers = () => {
      let markersArray = [];
      let markersName = [];
      let showPoints = [];
      let boundaryNames = [];
      let tooltipString;
      mapData.current?.geoJSON?.features?.forEach((feature) => {
        const name = feature.properties?.name;
        const bounds = new LatLngBounds(feature.geometry?.coordinates);
        const origin = bounds.getCenter();
        [origin.lng, origin.lat] = [origin.lat, origin.lng];
        markersArray.push({ name, origin });
        markersName.push(name);
        boundaryNames.push(name);
      });

      response?.responseData?.data?.forEach((d) => {
        let obj = {
          name: d.plots.filter((p) => p.name !== "latitude" && p.name !== "longitude" && p.label !== null)?.[0]?.label,
          origin: {
            lat: d.plots.filter((p) => p.name === "latitude")?.[0]?.value,
            lng: d.plots.filter((p) => p.name === "longitude")?.[0]?.value,
          },
        };
        showPoints.push(obj.name);
        if (!markersName.includes(obj.name)) markersArray.push(obj);
        tooltipString =  d.plots.filter((p) => p.name !== "latitude" && p.name !== "longitude" && p.label !== null)?.[0].name
      });
      return { markersArray, showPoints, boundaryNames , tooltipString};
    };

    pointProps.current = { isFetchingChart, chartData: chartData(), markers: markers() };
  };

  const removeDrillStack = (id) => {
    if(filterFeature) {setFilterFeature(null)};
    const removedDrillStack = drillDownStack.filter((filter, index) => index>=id);
    const newDrillStack  = drillDownStack.filter((filter, index) => index<id);
    setDrillDownStack(newDrillStack);
    const lastChart = newDrillStack[newDrillStack.length-1].id;
    setChartKey(lastChart);
    setMapSelector(newDrillStack[newDrillStack.length-1].label);
    
    let finalFilterStack  = {...filterStack};
    removedDrillStack.map((filter, index) => {
      delete finalFilterStack?.value.filters[filter.boundary];
    })
    delete finalFilterStack?.value.filters.boundaryType;
    if (Object.keys(finalFilterStack.value.filters).length === 0) {
      finalFilterStack.value = undefined;
    }
    setFilterStack(finalFilterStack);
  }
  
  const RemovableFilters = () => {
    return (
      <React.Fragment>
        {drillDownStack?.length > 1 && (
          <div className="digit-tag-container">
            <div className="digit-tag-filter-text">{t("DSS_FILTERS_APPLIED")}: </div>
            {drillDownStack.map((filter, id) =>
              id > 0 ? (
                <Chip
                  key={id}
                  hideClose={false}
                  text={`${t(`DSS_HEADER_${Digit.Utils.locale.getTransformedLocale(filter.boundary)}`)}: ${filter.label && getTitleHeading(filter.label)}`}
                  onClick={() => {
                    removeDrillStack(id)
                  }}
                />
              ) : null
            )}
          </div>
        )}
      </React.Fragment>
    );
  };

  data?.charts?.forEach((chart) => {
    chart?.chartType === "points" ? generateMarkers(chart, value, addlFilter, tenantId) : generateTable(chart, value);
  });
  const renderMap = () => {
    if (pointProps.current.isFetchingChart || isLoading) {
      return <Loader className={"digit-center-loader"}/>;
    }

    const data = pointProps.current.chartData;
    if (Object.keys(mapData.current).length === 0 ) {
      return <NoData t={t} />;
    }

    return (
      <React.Fragment>
        <RemovableFilters />
        <LatLongMap
          chartId={chartId}
          isFetchingChart={pointProps.current.isFetchingChart}
          isLoading={isLoading}
          mapData={mapData.current}
          chartData={pointProps.current.chartData}
          markers={pointProps.current.markers}
          // setLocationKeyState={setLocationKeyState}
          filterFeature={filterFeature}
          setFilterFeature={setFilterFeature}
          tableData={tableData.current}
          pageZoom={pageZoom}
          drillDownChart={drillDownChart}
          setDrillDownStack={setDrillDownStack}
          setChartKey={setChartKey}
          filterStack={filterStack}
          setFilterStack={setFilterStack}
          setBoundaryLevel={setBoundaryLevel}
        />
      </React.Fragment>
    );
  };

  const Wrapper = () => {
    return (
      <GenericChart key={chartId} header={chartName} subHeader={subHeader}>
        <div>{renderMap()}</div>
      </GenericChart>
    );
  };

  return <Wrapper />;
};

export default LatLongMapChart;