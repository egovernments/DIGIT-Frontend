import { differenceInCalendarDays, subYears } from "date-fns";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Loader, Chip , SVG} from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import FilterContext from "./FilterContext";
import NoData from "./NoData";
import ReactTooltip from "react-tooltip";
import { getTitleHeading } from "../utils/locale";
import DataTable from "react-data-table-component";
import { tableCustomStyle } from "./TableCustomStyles";
import Icon from "./Icon";

const rowNamesToBeLocalised = ["Department", "", "Usage Type", "Ward", "Wards", "City Name", "Complaint Type", "Event Type"];

const InsightView = ({ rowValue, insight, t, shouldHideInsights }) => {
  return (
    <span>
      {rowValue}
      {!shouldHideInsights ? (
        <React.Fragment>
          {` `}
          <Icon
            type={insight >= 0 ? "arrow-upward" : "arrow-downward"}
            iconColor={insight >= 0 ? "#00703C" : "#D4351C"}
            width="1.5rem"
            height="1.5rem"
            className="digit-dss-insight-icon"
          />
          {` `}
          {isNaN(insight) ? `0%` : `${Digit.Utils.dss.formatter(Math.abs(insight), "number", "Lac", true, t)}%`}
        </React.Fragment>
      ) : null}
    </span>
  );
};

const calculateFSTPCapacityUtilization = (value, totalCapacity, numberOfDays = 1) => {
  if (value === undefined) return value;
  return Math.round((value / (totalCapacity * numberOfDays)) * 100);
};

