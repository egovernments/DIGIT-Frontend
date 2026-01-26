import React from "react";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { Card, Loader } from "../atoms";
import { CustomSVG } from "../atoms";
import DataTable from "react-data-table-component";
import CheckBox from "../atoms/CheckBox";
import { dataTableCustomStyles } from "../constants/styles/dataTableCustomStyles";
import { SVG } from "../atoms";
import CardLabel from "../atoms/CardLabel";
import Button from "../atoms/Button";
import TextInput from "../atoms/TextInput";

const ResultsDataTable = ({
  data,
  columns,
  showCheckBox,
  selectProps,
  onSelectedRowsChange,
  onRowClicked,
  selectableRowsNoSelectAll,
  expandableRows,
  expandableRowsComponent,
  progressPending,
  progressComponent,
  conditionalRowStyles,
  paginationRowsPerPageOptions,
  onChangePage,
  paginationPerPage,
  paginationDefaultPage,
  onChangeRowsPerPage,
  paginationTotalRows,
  isPaginationRequired,
  defaultSortAsc,
  tableClassName,
  onRowExpandToggled,
  showTableDescription,
  showTableTitle,
  enableGlobalSearch,
  showSelectedState,
  selectedRows,
  actions,
  searchHeader,
  onSearch,
  handleActionSelect,
  showSelectedStatePosition = "top",
  rowsPerPageText,
  paginationComponentOptions
}) => {
  const { t } = useTranslation();
  const renderTable = () => {
    return (
      <DataTable
        data={data}
        columns={columns}
        responsive={true}
        sortIcon={
          <CustomSVG.SortUp width={"16px"} height={"16px"} fill={"#0b4b66"} />
        }
        selectableRows={showCheckBox}
        selectableRowsHighlight={true}
        selectableRowsComponent={CheckBox}
        selectableRowsComponentProps={selectProps}
        onSelectedRowsChange={onSelectedRowsChange}
        onRowClicked={onRowClicked}
        selectableRowsNoSelectAll={selectableRowsNoSelectAll}
        expandableRows={expandableRows}
        expandableRowsComponent={expandableRowsComponent}
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
        onRowExpandToggled={onRowExpandToggled}
        progressPending={progressPending}
        progressComponent={progressComponent || <Loader />}
        customStyles={dataTableCustomStyles}
        conditionalRowStyles={conditionalRowStyles}
        className={
          tableClassName
            ? `digit-data-table ${showCheckBox ? "selectable" : "unselectable"} ${tableClassName}`
            : `digit-data-table ${showCheckBox ? "selectable" : "unselectable"}`
        }
        defaultSortAsc={defaultSortAsc}
        pagination={
          isPaginationRequired !== undefined ? isPaginationRequired : true
        }
        paginationServer
        paginationTotalRows={paginationTotalRows}
        onChangeRowsPerPage={onChangeRowsPerPage}
        paginationDefaultPage={paginationDefaultPage}
        paginationPerPage={paginationPerPage}
        onChangePage={onChangePage}
        paginationRowsPerPageOptions={
          paginationRowsPerPageOptions || [10, 20, 30, 40, 50]
        }
        noContextMenu
        fixedHeader={true}
        fixedHeaderScrollHeight={"100vh"}
        paginationComponentOptions={{
          ...paginationComponentOptions,
          rowsPerPageText: rowsPerPageText || t("ROWS_PER_PAGE"),
        }}
      />
    );
  };

  const renderSelectedState = () => {
    if (showSelectedState && selectedRows.length > 0) {
      return (
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
          {actions?.length > 0 ? (
            <div className="digit-dataTable-actions-container">
              {actions.map((action, index) => (
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
      );
    } else {
      return null;
    }
  };

  return (
    <Card className={"digit-table-card"}>
      {(showTableDescription || showTableTitle || enableGlobalSearch) && (
        <div className="table-header-wrapper">
          <div className="header-filter-wrapper">
            {showTableTitle && (
              <div className="table-header">{t(showTableTitle)}</div>
            )}
          </div>
          {showTableDescription && (
            <div className="table-description">{t(showTableDescription)}</div>
          )}
          <div className="digit-global-search-results-table-wrapper">
            {enableGlobalSearch && (
              <CardLabel className="digit-global-search-results-table-header">
                {t(searchHeader) || t("Filter Table Records")}
              </CardLabel>
            )}
            {enableGlobalSearch && (
              <div className="digit-global-search-results-table">
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
      {showSelectedStatePosition === "top" && renderSelectedState()}
      {renderTable()}
      {showSelectedStatePosition === "bottom" && renderSelectedState()}
    </Card>
  );
};

export default ResultsDataTable;
