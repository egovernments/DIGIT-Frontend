import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { moduleMasterConfig } from "./config/moduleMasterConfig";


const ModuleMasterTable = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const module = searchParams.get("module")
    const history = useHistory();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const moduleName = `moduleMasterConfig${module}`

    return (
        <React.Fragment>
            <Header styles={{ fontSize: "32px" }}>{t(moduleMasterConfig?.moduleMasterConfig?.find((item) => item?.code === module)?.label || "N/A")}</Header>
            <div className="inbox-search-wrapper">
                <InboxSearchComposer
                    // configs={moduleMasterConfig?.[moduleName]?.[0]}
                    configs={moduleMasterConfig?.moduleMasterConfig?.find((item) => item?.code === module)}
                ></InboxSearchComposer>
            </div>
        </React.Fragment>
    );
}


export default ModuleMasterTable