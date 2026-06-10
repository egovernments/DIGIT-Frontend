import React, { useContext, useMemo, useState, Fragment, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, Label, Sector } from "recharts";
import FilterContext from "./FilterContext";
import NoData from "./NoData";
import { getTitleHeading } from "../utils/locale";
import { Loader, Chip } from "@egovernments/digit-ui-components";
import { getDuration } from "../utils/getDuration";
const COLORS = ["#048BD0", "#FBC02D", "#8E29BF", "#EA8A3B", "#0BABDE", "#6E8459", "#D4351C", "#0CF7E4", "#F80BF4", "#22F80B"];
const mobileView = innerWidth <= 640;

const getInitialRange = () => {
  const data = Digit.SessionStorage.get("DSS_FILTERS");
  const startDate = data?.range?.startDate ? new Date(data?.range?.startDate) : Digit.Utils.dss.getDefaultFinacialYear().startDate;
  const endDate = data?.range?.endDate ? new Date(data?.range?.endDate) : Digit.Utils.dss.getDefaultFinacialYear().endDate;
  const interval = getDuration(startDate, endDate);
  return { startDate, endDate, interval };
};

const CustomPieChart = ({ dataKey = "value", data, setChartDenomination, isNational = false }) => {
  const { id } = data;
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const { t } = useTranslation();
  const { value } = useContext(FilterContext);
  const [isPieClicked, setIsPieClicked] = useState(false);
  const [pieSelected, setPieSelected] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [drillDownId, setdrillDownId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const { startDate, endDate, interval } = getInitialRange();
  const { campaignNumber } = Digit.Hooks.useQueryParams();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let todayDate = today;
  const requestDate = {
    startDate: startDate.getTime(),
    endDate: endDate.getTime(),
    interval: interval,
    title: "home",
  };
  const aggregationRequestDto = {
    visualizationCode: isPieClicked ? drillDownId : id,
    visualizationType: "metric",
    queryType: "",
    requestDate:
      value?.requestDate != null
        ? {
            ...value?.requestDate,
            startDate: isNational ? todayDate?.getTime() : value?.range?.startDate?.getTime(),
            endDate: value?.range?.endDate?.getTime(),
          }
        : requestDate,
    filters: isPieClicked ? { ...value?.filters, selectedType: pieSelected, campaignNumber: campaignNumber } : { ...value?.filters, campaignNumber: campaignNumber },
    moduleLevel: value?.moduleLevel,
    aggregationFactors: null,
  };
  const { isLoading, data: response } = Digit.Hooks.DSS.useGetChartV2(aggregationRequestDto);

  const onPieEnter = useCallback(
    (_, index) => {
      if (response?.responseData?.drillDownChartId !== "none") {
        setActiveIndex(index);
      } else {
        setActiveIndex(null);
      }
      setShowTooltip(true);
    },
    [setActiveIndex, response]
  );

  const onPieLeave = () => {
    setShowTooltip(false);
    setActiveIndex(null);
  };
  const numberOfSlices = 10;
  const chartData = useMemo(() => {
    if (!response) return null;
    if (setChartDenomination != null) {
      setChartDenomination(response?.responseData?.data?.[0]?.headerSymbol);
    }
    const compareFn = (a, b) => b.value - a.value;
    return drillDownId === "deathByCategoryDrilldownAge" || response?.responseData?.visualizationCode === "nssNumberOfDeathsByAge" // || drillDownId === "nssDeathByCategoryDrillDownAge")
      ? response?.responseData?.data?.[0]?.plots.reduce((acc, plot, index) => {
          acc = acc.concat(plot);
          return acc;
        }, [])
      : response?.responseData?.data?.[0]?.plots.sort(compareFn).reduce((acc, plot, index) => {
          if (index <= numberOfSlices) {
            if (index === numberOfSlices) {
              plot.name = "OTHERS";
            }
            acc = acc.concat(plot);
          } else {
            acc[numberOfSlices].value = acc[numberOfSlices].value + plot.value;
          }
          return acc;
        }, []);
  }, [response]);

  const renderLegend = (value) => <span className="digit-pie-chart-legend-text">{getTitleHeading(t(`${value}`))}</span>;

  const renderCustomLabel = (args) => {
    const { value, endAngle, startAngle, x, cx, y, cy, percent, name } = args;
    const diffAngle = endAngle - startAngle;
    if (diffAngle > 1.5 && diffAngle < 7) {
      return (
        <text
          x={x}
          cx={cx}
          y={y}
          cy={cy}
          percent={percent}
          name={name}
          fill="#505A5F"
          alignmentBaseline="middle"
          className="recharts-pie-label-text"
          fontSize="14px"
          textAnchor={x > cx ? "start" : "end"}
        >
          {value}
        </text>
      );
    } else if (diffAngle < 1.5) {
      return null;
    }
    return (
      <text
        x={x}
        cx={cx}
        y={y}
        cy={cy}
        percent={percent}
        name={name}
        fill="#505A5F"
        alignmentBaseline="middle"
        className="recharts-pie-label-text"
        fontSize="14px"
        textAnchor={x > cx ? "start" : "end"}
      >
        {value}
      </text>
    );
  };

  const renderTooltip = ({ payload, label }) => {
    const labelValue = Number((payload?.[0]?.value / response?.responseData?.data?.[0]?.headerValue) * 100).toFixed(1);
    const formattedValue = labelValue;
    return (
      <div
        style={{
          margin: "0px",
          whiteSpace: "nowrap",
          fontSize: "16px",
          color: "#505A5F",
        }}
      >
        <p className="recharts-tooltip-label">
          <b>{`${t(`${payload?.[0]?.name}`)}`}</b> &nbsp;{" "}
          {`${Digit.Utils.dss.formatter(payload?.[0]?.value, payload?.[0]?.payload?.payload?.symbol, value?.denomination, true, t)}`}
        </p>
        <p>{`(${formattedValue}%)`}</p>
      </div>
    );
  };
  const totalValue = useCallback(() => {
    let accumulatedValue = 0;
    response?.responseData?.data?.[0]?.plots?.forEach((entry) => {
      accumulatedValue = accumulatedValue + entry?.value;
    });
    accumulatedValue = Digit.Utils.dss.formatter(accumulatedValue, "number", value?.denomination, true, t);
    return accumulatedValue;
  }, [response]);

  const onPieClick = ({ payload }) => {
    if (activeIndex !== numberOfSlices) {
      setIsPieClicked(true);
      setdrillDownId(response?.responseData?.drillDownChartId);
      setPieSelected(payload.name);
      setActiveIndex(null);
      setShowTooltip(false);
    }
  };

  const removeFilter = () => {
    setIsPieClicked(false);
  };

  useEffect(() => {
    setIsPieClicked(false);
    setdrillDownId(null);
    setPieSelected(null);
  }, [id]);

  if (isLoading) {
    return <Loader className={"digit-center-loader"} />;
  }

  const renderActiveShape = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    return (
      <g>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius - 5} outerRadius={outerRadius + 5} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      </g>
    );
  };

  return (
    <Fragment>
      {id === "deathByCategory" && ( //|| id === "nssNumberOfDeathsByCategory") && (
        <span className={"dss-pie-subheader"} style={{ position: "sticky", left: 0 }}>
          {t("DSS_CMN_PIE_INFO")}
        </span>
      )}
      {isPieClicked && (
        <div className="digit-tag-container digit-pie-chart-tags">
          <div className="digit-tag-filter-text">{t("DSS_FILTERS_APPLIED")}: </div>
          <Chip key={id} text={`${t(pieSelected)}`} onClick={(e) => removeFilter(e)} hideClose={false} />
        </div>
      )}

      <div className={"digit-donut-chart-container"}>
        <ResponsiveContainer width="99%">
          {chartData?.length === 0 || !chartData ? (
            <NoData t={t} />
          ) : (
            <PieChart cy={150}>
              <Pie
                activeIndex={activeIndex}
                activeShape={activeIndex !== numberOfSlices ? renderActiveShape : null}
                data={chartData}
                dataKey={dataKey}
                cy={200}
                style={{ cursor: response?.responseData?.drillDownChartId !== "none" ? "pointer" : "default", outline: "none" }}
                innerRadius={!mobileView ? 80 : 100} ///Charts in rows(which contains 2 charts) are little bigger in size than charts in rows(which contains 3 charts) charts
                outerRadius={!mobileView ? 100 : 130}
                margin={{ top: isPieClicked ? 0 : 5 }}
                fill="#8884d8"
                label={response?.responseData?.showLabel ? renderCustomLabel : ""}
                labelLine={false}
                isAnimationActive={false}
                onClick={response?.responseData?.drillDownChartId !== "none" ? onPieClick : null}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {response?.responseData?.data?.[0]?.plots.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                {response?.responseData?.showLabel && (
                  <>
                    <Label
                      position="centerBottom"
                      className="digit-pie-chart-inner-label-text"
                      value={t("DSS_TOTAL")}
                      style={{ transform: "translateY(-10px)" }}
                    />
                    <Label position="centerTop" value={totalValue()} className="digit-pie-chart-inner-label-value" />
                  </>
                )}
              </Pie>
              {showTooltip && <Tooltip content={renderTooltip} />}
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                iconType="circle"
                formatter={renderLegend}
                iconSize={13}
                wrapperStyle={
                  chartData?.length > 6
                    ? {
                        paddingRight: !mobileView ? 60 : 0, ///Padding for 2 charts in a row cases
                        overflowY: "scroll",
                        height: 250,
                        width: "35%",
                        overflowX: "auto",
                        paddingTop: -20,
                      }
                    : { paddingRight: !mobileView ? 60 : 0, overflowX: "auto", paddingTop: -20 } ///Padding for 2 charts in a row cases
                }
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </Fragment>
  );
};

export default CustomPieChart;
