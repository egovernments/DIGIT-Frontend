import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
import { Loader } from "@egovernments/digit-ui-components";
import DataTable from "react-data-table-component";
import { tableCustomStyle } from "./tableCustomStyle";
import XLSX from 'xlsx';

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
  // Excel download props
  enableExcelDownload = true,
  excelFileName = "table_data",
  excelButtonText = "Download Excel",
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

  // Excel export function
  const handleExcelDownload = () => {
    if (!data || data.length === 0) {
      console.warn('No data available to export');
      return;
    }

    try {
      // Prepare data for export by extracting values using the same logic as table columns
      const exportData = data.map((row) => {
        const exportRow = {};
        columns.forEach((column) => {
          let value;
          
          if (getNestedValue) {
            value = getNestedValue(row, column.key);
          } else {
            // Default nested key access
            const keys = column.key.split('.');
            value = row;
            for (const key of keys) {
              value = value?.[key];
            }
          }
          
          // Handle boolean values
          if (typeof value === "boolean") {
            value = value?.toString();
          }
          
          // Use column label as header and clean the value
          exportRow[column.label || column.key] = value !== undefined && value !== null ? value?.toString() : "NA";
        });
        return exportRow;
      });

      // Create worksheet and workbook
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${excelFileName}_${timestamp}.xlsx`;

      // Download the file
      XLSX.writeFile(wb, filename);
      
      console.log(`Excel file downloaded: ${filename}`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
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
      {title && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Header className={headerClassName}>{t(title)}</Header>
        </div>
      )}
           {enableExcelDownload && data && data.length > 0 && (
            <button
              onClick={handleExcelDownload}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {t(excelButtonText)}
            </button>
          )}
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
