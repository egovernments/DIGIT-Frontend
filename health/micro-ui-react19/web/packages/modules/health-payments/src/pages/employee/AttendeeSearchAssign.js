import React, { useState } from "react";
import { InboxSearchComposer } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import inboxAttendeeSearchConfig from "../../config/AttendeeInboxConfig";

/**
 * Component: InboxAttendeesSearch
 * Description:
 * This component renders the attendee search section inside the Inbox module.
 * It uses the Digit UI `InboxSearchComposer` to dynamically build a search form
 * based on the configuration returned by `inboxAttendeeSearchConfig`.
 */

const InboxAttendeesSearch = () => {
  const { t } = useTranslation();

  // Extracting boundaryCode from the URL query parameters using Digit's hook
  const { boundaryCode } = Digit.Hooks.useQueryParams();

  const config = inboxAttendeeSearchConfig(boundaryCode);


  /**
          * InboxSearchComposer:
          * - Automatically generates a search form and result list
          *   based on the provided configuration.
          * - `configs` contains all search fields and behavior rules.
          */
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
