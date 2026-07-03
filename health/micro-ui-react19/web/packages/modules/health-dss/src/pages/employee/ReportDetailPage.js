import React, { useMemo, useState, useEffect } from "react";
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
} from "@egovernments/digit-ui-components";
import axios from "axios";

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

const formatDateForPayload = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy} 00:00:00+0530`;
};

const FrequencyContent = ({ reports, t, reportType }) => {
  const handleDownload = (report) => {
    downloadFileFromStore({
      fileStoreId: report.filestoreid,
      customName: `${reportType}_${report.dateLabel}`,
    });
  };

  return (
    <div className="digit-report-detail__files-list">
      {reports.map((report) => (
        <Card key={report.id} type="secondary" className="digit-report-detail__file-card">
          <div className="digit-report-detail__file-row">
            <div className="digit-report-detail__file-info">
              <div className="digit-report-detail__file-date">{report.dateLabel}</div>
            </div>
            <div className="digit-report-detail__file-actions">
              <Button label={t("HCM_DOWNLOAD_REPORT")} onClick={() => handleDownload(report)} variation="link" icon="FileDownload" size="medium" />
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
  const [showToast, setShowToast] = useState(null);

  const campaignSelected = Digit.SessionStorage.get("campaignSelected");
  const epochToDateStr = (epoch) => {
    if (!epoch) return "";
    const d = new Date(epoch);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const campaignMinDate = epochToDateStr(campaignSelected?.startDate);
  const campaignMaxDate = epochToDateStr(campaignSelected?.endDate);

  const handleClosePopup = () => {
    setShowCustomPopup(false);
    setCustomStartDate("");
    setCustomEndDate("");
  };

  const handleTriggerCustomReport = async () => {
    if (!customStartDate || !customEndDate) {
      setShowToast({ key: "error", label: t("HCM_CUSTOM_DATE_REQUIRED") });
      return;
    }
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
      setCustomStartDate("");
      setCustomEndDate("");
      setShowToast({ key: "success", label: t("HCM_CUSTOM_REPORT_TRIGGERED") });
    } catch (error) {
      console.error("Error triggering custom report:", error);
      setShowToast({ key: "error", label: t("HCM_CUSTOM_REPORT_TRIGGER_FAILED") });
    } finally {
      setIsTriggering(false);
    }
  };

  useEffect(() => {
    if (!campaignNumber || !reportType) return;
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const response = await Digit.CustomService.getResponse({
          url: `/airflow-trigger-api/api/reports-metadata`,
          body: {
            tenantId: tenantId,
            reportName: reportType,
            campaignIdentifier: campaignNumber,
          },
        });
        setReportsMetadata(response);
      } catch (error) {
        console.error("Error fetching reports metadata:", error);
        setReportsMetadata(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, [campaignNumber, reportType, tenantId]);

  const reportsByFrequency = useMemo(() => {
    const reports = reportsMetadata?.data || [];
    if (!reports.length) return {};

    const grouped = {};
    reports.forEach((item) => {
      const freq = item?.triggerfrequency || "DAILY";
      if (!grouped[freq]) grouped[freq] = [];

      let dateLabel = formatCreatedTime(item?.createdtime);
      if (freq === "CUSTOM" && item?.reportrange) {
        const parts = item.reportrange.split("_");
        if (parts.length === 2) {
          const formatRangeDate = (dateStr) => {
            const trimmed = dateStr?.trim();
            if (!trimmed) return "";
            const isoStr = trimmed.replace(" ", "T").replace(/([+-])(\d{2})(\d{2})$/, "$1$2:$3");
            const d = new Date(isoStr);
            if (isNaN(d.getTime())) return trimmed;
            return toOrdinalDate(d);
          };
          dateLabel = `${formatRangeDate(parts[0])} — ${formatRangeDate(parts[1])}`;
        }
      }

      grouped[freq].push({
        id: item?.id,
        dateLabel: dateLabel,
        filestoreid: item?.filestoreid,
      });
    });

    Object.keys(grouped).forEach((freq) => {
      grouped[freq].sort((a, b) => b.id - a.id);
    });

    return grouped;
  }, [reportsMetadata]);

  const reportLabel = `HCM_${reportType?.toUpperCase()}`;
  const totalReports = Object.values(reportsByFrequency).flat().length;

  if (isLoading) return <Loader />;

  return (
    <React.Fragment>
      <Card className="digit-report-detail__card">
        <div className="digit-report-detail__header-wrap">
          <div className="digit-report-detail__header">
            <div className="digit-report-detail__header-with-tag">
              <HeaderComponent className="digit-report-detail__header-with-tag-header">{t(reportLabel)}</HeaderComponent>
              <Tag label={t("HCM_CONTAINS_PII")} showIcon={true} type="error" stroke={true} />
            </div>
            {/* <p className="digit-report-detail__subtitle">
              {t("HCM_REPORTS_GENERATED_BY_FREQUENCY")}
            </p> */}
          </div>
          <div className="digit-report-detail__custom-btn">
            <Button
              label={t("HCM_DOWNLOAD_CUSTOM_RANGE")}
              onClick={() => setShowCustomPopup(true)}
              variation="secondary"
              icon="CalendarMonth"
              icon="DownloadIcon"
              size="medium"
            />
          </div>
        </div>

        {totalReports === 0 ? (
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
              {t("HCM_NO_REPORTS_GENERATED")}
            </span>
          </div>
        ) : (
          <AccordionList allowMultipleOpen={true}>
            {Object.entries(reportsByFrequency).map(([frequency, reports]) => (
              <Accordion
                key={frequency}
                title={
                <div className="digit-accordion-titile-dashboard-wrap">
                  <div className="digit-accordion-titile-dashboard">{t(`HCM_REPORT_FREQUENCY_${frequency}`)}</div>
                  <Tag label={`${reports.length} ${t("HCM_REPORTS_COUNT")}`} stroke={true} type={"monochrome"}/>
                </div>
                }
                isOpenInitially={false}
                hideCardBorder={false}
                hideCardBg={true}
                hideBorderRadius={true}
                customClassName={"digit-report-details-accordion"}
              >
                <FrequencyContent reports={reports} t={t} reportType={reportType} />
              </Accordion>
            ))}
          </AccordionList>
        )}
      </Card>

      {showCustomPopup && (
        <PopUp
          onClose={handleClosePopup}
          onOverlayClick={handleClosePopup}
          heading={t("HCM_DOWNLOAD_CUSTOM_RANGE_POPUP")}
          description={t("HCM_DOWNLOAD_CUSTOM_RANGE_DESC")}
          className={"digit-report-detail__popup"}
          footerChildren={[
            <Button key="cancel" label={t("HCM_CANCEL")} onClick={handleClosePopup} variation="secondary" />,
            <Button
              key="trigger"
              label={t("HCM_GENERATE_REPORT")}
              onClick={handleTriggerCustomReport}
              variation="primary"
              isDisabled={!customStartDate || !customEndDate || isTriggering}
            />,
          ]}
          subHeading={t("HCM_CUSTOM_RANGE_DESC")}
        >
          <div className="digit-report-detail__custom-popup-field">
            <label>{t("HCM_CUSTOM_START_DATE")}</label>
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
            <label>{t("HCM_CUSTOM_END_DATE")}</label>
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
