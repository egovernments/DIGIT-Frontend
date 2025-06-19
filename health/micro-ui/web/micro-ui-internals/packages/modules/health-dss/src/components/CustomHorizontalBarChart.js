import { RemoveableTag } from "@egovernments/digit-ui-react-components";
import { Loader, Chip } from "@egovernments/digit-ui-components";
import React, { Fragment, useContext, useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Bar, BarChart, Brush, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, ReferenceLine, LabelList } from "recharts";
import FilterContext from "./FilterContext";
import NoData from "./NoData";
import { getTitleHeading } from "../utils/locale";

const barColors = ["#048BD0", "#FBC02D", "#8E29BF", "#EA8A3B", "#0BABDE", "#6E8459", "#D4351C", "#0CF7E4", "#F80BF4", "#22F80B"];

const renderPlot = (plot, key, denomination, headerName, rowHeaderName) => {
  let plotValue = key ? plot?.[key] : plot?.value || 0;
  if (rowHeaderName.toLowerCase().includes("days")) {
    plotValue = Math.floor(plotValue);
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

const getInitialRange = () => {
  const data = Digit.SessionStorage.get("DSS_FILTERS");
  const startDate = data?.range?.startDate ? new Date(data?.range?.startDate) : Digit.Utils.dss.getDefaultFinacialYear().startDate;
  const endDate = data?.range?.endDate ? new Date(data?.range?.endDate) : Digit.Utils.dss.getDefaultFinacialYear().endDate;
  const interval = Digit.Utils.dss.getDuration(startDate, endDate);
  return { startDate, endDate, interval };
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
  console.log(data, "dataaaaaaaaaaaaaaaaaaa");
  const { id, chartType } = data;
  const { t } = useTranslation();
  const history = useHistory();
  const { value } = useContext(FilterContext);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeBarId, setActiveBarId] = useState(null);
  const [hoverBarId, setHoverBarId] = useState(null);
  const [chartKey, setChartKey] = useState(id);
  const [selectedStack, setSelectedStack] = useState(null);
  const [filterStack, setFilterStack] = useState([{ id: id }]);
  const [drillDownFilters, setDrillDownFilters] = useState({});
  const [symbolKeyMap, setSymbolKeyMap] = useState({});
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { projectTypeId } = Digit.Hooks.useQueryParams();
  const selectedProjectTypeId = projectTypeId ? projectTypeId : Digit.SessionStorage.get("selectedProjectTypeId");

  useEffect(() => {
    if (filterStack.length > 1) {
      let filterKeyValue = {};
      filterStack.forEach((elem, index) => {
        if (index === 0) {
          return;
        }
        filterKeyValue[elem["filterKey"]] = elem["filterValue"];
      });
      setDrillDownFilters(filterKeyValue);
    }
  }, [filterStack]);
  const { startDate, endDate, interval } = getInitialRange();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let todayDate = today;
  const requestDate = {
    startDate: startDate.getTime(),
    endDate: endDate.getTime(),
    interval: interval,
    title: "home",
  };
  const defaultSelect = (data) => {
  if (data?.responseData) {
    if (data?.responseData?.data) {
      data.responseData.data = data?.responseData?.data?.filter((col) => col) || [];
      data.responseData.data?.forEach((row) => {
        if (row?.plots) {
          row.plots = row?.plots.filter((col) => col) || [];
        }
      });
    }
  }
  return data;
};
  const reqCriteria = {
    url: `/dashboard-analytics/dashboard/getChartV2`,
    body: {
      "aggregationRequestDto" : {
        visualizationCode: chartKey,
        visualizationType: "METRIC",
        queryType: "",
        requestDate:
          value?.requestDate != null
            ? {
                ...value?.requestDate,
                startDate: isNational ? todayDate?.getTime() : value?.range?.startDate?.getTime(),
                endDate: value?.range?.endDate?.getTime(),
              }
            : requestDate,
        filters:
          id === chartKey && value?.filters != null
            ? { ...value.filters, projectTypeId: selectedProjectTypeId }
            : value?.filters != null || drillDownFilters || selectedStack
            ? { ...value?.filters, ...drillDownFilters, selectedStack: selectedStack, projectTypeId: selectedProjectTypeId }
            : {},
        moduleLevel: value?.moduleLevel,
        aggregationFactors: null,
      },
      headers: {
        tenantId: tenantId
      }
    },
    params: {},
    headers: {
      "auth-token": Digit.UserService.getUser()?.access_token || null,
    },
    config: {
      // enabled: !!moduleCode,
      select: defaultSelect,
    },
  };
  const { data: response, isLoading } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  // const { isLoading, data: response } = Digit.Hooks.dss.useGetChart({
  //   key: chartKey,
  //   type: "metric",
  //   tenantId,
  //   requestDate:
  //     value?.requestDate != null
  //       ? {
  //           ...value?.requestDate,
  //           startDate: isNational ? todayDate?.getTime() : value?.range?.startDate?.getTime(),
  //           endDate: value?.range?.endDate?.getTime(),
  //         }
  //       : requestDate,
  //   filters:
  //     id === chartKey && value?.filters != null
  //       ? { ...value.filters, projectTypeId: selectedProjectTypeId }
  //       : value?.filters != null || drillDownFilters || selectedStack
  //       ? { ...value?.filters, ...drillDownFilters, selectedStack: selectedStack, projectTypeId: selectedProjectTypeId }
  //       : {},
  //   moduleLevel: value?.moduleLevel,
  // });


  let target = 0;
  let targetMessage = "";
  let targetLineChart = response?.responseData?.targetLineChart;
  const shouldDisplayTargetline = response && targetLineChart !== null && targetLineChart !== "none";
  if (targetLineChart) {
    const { data: targetResponse } = Digit.Hooks.dss.useGetChart(
      {
        key: targetLineChart,
        type: "metric",
        tenantId,
        requestDate: { ...value?.requestDate, startDate: value?.range?.startDate?.getTime(), endDate: value?.range?.endDate?.getTime() },
        filters:
          id === targetLineChart
            ? { ...value.filters, projectTypeId: projectTypeId }
            : {
                ...value?.filters,
                [filterStack[filterStack.length - 1]["filterKey"]]: filterStack[filterStack.length - 1]?.filterValue,
                projectTypeId: projectTypeId,
              },
        moduleLevel: value?.moduleLevel,
      },
      shouldDisplayTargetline
    );
    target = Math.ceil(targetResponse?.responseData?.data[0].headerValue) > 0 ? Math.ceil(targetResponse?.responseData?.data[0].headerValue) : 0;
    targetMessage = "TARGET_DSS_" + targetResponse?.responseData?.data[0].headerName?.replaceAll(" ", "_").toUpperCase();
  }
  if (targetMessage == "") {
    targetMessage = "TARGET_DSS_undefined";
  }

  const constructChartData = (data, denomination) => {
    let result = {};
    let symbolKeyObject = {};
    console.log(data,"pppppppppppppp")

    for (let i = 0; i < data?.length; i++) {
      const row = data[i];
      for (let j = 0; j < row.plots.length; j++) {
        const plot = row.plots[j];
        const plotName = getTitleHeading(plot.name);
        symbolKeyObject[t(plot.name)] = plot.symbol;
        result[plot.name] = {
          ...result[plot.name],
          [row.headerName]: renderPlot(plot, "value", denomination, plotName, row.headerName),
          name: t(plot.name),
        };
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
    history.push(
      `/${window.contextPath}/employee/dss/drilldown?chart=${response?.responseData?.drillDownChartId}&ulb=${value?.filters?.tenantId}&title=${title}`
    );
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
      label = label.split(".").length === 3 ? t(label.split(".")[1]) : label;
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
    if (response) setChartDenomination(response?.responseData?.data?.[0]?.headerSymbol);
  }, [response]);

  useEffect(() => {
    const { id } = data;
    setFilterStack([{ id: id }]);
    setChartKey(id);
  }, [data, value]);

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

  const chartData = useMemo(() => constructChartData(response?.responseData?.data, value?.denomination), [response, value?.denomination]);

  console.log(chartData,"chartData ppppppp")
  const renderLegend = (value) => (
    <span style={{ fontSize: "14px", color: "#505A5F" }}>{t(`DSS_LEGEND_${Digit.Utils.locale.getTransformedLocale(value)}`)}</span>
  );

  const tickFormatter = (value) => {
    if (typeof value === "string") {
      if (value.split(".").length === 3) {
        return t(value.split(".")[1]);
      }
      return getTitleHeading(value.replace("-", ", "));
    } else if (typeof value === "number") return Digit.Utils.dss.formatter(value, "number", value?.denomination, true, t);
    return value;
  };

  if (isLoading) {
    return <Loader className={"digit-center-loader"} />;
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
      formattedValue = `${value.toFixed(1)}%`;
    } else if (formattedValue.length > 4 || data.length > 1) {
      rotateAngle = -60;
    }
    if (y < 20) {
      rotateAngle = 0;
    }
    if (data.length > 2) {
      newX = x + width;
      rotateAngle = 0;
      newY = y + 5 + height / 2;
    }
    return (
      <text x={newX} y={newY} fill="#000" transform={`rotate(${rotateAngle} ${newX} ${y})`}>
        {formattedValue}
      </text>
    );
  };
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
                text={`${t(`DSS_HEADER_${Digit.Utils.locale.getTransformedLocale(filter?.filterKey)}`)}: ${getTitleHeading(filter?.name)}`}
                onClick={() => removeFilter(id, filter?.filterKey)}
              />
            ) : null
          )}
        </div>
      )} */}
      {filterStack?.length > 1 && (
        <div className="digit-tag-container digit-pie-chart-tags">
          <div className="digit-tag-filter-text">{t("DSS_FILTERS_APPLIED")}: </div>
          {filterStack.map((filter, id) =>
            id > 0 ? (
              <Chip
                key={id}
                text={`${t(`DSS_HEADER_${Digit.Utils.locale.getTransformedLocale(filter?.filterKey)}`)}: ${getTitleHeading(filter?.name)}`}
                onClick={() => removeFilter(id, filter?.filterKey)}
                hideClose={false}
              />
            ) : null
          )}
        </div>
      )}
      <div style={{ zoom: pageZoom ? 1 : showOnDownload ? 0.75 : 1.25 }}>
        <ResponsiveContainer
          width="94%"
          height={500}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
        >
          {chartData?.length === 0 || !chartData ? (
            <NoData t={t} />
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
                  fontSize: "14px",
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
                  dataKey={bar}
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
                  {showOnDownload && (
                    <LabelList dataKey={bar} fill="black" content={<CustomizedDownloadLabels data={response?.responseData?.data} />} />
                  )}
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
                        radius={id === topIndex || bars.length === 2 || chartType == "sideBySideBar" ? [5, 5, 0, 0] : undefined}
                        stroke={(activeIndex === index) & (activeBarId === id) ? "#ccc" : null}
                        strokeWidth={3}
                      />
                    );
                  })}
                </Bar>
              ))}
              <Legend formatter={renderLegend} iconType="circle" wrapperStyle={{ paddingTop: showOnDownload ? "50px" : "10px" }} />
              {!showOnDownload && chartData.length > 1 ? (
                <Brush dataKey="name" endIndex={chartData.length > 14 ? 14 : chartData.length - 1} height={24} travellerWidth={5} stroke="#F47738" />
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
