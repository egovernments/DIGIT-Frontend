import React from "react";

const noop = () => {};


const Table = ({
  className = "table",
  t,
  data,
  columns,
  getCellProps,
  currentPage = 0,
  pageSizeLimit = 10,
  disableSort = true,
  autoSort = false,
  initSortId = "",
  onSearch = false,
  manualPagination = true,
  totalRecords,
  onNextPage,
  onPrevPage,
  globalSearch,
  onSort = noop,
  onPageSizeChange,
  onLastPage,
  onFirstPage,
  isPaginationRequired = true,
  sortParams = [],
  showAutoSerialNo = false,
  customTableWrapperClassName = "",
  styles = {},
  tableTopComponent,
  tableRef,
  isReportTable = false,
  showCheckBox = false,
  actionLabel = "CS_COMMON_DOWNLOAD",
  tableSelectionHandler = () => {},
}) => {
 

  //note -> adding data prop in dependency array to trigger filter whenever state of the table changes
  //use case -> without this if we enter string to search and then click on it's attendence checkbox or skill selector for that matter then the global filtering resets and whole table is shown
  return (
    <React.Fragment>
     to be aaded later
    </React.Fragment>
  );
};

export default Table;
