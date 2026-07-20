import React, { useState, useMemo } from "react";
import { InboxSearchComposer, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import inboxAttendeeSearchConfig from "../../config/AttendeeInboxConfig";
import { useMyContext } from "../../utils/context";

/**
 * Component: InboxAttendeesSearch
 * Description:
 * This component renders the attendee search section inside the Inbox module.
 * It uses the Digit UI `InboxSearchComposer` to dynamically build a search form
 * based on the configuration returned by `inboxAttendeeSearchConfig`.
 */

const InboxAttendeesSearch = () => {
  const { t } = useTranslation();
  const { hierarchyType } = useMyContext();
  const stateCode = Digit.ULBService.getStateId();
  const language = Digit.StoreData.getCurrentLanguage();
  const boundaryModuleCode = useMemo(
    () => (hierarchyType ? [`boundary-${hierarchyType}`] : []),
    [hierarchyType]
  );
  const { isLoading: isBoundaryLocLoading } = Digit.Services.useStore({
    stateCode,
    moduleCode: boundaryModuleCode,
    language,
    modulePrefix: "hcm",
    enabled: boundaryModuleCode.length > 0,
  });

  // Extracting boundaryCode from the URL query parameters using Digit's hook
  const { boundaryCode } = Digit.Hooks.useQueryParams();

  const config = inboxAttendeeSearchConfig(boundaryCode);


  if (isBoundaryLocLoading) {
    return <Loader variant={"PageLoader"} className={"digit-center-loader"} />;
  }

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
