import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
import { Loader } from "@egovernments/digit-ui-components";
import DataTable from "react-data-table-component";
import { tableCustomStyle } from "./tableCustomStyle";

const ReusableTableWrapper = ({
  title,
  data,
  columns,
  isLoading = false,
  noDataMessage = "NO_DATA",
  getNestedValue = null,
  customCellRenderer = null,
  pagination = true,
  paginationServer = false,
  paginationTotalRows = 0,
  paginationPerPage = 10,
  paginationRowsPerPageOptions = [10, 20, 50, 100],
  onChangePage = null,
  onChangeRowsPerPage = null,
  progressComponent = null,
  noDataComponent = null,
  customStyles = null,
  className = "override-card",
  headerClassName = "works-header-view",
  manualPagination = false,
}) => {
  const { t } = useTranslation();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(paginationPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  useEffect(() => {
    setPerPage(paginationPerPage);
  }, [paginationPerPage]);

  const paginatedData = useMemo(() => {
    if (!manualPagination || !pagination || !data) {
      return data;
    }
    
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, perPage, manualPagination, pagination]);

  const handlePageChange = (page) => {
    if (manualPagination) {
      setCurrentPage(page);
    }
    if (onChangePage) {
      onChangePage(page);
    }
  };

  const handlePerRowsChange = (newPerPage, page) => {
    if (manualPagination) {
      setPerPage(newPerPage);
      setCurrentPage(page);
    }
    if (onChangeRowsPerPage) {
      onChangeRowsPerPage(newPerPage, page);
    }
  };

  // Convert columns to DataTable format
  const tableColumns = columns.map((column) => ({
    name: column.label,
    selector: (row) => {
      if (getNestedValue) {
        return getNestedValue(row, column.key);
      }
      
      // Default nested key access
      const keys = column.key.split('.');
      let value = row;
      for (const key of keys) {
        value = value?.[key];
      }
      
      // Handle boolean values
      if (typeof value === "boolean") {
        return value?.toString();
      }
      
      // Check if the value exists, otherwise return 'NA'
      return value !== undefined ? value?.toString() : "NA";
    },
    cell: (row) => {
      if (customCellRenderer && customCellRenderer[column.key]) {
        return customCellRenderer[column.key](row, column.key);
      }
      return row?.[column?.key]; // Use selector value if no custom cell renderer
    },
    sortable: column.sortable !== false,
    grow: column.grow,
    width: column.width,
  }));

  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  const defaultNoDataComponent = (
    <h1>{t(noDataMessage)}</h1>
  );

  return (
    <div className={className}>
      {title && <Header className={headerClassName}>{t(title)}</Header>}
      {(!data || data.length === 0) ? (
        defaultNoDataComponent
      ) : (
        <DataTable
          columns={tableColumns}
          data={manualPagination ? paginatedData : data}
          pagination={pagination}
          paginationServer={manualPagination || paginationServer}
          paginationTotalRows={manualPagination ? (data?.length || 0) : (paginationTotalRows || data.length)}
          paginationPerPage={perPage}
          paginationRowsPerPageOptions={paginationRowsPerPageOptions}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePerRowsChange}
          customStyles={customStyles || tableCustomStyle}
          progressPending={isLoading}
          progressComponent={progressComponent || <Loader />}
          noDataComponent={noDataComponent || defaultNoDataComponent}
        />
      )}
    </div>
  );
};

export default ReusableTableWrapper;
