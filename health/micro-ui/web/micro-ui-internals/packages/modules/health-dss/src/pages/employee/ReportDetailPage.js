import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import {
  Card,
  HeaderComponent,
  Button,
  Tag,
  SVG,
  Accordion,
  AccordionList,
  Loader,
  PopUp,
  TextInput,
  Toast,
  TooltipWrapper,
} from "@egovernments/digit-ui-components";
import axios from "axios";
import { checkExistingCustomReport } from "../../utils/reportsApi";
import { getStageLabelKey, formatDuration, formatFileSize, formatRowCount } from "../../utils/reportStatus";

// Currently downloads as zip since backend returns zip files.
// TODO: Update to xlsx download once backend supports excel format.
const downloadFileFromStore = ({ fileStoreId, customName }) => {
  if (!fileStoreId) return;
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
    .then((res) => {
      const blob = new Blob([res.data], { type: "application/zip" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = (customName || "report") + ".zip";
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(link.href), 7000);
    });
};

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

// One in-progress dagRunId's current stage - no download action until it completes,
// at which point it disappears from here and shows up as a completed report instead.
const InProgressCard = ({ run, t }) => (
  <Card type="secondary" className="digit-report-detail__file-card">
    <div className="digit-report-detail__file-row">
      <div className="digit-report-detail__file-info">
        {run.dateLabel && <div className="digit-report-detail__file-date">{run.dateLabel}</div>}
        <div className="digit-report-detail__file-meta">{t(getStageLabelKey(run.status))}</div>
        <div style={{ height: 6, borderRadius: 3, background: "#e6e6e6", marginTop: 6, overflow: "hidden", maxWidth: 240 }}>
          <div
            style={{ height: "100%", borderRadius: 3, background: "#0B4B66", width: `${run.progressPercent || 0}%` }}
          />
        </div>
        {formatDuration(run.elapsedSeconds) && (
          <div className="digit-report-detail__file-meta">{t("HCM_RUNNING_FOR")}: {formatDuration(run.elapsedSeconds)}</div>
        )}
        {(run.expectedRows || run.expectedGenerationTimeSeconds) && (
          <div className="digit-report-detail__file-meta">
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
  const handleDownload = (report) => {
    downloadFileFromStore({
      fileStoreId: report.filestoreid,
      customName: `${reportType}_${report.dateLabel}`,
    });
  };

  return (
    <div className="digit-report-detail__files-list">
      {inProgressRuns.map((run) => (
        <InProgressCard key={run.dagrunid || run.eventid} run={run} t={t} />
      ))}
      {reports.map((report) => (
        <Card key={report.id} type="secondary" className="digit-report-detail__file-card">
          <div className="digit-report-detail__file-row">
            <div className="digit-report-detail__file-info" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div className="digit-report-detail__file-date">{report.dateLabel}</div>
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
            <div className="digit-report-detail__file-actions">
              <Button label={t("HCM_DOWNLOAD")} onClick={() => handleDownload(report)} variation="link" icon="FileDownload" size="medium" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

const ReportDetailPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const reportType = searchParams.get("reportType");
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

  const { data: inProgressRuns = [], refetch: refetchInProgress } = Digit.Hooks.DSS.useReportsInProgress({
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
  // it just completed or failed) doesn't by itself update the completed-reports list -
  // without this, a just-finished report only appears after a manual page reload.
  const prevInProgressIdsRef = useRef(new Set());
  useEffect(() => {
    const currentIds = new Set((inProgressRuns || []).map((run) => run.dagrunid));
    const hasNewlyFinished = [...prevInProgressIdsRef.current].some((id) => !currentIds.has(id));
    prevInProgressIdsRef.current = currentIds;
    if (hasNewlyFinished) {
      fetchReports();
    }
  }, [inProgressRuns, fetchReports]);
  // Group reports by triggerfrequency from actual API response
  const reportsByFrequency = useMemo(() => {
    const reports = reportsMetadata?.data || [];
    if (!reports.length) return {};

    const grouped = {};
    reports.forEach((item) => {
      const freq = item?.triggerfrequency || "DAILY";
      if (!grouped[freq]) grouped[freq] = [];

      const dateLabel = getReportDateLabel(item, freq);

      const reportTimeLabel = formatDuration(item?.reportTimeSeconds);
      const processingTimeLabel = formatDuration(item?.processingTimeSeconds);
      const fileSizeLabel = formatFileSize(item?.filesizebytes);
      const rowCountLabel = formatRowCount(item?.rowcount);

      grouped[freq].push({
        id: item?.id,
        dateLabel: dateLabel,
        filestoreid: item?.filestoreid,
        reportTimeLabel,
        processingTimeLabel,
        fileSizeLabel,
        rowCountLabel,
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

  const reportLabel = `HCM_${reportType?.toUpperCase()}`;
  const totalReports = Object.values(reportsByFrequency).flat().length;
  const totalInProgress = inProgressRuns?.length || 0;

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
              icon="CalendarMonth"
              size="medium"
            />
          </div>
        </div>

        {totalReports === 0 && totalInProgress === 0 ? (
          <p>{t("HCM_NO_REPORTS_GENERATED")}</p>
        ) : (
          <AccordionList allowMultipleOpen={true}>
            {allFrequencies.map((frequency) => {
              const reports = reportsByFrequency[frequency] || [];
              const inProgress = inProgressByFrequency[frequency] || [];
              const title =
                inProgress.length > 0
                  ? `${t(`HCM_REPORT_FREQUENCY_${frequency}`)} : ${reports.length} ${t("HCM_REPORTS_COUNT")} (${inProgress.length} ${t(
                      "HCM_IN_PROGRESS"
                    )})`
                  : `${t(`HCM_REPORT_FREQUENCY_${frequency}`)} : ${reports.length} ${t("HCM_REPORTS_COUNT")}`;
              return (
                <Accordion
                  key={frequency}
                  title={title}
                  icon="CalendarMonth"
                  isOpenInitially={false}
                  hideCardBorder={false}
                  hideCardBg={true}
                  hideBorderRadius={true}
                >
                  <FrequencyContent reports={reports} inProgressRuns={inProgress} t={t} reportType={reportType} />
                </Accordion>
              );
            })}
          </AccordionList>
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
          <div className="digit-report-detail__custom-popup-field">
            <label>{t("HCM_CUSTOM_START_DATE")}</label>
            <TextInput type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} />
          </div>
          <div className="digit-report-detail__custom-popup-field">
            <label>{t("HCM_CUSTOM_END_DATE")}</label>
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
            <div className="digit-report-detail__file-info">{t("HCM_REPORT_RETRY_BLOCKED")}</div>
          )}
          {existingReportPopup.variant === "exists" && retryCountdown !== null && (
            <div className="digit-report-detail__file-info">
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
            <div className="digit-report-detail__file-info">
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
            <div className="digit-report-detail__file-info">{existingReportPopup.data.errormessage || t("HCM_REPORT_GENERATION_FAILED_DESC")}</div>
          )}
        </PopUp>
      )}

      {showToast && <Toast type={showToast.key === "error" ? "error" : "success"} label={showToast.label} onClose={() => setShowToast(null)} />}
    </React.Fragment>
  );
};

export default ReportDetailPage;
