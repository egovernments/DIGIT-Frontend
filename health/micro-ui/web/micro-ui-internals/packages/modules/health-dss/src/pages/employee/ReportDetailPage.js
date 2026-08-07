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
import { Calendar } from "react-date-range";
import { format, isValid } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
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

// Inclusive of the whole end day (23:59:59.999), not just midnight, so a report triggered any
// time on the selected end date still matches - compared in local calendar time, not UTC.
const isWithinDateRange = (epochMs, startDate, endDate) => {
  if (!epochMs || !isValid(startDate) || !isValid(endDate)) return false;
  const time = new Date(epochMs).getTime();
  const rangeStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
  const rangeEnd = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999).getTime();
  return time >= rangeStart && time <= rangeEnd;
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

// Preview columns are auto-generated from whatever's in the sheet, so widths aren't known
// ahead of render - giving every column this same fixed width instead of letting them auto-size
// means the frozen-column offsets (index * this width) are a plain arithmetic calculation
// rather than something that needs measuring real DOM widths after render.
const PREVIEW_COLUMN_WIDTH_PX = 180;

// Rounded, padded, shadowed card look for each report/in-progress row - overrides the
// shared .digit-report-detail__file-card SCSS (flush-edge, near-zero padding) inline so this
// doesn't need a stylesheet publish to show up.
const REPORT_CARD_STYLE = {
  borderRadius: "0.75rem",
  border: "0.063rem solid #D6D5D4",
  boxShadow: "0rem 0.125rem 0.375rem rgba(11, 12, 12, 0.08)",
  padding: "1.25rem",
};

// Shared by the completed-reports list and the failed-reports list - both can grow
// unbounded over time, so neither should render as one ever-growing column. The rows-per-page
// select stays visible even at a single page so switching to a bigger page size (or back to a
// smaller one) never depends on there currently being more than one page to navigate.
const PaginationControls = ({ page, totalPages, onPageChange, pageSize, onPageSizeChange, totalItems, t }) => {
  if (!totalItems) return null;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        gap: "1rem",
        marginTop: "1.5rem",
        paddingTop: "1.25rem",
        borderTop: "0.063rem solid #D6D5D4",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Button
            label={t("HCM_PREVIOUS")}
            onClick={() => onPageChange(page - 1)}
            isDisabled={page <= 1}
            variation="secondary"
            size="medium"
            style={{ borderRadius: "0.5rem" }}
          />
          <span style={{ fontFamily: "Roboto, sans-serif", fontSize: "1rem", color: "#505A5F", whiteSpace: "nowrap" }}>
            {t("HCM_PAGE")} {page} / {totalPages}
          </span>
          <Button
            label={t("HCM_NEXT")}
            onClick={() => onPageChange(page + 1)}
            isDisabled={page >= totalPages}
            variation="secondary"
            size="medium"
            style={{ borderRadius: "0.5rem" }}
          />
        </div>
      )}
    </div>
  );
};

// One in-progress dagRunId's current stage - no download action until it completes,
// at which point it disappears from here and shows up as a completed report instead.
const InProgressCard = ({ run, t }) => (
  <Card type="secondary" className="digit-report-detail__file-card" style={REPORT_CARD_STYLE}>
    <div className="digit-report-detail__file-row">
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
          {run.dateLabel && <div className="digit-report-detail__file-date">{run.dateLabel}</div>}
          <Tag label={t(getStageLabelKey(run.status))} type="warning" stroke={true} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: 6, maxWidth: 320 }}>
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: "#e6e6e6", overflow: "hidden" }}>
            <div
              style={{ height: "100%", borderRadius: 3, background: "#0B4B66", width: `${run.progressPercent || 0}%` }}
            />
          </div>
          <div style={{ fontFamily: "Roboto, sans-serif", fontSize: "0.875rem", color: "#505A5F", whiteSpace: "nowrap" }}>
            {run.progressPercent || 0}%
          </div>
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

