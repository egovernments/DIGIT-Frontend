import React, { useState } from "react";
import { InboxSearchComposer, HeaderComponent, Toast, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import inboxAttendeeSearchConfig from "../../config/AttendeeInboxConfig";
// import {  InboxSearchComposer } from "@egovernments/digit-ui-react-components";

const InboxAttendeesSearch = () => {
  const { t } = useTranslation();
  const { boundaryCode } = Digit.Hooks.useQueryParams();

  //   const isMobile = window.Digit.Utils.browser.isMobile();
  //   const tenantId = Digit.ULBService.getCurrentTenantId();

  // //   const { data: mdmsData, isLoading } = Digit.Hooks.useCommonMDMS(Digit.ULBService.getStateId(), "egov-hrms", ["InboxConfig"], {
  // //     select: (data) => {
  // //       return data?.["egov-hrms"]?.InboxConfig?.[0];
  // //     },
  // //     retry: false,
  // //     enable: false,
  // //   });

  // //   if (isLoading) {
  // //     return <Loader />;
  // //   }


  //   // const config = mdmsData ? mdmsData : inboxSearchConfig(); [TODO: Use this once MDMS is updated with the new config]



  const config = inboxAttendeeSearchConfig(boundaryCode);

  return (
    <div style={{ marginBottom: "80px" }}>
      
      <div className="digit-inbox-search-wrapper">
        {<InboxSearchComposer
          configs={config}
        //   browserSession={SelectCampaignSession}
        //   additionalConfig={{
        //     resultsTable: {
        //       onClickRow,
        //     },
        //   }}
        />}

      </div>
    </div>
  );
};

export default InboxAttendeesSearch;
