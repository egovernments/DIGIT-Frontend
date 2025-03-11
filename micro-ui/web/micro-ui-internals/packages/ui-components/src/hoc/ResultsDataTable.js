import React, {
  useMemo,
  useCallback,
  useState,
  useEffect,
  Fragment,
  useContext,
} from "react";
import { useTranslation } from "react-i18next";
import TextInput from "../atoms/TextInput";
import { useForm, Controller } from "react-hook-form";
import _ from "lodash";
import { InboxContext } from "./InboxSearchComposerContext";
import { Card, Loader } from "../atoms";
import { CustomSVG } from "../atoms";
import DataTable from "react-data-table-component";
import CheckBox from "../atoms/CheckBox";
import { dataTableCustomStyles } from "../constants/styles/dataTableCustomStyles";
import Button from "../atoms/Button";
import CardLabel from "../atoms/CardLabel";
import { SVG } from "../atoms";
import NoResultsFound from "../atoms/NoResultsFound";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay]
  );
  return debouncedValue;
}

const ResultsDataTable = ({
  tableContainerClass,
  config,
  data,
  isLoading,
  isFetching,
  fullConfig,
  revalidate,
  type,
  activeLink,
  browserSession,
  additionalConfig,
  TotalCount
}) => {
  const { apiDetails } = fullConfig;
  const { t } = useTranslation();
  const resultsKey = config.resultsJsonPath;
  const [showResultsTable, setShowResultsTable] = useState(true);
  const [session, setSession, clearSession] = browserSession || [];
  let searchResult = _.get(data, resultsKey, []);
  searchResult = searchResult?.length > 0 ? searchResult : [];
  // searchResult = searchResult.reverse();
  const [selectedRows, setSelectedRows] = useState([]);
  const { state, dispatch } = useContext(InboxContext);
  const configModule =
    Digit?.Customizations?.[apiDetails?.masterName]?.[apiDetails?.moduleName];
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(
    config?.defaultRowsPerPage || 10
  );
  const [limitAndOffset, setLimitAndOffset] = useState({
    limit: rowsPerPage,
    offset: (currentPage - 1) * rowsPerPage,
  });

  //here I am just checking state.searchForm has all empty keys or not(when clicked on clear search)
  useEffect(() => {
    if (
      apiDetails?.minParametersForSearchForm !== 0 &&
      Object.keys(state.searchForm).length > 0 &&
      !Object.keys(state.searchForm).some(
        (key) => state.searchForm[key] !== ""
      ) &&
      type === "search" &&
      activeLink?.minParametersForSearchForm !== 0
    ) {
      setShowResultsTable(false);
    }
    return () => {
      setShowResultsTable(true);
    };
  }, [state]);

  const tableColumns = useMemo(() => {
    //test if accessor can take jsonPath value only and then check sort and global search work properly
    return config?.columns?.map((column) => {
      if (column?.svg) {
        // const icon = Digit.ComponentRegistryService.getComponent(column.svg);
        return {
          id: column?.id,
          name: t(column?.label) || t("ES_COMMON_NA"),
          format: column?.format,
          cell: ({ row, index, column, id }) => {
            return (
              <div
                className="cursorPointer"
                style={{ marginLeft: "1rem" }}
                onClick={() => additionalConfig?.resultsTable?.onClickSvg(row)}
              >
                <CustomSVG.EditIcon />
              </div>
            );
          },
          grow: column?.grow,
          width: column?.width,
          minWidth: column?.minWidth,
          maxWidth: column?.maxWidth,
          right: column?.right,
          center: column?.center,
          ignoreRowClick: column?.ignoreRowClick,
          wrap: column?.wrap,
          sortable: !column?.disableSortBy,
          sortFunction: typeof column?.sortFunction === "function" ? (rowA, rowB) => column?.sortFunction(rowA, rowB) : undefined,
          selector: (row, index) => _.get(row, column?.jsonPath),
          headerAlign: column?.headerAlign,
          style: column?.style,
          conditionalCellStyles: column?.conditionalCellStyles,
        };
      }
      if (column.additionalCustomization) {
        return {
          id: column?.id,
          name: t(column?.label) || t("ES_COMMON_NA"),
          format: column?.format,
          grow: column?.grow,
          width: column?.width,
          minWidth: column?.minWidth,
          maxWidth: column?.maxWidth,
          right: column?.right,
          center: column?.center,
          ignoreRowClick: column?.ignoreRowClick,
          wrap: column?.wrap,
          sortable: !column?.disableSortBy,
          sortFunction: typeof column?.sortFunction === "function" ? (rowA, rowB) => column?.sortFunction(rowA, rowB) : undefined,
          selector: (row, index) => {
            return configModule?.additionalCustomizations(
              row,
              column?.label,
              column,
              _.get(row, column?.jsonPath),
              t,
              searchResult
            );
          },
          headerAlign: column?.headerAlign,
          style: column?.style,
          conditionalCellStyles: column?.conditionalCellStyles,
        };
      }
      return {
        id: column?.id,
        name: t(column?.label) || t("ES_COMMON_NA"),
        format: column?.format,
        grow: column?.grow,
        width: column?.width,
        minWidth: column?.minWidth,
        maxWidth: column?.maxWidth,
        right: column?.right,
        center: column?.center,
        ignoreRowClick: column?.ignoreRowClick,
        wrap: column?.wrap,
        sortable: !column?.disableSortBy,
        sortFunction: typeof column?.sortFunction === "function" ? (rowA, rowB) => column?.sortFunction(rowA, rowB) : undefined,
        selector: (row, index) => _.get(row, column?.jsonPath),
        headerAlign: column?.headerAlign,
        style: column?.style,
        conditionalCellStyles: column?.conditionalCellStyles,
      };
    });
  }, [config, searchResult]);

  const defaultValuesFromSession = config?.customDefaultPagination
    ? config?.customDefaultPagination
    : session?.tableForm
    ? { ...session?.tableForm }
    : { limit: 10, offset: 0 };

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    trigger,
    control,
    formState,
    errors,
    setError,
    clearErrors,
    unregister,
  } = useForm({
    defaultValues: defaultValuesFromSession,
  });

  //call this fn whenever session gets updated
  const setDefaultValues = () => {
    reset(defaultValuesFromSession);
  };

  //adding this effect because simply setting session to default values is not working
  useEffect(() => {
    setDefaultValues();
  }, [session]);

  const [searchQuery, onSearch] = useState("");
  const debouncedValue = config?.debouncedValue || 1000;
  const debouncedSearchQuery = useDebounce(searchQuery,debouncedValue);

  const filterValue = useCallback((rows, id, filterValue = "") => {
    return rows.filter((row) => {
      if (!row) return false; // Ensure row exists

      return Object.keys(row).some((key) => {
        let value = row[key];

        // If the value is an object (like `data`), iterate inside it
        if (typeof value === "object" && value !== null) {
          return Object.keys(value).some((nestedKey) => {
            let nestedValue = value[nestedKey];

            if (typeof nestedValue === "string") {
              return nestedValue
                .toLowerCase()
                .includes(filterValue.toLowerCase());
            } else if (typeof nestedValue === "number") {
              return String(nestedValue).includes(filterValue);
            }
            return false;
          });
        }

        // If the value is a string or number at the root level
        if (typeof value === "string") {
          return value.toLowerCase().includes(filterValue.toLowerCase());
        } else if (typeof value === "number") {
          return String(value).includes(filterValue);
        }

        return false;
      });
    });
  }, []);

  const filteredData = useMemo(() => {
    if (!debouncedSearchQuery) return searchResult; // If no query, return all rows
    return filterValue(searchResult, null, debouncedSearchQuery);
  }, [debouncedSearchQuery, searchResult, filterValue]);

  useEffect(() => {
    register(
      "offset",
      session?.tableForm?.offset ||
        state.tableForm.offset ||
        config?.customDefaultPagination?.offset ||
        0
    );
    register(
      "limit",
      session?.tableForm?.limit ||
        state.tableForm.limit ||
        config?.customDefaultPagination?.limit ||
        10
    );
  });

  const onSubmit = (data) => {
    //here update the reducer state
    //call a dispatch to update table's part of the state and update offset, limit
    // this will in turn make the api call and give search results and table will be rendered acc to the new data
    dispatch({
      type: "tableForm",
      state: { ...data },
    });
  };

  const selectProps = {
    hideLabel: true,
    mainClassName: "digit-data-table-select-checkbox",
  };

  const conditionalRowStyles = [
    {
      when: (row) =>
        selectedRows.some(
          (selectedRow) => JSON.stringify(selectedRow) === JSON.stringify(row)
        ),
      style: {
        backgroundColor: "#FBEEE8",
      },
      classNames: ["selectedRow"],
    },
  ];
  const handleRowSelect = (event) => {
    setSelectedRows(event?.selectedRows);
    const rowClickHandler = configModule?.selectionHandler || {};
    if (typeof rowClickHandler === "function") {
      rowClickHandler(event);
    } else {
      console.error("actionSelectHandler is not defined or is not a function");
    }
  };

  const handleActionSelect = (index, label, selectedRows) => {
    const actionHandler = configModule?.actionSelectHandler || {};
    if (typeof actionHandler === "function") {
      actionHandler(index, label, selectedRows);
    } else {
      console.error("actionSelectHandler is not defined or is not a function");
    }
  };

  const handlePageChange = (page, totalRows) => {
    setCurrentPage(page);
    const updatedOffset = (page - 1) * rowsPerPage;
    setLimitAndOffset({ ...limitAndOffset, offset: updatedOffset });
    setValue("offset", updatedOffset);
    handleSubmit(onSubmit)();
  };

  const handlePerRowsChange = (currentRowsPerPage, currentPage) => {
    setRowsPerPage(currentRowsPerPage);
    setCurrentPage(1);
    const newLimit = currentRowsPerPage;
    const newOffset = (currentPage - 1) * currentRowsPerPage;
    setLimitAndOffset({
      limit: newLimit,
      offset: newOffset,
    });
    setValue("limit", newLimit);
    setValue("offset", newOffset);
    handleSubmit(onSubmit)();
  };
  useEffect(() => {
    if (limitAndOffset) {
      setValue("limit", limitAndOffset.limit);
      setValue("offset", limitAndOffset.offset);
    }
  }, [limitAndOffset]);

  const renderTable = () => {
    return (
      <DataTable
        data={filteredData || []}
        columns={tableColumns}
        responsive={true}
        sortIcon={
          <CustomSVG.SortUp width={"16px"} height={"16px"} fill={"#0b4b66"} />
        }
        selectableRows={config?.showCheckBox}
        selectableRowsHighlight={true}
        selectableRowsComponent={CheckBox}
        selectableRowsComponentProps={selectProps}
        onSelectedRowsChange={handleRowSelect}
        onRowClicked={additionalConfig?.resultsTable?.onRowClicked}
        selectableRowsNoSelectAll={config?.selectableRowsNoSelectAll}
        expandableRows={config?.expandableRows}
        expandableRowsComponent={config?.expandableRowsComponent}
        expandableIcon={{
          expanded: (
            <SVG.ArrowBackIos
              fill={"#363636"}
              width={"16px"}
              height={"16px"}
              style={{ transform: "rotate(-90deg)" }}
            ></SVG.ArrowBackIos>
          ),
          collapsed: (
            <SVG.ArrowBackIos
              fill={"#363636"}
              width={"16px"}
              height={"16px"}
              style={{ transform: "rotate(-180deg)" }}
            ></SVG.ArrowBackIos>
          ),
        }}
        onRowExpandToggled={(expanded, row) => config?.handleRowExpand?.(expanded, row)}
        progressPending={config?.progressPending}
        progressComponent={<Loader />}
        customStyles={dataTableCustomStyles}
        conditionalRowStyles={conditionalRowStyles}
        className={
          config?.tableClassName
            ? config?.tableClassName
            : `digit-data-table ${
                config?.showCheckBox ? "selectable" : "unselectable"
              }`
        }
        defaultSortAsc={config?.defaultSortAsc}
        pagination={config.isPaginationRequired !== undefined ? config.isPaginationRequired : true}
        paginationServer
        paginationTotalRows={
          data?.[TotalCount] ||
          data?.count ||
          data?.TotalCount ||
          data?.totalCount ||
          searchResult?.length
        }
        onChangeRowsPerPage={handlePerRowsChange}
        paginationDefaultPage={currentPage}
        paginationPerPage={rowsPerPage}
        onChangePage={handlePageChange}
        paginationRowsPerPageOptions={
          [10, 20, 50, 100] || config?.paginationRowsPerPageOptions
        }
        noContextMenu
        fixedHeader={true}
        fixedHeaderScrollHeight={"100vh"}
      />
    );
  };

  if (isLoading || isFetching) return <Loader />;
  if (!data) return <></>;
  if (!showResultsTable) return <></>;
  if (searchResult?.length === 0) return <NoResultsFound />;
  return (
    <Card className={"digit-table-card"}>
      {(config?.showTableDescription ||
        config?.showTableTitle ||
        config?.addFilter ||
        config?.enableGlobalSearch) && (
        <div className="table-header-wrapper">
          <div className="header-filter-wrapper">
            {config?.showTableTitle && (
              <div className="table-header">{t(config?.showTableTitle)}</div>
            )}
            {config?.addFilter && (
              <CustomSVG.FilterSvg
                fill={"#363636"}
                width={"2rem"}
                height={"2rem"}
                className={"table-filter-svg"}
                onClick={configModule?.onFilter}
              />
            )}
          </div>
          {config?.showTableDescription && (
            <div className="table-description">
              {t(config?.showTableDescription)}
            </div>
          )}
          <div className="digit-global-serach-results-table-wrapper">
            {config?.enableGlobalSearch && (
              <CardLabel className="digit-global-serach-results-table-header">
                {t(config.serachHeader) || t("Filter Table Records")}
              </CardLabel>
            )}
            {config?.enableGlobalSearch && (
              <div className="digit-global-serach-results-table">
                <TextInput
                  type="search"
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder={t("Search")}
                ></TextInput>
              </div>
            )}
          </div>
        </div>
      )}
      {config?.showSelectedState && selectedRows.length > 0 && (
        <div className="selection-state-wrapper">
          <div className="svg-state-wrapper">
            <SVG.DoneAll
              width={"1.5rem"}
              height={"1.5rem"}
              fill={"#C84C0E"}
            ></SVG.DoneAll>
            <div className={"selected-state"}>{`${selectedRows.length} ${t(
              "ROWS_SELECTED"
            )}`}</div>
          </div>
          {config?.actions?.length > 0 ? (
            <div className="digit-dataTable-actions-container">
              {config.actions.map((action, index) => (
                <Button
                  key={index}
                  variation={action?.variation || "primary"}
                  label={action?.label || `Action ${index + 1}`}
                  type={action?.type || "button"}
                  size={action?.size || "medium"}
                  icon={action?.icon}
                  onClick={() =>
                    handleActionSelect(index, action.label, selectedRows)
                  }
                  {...action}
                />
              ))}
            </div>
          ) : null}
        </div>
      )}
      {renderTable()}
    </Card>
  );
};

export default ResultsDataTable;
