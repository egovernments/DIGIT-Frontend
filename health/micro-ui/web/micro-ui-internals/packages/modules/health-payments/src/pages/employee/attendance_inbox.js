import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

import { useMyContext } from "../../utils/context";
import { AttendanceInboxConfig } from "../../configs/attendance_inbox_config";

const AttendanceInbox = () => {
    const { dispatch, state } = useMyContext();
    const { t } = useTranslation();
    const location = useLocation()
   // const moduleName = Digit?.Utils?.getConfigModuleName() || "commonSanitationUiConfig"
    const tenant = Digit.ULBService.getStateId();
const configs = AttendanceInboxConfig();
   


    return (
        <React.Fragment>
            <Header styles={{ fontSize: "32px" }}>{t(200)}</Header> 
            <div className="inbox-search-wrapper">
                <InboxSearchComposer
                configs={configs}
                >

                </InboxSearchComposer>
                {/*<div>Attendance Inbox</div>*/}
            </div>
        </React.Fragment>
    )
}

export default AttendanceInbox;