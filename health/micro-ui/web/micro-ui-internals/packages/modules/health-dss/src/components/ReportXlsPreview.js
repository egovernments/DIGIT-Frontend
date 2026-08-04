import { PopUp } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { Button, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import XLSX from "xlsx";
import DataTable from "react-data-table-component";
import axios from "axios";

// Two callers pass two different shapes of `file`: an upload preview has a filestoreId (fetch
// through our own backend, avoids depending on the storage host allowing direct cross-origin
// reads), while a preview built from an already-uploaded document only has a pre-resolved url -
// fall back to fetching that directly.
const fetchWorkbookArrayBuffer = async (file) => {
  const filestoreId = file?.filestoreId || file?.fileStoreId;
  if (filestoreId) {
    const response = await axios.get("/filestore/v1/files/id", {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "application/json",
        "auth-token": Digit.UserService.getUser()?.["access_token"],
      },
      params: {
        tenantId: Digit.ULBService.getCurrentTenantId(),
        fileStoreId: filestoreId,
      },
    });
    return response.data;
  }
  if (file?.url) {
    const response = await axios.get(file.url, { responseType: "arraybuffer" });
    return response.data;
  }
  throw new Error("No file source available");
};

// The row/column table view - parses the sheet client-side and renders it paginated, same
// approach as ReportDetailPage.js's own report preview. No DocViewer/"file view" mode here:
// @cyntler/react-doc-viewer pulls in pdfjs-dist, which requires Node >=18 and breaks the
// dashboard-ui image's yarn install (pinned to node:14.21.3 in health-dss/Dockerfile).
const PaginatedPreview = ({ file }) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState({ isLoading: true, error: null, columns: [], rows: [] });

  useEffect(() => {
    let cancelled = false;
    const loadPreview = async () => {
      setPreview({ isLoading: true, error: null, columns: [], rows: [] });
      try {
        const arrayBuffer = await fetchWorkbookArrayBuffer(file);
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);
        const columns = Object.keys(rows[0] || {}).map((key) => ({
          name: key,
          selector: (row) => row[key],
          sortable: true,
          wrap: true,
        }));
        if (!cancelled) setPreview({ isLoading: false, error: null, columns, rows });
      } catch (error) {
        console.error("Error generating xls preview:", error);
        if (!cancelled) setPreview({ isLoading: false, error: t("HCM_FILE_UNAVAILABLE"), columns: [], rows: [] });
      }
    };
    loadPreview();
    return () => {
      cancelled = true;
    };
  }, [file?.filestoreId, file?.fileStoreId, file?.url, t]);

  if (preview.isLoading) return <Loader />;
  if (preview.error) return <div style={{ padding: "1.5rem" }}>{preview.error}</div>;
  return (
    <DataTable
      columns={preview.columns}
      data={preview.rows}
      pagination
      paginationPerPage={10}
      paginationRowsPerPageOptions={[10, 20, 50, 100]}
      fixedHeader
      fixedHeaderScrollHeight="60vh"
      persistTableHead
      noDataComponent={<div style={{ padding: "1.5rem" }}>{t("NO_RESULTS_FOUND")}</div>}
    />
  );
};

function ReportXlsPreview({ file, ...props }) {
  const { t } = useTranslation();

  return (
    <PopUp className="campaign-data-preview" style={{ flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginLeft: "2.5rem", marginRight: "2.5rem", marginTop: "2.5rem" }}>
        <Button
          label={t("BACK")}
          title={t("BACK")}
          onClick={() => props?.onBack()}
          variation="secondary"
          icon="ArrowBack"
          className={"back-button-xlsxpreview"}
        />
        <Button
          label={t("WBH_DOWNLOAD")}
          title={t("WBH_DOWNLOAD")}
          onClick={() => props?.onDownload()}
          variation="primary"
          isSuffix
          icon="FileDownload"
        />
      </div>
      <div className="campaign-popup-module" style={{ marginTop: "1.5rem", padding: "0 2.5rem 2rem" }}>
        <PaginatedPreview file={file} />
      </div>
    </PopUp>
  );
}

export default ReportXlsPreview;
