import { InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import { Header} from "@egovernments/digit-ui-react-components";
import React, { useTransition } from "react";
import { useTranslation } from "react-i18next";
import CampaignInboxConfig from "../../configs/CampaignInboxConfig";

const CampaignInbox = () => {
    const { t } = useTranslation();
    const config = CampaignInboxConfig();

    return (
        <React.Fragment>
        <div>
            <Header>{t("WORKBENCH_CAMPAIGN_INBOX")}</Header>
        </div>
        <div className="inbox-search-wrapper">
            <InboxSearchComposer configs = {config}></InboxSearchComposer>
        </div>
        </React.Fragment>
    )
}

export default CampaignInbox;