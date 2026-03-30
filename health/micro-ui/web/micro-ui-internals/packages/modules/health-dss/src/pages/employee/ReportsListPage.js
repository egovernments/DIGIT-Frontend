import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { Card, HeaderComponent, SVG } from "@egovernments/digit-ui-components";

const REPORT_TYPES = [
  { code: "household-registration", label: "HCM_REPORT_HOUSEHOLD_REGISTRATION", description: "HCM_REPORT_HOUSEHOLD_REGISTRATION_DESC" },
  { code: "suspected-anomalies", label: "HCM_REPORT_SUSPECTED_ANOMALIES", description: "HCM_REPORT_SUSPECTED_ANOMALIES_DESC" },
  { code: "duplicate-reports", label: "HCM_REPORT_DUPLICATE_REPORTS", description: "HCM_REPORT_DUPLICATE_REPORTS_DESC" },
  { code: "stock-transactions", label: "HCM_REPORT_STOCK_TRANSACTIONS", description: "HCM_REPORT_STOCK_TRANSACTIONS_DESC" },
  { code: "referrals", label: "HCM_REPORT_REFERRAL", description: "HCM_REPORT_REFERRAL_DESC" },
];

const ReportsListPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const campaignName = searchParams.get("campaignName");

  const handleReportClick = (reportCode) => {
    history.push(
      `/${window?.contextPath}/employee/dss/report-detail?campaignNumber=${campaignNumber}&campaignName=${encodeURIComponent(campaignName || "")}&reportType=${reportCode}`
    );
  };

  return (
    <Card>
      <HeaderComponent className="digit-reports-list__heading">{t("HCM_REPORTS")}</HeaderComponent>
      <p className="digit-reports-list__description">{t("HCM_REPORTS_SELECT_TYPE_DESC")}</p>

      <div className="digit-reports-list__cards">
        {REPORT_TYPES.map((report) => (
          <Card
            key={report.code}
            className="digit-reports-list__row-card"
            type="secondary"
            onClick={() => handleReportClick(report.code)}
          >
            <div className="digit-reports-list__row">
              <div className="digit-reports-list__row-icon">
                <SVG.Description height="24" width="24" fill={"#0B4B66"}/>
              </div>
              <div className="digit-reports-list__row-content">
                <div className="digit-reports-list__row-title">{t(report.label)}</div>
                <div className="digit-reports-list__row-desc">{t(report.description)}</div>
              </div>
              <div className="digit-reports-list__row-chevron">
                <SVG.ChevronRight height="20" width="20" fill={"#0B4B66"}/>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default ReportsListPage;
