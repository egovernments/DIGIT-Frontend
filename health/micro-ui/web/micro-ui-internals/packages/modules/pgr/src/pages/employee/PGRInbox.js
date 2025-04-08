import React, { useState } from "react";
import { InboxSearchComposer, HeaderComponent, Toast, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import PGRSearchInboxConfig from "../../configs/PGRSearchInboxConfig";

const PGRSearchInbox = () => {
  const { t } = useTranslation();

  const isMobile = window.Digit.Utils.browser.isMobile();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const { data: mdmsData, isLoading } = Digit.Hooks.useCommonMDMS(Digit.ULBService.getStateId(), "RAINMAKER-PGR", ["SearchInboxConfig"], {
    select: (data) => {
      return data?.["RAINMAKER-PGR"]?.SearchInboxConfig?.[0];
    },
    retry: false,
    enable: false,
  });

  if (isLoading) {
    return <Loader />;
  }
  const config = mdmsData ? mdmsData : PGRSearchInboxConfig();

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

export default PGRSearchInbox;