import React, { useState } from "react";
  //import { InboxSearchComposer } from "@egovernments/digit-ui-react-components";
//import inboxSearchConfig from "../../components/config/inboxSearchConfig";
import { InboxSearchComposer, HeaderComponent, Toast, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider } from "react-query";
import inboxSearchConfig from "../../components/config/inboxSearchConfig";

const InboxSearch = () => {
  const { t } = useTranslation();
  const config = inboxSearchConfig();
  const isMobile = window.Digit.Utils.browser.isMobile();
  // const queryClient = new QueryClient({});

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
