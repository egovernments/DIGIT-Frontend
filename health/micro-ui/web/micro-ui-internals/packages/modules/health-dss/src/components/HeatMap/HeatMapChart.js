// import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { LatLngBounds } from "leaflet";
// import { Loader, RemoveableTag } from "@egovernments/digit-ui-react-components";
// import Map from "./Map";
// import { ResponsiveContainer } from "recharts";
// import { NoResultsFound } from "@egovernments/digit-ui-components";
// import GenericChart from "../GenericCharts";

// export default function HeatMapChart({ chartId, visualizer, initialRange, isNational, showLabel, pageZoom }) {
//   const { t } = useTranslation();
//   const toFilterCase = (str) => {
//     if (str) {
//       return str.charAt(0)?.toLowerCase() + str.slice(1);
//     }
//   };
//   const { value } = useContext(FilterContext);
//   const copyOfValue = Object.assign({}, value);
//   const subHeader = t(`SUB_${visualizer?.name}`);

//   const mapData = useRef({});
//   const [locationKeyState, setLocationKeyState] = useState("");
//   const [filterStack, setFilterStack] = useState({ value: copyOfValue });
//   const [boundaryLevel, setBoundaryLevel] = useState(
//     filterStack?.value?.filters?.district ? toFilterCase(Digit.Enums.BoundaryTypes.DISTRICT) :
//       filterStack?.value?.filters?.province ? toFilterCase(Digit.Enums.BoundaryTypes.PROVINCE) :
//         toFilterCase(Digit.Enums.BoundaryTypes.NATIONAL));
//   const [filterFeature, setFilterFeature] = useState(null);
//   const campaignInfo = Digit.SessionStorage.get("campaigns-info");
//   const campaignCode = Object.keys(campaignInfo)?.[0];
//   const nationalMap = campaignInfo?.[campaignCode]?.[0]?.boundaries?.country?.[0]?.toLowerCase() || "national-map";
//   const [mapSelector, setMapSelector] = useState(filterStack?.value?.filters?.district ? filterStack?.value?.filters?.district?.toLowerCase() : filterStack?.value?.filters?.province ? filterStack?.value?.filters?.province?.toLowerCase() : nationalMap);
//   const [drillDownChart, setDrillDownChart] = useState("none");
//   const [chartKey, setChartKey] = useState(chartId);
//   const [drillDownStack, setDrillDownStack] = useState([{ id: chartId, label: mapSelector, boundary: boundaryLevel }]);
//   const { projectTypeId } = Digit.Hooks.useQueryParams();
//   const selectedProjectTypeId = projectTypeId ? projectTypeId : Digit.SessionStorage.get("selectedProjectTypeId");

//   useEffect(() => {
//     setChartKey(chartId);
//     return () => {
//       setChartKey("");
//     };
//   }, [filterStack, chartId]);

//   useEffect(() => {
//     const province = filterStack?.value?.filters?.province;
//     const district = filterStack?.value?.filters?.district;
//     if (district) {
//       setMapSelector(district?.toLowerCase().replaceAll(" ", "_"));
//       setBoundaryLevel(toFilterCase(Digit.Enums.BoundaryTypes.DISTRICT))
//     } else if (province) {
//       setMapSelector(province?.toLowerCase().replaceAll(" ", "_"));
//       setBoundaryLevel(toFilterCase(Digit.Enums.BoundaryTypes.PROVINCE))
//     }
//   }, [filterStack])

//   useEffect(() => {
//     if (drillDownStack?.length > 0) {
//       setChartKey(drillDownStack[drillDownStack.length - 1].id);
//       setDrillDownChart("none");
//     }
//   }, [drillDownStack]);

//   //TODO: Replace this with the values from the campaign interval
//   const getInitialRange = () => {
//     if (initialRange) {
//       return initialRange;
//     }

//     const data = Digit.SessionStorage.get("DSS_FILTERS");
//     const startDate = data?.range?.startDate ? new Date(data?.range?.startDate) : Digit.Utils.dss.getDefaultFinacialYear().startDate;
//     const endDate = data?.range?.endDate ? new Date(data?.range?.endDate) : Digit.Utils.dss.getDefaultFinacialYear().endDate;
//     const interval = Digit.Utils.dss.getDuration(startDate, endDate);
//     return { startDate, endDate, interval };
//   };

//   const tenantId = Digit.ULBService.getCurrentTenantId();
//   const { startDate, endDate, interval } = getInitialRange();
//   const requestDate = {
//     startDate: startDate.getTime(),
//     endDate: endDate.getTime(),
//     interval: interval,
//     title: "home",
//   };

//   const { data: geoJsonConfig, isLoading: isGeoJsonLoading } = Digit.Hooks.dss.useMDMS(Digit.ULBService.getStateId(), "map-config", "GeoJson")
//   const { isLoading, data } = Digit.Hooks.dss.useDSSGeoJson(Digit.ULBService.getStateId(), "GeoJsonMapping", [mapSelector?.toLowerCase().replaceAll(" ", "_")], geoJsonConfig, {
//     // Ensure the second query only runs if the first query is successful
//     enabled: !isGeoJsonLoading
//   });

//   mapData.current = data || {};

//   const toTitleCase = (str) => {
//     if (str) {
//       return str.charAt(0).toUpperCase() + str.slice(1);
//     }
//   };

