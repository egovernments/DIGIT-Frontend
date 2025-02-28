
const tenantId = Digit.ULBService.getCurrentTenantId();
const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
const moduleName = "ACCESSCONTROL-ACTIONS-TEST"
const masterName = "actions-test"
export const SidebarDataSearchConfig = [
    {
        label: "Sidebar Data Search",
        type: "search",
        apiDetails: {
            serviceName: `/${mdms_context_path}/v2/_search`,
            requestParam: {
                "tenantId": tenantId,
            },
            requestBody: {
                MdmsCriteria: {
                    tenantId: tenantId,
                    schemaCode: `${moduleName}.${masterName}`,
                    isActive: true,
                    filters: { url: "url" }
                }
            },
            Pagination: {
                "offset": 0,
                "limit": 1
            },
            masterName: "commonUiConfig",
            moduleName: "MySidebarDataSearchConfig",
            minParametersForSearchForm: 0,
            tableFormJsonPath: "requestBody.MdmsCriteria",
            filterFormJsonPath: "requestBody",
            searchFormJsonPath: "requestBody",
        },
        sections: {
            search: {
                uiConfig: {
                    formClassName: "custom-both-clear-search",
                    primaryLabel: "ES_COMMON_SEARCH",
                    secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
                    minReqFields: 0,
                    fields: [
                        {
                            label: "SIDEBAR_DISPLAY_NAME",
                            type: "text",
                            isMandatory: false,
                            disable: false,
                            populators: {
                                name: "displayName"
                            }

                        },
                    ],
                },

                show: true
            },
            searchResult: {
                // tenantId: Digit.ULBService.getCurrentTenantId(),
                uiConfig: {
                    columns: [

                        {
                            label: "SIDEBAR_PATH",
                            // prefix: "ACCESSCONTROL_ROLES_ROLES_",
                            jsonPath: "data.path",
                            translate: true
                        },
                        {
                            label: "SIDEBAR_DISPLAY_NAME",
                            // prefix: "HCM_CHECKLIST_TYPE_",
                            jsonPath: "data.displayName",
                            translate: true
                        },
                    ],

                    enableColumnSort: true,
                    resultsJsonPath: "mdms"
                },
                show: true,
            },
        },
        additionalDetails: {
        },
        // customHookName: "workbench.useCustomMDMS"
    },
];

