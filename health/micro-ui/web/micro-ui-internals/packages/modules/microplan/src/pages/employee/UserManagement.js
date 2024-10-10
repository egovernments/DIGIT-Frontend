import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import { UserManagementConfig } from "../../configs/UserManagementConfig";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useContext } from "react";
import { useMyContext } from "../../utils/context";

const UserManagement = () => {
    const { t } = useTranslation();
    const location = useLocation()
    const moduleName = Digit?.Utils?.getConfigModuleName() || "commonSanitationUiConfig"
    const tenant = Digit.ULBService.getStateId();
    

    
    const config = UserManagementConfig?.UserManagementConfig?.[0];
    debugger

    const tqmInboxSession = Digit.Hooks.useSessionStorage("TQM_INBOX_SESSION", {});

    const history=useHistory();

    const onClickRow = (data) => {
        
        const row=data.cells[0].value;
        history.push(`/digit-ui/employee/hrms/details/mz/${row}`);
    
      }

    

    const { dispatch, state } = useMyContext();
    const [microplanData, setData] = useState(state["rolesForMicroplan"]);
   

    return (
        <React.Fragment>
            <Header styles={{ fontSize: "32px" }}>{t(config?.label)}{<span className="inbox-count">{location?.state?.count ? location?.state?.count : 0}</span>}</Header>
            <div className="inbox-search-wrapper">
                <InboxSearchComposer
                    configs={{...config,additionalDetails: { microplanData }}}
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