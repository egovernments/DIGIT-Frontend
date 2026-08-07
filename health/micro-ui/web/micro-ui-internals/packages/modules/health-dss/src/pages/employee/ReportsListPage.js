import React, { useMemo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Card, HeaderComponent, Loader } from "@egovernments/digit-ui-components";
import ReportDetailPage from "./ReportDetailPage";

const ReportsListPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const campaignName = searchParams.get("campaignName");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

  // Fetch campaign data to get projectType
  const { isLoading: isCampaignLoading, data: campaignData } = Digit.Hooks.DSS.useSearchCampaign({
    tenantId: tenantId,
    filter: {
      campaignNumber: campaignNumber,
      
    },
    config: {
      enabled: !!campaignNumber,
      select: (data) => data?.[0],
    },
  });

  useEffect(() => {
    if (campaignData) {
      Digit.SessionStorage.set("campaignSelected", campaignData);
    }
  }, [campaignData]);

  const projectType = campaignData?.projectType;

  // Fetch report types from MDMS
  const mdmsReqCriteria = {
    url: `/${mdms_context_path}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        schemaCode: "custom-reports.project-type-reports",
        isActive: true,
        limit: 1000,
        filters: {},
      },
    },
    config: {
      enabled: !!projectType,
      select: (data) => data?.mdms,
    },
  };

  const { isLoading: isMdmsLoading, data: mdmsData } = Digit.Hooks.useCustomAPIHook(mdmsReqCriteria);

  // Find the MDMS entry matching the current campaign's projectType
  const reportTypes = useMemo(() => {
    if (!mdmsData || !projectType) return [];
    const projectConfig = mdmsData.find((item) => item?.data?.projectType === projectType);
    const reportsVsFrequency = projectConfig?.data?.reportsVsFrequency || {};
    return Object.keys(reportsVsFrequency).map((key) => ({
      code: key,
      label: `HCM_${key.toUpperCase()}`,
      description: `HCM_${key.toUpperCase()}_DESC`,
    }));
  }, [mdmsData, projectType]);

  // One tab per report type (like L2Main.js's hand-rolled switch-tabs) - defaults to the
  // ?reportType= query param if present (keeps old report-detail?...&reportType=X links
  // landing on the right tab), else the first report type once MDMS data arrives.
  const [activeReportCode, setActiveReportCode] = useState(() => searchParams.get("reportType") || "");

  useEffect(() => {
    if (!activeReportCode && reportTypes.length > 0) {
      setActiveReportCode(reportTypes[0].code);
    }
  }, [reportTypes, activeReportCode]);

  if (isCampaignLoading || isMdmsLoading) return <Loader />;

  return (
    <React.Fragment>
      <Card>
        <HeaderComponent className="digit-reports-list__heading">{t("HCM_REPORTS")}</HeaderComponent>
        <p className="digit-reports-list__description">{t("HCM_REPORTS_SELECT_TYPE_DESC")}</p>

        {reportTypes.length > 0 && (
          <React.Fragment>
            <style>{`
              .digit-reports-list-type-tab {
                cursor: pointer;
                padding: 0.625rem 1.25rem;
                border-radius: 1.5rem;
                font-family: Roboto, sans-serif;
                font-size: 1rem;
                white-space: nowrap;
                border: 0.094rem solid transparent;
                transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
              }
              .digit-reports-list-type-tab.inactive {
                font-weight: 500 !important;
                color: #0B0C0C !important;
                background: #FFFFFF !important;
                border-width: 0.125rem !important;
                border-style: solid !important;
                border-color: #B1B4B6 !important;
                box-shadow: 0rem 0.063rem 0.125rem 0rem rgba(0, 0, 0, 0.1) !important;
              }
              .digit-reports-list-type-tab.inactive:hover {
                color: #C84C0E !important;
                border-color: #C84C0E !important;
                background: #FEEFE7 !important;
              }
              .digit-reports-list-type-tab.active {
                font-weight: 700;
                color: #FFFFFF;
                background: #C84C0E;
                border-color: #C84C0E;
                box-shadow: 0rem 0.125rem 0.375rem rgba(200, 76, 14, 0.35);
              }
              .digit-reports-list-type-tab.active:hover {
                background: #B0430C;
                border-color: #B0430C;
              }
            `}</style>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
                background: "#FAFAFA",
                border: "0.063rem solid #D6D5D4",
                borderRadius: "0.75rem",
                padding: "0.75rem",
                marginTop: "1.5rem",
              }}
            >
              {reportTypes.map((report) => {
                const isActive = activeReportCode === report.code;
                return (
                  <div
                    key={report.code}
                    className={`digit-reports-list-type-tab ${isActive ? "active" : "inactive"}`}
                    onClick={() => setActiveReportCode(report.code)}
                  >
                    {t(report.label)}
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        )}
      </Card>

      {activeReportCode && (
        <ReportDetailPage key={activeReportCode} reportType={activeReportCode} campaignNumber={campaignNumber} campaignName={campaignName} />
      )}
    </React.Fragment>
  );
};

export default ReportsListPage;
