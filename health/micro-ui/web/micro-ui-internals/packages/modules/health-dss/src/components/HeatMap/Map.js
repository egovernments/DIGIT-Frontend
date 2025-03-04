// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { scaleQuantile } from "d3-scale";
// import ReactTooltip from "react-tooltip";
// import { ZoomableGroup, Geographies, ComposableMap, Geography, Marker } from "react-simple-maps";
// import { ReceiptIcon } from "@egovernments/digit-ui-react-components";

// const Map = ({
//     chartId,
//     mapData,
//     chartData,
//     markers,
//     drillDownChart,
//     setDrillDownStack,
//     setChartKey,
//     // insightsResults,
//     showLabel,
//     filterFeature,
//     setFilterFeature,
//     pageZoom,
//     filterStack,
//     setFilterStack,
//     setBoundaryLevel
// }) => {
//     const { t } = useTranslation();
//     const [geoJSONData, setGeoJSONData] = useState(null);
//     const [mapStyle, setMapStyle] = useState({});
//     const [zoom, setZoom] = useState({
//         current: 0,
//         min: 0,
//         max: 0,
//     });
//     const [toolTipContent, setTooltipContent] = useState("");
//     const isMobile = window.Digit.Utils.browser.isMobile();

//     const colorScale = scaleQuantile().domain([0, 100]).range(["#FF7373", "#FF8565", "#FFC42E", "#FFAA45", "#9ACC49", "#01D66F"]);

//     useEffect(() => {
//         if (mapData == {}) return;

//         const { center, zoomLevels, geoJSON, fontSize } = mapData;

//         if (isMobile) {
//             setMapStyle({ fontSize: fontSize?.mobile });

//             setZoom({
//                 current: zoomLevels?.default,
//                 min: zoomLevels?.minZoom - 10,
//                 max: zoomLevels?.maxZoom + 20,
//                 coordinates: center,
//             });
//         } else {
//             setMapStyle({ fontSize: fontSize?.desktop });
//         }

//         setZoom({
//             current: zoomLevels?.minZoom,
//             min: zoomLevels?.minZoom,
//             max: zoomLevels?.maxZoom,
//             coordinates: center,
//         });

//         setGeoJSONData(geoJSON);
//     }, [mapData, chartData, isMobile]);

//     const ZoomButtons = () => {
//         const button = (label) => {
//             const handleZoomIn = () => {
//                 const increment = zoom.current + 4;
//                 if (increment > zoom.max) {
//                     setZoom((prev) => {
//                         return { ...prev, current: zoom.max };
//                     });
//                     return;
//                 }

//                 setZoom((prev) => {
//                     return { ...prev, current: increment };
//                 });
//             };

//             const handleZoomOut = () => {
//                 const decrement = zoom.current - 4;
//                 if (decrement < zoom.min) {
//                     setZoom((prev) => {
//                         return { ...prev, current: zoom.min };
//                     });
//                     return;
//                 }

//                 setZoom((prev) => {
//                     return { ...prev, current: decrement };
//                 });
//             };

//             return (
//                 <button
//                     style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         justifyContent: "center",
//                         alignItems: "center",
//                         padding: "5px 10px",
//                         width: "100%",
//                         background: "#FFFFFF",
//                         border: "1px solid #D6D5D4",
//                         boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.16)",
//                         color: "#F47738",
//                         fontWeight: "700",
//                         fontSize: "16px",
//                         cursor: "pointer",
//                     }}
//                     onClick={() => {
//                         if (label === "+") {
//                             handleZoomIn();
//                         } else {
//                             handleZoomOut();
//                         }
//                     }}
//                 >
//                     {label}
//                 </button>
//             );
//         };

//         return (
//             <div
//                 style={{
//                     display: "flex",
//                     justifyContent: "end",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     marginBottom: "24px",
//                     marginRight: "24px"
//                 }}
//             >
//                 {button("+")}
//                 {button("-")}
//             </div>
//         );
//     };


