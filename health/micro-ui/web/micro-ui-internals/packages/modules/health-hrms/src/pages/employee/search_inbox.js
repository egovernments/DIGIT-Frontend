import React, { useState } from "react";
import { InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import inboxSearchConfig from "../../components/config/inboxSearchConfig";
import { Toast, Loader, Header } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { QueryClient,QueryClientProvider } from "react-query";

const InboxSearch = () => {
  const { t } = useTranslation();
  const config = inboxSearchConfig();
  const isMobile = window.Digit.Utils.browser.isMobile();
  // const queryClient = new QueryClient({});

  return (
    // <QueryClientProvider client={queryClient}>
    <div style={{ marginBottom: "80px" }}>
    <div
      style={
        isMobile
          ? { marginLeft: "-12px", fontFamily: "calibri", color: "#FF0000" }
          : { marginLeft: "15px", fontFamily: "calibri", color: "#FF0000" }
      }
    >
      {<Header>{t("HR_HOME_SEARCH_RESULTS_HEADING")}</Header>}
    </div>
    <div className="inbox-search-wrapper">
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
    // </QueryClientProvider>
  );
};

export default InboxSearch;
