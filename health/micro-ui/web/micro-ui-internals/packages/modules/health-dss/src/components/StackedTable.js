import React, { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import GenericChart from "./GenericChart";
import { getTitleHeading } from "../utils/locale";
import FilterContext from "./FilterContext";
import { Button } from "@egovernments/digit-ui-components";
import { useHistory } from "react-router-dom";
import { getDuration } from "../utils/getDuration";
import { useLocation } from "react-router-dom";

export default function StackedTable({ chartId, visualizer, initialRange, isNational, routeTo, redirectUrl }) {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { value } = useContext(FilterContext);
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const { campaignNumber } = Digit.Hooks.useQueryParams();
  const history = useHistory();

  const getInitialRange = () => {
    if (initialRange) {
      return initialRange;
    }

    const data = Digit.SessionStorage.get("DSS_FILTERS");
    const startDate = data?.range?.startDate ? new Date(data?.range?.startDate) : Digit.Utils.dss.getDefaultFinacialYear().startDate;
    const endDate = data?.range?.endDate ? new Date(data?.range?.endDate) : Digit.Utils.dss.getDefaultFinacialYear().endDate;
    const interval = getDuration(startDate, endDate);
    return { startDate, endDate, interval };
  };

  const { startDate, endDate, interval } = getInitialRange();
  const requestDate = {
    startDate: startDate.getTime(),
    endDate: endDate.getTime(),
    interval: interval,
    title: "home",
  };
  const aggregationRequestDto = {
    visualizationCode: chartId,
    visualizationType: "table",
    queryType: "",
    requestDate: requestDate,
    filters: {campaignNumber: campaignNumber },
    aggregationFactors: null,
  };
  const { isLoading:isFetchingChart, data: response } = Digit.Hooks.DSS.useGetChartV2(aggregationRequestDto);


  const AbsoluteCell = (absValue, absText) => {
    return (
      <div className="digit-stacked-abs-cell">
        <div className="digit-stacked-abs-value">{Digit.Utils.dss.formatter(absValue, "number", value?.denomination, true, t)}</div>
        <div className="digit-stacked-cell-sub-text">{t(`DSS_${Digit.Utils.locale.getTransformedLocale(absText)}`)}</div>
      </div>
    );
  };

  const PercentageCell = (percentageValue, percentageText, index) => {
    const color = ["#f92323", "#f1f438", "#F47738", "#0babde", "#3b38f4", "#d538f4", "#3ef438"];
    const value = Digit.Utils.dss.formatter(percentageValue, "percentage", percentageValue?.denomination, true, t).replace(" ", "");
    const progressWidth = percentageValue > 100 ? 100.0 : percentageValue;
    return (
      <div className="digit-stacked-percentage-cell">
        <div className="digit-stacked-progress-cell">
          <div className="digit-stacked-percentage-value">{value}</div>
          <div className="digit-stacked-percentage-bar-grey">
            <div
              className="digit-stacked-percentage-bar-progress"
              style={{ width: `${progressWidth}%`, backgroundColor: `${color[index % color.length]}` }}
            >
              <div className="digit-stacked-progress-end-circle" />
            </div>
          </div>
        </div>
        <div className="digit-stacked-cell-sub-text">{t(`DSS_${Digit.Utils.locale.getTransformedLocale(percentageText)}`)}</div>
      </div>
    );
  };

  const StackedRowV2 = (rowData) => {
    const values = rowData?.values;
    const valueKeys = Object.keys(values);
    const location = useLocation();
    const levelMap = location.state?.levelMap || Digit.SessionStorage.get("levelMap");;
    const targetValue = "level-two";
    const boundaryType = Object.keys(levelMap).find(key => levelMap[key] === targetValue)?.toLowerCase();

    return (
      <div className="digit-stacked-row">
        <div className="digit-stacked-row-index">{getTitleHeading(rowData?.name)}</div>
        {valueKeys?.map((key, index) => {
          const valueItem = values[key];
          return (
            <React.Fragment>
              {valueItem?.symbol === "percentage" ? PercentageCell(valueItem?.value, key, index) : AbsoluteCell(valueItem?.value, key)}
            </React.Fragment>
          );
        })}
        <Button
          type={"button"}
          label={t("DSS_VIEW_DASHBOARD")}
          variation={"secondary"}
          title={t("DSS_VIEW_DASHBOARD")}
          t={t}
          onClick={() => {
            history.push(
              `/${window.contextPath}/employee/dss/level-two/${redirectUrl}?campaignNumber=${campaignNumber}&boundaryType=${boundaryType}&boundaryValue=${rowData?.name}`,
              {}
            );
          }}
        ></Button>
      </div>
    );
  };

  useEffect(() => {
    let disabledData = [];
    let enabledData = [];
    let plotKeys = [];
    let plotSymbols = [];
    let descendantProjectDateRange = {};

    response?.responseData?.data?.forEach((row) => {
      descendantProjectDateRange[row?.headerName] = {};
      let filteredPlots = [];
      row.plots?.forEach((plot) => {
        if (plot.name && plot.label === null) {
          if (plot.name === "startDate" || plot.name === "endDate") {
            descendantProjectDateRange[row?.headerName][plot.name] = plot.value;
            return;
          } else if (!plotKeys.includes(plot.name)) {
            plotKeys.push(plot.name);
            plotSymbols.push(plot.symbol);
          }
          filteredPlots.push(plot);
        }
      });
      row.plots = filteredPlots;
    });
    Digit.SessionStorage.set("descendantDateRange", descendantProjectDateRange);

    response?.responseData?.data?.forEach((row) => {
      let values = {};
      let shouldDisableRow = true;

      row.plots?.map((plot) => {
        if (plot.name && plot.label === null) {
          if (plot.value !== 0) {
            shouldDisableRow = false;
          }
          values[plot.name] = {
            value: plot.value,
            symbol: plot.symbol,
          };
        }
      });

      const mergedArray = Object.keys(values).concat(plotKeys);
      mergedArray.sort((a, b) => plotKeys.indexOf(a) - plotKeys.indexOf(b));

      let mergedValues = {};
      mergedArray.forEach((k, i) => {
        if (!values[k]) {
          mergedValues[k] = {
            value: 0,
            symbol: plotSymbols[i],
          };
        } else {
          mergedValues[k] = {
            value: values[k].value,
            symbol: values[k].symbol,
          };
        }
      });

      if (mergedValues != {}) {
        const obj = {
          name: row.headerName,
          values: mergedValues,
          shouldDisableRow,
        };

        if (shouldDisableRow) {
          disabledData.push(obj);
        } else {
          enabledData.push(obj);
        }
      }
    });

    enabledData.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
    disabledData.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

    const data = enabledData.concat(disabledData);

    setChartData(data);
  }, [isFetchingChart, response]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const filteredRows = () => {
    let filteredData = chartData;

    if (searchQuery?.length > 0) {
      filteredData = filteredData?.filter((data) => {
        if (data.name?.toLowerCase().startsWith(searchQuery.toLowerCase())) {
          return data;
        }
      });
    }

    if (filteredData?.length) {
      return filteredData?.map((item) => StackedRowV2(item));
    } else {
      return <div className="digit-stacked-row">{t("DSS_NO_RESULTS")}</div>;
    }
  };
  const subHead = "SUB_" + visualizer?.name;
  return (
    <GenericChart header={visualizer?.name} showSearch={true} className={"digit-stacked-table"} subHeader={t(subHead)} onChange={handleSearch}>
      <div className="digit-stacked-table-container">
        {chartData?.length ? filteredRows() : <div className="digit-stacked-row">{t("DSS_NO_DATA")}</div>}
      </div>
    </GenericChart>
  );
}
