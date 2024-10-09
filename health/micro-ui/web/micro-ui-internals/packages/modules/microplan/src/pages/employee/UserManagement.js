import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import { tqmInboxConfig } from "../../configs/UserManagementConfig";
import { tqmInboxConfigPlantOperator } from "./PlantOperator";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useContext } from "react";
import { useMyContext } from "../../utils/context";

const UserManagement = () => {
    const { t } = useTranslation();
    const location = useLocation()
    // const isPlantOperatorLoggedIn = Digit.Utils.tqm.isPlantOperatorLoggedIn()
    // const isUlbAdminLoggedIn = Digit.Utils.tqm.isUlbAdminLoggedIn()
    const moduleName = Digit?.Utils?.getConfigModuleName() || "commonSanitationUiConfig"
    const tenant = Digit.ULBService.getStateId();
    // Hook calling to enable scroll persistent 
    // const scrollPosition = Digit.Hooks.useScrollPersistence();
    // const { isLoading, data:config } = Digit.Hooks.useCustomMDMS(tenant,
    //     "commonSanitationUiConfig",
    //     [
    //         {
    //             name: "InboxPlantOperatorConfig",
    //         },
    //         {
    //           name: "InboxUlbAdminConfig",
    //         }
    //     ],
    //     {
    //       select:(data) => {
    //         if(isPlantOperatorLoggedIn){
    //           return tqmInboxConfigPlantOperator?.tqmInboxConfig?.[0];
    //           // return data?.commonSanitationUiConfig?.InboxPlantOperatorConfig?.[0]
    //         }
    //         else if(isUlbAdminLoggedIn) {
    //           return tqmInboxConfig?.tqmInboxConfig?.[0];
    //           // return data?.commonSanitationUiConfig?.InboxUlbAdminConfig?.[0]

    //         }
    //         return tqmInboxConfigPlantOperator?.tqmInboxConfig?.[0];
    //       }
    //     }

    //     );

    
    const config = tqmInboxConfig?.tqmInboxConfig?.[0];

    const tqmInboxSession = Digit.Hooks.useSessionStorage("TQM_INBOX_SESSION", {});

    const history=useHistory();

    const onClickRow = (data) => {
        console.log(data);
        // const row = data.original.data.name;
        const row=data.cells[0].value;
        
        console.log("row",row);
        history.push(`/digit-ui/employee/hrms/details/mz/${row}`);
    
      }

    // if(isLoading) return <Loader />
    // const {
    //     isLoading: isLoadingMicroplanData,
    //     data: microplanData
    //   } = Digit.Hooks.useCustomMDMS(
    //     Digit.ULBService.getCurrentTenantId(), // First argument: Tenant ID
    //     "hcm-microplanning", // Second argument: The MDMS module
    //     [{
    //         name: "rolesForMicroplan"
    //       }],{
    //         cacheTime: Infinity,
    //         select: data => {
    //         }
    //       }, {
    //         schemaCode: "BASE_MASTER_DATA"
    //       }
    //   );
    //   debugger
    //   console.log("microplan",microplanData);

    const { dispatch, state } = useMyContext();
    const [microplanData, setData] = useState(state["rolesForMicroplan"]);
    // debugger;

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