const CustomTable = ({ data = {}, onSearch = { searchQuery }, setChartData, setChartDenomination }) => {
  const { id } = data;
  const [chartKey, setChartKey] = useState(id);
  const [filterStack, setFilterStack] = useState([{ id: chartKey}]);
  const { t } = useTranslation();
  const { value, setValue, ulbTenants, fstpMdmsData } = useContext(FilterContext);
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const dssTenants = Digit.SessionStorage.get("DSS_TENANTS");
  const { campaignNumber } = Digit.Hooks.useQueryParams();
  const lastYearDate = {
    startDate: subYears(value?.range?.startDate, 1).getTime(),
    endDate: subYears(value?.range?.endDate, 1).getTime(),
    interval: "month",
    title: "",
  };
  const aggregationRequestDto1 = {
    visualizationCode: chartKey,
    visualizationType: "metric",
    queryType: "",
    requestDate: { ...lastYearDate },
    filters:
      id === chartKey
        ? {
            ...value?.filters,
            campaignNumber: campaignNumber,
          }
        : {
            ...value?.filters,
            [filterStack[filterStack.length - 1]?.filterKey]: filterStack[filterStack.length - 1]?.filterValue,
            campaignNumber: campaignNumber,
          },
    addlFilter: filterStack[filterStack.length - 1]?.addlFilter,
    moduleLevel: value?.moduleLevel,
    aggregationFactors: null,
  };
  const { isLoading: isRequestLoading, data: lastYearResponse } = Digit.Hooks.DSS.useGetChartV2(aggregationRequestDto1);
  const aggregationRequestDto2 = {
    visualizationCode: chartKey,
    visualizationType: "metric",
    queryType: "",
    requestDate: { ...value?.requestDate, startDate: value?.range?.startDate?.getTime(), endDate: value?.range?.endDate?.getTime() },
    filters:
      id === chartKey
        ? {
            ...value?.filters,
            campaignNumber: campaignNumber,
          }
        : {
            ...value?.filters,
            [filterStack[filterStack.length - 1]?.filterKey]: filterStack[filterStack.length - 1]?.filterValue,
            campaignNumber: campaignNumber,
          },
    addlFilter: filterStack[filterStack.length - 1]?.addlFilter,
    moduleLevel: value?.moduleLevel,
    aggregationFactors: null,
  };
  const { isLoading, data: response, refetch } = Digit.Hooks.DSS.useGetChartV2(aggregationRequestDto2);

  useEffect(() => {
    refetch();
  }, [filterStack]);


  useEffect(() => {
    const { id } = data;
    setChartKey(id);
    setFilterStack([{ id: id }]);
  }, [data, value]);
  const tableData = useMemo(() => {
    if (!response || !lastYearResponse) return;
    setChartDenomination(response?.responseData?.data?.[0]?.headerSymbol);
    return response?.responseData?.data
      ?.filter((rows) => {
        // Only apply search filtering if onSearch is a string longer than 1 char
        if (typeof onSearch === "string" && onSearch.length > 1) {
          return rows?.headerName?.toLowerCase().startsWith(onSearch.toLowerCase());
        }
        return true; // If onSearch not valid, include all
      })
      ?.map((rows, id) => {
        const lyData = lastYearResponse?.responseData?.data?.find((lyRow) => lyRow?.headerName === rows?.headerName);
        return rows?.plots?.reduce((acc, row, currentIndex) => {
          let cellValue = row?.value !== null ? row?.value : row?.label || "";
          if (row?.strValue && row?.symbol === "string" && !row?.label) {
            cellValue = row?.strValue;
          }
          let prevData = lyData?.plots?.[currentIndex]?.value;
          let insight = null;
          if (row?.name === "CapacityUtilization") {
            const { range } = value;
            const { startDate, endDate } = range;
            const numberOfDays = differenceInCalendarDays(endDate, startDate) + 1;
            const ulbs = dssTenants
              .filter((tenant) => tenant?.city?.ddrName === rows?.headerName || tenant?.code === rows?.headerName)
              .map((tenant) => tenant?.code);
            const totalCapacity = fstpMdmsData
              ?.filter((plant) => ulbs.find((ulb) => plant?.ULBS?.includes(ulb)))
              .reduce((acc, plant) => acc + Number(plant?.PlantOperationalCapacityKLD), 0);
            cellValue = calculateFSTPCapacityUtilization(cellValue, totalCapacity, numberOfDays);
            prevData = calculateFSTPCapacityUtilization(prevData, totalCapacity, numberOfDays);
          }
          if (row?.name === "CapacityUtilization") {
            const tankCapcity = rows?.plots.find((plot) => plot?.name === "TankCapacity");
            cellValue = calculateFSTPCapacityUtilization(cellValue, tankCapcity?.value);
            prevData = calculateFSTPCapacityUtilization(prevData, tankCapcity?.value);
          }
          if (
            (row?.symbol === "number" || row?.symbol === "percentage" || row?.symbol === "amount") &&
            row?.name !== "CitizenAverageRating" &&
            row?.name !== "TankCapacity" &&
            lyData !== undefined
          ) {
            if (prevData === cellValue) insight = 0;
            else insight = prevData === 0 ? 100 : Math.round(((cellValue - prevData) / prevData) * 100);
          }
          if (typeof cellValue === "number" && !Number.isInteger(cellValue)) {
            cellValue = Math.round((cellValue + Number.EPSILON) * 100) / 100;
          }
          if (typeof cellValue === "string" && rowNamesToBeLocalised?.includes(row.name)) {
            cellValue = t(`DSS_TB_` + Digit.Utils.locale.getTransformedLocale(cellValue));
          }
          if (row?.name?.toLowerCase().includes("days")) {
            cellValue = Math.floor(cellValue);
          }
          acc[t(`DSS_HEADER_${Digit.Utils.locale.getTransformedLocale(row?.name)}`)] =
            insight !== null
              ? { value: cellValue, insight }
              : row?.name === "S.N."
              ? id + 1
              : typeof cellValue === "number"
              ? { value: cellValue }
              : cellValue;
          acc["key"] = rows?.headerName;
          return acc;
        }, {});
      });
  }, [response, lastYearResponse, onSearch, filterStack]);

  useEffect(() => {
    if (tableData) {
      const result = tableData?.map((row) => {
        return Object.keys(row).reduce((acc, key) => {
          if (key === "key") return acc;
          acc[key] = typeof row?.[key] === "object" ? row?.[key]?.value : row?.[key];
          return acc;
        }, {});
      });
      setChartData(result);
    } else {
      const result = [];
      setChartData(result);
    }
  }, [tableData]);

  const filterValue = useCallback((rows, id, filterValue = "") => {
    return rows.filter((row) => {
      const res = Object.keys(row?.values).find((key) => {
        if (typeof row?.values?.[key] === "object") {
          return Object.keys(row?.values?.[key]).find((id) => {
            if (id === "insight") {
              return String(Math.abs(row?.values?.[key]?.[id]) + "%")
                .toLowerCase()
                .startsWith(filterValue?.toLowerCase());
            }
            return String(row?.values?.[key]?.[id])?.toLowerCase().includes(filterValue?.toLowerCase());
          });
        }
        return (
          String(row?.values?.[key]).toLowerCase()?.includes(filterValue?.toLowerCase()) ||
          String(t(row?.values?.[key])).toLowerCase()?.includes(filterValue?.toLowerCase())
          /* search in the table to get filter along with space is currently enabled
          Also replace startsWith with includes
          String(row?.values?.[key])
            .toLowerCase()
            .split(" ")
            .some((str) => str?.startsWith(filterValue?.toLowerCase())) ||
          String(t(row?.values?.[key]))
            .toLowerCase()
            .split(" ")
            .some((str) => str.startsWith(filterValue?.toLowerCase()))
            */
        );
      });
      return res;
    });
  }, []);

  const renderUnits = (denomination) => {
    switch (denomination) {
      case "Unit":
        return `(${t("DSS_" + Digit.Utils.locale.getTransformedLocale(denomination))})`;
      case "Lac":
        return `(${t("DSS_" + Digit.Utils.locale.getTransformedLocale(denomination))})`;
      case "Cr":
        return `(${t("DSS_" + Digit.Utils.locale.getTransformedLocale(denomination))})`;
      default:
        return "";
    }
  };

  const renderHeader = (plot) => {
    const shouldHideDenomination = response?.responseData?.hideHeaderDenomination;

    const code = `DSS_HEADER_${Digit.Utils.locale.getTransformedLocale(plot?.name)}`;
    if (plot?.symbol === "amount" && !shouldHideDenomination) {
      return `${t(code)} ${renderUnits(value?.denomination)}`;
    }
    return <div className="table-column-header">{t(code)}</div>;
  };

  const getDrilldownCharts = (value, filterKey, label, filters = []) => {
    if (response?.responseData?.drillDownChartId && response?.responseData?.drillDownChartId !== "none") {
      let currentValue = value;
      if (filterKey === "tenantId") {
        currentValue = dssTenants
          ?.filter((tenant) => tenant?.city?.ddrName === value || tenant?.code === value || tenant?.description === value)
          .map((tenant) => tenant?.code);
        if (currentValue?.length == 0 && value) {
          currentValue = [value];
        }
        /*  Removed this mdms active tenants filter logic as per RAIN-5454
        currentValue = dssTenants.filter((tenant) => tenant?.city?.ddrName === value || tenant?.code === value).map((tenant) => tenant?.code);
        */
        if (currentValue === undefined) return;
      }

      let newStack = { id: response?.responseData?.drillDownChartId, name: getTitleHeading(value), filterKey, filterValue: currentValue, label };
      if (filters.length > 1) {
        let newFilter = filters.filter((ele) => ele.key != filterKey);
        newStack["addlFilter"] = { [newFilter?.[0]?.key]: filterStack?.[filterStack?.length - 1]?.filterValue };
        newFilter.map((fil) => {
          newStack["addlFilter"][fil?.key] =
            filterStack?.filter((e) => e.filterKey == fil?.key)?.[0]?.filterValue ||
            filterStack?.filter((e) => e.filterKey == "tenantId")?.[0]?.filterValue;
        });
      }
      setFilterStack([...filterStack, newStack]);
      setChartKey(response?.responseData?.drillDownChartId);
    }
  };

  useEffect(() => {
    if (response?.responseData?.data?.length === 0 && !["none", ""].includes(response?.responseData?.drillDownChartId)) {
      setChartKey(response?.responseData?.drillDownChartId);
    }
  }, [response]);

  const sortRows = useCallback((rowA, rowB, columnId) => {
    const firstCell = rowA?.values?.[columnId];
    const secondCell = rowB?.values?.[columnId];
    let value1, value2;
    value1 = typeof firstCell === "object" ? firstCell?.value : firstCell;
    value2 = typeof secondCell === "object" ? secondCell?.value : secondCell;
    return String(value1).localeCompare(String(value2), undefined, { numeric: true });
  }, []);

  const accessData = (plot) => {
    const name = t(`DSS_HEADER_${Digit.Utils.locale.getTransformedLocale(plot?.name)}`);
    return (originalRow, rowIndex, columns) => {
      const cellValue = originalRow?.[name];
      if (plot?.symbol === "amount") {
        return typeof cellValue === "object"
          ? { value: Digit.Utils.dss.formatter(convertDenomination(cellValue?.value), "number", "Lac", true, t), insight: cellValue?.insight }
          : String(Digit.Utils.dss.formatter(convertDenomination(cellValue), "number", "Lac", true, t));
      } else if (plot?.symbol === "number") {
        return typeof cellValue === "object"
          ? { value: Digit.Utils.dss.formatter(cellValue?.value, "number", "Lac", true, t), insight: cellValue?.insight }
          : String(Digit.Utils.dss.formatter(cellValue, "number", "Lac", true, t));
      } else if (plot?.symbol === "percentage") {
        return {
          value: Digit.Utils.dss.formatter(cellValue?.value, "percentage", cellValue?.value?.denomination, true, t).replace(" %", ""),
          insight: cellValue?.insight,
        };
      }

      return originalRow[name];
    };
  };
  const isMobile = window.Digit.Utils.browser.isMobile();

  const getTooltipStyles = (name) => {
    if (isMobile)
      return {
        height: "fit-content",
        background: "#555",
        padding: "5px",
        wordBreak: name?.length > 100 ? "break-all" : "break-word",
        overflowWrap: "break-word",
        borderRadius: "6px",
        maxWidth: "205px",
      };
    else
      return {
        height: "fit-content",
        background: "#555",
        width: "fit-content",
        padding: "5px",
        wordBreak: name?.length > 100 ? "break-all" : "break-word",
        overflowWrap: "break-word",
        borderRadius: "6px",
      };
  };

  const tableColumns = useMemo(() => {
    const columns = response?.responseData?.data?.find((row) => !!row);
    const chartId = response?.responseData?.visualizationCode;
    const firstPlotName = columns?.plots[0]?.name;
    return columns?.plots
      ?.filter((plot) => plot?.name !== "TankCapacity")
      .map((plot, index) => {
        const columnId = plot?.name?.replaceAll(".", " ");
        const headerLocaleKey = `DSS_HEADER_${Digit.Utils.locale.getTransformedLocale(plot?.name)}`;
        const tooltipLocaleKey = `TIP_DSS_HEADER_${Digit.Utils.locale.getTransformedLocale(plot?.name)}`;
        const localizedHeader = t(headerLocaleKey);

        return {
          name: (
            <span className="tooltip" data-tip="React-tooltip" data-for={`jk-table-${chartId}-${index}`} color="#OBOCOC">
              {renderHeader(plot)}
              <ReactTooltip textColor="#fff" backgroundColor="#555" place="bottom" type="info" effect="solid" id={`jk-table-${chartId}-${index}`}>
                {t(tooltipLocaleKey)}
              </ReactTooltip>
            </span>
          ),

          selector: (row) => {
            const cellValue = row?.[localizedHeader];
            return typeof cellValue === "object" ? cellValue?.value : cellValue;
          },

          cell: (row, index, column, id) => {
            const cellValue = row?.[localizedHeader];

            if (typeof cellValue === "object") {
              return (
                <InsightView
                  insight={cellValue?.insight}
                  rowValue={cellValue?.value}
                  t={t}
                  shouldHideInsights={response?.responseData?.hideInsights}
                />
              );
            }

            const filter = response?.responseData?.filter?.find((elem) => elem?.column === columnId);
            if (response?.responseData?.drillDownChartId !== "none" && filter !== undefined) {
              return (
                <span
                  className="digit-custom-table-drilldown-text"
                  onClick={() =>
                    getDrilldownCharts(
                      cellValue?.includes("DSS_TB_") ? row?.original?.key : cellValue,
                      filter?.key,
                      t(headerLocaleKey),
                      response?.responseData?.filter
                    )
                  }
                >
                  {getTitleHeading(cellValue)}
                </span>
              );
            }

            return String(t(cellValue));
          },

          sortable: true,

          sortFunction: (rowA, rowB) => {
            const a = rowA?.[localizedHeader];
            const b = rowB?.[localizedHeader];
          
            const normalize = (val) => {
              if (typeof val === "object") {
                const num = parseFloat(val?.value?.toString().replace(/,/g, ""));
                return isNaN(num) ? val?.value?.toString() : num;
              }
              if (typeof val === "string") {
                const num = parseFloat(val.replace(/,/g, ""));
                return isNaN(num) ? val.toLowerCase() : num;
              }
              if (typeof val === "number") return val;
              return "";
            };
          
            const valueA = normalize(a);
            const valueB = normalize(b);
          
            if (typeof valueA === "number" && typeof valueB === "number") {
              return valueA - valueB;
            }
          
            // Fallback to string comparison
            return valueA.toString().localeCompare(valueB.toString());
          },

          
          id: columnId,
          symbol: plot?.symbol,
          // keeping as-is for any other consumers of this object
          nameText: t(tooltipLocaleKey),
          width:plot?.name==="S.N." ? "100px" : "300px",
        };
      });
  }, [response, value?.denomination, value?.range]);

  const convertDenomination = (val) => {
    const { denomination } = value;
    switch (denomination) {
      case "Unit":
        return val;
      case "Lac":
        return Number((val / 100000).toFixed(2));
      case "Cr":
        return Number((val / 10000000).toFixed(2));
      default:
        return val;
    }
  };

  const removeULB = (id) => {
    const nextState = filterStack?.filter((filter, index) => index < id);
    setFilterStack(nextState);
    setChartKey(nextState[nextState?.length - 1]?.id);
  };

  const removeFilter = (id) => {
    setFilterStack(prev => {
      const newStack = prev.filter((_, idx) => idx < id);
      const lastId = newStack.length > 0 ? newStack[newStack.length - 1].id : data?.id;
      setChartKey(lastId);
      return newStack;
    });
  };
  

  

  if (isLoading || isRequestLoading) {
    return <Loader className={"digit-center-loader"} />;
  }
  return (
    <div style={{maxWidth:"100%"}}>
      {/* Filters stack */}
      {filterStack?.length > 1 && (
        <div className="digit-tag-container customTable">
          <div className="digit-tag-filter-text">{t("DSS_FILTERS_APPLIED")}: </div>
          {filterStack.map((filter, id) =>
            id > 0 ? <Chip key={id} text={`${filter?.label}: ${filter?.name}`} onClick={() => removeFilter(id)} hideClose={false} /> : null
          )}
        </div>
      )}
      {/* Data Table or NoData */}
      {!tableColumns || !tableData ? (
        <NoData t={t} />
      ) : (
        <DataTable
          columns={tableColumns}
          className={`data-table health-dss-inbox-table customTable`}
          data={tableData?.filter((tRow) => tRow) || []}
          pagination
          highlightOnHover
          persistTableHead
          noHeader={false}
          customStyles={tableCustomStyle}
          defaultSortFieldId={tableColumns[0]?.id}
          fixedHeader={true}
          paginationComponentOptions={{ rowsPerPageText: t("CS_COMMON_ROWS_PER_PAGE") }}
          sortIcon={<SVG.ArrowUpward width={"16px"} height={"16px"} fill={"#0b4b66"}/>}
        />
      )}
    </div>
  );
};

export default CustomTable;