//     const Recentre = () => {
//         const recentreHandler = () => {
//             setZoom((prev) => {
//                 return { ...prev, coordinates: mapData.center };
//             });
//         }
//         return (
//             <div style={{
//                 display: "flex",
//                 marginBottom: "24px",
//                 marginLeft: "24px",
//                 cursor: "pointer"
//             }} >
//                 <div style={{ border: "1px solid #F47738", display: "flex", flexDirection: "row", whiteSpace: "nowrap" }} onClick={() => { recentreHandler(); }}>
//                     <div style={{ margin: "9px" }}><ReceiptIcon></ReceiptIcon></div>
//                     <div style={{ color: "#F47738", fontSize: "12px", fontWeight: 700, margin: "9px", textAlign: "center", whiteSpace: "nowrap" }}>{t("DSS_MAP_RECENTRE")}</div>
//                 </div>
//             </div>)
//     }
//     const formatPercentage = (value) => {
//         // const formatter = new Intl.NumberFormat("en-IN", { maximumSignificantDigits: 3 });
//         // const formattedValue = `${formatter.format(value?.toFixed(2))}%`;
//         const formattedValue = Digit.Utils.dss.formatter(value, "percentage", value?.denomination, true, t);
//         return formattedValue;
//     };

//     const tooltip = (dataTip) => {
//         if (isMobile) return;

//         if (!dataTip) {
//             return null;
//         }

//         const formattedName = Digit.Utils.locale.getTitleHeading(dataTip.name);
//         // let showInsights = false;
//         // if (dataTip.indicator) {
//         //   showInsights = true;
//         // }
//         // const indicatorMap = {
//         //   positive: ArrowUpwardElement("10px"),
//         //   negative: ArrowDownwardElement("10px"),
//         //   no_diff: t(`DSS_HEALTH_INSIGHT_SAME_AS_YESTERDAY`),
//         // };
//         return (
//             <div
//                 style={{
//                     display: "flex",
//                     padding: "5px",
//                     justifyContent: "center",
//                     alignItems: "center",
//                 }}
//             >
//                 <div style={{ fontWeight: 700, fontSize: "16px", margin: "10px" }}>{formattedName}</div>
//                 {
//                     dataTip.value !== undefined ? <div>{formatPercentage(dataTip.value)}</div> : null
//                 }
//                 {/* {showInsights ? (
//           <React.Fragment>
//             <div style={{ fontWeight: 400, fontSize: "16px", margin: "10px" }}>{dataTip.indicator !== "no_diff" ? formatPercentage(dataTip.insightValue): null}</div>
//             {chartData.hasOwnProperty(formattedName.toLowerCase()) && <div style={{ margin: "10px" }}>{formatPercentage(chartData[formattedName.toLowerCase()])}</div>}
//             <div style={{ margin: "10px", fontWeight: 400, fontSize: "16px" }}>
//               {dataTip.indicator !== "no_diff" ? t(`DSS_HEALTH_INSIGHTS_THAN_YESTERDAY`) : null}
//             </div>
//           </React.Fragment>
//         ) : null} */}
//             </div>
//         );
//     };

//     const toFilterCase = (str) => {
//         if (str) {
//             return str.charAt(0).toLowerCase() + str.slice(1);
//         }
//     };

//     const drillDown = (name, value, level, hasCoordinatesDown) => {
//         if (drillDownChart === "none") return;
//         if (!hasCoordinatesDown) {
//             if (level === 4) {
//                 setFilterFeature({ finalFilter: name })
//             } else return;
//         }

//         if (level === 2) {
//             let dummy = { ...filterStack };
//             if (dummy.value == undefined || Object.keys(dummy.value).length == 0) {
//                 dummy.value = { "filters": { province: name } }
//             }
//             setFilterStack(dummy);
//             setBoundaryLevel(toFilterCase(Digit.Enums.BoundaryTypes.PROVINCE))
//         }

//         if (level === 3) {
//             let dummy = { ...filterStack };
//             dummy.value.filters = { ...dummy.value.filters, district: name }
//             setFilterStack(dummy);
//             setBoundaryLevel(toFilterCase(Digit.Enums.BoundaryTypes.DISTRICT))
//         }

//         setChartKey(drillDownChart);
//         setDrillDownStack((prev) => {
//             return [...prev, {
//                 id: drillDownChart, label: name, boundary: level === 2 ? toFilterCase(Digit.Enums.BoundaryTypes.PROVINCE) :
//                     level === 3 ? toFilterCase(Digit.Enums.BoundaryTypes.DISTRICT) :
//                         level === 4 ? toFilterCase(Digit.Enums.BoundaryTypes.ADMINISTRATIVE_PROVINCE) : ""
//             }];
//         });
//     };

