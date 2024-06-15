import { InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import { Header} from "@egovernments/digit-ui-react-components";
import React, { useTransition } from "react";
import { useTranslation } from "react-i18next";
import AllocationSearchConfig from "../../configs/AllocationSearchConfig";
const OrganizationInbox = () => {
    const { t } = useTranslation();
    const config = AllocationSearchConfig();
    return (
        <React.Fragment>
        <div>
            <Header>{t("ORGANIZATION SEARCH")}</Header>
        </div>
        <div className="inbox-search-wrapper">
            <InboxSearchComposer configs = {config}></InboxSearchComposer>
        </div>
        </React.Fragment>
    )
}
export default OrganizationInbox;