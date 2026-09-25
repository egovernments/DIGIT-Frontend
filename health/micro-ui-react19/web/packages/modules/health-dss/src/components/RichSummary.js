import { Card, Loader } from "@egovernments/digit-ui-components";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import FilterContext from "./FilterContext";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, Label } from "recharts";
const COLORS = ["#0BABDE", "#D6D5D4"];
import Icon from "./Icon";

const CircularProgressBar = ({ t, data }) => {
  const displayData = [{ name: "COVERAGE", value: data.headerValue ? data.headerValue : 100 }];
  const endAngle = 90 * (1 - (4 * data.headerValue) / 100);
  const percentageValue = Digit.Utils.dss.formatter(data?.headerValue, "percentage", "", true, t).replace(" ", "");
  return (
    <ResponsiveContainer width="100%" height={90}>
      <PieChart>
        <Pie
          data={displayData}
          dataKey="value"
          innerRadius={41}
          outerRadius={45}
          startAngle={90}
          endAngle={-270}
          fill="#8884d8"
          isAnimationActive={false}
          blendStroke
        >
          <Cell key={`cel-0`} fill={COLORS[1]} />
        </Pie>
        <Pie
          data={displayData}
          dataKey="value"
          innerRadius={41}
          outerRadius={45}
          startAngle={90}
          endAngle={endAngle}
          fill="#8884d8"
          paddingAngle={0}
          labelLine={false}
          isAnimationActive={false}
          blendStroke
          cornerRadius={20}
        >
          <Cell key={`cel-0`} fill={COLORS[0]} />
          <Label position="center" className={"digit-small-pie-label"} value={percentageValue} />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

const Insight = ({ data, t }) => {
  const { value } = useContext(FilterContext);
  const insight = data?.insight?.value?.replace(/[+-]/g, "")?.split("%");

  if (data?.insight?.indicator === "insight_no_diff") {
    return <div className={"digit-dss-insight-card-difference"}>{t(`DSS_${Digit.Utils.locale.getTransformedLocale(data?.insight?.value)}`)}</div>;
  }

  return (
    <div className={`digit-dss-insight-card-difference ${data?.insight?.indicator === "upper_green" ? "increase" : "decrease"} metric-card`}>
      <Icon
        type={data?.insight?.indicator === "upper_green" ? "arrow-upward" : "arrow-downward"}
        iconColor={data?.insight?.indicator === "upper_green" ? "#00703C" : "#D4351C"}
        width="1.5rem"
        height="1.5rem"
        className="digit-dss-insight-icon"
      />
      {insight?.[0] &&
        `${Digit.Utils.dss.formatter(insight[0], "number", value?.denomination, true, t)}% ${t(
          Digit.Utils.locale.getTransformedLocale("DSS" + insight?.[1] || "")
        )}`}
    </div>
  );
};

const Chart = ({ data, showDivider }) => {
  const { id, chartType } = data;
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const { t } = useTranslation();
  const { campaignNumber } = Digit.Hooks.useQueryParams();
  const { value } = useContext(FilterContext);
  const [showDate, setShowDate] = useState({});
  const isMobile = window.Digit.Utils.browser.isMobile();
  const aggregationRequestDto = {
    visualizationCode: id,
    visualizationType: chartType,
    queryType: "",
    requestDate: { ...value?.requestDate, startDate: value?.range?.startDate?.getTime(), endDate: value?.range?.endDate?.getTime() },
    filters: {
      ...value?.filters,
      campaignNumber: campaignNumber,
    },
    aggregationFactors: null,
  };
  const { isLoading, data: response } = Digit.Hooks.DSS.useGetChartV2(aggregationRequestDto);

  if (isLoading) {
    return <Loader className={"digit-center-loader"} />;
  }
  let name = t(data?.name) || "";
  const subTextName = t(`SUB_TEXT_${data?.name}`);
  const subText = subTextName !== `SUB_TEXT_${data?.name}` ? subTextName : "";

  const getWidth = (data) => {
    if (isMobile) return "auto";
    else return t(`TIP_${data.name}`)?.length < 50 ? "fit-content" : 300;
  };

  const chartData = response?.responseData?.data?.[0];

  return (
    <div className={`digit-metric-details-chart ${showDivider ? "add-divider" : ""}`}>
      {chartData?.headerSymbol !== "percentage" ? (
        <div className="digit-metric-data-header">
          {`${Digit.Utils.dss.formatter(chartData?.headerValue, chartData?.headerSymbol, value?.denomination, true, t)}`}
        </div>
      ) : (
        <div style={{ width: "80%", margin: "auto" }}>
          <CircularProgressBar data={chartData} t={t} />
        </div>
      )}
      <div className={`tooltip`}>
        <div className="digit-dss-metric-card-text">{typeof name == "string" && name}</div>
        {Array.isArray(name) && name?.filter((ele) => ele)?.map((ele) => <div style={{ whiteSpace: "pre" }}>{ele}</div>)}
        <span className="dss-white-pre" style={{ display: "block" }}>
          {showDate?.[id]?.todaysDate}
        </span>
        <span
          className="tooltiptext"
          style={{
            fontSize: "medium",
            width: getWidth(data),
            height: "auto",
            whiteSpace: "normal",
            marginLeft: -150,
          }}
        >
          <span style={{ fontWeight: "500", color: "white" }}>{t(`TIP_${data.name}`)}</span>
          <span style={{ color: "white" }}> {showDate?.[id]?.lastUpdatedTime}</span>
        </span>
      </div>
      {subText && <div className="digit-dss-insight-card-sub-text">{subText}</div>}
      {chartData?.insight ? <Insight data={response?.responseData?.data?.[0]} t={t} /> : null}
    </div>
  );
};

const RichSummary = ({ data }) => {
  const { t } = useTranslation();
  const { value } = useContext(FilterContext);
  return (
    <Card className="digit-chart-item">
      <div className="digit-dss-card-header-wrapper">
        <Icon type={data?.name} iconColor={"#C84C0E"} width="2.5rem" height="2.5rem" className="digit-dss-stacked-card-icon" />
        <div className="digit-dss-card-header-text">{t(data?.name)}</div>
      </div>
      <div className={"digit-dss-summary-card"}>
        {data.charts.map((chart, key) => (
          <Chart data={chart} showDivider={key % 2 === 0} key={key} url={data?.ref?.url} />
        ))}
      </div>
    </Card>
  );
};

export default RichSummary;
