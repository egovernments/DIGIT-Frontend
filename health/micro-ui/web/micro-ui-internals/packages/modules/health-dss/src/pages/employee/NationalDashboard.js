import { Header, Loader } from "@egovernments/digit-ui-components";
import { DownloadIcon, DownloadImgIcon, EmailIcon, WhatsappIcon } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import MatricWrapper from "../../components/MatricWrapper";
import GenericChart from "../../components/GenericCharts";
import TableData from "../../components/tableData";
import VennDiagram from "../../components/VenDiagram";
import CustomHorizontalBarChart from "../../components/HorizontalBarChart";
import CustomPieChart from "../../components/PieChart";
import HeatMapChart from "../../components/HeatMap/HeatMapChart";

const NationalDashboard = ({ stateCode }) => {
    const location = useLocation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const { t } = useTranslation();
    const [filters, setFilters] = useState(() => { });
    const moduleCode = location.pathname.split("/").pop();
    console.log(moduleCode, "moduleCode");
    const { projectTypeId } = Digit.Hooks.useQueryParams();
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [showDownloadOptions, setShowDownloadOptions] = useState(false);
    const [selectedState, setselectedState] = useState("");
    const [drillDownId, setdrillDownId] = useState("none");
    const [totalCount, setTotalCount] = useState("");
    const [liveCount, setLiveCount] = useState("");
    const [searchQuery, onSearch] = useState("");
    const [pageZoom, setPageZoom] = useState(false);

    console.log(Digit.Hooks.DSS, "Digit.Hooks.DSS");

    const { data: response, isLoading } = Digit.Hooks.DSS.useDashboardConfig(moduleCode);

    useEffect(() => {
        if (showDownloadOptions === false) {
            setPageZoom(true);
            const timeoutId = setTimeout(() => {
                setPageZoom(false);
            }, 2000);

            return () => clearTimeout(timeoutId);
        }
    }, [showDownloadOptions])
    const handleFilters = (data) => {
        Digit.SessionStorage.set(key, data);
        setFilters(data);
    };
    function routeTo(jumpTo) {
        location.href = jumpTo;
    }
    const fullPageRef = useRef();
    const provided = useMemo(
        () => ({
            value: filters,
            setValue: handleFilters,
        }),
        [filters]
    );

    const mobileView = innerWidth <= 640;

    const handlePrint = () => Digit.Download.PDF(fullPageRef, t(dashboardConfig?.[0]?.name));

    const dashboardConfig = response?.responseData;

    const shareOptions = navigator.share
        ? [
            {
                label: t("ES_DSS_SHARE_PDF"),
                onClick: () => {
                    setShowShareOptions(!showShareOptions);
                    setTimeout(() => {
                        return Digit.ShareFiles.PDF(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name));
                    }, 500);
                },
            },
            {
                label: t("ES_DSS_SHARE_IMAGE"),
                onClick: () => {
                    setShowShareOptions(!showShareOptions);
                    setTimeout(() => {
                        return Digit.ShareFiles.Image(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name));
                    }, 500);
                },
            },
        ]
        : [
            {
                icon: <EmailIcon />,
                label: t("ES_DSS_SHARE_PDF"),
                onClick: () => {
                    setShowShareOptions(!showShareOptions);
                    setTimeout(() => {
                        return Digit.ShareFiles.PDF(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name), "mail");
                    }, 500);
                },
            },
            {
                icon: <WhatsappIcon />,
                label: t("ES_DSS_SHARE_PDF"),
                onClick: () => {
                    setShowShareOptions(!showShareOptions);
                    setTimeout(() => {
                        return Digit.ShareFiles.PDF(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name), "whatsapp");
                    }, 500);
                },
            },
            {
                icon: <EmailIcon />,
                label: t("ES_DSS_SHARE_IMAGE"),
                onClick: () => {
                    setShowShareOptions(!showShareOptions);
                    setTimeout(() => {
                        return Digit.ShareFiles.Image(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name), "mail");
                    }, 500);
                },
            },
            {
                icon: <WhatsappIcon />,
                label: t("ES_DSS_SHARE_IMAGE"),
                onClick: () => {
                    setShowShareOptions(!showShareOptions);
                    setTimeout(() => {
                        return Digit.ShareFiles.Image(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name), "whatsapp");
                    }, 500);
                },
            },
        ];

    const downloadOptions = [
        {
            icon: <DownloadImgIcon />,
            label: t("ES_DSS_DOWNLOAD_IMAGE"),
            onClick: () => {
                setShowDownloadOptions(!showDownloadOptions);
                setTimeout(() => {
                    return Digit.Download.Image(fullPageRef, t(dashboardConfig?.[0]?.name));
                }, 500);
            },
        },
        {
            icon: <DownloadIcon />,
            label: t("ES_DSS_DOWNLOAD_PDF"),
            onClick: () => {
                setShowDownloadOptions(!showDownloadOptions);
                setTimeout(() => {
                    return Digit.Download.PDF(fullPageRef, t(dashboardConfig?.[0]?.name));
                }, 500);
            },
        },
    ];

    if (isLoading) {
        return <Loader />;
    }

    return (
        // <FilterContext.Provider value={provided}>

        <div ref={fullPageRef}>
            <div className="options">
                <Header styles={{ marginBottom: "0px" }}>{t(dashboardConfig?.[0]?.name)}</Header>
                {/* {mobileView ? null : (
                    <div>
                        <div className="mrlg" >
                            <MultiLink
                                className="multilink-block-wrapper"
                                label={t(`ES_DSS_SHARE`)}
                                icon={<ShareIcon className="mrsm" />}
                                showOptions={(e) => setShowShareOptions(e)}
                                onHeadClick={(e) => setShowShareOptions(e !== undefined ? e : !showShareOptions)}
                                displayOptions={showShareOptions}
                                options={shareOptions}
                            />
                        </div>
                        <div className="mrsm" >
                            <MultiLink
                                className="multilink-block-wrapper"
                                label={t(`ES_DSS_DOWNLOAD`)}
                                icon={<DownloadIcon className="mrsm" />}
                                showOptions={(e) => setShowDownloadOptions(e)}
                                onHeadClick={(e) => setShowDownloadOptions(e !== undefined ? e : !showDownloadOptions)}
                                displayOptions={showDownloadOptions}
                                options={downloadOptions}
                            />
                        </div>
                    </div>
                )} */}
            </div>

            {/* {mobileView ? (
                <div className="options-m">
                    <div>
                        <MultiLink
                            className="multilink-block-wrapper"
                            label={t(`ES_DSS_SHARE`)}
                            icon={<ShareIcon className="mrsm" />}
                            showOptions={(e) => setShowShareOptions(e)}
                            onHeadClick={(e) => setShowShareOptions(e !== undefined ? e : !showShareOptions)}
                            displayOptions={showShareOptions}
                            options={shareOptions}
                        />
                    </div>
                    <div onClick={handlePrint}>
                        <DownloadIcon />
                        {t(`ES_DSS_DOWNLOAD`)}
                    </div>
                </div>
            ) : null} */}
            {dashboardConfig?.[0]?.visualizations?.map((row, key) => {
                return (
                    <div key={key} style={{ display: "flex", gap: "1.5rem", flexDirection: "row", marginTop: "1.5rem" }}>
                        {row.vizArray.map((item, index) => {

                            // if (item?.charts?.[0]?.chartType == "bar") {
                            //     return null;
                            // } else if (item?.charts?.[0]?.chartType === "heatmap") {
                            //     return <HeatMapChart initialRange={getInitialRange()} visualizer={item} chartId={item?.charts?.[0].id} isNational={true} pageZoom={pageZoom} />;
                            // } else if (item?.vizType === "stacked-table") {
                            //     return (
                            //         <StackedTable
                            //             visualizer={item}
                            //             chartId={item?.charts?.[0].id}
                            //             isNational={true}
                            //             routeTo={routeTo}
                            //             redirectUrl={item?.ref?.url}
                            //             initialRange={getInitialRange()}
                            //         ></StackedTable>
                            //     );
                            // } else if (item?.charts?.[0]?.chartType == "map") {
                            //     return (
                            //         <div
                            //             className={`dss-card-parent  ${item.vizType == "collection"
                            //                 ? "w-100"
                            //                 : item.name.includes("PROJECT_STAUS") || item.name.includes("LIVE_ACTIVE_ULBS")
                            //                     ? "dss-h-100"
                            //                     : ""
                            //                 }`}
                            //             style={item.vizType == "collection" ? { backgroundColor: "#fff", height: "600px" } : { backgroundColor: colors[index].light }}
                            //             key={index}
                            //         >
                            //             <div
                            //                 style={{
                            //                     display: "flex",
                            //                     flexDirection: "row",
                            //                     justifyContent: "space-between",
                            //                 }}
                            //             >
                            //                 <div className="dss-card-header">
                            //                     {Icon(item.name)}
                            //                     <p style={{ marginLeft: "20px" }}>
                            //                         {selectedState === "" ? t(item.name) : t(`DSS_TB_${Digit.Utils.locale.getTransformedLocale(selectedState)}`)}
                            //                     </p>
                            //                     {selectedState != "" && item.name.includes("PROJECT_STAUS") && (
                            //                         <span style={{ fontSize: "14px", display: "block" }}>
                            //                             {t(`DSS_TOTAL_ULBS`)} {Number(totalCount).toFixed()} | {t(`DSS_LIVE_ULBS`)} {Number(liveCount).toFixed()}
                            //                         </span>
                            //                     )}
                            //                 </div>
                            //                 {item?.charts?.[0]?.chartType == "map" && (
                            //                     <div className="dss-card-header" style={{ width: "45%" }}>
                            //                         {Icon(row.vizArray?.[1]?.name)}
                            //                         <p style={{ marginLeft: "20px", fontSize: "24px", fontFamily: "Roboto, sans-serif", fontWeight: 500, color: "#000000" }}>
                            //                             {selectedState === ""
                            //                                 ? t(row.vizArray?.[1]?.name)
                            //                                 : t(`${Digit.Utils.locale.getTransformedLocale(selectedState)}_${row.vizArray?.[1]?.name}`)}
                            //                         </p>
                            //                     </div>
                            //                 )}
                            //             </div>
                            //             <div className="dss-card-body">
                            //                 {item?.charts?.[0]?.chartType == "map" &&
                            //                     (selectedState != "" ? (
                            //                         <MapDrillChart
                            //                             data={item?.charts?.[0]}
                            //                             selectedState={selectedState}
                            //                             setselectedState={setselectedState}
                            //                             drilldownId={drillDownId}
                            //                             setdrilldownId={setdrillDownId}
                            //                             setTotalCount={setTotalCount}
                            //                             setLiveCount={setLiveCount}
                            //                         />
                            //                     ) : (
                            //                         <MapChart
                            //                             data={item?.charts?.[0]}
                            //                             setselectedState={setselectedState}
                            //                             setdrilldownId={setdrillDownId}
                            //                             settotalCount={setTotalCount}
                            //                             setliveCount={setLiveCount}
                            //                         />
                            //                     ))}
                            //                 {item?.charts?.[0]?.chartType == "map" && (
                            //                     <HorBarChart data={row.vizArray?.[1]?.charts?.[0]} setselectState={selectedState}></HorBarChart>
                            //                 )}
                            //             </div>
                            //         </div>
                            //     );
                            // } else if (item?.vizType === "stacked-collection") {
                            //     return (
                            //         <div className="employeeCard chart-item stackedCard" style={{ backgroundColor: "#fff" }} key={index}>
                            //             <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "row" }}>
                            //                 <div className="dss-card-header" style={{ marginBottom: "10px" }}>
                            //                     {Icon(item.name, colors[index].dark)}
                            //                     <p style={{ marginLeft: "20px" }}>{t(item.name)}</p>
                            //                 </div>
                            //             </div>

                            //             <div className="dss-card-body-stacked">
                            //                 {item.charts.map((chart, key) => (
                            //                     <div className={`dss-card-item ${key !== item.charts.length - 1 ? "dss-card-item-border" : ""}`}>
                            //                         <Chart data={chart} key={key} moduleLevel={item.moduleLevel} overview={item.vizType === "collection"} />
                            //                     </div>
                            //                 ))}
                            //             </div>
                            //         </div>
                            //     );
                            // }
                            // else if (item?.charts?.[0]?.chartType == "donut") {
                            //     const pieChart = item?.charts?.[0];
                            //     return <GenericChart
                            //         header={item.name}
                            //         className={"dss-card-parent heatMap"}
                            //         subHeader={`SUB_${item.name}`}>
                            //         <CustomPieChart data={pieChart} title={item?.name} isNational={true} />
                            //     </GenericChart>;
                            // }
                            // else if (item?.charts?.[0]?.chartType == "v-bar") {
                            //     const barChart = item?.charts?.[0];
                            //     return <GenericChart
                            //         header={item.name}
                            //         className={"dss-card-parent heatMap"}
                            //         subHeader={`SUB_${item.name}`}>
                            //         <CustomHorizontalBarChart
                            //             data={barChart}
                            //             title={item?.name}
                            //             isNational={true}
                            //         />
                            //     </GenericChart>;
                            // }
                            // else if (item?.charts?.[0]?.chartType == "table") {
                            //     const chartData = item?.charts?.[0];
                            //     return <GenericChart
                            //         header={item.name}
                            //         showSearch={item?.charts?.[0].chartType === "table"}
                            //         className={item?.charts?.[0].chartType === "table" && "fullWidth"}
                            //         subHeader={`SUB_${item.name}`}
                            //         onChange={(e) => onSearch(e.target.value)}
                            //         showDownload={item?.charts?.[0]?.chartType === "table"}
                            //     >
                            //         <CustomTable
                            //             data={chartData}
                            //             onSearch={searchQuery}
                            //             title={item?.name}
                            //         />
                            //     </GenericChart>;
                            // }
                            // else if (item?.charts?.[0]?.chartType == "venn") {
                            //     const vennChart = item?.charts?.[0];
                            //     return <GenericChart
                            //         header={item?.name}
                            //         className="employeeCard chart-item stackedCard"
                            //         subHeader={`SUB_${item.name}`}>
                            //         <VennDiagram
                            //             data={vennChart}
                            //             isNational={true}
                            //         />
                            //     </GenericChart>;
                            // }
                            // else {
                            if (item?.charts?.[0]?.chartType === "metric") {
                                console.log('ffffffffffffffffffff');
                                return (<MatricWrapper metricsArray={item} />);
                            } else if (item?.charts?.[0]?.chartType === "heatmap") {
                                // return <HeatMapChart initialRange={getInitialRange()} visualizer={item} chartId={item?.charts?.[0].id} isNational={true} pageZoom={pageZoom} />;
                                return <div> </div>
                            } else if (item?.charts?.[0]?.chartType == "table") {
                                return <GenericChart
                                    header={item.name}
                                    showSearch={item?.charts?.[0].chartType === "table"}
                                    className={item?.charts?.[0].chartType === "table" && "fullWidth"}
                                    subHeader={`SUB_${item.name}`}
                                    onChange={(e) => onSearch(e.target.value)}
                                    showDownload={item?.charts?.[0]?.chartType === "table"}
                                >
                                    <TableData chartData={item}></TableData>
                                </GenericChart>;
                            }
                            else if (item?.charts?.[0]?.chartType == "venn") {
                                const vennChart = item?.charts?.[0];
                                return <GenericChart
                                    header={item?.name}
                                    className="employeeCard chart-item stackedCard"
                                    subHeader={`SUB_${item.name}`}>
                                    <VennDiagram
                                        data={vennChart}
                                        isNational={true}
                                    />
                                </GenericChart>;
                            } else if (item?.charts?.[0]?.chartType == "v-bar") {
                                const barChart = item?.charts?.[0];
                                return <GenericChart
                                    header={item.name}
                                    className={"dss-card-parent heatMap"}
                                    subHeader={`SUB_${item.name}`}>
                                    <CustomHorizontalBarChart
                                        data={barChart}
                                        title={item?.name}
                                        isNational={true}
                                    />
                                </GenericChart>;
                            } else if (item?.charts?.[0]?.chartType == "donut") {
                                const pieChart = item?.charts?.[0];
                                return <GenericChart
                                    header={item.name}
                                    className={"dss-card-parent heatMap"}
                                    subHeader={`SUB_${item.name}`}>
                                    <CustomPieChart data={pieChart} title={item?.name} isNational={true} />
                                </GenericChart>;
                            }
                            // else if (item?.charts?.[0]?.chartType === "heatmap") {
                            //     return <HeatMapChart initialRange={getInitialRange()} visualizer={item} chartId={item?.charts?.[0].id} isNational={true} pageZoom={pageZoom} />;
                            // }
                            return (
                                <div> </div>
                                // <MatricWrapper MatricArray={item} />
                                // <div
                                //     className={`dss-card-parent  ${item.vizType == "collection"
                                //         ? "dss-w-100"
                                //         : item.name.includes("PROJECT_STAUS") || item.name.includes("LIVE_ACTIVE_ULBS")
                                //             ? "h-100"
                                //             : ""
                                //         }`}
                                //     style={
                                //         item.vizType == "collection" || item.name.includes("PROJECT_STAUS") || item.name.includes("LIVE_ACTIVE_ULBS")
                                //             ? { backgroundColor: "#fff" }
                                //             : { backgroundColor: colors[index].light, padding: "20px" }
                                //     }
                                //     key={index}
                                //     onClick={() => routeTo(`/${window.contextPath}/employee/dss/dashboard/${item.ref.url}`)}
                                // >
                                //     <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "row" }}>
                                //         <div className="dss-card-header" style={{ marginBottom: "10px" }}>
                                //             {Icon(item.name, colors[index].dark)}
                                //             <p style={{ marginLeft: "20px" }}>{t(item.name)}</p>
                                //         </div>
                                //         {item.vizType == "collection" ? (
                                //             <div
                                //                 style={{
                                //                     float: "right",
                                //                     textAlign: "right",
                                //                     color: "#F47738",
                                //                     fontSize: 16,
                                //                     fontWeight: "bold",
                                //                     display: "flex",
                                //                     flexDirection: "row",
                                //                 }}
                                //             >
                                //                 <span style={{ paddingRight: 10 }}>{t("DSS_OVERVIEW")}</span>
                                //                 <span>
                                //                     {" "}
                                //                     <Arrow_Right />
                                //                 </span>
                                //             </div>
                                //         ) : null}
                                //     </div>

                                //     <div className="dss-card-body">
                                //         {item.charts.map((chart, key) => (
                                //             <div style={item.vizType == "collection" ? { width: Digit.Utils.browser.isMobile() ? "50%" : "25%" } : { width: "50%" }}>
                                //                 <Chart data={chart} key={key} moduleLevel={item.moduleLevel} overview={item.vizType === "collection"} />
                                //             </div>
                                //         ))}
                                //     </div>
                                // </div>
                            );
                            // }
                        })}
                    </div>
                );
            })}
        </div>
        // </FilterContext.Provider>
    );
};

export default NationalDashboard;