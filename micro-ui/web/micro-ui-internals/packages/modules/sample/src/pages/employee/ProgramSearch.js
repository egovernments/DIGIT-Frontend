import { InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import { Header} from "@egovernments/digit-ui-react-components";
import React, { useTransition } from "react";
import { useTranslation } from "react-i18next";
import programSearchConfig from "../../configs/ProgramSearchConfig";
const ProgramInbox = () => {
    const { t } = useTranslation();
    const config = programSearchConfig();
    return (
        <React.Fragment>
        <div>
            <Header>{t("PROGRAM SEARCH")}</Header>
        </div>
        <div className="inbox-search-wrapper">
            <InboxSearchComposer configs = {config}></InboxSearchComposer>
        </div>
        </React.Fragment>
    )
}
export default ProgramInbox;