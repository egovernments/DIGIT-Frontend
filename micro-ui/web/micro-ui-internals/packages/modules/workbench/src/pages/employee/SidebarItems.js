import React, { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
// import { ActionBar } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { FormComposerV2, Button } from "@egovernments/digit-ui-components";
import SidebarItemsConfig from "../../configs/SidebarItemsConfig";
import { filter, isMatchWith } from "lodash";

const SidebarItems = () => {

    const tenantId = Digit.ULBService.getCurrentTenantId();
    const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
    const history = useHistory();
    const { t } = useTranslation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");

    const res = {
        url: `/${mdms_context_path}/v2/_search`,
        params: {
            tenantId: tenantId
        },
        body: {
            MdmsCriteria: {
                tenantId: tenantId,
                schemaCode: `ACCESSCONTROL-ACTIONS-TEST.actions-test`,
                filters: {
                    url: "url"
                },
                uniqueIdentifiers: [id],
                isActive: true
            }
        },
        config: {
            cacheTime: 0, // Disable caching
            staleTime: 0, // Always treat as stale
            select: (res) => {
                return res?.mdms?.[0];
            }
        }
    }
    const { isLoading, data, isFetching } = Digit.Hooks.useCustomAPIHook(res);


    const getDefaultValues = () => ({
        displayName: data?.data?.displayName,
        path: data?.data?.path,
        leftIcon: data?.data?.leftIcon,
        navigationURL: data?.data?.navigationURL,
        orderNumber: data?.data?.orderNumber
    });
    const onSubmit = async(data) => {
        history.push(`/${window.contextPath}/employee/workbench/sidebar-manage?type=update&id=${id}`, {
        });
    }

    return (
        <div>
            {!isLoading && <FormComposerV2
                showMultipleCardsWithoutNavs={false}
                label={t("SIDEBAR_UPDATE")}
                config={SidebarItemsConfig({ t, data: data?.data })}
                fieldStyle={{ marginRight: 0 }}
                defaultValues={getDefaultValues()}
                noBreakLine={true}
                onFormValueChange={() => { }}
                actionClassName={"sidebaradd"}
                noCardStyle={true}
                onSubmit={onSubmit}
                showWrapperContainers={false}
                inLine
                submitInForm
            />}
            {/* {
                <Button
                    className=""
                    variation="secondary"
                    label={t("SIDEBAR_UPDATE_CONTENT")}
                    title={t("SIDEBAR_UPDATE_CONTENT_ADD")}
                    onClick={onSubmit}
                />
            } */}
        </div>
    )
};
export default SidebarItems;
