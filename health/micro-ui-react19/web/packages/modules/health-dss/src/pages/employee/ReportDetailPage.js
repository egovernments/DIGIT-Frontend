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
  FieldV1,
  Toast,
  NoResultsFound,
  TooltipWrapper,
} from "@egovernments/digit-ui-components";
import { InfoOutline } from "@egovernments/digit-ui-svg-components";
import axios from "axios";
import { I18N_KEYS } from "../../utils/i18nKeyConstants";
import { checkExistingCustomReport } from "../../utils/reportsApi";
import { getStageLabelKey, formatDuration, formatFileSize, formatRowCount } from "../../utils/reportStatus";

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

const toOrdinalDate = (date) => {
  const d = date.getUTCDate();
  const suffix = d % 10 === 1 && d !== 11 ? "st" : d % 10 === 2 && d !== 12 ? "nd" : d % 10 === 3 && d !== 13 ? "rd" : "th";
  return `${d}${suffix} ${date.toLocaleDateString("en-US", { month: "long", timeZone: "UTC" })} ${date.getUTCFullYear()}`;
};

const formatCreatedTime = (createdtime) => {
  if (!createdtime) return "";
  const date = new Date(createdtime);
  if (isNaN(date.getTime())) return createdtime;
  return toOrdinalDate(date);
};

// reporttriggeredtimems is epoch millis - unlike createdtime/toOrdinalDate above (which
// render in UTC), this must render in the viewer's local time, so no timeZone override
// and plain getDate()/getFullYear() (local) instead of the UTC variants.
const toOrdinalDateLocal = (date) => {
  const d = date.getDate();
  const suffix = d % 10 === 1 && d !== 11 ? "st" : d % 10 === 2 && d !== 12 ? "nd" : d % 10 === 3 && d !== 13 ? "rd" : "th";
  return `${d}${suffix} ${date.toLocaleDateString("en-US", { month: "long" })} ${date.getFullYear()}`;
};

const formatTriggeredTime = (triggeredTimeMs) => {
  if (!triggeredTimeMs) return "";
  const date = new Date(Number(triggeredTimeMs));
  if (isNaN(date.getTime())) return "";
  const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  return `${toOrdinalDateLocal(date)}, ${time}`;
};

