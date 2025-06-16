import { Card, Loader } from "@egovernments/digit-ui-react-components";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
// import { ArrowDownwardElement } from "./ArrowDownward";
// import { ArrowUpwardElement } from "./ArrowUpward";
import FilterContext from "./FilterContext";
// import Icon from "./common/Icon";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, Label } from "recharts";
const COLORS = ["#0BABDE", "#D6D5D4"];

const CircularProgressBar = ({ t, data }) => {
  const displayData = [{ name: "COVERAGE", value: data.headerValue ? data.headerValue : 100 }];
  const endAngle = 90 * (1 - (4 * data.headerValue) / 100);
  const percentageValue  = Digit.Utils.dss.formatter(data?.headerValue, "percentage", "", true, t).replace(" ", "");
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
          <Label position="center" value={percentageValue} style={{ fontSize: "20px", fontWeight: 700, fill: "#383838" }} />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

const MetricData = ({ t, data }) => {
  const { value } = useContext(FilterContext);
  return (
    <div>
      <p className="heading-m" style={{ paddingTop: "0px", whiteSpace: "nowrap", marginLeft: "0px", fontSize: "24px", color: "#505A5F" }}>
        {`${Digit.Utils.dss.formatter(data?.headerValue, data?.headerSymbol, value?.denomination, true, t)}`}
      </p>
    </div>
  );
};

const Insight = ({ data, t }) => {
  const { value } = useContext(FilterContext);
  const insight = data?.insight?.value?.replace(/[+-]/g, "")?.split("%");

  if (data?.insight?.indicator === "insight_no_diff") {
    return <div style={{ fontSize: "14px", padding: "5px", color: "#797979" }}>{t(`DSS_${Digit.Utils.locale.getTransformedLocale(data?.insight?.value)}`)}</div>;
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        {/* {data?.insight?.indicator === "upper_green" ? ArrowUpwardElement("10px") : ArrowDownwardElement("10px")} */}
        <div
          className={`${data?.insight.colorCode}`}
          style={{ whiteSpace: "pre", fontSize: "14px", padding: "5px", color: data?.insight?.indicator === "upper_green" ? "#259B24" : "#D4351C" }}
        >
          {insight?.[0] &&
            `${Digit.Utils.dss.formatter(insight[0], "number", value?.denomination, true, t)}% ${t(
              Digit.Utils.locale.getTransformedLocale("DSS" + insight?.[1] || "")
            )}`}
        </div>
      </div>
    </div>
  );
};

const Chart = ({ data, showDivider }) => {
  const { id, chartType } = data;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const { projectTypeId} = Digit.Hooks.useQueryParams();
  const selectedProjectTypeId = projectTypeId ? projectTypeId : Digit.SessionStorage.get("selectedProjectTypeId");
  const { value } = useContext(FilterContext);
  const [showDate, setShowDate] = useState({});
  const isMobile = window.Digit.Utils.browser.isMobile();
  const { isLoading, data: response } = Digit.Hooks.dss.useGetChart({
    key: id,
    type: chartType,
    tenantId,
    requestDate: { ...value?.requestDate, startDate: value?.range?.startDate?.getTime(), endDate: value?.range?.endDate?.getTime() },
    filters: {...value?.filters, projectTypeId: selectedProjectTypeId},
  });
  if (isLoading) {
    return <Loader />;
  }
  let name = t(data?.name) || "";
  const subTextName = t(`SUB_TEXT_${data?.name}`);
  const subText = subTextName !== `SUB_TEXT_${data?.name}` ? subTextName : ""

  const getWidth = (data) => {
    if (isMobile) return "auto";
    else return t(`TIP_${data.name}`).length < 50 ? "fit-content" : 300;
  };

  const chartData = response?.responseData?.data?.[0];
  const chartStyle = {
    flexDirection: "column",
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
    width: "50%",
    padding: "20px",
  };

  if (showDivider) {
    chartStyle["borderRight"] = "1px solid #D6D5D4";
  }

  return (
    <div className="cursorPointer" style={chartStyle}>
      {chartData?.headerSymbol !== "percentage" ? (
        <MetricData t={t} data={chartData}></MetricData>
      ) : (
        <div style={{ width: "80%", margin: "auto" }}>
          <CircularProgressBar data={chartData} />
        </div>
      )}
      <div className={`tooltip`}>
        <div style={{ fontSize: "14px", marginTop: chartData?.headerSymbol === "percentage" ? "" : "15px" }}>{typeof name == "string" && name}</div>
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
            marginLeft: -150
          }}
        >
          <span style={{ fontWeight: "500", color: "white" }}>{t(`TIP_${data.name}`)}</span>
          <span style={{ color: "white" }}> {showDate?.[id]?.lastUpdatedTime}</span>
        </span>
      </div>
      {subText && <p style={{ color: "#505A5F", fontWeight: 400, fontSize:"14px" }}>{subText}</p>}
      {chartData?.insight ? <Insight data={response?.responseData?.data?.[0]} t={t} /> : null}
    </div>
  );
};

const RichSummary = ({ data }) => {
  const { t } = useTranslation();
  const { value } = useContext(FilterContext);
  return (
    <Card className="chart-item" style={{ width: "30%", justifyContent: "center", minWidth: "400px", marginLeft: "0px !important" }}>
      <div className="summary-wrapper">
        <div className="wrapper-child fullWidth">
          <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "row" }}>
            <div className="dss-card-header" style={{ marginBottom: "10px" }}>
              {/* {Icon(data?.name)} */}
              <p style={{ marginLeft: "20px" }}>{t(data?.name)}</p>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", padding: "20px", textAlign: "center", flexWrap: "wrap" }}>
            {data.charts.map((chart, key) => (
              <Chart data={chart} showDivider={key % 2 === 0} key={key} url={data?.ref?.url} />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RichSummary;
