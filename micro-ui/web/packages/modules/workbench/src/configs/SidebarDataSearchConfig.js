export const SidebarDataSearchConfig  = (tenantId, mdms_context_path, moduleName, masterName) => {
    return [
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
            filterFormJsonPath: "requestBody.MdmsCriteria",
            searchFormJsonPath: "requestBody.MdmsCriteria.filters",
        },
        sections: {
            search: {
                uiConfig: {
                    formClassName: "custom-both-clear-search",
                    primaryLabel: "ES_COMMON_SEARCH",
                    secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
                    minReqFields: 0,
                    defaultValues: {
                        displayName: "",
                        navigationURL: "",
                      },
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
                        {
                            label: "SIDEBAR_NAVIGATIONURL",
                            type: "text",
                            isMandatory: false,
                            disable: false,
                            populators: {
                                name: "navigationURL"
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
                        {
                            label: "SIDEBAR_NAVIGATIONURL",
                            // prefix: "ACCESSCONTROL_ROLES_ROLES_",
                            jsonPath: "data.navigationURL",
                            translate: false
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
}

