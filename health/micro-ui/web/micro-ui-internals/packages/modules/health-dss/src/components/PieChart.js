import { LoaderComponent, NoResultsFound } from "@egovernments/digit-ui-components";
import { Loader, RemoveableTag } from "@egovernments/digit-ui-react-components";
import React, { useContext, useMemo, useState, Fragment, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, Label, Sector } from "recharts";
// ["#048BD0", "#FBC02D", "#8E29BF","#EA8A3B","#0BABDE","#6E8459"]
const COLORS = ["#048BD0", "#FBC02D", "#8E29BF", "#EA8A3B", "#0BABDE", "#6E8459", "#D4351C", "#0CF7E4", "#F80BF4", "#22F80B"];
const mobileView = innerWidth <= 640;

const getInitialRange = () => {
    const data = Digit.SessionStorage.get("DSS_FILTERS");
    const startDate = data?.range?.startDate ? new Date(data?.range?.startDate) : Digit.Utils.dss.getDefaultFinacialYear().startDate;
    const endDate = data?.range?.endDate ? new Date(data?.range?.endDate) : Digit.Utils.dss.getDefaultFinacialYear().endDate;
    const interval = Digit.Utils.dss.getDuration(startDate, endDate);
    return { startDate, endDate, interval };
};
const CustomPieChart = ({ dataKey = "value", data, setChartDenomination, isNational = false }) => {
    const { id } = data;
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const { t } = useTranslation();
    const [isPieClicked, setIsPieClicked] = useState(false);
    const [pieSelected, setPieSelected] = useState(null);
    const [denomination, setDenomination] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [drillDownId, setdrillDownId] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const { startDate, endDate, interval } = getInitialRange();
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
    const { isLoading, data: response } = Digit.Hooks.dss.useGetChart({
        key: id,
        type: "metric",
        tenantId,
        requestDate: requestDate,
        filters: { projectTypeId: projectTypeId },
    });

    const onPieEnter = useCallback(
        (_, index) => {
            if (response?.responseData?.drillDownChartId !== "none") {
                setActiveIndex(index);
            } else {
                setActiveIndex(null);
            }
            setShowTooltip(true)
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
            setDenomination(response?.responseData?.data?.[0]?.headerSymbol);
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

    const renderLegend = (value) => (
        <span style={{ fontSize: "14px", color: "#505A5F" }}>{t(`${value}`)}</span>
    );

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
                    color: "#505A5F"
                }}

            >
                <p className="recharts-tooltip-label"><b>{`${t(
                    `${payload?.[0]?.name}`
                )}`}</b> &nbsp; {`${Digit.Utils.dss.formatter(payload?.[0]?.value, payload?.[0]?.payload?.payload?.symbol, denomination, true, t)}`}</p>
                <p>{`(${formattedValue}%)`}</p>
            </div>
        );
    };

    const totalValue = useCallback(() => {
        let accumulatedValue = 0;
        response?.responseData?.data?.[0]?.plots.forEach((entry) => {
            accumulatedValue = accumulatedValue + entry?.value;
        });
        accumulatedValue = Digit.Utils.dss.formatter(accumulatedValue, "number", denomination, true, t)
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
        return <LoaderComponent />;
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
                <div>
                    <div className="tag-container" style={{ marginBottom: "unset" }}>
                        <span style={{ marginTop: "20px" }}>{t("DSS_FILTERS_APPLIED")}: </span>
                        <RemoveableTag key={id} text={`${t(pieSelected)}`} onClick={removeFilter} />
                    </div>
                    {/* <div className="tag-container" style={{marginBottom:"unset"}}>
            <span >{t("DSS_FILTERS_APPLIED")}: </span>
            <RemoveableTag extraStyles={{tagStyles:{ marginTop: "unset" }}} key={id} text={`${t("COMMON_MASTERS_" + Digit.Utils.locale.getTransformedLocale(pieSelected))}`} onClick={removeFilter} />
          </div> */}
                </div>
            )}

            <ResponsiveContainer width="99%" height={400}>
                {chartData?.length === 0 || !chartData ? (
                    <NoResultsFound />
                ) : (
                    <PieChart cy={150}>
                        <Pie
                            activeIndex={activeIndex}
                            activeShape={activeIndex !== numberOfSlices ? renderActiveShape : null}
                            data={chartData}
                            dataKey={dataKey}
                            cy={200}
                            style={{ cursor: response?.responseData?.drillDownChartId !== "none" ? "pointer" : "default", outline: "none" }}
                            innerRadius={100} ///Charts in rows(which contains 2 charts) are little bigger in size than charts in rows(which contains 3 charts) charts
                            outerRadius={130}
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
                                <Cell key={`cell-`} fill={COLORS[index % COLORS.length]} />
                            ))}
                            {response?.responseData?.showLabel && (
                                <>
                                    <Label position="centerBottom" value={t("DSS_TOTAL")} style={{ fontSize: "16px", transform: "translateY(-10px)", fill: "#383838" }} />
                                    <Label position="centerTop" value={totalValue()} style={{ fontSize: "36px", fontWeight: "bold", fill: "#383838" }} />
                                </>
                            )}
                        </Pie>
                        {showTooltip && <Tooltip
                            wrapperStyle={{ outline: "none", border: "1px solid #B1B4B6", borderRadius: "5px", padding: "8px", backgroundColor: "#FFFFFF" }}
                            content={renderTooltip} />}
                        <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            iconType="circle"
                            formatter={renderLegend}
                            iconSize={10}
                            wrapperStyle={
                                chartData?.length > 6
                                    ? {
                                        paddingRight: 0, ///Padding for 2 charts in a row cases
                                        overflowY: "scroll",
                                        height: 250,
                                        width: "35%",
                                        overflowX: "auto",
                                        paddingTop: -20,
                                    }
                                    : { paddingRight: 0, width: "27%", overflowX: "auto", paddingTop: -20 } ///Padding for 2 charts in a row cases
                            }
                        />
                    </PieChart>
                )}
            </ResponsiveContainer>
            {/* {isPieClicked && (
        <div
          style={{
            marginTop: "-2.5%",
            position: "absolute",
            width: "30%",
            textAlign: "center",
          }}
        >
          {t(Digit.Utils.locale.getTransformedLocale(`${response?.responseData?.data?.[0]?.headerName}_${pieSelected}`))}
        </div>
      )} */}
        </Fragment>
    );
};

export default CustomPieChart;
