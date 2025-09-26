import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import { SidebarDataSearchConfig } from "../../configs/SidebarDataSearchConfig"
import { Button } from "@egovernments/digit-ui-components";

const SidebarConfig = () => {

    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
    const navigate = useNavigate();
    const moduleName = "ACCESSCONTROL-ACTIONS-TEST"
    const masterName = "actions-test"

    const onClickRow = ({ original: row }) => {
        const id = row?.data?.id;
        navigate(`/${window.contextPath}/employee/workbench/sidebar-items?id=${id}`,
            {
                data:row
            }
        );
    }
    const addContent = () => {
        navigate(
            `/${window.contextPath}/employee/workbench/sidebar-manage?type=add`
        );
    }
    return (
        <div>
            <InboxSearchComposer
                configs={SidebarDataSearchConfig(tenantId, mdms_context_path, moduleName, masterName)[0]}
                additionalConfig={{
                    resultsTable: {
                        onClickRow,
                    },
                }}
            ></InboxSearchComposer>
            <Button
                    className=""
                    style={{marginTop:"1rem"}}
                    variation="secondary"
                    label={t("SIDEBAR_ADD_CONTENT")}
                    title={t("SIDEBAR_ADD_CONTENT")}
                    onClick={addContent}
                />
        </div>
    )
};
export default SidebarConfig;
