import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
import { Loader, Button } from "@egovernments/digit-ui-components";
import DataTable from "react-data-table-component";
import { tableCustomStyle } from "../tableCustomStyle";
import XLSX from "xlsx";
import { SVG } from "@egovernments/digit-ui-components";

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
  enableExcelDownload = true,
  excelFileName = "table_data",
  excelButtonText = "Download Excel",
  defaultSortField = null,
  defaultSortAsc = true,
}) => {
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(paginationPerPage);
  const [sortState, setSortState] = useState({
    columnKey: defaultSortField,
    direction: defaultSortAsc ? "asc" : "desc",
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  useEffect(() => {
    setPerPage(paginationPerPage);
  }, [paginationPerPage]);

  // Build column config lookup for sort metadata (sortKey, sortType)
  const columnMap = useMemo(() => {
    const map = {};
    columns.forEach((col) => {
      map[col.key] = col;
    });
    return map;
  }, [columns]);

  // Sort full dataset before pagination when manualPagination is active
  const sortedData = useMemo(() => {
    if (!manualPagination || !sortState.columnKey || !data?.length) return data;
    const colConfig = columnMap[sortState.columnKey];
    if (!colConfig) return data;
    const sortKey = colConfig.sortKey || colConfig.key;
    const sortType = colConfig.sortType || "string";
    const dir = sortState.direction === "asc" ? 1 : -1;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (sortType === "numeric") {
        return dir * ((Number(aVal) || 0) - (Number(bVal) || 0));
      }
      return dir * String(aVal || "").localeCompare(String(bVal || ""));
    });
  }, [data, sortState, manualPagination, columnMap]);

  const paginatedData = useMemo(() => {
    if (!manualPagination || !pagination) return data;
    const sourceData = sortedData || data;
    if (!sourceData) return data;
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return sourceData.slice(startIndex, endIndex);
  }, [data, sortedData, currentPage, perPage, manualPagination, pagination]);

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

  const handleSort = (column, sortDirection) => {
    if (manualPagination) {
      setSortState({ columnKey: column.id, direction: sortDirection });
      setCurrentPage(1);
    }
  };

  const handleExcelDownload = () => {
    if (!data || data.length === 0) return;
    try {
      const exportData = data.map((row) => {
        const exportRow = {};
        columns.forEach((column) => {
          let value;
          if (getNestedValue) {
            value = getNestedValue(row, column.key);
          } else {
            const keys = column.key.split(".");
            value = row;
            for (const key of keys) {
              value = value?.[key];
            }
          }
          if (typeof value === "boolean") value = value?.toString();
          exportRow[column.label || column.key] =
            value !== undefined && value !== null ? value?.toString() : "NA";
        });
        return exportRow;
      });
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `${excelFileName}_${timestamp}.xlsx`;
      XLSX.writeFile(wb, filename);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  const tableColumns = columns.map((column) => ({
    id: column.key,
    name: column.label,
    selector: (row) => {
      if (getNestedValue) {
        return getNestedValue(row, column.key);
      }
      const keys = column.key.split(".");
      let value = row;
      for (const key of keys) {
        value = value?.[key];
      }
      if (typeof value === "boolean") return value?.toString();
      return value !== undefined ? value?.toString() : "NA";
    },
    cell: (row) => {
      if (customCellRenderer && customCellRenderer[column.key]) {
        return customCellRenderer[column.key](row, column.key);
      }
      return row?.[column?.key];
    },
    sortable: column.sortable !== false,
    grow: column.grow,
    width: column.width,
  }));

  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  const defaultNoDataComponent = <h1>{t(noDataMessage)}</h1>;

  return (
    <div className={className}>
      {title && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Header className={headerClassName}>{t(title)}</Header>
        </div>
      )}
      {enableExcelDownload && data && data.length > 0 && (
        <Button
          type="button"
          variation="secondary"
          label={t(excelButtonText)}
          onClick={handleExcelDownload}
          style={{ fontSize: "14px", marginBottom: "8px" }}
        />
      )}
      {!data || data.length === 0 ? (
        defaultNoDataComponent
      ) : (
        <div className={`commodity-management-inbox-table-wrapper`}>
          <DataTable
            columns={tableColumns}
            data={manualPagination ? paginatedData : data}
            pagination={pagination}
            paginationServer={manualPagination || paginationServer}
            paginationTotalRows={
              manualPagination
                ? data?.length || 0
                : paginationTotalRows || data.length
            }
            paginationPerPage={perPage}
            paginationRowsPerPageOptions={paginationRowsPerPageOptions}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
            sortServer={manualPagination}
            onSort={handleSort}
            defaultSortFieldId={defaultSortField}
            defaultSortAsc={defaultSortAsc}
            customStyles={customStyles || tableCustomStyle}
            progressPending={isLoading}
            progressComponent={progressComponent || <Loader />}
            noDataComponent={noDataComponent || defaultNoDataComponent}
            className={`data-table commodity-management-inbox-table`}
            persistTableHead
            noHeader={false}
            fixedHeader={true}
            paginationComponentOptions={{
              rowsPerPageText: t("CS_COMMON_ROWS_PER_PAGE"),
            }}
            sortIcon={
              <SVG.ArrowUpward
                width={"16px"}
                height={"16px"}
                fill={"#0b4b66"}
              />
            }
            fixedHeaderScrollHeight={"100vh"}
          />
        </div>
      )}
    </div>
  );
};

export default ReusableTableWrapper;
