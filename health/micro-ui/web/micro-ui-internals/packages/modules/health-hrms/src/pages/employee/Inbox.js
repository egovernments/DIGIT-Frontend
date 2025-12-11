import React, { useState } from "react";
import { InboxSearchComposer, HeaderComponent, Toast, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import inboxSearchConfig from "../../components/config/inboxSearchConfig";

const InboxSearch = () => {
  const { t } = useTranslation();

  const isMobile = window.Digit.Utils.browser.isMobile();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const { data: mdmsData, isLoading } = Digit.Hooks.useCommonMDMS(Digit.ULBService.getStateId(), "egov-hrms", ["InboxConfig"], {
    select: (data) => {
      return data?.["egov-hrms"]?.InboxConfig?.[0];
    },
    retry: false,
    enable: false,
  });

  if (isLoading) {
    return <div
      style={{
        display: "flex",
        justifyContent: "center",  // horizontal center
        alignItems: "center",      // vertical center
        height: "100vh",           // take full viewport height
        width: "100%",             // full width
      }}
    >
      {<Loader />}
    </div>;
  }


  // const config = mdmsData ? mdmsData : inboxSearchConfig(); [TODO: Use this once MDMS is updated with the new config]
  const config = inboxSearchConfig(tenantId);

  return (
    <div style={{ marginBottom: "80px" }}>
      <div
        style={
          isMobile
            ? { marginLeft: "-12px", fontFamily: "calibri", color: "#FF0000" }
            : { marginLeft: "15px", fontFamily: "calibri", color: "#FF0000" }
        }
      >
        {
          <HeaderComponent className="digit-inbox-search-composer-header" styles={{ marginBottom: "1.5rem" }}>
            {t("HR_HOME_SEARCH_RESULTS_HEADING")}
          </HeaderComponent>
        }
      </div>
      <div className="digit-inbox-search-wrapper">
        <InboxSearchComposer
          configs={config}
        //   browserSession={SelectCampaignSession}
        //   additionalConfig={{
        //     resultsTable: {
        //       onClickRow,
        //     },
        //   }}
        />
      </div>
    </div>
  );
};

export default InboxSearch;
