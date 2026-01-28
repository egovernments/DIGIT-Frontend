import React, {
  useMemo,
  useCallback,
  useState,
  useEffect,
  Fragment,
  useContext,
} from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import _ from "lodash";
import { InboxContext } from "./InboxSearchComposerContext";
import { Loader } from "../atoms";
import { CustomSVG } from "../atoms";
import CheckBox from "../atoms/CheckBox";
import NoResultsFound from "../atoms/NoResultsFound";
import Button from "../atoms/Button";
import ResultsDataTable from "../molecules/ResultsDataTable";
import { useNavigate } from "react-router-dom";
import { SVG } from "../atoms";
import { Toast } from "../atoms";
import FieldV1 from "./FieldV1";
import EditablePopup from "./EditablePopup";
import TableRow from "../atoms/TableRow";
import TableCell from "../atoms/TableCell";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

const ResultsDataTableWrapper = ({
  tabData,
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
  TotalCount,
  refetch,
  manualPagination,
  onNextPage,
  onPrevPage,
  onPageSizeChange,
  rowsPerPageOptions = [5, 10, 15, 20],
}) => {
  const { apiDetails } = fullConfig;
  const { t } = useTranslation();
  const navigate = useNavigate();
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

    const [showToast, setShowToast] = useState(null);
    // Use the custom mutation hook
      const mutation = Digit.Hooks.useCustomAPIMutationHook({
        url:apiDetails?.mutationUrl
      });
      const [editRow,setEditRow] = useState(null);
      const [editablePopup,setShowEditablePopup] = useState(null);
      //edited data should always hold updated payload
      const [rowData,setRowData] = useState(null);

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

  const handleActionClicked = (row, index, column, id) => {
    //current row should now be editable, maintain a state called editMode
    setEditRow(row);
    setRowData({row,index,column,id});
  }
  const handleActionClickedPopupEdit = (row, index, column, id) => {
    setEditRow(row);
    setShowEditablePopup(true)
    setRowData({row,index,column,id});
  }
  const handleRowSubmit = (rowFormData) => {
    setEditRow(null);
    setShowEditablePopup(false);
    // make an api call here
    // generate payload from a customizer
    mutation.mutate(
      configModule.getMutationPayload(rowFormData,rowData),
      {
        onSuccess: (data) => {
          setShowToast({ key: "success", label: t("DATA_MODIEFIED_SUCCESS")})
          setTimeout(() => {
            refetch()
          }, 1000);
          
        },
        onError: (error) => {
          setShowToast({type:"error", key: "error", label: t("DATA_MODIEFIED_FAIL")})
        }
      }
    );
    setEditRow(null);
    setRowData(null);
  };

  const handleLinkColumn = (event) => {
    const linkColumnHandler = configModule?.linkColumnHandler || {};
    if (typeof linkColumnHandler === "function") {
      linkColumnHandler(event);
    } else {
      console.error("linkColumnHandler is not defined or is not a function");
    }
  };

  const tableColumns = useMemo(() => {
    //test if accessor can take jsonPath value only and then check sort and global search work properly
    const mappedColumns = config?.columns?.map((column) => {
      const commonProps = {
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
        sortable: config?.enableColumnSort === false ? false : !column?.disableSortBy,
        headerAlign: column?.headerAlign,
        style: column?.style,
        conditionalCellStyles: column?.conditionalCellStyles,
        sortFunction:
          typeof column?.sortFunction === "function"
            ? (rowA, rowB) => column.sortFunction(rowA, rowB)
            : (rowA, rowB) => 0,
        selector: (row, index) => `${_.get(row, column?.jsonPath)}`,
      };
      if (column?.svg) {
        // const icon = Digit.ComponentRegistryService.getComponent(column.svg);
        return {
          ...commonProps,
          cell: ({ row, index, column, id }) => {
            return (
              <div
                className="cursorPointer"
                role="button"
                tabIndex={0}
                aria-label="Edit"
                style={{ marginLeft: "1rem" }}
                onClick={() => additionalConfig?.resultsTable?.onClickSvg(row)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    additionalConfig?.resultsTable?.onClickSvg(row);
                  }
                }}
              >
                <CustomSVG.EditIcon />
              </div>

            );
          },
        };
      }
      if (column.additionalCustomization) {
        return {
          ...commonProps,
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
        };
      }
      if (column?.link) {
        return {
          ...commonProps,
          cell: (row, index, col, id) => {
            return (
              <Button
                variation="link"
                label={
                  _.get(row, column?.jsonPath)
                    ? column.translate
                      ? t(_.get(row, column?.jsonPath))
                      : _.get(row, column?.jsonPath)
                    : t("ES_COMMON_NA")
                }
                type="button"
                icon={column?.buttonProps?.icon}
                size={column?.buttonProps?.size || "medium"}
                onClick={
                  column?.buttonProps?.linkTo
                    ? () => {
                        navigate(
                          `/${window?.contextPath}/employee/${column?.linkTo}`
                        );
                      }
                    : () => handleLinkColumn(row)
                }
              />
            );
          },
        };
      }
      return {...commonProps,cell: (row, index) =>  {
        // TODO: Here integrate with FieldV1 controller to support all field types
        // if(column.editable && editRow?.id === row?.id){
        //   return <TextInput
        //     // style={{ marginBottom: "0px" }}
        //     name={column.label}
        //     onChange={(e)=> handleEdits(e.target.value,column.jsonPath)}
        //     value={_.get(rowData,column.jsonPath)}
        //   />
        // }
        if(column.editable && editRow?.id === row?.id){
          const config = column.editableFieldConfig;
          return (
            <Controller
              defaultValue={column?.editableFieldConfig?.type === "text" || column?.editableFieldConfig?.type === "toggle" ? `${_.get(rowData?.row,column.jsonPath)}`:{[column.editableFieldConfig.populators.optionsKey]:`${_.get(rowData?.row,column.jsonPath)}`}}
              render={({ onChange, ref, value, onBlur }) => (
                <FieldV1
                  // error= {error}
                  label={config.label}
                  nonEditable = {config.nonEditable}
                  placeholder={config.placeholder}
                  // inline={props.inline}
                  description={config.description}
                  charCount = {config.charCount}
                  infoMessage={config.infoMessage}
                  withoutLabel = {config.withoutLabel}
                  variant={config.variant}
                  type={config.type}
                  populators={config.populators}
                  required={config.isMandatory}
                  disabled={config.disable}
                  component={config.component}
                  config={config}
                  // sectionFormCategory={sectionFormCategory}
                  formData={formData}
                  // selectedFormCategory={selectedFormCategory}
                  onChange={onChange}
                  ref={ref}
                  value={value}
                  props={{}}
                  errors={errors}
                  onBlur={onBlur}
                  controllerProps={{
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
                  }}
                />
              )}
              name={config.populators?.name}
              // rules={!disableFormValidation ? { required: isMandatory, ...populators?.validation, ...customRules } : {}}
              control={control}
            />
          )
        }

        return `${_.get(row, column?.jsonPath)}`
      },};
    });

    if(config?.editableRows || config?.editablePopup){
          mappedColumns.push({
            id: crypto.randomUUID(),
            name: "Action",
            // format: column?.format,
            // grow: column?.grow,
            // width: column?.width,
            // minWidth: column?.minWidth,
            // maxWidth: column?.maxWidth,
            // right: column?.right,
            // center: column?.center,
            // ignoreRowClick: column?.ignoreRowClick,
            // wrap: column?.wrap,
            // sortable: !column?.disableSortBy,
            // sortFunction: (rowA, rowB) => column?.sortFunction(rowA, rowB),
            // cell: (row, index) =>  _.get(row, column?.jsonPath),
            // headerAlign: column?.headerAlign,
            // style: column?.style,
            // conditionalCellStyles: column?.conditionalCellStyles,
            cell: ( row, index, column, id ) => {
                return (<Button
                variation="primary"
                label={row?.id === editRow?.id ? "Save" : "Edit Row"}
                type="button"
                icon="Edit"
                // onClick={()=>{editRow ? handleSaveRow(rowData) : handleActionClicked(row, index, column, id)}}
                onClick={()=>{config?.editableRows ? editRow ? handleSubmit(handleRowSubmit)() : handleActionClicked(row, index, column, id) : config?.editablePopup ? handleActionClickedPopupEdit(row, index, column, id) : null}}
                isDisabled={ configModule?.allowEdits(row) ? editRow && row?.id !== editRow?.id  ? true : false : true}
              />)
            }
          })
      }

      return mappedColumns;
  }, [config, searchResult,editRow,rowData]);

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

  const formData = watch();

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
  const debouncedSearchQuery = useDebounce(searchQuery, debouncedValue);

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
      console.error("selectionHandler is not defined or is not a function");
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

  const handleRowsPerPageChangeThroughEvent = (event) => {
    setRowsPerPage(Number(event?.target?.value));
    setCurrentPage(1);
    const newLimit = Number(event?.target?.value);
    const newOffset = (currentPage - 1) * Number(event?.target?.value);
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

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const totalPages = Math.ceil(
    data?.[TotalCount] || filteredData?.length / rowsPerPage
  );

  if (isLoading || isFetching) return <div className="digit-table-loader"><Loader/></div>;
  if (!data) return <></>;
  if (!showResultsTable) return <></>;
  if (searchResult?.length === 0) return <NoResultsFound />;
  // Extract the custom component
  const CustomRowComponent = Digit.ComponentRegistryService.getComponent(config?.customRow?.customRowComponent);
  if (
    config?.customRow?.overRideRowWithCustomRowComponent &&
    CustomRowComponent
  ) {
    return (
      <>
        <div className="digit-custom-row-wrapper">
          {filteredData.map((rowData, index) => (
            <CustomRowComponent key={index} rowData={rowData} tabData={tabData} {...config?.customRow?.customRowProps}/>
          ))}
        </div>
        <TableRow className={`footer-pagination-content ${"digit-results-table"}`}>
          <TableCell
            isHeader={false}
            isFooter={true}
          >
            <div className="footer-content">
              <div className={"footer-pagination-container"}>
                <div className="rows-per-page">
                  <label htmlFor="rowsPerPage">
                    {t("CS_COMMON_ROWS_PER_PAGE")}
                    {":"}{" "}
                  </label>
                  <select
                    className="pagination-dropdown"
                    id="rowsPerPage"
                    value={rowsPerPage}
                    onChange={
                      manualPagination ? onPageSizeChange : handleRowsPerPageChangeThroughEvent
                    }
                  >
                    {rowsPerPageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <span>
                    {indexOfFirstRow + 1}-
                    {Math.min(
                      indexOfLastRow,
                      data?.[TotalCount] || filteredData?.length
                    )}{" "}
                    of {data?.[TotalCount] || filteredData?.length}
                  </span>
                </div>
                <div className="pagination custom-results">
                  <button
                    onClick={
                      manualPagination
                        ? () => onPrevPage()
                        : () => handlePageChange(currentPage - 1)
                    }
                    disabled={currentPage === 1}
                  >
                    <SVG.ChevronLeft
                      fill={currentPage === 1 ? "#C5C5C5" : "#363636"}
                    ></SVG.ChevronLeft>
                  </button>
                  <button
                    onClick={
                      manualPagination
                        ? () => onNextPage()
                        : () => handlePageChange(currentPage + 1)
                    }
                    disabled={
                      currentPage === totalPages ||
                      indexOfLastRow >=
                        (data?.[TotalCount] || filteredData?.length)
                    }
                    // disabled={currentPage === totalPages}
                  >
                    <SVG.ChevronRight
                      fill={currentPage === totalPages ? "#C5C5C5" : "#363636"}
                    ></SVG.ChevronRight>
                  </button>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      </>
    );
  }
  return (
    <>
    <ResultsDataTable
      data={filteredData || []}
      columns={tableColumns}
      responsive={true}
      showCheckBox={config?.selectionProps?.showCheckBox}
      selectableRowsNoSelectAll={config?.selectProps?.selectableRowsNoSelectAll}
      showSelectedState={config?.selectionProps?.showSelectedState}
      showSelectedStatePosition={config?.selectProps?.showSelectedStatePosition}
      selectableRowsHighlight={true}
      selectableRowsComponent={CheckBox}
      selectProps={selectProps}
      onSelectedRowsChange={handleRowSelect}
      onRowClicked={additionalConfig?.resultsTable?.onRowClicked}
      expandableRows={config?.expandableProps?.expandableRows}
      expandableRowsComponent={config?.expandableProps?.expandableRowsComponent}
      onRowExpandToggled={(expanded, row) =>
        config?.handleRowExpand?.(expanded, row)
      }
      progressPending={config?.progressPending}
      conditionalRowStyles={conditionalRowStyles}
      tableClassName={config?.tableProps?.tableClassName ? config?.tableProps?.tableClassName : ""}
      defaultSortAsc={config?.defaultSortAsc}
      pagination={config.isPaginationRequired}
      paginationTotalRows={
        data?.[TotalCount] ||
        data?.count ||
        data?.totalCount ||
        searchResult?.length
      }
      onChangeRowsPerPage={handlePerRowsChange}
      paginationDefaultPage={currentPage}
      paginationPerPage={rowsPerPage}
      onChangePage={handlePageChange}
      paginationRowsPerPageOptions={config?.paginationRowsPerPageOptions}
      showTableDescription={config?.tableProps?.showTableDescription}
      showTableTitle={config?.tableProps?.showTableTitle}
      enableGlobalSearch={config?.enableGlobalSearch}
      enableColumnSort={config?.enableColumnSort}
      selectedRows={selectedRows}
      actions={config?.actionProps?.actions}
      searchHeader={config.searchHeader}
      configModule={configModule}
      onSearch={onSearch}
      handleActionSelect={handleActionSelect}
      rowsPerPageText={config?.paginationComponentOptions?.rowsPerPage}
      paginationComponentOptions={config?.paginationComponentOptions}
    ></ResultsDataTable>

      {showToast && (
        <Toast
          type={showToast?.type}
          label={t(showToast.label)}
          onClose={() => setShowToast(null)}
        />
      )}
      {editablePopup && (
        <EditablePopup
          setShowEditablePopup={setShowEditablePopup}
          config={config}
          editRow={editRow}
          setEditRow={setEditRow}
          setRowData={setRowData}
          rowData={rowData}
          handleRowSubmit={handleRowSubmit}
        />
      )}
    </>
  );
};

export default ResultsDataTableWrapper;
