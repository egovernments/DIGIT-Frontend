import React, { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, HeaderComponent, SVG, Loader, Button } from "@egovernments/digit-ui-components";
import { I18N_KEYS } from "../../utils/i18nKeyConstants";

const ReportsListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const campaignName = searchParams.get("campaignName");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

  const { isLoading: isCampaignLoading, data: campaignData } = Digit.Hooks.DSS.useSearchCampaign({
    tenantId: tenantId,
    filter: { campaignNumber: campaignNumber },
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
    navigate(
      `/${window?.contextPath}/employee/dss/report-detail?campaignNumber=${campaignNumber}&campaignName=${encodeURIComponent(campaignName || "")}&reportType=${reportCode}`
    );
  };

  if (isCampaignLoading || isMdmsLoading)
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <Loader className="digit-center-loader" />
      </div>
    );

  return (
    <Card className="digit-reports-list__cards_main">
      <HeaderComponent className="digit-reports-list__heading">{t(I18N_KEYS.PAGES.HCM_REPORTS)}</HeaderComponent>
      <p className="digit-reports-list__description">{t(I18N_KEYS.PAGES.HCM_REPORTS_SELECT_TYPE_DESC)}</p>

      <div className="digit-reports-list__cards">
        {reportTypes.map((report) => (
          <Card key={report.code} className="digit-reports-list__row-card" type="secondary" onClick={() => handleReportClick(report.code)}>
            <div className="digit-reports-list__row">
              <div className="digit-reports-list__row-icon">
                <SVG.Description height="24" width="24" fill={"#C84C0E"} />
              </div>
              <div className="digit-reports-list__row-content">
                <div className="digit-reports-list__row-title">{t(report.label)}</div>
                <div className="digit-reports-list__row-desc">{t(report.description)}</div>
              </div>
              <Button label={t(I18N_KEYS.PAGES.HCM_VIEW_REPORTS)} variation="secondary" size="medium" />
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default ReportsListPage;
