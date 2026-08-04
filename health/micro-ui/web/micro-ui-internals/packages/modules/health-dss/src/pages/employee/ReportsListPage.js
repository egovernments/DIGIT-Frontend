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
          <div className="digit-dss-switch-tabs-progressbar-wrapper">
            <div className="digit-dss-switch-tabs" style={{ width: "100%" }}>
              <div className="digit-dss-switch-tab-wrapper">
                {reportTypes.map((report) => (
                  <div
                    key={report.code}
                    className={activeReportCode === report.code ? "digit-dss-switch-tab-selected" : "digit-dss-switch-tab-unselected"}
                    onClick={() => setActiveReportCode(report.code)}
                  >
                    {t(report.label)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      {activeReportCode && (
        <ReportDetailPage key={activeReportCode} reportType={activeReportCode} campaignNumber={campaignNumber} campaignName={campaignName} />
      )}
    </React.Fragment>
  );
};

export default ReportsListPage;
