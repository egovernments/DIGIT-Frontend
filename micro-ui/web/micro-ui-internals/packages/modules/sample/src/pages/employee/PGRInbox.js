import React,{useState,useEffect,useMemo} from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import pgrInboxConfig from "../../configs/PgrInboxConfig";
import { useLocation } from 'react-router-dom';

const PGRInbox = () => {
    const { t } = useTranslation();
    const location = useLocation()


   

    const config = pgrInboxConfig();

    return (
        <React.Fragment>
            {/* <Header styles={{ fontSize: "32px" }}>{t(updatedConfig?.label)}{location?.state?.count ? <span className="inbox-count">{location?.state?.count}</span> : null}</Header> */}
            <div className="inbox-search-wrapper">
                <InboxSearchComposer configs={config}></InboxSearchComposer>
            </div>
        </React.Fragment>
    )
}

export default PGRInbox;