import React, { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
// import { ActionBar } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { FormComposerV2 } from "@egovernments/digit-ui-components";

const SidebarAddContent = () => {

    const tenantId = Digit.ULBService.getCurrentTenantId();
    const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
    const history = useHistory();
    const { t } = useTranslation();
    const searchParams = new URLSearchParams(location.search);
    const typeOfScreen = searchParams.get("type");

    const SidebarAddContentConfig =[
        {
            head: "Add_Content",
            body: [
                {
                    isMandatory: false,
                    key: "projectType",
                    type: "component",
                    skipAPICall: true,
                    component: "SidebarAdd",
                    withoutLabel: true,
                    withoutLabelFieldPair: true,
                    disable: false,
                    customProps: {
                      typeOfScreen: typeOfScreen
                    },
                    populators: {
                      name: "projectType",
                    },
                  },
            ],
        }]

    return (
        <div>
            <FormComposerV2
                showMultipleCardsWithoutNavs={false}
                config={SidebarAddContentConfig}
                fieldStyle={{ marginRight: 0 }}
                noBreakLine={true}
                onFormValueChange={()=>{}}
                actionClassName={"sidebaradd"}
                noCardStyle={true}
            // showWrapperContainers={false}
            />
        </div>
    )
};
export default SidebarAddContent;