// Trigger-date range filter UI - lives above the frequency tabs one level up (ReportDetailPage)
// so the same filter applies no matter which tab (Daily/Weekly/.../Failed) is active. Manages
// its own pending-selection/popup-open state locally; only the applied range is lifted up via
// onApply/onClear, since that's the only piece other components need to know about.
const TriggerDateFilter = ({ appliedRange, onApply, onClear, t }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pendingRange, setPendingRange] = useState({ startDate: undefined, endDate: undefined, key: "selection" });
  // Set only on an invalid Search attempt (end before start) - cleared as soon as either date
  // changes again, so a stale error never lingers once the user has actually fixed it.
  const [rangeError, setRangeError] = useState(null);
  const datePickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="hcm-trigger-date-filter">
      {/* Scoped to .hcm-trigger-date-filter, not a healthdss.scss edit - .custom-daterange-input/
          .custom-daterange-popup are shared with other DSS date pickers (DateRangePicker.js),
          so overriding them globally would resize/recolor those too. !important because these
          are overriding an already-published shared stylesheet rule, not just another inline
          style. */}
      <style>{`
        .hcm-trigger-date-filter .custom-daterange-input {
          min-width: 14rem !important;
          width: 14rem !important;
          padding: 0.5rem 0.75rem !important;
          border-radius: 0.5rem !important;
          border: 0.125rem solid #C84C0E !important;
          box-shadow: 0rem 0.063rem 0.25rem rgba(200, 76, 14, 0.3) !important;
        }
        .hcm-trigger-date-filter .custom-daterange-popup .rdrCalendarWrapper {
          font-size: 10px;
        }
      `}</style>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          <label style={{ fontFamily: "Roboto, sans-serif", fontSize: "1rem", fontWeight: 500, color: "#0B0C0C" }}>
            {t("HCM_FILTER_BY_TRIGGER_DATE")}
          </label>
          <div className="custom-daterange-wrapper" ref={datePickerRef}>
            <div className="custom-daterange-input" onClick={() => setShowDatePicker((prev) => !prev)}>
              <span>
                {isValid(pendingRange.startDate) ? format(pendingRange.startDate, "dd/MM/yyyy") : t("HCM_START_DATE")} -{" "}
                {isValid(pendingRange.endDate) ? format(pendingRange.endDate, "dd/MM/yyyy") : t("HCM_END_DATE")}
              </span>
            </div>
            {showDatePicker && (
            // Two independent single-month calendars, not react-date-range's DateRange
            // two-panel view - that view forces its panels to always be adjacent months
            // (month N / N+1), which makes picking e.g. Aug 2026 -> Oct 2044 impractical
            // (endless "next month" clicking on one shared cursor). Each Calendar here
            // manages its own displayed month independently (own month/year dropdowns,
            // own prev/next arrows), so the two ends of the range can jump anywhere on
            // their own - at the cost of not being able to shade the days "in between"
            // the two picks the way a true range view would.
            <div className="custom-daterange-popup" style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
              <div>
                <div
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#505A5F",
                    textAlign: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  {t("HCM_START_DATE")}
                </div>
                {/* No typed <input type="date"> here - native date inputs shift digits into
                    the year segment one at a time from the right, so any keystroke sequence
                    that isn't a clean, fully-focused 4-digit run reliably lands on a stray low
                    year (e.g. 1902) instead of what was intended. Calendar's own month/year
                    dropdowns (rendered below) are the only way to jump to a specific year - no
                    typing path left to produce a bad Date. */}
                <Calendar
                  date={pendingRange.startDate}
                  onChange={(date) => {
                    setRangeError(null);
                    // Mirror End to the same day whenever we're currently in "single day" mode
                    // (End unset, or already equal to the old Start) - so picking one day on
                    // this side alone is enough to filter that one day, and picking a *second*
                    // single day later still stays single-day instead of leaving a stale range
                    // between the two. The moment the user explicitly picks a *different* End,
                    // start≠end, mirroring stops - adjusting just the start of a real range
                    // then behaves normally.
                    setPendingRange((prev) => {
                      const wasSingleDay = !prev.endDate || (prev.startDate && prev.startDate.getTime() === prev.endDate.getTime());
                      return { ...prev, startDate: date, endDate: wasSingleDay ? date : prev.endDate, key: "selection" };
                    });
                  }}
                />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#505A5F",
                    textAlign: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  {t("HCM_END_DATE")}
                </div>
                <Calendar
                  date={pendingRange.endDate}
                  onChange={(date) => {
                    setRangeError(null);
                    setPendingRange((prev) => ({ ...prev, endDate: date, key: "selection" }));
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "nowrap" }}>
          <Button
            label={t("HCM_SEARCH")}
            onClick={() => {
              if (pendingRange.startDate > pendingRange.endDate) {
                setRangeError(t("HCM_INVALID_DATE_RANGE"));
                return;
              }
              setRangeError(null);
              onApply({ startDate: pendingRange.startDate, endDate: pendingRange.endDate });
              setShowDatePicker(false);
            }}
            variation="primary"
            size="medium"
            isDisabled={!isValid(pendingRange.startDate) || !isValid(pendingRange.endDate)}
            style={{ borderRadius: "0.5rem" }}
          />
          <Button
            label={t("ES_COMMON_CLEAR_SEARCH")}
            onClick={() => {
              setPendingRange({ startDate: undefined, endDate: undefined, key: "selection" });
              onClear();
              setRangeError(null);
              setShowDatePicker(false);
            }}
            variation="link"
            size="medium"
            isDisabled={!pendingRange.startDate && !appliedRange}
          />
        </div>
        {rangeError && (
          <div style={{ fontFamily: "Roboto, sans-serif", fontSize: "0.875rem", color: "#D4351C" }}>{rangeError}</div>
        )}
      </div>
      </div>
    </div>
  );
};

