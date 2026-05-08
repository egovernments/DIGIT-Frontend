import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { InboxSearchComposer, HeaderComponent, Loader } from "@egovernments/digit-ui-components";
import { AssignCampaignInboxConfig } from "../../components/config/assignCampaignConfig";

const AssignCampaignInbox = () => {
  const { t } = useTranslation();
  const isMobile = window.Digit.Utils.browser.isMobile();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { id } = useParams();

  const { isLoading: isHRMSSearchLoading, data: hrmsData } = Digit.Hooks.hrms.useHRMSSearch({ codes: id }, tenantId);
  const { data: mdmsData, isLoading } = Digit.Hooks.useCommonMDMS(tenantId, "egov-hrms", ["AssignCampaignInboxConfig"], {
    select: (data) => data?.["egov-hrms"]?.AssignCampaignInboxConfig?.[0],
    retry: false,
    enable: false,
  });

  const jurisdictions = useMemo(() => hrmsData?.Employees?.[0]?.jurisdictions || [], [hrmsData]);

  const configFromMDMS = useMemo(() => {
    return JSON.parse(JSON.stringify(mdmsData ? mdmsData : AssignCampaignInboxConfig(tenantId)?.AssignCampaignInboxConfig?.[0] || {}));
  }, [mdmsData]);

  const updatedConfig = useMemo(() => {
    const jurisdictionOptions = jurisdictions.map((j) => ({
      code: j.boundary,
      i18nKey: `${j.boundary?.toUpperCase()}`,
    }));

    if (jurisdictions.length && configFromMDMS?.apiDetails?.requestBody) {
      configFromMDMS.apiDetails.requestBody.Projects = jurisdictions.map((jurisdiction) => ({
        tenantId: jurisdiction.tenantId || tenantId,
        address: { boundary: jurisdiction.boundary },
      }));
      configFromMDMS.apiDetails.requestBody.jurisdictionProjects = jurisdictions.map((jurisdiction) => ({
        tenantId: jurisdiction.tenantId || tenantId,
        address: { boundary: jurisdiction.boundary },
      }));
    }

    return Digit.Utils.preProcessMDMSConfigInboxSearch(t, configFromMDMS, "sections.search.uiConfig.fields", {
      updateDependent: [{ key: "boundary", value: jurisdictionOptions }],
    });
  }, [jurisdictions, configFromMDMS, t]);

  if (isLoading || isHRMSSearchLoading) return <Loader />;

  return (
    <div style={{ marginBottom: "80px" }}>
      <div style={isMobile ? { marginLeft: "-12px" } : { marginLeft: "15px" }}>
        <HeaderComponent className="digit-inbox-search-composer-header" styles={{ marginBottom: "1.5rem" }}>
          {t("HR_HOME_SEARCH_CAMPAIGNS_HEADING")}
        </HeaderComponent>
      </div>
      <div className="digit-inbox-search-wrapper">
        <InboxSearchComposer configs={updatedConfig} />
      </div>
    </div>
  );
};

export default AssignCampaignInbox;
