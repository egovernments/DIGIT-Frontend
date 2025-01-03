import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import CustomBillInbox from "../../components/BillInbox";

const BillInbox = () => {

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
                <CustomBillInbox></CustomBillInbox>
            </div>
        </React.Fragment>
    );
};

export default BillInbox;
