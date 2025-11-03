import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import { UserManagementConfig } from "../../configs/UserManagementConfig";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useContext } from "react";
import { useMyContext } from "../../utils/context";

const UserManagement = () => {
    const { dispatch, state } = useMyContext();
    const { t } = useTranslation();
    const location = useLocation()
    const moduleName = Digit?.Utils?.getConfigModuleName() || "commonSanitationUiConfig"
    const tenant = Digit.ULBService.getStateId();

    const config = UserManagementConfig()?.UserManagementConfig?.[0];
    const tqmInboxSession = Digit.Hooks.useSessionStorage("TQM_INBOX_SESSION", {});

    const history = useHistory();

    const onClickRow = (data) => {

        const selection = window.getSelection().toString();
        if (selection.length > 0) {
            return;
        }

        if (Array.isArray(data.cells) && data.cells.length > 0) {
            const row = data?.original?.user?.userName;
            const tenantId = Digit.ULBService.getCurrentTenantId();
            const contextPath = state?.ContextPathForUser?.[0]?.contextPathConfig;
            if (!contextPath) {
                  console.error("Context path configuration is missing");
                  return;
                }
            window.location.href=`/${contextPath}/employee/hrms/details/${tenantId}/${row}`
        } else {
            console.error("Invalid data format: cells array is missing or empty.");
        }
    }



    const [microplanData, setData] = useState(state["rolesForMicroplan"]);


    return (
        <React.Fragment>
            <Header styles={{ fontSize: "32px" }}>{t(config?.label)}</Header> 
            <div className="inbox-search-wrapper">
                <InboxSearchComposer
                    configs={{ ...config, additionalDetails: { microplanData } }}
                    // browserSession={tqmInboxSession}
                    additionalConfig={{
                        resultsTable: {
                            onClickRow
                        }
                    }}
                >

                </InboxSearchComposer>
            </div>
        </React.Fragment>
    )
}

export default UserManagement;