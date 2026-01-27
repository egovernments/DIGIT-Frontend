import React from "react";
import { useTranslation } from "react-i18next";
import { InboxSearchComposer } from "@egovernments/digit-ui-components";
import { InboxConfig } from "../../configs/employee/InboxConfig";

const Inbox = () => {
    const { t } = useTranslation();

    return (
        <div className="digit-inbox-search-wrapper">
            <InboxSearchComposer configs={InboxConfig}></InboxSearchComposer>
        </div>
    );
};

export default Inbox;