const formatDateForPayload = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy} 00:00:00+0530`;
};

// reportrange: "2026-06-29 00:00:00+0530_2026-07-04 00:00:00+0530" - parse the full
// datetime with its own offset so it converts to the correct date, then format WITHOUT
// forcing UTC - toOrdinalDate's getUTCDate() would read a +0530 midnight as 18:30 the
// previous day in UTC, silently shifting the whole custom range back by one calendar day.
const formatRangeDate = (dateStr) => {
  const trimmed = dateStr?.trim();
  if (!trimmed) return "";
  // "2026-06-29 00:00:00+0530" → "2026-06-29T00:00:00+05:30" for ISO parse
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

// One in-progress dagRunId's current stage - no download action until it completes, at
// which point it disappears from here and shows up as a completed report instead.
const InProgressCard = ({ run, t }) => (
  <Card type="secondary" className="digit-report-detail__file-card">
    <div className="digit-report-detail__file-row">
      <div className="digit-report-detail__file-info">
        {run.dateLabel && <div className="digit-report-detail__file-date">{run.dateLabel}</div>}
        <div className="digit-report-detail__file-meta">{t(getStageLabelKey(run.status))}</div>
        <div className="digit-report-detail__progress-bar">
          <div className="digit-report-detail__progress-bar-fill" style={{ width: `${run.progressPercent || 0}%` }} />
        </div>
        {formatDuration(run.elapsedSeconds) && (
          <div className="digit-report-detail__file-meta">
            {t(I18N_KEYS.PAGES.HCM_RUNNING_FOR)}: {formatDuration(run.elapsedSeconds)}
          </div>
        )}
        {(run.expectedRows != null || run.expectedGenerationTimeSeconds != null) && (
          <div className="digit-report-detail__file-meta">
            {run.expectedRows != null && (
              <span>
                {t(I18N_KEYS.PAGES.HCM_ESTIMATED_ROWS)}: ~{formatRowCount(run.expectedRows)}
              </span>
            )}
            {run.expectedRows != null && run.expectedGenerationTimeSeconds != null && <span> &middot; </span>}
            {run.expectedGenerationTimeSeconds != null && (
              <span>
                {t(I18N_KEYS.PAGES.HCM_ESTIMATED_TIME)}: ~{formatDuration(run.expectedGenerationTimeSeconds)}
              </span>
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
            <div className="digit-report-detail__file-info digit-report-detail__file-info-inline">
              <div className="digit-report-detail__file-date">{report.dateLabel}</div>
              {report.hasMeta && (
                <TooltipWrapper
                  placement="right"
                  header={t(I18N_KEYS.PAGES.HCM_REPORT_DETAILS)}
                  content={
                    <div>
                      {report.triggeredTimeLabel && (
                        <div>
                          {t(I18N_KEYS.PAGES.HCM_REPORT_TRIGGERED_TIME)}: {report.triggeredTimeLabel}
                        </div>
                      )}
                      {report.reportTimeLabel && (
                        <div>
                          {t(I18N_KEYS.PAGES.HCM_REPORT_TIME)}: {report.reportTimeLabel}
                        </div>
                      )}
                      {report.processingTimeLabel && (
                        <div>
                          {t(I18N_KEYS.PAGES.HCM_PROCESSING_TIME)}: {report.processingTimeLabel}
                        </div>
                      )}
                      {report.fileSizeLabel && (
                        <div>
                          {t(I18N_KEYS.PAGES.HCM_FILE_SIZE)}: {report.fileSizeLabel}
                        </div>
                      )}
                      {report.rowCountLabel && (
                        <div>
                          {t(I18N_KEYS.PAGES.HCM_ROW_COUNT)}: {report.rowCountLabel}
                        </div>
                      )}
                    </div>
                  }
                >
                  <span className="digit-report-detail__info-trigger" aria-label={t(I18N_KEYS.PAGES.HCM_REPORT_DETAILS)}>
                    <InfoOutline width="20px" height="20px" fill="#505A5F" />
                  </span>
                </TooltipWrapper>
              )}
            </div>
            <div className="digit-report-detail__file-actions">
              <Button label={t(I18N_KEYS.PAGES.HCM_DOWNLOAD_REPORT)} onClick={() => handleDownload(report)} variation="link" icon="FileDownload" size="medium" />
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

  const campaignSelected = Digit.SessionStorage.get("campaignSelected");
  const epochToDateStr = (epoch) => {
    if (!epoch) return "";
    const d = new Date(epoch);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const campaignMinDate = epochToDateStr(campaignSelected?.auditDetails?.createdTime);
  const campaignMaxDate = epochToDateStr(campaignSelected?.endDate);

  const handleClosePopup = () => {
    setShowCustomPopup(false);
    setCustomStartDate("");
    setCustomEndDate("");
  };

  const triggerCustomReport = async () => {
    setIsTriggering(true);
    try {
      await Digit.CustomService.getResponse({
        url: `/airflow-trigger-api/api/dags/trigger`,
        body: {
          tenantId: tenantId,
          dag_id: "hcm_dynamic_campaigns",
          locale:
              Digit?.SessionStorage?.get("locale") ||
              Digit?.SessionStorage.get("initData")?.selectedLanguage ||
              Digit?.Utils?.getDefaultLanguage(),
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
      setShowToast({ key: "success", label: t(I18N_KEYS.PAGES.HCM_CUSTOM_REPORT_TRIGGERED) });
      refetchInProgress();
    } catch (error) {
      console.error("Error triggering custom report:", error);
      setShowToast({ key: "error", label: t(I18N_KEYS.PAGES.HCM_CUSTOM_REPORT_TRIGGER_FAILED) });
    } finally {
      setIsTriggering(false);
    }
  };

  // Pre-flight check before triggering: does a completed/in-progress/failed run
  // already exist for this exact campaign+report+date-range?
  const handleGenerateReportClick = async () => {
    if (!customStartDate || !customEndDate) {
      setShowToast({ key: "error", label: t(I18N_KEYS.PAGES.HCM_CUSTOM_DATE_REQUIRED) });
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

      handleClosePopup();
      if (existing.isFailed) {
        setExistingReportPopup({ variant: "failed", data: existing });
      } else if (existing.isTerminal) {
        setExistingReportPopup({ variant: "exists", data: existing });
      } else {
        setExistingReportPopup({ variant: "in_progress", data: existing });
      }
    } catch (error) {
      console.error("Error checking for existing custom report:", error);
      setShowToast({ key: "error", label: t(I18N_KEYS.PAGES.HCM_CUSTOM_REPORT_CHECK_FAILED) });
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
  // mount fetch - the completion-triggered refresh below must not flash the full-page
  // Loader over content the user is already looking at.
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
            locale:
              Digit?.SessionStorage?.get("locale") ||
              Digit?.SessionStorage.get("initData")?.selectedLanguage ||
              Digit?.Utils?.getDefaultLanguage(),
          },
          // This body never varies for a given report, so CustomService's default
          // useCache:true would otherwise replay the very first response forever -
          // exactly why a newly-completed report would only ever show up after a reload.
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

  // /reports-in-progress polls every 20s, but a run dropping out of that list (because it
  // just completed or failed) doesn't by itself update the completed-reports list - without
  // this, a just-finished report would only appear after a manual page reload.
  const prevInProgressIdsRef = useRef(new Set());
  useEffect(() => {
    const currentIds = new Set((inProgressRuns || []).map((run) => run.dagrunid));
    const hasNewlyFinished = [...prevInProgressIdsRef.current].some((id) => !currentIds.has(id));
    prevInProgressIdsRef.current = currentIds;
    if (hasNewlyFinished) {
      fetchReports();
    }
  }, [inProgressRuns, fetchReports]);

  const reportsByFrequency = useMemo(() => {
    const reports = reportsMetadata?.data || [];
    if (!reports.length) return {};

    const grouped = {};
    reports.forEach((item) => {
      const freq = item?.triggerfrequency || "DAILY";
      if (!grouped[freq]) grouped[freq] = [];

      const dateLabel = getReportDateLabel(item, freq);
      const triggeredTimeLabel = formatTriggeredTime(item?.reporttriggeredtimems);
      const reportTimeLabel = formatDuration(item?.reportTimeSeconds);
      const processingTimeLabel = formatDuration(item?.processingTimeSeconds);
      const fileSizeLabel = formatFileSize(item?.filesizebytes);
      const rowCountLabel = formatRowCount(item?.rowcount);

      grouped[freq].push({
        id: item?.id,
        dateLabel: dateLabel,
        filestoreid: item?.filestoreid,
        triggeredTimeLabel,
        reportTimeLabel,
        processingTimeLabel,
        fileSizeLabel,
        rowCountLabel,
        hasMeta: Boolean(triggeredTimeLabel || reportTimeLabel || processingTimeLabel || fileSizeLabel || rowCountLabel),
      });
    });

    Object.keys(grouped).forEach((freq) => {
      grouped[freq].sort((a, b) => b.id - a.id);
    });

    return grouped;
  }, [reportsMetadata]);

  // Group in-progress runs by frequency too, so a frequency with nothing completed yet
  // still gets its own accordion section instead of being invisible.
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

  if (isLoading)
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <Loader className="digit-center-loader" />
      </div>
    );

  return (
    <React.Fragment>
      <Card className="digit-report-detail__card">
        <div className="digit-report-detail__header-wrap">
          <div className="digit-report-detail__header">
            <div className="digit-report-detail__header-with-tag">
              <HeaderComponent className="digit-report-detail__header-with-tag-header">{t(reportLabel)}</HeaderComponent>
              <Tag label={t(I18N_KEYS.PAGES.HCM_CONTAINS_PII)} showIcon={true} type="error" stroke={true} />
            </div>
            {/* <p className="digit-report-detail__subtitle">
              {t("HCM_REPORTS_GENERATED_BY_FREQUENCY")}
            </p> */}
          </div>
          <div className="digit-report-detail__custom-btn">
            <Button
              label={t(I18N_KEYS.PAGES.HCM_DOWNLOAD_CUSTOM_RANGE)}
              onClick={() => setShowCustomPopup(true)}
              variation="secondary"
              icon="CalendarMonth"
              icon="DownloadIcon"
              size="medium"
            />
          </div>
        </div>

        {totalReports === 0 && totalInProgress === 0 ? (
          <div
            className="digit-no-data-found"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SVG.NoResultsFoundIcon height={280} width={220} />
            <span style={{marginTop:"0.5rem"}}>
              {t(I18N_KEYS.PAGES.HCM_NO_REPORTS_GENERATED)}
            </span>
          </div>
        ) : (
          <AccordionList allowMultipleOpen={true}>
            {allFrequencies.map((frequency) => {
              const reports = reportsByFrequency[frequency] || [];
              const inProgress = inProgressByFrequency[frequency] || [];
              return (
                <Accordion
                  key={frequency}
                  title={
                  <div className="digit-accordion-titile-dashboard-wrap">
                    <div className="digit-accordion-titile-dashboard">{t(`HCM_REPORT_FREQUENCY_${frequency}_REPORTS`)}</div>
                    <Tag label={`${reports.length} ${reports.length === 1 ? t(I18N_KEYS.PAGES.HCM_REPORTS_COUNT_SINGLE) : t(I18N_KEYS.PAGES.HCM_REPORTS_COUNT)}`} stroke={true} type={"monochrome"}/>
                    {inProgress.length > 0 && (
                      <Tag label={`${inProgress.length} ${t(I18N_KEYS.PAGES.HCM_IN_PROGRESS)}`} type="warning" />
                    )}
                  </div>
                  }
                  isOpenInitially={allFrequencies.length === 1}
                  hideCardBorder={false}
                  hideCardBg={true}
                  hideBorderRadius={true}
                  customClassName={"digit-report-details-accordion"}
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
          onClose={handleClosePopup}
          onOverlayClick={handleClosePopup}
          heading={t(I18N_KEYS.PAGES.HCM_DOWNLOAD_CUSTOM_RANGE_POPUP)}
          description={t(I18N_KEYS.PAGES.HCM_DOWNLOAD_CUSTOM_RANGE_DESC)}
          className={"digit-report-detail__popup"}
          footerChildren={[
            <Button key="cancel" label={t(I18N_KEYS.PAGES.HCM_CANCEL)} onClick={handleClosePopup} variation="secondary" />,
            <Button
              key="trigger"
              label={t(I18N_KEYS.PAGES.HCM_GENERATE_REPORT)}
              onClick={handleGenerateReportClick}
              variation="primary"
              isDisabled={!customStartDate || !customEndDate || isTriggering || isCheckingExisting}
            />,
          ]}
          subHeading={t(I18N_KEYS.PAGES.HCM_CUSTOM_RANGE_DESC)}
        >
          <div className="digit-report-detail__custom-popup-field">
            <label>{t(I18N_KEYS.PAGES.HCM_CUSTOM_START_DATE)}</label>
            <FieldV1
              withoutLabel={true}
              type="date"
              value={customStartDate}
              populators={{ newDateFormat: true, min: campaignMinDate, max: campaignMaxDate, customClass: "custom-date-range" }}
              onChange={(d) => {
                setCustomStartDate(d);
                if (customEndDate && d > customEndDate) setCustomEndDate("");
              }}
            />
          </div>
          <div className="digit-report-detail__custom-popup-field">
            <label>{t(I18N_KEYS.PAGES.HCM_CUSTOM_END_DATE)}</label>
            <FieldV1
              withoutLabel={true}
              type="date"
              value={customEndDate}
              populators={{ newDateFormat: true, min: customStartDate || campaignMinDate, max: campaignMaxDate, customClass: "custom-date-range" }}
              onChange={(d) => setCustomEndDate(d)}
            />
          </div>
        </PopUp>
      )}

      {existingReportPopup && (
        <PopUp
          onClose={() => setExistingReportPopup(null)}
          onOverlayClick={() => setExistingReportPopup(null)}
          heading={
            existingReportPopup.variant === "exists"
              ? t(I18N_KEYS.PAGES.HCM_REPORT_ALREADY_EXISTS)
              : existingReportPopup.variant === "in_progress"
              ? t(I18N_KEYS.PAGES.HCM_REPORT_ALREADY_IN_PROGRESS)
              : t(I18N_KEYS.PAGES.HCM_REPORT_GENERATION_FAILED_TITLE)
          }
          className={"digit-report-detail__popup"}
          footerChildren={
            existingReportPopup.variant === "exists"
              ? [
                  <Button key="close" label={t(I18N_KEYS.PAGES.HCM_CLOSE)} onClick={() => setExistingReportPopup(null)} variation="secondary" />,
                  <Button
                    key="download"
                    label={t(I18N_KEYS.PAGES.HCM_DOWNLOAD_REPORT)}
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
                          label={t(I18N_KEYS.PAGES.HCM_GENERATE_NOW)}
                          onClick={handleGenerateReportClick}
                          variation="primary"
                          isDisabled={isTriggering || isCheckingExisting}
                        />,
                      ]
                    : []),
                ]
              : existingReportPopup.variant === "in_progress"
              ? [<Button key="close" label={t(I18N_KEYS.PAGES.HCM_CLOSE)} onClick={() => setExistingReportPopup(null)} variation="secondary" />]
              : [
                  <Button key="cancel" label={t(I18N_KEYS.PAGES.HCM_CANCEL)} onClick={() => setExistingReportPopup(null)} variation="secondary" />,
                  <Button
                    key="retry"
                    label={t(I18N_KEYS.PAGES.HCM_RETRY)}
                    onClick={triggerCustomReport}
                    variation="primary"
                    isDisabled={isTriggering}
                  />,
                ]
          }
          subHeading={
            existingReportPopup.variant === "exists"
              ? t(I18N_KEYS.PAGES.HCM_REPORT_ALREADY_EXISTS_DESC)
              : existingReportPopup.variant === "in_progress"
              ? t(I18N_KEYS.PAGES.HCM_REPORT_ALREADY_IN_PROGRESS_DESC)
              : t(I18N_KEYS.PAGES.HCM_REPORT_GENERATION_FAILED_DESC)
          }
        >
          {existingReportPopup.variant === "exists" && existingReportPopup.data?.retryBlocked && (
            <div className="digit-report-detail__file-info">{t(I18N_KEYS.PAGES.HCM_REPORT_RETRY_BLOCKED)}</div>
          )}
          {existingReportPopup.variant === "exists" && retryCountdown !== null && (
            <div className="digit-report-detail__file-info">
              {retryCountdown > 0 ? (
                <div>
                  {t(I18N_KEYS.PAGES.HCM_REPORT_RETRY_AVAILABLE_IN)}: {formatDuration(retryCountdown)}
                </div>
              ) : (
                <div>{t(I18N_KEYS.PAGES.HCM_REPORT_RETRY_AVAILABLE_NOW)}</div>
              )}
            </div>
          )}
          {existingReportPopup.variant === "in_progress" && (
            <div className="digit-report-detail__file-info">
              <div className="digit-report-detail__file-date">{t(getStageLabelKey(existingReportPopup.data.status))}</div>
              <div className="digit-report-detail__progress-bar">
                <div
                  className="digit-report-detail__progress-bar-fill"
                  style={{ width: `${existingReportPopup.data.progressPercent || 0}%` }}
                />
              </div>
            </div>
          )}
          {existingReportPopup.variant === "failed" && (
            <div className="digit-report-detail__file-info">
              {existingReportPopup.data.errormessage || t(I18N_KEYS.PAGES.HCM_REPORT_GENERATION_FAILED_DESC)}
            </div>
          )}
        </PopUp>
      )}

      {showToast && (
        <Toast
          type={showToast.key === "error" ? "error" : "success"}
          label={showToast.label}
          onClose={() => setShowToast(null)}
          style={{ zIndex: 10001 }}
        />
      )}
    </React.Fragment>
  );
};

export default ReportDetailPage;
