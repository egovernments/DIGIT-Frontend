// Label keys + formatting shared by ReportsListPage and ReportDetailPage for the
// in-progress/failed report lifecycle. isTerminal/isFailed/progressPercent themselves
// come from the airflow-trigger-service API (single source of truth for pipeline
// semantics) - this file only owns UI-facing label/formatting concerns.

export const IN_PROGRESS_STAGE_LABELS = {
  TRIGGERED_ON_UI: "HCM_REPORT_STATUS_QUEUED",
  SCHEDULED: "HCM_REPORT_STATUS_SCHEDULED",
  TRIGGERED: "HCM_REPORT_STATUS_TRIGGERED",
  POD_STARTED: "HCM_REPORT_STATUS_STARTING",
  REPORT_GENERATION_STARTED: "HCM_REPORT_STATUS_GENERATING",
  ZIP_STARTED: "HCM_REPORT_STATUS_PACKAGING",
  FILESTORE_UPLOAD_STARTED: "HCM_REPORT_STATUS_UPLOADING",
};

export const getStageLabelKey = (status) => IN_PROGRESS_STAGE_LABELS[status] || "HCM_REPORT_STATUS_IN_PROGRESS";

export const formatDuration = (totalSeconds) => {
  if (totalSeconds === null || totalSeconds === undefined || Number.isNaN(Number(totalSeconds))) return null;
  const seconds = Math.max(0, Math.round(Number(totalSeconds)));
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins === 0 ? `${secs}s` : `${mins}m ${secs}s`;
};

export const formatFileSize = (bytes) => {
  const num = Number(bytes);
  if (!Number.isFinite(num) || num <= 0) return null;
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / (1024 * 1024)).toFixed(1)} MB`;
};

export const formatRowCount = (rowCount) => {
  const num = Number(rowCount);
  if (!Number.isFinite(num) || num < 0) return null;
  return num.toLocaleString();
};

// reporttriggeredtimems is an epoch-ms column, so a plain date label (formatCreatedTime)
// would drop the time-of-day - this keeps both, for the "when did this run actually start" tooltip line.
export const formatDateTime = (epochMs) => {
  const num = Number(epochMs);
  if (!Number.isFinite(num) || num <= 0) return null;
  const date = new Date(num);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Filename-safe companion to formatDateTime - colons (from a 12-hour clock) are outright
// illegal in Windows filenames, so this uses a 24-hour dd-mm-yyyy_HHmm form instead, safe to
// drop straight into a downloaded file's name on any OS.
export const formatDateTimeForFilename = (epochMs) => {
  const num = Number(epochMs);
  if (!Number.isFinite(num) || num <= 0) return null;
  const date = new Date(num);
  if (isNaN(date.getTime())) return null;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${dd}-${mm}-${yyyy}_${hh}${min}`;
};
