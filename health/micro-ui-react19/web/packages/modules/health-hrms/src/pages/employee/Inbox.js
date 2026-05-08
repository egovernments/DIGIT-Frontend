import { useState } from "react";
import { useTranslation } from "react-i18next";
import { InboxSearchComposer, HeaderComponent, Loader } from "@egovernments/digit-ui-components";
import inboxSearchConfig from "../../components/config/inboxSearchConfig";

const InboxSearch = () => {
  const { t } = useTranslation();
  const isMobile = window.Digit.Utils.browser.isMobile();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const { data: mdmsData, isLoading } = Digit.Hooks.useCommonMDMS(Digit.ULBService.getStateId(), "egov-hrms", ["InboxConfig"], {
    select: (data) => data?.["egov-hrms"]?.InboxConfig?.[0],
    retry: false,
    enable: false,
  });

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100%" }}>
        <Loader />
      </div>
    );
  }

  const config = inboxSearchConfig(tenantId);

  return (
    <div style={{ marginBottom: "80px" }}>
      <div style={isMobile ? { marginLeft: "-12px" } : { marginLeft: "15px" }}>
        <HeaderComponent className="digit-inbox-search-composer-header" styles={{ marginBottom: "1.5rem" }}>
          {t("HR_HOME_SEARCH_RESULTS_HEADING")}
        </HeaderComponent>
      </div>
      <div className="digit-inbox-search-wrapper">
        <InboxSearchComposer configs={config} />
      </div>
    </div>
  );
};

export default InboxSearch;
