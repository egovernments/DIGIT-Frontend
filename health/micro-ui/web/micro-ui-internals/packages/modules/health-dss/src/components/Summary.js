import { Card, Loader } from "@egovernments/digit-ui-components";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "./Icon";
import FilterContext from "./FilterContext";

const MetricData = ({ t, data }) => {
  const { value } = useContext(FilterContext);
  const insight = data?.insight?.value?.replace(/[+-]/g, "")?.split("%");
  return (
    <div>
      <p className="heading-m" style={{ paddingTop: "0px", whiteSpace: "nowrap", marginLeft: "0px" }}>
        {`${Digit.Utils.dss.formatter(data?.headerValue, data?.headerSymbol, value?.denomination, true, t)}`}
      </p>
      {data?.insight && (
        <div className={`digit-dss-insight-card-difference ${data?.insight?.indicator === "upper_green" ? "increase" : "decrease"}`}>
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
      )}
    </div>
  );
};

const Chart = ({ data }) => {
  const { id, chartType } = data;
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const { t } = useTranslation();
  const { value } = useContext(FilterContext);
  const { campaignNumber } = Digit.Hooks.useQueryParams();
  const [showDate, setShowDate] = useState({});
  const isMobile = window.Digit.Utils.browser.isMobile();
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
  let name = t(data?.name) || "";

  const getWidth = (data) => {
    if (isMobile) return "auto";
    else return t(`TIP_${data.name}`).length < 50 ? "fit-content" : 400;
  };

  const getHeight = (data) => {
    if (isMobile) return "auto";
    else return 50;
  };
  return (
    <div className="blocks cursorPointer" style={{ flexDirection: "column" }}>
      <div className={`tooltip`}>
        {typeof name == "string" && name}
        {Array.isArray(name) && name?.filter((ele) => ele)?.map((ele) => <div style={{ whiteSpace: "pre" }}>{ele}</div>)}
        <span className="dss-white-pre" style={{ display: "block" }}>
          {" "}
          {showDate?.[id]?.todaysDate}
        </span>
        <span
          className="tooltiptext"
          style={{
            fontSize: "medium",
            width: getWidth(data),
            height: getHeight(data),
            whiteSpace: "normal",
          }}
        >
          <span style={{ fontWeight: "500", color: "white" }}>{t(`TIP_${data.name}`)}</span>
          <span style={{ color: "white" }}> {showDate?.[id]?.lastUpdatedTime}</span>
        </span>
      </div>
      <MetricData t={t} data={response?.responseData?.data?.[0]}></MetricData>
    </div>
  );
};
const Summary = ({ data }) => {
  const { t } = useTranslation();
  const { value } = useContext(FilterContext);
  return (
    <Card style={{ flexBasis: "100%" }} className="summary-card-margin">
      <div className="summary-wrapper">
        <div className="wrapper-child fullWidth">
          <div className="blocks">
            <p>
              {t(data?.name)}{" "}
              {<span style={{ whiteSpace: "pre" }}> ({t(`DSS_${Digit.Utils.locale.getTransformedLocale(value?.denomination)}`)})</span>}
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {data.charts.map((chart, key) => (
              <Chart data={chart} key={key} url={data?.ref?.url} />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Summary;
