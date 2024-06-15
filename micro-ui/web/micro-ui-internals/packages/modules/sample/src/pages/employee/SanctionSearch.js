import { InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import { Header} from "@egovernments/digit-ui-react-components";
import React, { useTransition } from "react";
import { useTranslation } from "react-i18next";
import sanctionSearchConfig from "../../configs/SanctionSearchConfig";
const SanctionInbox = () => {
    const { t } = useTranslation();
    const config = sanctionSearchConfig();
    return (
        <React.Fragment>
        <div>
            <Header>{t("SANCTION SEARCH")}</Header>
        </div>
        <div className="inbox-search-wrapper">
            <InboxSearchComposer configs = {config}></InboxSearchComposer>
        </div>
        </React.Fragment>
    )
}
export default SanctionInbox;