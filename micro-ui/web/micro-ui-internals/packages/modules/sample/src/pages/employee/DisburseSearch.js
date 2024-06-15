import { InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import { Header} from "@egovernments/digit-ui-react-components";
import React, { useTransition } from "react";
import { useTranslation } from "react-i18next";
import disburseSearchConfig from "../../configs/DisburseSearchConfig";
const DisburseInbox = () => {
    const { t } = useTranslation();
    const config = disburseSearchConfig();
    return (
        <React.Fragment>
        <div>
            <Header>{t("DISBURSE SEARCH")}</Header>
        </div>
        <div className="inbox-search-wrapper">
            <InboxSearchComposer configs = {config}></InboxSearchComposer>
        </div>
        </React.Fragment>
    )
}
export default DisburseInbox;