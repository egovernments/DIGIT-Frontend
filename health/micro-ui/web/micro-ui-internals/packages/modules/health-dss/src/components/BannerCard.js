import { Card } from "@egovernments/digit-ui-react-components";
import React, { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Loader } from "@egovernments/digit-ui-react-components";
import format from "date-fns/format";
import FilterContext from "./FilterContext";
import NoData from "./NoData";
// import { Icon } from "../components/common/Icon";
import {
  endOfToday,
  startOfToday
} from "date-fns";

const BannerCard = ({ data }) => {
  const { t } = useTranslation();
  const { id, chartType } = data;
  const chartName = data?.name;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { value } = useContext(FilterContext);
  const isMobile = window.Digit.Utils.browser.isMobile();
  const { projectTypeId} = Digit.Hooks.useQueryParams();
  const selectedProjectTypeId = projectTypeId ? projectTypeId : Digit.SessionStorage.get("selectedProjectTypeId");



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

  const { isLoading: isFetchingChart, data: response } = Digit.Hooks.dss.useGetChart({
    key: id,
    type: chartType,
    tenantId,
    requestDate: { ...value?.requestDate, startDate: requestDate?.startDate?.getTime(), endDate: requestDate?.endDate?.getTime() },
    filters: {
      ...value?.filters,
      projectTypeId: selectedProjectTypeId
    },
  });

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
      formattedValue =  Digit.Utils.dss.formatter(formattedValue, "number", value?.denomination, true, t);
    }
    if (symbol === "percentage") {
      formattedValue =  Digit.Utils.dss.formatter(formattedValue, "percentage", value?.denomination, true, t).replace(" ", "");
    }

    return (
      <div className="banner-cell">
        <div className="banner-cell-sub-text">{t("DSS_" + name?.replaceAll(" ", "_").toUpperCase())}</div>
        <div className="banner-value">{formattedValue}</div>
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
        <div className="banner-table cursorPointer tooltip">
          <Cell name={data.name} value={data.value} symbol={data.symbol} />
          <span
            className="tooltiptext"
            style={{
              fontSize: "14px",
              width: getWidth(data?.name),
              padding: "5px",
              whiteSpace: "normal",
              bottom: "95%",
            }}
          >
            <span style={{ fontWeight: "500", color: "white" }}>{t(`TIP_DSS_${data.name.toUpperCase()}`)}</span>
          </span>
        </div>
      );
    });
  };

  return (
    <Card className="banner-card chart-item">
      <div className="banner-card-header">
        {/* {Icon(chartName)} */}
        <div className="banner-heading">
          <div className="banner-main-heading">{t(chartName)}</div>
          <div className="banner-sub-heading">{getSubHeading()}</div>
        </div>
      </div>
      {isFetchingChart ? (
        <div style={{ margin: "auto" }}>
          <Loader />
        </div>
      ) : (
        <React.Fragment>{renderMetrics()}</React.Fragment>
      )}
    </Card>
  );
};

export default BannerCard;
