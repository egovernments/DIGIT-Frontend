import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Card, HeaderComponent, Button, Tag, CheckBox, SVG, Accordion, AccordionList } from "@egovernments/digit-ui-components";

// Dummy data — will be replaced with API calls
const generateDummyReports = () => {
  const today = new Date();
  const makeReports = (count, offsetDays) =>
    Array.from({ length: count }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i * offsetDays);
      return {
        id: `${offsetDays}-${i}`,
        date: date.toISOString(),
        dateLabel: date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
        size: `${Math.floor(Math.random() * 500 + 100)} KB`,
        fileStoreId: `file-${offsetDays}-${i}`,
      };
    });

  return {
    DAILY: makeReports(7, 1),
    WEEKLY: makeReports(4, 7),
    MONTHLY: makeReports(6, 30),
  };
};

const REPORT_LABELS = {
  "household-registration": "HCM_REPORT_HOUSEHOLD_REGISTRATION",
  "suspected-anomalies": "HCM_REPORT_SUSPECTED_ANOMALIES",
  "duplicate-reports": "HCM_REPORT_DUPLICATE_REPORTS",
  "stock-transactions": "HCM_REPORT_STOCK_TRANSACTIONS",
  "referrals": "HCM_REPORT_REFERRAL",
};

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
              <div className="digit-report-detail__file-size">{report.size}</div>
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
  const reportType = searchParams.get("reportType");

  const reportLabel = REPORT_LABELS[reportType] || reportType;
  const reportsByFrequency = useMemo(() => generateDummyReports(), [reportType]);

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
    </Card>
  );
};

export default ReportDetailPage;
