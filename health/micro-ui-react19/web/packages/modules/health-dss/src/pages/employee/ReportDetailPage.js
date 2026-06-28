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
  const [showToast, setShowToast] = useState(null);

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
            return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
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

        {totalReports === 0 ? (
          <NoResultsFound text={t("HCM_NO_REPORTS_GENERATED")} />
        ) : (
          <AccordionList allowMultipleOpen={true}>
            {Object.entries(reportsByFrequency).map(([frequency, reports]) => (
              <Accordion
                key={frequency}
                title={`${t(`HCM_REPORT_FREQUENCY_${frequency}`)} : ${reports.length} ${t("HCM_REPORTS_COUNT")}`}
                icon="Calender"
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
          onClose={() => setShowCustomPopup(false)}
          onOverlayClick={() => setShowCustomPopup(false)}
          heading={t("HCM_DOWNLOAD_CUSTOM_RANGE_POPUP")}
          description={t("HCM_DOWNLOAD_CUSTOM_RANGE_DESC")}
          className={"digit-report-detail__popup"}
          footerChildren={[
            <Button key="cancel" label={t("HCM_CANCEL")} onClick={() => setShowCustomPopup(false)} variation="secondary" />,
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
              populators={{ newDateFormat: true, customClass: "custom-date-range" }}
              onChange={(d) => setCustomStartDate(d)}
            />
          </div>
          <div className="digit-report-detail__custom-popup-field">
            <label>{t("HCM_CUSTOM_END_DATE")}</label>
            <FieldV1
              withoutLabel={true}
              type="date"
              value={customEndDate}
              populators={{ newDateFormat: true, min: customStartDate, customClass: "custom-date-range" }}
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