//     return (
//         <div
//             key={chartId}
//             style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 marginTop: "24px",
//                 border: "1px solid #D6D5D4",
//                 borderRadius: "4px",
//                 width: "100%",
//                 height: "480px",
//             }}
//         >
//             <div
//                 style={{ width: "90%", display: "flex", flexDirection: "column", zoom: pageZoom ? 1 : 1.25 }}
//             >
//                 {geoJSONData ? (
//                     <React.Fragment>
//                         <ReactTooltip id={`tooltip-for-${chartId}`} border={true} type={"light"}>
//                             {tooltip(toolTipContent)}
//                         </ReactTooltip>
//                         <ComposableMap
//                             projection="geoMercator"
//                             data-tip=""
//                             data-for={`tooltip-for-${chartId}`}
//                             projectionConfig={{
//                                 scale: isMobile ? 300 : 100,
//                             }}
//                             width={800}
//                             height={400}
//                             style={{ width: "100%", height: "100%" }}
//                         >
//                             <ZoomableGroup
//                                 center={zoom?.coordinates}
//                                 zoom={zoom?.current}
//                                 minZoom={zoom?.min}
//                                 maxZoom={zoom?.max}
//                                 onMoveEnd={(d) => {
//                                     setZoom((prev) => {
//                                         return {
//                                             ...prev,
//                                             current: d.zoom,
//                                             coordinates: d.coordinates,
//                                         };
//                                     });
//                                 }}
//                             >
//                                 <Geographies geography={geoJSONData}>
//                                     {({ geographies }) => {
//                                         return geographies.map((geo) => {
//                                             const locationName = Digit.Utils.locale.getTitleHeading(geo.properties?.name);
//                                             const level = geo.properties?.level;
//                                             const hasCoordinatesDown = geo.properties?.hasCoordinatesDown;
//                                             if (filterFeature && filterFeature.finalFilter !== locationName) {
//                                                 return null;
//                                             }

//                                             const value = chartData?.[locationName];
//                                             let cursor = "pointer",
//                                                 stroke = "#C6C6C6";

//                                             if (value && drillDownChart !== "none") {
//                                                 stroke = "#737276";
//                                             }

//                                             return (
//                                                 <Geography
//                                                     key={geo.rsmKey}
//                                                     geography={geo}
//                                                     strokeWidth={0.03}
//                                                     fill={value !== undefined ? colorScale(value) : "#F0E8E8"}
//                                                     stroke="#C6C6C6"
//                                                     style={{
//                                                         default: { outline: "none" },
//                                                         hover: { outline: "none", stroke, cursor },
//                                                         pressed: { outline: "none" },
//                                                     }}
//                                                     onClick={() => {
//                                                         drillDown(locationName, value, level, hasCoordinatesDown);
//                                                     }}
//                                                     onMouseEnter={() => {
//                                                         // const insight = insightsResults[locationName];
//                                                         setTooltipContent({
//                                                             name: locationName,
//                                                             value: chartData?.[locationName],
//                                                             // insightValue: insight?.insightValue,
//                                                             // indicator: insight?.indicator,
//                                                         });
//                                                     }}
//                                                     onMouseLeave={() => {
//                                                         setTooltipContent("");
//                                                     }}
//                                                 />
//                                             );
//                                         });
//                                     }}
//                                 </Geographies>
//                                 {/* {markers.map(({ name, origin }) => {
//                   const value = chartData[name];
//                   if (filterFeature && filterFeature !== name) {
//                     return null;
//                   }
//                   if (value > -1) {
//                     const formattedValue = formatPercentage(value);
//                     return (
//                       <Marker
//                         key={name}
//                         cursor={value ? "pointer" : "default"}
//                         coordinates={[origin.lat, origin.lng]}
//                         onMouseEnter={() => {
//                           const insight = insightsResults[name];
//                           setTooltipContent({
//                             name,
//                             insightValue: insight?.insightValue,
//                             indicator: insight?.indicator,
//                           });
//                         }}
//                         onMouseLeave={() => {
//                           setTooltipContent("");
//                         }}
//                         onClick={() => {
//                           drillDown(name, value);
//                         }}
//                       >
//                         <text textAnchor="middle" style={{ fill: "#505A5F", fontSize: mapStyle?.fontSize || "10%" }}>
//                           {formattedValue}
//                         </text>
//                         {showLabel && name ? (
//                           <text
//                             textAnchor="middle"
//                             style={{ fill: "#505A5F", fontSize: mapStyle?.fontSize || "0.2px", transform: "translateY(0.3px)" }}
//                           >
//                             {name[0].toUpperCase() + name.slice(1)}
//                           </text>
//                         ) : null}
//                       </Marker>
//                     );
//                   }
//                 })} */}
//                             </ZoomableGroup>
//                         </ComposableMap>
//                     </React.Fragment>
//                 ) : null}
//                 <Recentre />
//             </div>
//             <ZoomButtons />
//         </div>
//     );
// };

// export default Map;