import { Rating } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FilterContext from "./FilterContext";
import Icon from "./Icon";

const MetricData = ({ t, data, code }) => {
  const { value } = useContext(FilterContext);
  const insight = data?.insight?.value?.replace(/[+-]/g, "")?.split("%");
  return (
    <div>
      <p className="heading-m" style={{ textAlign: "right", paddingTop: "0px", whiteSpace: "nowrap" }}>
        {code === "citizenAvgRating" ? (
          <Rating currentRating={Math.round(data?.headerValue * 10) / 10} styles={{ width: "unset" }} starStyles={{ width: "25px" }} />
        ) : (
          `${Digit.Utils.dss.formatter(data?.headerValue, data?.headerSymbol, value?.denomination, true, t)} ${
            code === "totalSludgeTreated" ? t(`DSS_KL`) : ""
          }`
        )}
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

const MetricChartRow = ({ data, setChartDenomination, index }) => {
  const { id, chartType } = data;
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const { campaignNumber } = Digit.Hooks.useQueryParams();
  const { t } = useTranslation();
  const { value } = useContext(FilterContext);
  const [showDate, setShowDate] = useState({});
  const isMobile = window.Digit.Utils.browser.isMobile();
  const aggregationRequestDto = {
    visualizationCode: id,
    visualizationType: chartType,
    queryType: "",
    requestDate: { ...value?.requestDate, startDate: value?.range?.startDate?.getTime(), endDate: value?.range?.endDate?.getTime() },
    filters: { ...value?.filters, campaignNumber: campaignNumber },
    moduleLevel: value?.moduleLevel,
    aggregationFactors: null,
  };
  const { isLoading, data: response } = Digit.Hooks.DSS.useGetChartV2(aggregationRequestDto);

  useEffect(() => {
    if (response) {
      let plots = response?.responseData?.data?.[0]?.plots || null;
      if (plots && Array.isArray(plots) && plots.length > 0 && plots?.every((e) => e.value))
        setShowDate((oldstate) => ({
          ...oldstate,
          [id]: {
            todaysDate: Digit.DateUtils.ConvertEpochToDate(plots?.[0]?.value),
            lastUpdatedTime: Digit.DateUtils.ConvertEpochToTimeInHours(plots?.[1]?.value),
          },
        }));
      index === 0 && setChartDenomination(response?.responseData?.data?.[0]?.headerSymbol);
    } else {
      setShowDate({});
    }
  }, [response]);

  if (isLoading) {
    return false;
  }

  if (!response) {
    return (
      <div className="row">
        <div className={`tooltip`}>
          {t(data.name)}
          <span
            className="tooltiptext"
            style={{
              fontSize: "medium",
              width: t(`TIP_${data.name}`).length < 50 ? "fit-content" : 400,
              height: 50,
              whiteSpace: "normal",
            }}
          >
            <span style={{ fontWeight: "500", color: "white" }}>{t(`TIP_${data.name}`)}</span>
          </span>
        </div>
        <span style={{ whiteSpace: "pre" }}>{t("DSS_NO_DATA")}</span>
      </div>
    );
  }
  let name = t(data?.name) || "";

  const getWidth = (data) => {
    if (isMobile) return "auto";
    else return t(`TIP_${data.name}`).length < 50 ? "fit-content" : 400;
    // if (isMobile) return t(`TIP_${data.name}`).length < 50 ? "fit-content" : 300;
    // else return t(`TIP_${data.name}`).length < 50 ? "fit-content" : 400;
  };

  const getHeight = (data) => {
    if (isMobile) return "auto";
    else return 50;
    // if (isMobile) return t(`TIP_${data.name}`).length < 50 ? 50 : "auto";
    // else return 50;
  };

  return (
    <div className="row">
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
      <MetricData t={t} data={response?.responseData?.data?.[0]} code={response?.responseData?.visualizationCode} />
      {/* <div>{`${displaySymbol(response.headerSymbol)} ${response.headerValue}`}</div> */}
    </div>
  );
};

const MetricChart = ({ data, setChartDenomination }) => {
  const { charts } = data;
  return (
    <>
    <span className="chart-metric-wrapper">
  
      {charts.map((chart, index) => (
        <MetricChartRow data={chart} key={index} index={index} setChartDenomination={setChartDenomination} />
      ))}
        </span>
    </>
  );
};

export default MetricChart;
