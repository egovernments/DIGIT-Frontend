import { NoResultsFound } from "@egovernments/digit-ui-components";
import { Loader, RemoveableTag } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useContext, useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Bar, BarChart, Brush, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, ReferenceLine, LabelList } from "recharts";

const barColors = ["#048BD0", "#FBC02D", "#8E29BF", "#EA8A3B", "#0BABDE", "#6E8459", "#D4351C", "#0CF7E4", "#F80BF4", "#22F80B"];

const renderPlot = (plot, key, denomination, headerName, rowHeaderName) => {
    let plotValue = key ? plot?.[key] : plot?.value || 0;
    if (rowHeaderName.toLowerCase().includes("days")) {
        plotValue = Math.floor(plotValue)
    }
    if (plot?.symbol?.toLowerCase() === "amount") {
        switch (denomination) {
            case "Unit":
                return plotValue;
            case "Lac":
                return Number((plotValue / 100000).toFixed(2));
            case "Cr":
                return Number((plotValue / 10000000).toFixed(2));
            default:
                return "";
        }
    } else if (plot?.symbol?.toLowerCase() === "number") {
        return Number(plotValue.toFixed(1));
    } else {
        return plotValue;
    }
};


const CustomHorizontalBarChart = ({
    data,
    xAxisType = "category",
    yAxisType = "number",
    xDataKey = "name",
    yDataKey = "",
    xAxisLabel = "",
    yAxisLabel = "",
    layout = "horizontal",
    title,
    showDrillDown = false,
    setChartDenomination,
    pageZoom,
    downloadChartsId = null,
    isNational = false,
}) => {
    const { id, chartType } = data;
    const { t } = useTranslation();
    const history = useHistory();
    const [activeIndex, setActiveIndex] = useState(null);
    const [activeBarId, setActiveBarId] = useState(null);
    const [hoverBarId, setHoverBarId] = useState(null);
    const [chartKey, setChartKey] = useState(id);
    const [denomination, setDenomination] = useState(null);
    const [selectedStack, setSelectedStack] = useState(null);
    const [filterStack, setFilterStack] = useState([{ id: id }]);
    const [drillDownFilters, setDrillDownFilters] = useState({});
    const [symbolKeyMap, setSymbolKeyMap] = useState({});
    const tenantId = Digit.ULBService.getCurrentTenantId();

    useEffect(() => {
        if (filterStack.length > 1) {
            let filterKeyValue = {}
            filterStack.forEach((elem, index) => {
                if (index === 0) {
                    return;
                }
                filterKeyValue[elem["filterKey"]] = elem["filterValue"];
            })
            setDrillDownFilters(filterKeyValue)
        }
    }, [filterStack]);
    const { projectTypeId } = Digit.Hooks.useQueryParams();

    const today = new Date();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).getTime();

    // Get the start date (exactly one year ago)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    oneYearAgo.setHours(0, 0, 0, 0);
    const startOfYear = oneYearAgo.getTime();

    const requestDate = {
        startDate: startOfYear,
        endDate: endOfDay,
        interval: "month",  // Change the interval if needed
        title: "home",
    };

    console.log(data, 'dddddddddddddddddd');

    const { isLoading, data: response } = Digit.Hooks.dss.useGetChart({
        key: data?.id,
        type: "metric",
        tenantId,
        requestDate: requestDate,
        filters: { projectTypeId: projectTypeId, },
    });


    let target = 0;
    let targetMessage = "";
    let targetLineChart = response?.responseData?.targetLineChart
    const shouldDisplayTargetline = response && targetLineChart !== null && targetLineChart !== "none";
    //   if(targetLineChart){

    //     const { data: targetResponse } = Digit.Hooks.dss.useGetChart(
    //       {
    //         key: targetLineChart,
    //         type: "metric",
    //         tenantId,
    //         requestDate: { ...value?.requestDate, startDate: value?.range?.startDate?.getTime(), endDate: value?.range?.endDate?.getTime() },
    //         filters:
    //           id === targetLineChart
    //             ? {...value.filters, projectTypeId: projectTypeId}
    //             : { ...value?.filters, [filterStack[filterStack.length - 1]["filterKey"]]: filterStack[filterStack.length - 1]?.filterValue, projectTypeId: projectTypeId },
    //         moduleLevel: value?.moduleLevel,
    //       },
    //       shouldDisplayTargetline
    //     );
    //     target = Math.ceil(targetResponse?.responseData?.data[0].headerValue) > 0 ? Math.ceil(targetResponse?.responseData?.data[0].headerValue) : 0;
    //     targetMessage = "TARGET_DSS_" + targetResponse?.responseData?.data[0].headerName?.replaceAll(" ", "_").toUpperCase();
    //   }
    //   if(targetMessage == ""){
    //     targetMessage = "TARGET_DSS_undefined";
    //   }

    const constructChartData = (data, denomination) => {
        let result = {};
        let symbolKeyObject = {};

        for (let i = 0; i < data?.length; i++) {
            const row = data[i];
            for (let j = 0; j < row.plots.length; j++) {
                const plot = row.plots[j];
                const plotName = plot.name;
                symbolKeyObject[t(plot.name)] = plot.symbol;
                result[plot.name] = { ...result[plot.name], [(row.headerName)]: renderPlot(plot, "value", denomination, plotName, row.headerName), name: t(plot.name) };
            }
        }

        setSymbolKeyMap(symbolKeyObject);
        return Object.keys(result).map((key) => {
            return {
                name: key,
                ...result[key],
            };
        });
    };

    const goToDrillDownCharts = () => {
        history.push(`/${window.contextPath}/employee/dss/drilldown?chart=${response?.responseData?.drillDownChartId}&ulb=${value?.filters?.tenantId}&title=${title}`);
    };

    const CustomizedLabel = (props) => {
        const { value, viewBox, target } = props;
        const x = viewBox.width - value.length * 7;
        const y = viewBox.y + 16;
        return (
            <g>
                <text x={x} y={y} fill="#505A5F" style={{ fontSize: 12 }} className="customLabel">
                    {" "}
                    {value}: &nbsp;
                    <tspan font-weight="bold">{target}</tspan>
                </text>
            </g>
        );
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            var value = payload[0].payload[Object.keys(payload[0].payload)[hoverBarId + 1]];
            let hoverItem;
            if (payload.length > 1) {
                hoverItem = renderLegend(payload[hoverBarId]?.dataKey);

            }
            if (id === "fsmMonthlyWasteCal") {
                value = `${Digit.Utils.dss.formatter(Math.round((value + Number.EPSILON) * 100) / 100, "number", value?.denomination, true, t)} ${t(
                    "DSS_KL"
                )}`;
            } else if (symbolKeyMap && symbolKeyMap[payload[0]?.payload?.name] === "percentage") {
                value = Digit.Utils.dss.formatter(value, "percentage", value?.denomination, true, t);
            } else {
                value = Digit.Utils.dss.formatter(Math.round((value + Number.EPSILON) * 100) / 100, "number", value?.denomination, true, t);
            }
            label = label.split(".").length === 3 ? t(label.split(".")[1]) : label
            return (
                <div className="custom-tooltip">
                    <p className="horizontalBarChartLabel" style={{ fontSize: "16px", color: "#505A5F", whiteSpace: "nowrap" }}>
                        <b>{`${label}`}</b> &nbsp; {hoverItem} {`${value}`}
                    </p>
                </div>
            );
        }

        return null;
    };

    useEffect(() => {
        if (response) setDenomination(response?.responseData?.data?.[0]?.headerSymbol);
    }, [response]);

    const onBarClick = ({ payload, tooltipPayload }) => {
        let newStack = {
            id: response?.responseData?.drillDownChartId,
            ...payload,
            filterKey: response?.responseData.filter[0].key,
            filterValue: payload.name,
        };
        setSelectedStack(tooltipPayload?.[0]?.dataKey);
        setFilterStack([...filterStack, newStack]);
        setChartKey(response?.responseData?.drillDownChartId);
    };

    const chartData = useMemo(() => constructChartData(response?.responseData?.data, denomination), [response, denomination]);

    const renderLegend = (value) => <span style={{ fontSize: "14px", color: "#505A5F" }}>{t(`DSS_LEGEND_${Digit.Utils.locale.getTransformedLocale(value)}`)}</span>;

    const tickFormatter = (value) => {
        if (typeof value === "string") {
            if (value.split(".").length === 3) {
                return t(value.split(".")[1])
            }
            return value.replace("-", ", ");
        } else if (typeof value === "number") return Digit.Utils.dss.formatter(value, "number", value?.denomination, true, t);
        return value;
    };

    if (isLoading) {
        return <Loader />;
    }
    const formatXAxis = (tickFormat) => {
        // if (tickFormat && typeof tickFormat == "string") {
        //   return `${tickFormat.slice(0, 16)}${tickFormat.length > 17 ? ".." : ""}`;
        // }
        return `${tickFormat}`;
    };
    const removeFilter = (id, filterKey) => {
        const nextState = filterStack?.filter((filter, index) => index < id);
        const nextFilterState = drillDownFilters;
        if (isNational && nextFilterState[filterKey]) {
            delete nextFilterState[filterKey];
            setDrillDownFilters(nextFilterState);
        }
        setFilterStack(nextState);
        setSelectedStack(null);
        setChartKey(nextState[nextState?.length - 1]?.id);
    };

    const onMouseLeave = () => {
        setActiveIndex(null);
        setActiveBarId(null);
    };
    const CustomizedDownloadLabels = (props) => {
        const { x, y, value, width, height, data } = props;
        if (value === 0) {
            return null;
        }

        let symbol = data?.[0]?.headerSymbol;
        let newY = y - 5;
        let newX = x;
        let rotateAngle = 0;
        let formattedValue = `${value}`;
        if (symbol === "percentage") {
            formattedValue = `${value.toFixed(1)}%`
        } else if (formattedValue.length > 4 || data.length > 1) {
            rotateAngle = -60;
        }
        if (y < 20) {
            rotateAngle = 0;
        }
        if (data.length > 2) {
            newX = x + width
            rotateAngle = 0;
            newY = y + 5 + height / 2
        }
        return (
            <text x={newX} y={newY} fill="#000"
                transform={`rotate(${rotateAngle} ${newX} ${y})`}
            >{formattedValue}</text>
        )
    }
    let showOnDownload = downloadChartsId === response?.responseData?.visualizationCode ? true : false;
    const bars = response?.responseData?.data?.map((bar) => bar?.headerName);
    return (
        <Fragment>
            {/* {filterStack?.length > 1 && (
        <div className="tag-container">
          <span style={{ marginTop: "20px" }}>{t("DSS_FILTERS_APPLIED")}: </span>
          {filterStack.map((filter, id) =>
            id > 0 ? (
              <RemoveableTag
                key={id}
                text={`${t(`DSS_HEADER_${Digit.Utils.locale.getTransformedLocale(filter?.filterKey)}`)}: ${Digit.Utils.locale.getTitleHeading(filter?.name)}`}
                onClick={() => removeFilter(id,filter?.filterKey)}
              />
            ) : null
          )}
        </div>
      )} */}
            <div style={{ zoom: pageZoom ? 1 : (showOnDownload ? 0.75 : 1.25) }}>
                <ResponsiveContainer
                    width="94%"
                    height={450}
                    margin={{
                        top: 5,
                        right: 5,
                        left: 5,
                        bottom: 5,
                    }}
                >
                    {chartData?.length === 0 || !chartData ? (
                        <NoResultsFound />
                    ) : (
                        <BarChart
                            width="100%"
                            height="100%"
                            margin={{
                                top: 18,
                                right: 5,
                                left: 5,
                                bottom: 5,
                            }}
                            layout={layout}
                            data={chartData}
                            barGap={chartType == "sideBySideBar" ? 2 : 16}
                            barSize={16}
                        >
                            <CartesianGrid strokeDasharray="2 2" vertical={false} />
                            <YAxis
                                dataKey={yDataKey}
                                type={yAxisType}
                                tick={{ fontSize: "12px", fill: "#505A5F" }}
                                label={{
                                    value: yAxisLabel,
                                    angle: -90,
                                    position: "insideLeft",
                                    dy: 50,
                                    fontSize: "12px",
                                    fill: "#505A5F",
                                }}
                                allowDecimals={false}
                                tickCount={5}
                                tickFormatter={tickFormatter}
                                unit={id === "fsmCapacityUtilization" || response?.responseData?.data?.[0]?.headerSymbol === "percentage" ? "%" : ""}
                                width={layout === "vertical" ? 120 : 60}
                                domain={shouldDisplayTargetline ? ["auto", target + 10] : [0, (dataMax) => Math.ceil(dataMax / 10) * 10]}
                            />
                            <XAxis
                                dataKey={xDataKey}
                                type={xAxisType}
                                tick={{ fontSize: "14px", fill: "#505A5F" }}
                                tickCount={10}
                                tickFormatter={tickFormatter}
                                height={40}
                                angle={showOnDownload ? -60 : 0}
                                textAnchor={showOnDownload ? "end" : "middle"}
                            />
                            <Tooltip
                                wrapperStyle={{ outline: "none", border: "1px solid #B1B4B6", borderRadius: "5px", padding: "8px", backgroundColor: "#FFFFFF" }}
                                content={<CustomTooltip />}
                                cursor={false}
                            />
                            {shouldDisplayTargetline ? (
                                <ReferenceLine
                                    y={target}
                                    stroke={"#F47738"}
                                    ifOverflow="extendDomain"
                                    strokeWidth={"2px"}
                                    label={<CustomizedLabel value={t(targetMessage)} target={target} />}
                                />
                            ) : null}
                            {bars?.map((bar, id) => (
                                <Bar
                                    key={id}
                                    dataKey={(bar)}
                                    fill={barColors[id]}
                                    stackId={bars?.length > 2 && chartType !== "sideBySideBar" ? 1 : id}
                                    onClick={response?.responseData?.drillDownChartId !== "none" ? onBarClick : null}
                                    onMouseEnter={(_, index) => {
                                        setHoverBarId(id);
                                        if (response?.responseData?.drillDownChartId !== "none") {
                                            setActiveIndex(index);
                                            setActiveBarId(id);
                                        } else {
                                            setActiveIndex(null);
                                            setActiveBarId(null);
                                        }
                                    }}
                                    onMouseLeave={onMouseLeave}
                                >
                                    {showOnDownload && <LabelList
                                        dataKey={bar}
                                        fill="black"
                                        content={<CustomizedDownloadLabels data={response?.responseData?.data} />}
                                    />}
                                    {chartData.map((_, index) => {
                                        var topIndex = 0;
                                        var i = 0;
                                        for (let properties in chartData[index]) {
                                            if (Number.isInteger(chartData[index][properties])) {
                                                if (chartData[index][properties] !== 0) {
                                                    topIndex = i;
                                                }
                                                i += 1;
                                            }
                                        }
                                        return (
                                            <Cell
                                                radius={(id === topIndex) || bars.length === 2 || chartType == "sideBySideBar" ? [5, 5, 0, 0] : undefined}
                                                stroke={(activeIndex === index) & (activeBarId === id) ? "#ccc" : null}
                                                strokeWidth={3}
                                            />
                                        );
                                    })}
                                </Bar>
                            ))}
                            <Legend formatter={renderLegend} iconType="circle" wrapperStyle={{ paddingTop: showOnDownload ? "50px" : "10px" }} />
                            {!showOnDownload && chartData.length > 1 ? (
                                <Brush
                                    dataKey="name"
                                    endIndex={chartData.length > 14 ? 14 : chartData.length - 1}
                                    height={24}
                                    travellerWidth={5}
                                    stroke="#F47738"
                                />
                            ) : null}
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
            {showDrillDown && (
                <p className="showMore" onClick={goToDrillDownCharts}>
                    {t("DSS_SHOW_MORE")}
                </p>
            )}
        </Fragment>
    );
};

export default CustomHorizontalBarChart;
