import React, { useEffect, useMemo } from "react";
import { ResultsDataTable } from "@egovernments/digit-ui-components";

// Inject custom styles for table
const injectTableStyles = () => {
  const styleId = "table-template-override-style";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      .digit-data-table {
        width: 100% !important;
        display: block;
      }

      .digit-data-table table {
        width: 100% !important;
        table-layout: auto !important;
      }

      .digit-card-component.override-padding {
        padding: 0 !important;
      }

      .digit-card-component.override-padding .digit-table-card {
        padding: 0 !important;
      }
    `;
    document.head.appendChild(style);
  }
};

// Custom styles for the table
const dataTableCustomStyles = {
  headCells: {
    style: {
      fontWeight: "bold",
      fontSize: "14px",
      backgroundColor: "#f2f2f2",
      color: "#0b4b66",
      padding: "10px",
    },
  },
  rows: {
    style: {
      fontSize: "14px",
      padding: "10px",
      minHeight: "48px",
    },
  },
  cells: {
    style: {
      padding: "10px",
      whiteSpace: "nowrap",
    },
  },
};

const TableTemplate = ({ field, t, fieldTypeMasterData }) => {
  useEffect(() => {
    injectTableStyles();
  }, []);

  // Get columns from field.data.columns
  const columnsConfig = field?.data?.columns?.filter((column) => column?.isActive !== false ) || [];


  // Format columns for ResultsDataTable
  const formattedColumns = useMemo(() => {
    return columnsConfig.map((item, index) => ({
      name: t(item.header) || item.header, // Translated column header
      selector: (row) => row[`col_${index}`],
      sortable: false,
      minWidth: "150px",
    }));
  }, [columnsConfig, t]);

  // If no columns defined, show placeholder
  if (!columnsConfig.length) {
    return (
      <div style={{
        padding: "16px",
        border: "1px dashed #ccc",
        borderRadius: "4px",
        textAlign: "center",
        color: "#666",
        backgroundColor: "#f9f9f9"
      }}>
        <p>Table: No columns defined</p>
        <small>Add 'data.columns' array to define table columns</small>
      </div>
    );
  }

  // Preview data - one empty row
  const previewData = useMemo(() => {
    const emptyRow = {};
    columnsConfig.forEach((col, index) => {
      emptyRow[`col_${index}`] = ""; // Empty cell
    });
    return [emptyRow];
  }, [columnsConfig]);

  return (
    <div style={{ width: "100%" }}>
      {/* Preview Label */}
      <div style={{
        fontSize: "11px",
        color: "#666",
        marginBottom: "8px",
        fontStyle: "italic"
      }}>
        Table Preview (showing headers only)
      </div>

      {/* Table */}
      <div
        className="digit-card-component override-padding"
        style={{
          width: "100%",
          overflowX: "auto",
          border: "1px solid #e0e0e0",
          borderRadius: "4px"
        }}
      >
        <ResultsDataTable
          data={previewData}
          columns={formattedColumns}
          showCheckBox={false}
          onSelectedRowsChange={() => {}}
          progressPending={false}
          isPaginationRequired={false}
          showTableTitle={false}
          showTableDescription={false}
          enableGlobalSearch={false}
          selectableRowsNoSelectAll={true}
          customStyles={dataTableCustomStyles}
        />
      </div>
    </div>
  );
};

export default TableTemplate;