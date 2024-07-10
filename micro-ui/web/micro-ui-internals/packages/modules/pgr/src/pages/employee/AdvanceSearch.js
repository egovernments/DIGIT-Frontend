import { InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import { Header} from "@egovernments/digit-ui-react-components";
import React, { useTransition } from "react";
import { useTranslation } from "react-i18next";
import advanceSearchConfig from "../../components/AdvanceSearchConfig";
const AdvanceInbox = () => {
    const { t } = useTranslation();
    const config = advanceSearchConfig();
    return (
        <React.Fragment>
        <div>
            <Header>{t("ADVANCE SEARCH")}</Header>
        </div>
        <div className="inbox-search-wrapper">
            <InboxSearchComposer configs = {config}></InboxSearchComposer>
        </div>
        </React.Fragment>
    )
}
export default AdvanceInbox;