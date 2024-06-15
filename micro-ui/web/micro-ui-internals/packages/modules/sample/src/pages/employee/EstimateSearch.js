import { InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import { Header} from "@egovernments/digit-ui-react-components";
import React, { useTransition } from "react";
import { useTranslation } from "react-i18next";
import organizationSearchConfig from "../../configs/OrganizationSearchConfig";
import EstimateSearchConfig from "../../configs/EstimateSearchConfig";
const EstimateInbox = () => {
    const { t } = useTranslation();
    const config = EstimateSearchConfig();
    return (
        <React.Fragment>
        <div>
            <Header>{t("ESTIMATE SEARCH")}</Header>
        </div>
        <div className="inbox-search-wrapper">
            <InboxSearchComposer configs = {config}></InboxSearchComposer>
        </div>
        </React.Fragment>
    )
}
export default EstimateInbox;