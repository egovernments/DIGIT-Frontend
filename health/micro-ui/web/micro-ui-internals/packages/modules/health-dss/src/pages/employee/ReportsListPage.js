import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { Card, HeaderComponent, SVG, Loader } from "@egovernments/digit-ui-components";

const ReportsListPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
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

  const handleReportClick = (reportCode) => {
    history.push(
      `/${window?.contextPath}/employee/dss/report-detail?campaignNumber=${campaignNumber}&campaignName=${encodeURIComponent(campaignName || "")}&reportType=${reportCode}`
    );
  };

  if (isCampaignLoading || isMdmsLoading) return <Loader />;

  return (
    <Card>
      <HeaderComponent className="digit-reports-list__heading">{t("HCM_REPORTS")}</HeaderComponent>
      <p className="digit-reports-list__description">{t("HCM_REPORTS_SELECT_TYPE_DESC")}</p>

      <div className="digit-reports-list__cards">
        {reportTypes.map((report) => (
          <Card
            key={report.code}
            className="digit-reports-list__row-card"
            type="secondary"
            onClick={() => handleReportClick(report.code)}
          >
            <div className="digit-reports-list__row">
              <div className="digit-reports-list__row-icon">
                <SVG.Description height="24" width="24" fill={"#0B4B66"} />
              </div>
              <div className="digit-reports-list__row-content">
                <div className="digit-reports-list__row-title">{t(report.label)}</div>
                <div className="digit-reports-list__row-desc">{t(report.description)}</div>
              </div>
              <div className="digit-reports-list__row-chevron">
                <SVG.ChevronRight height="20" width="20" fill={"#0B4B66"} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default ReportsListPage;
