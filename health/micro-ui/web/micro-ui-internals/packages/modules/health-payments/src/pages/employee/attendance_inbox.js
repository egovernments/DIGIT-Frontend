import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import CustomInboxSearchComposer from "../../components/custom_inbox_composer";

const AttendanceInbox = () => {

  const { t } = useTranslation();
  const location = useLocation();

  return (
    <React.Fragment>
      <Header styles={{ fontSize: "32px" }}>
        {t("HCM_AM_ATTENDANCE_INBOX")}
        {location?.state?.count ? <span className="inbox-count">{location?.state?.count}</span> : null}
      </Header>
      <div className="inbox-search-wrapper">
        {/* <InboxSearchComposer configs={configs}></InboxSearchComposer>*/}
        <CustomInboxSearchComposer></CustomInboxSearchComposer>
      </div>
    </React.Fragment>
  );
};

export default AttendanceInbox;
