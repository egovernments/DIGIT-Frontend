import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Card, HeaderComponent, Button, Tag, CheckBox, SVG, Accordion, AccordionList, Loader } from "@egovernments/digit-ui-components";

const FrequencyContent = ({ reports, t }) => {
  const [maskPII, setMaskPII] = React.useState({});

  const handleDownload = (report) => {
    console.info("Download report:", report.fileStoreId, "maskPII:", !!maskPII[report.id]);
  };

  return (
    <div className="digit-report-detail__files-list">
      {reports.map((report) => (
        <Card key={report.id} type="secondary" className="digit-report-detail__file-card">
          <div className="digit-report-detail__file-row">
            <div className="digit-report-detail__file-info">
              <div className="digit-report-detail__file-date">{report.dateLabel}</div>
              <div className="digit-report-detail__file-size">{report.triggerTime}</div>
            </div>
            <div className="digit-report-detail__file-actions">
              <CheckBox
                label={t("HCM_MASK_PII_DATA")}
                checked={!!maskPII[report.id]}
                onChange={() => setMaskPII((prev) => ({ ...prev, [report.id]: !prev[report.id] }))}
              />
              <Button
                label={t("HCM_DOWNLOAD")}
                onClick={() => handleDownload(report)}
                variation="link"
                icon="FileDownload"
                size="medium"
              />
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
  const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

  // Fetch report configs filtered by campaignIdentifier and reportName
  const mdmsReqCriteria = {
    url: `/${mdms_context_path}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        schemaCode: "airflow-configs.campaign-report-config",
        isActive: true,
        limit: 1000,
        filters: {
          campaignIdentifier: campaignNumber,
          reportName: reportType,
        },
      },
    },
    config: {
      enabled: !!campaignNumber && !!reportType,
      select: (data) => data?.mdms,
    },
  };

  const { isLoading, data: reportConfigs } = Digit.Hooks.useCustomAPIHook(mdmsReqCriteria);

  // Group by triggerFrequency
  const reportsByFrequency = useMemo(() => {
    if (!reportConfigs) return {};

    const filtered = reportConfigs;

    const grouped = {};
    filtered.forEach((item) => {
      const freq = item?.data?.triggerFrequency;
      if (!freq) return;
      if (!grouped[freq]) grouped[freq] = [];
      grouped[freq].push({
        id: item.id,
        dateLabel: `${item?.data?.campaignStartDate} — ${item?.data?.campaignEndDate}`,
        triggerTime: `${t("HCM_TRIGGER_TIME")}: ${item?.data?.triggerTime}`,
        reportStartTime: item?.data?.reportStartTime,
        reportEndTime: item?.data?.reportEndTime,
        fileStoreId: item.id,
        rawData: item?.data,
      });
    });

    return grouped;
  }, [reportConfigs, campaignNumber, reportType]);

  const reportLabel = `HCM_${reportType?.toUpperCase()}`;
  const totalConfigs = Object.values(reportsByFrequency).flat().length;

  if (isLoading) return <Loader />;

  return (
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
      </div>

      {totalConfigs === 0 ? (
        <p>{t("HCM_NO_REPORT_CONFIGS_FOUND")}</p>
      ) : (
        <AccordionList allowMultipleOpen={true}>
          {Object.entries(reportsByFrequency).map(([frequency, reports]) => (
            <Accordion
              key={frequency}
              title={`${t(`HCM_REPORT_FREQUENCY_${frequency}`)}  ${reports.length} ${t("HCM_REPORTS_COUNT")}`}
              icon="CalendarMonth"
              isOpenInitially={false}
              hideCardBorder={false}
              hideCardBg={true}
              hideBorderRadius={true}
            >
              <FrequencyContent reports={reports} t={t} />
            </Accordion>
          ))}
        </AccordionList>
      )}
    </Card>
  );
};

export default ReportDetailPage;
