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
