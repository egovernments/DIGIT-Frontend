import React, { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Loader, Card } from "@egovernments/digit-ui-components";
import format from "date-fns/format";
import FilterContext from "./FilterContext";
import NoData from "./NoData";
import { endOfToday, startOfToday } from "date-fns";
import Icon from "./Icon";

const BannerCard = ({ data }) => {
  const { t } = useTranslation();
  const { id, chartType } = data;
  const chartName = data?.name;
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const { value } = useContext(FilterContext);
  const isMobile = window.Digit.Utils.browser.isMobile();
  const { campaignNumber } = Digit.Hooks.useQueryParams();
  const getWidth = (name) => {
    if (isMobile) return "auto";
    else return t(`TIP_${name}`).length < 50 ? "fit-content" : 400;
  };

  const getHeight = () => {
    if (isMobile) return "auto";
    else return 50;
  };

  const requestDate = {
    startDate: startOfToday(new Date()),
    endDate: endOfToday(new Date()),
  };

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

  const { isLoading: isFetchingChart, data: response } =Digit.Hooks.DSS.useGetChartV2(aggregationRequestDto);
  
  const getSubHeading = () => {
    const date = new Date();
    // const zeroTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const formattedStartTime = format(requestDate?.startDate, "dd-MMM-yyyy HH:mm:ss");
    const formattedEndTime = format(requestDate?.endDate, "dd-MMM-yyyy HH:mm:ss");
    return `${t("SUB_" + chartName)} ${formattedStartTime} to ${formattedEndTime}`;
  };

  const chartData = useMemo(() => {
    let data = [];

    response?.responseData?.data?.forEach((row) => {
      row.plots?.forEach((plot) => {
        if (plot.name && plot.label === null) {
          data.push({
            name: plot.name,
            value: plot.value,
            symbol: plot.symbol,
          });
        }
      });
    });

    return data;
  }, [isFetchingChart, response]);

  const Cell = ({ name, value, symbol }) => {
    let formattedValue = value;
    if (symbol === "number") {
      formattedValue = Digit.Utils.dss.formatter(formattedValue, "number", value?.denomination, true, t);
    }
    if (symbol === "percentage") {
      formattedValue = Digit.Utils.dss.formatter(formattedValue, "percentage", value?.denomination, true, t).replace(" ", "");
    }

    return (
      <div className="digit-banner-cell">
        <div className="digit-banner-cell-sub-text">{t("DSS_" + name?.replaceAll(" ", "_").toUpperCase())}</div>
        <div className="digit-banner-value">{formattedValue}</div>
      </div>
    );
  };

  const renderMetrics = () => {
    if (chartData?.length === 0) {
      return (
        <div style={{ margin: "0px auto" }}>
          <NoData t={t} />
        </div>
      );
    }

    return chartData.map((data) => {
      return (
        <div className="digit-banner-table tooltip">
          <Cell name={data.name} value={data.value} symbol={data.symbol} />
          <span
            style={{
              width: getWidth(data?.name),
            }}
            className={"tooltiptext digit-banner-tooltip"}
          >
            <span className={"digit-banner-tooltip-text"}>{t(`TIP_DSS_${data.name.toUpperCase()}`)}</span>
          </span>
        </div>
      );
    });
  };

  return (
    <Card className="digit-banner-card digit-chart-item">
      <div className="digit-banner-card-header">
        <Icon type={chartName} width="3rem" height="3rem" className="digit-dss-banner-card-icon" />
        <div className="digit-banner-heading">
          <div className="digit-banner-main-heading">{t(chartName)}</div>
          <div className="digit-banner-sub-heading">{getSubHeading()}</div>
        </div>
      </div>
      {isFetchingChart ? (
        <div style={{ margin: "auto" }}>
          <Loader className={"digit-center-loader"}/>
        </div>
      ) : (
        <React.Fragment>{renderMetrics()}</React.Fragment>
      )}
    </Card>
  );
};

export default BannerCard;
