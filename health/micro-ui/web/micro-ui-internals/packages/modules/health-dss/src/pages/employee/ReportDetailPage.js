import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import {
  Card,
  HeaderComponent,
  Button,
  Tag,
  SVG,
  Tab,
  AlertCard,
  NoResultsFound,
  Loader,
  PopUp,
  TextInput,
  Toast,
  TooltipWrapper,
} from "@egovernments/digit-ui-components";
import axios from "axios";
import JSZip from "jszip";
import XLSX from "xlsx";
import DataTable from "react-data-table-component";
import { checkExistingCustomReport } from "../../utils/reportsApi";
import { getStageLabelKey, formatDuration, formatFileSize, formatRowCount, formatDateTime, formatDateTimeForFilename } from "../../utils/reportStatus";

// Shared by the download and preview paths - same request, same headers/params, only what
// happens with the resulting arraybuffer differs.
const fetchReportFileArrayBuffer = (fileStoreId) =>
  axios
    .get("/filestore/v1/files/id", {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "application/json",
        "auth-token": Digit.UserService.getUser()?.["access_token"],
      },
      params: {
        tenantId: Digit.ULBService.getCurrentTenantId(),
        fileStoreId: fileStoreId,
      },
    })
    .then((res) => res.data);

// Currently downloads as zip since backend returns zip files.
// TODO: Update to xlsx download once backend supports excel format.
const downloadFileFromStore = ({ fileStoreId, customName }) => {
  if (!fileStoreId) return;
  fetchReportFileArrayBuffer(fileStoreId).then((data) => {
    const blob = new Blob([data], { type: "application/zip" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = (customName || "report") + ".zip";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 7000);
  });
};

// Below this, unzipping+parsing+rendering the whole sheet client-side is fast enough not to
// need a loading spinner beyond the button's own disabled state. Compressed byte size alone
// under-predicts actual data volume (xlsx is itself a zip of XML parts, so decompressed data
// commonly runs 5-10x+ larger) - this is a cheap first gate, not a guarantee of a light sheet.
const PREVIEW_MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

// TODO: Once backend supports excel, switch to this:
// const downloadExcelFromStore = ({ fileStoreId, customName }) => {
//   if (!fileStoreId) return;
//   axios
//     .get("/filestore/v1/files/id", {
//       responseType: "arraybuffer",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         "auth-token": Digit.UserService.getUser()?.["access_token"],
//       },
//       params: {
//         tenantId: Digit.ULBService.getCurrentTenantId(),
//         fileStoreId: fileStoreId,
//       },
//     })
//     .then((res) => {
//       const blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = (customName || "report") + ".xlsx";
//       document.body.append(link);
//       link.click();
//       link.remove();
//       setTimeout(() => URL.revokeObjectURL(link.href), 7000);
//     });
// };

const formatCreatedTime = (createdtime) => {
  if (!createdtime) return "";
  const date = new Date(createdtime);
  if (isNaN(date.getTime())) return createdtime;
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateForPayload = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy} 00:00:00+0530`;
};

// reportrange: "2026-04-30 18:30:00+0000_2026-05-30 18:30:00+0000" (UTC) - parse the full
// datetime with timezone so it converts to the correct local date, not just the raw string.
const formatRangeDate = (dateStr) => {
  const trimmed = dateStr?.trim();
  if (!trimmed) return "";
  // "2026-04-30 18:30:00+0000" → "2026-04-30T18:30:00+00:00" for ISO parse
  const isoStr = trimmed.replace(" ", "T").replace(/([+-])(\d{2})(\d{2})$/, "$1$2:$3");
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return trimmed;
  return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
};

// Fixed tab display order - not object-key insertion order, which depends on whatever order
// rows happened to come back from the API.
const FREQUENCY_ORDER = ["DAILY", "WEEKLY", "MONTHLY", "CUSTOM"];

// Shared by completed reports and in-progress runs alike, so an in-progress card can show
// *which* range/day it's generating instead of just the pipeline stage with no other context.
const getReportDateLabel = (item, freq) => {
  if (freq === "CUSTOM" && item?.reportrange) {
    const parts = item.reportrange.split("_");
    if (parts.length === 2) {
      return `${formatRangeDate(parts[0])} — ${formatRangeDate(parts[1])}`;
    }
  }
  return formatCreatedTime(item?.createdtime);
};

const DEFAULT_PAGE_SIZE = 5;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

// Shared by the completed-reports list and the failed-reports list - both can grow
// unbounded over time, so neither should render as one ever-growing column. The rows-per-page
// select stays visible even at a single page so switching to a bigger page size (or back to a
// smaller one) never depends on there currently being more than one page to navigate.
const PaginationControls = ({ page, totalPages, onPageChange, pageSize, onPageSizeChange, totalItems, t }) => {
  if (!totalItems) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginTop: "1rem", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", position: "absolute", left: 0 }}>
        <label style={{ fontFamily: "Roboto, sans-serif", fontSize: "1rem", color: "#505A5F", whiteSpace: "nowrap" }}>
          {t("CS_COMMON_ROWS_PER_PAGE")}
        </label>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          style={{
            fontFamily: "Roboto, sans-serif",
            fontSize: "1rem",
            padding: "0.25rem 0.5rem",
            border: "0.063rem solid #D6D5D4",
            borderRadius: "0.25rem",
            background: "#FFFFFF",
            color: "#0B0C0C",
          }}
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      {totalPages > 1 && (
        <React.Fragment>
          <Button label={t("HCM_PREVIOUS")} onClick={() => onPageChange(page - 1)} isDisabled={page <= 1} variation="secondary" size="medium" />
          <span style={{ fontFamily: "Roboto, sans-serif", fontSize: "1rem", color: "#505A5F" }}>
            {t("HCM_PAGE")} {page} / {totalPages}
          </span>
          <Button label={t("HCM_NEXT")} onClick={() => onPageChange(page + 1)} isDisabled={page >= totalPages} variation="secondary" size="medium" />
        </React.Fragment>
      )}
    </div>
  );
};

// One in-progress dagRunId's current stage - no download action until it completes,
// at which point it disappears from here and shows up as a completed report instead.
const InProgressCard = ({ run, t }) => (
  <Card type="secondary" className="digit-report-detail__file-card">
    <div className="digit-report-detail__file-row">
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {run.dateLabel && <div className="digit-report-detail__file-date">{run.dateLabel}</div>}
          <Tag label={t(getStageLabelKey(run.status))} type="warning" stroke={true} />
        </div>
        <div style={{ height: 6, borderRadius: 3, background: "#e6e6e6", marginTop: 6, overflow: "hidden", maxWidth: 240 }}>
          <div
            style={{ height: "100%", borderRadius: 3, background: "#0B4B66", width: `${run.progressPercent || 0}%` }}
          />
        </div>
        {formatDuration(run.elapsedSeconds) && (
          <div style={{ fontFamily: "Roboto, sans-serif", fontSize: "1rem", color: "#505A5F" }}>
            {t("HCM_RUNNING_FOR")}: {formatDuration(run.elapsedSeconds)}
          </div>
        )}
        {(run.expectedRows || run.expectedGenerationTimeSeconds) && (
          <div style={{ fontFamily: "Roboto, sans-serif", fontSize: "1rem", color: "#505A5F" }}>
            {run.expectedRows && <span>{t("HCM_ESTIMATED_ROWS")}: ~{formatRowCount(run.expectedRows)}</span>}
            {run.expectedRows && run.expectedGenerationTimeSeconds && <span> &middot; </span>}
            {run.expectedGenerationTimeSeconds && (
              <span>{t("HCM_ESTIMATED_TIME")}: ~{formatDuration(run.expectedGenerationTimeSeconds)}</span>
            )}
          </div>
        )}
      </div>
    </div>
  </Card>
);

const FrequencyContent = ({ reports, inProgressRuns = [], t, reportType }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  // Reset to page 1 whenever the underlying list changes (e.g. a newly-completed report
  // shifts everything) or the page size changes, so pagination never gets stuck on a
  // now-out-of-range page.
  useEffect(() => {
    setPage(1);
  }, [reports, pageSize]);

  // null when closed; otherwise { report, isLoading, error, columnKeys, rows }
  const [preview, setPreview] = useState(null);
  // Per-column search text, keyed by column name - every non-empty entry ANDs together.
  const [columnFilters, setColumnFilters] = useState({});
  // Toggling this (any change, not the value itself) tells DataTable to jump back to page 1 -
  // otherwise refining a filter while on page 3 of the old result set leaves you on a
  // now-out-of-range or misleading page of the new, smaller result set.
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const handleDownload = (report) => {
    const nameParts = [reportType, report.dateLabel, report.reportStartedFilenameLabel].filter(Boolean);
    downloadFileFromStore({
      fileStoreId: report.filestoreid,
      customName: nameParts.join("_"),
    });
  };

  // Unzip -> grab the single .xlsx inside -> parse. Every step is client-side; the file-size
  // gate on the button keeps this fast enough not to need anything fancier than the button's
  // own disabled-while-loading state. All rows are handed to DataTable, which paginates
  // client-side and only mounts the current page's rows - no separate row cap needed.
  const handlePreviewClick = async (report) => {
    setColumnFilters({});
    setPreview({ report, isLoading: true, error: null, columnKeys: [], rows: [] });
    try {
      const arrayBuffer = await fetchReportFileArrayBuffer(report.filestoreid);
      const zip = await JSZip.loadAsync(arrayBuffer);
      const xlsxEntry = zip.file(/\.xlsx$/i)[0];
      if (!xlsxEntry) throw new Error("No .xlsx file found inside the report archive");
      const xlsxArrayBuffer = await xlsxEntry.async("arraybuffer");
      const workbook = XLSX.read(xlsxArrayBuffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);
      const columnKeys = Object.keys(rows[0] || {});
      setPreview({ report, isLoading: false, error: null, columnKeys, rows });
    } catch (error) {
      console.error("Error generating report preview:", error);
      setPreview((prev) => ({ ...prev, isLoading: false, error: error?.message || "Failed to load preview" }));
    }
  };

  // AND across every column that currently has filter text - a row must match all of them,
  // not just one.
  const filteredPreviewRows = useMemo(() => {
    const rows = preview?.rows || [];
    const activeFilters = Object.entries(columnFilters).filter(([, value]) => value);
    if (!activeFilters.length) return rows;
    return rows.filter((row) =>
      activeFilters.every(([key, value]) => {
        const cellValue = row[key];
        return String(cellValue === undefined || cellValue === null ? "" : cellValue)
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  }, [preview?.rows, columnFilters]);

  const previewColumns = useMemo(() => {
    return (preview?.columnKeys || []).map((key) => ({
      id: key,
      name: (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", width: "100%", padding: "0.25rem 0" }}>
          <div style={{ fontWeight: 700 }}>{key}</div>
          {/* Stops the click/mousedown from bubbling to DataTable's sort-column handler on
              the header cell, so typing a filter doesn't also toggle sort on every keystroke. */}
          <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
            <TextInput
              value={columnFilters[key] || ""}
              onChange={(e) => setColumnFilters((prev) => ({ ...prev, [key]: e.target.value }))}
              placeholder={t("HCM_SEARCH")}
            />
          </div>
        </div>
      ),
      selector: (row) => row[key],
      sortable: true,
      wrap: true,
    }));
  }, [preview?.columnKeys, columnFilters, t]);

  useEffect(() => {
    setResetPaginationToggle((prev) => !prev);
  }, [columnFilters]);

  if (!reports.length && !inProgressRuns.length) {
    return <NoResultsFound text={t("HCM_NO_REPORTS_GENERATED")} />;
  }

  const totalPages = Math.max(1, Math.ceil(reports.length / pageSize));
  const pageReports = reports.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="digit-report-detail__files-list">
      {inProgressRuns.map((run) => (
        <InProgressCard key={run.dagrunid || run.eventid} run={run} t={t} />
      ))}
      {pageReports.map((report) => (
        <Card key={report.id} type="secondary" className="digit-report-detail__file-card">
          <div className="digit-report-detail__file-row">
            <div>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <div className="digit-report-detail__file-date">{report.dateLabel}</div>
                <Tag label={t("HCM_REPORT_STATUS_COMPLETED")} type="success" stroke={true} />
                {report.hasMeta && (
                  <TooltipWrapper
                    placement="right"
                    header={t("HCM_REPORT_DETAILS")}
                    content={
                      <div>
                        {report.reportTimeLabel && <div>{t("HCM_REPORT_TIME")}: {report.reportTimeLabel}</div>}
                        {report.processingTimeLabel && <div>{t("HCM_PROCESSING_TIME")}: {report.processingTimeLabel}</div>}
                        {report.fileSizeLabel && <div>{t("HCM_FILE_SIZE")}: {report.fileSizeLabel}</div>}
                        {report.rowCountLabel && <div>{t("HCM_ROW_COUNT")}: {report.rowCountLabel}</div>}
                      </div>
                    }
                  >
                    <button
                      type="button"
                      aria-label={t("HCM_REPORT_DETAILS")}
                      style={{ display: "inline-flex", background: "none", border: "none", padding: 0, cursor: "pointer" }}
                    >
                      <SVG.Info width="16" height="16" fill="#505A5F" />
                    </button>
                  </TooltipWrapper>
                )}
              </div>
              {report.reportStartedLabel && (
                <div style={{ fontFamily: "Roboto, sans-serif", fontSize: "1rem", color: "#505A5F" }}>
                  {t("HCM_REPORT_GENERATED_AT")}: {report.reportStartedLabel}
                </div>
              )}
            </div>
            <div className="digit-report-detail__file-actions">
              {report.filesizebytes != null && report.filesizebytes < PREVIEW_MAX_FILE_SIZE_BYTES && (
                <Button
                  label={t("HCM_SHOW_PREVIEW")}
                  onClick={() => handlePreviewClick(report)}
                  variation="link"
                  icon="Visibility"
                  size="medium"
                  isDisabled={preview?.isLoading && preview?.report?.id === report.id}
                />
              )}
              <Button label={t("HCM_DOWNLOAD")} onClick={() => handleDownload(report)} variation="link" icon="FileDownload" size="medium" />
            </div>
          </div>
        </Card>
      ))}
      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        totalItems={reports.length}
        t={t}
      />

      {preview && (
        <PopUp
          onClose={() => setPreview(null)}
          onOverlayClick={() => setPreview(null)}
          heading={`${t("HCM_SHOW_PREVIEW")}: ${preview.report?.dateLabel || ""}`}
          style={{ width: "75vw", maxWidth: "75vw", maxHeight: "90vh" }}
          className="digit-report-detail__preview-popup"
          footerChildren={[
            <Button key="close" label={t("HCM_CLOSE")} onClick={() => setPreview(null)} variation="secondary" />,
            <Button
              key="download"
              label={t("HCM_DOWNLOAD")}
              onClick={() => handleDownload(preview.report)}
              variation="primary"
              icon="FileDownload"
            />,
          ]}
        >
          {preview.isLoading ? (
            <Loader />
          ) : preview.error ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>{preview.error}</div>
          ) : (
            <DataTable
              columns={previewColumns}
              data={filteredPreviewRows}
              pagination
              paginationPerPage={10}
              paginationResetDefaultPage={resetPaginationToggle}
              fixedHeader
              persistTableHead
              noDataComponent={<div style={{ padding: "24px" }}>{t("HCM_NO_REPORTS_GENERATED")}</div>}
            />
          )}
        </PopUp>
      )}
    </div>
  );
};

// Every failed attempt (any frequency), not just the transient one surfaced by the pre-flight
// "already exists" check popup - this is the only persistent view of failures on the page.
const FailedReportsContent = ({ failedReports, t }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  useEffect(() => {
    setPage(1);
  }, [failedReports, pageSize]);

  if (!failedReports.length) {
    return <NoResultsFound text={t("HCM_NO_FAILED_REPORTS")} />;
  }

  const totalPages = Math.max(1, Math.ceil(failedReports.length / pageSize));
  const pageItems = failedReports.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="digit-report-detail__files-list">
      {pageItems.map((item) => (
        <AlertCard
          key={item.dagrunid || item.eventid}
          label={getReportDateLabel(item, item.triggerfrequency) || t("HCM_REPORT_GENERATION_FAILED_TITLE")}
          text={item.errormessage || t("HCM_REPORT_GENERATION_FAILED_DESC")}
          variant="error"
        />
      ))}
      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        totalItems={failedReports.length}
        t={t}
      />
    </div>
  );
};

// reportType/campaignNumber/campaignName are optional props so this can be embedded as a tab
// panel (one per report type) by ReportsListPage.js - falls back to the URL query params so
// the standalone /report-detail route keeps working unchanged for any direct link.
const ReportDetailPage = ({ reportType: reportTypeProp, campaignNumber: campaignNumberProp, campaignName: campaignNameProp } = {}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = campaignNumberProp || searchParams.get("campaignNumber");
  const reportType = reportTypeProp || searchParams.get("reportType");
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const [isLoading, setIsLoading] = useState(true);
  const [reportsMetadata, setReportsMetadata] = useState(null);
  const [showCustomPopup, setShowCustomPopup] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [isTriggering, setIsTriggering] = useState(false);
  const [isCheckingExisting, setIsCheckingExisting] = useState(false);
  const [showToast, setShowToast] = useState(null);
  // Pre-flight result for the CUSTOM range just requested - { variant: "exists" |
  // "in_progress" | "failed", data }. Non-null blocks triggering until the user acts.
  const [existingReportPopup, setExistingReportPopup] = useState(null);
  // Live countdown (seconds) for the "exists" variant's retryAvailableInSeconds -
  // null when there's no active cooldown to show. Ticks client-side once a second;
  // the backend check is still the source of truth when the user actually retries.
  const [retryCountdown, setRetryCountdown] = useState(null);
  // Which inner section is selected - a frequency code (DAILY/WEEKLY/MONTHLY/CUSTOM) or
  // "FAILED". Uses the Tab component (underline style) - visually distinct from the
  // L2Main.js-style report-type tabs one level up on ReportsListPage.js.
  const [activeTab, setActiveTab] = useState(null);

  const { data: inProgressRuns = [], refetch: refetchInProgress } = Digit.Hooks.DSS.useReportsInProgress({
    tenantId,
    campaignIdentifier: campaignNumber,
    reportName: reportType,
    config: { enabled: !!campaignNumber && !!reportType },
  });

  const { data: failedReportsRaw = [], refetch: refetchFailed } = Digit.Hooks.DSS.useFailedReports({
    tenantId,
    campaignIdentifier: campaignNumber,
    reportName: reportType,
    config: { enabled: !!campaignNumber && !!reportType },
  });

  const triggerCustomReport = async () => {
    setIsTriggering(true);
    try {
      await Digit.CustomService.getResponse({
        url: `/airflow-trigger-api/api/dags/trigger`,
        body: {
          tenantId: tenantId,
          dag_id: "hcm_dynamic_campaigns",
          logical_date: new Date().toISOString(),
          conf: {
            matched_campaigns: [
              {
                campaignIdentifier: campaignNumber,
                identifierType: "campaignNumber",
                reportName: reportType,
                triggerFrequency: "CUSTOM",
                triggerTime: "00:45:00+0530",
                startDate: formatDateForPayload(customStartDate),
                endDate: formatDateForPayload(customEndDate),
                customReportStartTime: formatDateForPayload(customStartDate),
                customReportEndTime: formatDateForPayload(customEndDate),
                reportStartDate: formatDateForPayload(customStartDate),
                reportEndDate: formatDateForPayload(customEndDate),
                reportStartTime: "00:00:00+0530",
                reportEndTime: "23:59:59+0530",
                tenantId: tenantId,
              },
            ],
          },
        },
      });
      setShowCustomPopup(false);
      setExistingReportPopup(null);
      setCustomStartDate("");
      setCustomEndDate("");
      setShowToast({ key: "success", label: t("HCM_CUSTOM_REPORT_TRIGGERED") });
      refetchInProgress();
    } catch (error) {
      console.error("Error triggering custom report:", error);
      setShowToast({ key: "error", label: t("HCM_CUSTOM_REPORT_TRIGGER_FAILED") });
    } finally {
      setIsTriggering(false);
    }
  };

  // Pre-flight check before triggering: does a completed/in-progress/failed run
  // already exist for this exact campaign+report+date-range?
  const handleGenerateReportClick = async () => {
    if (!customStartDate || !customEndDate) {
      setShowToast({ key: "error", label: t("HCM_CUSTOM_DATE_REQUIRED") });
      return;
    }
    setIsCheckingExisting(true);
    try {
      const response = await checkExistingCustomReport({
        tenantId,
        campaignIdentifier: campaignNumber,
        reportName: reportType,
        customStartDate: formatDateForPayload(customStartDate),
        customEndDate: formatDateForPayload(customEndDate),
      });
      const existing = response?.exists ? response.data : null;

      if (!existing) {
        await triggerCustomReport();
        return;
      }

      setShowCustomPopup(false);
      if (existing.isFailed) {
        setExistingReportPopup({ variant: "failed", data: existing });
      } else if (existing.isTerminal) {
        setExistingReportPopup({ variant: "exists", data: existing });
      } else {
        setExistingReportPopup({ variant: "in_progress", data: existing });
      }
    } catch (error) {
      console.error("Error checking for existing custom report:", error);
      setShowToast({ key: "error", label: t("HCM_CUSTOM_REPORT_CHECK_FAILED") });
    } finally {
      setIsCheckingExisting(false);
    }
  };

  // (Re)starts a 1-second countdown whenever a fresh "exists" popup carries a
  // retryAvailableInSeconds, and tears it down on close/unmount so no stray
  // interval keeps ticking after the popup is gone.
  useEffect(() => {
    const seconds = existingReportPopup?.variant === "exists" ? existingReportPopup.data?.retryAvailableInSeconds : null;
    if (seconds == null) {
      setRetryCountdown(null);
      return;
    }
    setRetryCountdown(seconds);
    const intervalId = setInterval(() => {
      setRetryCountdown((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [existingReportPopup]);

  // Fetch report metadata from airflow API. showLoader is only true for the initial
  // mount fetch - the completion-triggered refresh below must not flash the
  // full-page Loader over content the user is already looking at.
  const fetchReports = useCallback(
    async ({ showLoader = false } = {}) => {
      if (!campaignNumber || !reportType) return;
      try {
        if (showLoader) setIsLoading(true);
        const response = await Digit.CustomService.getResponse({
          url: `/airflow-trigger-api/api/reports-metadata`,
          body: {
            tenantId: tenantId,
            reportName: reportType,
            campaignIdentifier: campaignNumber,
          },
          // This body never varies for a given report, so CustomService's default
          // useCache:true would otherwise replay the very first response forever -
          // exactly why a newly-completed report only ever showed up after a reload.
          useCache: false,
        });
        setReportsMetadata(response);
      } catch (error) {
        console.error("Error fetching reports metadata:", error);
        setReportsMetadata(null);
      } finally {
        if (showLoader) setIsLoading(false);
      }
    },
    [campaignNumber, reportType, tenantId]
  );

  useEffect(() => {
    fetchReports({ showLoader: true });
  }, [fetchReports]);

  // /reports-in-progress polls every 20s, but a run dropping out of that list (because
  // it just completed or failed) doesn't by itself update the completed-reports or
  // failed-reports lists - without this, a just-finished/just-failed report only appears
  // after a manual page reload.
  const prevInProgressIdsRef = useRef(new Set());
  useEffect(() => {
    const currentIds = new Set((inProgressRuns || []).map((run) => run.dagrunid));
    const hasNewlyFinished = [...prevInProgressIdsRef.current].some((id) => !currentIds.has(id));
    prevInProgressIdsRef.current = currentIds;
    if (hasNewlyFinished) {
      fetchReports();
      refetchFailed();
    }
  }, [inProgressRuns, fetchReports, refetchFailed]);
  // Group reports by triggerfrequency from actual API response
  const reportsByFrequency = useMemo(() => {
    const reports = reportsMetadata?.data || [];
    if (!reports.length) return {};

    const grouped = {};
    reports.forEach((item) => {
      const freq = item?.triggerfrequency || "DAILY";
      if (!grouped[freq]) grouped[freq] = [];

      const dateLabel = getReportDateLabel(item, freq);

      const reportStartedLabel = formatDateTime(item?.reporttriggeredtimems);
      // Filename-safe twin of reportStartedLabel, for handleDownload's customName below -
      // reportStartedLabel itself has colons (12-hour clock), which are illegal on Windows.
      const reportStartedFilenameLabel = formatDateTimeForFilename(item?.reporttriggeredtimems);
      const reportTimeLabel = formatDuration(item?.reportTimeSeconds);
      const processingTimeLabel = formatDuration(item?.processingTimeSeconds);
      const fileSizeLabel = formatFileSize(item?.filesizebytes);
      const rowCountLabel = formatRowCount(item?.rowcount);

      grouped[freq].push({
        id: item?.id,
        dateLabel: dateLabel,
        filestoreid: item?.filestoreid,
        // Raw byte count (not just the formatted label) so the card can gate the
        // "Show Preview" button against PREVIEW_MAX_FILE_SIZE_BYTES.
        filesizebytes: item?.filesizebytes,
        reportStartedLabel,
        reportStartedFilenameLabel,
        reportTimeLabel,
        processingTimeLabel,
        fileSizeLabel,
        rowCountLabel,
        // reportStartedLabel is shown directly on the card now, not in this tooltip - excluded
        // here so a report with only that field doesn't get an info icon over an empty popup.
        hasMeta: Boolean(reportTimeLabel || processingTimeLabel || fileSizeLabel || rowCountLabel),
      });
    });

    // Sort each frequency group by id descending (newest first)
    Object.keys(grouped).forEach((freq) => {
      grouped[freq].sort((a, b) => b.id - a.id);
    });

    return grouped;
  }, [reportsMetadata]);

  // Group in-progress runs by frequency too, so a frequency with nothing completed
  // yet still gets its own accordion section instead of being invisible.
  const inProgressByFrequency = useMemo(() => {
    const grouped = {};
    (inProgressRuns || []).forEach((run) => {
      const freq = run?.triggerfrequency || "DAILY";
      if (!grouped[freq]) grouped[freq] = [];
      grouped[freq].push({ ...run, dateLabel: getReportDateLabel(run, freq) });
    });
    Object.keys(grouped).forEach((freq) => {
      grouped[freq].sort((a, b) => (b.reporttriggeredtimems || 0) - (a.reporttriggeredtimems || 0));
    });
    return grouped;
  }, [inProgressRuns]);

  const allFrequencies = useMemo(
    () => Array.from(new Set([...Object.keys(reportsByFrequency), ...Object.keys(inProgressByFrequency)])),
    [reportsByFrequency, inProgressByFrequency]
  );

  // Newest-first, matching the ordering already used for completed reports/in-progress runs.
  const failedReports = useMemo(
    () => [...(failedReportsRaw || [])].sort((a, b) => (b.reporttriggeredtimems || 0) - (a.reporttriggeredtimems || 0)),
    [failedReportsRaw]
  );

  const reportLabel = `HCM_${reportType?.toUpperCase()}`;
  const totalReports = Object.values(reportsByFrequency).flat().length;
  const totalInProgress = inProgressRuns?.length || 0;
  const totalFailed = failedReports.length;

  // Tabs: frequencies in a fixed, predictable order (not object-key insertion order) plus a
  // trailing Failed tab - only shown when there's actually something failed, so it doesn't
  // steal the default-selected slot from the frequency tabs while data is still loading.
  const tabItems = useMemo(() => {
    const orderedFrequencies = [
      ...FREQUENCY_ORDER.filter((freq) => allFrequencies.includes(freq)),
      ...allFrequencies.filter((freq) => !FREQUENCY_ORDER.includes(freq)),
    ];
    const freqTabs = orderedFrequencies.map((freq) => {
      const count = (reportsByFrequency[freq] || []).length + (inProgressByFrequency[freq] || []).length;
      return { code: freq, name: `${t(`HCM_REPORT_FREQUENCY_${freq}`)} (${count})` };
    });
    return totalFailed > 0 ? [...freqTabs, { code: "FAILED", name: `${t("HCM_FAILED")} (${totalFailed})` }] : freqTabs;
  }, [allFrequencies, reportsByFrequency, inProgressByFrequency, totalFailed, t]);

  // Defaults to the first tab once real data has loaded (not during the initial render, when
  // reportsMetadata/inProgressRuns/failedReportsRaw are all still empty and tabItems would
  // otherwise be just the FAILED tab, locking that in as the default forever). Also re-defaults
  // if the current selection stops existing (e.g. the FAILED tab disappears once totalFailed
  // hits 0), but otherwise leaves an already-valid user selection alone.
  useEffect(() => {
    if (isLoading || tabItems.length === 0) return;
    const activeStillValid = activeTab && tabItems.some((tab) => tab.code === activeTab.code);
    if (!activeStillValid) {
      setActiveTab(tabItems[0]);
    }
  }, [tabItems, activeTab, isLoading]);

  if (isLoading) return <Loader />;

  return (
    <React.Fragment>
      <Card>
        <div className="digit-report-detail__header-wrap">
          <SVG.Description height="28" width="28" className="digit-report-detail__header-svg" />
          <div className="digit-report-detail__header">
            <div className="digit-report-detail__header-with-tag">
              <HeaderComponent className="digit-report-detail__header-with-tag-header">{t(reportLabel)}</HeaderComponent>
              <Tag label={t("HCM_CONTAINS_PII")} showIcon={true} type="error" stroke={true} />
            </div>
            <p className="digit-report-detail__subtitle">{t("HCM_REPORTS_GENERATED_BY_FREQUENCY")}</p>
          </div>
          <div className="digit-report-detail__custom-btn">
            <Button
              label={t("HCM_DOWNLOAD_CUSTOM_RANGE")}
              onClick={() => setShowCustomPopup(true)}
              variation="secondary"
              icon="CalendarToday"
              size="medium"
            />
          </div>
        </div>

        {totalReports === 0 && totalInProgress === 0 && totalFailed === 0 ? (
          <NoResultsFound text={t("HCM_NO_REPORTS_GENERATED")} />
        ) : (
          <React.Fragment>
            <Tab
              activeLink={activeTab?.code}
              configItemKey="code"
              configDisplayKey="name"
              configNavItems={tabItems}
              onTabClick={(e) => setActiveTab(e)}
              setActiveLink={setActiveTab}
              showNav={true}
              style={{ width: "100%" }}
            />
            <div style={{ marginTop: "1rem" }}>
              {activeTab?.code === "FAILED" ? (
                <FailedReportsContent key={activeTab.code} failedReports={failedReports} t={t} />
              ) : (
                <FrequencyContent
                  key={activeTab?.code}
                  reports={reportsByFrequency[activeTab?.code] || []}
                  inProgressRuns={inProgressByFrequency[activeTab?.code] || []}
                  t={t}
                  reportType={reportType}
                />
              )}
            </div>
          </React.Fragment>
        )}
      </Card>

      {showCustomPopup && (
        <PopUp
          onClose={() => setShowCustomPopup(false)}
          onOverlayClick={() => setShowCustomPopup(false)}
          heading={t("HCM_DOWNLOAD_CUSTOM_RANGE")}
          className={"digit-report-detail__popup"}
          footerChildren={[
            <Button key="cancel" label={t("HCM_CANCEL")} onClick={() => setShowCustomPopup(false)} variation="secondary" />,
            <Button
              key="trigger"
              label={t("HCM_GENERATE_REPORT")}
              onClick={handleGenerateReportClick}
              variation="primary"
              isDisabled={!customStartDate || !customEndDate || isTriggering || isCheckingExisting}
            />,
          ]}
          subHeading={t("HCM_CUSTOM_RANGE_DESC")}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", marginBottom: "1rem" }}>
            <label style={{ fontFamily: "Roboto, sans-serif", fontSize: "1rem", fontWeight: 500, color: "#0B0C0C" }}>
              {t("HCM_CUSTOM_START_DATE")}
            </label>
            <TextInput type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", marginBottom: "1rem" }}>
            <label style={{ fontFamily: "Roboto, sans-serif", fontSize: "1rem", fontWeight: 500, color: "#0B0C0C" }}>
              {t("HCM_CUSTOM_END_DATE")}
            </label>
            <TextInput type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} min={customStartDate} />
          </div>
        </PopUp>
      )}

      {existingReportPopup && (
        <PopUp
          onClose={() => setExistingReportPopup(null)}
          onOverlayClick={() => setExistingReportPopup(null)}
          heading={
            existingReportPopup.variant === "exists"
              ? t("HCM_REPORT_ALREADY_EXISTS")
              : existingReportPopup.variant === "in_progress"
              ? t("HCM_REPORT_ALREADY_IN_PROGRESS")
              : t("HCM_REPORT_GENERATION_FAILED_TITLE")
          }
          className={"digit-report-detail__popup"}
          footerChildren={
            existingReportPopup.variant === "exists"
              ? [
                  <Button key="close" label={t("HCM_CLOSE")} onClick={() => setExistingReportPopup(null)} variation="secondary" />,
                  <Button
                    key="download"
                    label={t("HCM_DOWNLOAD")}
                    onClick={() => {
                      downloadFileFromStore({ fileStoreId: existingReportPopup.data.filestoreid, customName: `${reportType}_custom` });
                      setExistingReportPopup(null);
                    }}
                    variation={retryCountdown === 0 ? "secondary" : "primary"}
                    icon="FileDownload"
                  />,
                  ...(retryCountdown === 0
                    ? [
                        <Button
                          key="retry-now"
                          label={t("HCM_GENERATE_NOW")}
                          onClick={handleGenerateReportClick}
                          variation="primary"
                          isDisabled={isTriggering || isCheckingExisting}
                        />,
                      ]
                    : []),
                ]
              : existingReportPopup.variant === "in_progress"
              ? [<Button key="close" label={t("HCM_CLOSE")} onClick={() => setExistingReportPopup(null)} variation="secondary" />]
              : [
                  <Button key="cancel" label={t("HCM_CANCEL")} onClick={() => setExistingReportPopup(null)} variation="secondary" />,
                  <Button key="retry" label={t("HCM_RETRY")} onClick={triggerCustomReport} variation="primary" isDisabled={isTriggering} />,
                ]
          }
          subHeading={
            existingReportPopup.variant === "exists"
              ? t("HCM_REPORT_ALREADY_EXISTS_DESC")
              : existingReportPopup.variant === "in_progress"
              ? t("HCM_REPORT_ALREADY_IN_PROGRESS_DESC")
              : t("HCM_REPORT_GENERATION_FAILED_DESC")
          }
        >
          {existingReportPopup.variant === "exists" && existingReportPopup.data?.retryBlocked && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>{t("HCM_REPORT_RETRY_BLOCKED")}</div>
          )}
          {existingReportPopup.variant === "exists" && retryCountdown !== null && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {retryCountdown > 0 ? (
                <div>
                  {t("HCM_REPORT_RETRY_AVAILABLE_IN")}: {formatDuration(retryCountdown)}
                </div>
              ) : (
                <div>{t("HCM_REPORT_RETRY_AVAILABLE_NOW")}</div>
              )}
            </div>
          )}
          {existingReportPopup.variant === "in_progress" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <div className="digit-report-detail__file-date">{t(getStageLabelKey(existingReportPopup.data.status))}</div>
              <div style={{ height: 6, borderRadius: 3, background: "#e6e6e6", marginTop: 6, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    borderRadius: 3,
                    background: "#0B4B66",
                    width: `${existingReportPopup.data.progressPercent || 0}%`,
                  }}
                />
              </div>
            </div>
          )}
          {existingReportPopup.variant === "failed" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {existingReportPopup.data.errormessage || t("HCM_REPORT_GENERATION_FAILED_DESC")}
            </div>
          )}
        </PopUp>
      )}

      {showToast && <Toast type={showToast.key === "error" ? "error" : "success"} label={showToast.label} onClose={() => setShowToast(null)} />}
    </React.Fragment>
  );
};

export default ReportDetailPage;
