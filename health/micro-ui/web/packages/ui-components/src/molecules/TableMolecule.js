import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  Fragment,
} from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import TableMain from "../atoms/TableMain";
import TableHeader from "../atoms/TableHeader";
import TableFooter from "../atoms/TableFooter";
import TableBody from "../atoms/TableBody";
import TableCell from "../atoms/TableCell";
import TableRow from "../atoms/TableRow";
import CheckBox from "../atoms/CheckBox";
import Card from "../atoms/Card";
import { SVG } from "../atoms";
import { CustomSVG } from "../atoms";
import { StringManipulator } from "../atoms";
import Button from "../atoms/Button";
import NestedTable from "../atoms/NestedTable";

const TableMolecule = ({
  headerData,
  rows,
  pagination = {
    initialRowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 15, 20],
    manualPagination : false,
    onPageSizeChange : () => {},
    onNextPage : () => {},
    onPrevPage : () => {},
    currentPage : 1,
    totalCount:undefined
  },
  styles = {
    withBorder: false,
    withAlternateBg: false,
    withHeaderDivider: true,
    withColumnDivider: false,
    withRowDivider: true,
    extraStyles: {},
  },
  tableDetails = {
    tableTitle: "",
    tableDescription: "",
  },
  sorting = {
    isTableSortable: true,
    initialSortOrder: "ascending",
    customSortFunction:()=>{}
  },
  selection = {
    addCheckbox: false,
    checkboxLabel: "",
    initialSelectedRows: [],
    onSelectedRowsChange: () => {},
    showSelectedState: false,
  },
  footerProps = {
    scrollableStickyFooterContent: true,
    footerContent: null,
    hideFooter: false,
    stickyFooterContent: null,
    isStickyFooter: false,
    addStickyFooter: false,
  },
  className,
  wrapperClassName,
  onFilter,
  addFilter,
  onRowClick,
  frozenColumns = 0,
  isStickyHeader = false,
  actionButtonLabel,
  actions,
}) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);
  const [expandedRows, setExpandedRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(
    pagination?.initialRowsPerPage
  );
  const [selectedRows, setSelectedRows] = useState(
    selection?.initialSelectedRows
  );
  const frozenColumnsRefsForHeaders = useRef([]);
  const frozenColumnsRefsForRows = useRef({});
  const [selectedRowsDetails, setSelectedRowsDetails] = useState([]);
  const [sortOrder, setSortOrder] = useState(
    sorting?.initialSortOrder || "ascending"
  );
  const [sortedColumnIndex, setSortedColumnIndex] = useState(null);
  const [sortedRows, setSortedRows] = useState([]);
  const [tableData, setTableData] = useState([]);


  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  // Handling Select All Rows
  const allRowsSelected = selectedRows?.length === rows?.length;

  const onSelectAllRows = () => {
    if (allRowsSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(rows.map((_, index) => index));
    }
  };

  // Handling Select Individual Row
  const onSelectRow = (rowIndex) => {
    setSelectedRows((prevSelected) =>
      prevSelected?.includes(rowIndex)
        ? prevSelected?.filter((i) => i !== rowIndex)
        : [...prevSelected, rowIndex]
    );
  };

  //Handling PageChange
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handling change in rows per page
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event?.target?.value));
    setCurrentPage(1);
    // Reset to first page when changing rows per page
  };

  const toggleRowExpansion = (rowIndex) => {
    setExpandedRows((prev) =>
      prev.includes(rowIndex)
        ? prev.filter((index) => index !== rowIndex)
        : [...prev, rowIndex]
    );
  };

  const updateTableData = (rowIndex, columnIndex, value) => {
    setTableData((prevData) => {
      const updatedData = [...prevData];
      // Find the row by rowIndex
      let row = updatedData.find(row => row.rowIndex === rowIndex);
      if (!row) {
        // If row doesn't exist, create a new row with this rowIndex
        row = { rowIndex, values: {} };
        updatedData.push(row);
      }
      // Update the column value in the row
      row.values[columnIndex] = value;
      return updatedData;
    });
  };
  

  useEffect(() => {
    setSortedRows([...rows]);
  }, [rows]);

  useEffect(() => {
    if (!sortOrder) return;
    const sortRows = (columnIndex) => {
      const newSortedRows = [...rows];
      if (sortOrder === "custom") {
        setSortedRows(sorting?.customSortFunction(newSortedRows,columnIndex));
        return;
      }
      newSortedRows.sort((a, b) => {
        const columnA = a[columnIndex];
        const columnB = b[columnIndex];

        // Sorting based on data type
        if (typeof columnA === "number" && typeof columnB === "number") {
          return sortOrder === "ascending"
            ? columnA - columnB
            : columnB - columnA;
        } else if (typeof columnA === "object" && typeof columnB === "object") {
          return sortOrder === "ascending"
            ? columnA?.label?.localeCompare(columnB?.label)
            : columnB?.label?.localeCompare(columnA?.label);
        } else if (typeof columnA === "string" && typeof columnB === "string") {
          return sortOrder === "ascending"
            ? columnA.localeCompare(columnB)
            : columnB.localeCompare(columnA);
        }
        return 0; // Default case if types don't match
      });
      setSortedRows(newSortedRows);
    };

    if (sortedColumnIndex !== null) {
      sortRows(sortedColumnIndex);
    } else {
      const firstSortableColumnIndex = headerData?.findIndex((header) =>
        ["serialno", "numeric", "description", "text"].includes(header.type)
      );
      if (firstSortableColumnIndex !== -1) {
        sortRows(firstSortableColumnIndex);
      }
    }
  }, [sortedColumnIndex, sortOrder, rows, headerData,sorting]);

  const currentRows = sorting?.isTableSortable
    ? sortedRows?.slice(indexOfFirstRow, indexOfLastRow)
    : rows?.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(pagination?.totalCount || rows?.length / rowsPerPage);

  const handleSort = (index) => {
    if (sortedColumnIndex === index) {
      setSortOrder(sortOrder === "ascending" ? "descending" : "ascending");
    } else {
      setSortedColumnIndex(index);
      setSortOrder(sortOrder === "ascending" ? "descending" : "ascending");
    }
    setCurrentPage(1);
  };

  useLayoutEffect(() => {
    let leftOffset = 0;
    frozenColumnsRefsForHeaders.current.forEach((cell, index) => {
      if (cell) {
        requestAnimationFrame(() => {
          cell.style.left = `${leftOffset}px`;
          leftOffset += cell.offsetWidth;
        });
      }
    });

    Object.entries(frozenColumnsRefsForRows.current).forEach(
      ([rowIndex, cells]) => {
        let leftOffsetForBody = 0;
        cells.forEach((cell, index) => {
          if (cell) {
            requestAnimationFrame(() => {
              cell.style.left = `${leftOffsetForBody}px`;
              leftOffsetForBody += cell.offsetWidth;
            });
          }
        });
      }
    );
  }, [headerData, frozenColumns, rowsPerPage, currentPage, rows]);

  // Calling the callback whenever selectedRows changes
  useEffect(() => {
    const newselectedRowsDetails = selectedRows?.map((index) => rows[index]);
    setSelectedRowsDetails(newselectedRowsDetails);
  }, [selectedRows, rows]);

  // Separating the fixed and scrollable headers
  const fixedHeader = headerData?.slice(0, frozenColumns);
  const scrollableHeader = headerData?.slice(frozenColumns);

  const hasDescription = headerData?.some((header) => header.description);

  const renderTable = () => {
    return (
      <div className={`digit-table-footer-wrapper ${wrapperClassName || ""}`}>
        <div
          className={`digit-table-container ${
            styles?.withBorder ? "withBorder" : ""
          }`}
        >
          <TableMain
            className={className}
            style={styles?.extraStyles?.tableStyles}
          >
            {/* Dynamic Table Header */}
            <TableHeader
              className={`${isStickyHeader ? "sticky-header" : ""} ${
                hasDescription ? "hasDes" : ""
              }`}
              style={styles?.extraStyles?.headerStyles}
            >
              <TableRow>
                {selection?.addCheckbox && (
                  <TableCell
                    isHeader={true}
                    className={`fixed-columns ${
                      styles?.withBorder ? "withBorder" : ""
                    } ${
                      styles?.withColumnDivider && !styles?.withHeaderDivider
                        ? "withColumnDivider"
                        : ""
                    } ${styles?.withHeaderDivider ? "withHeaderDivider" : ""}`}
                    style={styles?.extraStyles?.headerStyles}
                  >
                    <CheckBox
                      checked={allRowsSelected}
                      onChange={onSelectAllRows}
                      label={selection?.checkboxLabel}
                      hideLabel={
                        selection?.checkboxLabel &&
                        selection?.checkboxLabel !== ""
                          ? false
                          : true
                      }
                      isIntermediate={
                        selectedRows &&
                        selectedRows?.length > 0 &&
                        selectedRows.length !== rows?.length
                      }
                      mainClassName={"table-checkbox"}
                    />
                  </TableCell>
                )}
                {fixedHeader?.map((header, index) => (
                  <TableCell
                    key={index}
                    isHeader={true}
                    className={`fixed-columns ${
                      styles?.withBorder ? "withBorder" : ""
                    } ${
                      styles?.withColumnDivider && !styles?.withHeaderDivider
                        ? "withColumnDivider"
                        : ""
                    } ${styles?.withHeaderDivider ? "withHeaderDivider" : ""}`}
                    cellref={(el) => {
                      frozenColumnsRefsForHeaders.current[index] = el;
                    }}
                    style={styles?.extraStyles?.headerStyles}
                  >
                    <div className="header-des-wrap">
                      <div className="column-header">
                        {StringManipulator(
                          "TOSENTENCECASE",
                          StringManipulator(
                            "TRUNCATESTRING",
                            t(header?.label),
                            {
                              maxLength: header?.maxLength || 64,
                            }
                          )
                        )}
                        {(header.type === "serialno" ||
                          header.type === "numeric" ||
                          header.type === "description" ||
                          header.type === "text") &&
                          sorting?.isTableSortable && (
                            <span
                              className="sort-icon"
                              onClick={() => handleSort(index)}
                            >
                              {sortedColumnIndex === index ? (
                                sortOrder === "ascending" ? (
                                  <CustomSVG.SortDown
                                    fill={"#363636"}
                                    width={"16px"}
                                    height={"16px"}
                                  />
                                ) : (
                                  <CustomSVG.SortUp
                                    fill={"#363636"}
                                    width={"16px"}
                                    height={"16px"}
                                  />
                                )
                              ) : sortOrder === "ascending" ? (
                                <CustomSVG.SortDown
                                  fill={"#363636"}
                                  width={"16px"}
                                  height={"16px"}
                                />
                              ) : (
                                <CustomSVG.SortUp
                                  fill={"#363636"}
                                  width={"16px"}
                                  height={"16px"}
                                />
                              )}
                            </span>
                          )}
                      </div>
                      {header.description && (
                        <div className="column-description">
                          {StringManipulator(
                            "TOSENTENCECASE",
                            StringManipulator(
                              "TRUNCATESTRING",
                              t(header?.description),
                              {
                                maxLength: header?.maxLength || 64,
                              }
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                ))}
                {scrollableHeader?.map((header, index) => (
                  <TableCell
                    key={index}
                    isHeader={true}
                    className={`scrollable-columns ${
                      styles?.withBorder ? "withBorder" : ""
                    } ${
                      styles?.withColumnDivider && !styles?.withHeaderDivider
                        ? "withColumnDivider"
                        : ""
                    } ${styles?.withHeaderDivider ? "withHeaderDivider" : ""}`}
                    style={styles?.extraStyles?.headerStyles}
                  >
                    <div className="header-des-wrap">
                      <div className="column-header">
                        {StringManipulator(
                          "TOSENTENCECASE",
                          StringManipulator(
                            "TRUNCATESTRING",
                            t(header?.label),
                            {
                              maxLength: header?.maxLength || 64,
                            }
                          )
                        )}
                        {(header.type === "serialno" ||
                          header.type === "numeric" ||
                          header.type === "description" ||
                          header.type === "text") &&
                          sorting?.isTableSortable && (
                            <span
                              className="sort-icon"
                              onClick={() => handleSort(index)}
                            >
                              {sortedColumnIndex === index ? (
                                sortOrder === "ascending" ? (
                                  <CustomSVG.SortDown
                                    fill={"#363636"}
                                    width={"16px"}
                                    height={"16px"}
                                  />
                                ) : (
                                  <CustomSVG.SortUp
                                    fill={"#363636"}
                                    width={"16px"}
                                    height={"16px"}
                                  />
                                )
                              ) : sortOrder === "ascending" ? (
                                <CustomSVG.SortDown
                                  fill={"#363636"}
                                  width={"16px"}
                                  height={"16px"}
                                />
                              ) : (
                                <CustomSVG.SortUp
                                  fill={"#363636"}
                                  width={"16px"}
                                  height={"16px"}
                                />
                              )}
                            </span>
                          )}
                      </div>
                      {header.description && (
                        <div className="column-description">
                          {StringManipulator(
                            "TOSENTENCECASE",
                            StringManipulator(
                              "TRUNCATESTRING",
                              t(header?.description),
                              {
                                maxLength: header?.maxLength || 64,
                              }
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            {/* Dynamic Table Body with Pagination */}
            <TableBody style={styles?.extraStyles?.bodyStyles}>
              {currentRows?.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <TableRow
                    key={rowIndex}
                    className={`${
                      styles?.withAlternateBg ? "withAlternateBg" : ""
                    } ${
                      onRowClick || row?.[headerData?.length]?.nestedData
                        ? "addHover"
                        : ""
                    } ${selectedRows?.includes(rowIndex) ? "selected" : ""}`}
                    onClick={() => {
                      if (row?.[headerData?.length]?.nestedData)
                        toggleRowExpansion(rowIndex);
                      if (onRowClick) onRowClick(row, rowIndex);
                    }}
                  >
                    {selection?.addCheckbox && (
                      <TableCell
                        isHeader={false}
                        className={`fixed-columns ${
                          styles?.withRowDivider &&
                          !expandedRows.includes(rowIndex)
                            ? "withRowDivider"
                            : ""
                        } ${
                          styles?.withColumnDivider ? "withColumnDivider" : ""
                        }`}
                        columnType={"custom"}
                        cellData={
                          <CheckBox
                            checked={selectedRows.includes(
                              rowIndex + indexOfFirstRow
                            )}
                            onChange={() =>
                              onSelectRow(rowIndex + indexOfFirstRow)
                            }
                            hideLabel={true}
                            mainClassName={"table-checkbox"}
                          />
                        }
                        style={styles?.extraStyles?.bodyStyles}
                      ></TableCell>
                    )}
                    {row?.slice(0, frozenColumns)?.map((cell, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        isHeader={false}
                        isFooter={false}
                        className={`fixed-columns  ${
                          styles?.withRowDivider &&
                          !expandedRows.includes(rowIndex)
                            ? "withRowDivider"
                            : ""
                        } ${
                          styles?.withColumnDivider ? "withColumnDivider" : ""
                        } ${onRowClick ? "addHover" : ""}`}
                        cellData={cell}
                        columnType={
                          headerData && headerData.length > 0
                            ? headerData[cellIndex]?.type
                            : "custom"
                        }
                        accessor={
                          headerData && headerData.length > 0
                            ? headerData[cellIndex]?.accessor
                            : null
                        }
                        cellref={(el) => {
                          if (!frozenColumnsRefsForRows.current[rowIndex]) {
                            frozenColumnsRefsForRows.current[rowIndex] = [];
                          }
                          frozenColumnsRefsForRows.current[rowIndex][
                            cellIndex
                          ] = el;
                        }}
                        style={styles?.extraStyles?.bodyStyles}
                        updateTableData={updateTableData}
                        tableData={tableData}
                        rowIndex={rowIndex}
                        cellIndex={cellIndex}
                      ></TableCell>
                    ))}
                    {row
                      ?.slice(frozenColumns, headerData.length)
                      ?.map((cell, cellIndex) => (
                        <TableCell
                          key={cellIndex + frozenColumns}
                          isHeader={false}
                          isFooter={false}
                          className={`scrollable-columns  ${
                            styles?.withRowDivider &&
                            !expandedRows.includes(rowIndex)
                              ? "withRowDivider"
                              : ""
                          } ${
                            styles?.withColumnDivider ? "withColumnDivider" : ""
                          }`}
                          cellData={cell}
                          columnType={
                            headerData[cellIndex + frozenColumns]?.type
                          }
                          accessor={
                            headerData && headerData.length > 0
                              ? headerData[cellIndex + frozenColumns]?.accessor
                              : null
                          }
                          updateTableData={updateTableData}
                          tableData={tableData}
                          rowIndex={rowIndex}
                          cellIndex={cellIndex}
                        ></TableCell>
                      ))}
                  </TableRow>
                  {expandedRows.includes(rowIndex) && (
                    <TableRow
                      className={`${
                        styles?.withAlternateBg ? "withAlternateBg" : ""
                      } ${onRowClick ? "addHover" : ""} ${
                        selectedRows?.includes(rowIndex) ? "selected" : ""
                      } nestedRow`}
                    >
                      <TableCell
                        className={`scrollable-columns  ${
                          styles?.withRowDivider ? "withRowDivider" : ""
                        } ${
                          styles?.withColumnDivider ? "withColumnDivider" : ""
                        }`}
                        colSpan={headerData?.length}
                        columnType={"custom"}
                        cellData={
                          <NestedTable
                            nestedData={row}
                            toggleRowExpansion={toggleRowExpansion}
                            rowIndex={rowIndex}
                          />
                        }
                      ></TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
            {/* Dynamic Table Footer with Pagination */}
          </TableMain>
        </div>
        {!footerProps?.hideFooter && (
          <TableFooter
            className={`digit-table-footer ${
              footerProps?.isStickyFooter ||
              (footerProps?.addStickyFooter && footerProps?.stickyFooterContent)
                ? "sticky-footer"
                : ""
            } `}
          >
            {footerProps?.addStickyFooter && footerProps?.stickyFooterContent && (
              <TableRow
                className={`sticky-footer-content ${
                  footerProps?.scrollableStickyFooterContent ? "scrollable" : ""
                }`}
              >
                <TableCell
                  isHeader={false}
                  isFooter={true}
                  className={`sticker-footer-td ${
                    styles?.withBorder ? "withBorder" : ""
                  }`}
                  style={styles?.extraStyles?.footerStyles}
                >
                  {footerProps?.stickyFooterContent}
                </TableCell>
              </TableRow>
            )}
            <TableRow className={"footer-pagination-content"}>
              <TableCell
                isHeader={false}
                isFooter={true}
                className={`${styles?.withBorder ? "withBorder" : ""}`}
                style={styles?.extraStyles?.footerStyles}
              >
                <div className="footer-content">
                  {footerProps?.footerContent}
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
                        onChange={pagination?.manualPagination ? pagination?.onPageSizeChange : handleRowsPerPageChange}
                      >
                        {pagination?.rowsPerPageOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span>
                        {indexOfFirstRow + 1}-
                        {Math.min(indexOfLastRow, pagination?.totalCount || rows?.length)} of{" "}
                        {pagination?.totalCount || rows?.length}
                      </span>
                    </div>
                    <div className="pagination">
                      <button
                        onClick={pagination?.manualPagination ? () => pagination?.onPrevPage() : () => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <SVG.ChevronLeft
                          fill={currentPage === 1 ? "#C5C5C5" : "#363636"}
                        ></SVG.ChevronLeft>
                      </button>
                      <button
                        onClick={pagination?.manualPagination ? () => pagination?.onNextPage() : () => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <SVG.ChevronRight
                          fill={
                            currentPage === totalPages ? "#C5C5C5" : "#363636"
                          }
                        ></SVG.ChevronRight>
                      </button>
                    </div>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </div>
    );
  };

  // Table Card
  return tableDetails?.tableTitle ||
    tableDetails?.tableDescription ||
    selection?.showSelectedState ||
    addFilter ? (
    <Card className={"digit-table-card"}>
      {(tableDetails?.tableDescription ||
        tableDetails?.tableTitle ||
        addFilter) && (
        <div className="table-header-wrapper">
          <div className="header-filter-wrapper">
            {tableDetails?.tableTitle && (
              <div className="table-header">{t(tableDetails?.tableTitle)}</div>
            )}
            {addFilter && (
              <CustomSVG.FilterSvg
                fill={"#363636"}
                width={"2rem"}
                height={"2rem"}
                className={"table-filter-svg"}
                onClick={onFilter}
              />
            )}
          </div>
          {tableDetails?.tableDescription && (
            <div className="table-description">
              {t(tableDetails?.tableDescription)}
            </div>
          )}
        </div>
      )}
      {selection?.showSelectedState && selectedRows.length > 0 && (
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
          {actions && actions.length > 0 ? (
            actions
          ) : (
            <Button
              variation="secondary"
              label={actionButtonLabel || t("TakeAction")}
              type="button"
              onClick={() =>
                selection?.onSelectedRowsChange(selectedRowsDetails)
              }
              size={"large"}
            />
          )}
        </div>
      )}
      {renderTable()}
    </Card>
  ) : (
    renderTable()
  );
};

TableMolecule.propTypes = {
  headerData: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  pagination: PropTypes.shape({
    initialRowsPerPage: PropTypes.number,
    rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
    manualPagination: PropTypes.bool,
    onPageSizeChange : PropTypes.func,
    onNextPage : PropTypes.func,
    onPrevPage : PropTypes.func ,
    totalCount: PropTypes.number,
  }),
  styles: PropTypes.shape({
    withBorder: PropTypes.bool,
    withAlternateBg: PropTypes.bool,
    withHeaderDivider: PropTypes.bool,
    withColumnDivider: PropTypes.bool,
    withRowDivider: PropTypes.bool,
    extraStyles: PropTypes.object,
  }),
  tableDetails: PropTypes.shape({
    tableTitle: PropTypes.string,
    tableDescription: PropTypes.string,
  }),
  sorting: PropTypes.shape({
    isTableSortable: PropTypes.bool,
    initialSortOrder: PropTypes.string,
  }),
  selection: PropTypes.shape({
    addCheckbox: PropTypes.bool,
    checkboxLabel: PropTypes.string,
    initialSelectedRows: PropTypes.array,
    onSelectedRowsChange: PropTypes.func,
    showSelectedState: PropTypes.bool,
  }),
  footerProps: PropTypes.shape({
    stickyFooterContent: PropTypes.node,
    footerContent: PropTypes.node,
    hideFooter: PropTypes.bool,
    scrollableStickyFooterContent: PropTypes.bool,
    isStickyFooter: PropTypes.bool,
    addStickyFooter: PropTypes.bool,
  }),
};

TableMolecule.defaultProps = {
  pagination: {
    initialRowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 15, 20],
    manualPagination:false,
    onPageSizeChange: () => {},
    onNextPage: () => {},
    onPrevPage: () => {},
    totalCount:undefined
  },
  styles: {
    withBorder: false,
    withAlternateBg: false,
    withHeaderDivider: true,
    withColumnDivider: false,
    withRowDivider: true,
    extraStyles: {},
  },
  tableDetails: {
    tableTitle: "",
    tableDescription: "",
  },
  sorting: {
    isTableSortable: true,
    initialSortOrder: "ascending",
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: "",
    initialSelectedRows: [],
    onSelectedRowsChange: () => {},
    showSelectedState: false,
  },
  footerProps: {
    footerContent: null,
    hideFooter: false,
    stickyFooterContent: null,
    scrollableStickyFooterContent: true,
    isStickyFooter: false,
    addStickyFooter: false,
  },
  actions: [],
};

export default TableMolecule;