const FrequencyContent = ({ reports, inProgressRuns = [], t, reportType, appliedRange }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // Reset to page 1 whenever the underlying list changes (e.g. a newly-completed report
  // shifts everything), the page size changes, or the date filter is applied/cleared, so
  // pagination never gets stuck on a now-out-of-range page.
  useEffect(() => {
    setPage(1);
  }, [reports, pageSize, appliedRange]);

  const filteredReports = useMemo(() => {
    if (!appliedRange?.startDate || !appliedRange?.endDate) return reports;
    return reports.filter((report) => isWithinDateRange(report.reportTriggeredTimeMs, appliedRange.startDate, appliedRange.endDate));
  }, [reports, appliedRange]);

  // null when closed; otherwise { report, isLoading, error, columnKeys, rows }
  const [preview, setPreview] = useState(null);
  // Per-column search text, keyed by column name - every non-empty entry ANDs together.
  const [columnFilters, setColumnFilters] = useState({});
  // How many of the leftmost preview columns stay pinned while scrolling horizontally -
  // defaults to just the first column, reset on every new preview since column count/order
  // varies per report.
  const [frozenColumnCount, setFrozenColumnCount] = useState(1);
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
    setFrozenColumnCount(1);
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
      width: `${PREVIEW_COLUMN_WIDTH_PX}px`,
    }));
  }, [preview?.columnKeys, columnFilters, t]);

  useEffect(() => {
    setResetPaginationToggle((prev) => !prev);
  }, [columnFilters]);

  if (!reports.length && !inProgressRuns.length) {
    return <NoResultsFound text={t("HCM_NO_REPORTS_GENERATED")} />;
  }

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / pageSize));
  const pageReports = filteredReports.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="digit-report-detail__files-list" style={{ gap: "1rem" }}>
      {inProgressRuns.map((run) => (
        <InProgressCard key={run.dagrunid || run.eventid} run={run} t={t} />
      ))}
      {appliedRange?.startDate && filteredReports.length === 0 && <NoResultsFound text={t("HCM_NO_REPORTS_MATCH_DATE")} />}
      {pageReports.map((report) => (
        <Card key={report.id} type="secondary" className="digit-report-detail__file-card" style={REPORT_CARD_STYLE}>
          <div className="digit-report-detail__file-row">
            <div>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <div className="digit-report-detail__file-date">{report.dateLabel}</div>
                {report.hasMeta && (
                  <TooltipWrapper
                    placement="right"
                    header={t("HCM_REPORT_DETAILS")}
                    content={
                      <div>
                        {report.reportTimeLabel && <div>{t("HCM_REPORT_TIME")}: {report.reportTimeLabel}</div>}
                        {report.processingTimeLabel && <div>{t("HCM_PROCESSING_TIME")}: {report.processingTimeLabel}</div>}
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
              {(report.reportStartedLabel || report.fileSizeLabel) && (
                <div style={{ display: "flex", gap: "2rem", marginTop: "0.375rem", flexWrap: "wrap" }}>
                  {report.reportStartedLabel && (
                    <div>
                      <div style={{ fontFamily: "Roboto, sans-serif", fontSize: "0.75rem", color: "#505A5F", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                        {t("HCM_REPORT_TRIGGERED_AT")}
                      </div>
                      <div style={{ fontFamily: "Roboto, sans-serif", fontSize: "1rem", color: "#0B0C0C" }}>{report.reportStartedLabel}</div>
                    </div>
                  )}
                  {report.fileSizeLabel && (
                    <div>
                      <div style={{ fontFamily: "Roboto, sans-serif", fontSize: "0.75rem", color: "#505A5F", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                        {t("HCM_FILE_SIZE")}
                      </div>
                      <div style={{ fontFamily: "Roboto, sans-serif", fontSize: "1rem", color: "#0B0C0C" }}>{report.fileSizeLabel}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="digit-report-detail__file-actions">
              {report.filesizebytes != null && report.filesizebytes < PREVIEW_MAX_FILE_SIZE_BYTES && (
                <Button
                  label={t("HCM_SHOW_PREVIEW")}
                  onClick={() => handlePreviewClick(report)}
                  variation="secondary"
                  icon="Visibility"
                  size="medium"
                  isDisabled={preview?.isLoading && preview?.report?.id === report.id}
                  style={{ borderRadius: "0.5rem" }}
                />
              )}
              <Button
                label={t("HCM_DOWNLOAD")}
                onClick={() => handleDownload(report)}
                variation="secondary"
                icon="FileDownload"
                size="medium"
                style={{ borderRadius: "0.5rem" }}
              />
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
        totalItems={filteredReports.length}
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
            // First in the array, not sorted - PopUp only re-sorts footerChildren by button
            // variation when sortFooterButtons is explicitly passed (verified against the
            // installed digit-ui-components source), and this popup doesn't set it - so this
            // renders first/leftmost exactly as ordered here. flex:1 fills the row's free space,
            // pushing Close/Download to the right edge without needing to fight that sort logic.
            // Always a real element (never a bare `false`) - PopUp's Enter-key handler runs
            // .find(el => el.props.type...) over this exact array, which throws if any entry
            // isn't an actual element; the loading/error states just render an empty spacer.
            <div key="freeze-slider" style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: "16rem" }}>
              {!preview.isLoading && !preview.error && (
                <React.Fragment>
                  <label style={{ fontFamily: "Roboto, sans-serif", fontSize: "1rem", fontWeight: 500, color: "#0B0C0C", whiteSpace: "nowrap" }}>
                    {t("HCM_FREEZE_COLUMNS")}
                  </label>
                  <input
                    className="hcm-preview-table-freeze-slider"
                    type="range"
                    min={1}
                    max={Math.max(1, previewColumns.length)}
                    value={frozenColumnCount}
                    onChange={(e) => setFrozenColumnCount(Number(e.target.value))}
                  />
                  <span style={{ fontFamily: "Roboto, sans-serif", fontSize: "1rem", fontWeight: 700, color: "#C84C0E", minWidth: "1.5rem" }}>
                    {frozenColumnCount}
                  </span>
                </React.Fragment>
              )}
            </div>,
            <Button
              key="close"
              label={t("HCM_CLOSE")}
              onClick={() => setPreview(null)}
              variation="secondary"
              style={{ borderRadius: "0.5rem" }}
            />,
            <Button
              key="download"
              label={t("HCM_DOWNLOAD")}
              onClick={() => handleDownload(preview.report)}
              variation="primary"
              icon="FileDownload"
              style={{ borderRadius: "0.5rem" }}
            />,
          ]}
        >
          {preview.isLoading ? (
            <Loader />
          ) : preview.error ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>{preview.error}</div>
          ) : (
            <div className="hcm-preview-table">
              {/* Scoped to .hcm-preview-table so it only affects this one DataTable instance -
                  react-data-table-component has no built-in "freeze first N columns" feature,
                  and (verified against the installed library's source) a column's own `style`
                  prop only reaches body cells, never the header cell, so per-column style can't
                  drive this either. nth-child targets header (.rdt_TableCol) and body
                  (.rdt_TableCell) uniformly by position instead, sidestepping that gap - the
                  left offset is just (position index) * the fixed column width set on every
                  column above, since real per-column widths aren't known before render. */}
              <style>{`
                .hcm-preview-table .rdt_TableCol:nth-child(-n+${frozenColumnCount}),
                .hcm-preview-table .rdt_TableCell:nth-child(-n+${frozenColumnCount}) {
                  position: sticky;
                  z-index: 2;
                  background: #FFFFFF;
                }
                ${Array.from({ length: frozenColumnCount })
                  .map(
                    (_, i) => `
                .hcm-preview-table .rdt_TableCol:nth-child(${i + 1}),
                .hcm-preview-table .rdt_TableCell:nth-child(${i + 1}) {
                  left: ${i * PREVIEW_COLUMN_WIDTH_PX}px;
                }`
                  )
                  .join("\n")}
                .hcm-preview-table .rdt_TableRow:hover {
                  background-color: #FEEFE7 !important;
                }
                .hcm-preview-table .rdt_TableRow:hover .rdt_TableCell:nth-child(-n+${frozenColumnCount}) {
                  background: #FEEFE7 !important;
                }
                .hcm-preview-table-freeze-slider {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 100%;
                  max-width: 20rem;
                  height: 0.5rem;
                  border-radius: 0.5rem;
                  background: linear-gradient(to right, #C84C0E, #FEEFE7);
                  outline: none;
                  cursor: pointer;
                }
                .hcm-preview-table-freeze-slider::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  width: 1.25rem;
                  height: 1.25rem;
                  border-radius: 50%;
                  background: #C84C0E;
                  border: 0.125rem solid #FFFFFF;
                  box-shadow: 0rem 0rem 0rem 0.125rem #C84C0E;
                }
                .hcm-preview-table-freeze-slider::-moz-range-thumb {
                  width: 1.25rem;
                  height: 1.25rem;
                  border-radius: 50%;
                  background: #C84C0E;
                  border: 0.125rem solid #FFFFFF;
                  box-shadow: 0rem 0rem 0rem 0.125rem #C84C0E;
                }
                .hcm-preview-table-freeze-slider::-moz-range-track {
                  height: 0.5rem;
                  border-radius: 0.5rem;
                  background: linear-gradient(to right, #C84C0E, #FEEFE7);
                }
              `}</style>
              <DataTable
                columns={previewColumns}
                data={filteredPreviewRows}
                pagination
                paginationPerPage={10}
                paginationResetDefaultPage={resetPaginationToggle}
                fixedHeader
                fixedHeaderScrollHeight="50vh"
                persistTableHead
                highlightOnHover
                noDataComponent={<div style={{ padding: "24px" }}>{t("HCM_NO_REPORTS_GENERATED")}</div>}
              />
            </div>
          )}
        </PopUp>
      )}
    </div>
  );
};

// Every failed attempt (any frequency), not just the transient one surfaced by the pre-flight
// "already exists" check popup - this is the only persistent view of failures on the page.
const FailedReportsContent = ({ failedReports, appliedRange, t }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const filteredFailedReports = useMemo(() => {
    if (!appliedRange?.startDate || !appliedRange?.endDate) return failedReports;
    return failedReports.filter((item) => isWithinDateRange(item.reporttriggeredtimems, appliedRange.startDate, appliedRange.endDate));
  }, [failedReports, appliedRange]);

  useEffect(() => {
    setPage(1);
  }, [failedReports, pageSize, appliedRange]);

  if (!failedReports.length) {
    return <NoResultsFound text={t("HCM_NO_FAILED_REPORTS")} />;
  }

  const totalPages = Math.max(1, Math.ceil(filteredFailedReports.length / pageSize));
  const pageItems = filteredFailedReports.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="digit-report-detail__files-list" style={{ gap: "1rem" }}>
      {appliedRange?.startDate && filteredFailedReports.length === 0 && <NoResultsFound text={t("HCM_NO_REPORTS_MATCH_DATE")} />}
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
        totalItems={filteredFailedReports.length}
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
  // Applies across whichever tab (Daily/Weekly/.../Failed) is currently active - lives here,
  // not inside FrequencyContent/FailedReportsContent, precisely so it's shared across tabs.
  const [appliedRange, setAppliedRange] = useState(null);
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
        // Raw epoch for the "Filter by Trigger Date" search - reportStartedLabel is a
        // formatted display string, not comparable to a plain <input type="date"> value.
        reportTriggeredTimeMs: item?.reporttriggeredtimems,
        reportTimeLabel,
        processingTimeLabel,
        fileSizeLabel,
        rowCountLabel,
        // reportStartedLabel/fileSizeLabel are shown directly on the card now, not in this
        // tooltip - excluded here so a report with only those fields doesn't get an info
        // icon over an empty popup.
        hasMeta: Boolean(reportTimeLabel || processingTimeLabel || rowCountLabel),
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
        {/* Report name/PII tag header removed - already shown one level up via the report-type
            tabs (ReportsListPage.js), so this was pure duplication. Kept here, commented, in
            case that changes.
        <div className="digit-report-detail__header-wrap">
          <SVG.Description height="28" width="28" className="digit-report-detail__header-svg" />
          <div className="digit-report-detail__header">
            <div className="digit-report-detail__header-with-tag">
              <HeaderComponent className="digit-report-detail__header-with-tag-header">{t(reportLabel)}</HeaderComponent>
              <Tag label={t("HCM_CONTAINS_PII")} showIcon={true} type="error" stroke={true} />
            </div>
            <p className="digit-report-detail__subtitle">{t("HCM_REPORTS_GENERATED_BY_FREQUENCY")}</p>
          </div>
        </div>
        */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "1.5rem",
          }}
        >
          <TriggerDateFilter appliedRange={appliedRange} onApply={setAppliedRange} onClear={() => setAppliedRange(null)} t={t} />
          <div className="digit-report-detail__custom-btn">
            <Button
              label={t("HCM_DOWNLOAD_CUSTOM_RANGE")}
              onClick={() => setShowCustomPopup(true)}
              variation="secondary"
              icon="CalendarToday"
              size="medium"
              style={{ borderRadius: "0.5rem" }}
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
                <FailedReportsContent key={activeTab.code} failedReports={failedReports} appliedRange={appliedRange} t={t} />
              ) : (
                <FrequencyContent
                  key={activeTab?.code}
                  reports={reportsByFrequency[activeTab?.code] || []}
                  inProgressRuns={inProgressByFrequency[activeTab?.code] || []}
                  t={t}
                  reportType={reportType}
                  appliedRange={appliedRange}
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
          style={{ width: "32rem", maxWidth: "90vw", borderRadius: "0.75rem" }}
          footerChildren={[
            <Button
              key="cancel"
              label={t("HCM_CANCEL")}
              onClick={() => setShowCustomPopup(false)}
              variation="secondary"
              style={{ borderRadius: "0.5rem" }}
            />,
            <Button
              key="trigger"
              label={t("HCM_GENERATE_REPORT")}
              onClick={handleGenerateReportClick}
              variation="primary"
              isDisabled={!customStartDate || !customEndDate || isTriggering || isCheckingExisting}
              style={{ borderRadius: "0.5rem" }}
            />,
          ]}
          subHeading={t("HCM_CUSTOM_RANGE_DESC")}
        >
          {/* TextInput's own rendered <input> isn't guaranteed reachable via a style prop the
              way Button's root element is - a scoped descendant selector on a wrapper class
              reaches the real <input> regardless of whatever markup TextInput wraps it in. */}
          <style>{`
            .hcm-custom-range-date-field input {
              border-radius: 0.5rem !important;
            }
          `}</style>
          <div className="hcm-custom-range-date-field" style={{ display: "flex", flexDirection: "column", gap: "0.375rem", marginBottom: "1rem" }}>
            <label style={{ fontFamily: "Roboto, sans-serif", fontSize: "1rem", fontWeight: 500, color: "#0B0C0C" }}>
              {t("HCM_CUSTOM_START_DATE")}
            </label>
            <TextInput type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} />
          </div>
          <div className="hcm-custom-range-date-field" style={{ display: "flex", flexDirection: "column", gap: "0.375rem", marginBottom: "1rem" }}>
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
