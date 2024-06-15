import { InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import { Header} from "@egovernments/digit-ui-react-components";
import React, { useTransition } from "react";
import { useTranslation } from "react-i18next";
import projectSearchConfig from "../../configs/ProjectSearchConfig";
const ProjectInbox = () => {
    const { t } = useTranslation();
    const config = projectSearchConfig();
    return (
        <React.Fragment>
        <div>
            <Header>{t("PROJECT SEARCH")}</Header>
        </div>
        <div className="inbox-search-wrapper">
            <InboxSearchComposer configs = {config}></InboxSearchComposer>
        </div>
        </React.Fragment>
    )
}
export default ProjectInbox;