//   const addlFilter = locationKeyState?.length ? { locationKey: locationKeyState.toUpperCase() } : {};
//   const { isLoading: isFetchingChart, data: response } = Digit.Hooks.dss.useGetChart({
//     key: chartKey,
//     type: "table",
//     tenantId,
//     requestDate: requestDate,
//     filters: {
//       ...filterStack?.value?.filters, ...filterFeature,
//       projectTypeId: selectedProjectTypeId
//     },
//   });

//   useEffect(() => {
//     setDrillDownChart(response?.responseData?.drillDownChartId || "none");
//   }, [response]);

//   const chartData = useCallback(() => {
//     let locationObject = {};

//     response?.responseData?.data?.forEach((item) => {
//       const value = item.plots?.filter((p) => p.symbol === "percentage")?.[0]?.value;
//       locationObject[Digit.Utils.locale.getTitleHeading(item.headerName)] = value;
//     });

//     return locationObject;
//   }, [response]);


//   const markers = useCallback(() => {
//     return mapData.current?.geoJSON?.features?.map((feature) => {
//       const name = feature.properties?.name?.toLowerCase();

//       const bounds = new LatLngBounds(feature.geometry?.coordinates);
//       const origin = bounds.getCenter();

//       return { name, origin };
//     });
//   }, [mapData]);

//   const GradientScale = () => {
//     const range = (value) => {
//       return <div style={{ width: "5%", textAlign: "center" }}>{`${value}%`}</div>;
//     };

//     if (isLoading || isFetchingChart) return null;

//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           marginLeft: "auto",
//           marginRight: "auto",
//           marginTop: "20px",
//           alignItems: "center",
//           width: "100%",
//         }}
//       >
//         {range("0")}
//         <div
//           style={{
//             height: "14px",
//             background: "linear-gradient(270deg, #01D66F 0%, #FFC42E 46.03%, #FF7373 101.5%)",
//             width: "90%",
//             marginLeft: "10px",
//             marginRight: "10px",
//           }}
//         ></div>
//         {range("100")}
//       </div>
//     );
//   };

//   const removeDrillStack = (id) => {
//     if (filterFeature) { setFilterFeature(null) };
//     const removedDrillStack = drillDownStack.filter((filter, index) => index >= id);
//     const newDrillStack = drillDownStack.filter((filter, index) => index < id);
//     setDrillDownStack(newDrillStack);
//     const lastChart = newDrillStack[newDrillStack.length - 1].id;
//     setChartKey(lastChart);
//     setMapSelector(newDrillStack[newDrillStack.length - 1].label);

//     let finalFilterStack = { ...filterStack };
//     removedDrillStack.map((filter, index) => {
//       delete finalFilterStack?.value.filters[filter.boundary?.toLowerCase()];
//     })
//     if (Object.keys(finalFilterStack.value.filters).length === 0) {
//       finalFilterStack.value = undefined;
//     }
//     setFilterStack(finalFilterStack);
//   }
//   const RemovableFilters = () => {
//     return (
//       <React.Fragment>
//         {drillDownStack?.length > 1 && (
//           <div className="tag-container">
//             <span style={{ marginTop: "20px" }}>{t("DSS_FILTERS_APPLIED")}: </span>
//             {drillDownStack.map((filter, id) =>
//               id > 0 ? (
//                 <RemoveableTag
//                   key={id}
//                   text={`${t(`DSS_HEADER_${Digit.Utils.locale.getTransformedLocale(filter.boundary)}`)}: ${filter.label && Digit.Utils.locale.getTitleHeading(filter.label)}`}
//                   onClick={() => {
//                     removeDrillStack(id)
//                   }}
//                 />
//               ) : null
//             )}
//           </div>
//         )}
//       </React.Fragment>
//     );
//   };

//   const renderMap = () => {
//     if (isFetchingChart || isLoading) {
//       return <Loader />;
//     }

//     const data = chartData();

//     if (Object.keys(mapData.current).length === 0) {
//       return <ResponsiveContainer width="99%" height={400}>
//         <RemovableFilters />
//         <NoResultsFound />
//       </ResponsiveContainer>;
//     }

//     return (
//       <React.Fragment>
//         <RemovableFilters />
//         <Map
//           chartId={chartId}
//           isFetchingChart={isFetchingChart}
//           isLoading={isLoading}
//           mapData={mapData.current}
//           chartData={data}
//           markers={markers()}
//           drillDownChart={drillDownChart}
//           setDrillDownStack={setDrillDownStack}
//           setChartKey={setChartKey}
//           // insightsResults={insightsResults}
//           showLabel={showLabel}
//           filterFeature={filterFeature}
//           setFilterFeature={setFilterFeature}
//           pageZoom={pageZoom}
//           filterStack={filterStack}
//           setFilterStack={setFilterStack}
//           setBoundaryLevel={setBoundaryLevel}
//         />
//         <GradientScale />
//       </React.Fragment>
//     );
//   };

//   const Wrapper = () => {
//     if (isNational) {
//       return (
//         <GenericChart
//           key={chartId}
//           header={visualizer?.name}
//           subHeader={subHeader !== `SUB_${visualizer?.name}` ? subHeader : ""}
//           className={"dss-card-parent heatMap"}
//         >
//           <div>{renderMap()}</div>
//         </GenericChart>
//       );
//     }

//     return <div>{renderMap()}</div>;
//   };

//   return <Wrapper />;
// }