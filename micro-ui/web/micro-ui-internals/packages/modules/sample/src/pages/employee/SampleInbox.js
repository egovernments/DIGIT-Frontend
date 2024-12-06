import React,{useState,useEffect,useMemo} from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import {inboxConfig} from "../../configs/SampleInboxConfig";
import { useLocation } from 'react-router-dom';
import complaintSearchConfig from "../../configs/ComplaintSearchConfig";

const Inbox = () => {
    const { t } = useTranslation();
    const config = complaintSearchConfig();
    return (
        <React.Fragment>
        <div>
            <Header>{t("COMPLAINT INBOX")}</Header>
        </div>
        <div className="inbox-search-wrapper">
            <InboxSearchComposer configs = {config}></InboxSearchComposer>
        </div>
        </React.Fragment>
    )
}

export default Inbox;