import { PopUp } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { Button, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import XLSX from "xlsx";
import DataTable from "react-data-table-component";
import axios from "axios";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const PRIMARY_COLOR = "#C84C0E";

const DocViewerWithRenderers = (props) => <DocViewer {...props} pluginRenderers={DocViewerRenderers} />;

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
// approach as ReportDetailPage.js's own report preview.
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

// The original file-rendering view - embeds the xlsx as-is via the doc viewer, preserving
// its native look (formatting, merged cells) instead of extracting rows into a plain table.
const FileView = ({ file }) => {
  const documents = file?.url
    ? [
        {
          fileType: "xlsx",
          fileName: file?.filename,
          uri: file?.url,
        },
      ]
    : null;

  return (
    <React.Fragment>
      <style>{`#react-doc-viewer #proxy-renderer { display: flex; flex: 1; overflow-y: auto; } #react-doc-viewer #msdoc-renderer { width: 100%; height: 100%; }`}</style>
      <DocViewerWithRenderers
        style={{ height: "80vh", overflowY: "hidden" }}
        theme={{
          primary: PRIMARY_COLOR,
          secondary: "#feefe7",
          tertiary: "#feefe7",
          textPrimary: "#FFFFFF",
          textSecondary: "#505A5F",
          textTertiary: "#00000099",
          disableThemeScrollbar: true,
        }}
        documents={documents}
      />
    </React.Fragment>
  );
};

// mode: "paginated" -> the original file-rendering (DocViewer) view; "table" -> the new
// row/column DataTable view. Button labels intentionally follow the caller's naming: the
// "Paginated Preview" button shows the pre-existing DocViewer logic, "File View" shows the
// DataTable-based one added afterwards.
function ReportXlsPreview({ file, mode: initialMode = "paginated", ...props }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState(initialMode);

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
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button
            label={t("WBH_PAGINATED_PREVIEW")}
            title={t("WBH_PAGINATED_PREVIEW")}
            onClick={() => setMode("paginated")}
            variation={mode === "paginated" ? "primary" : "secondary"}
          />
          <Button
            label={t("WBH_FILE_VIEW")}
            title={t("WBH_FILE_VIEW")}
            onClick={() => setMode("table")}
            variation={mode === "table" ? "primary" : "secondary"}
          />
        </div>
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
        {mode === "table" ? <PaginatedPreview file={file} /> : <FileView file={file} />}
      </div>
    </PopUp>
  );
}

export default ReportXlsPreview;
