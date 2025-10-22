import React, { useState } from "react";
import { InboxSearchComposer } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import inboxAttendeeSearchConfig from "../../config/AttendeeInboxConfig";


const InboxAttendeesSearch = () => {
  const { t } = useTranslation();
  const { boundaryCode } = Digit.Hooks.useQueryParams();

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
