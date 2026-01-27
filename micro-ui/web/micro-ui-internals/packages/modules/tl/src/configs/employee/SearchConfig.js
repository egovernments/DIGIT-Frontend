export const SearchConfig = {
    tenantId: "pb",
    moduleName: "commonUiConfig",
    showTab: true,
    SearchConfig: [
        {
            headerLabel: "TL_SEARCH_APPLICATIONS",
            label: "TL_SEARCH_APPLICATIONS",
            type: "search",
            actions: {
                actionLabel: "TL_NEW_APPLICATION",
                actionRoles: ["TL_CEMP", "TL_DOC_VERIFIER", "TL_FIELD_INSPECTOR", "TL_APPROVER", "STADMIN", "CITIZEN"],
                actionLink: "tl/new-application",
            },
            apiDetails: {
                serviceName: "/tl-services/v1/_search",
                requestParam: {},
                requestBody: {},
                minParametersForSearchForm: 1,
                minParametersForFilterForm: 1,
                masterName: "commonUiConfig",
                moduleName: "SearchInboxConfig",
                tableFormJsonPath: "requestParam",
                filterFormJsonPath: "requestParam",
                searchFormJsonPath: "requestParam",
            },
            sections: {
                search: {
                    uiConfig: {
                        headerLabel: "ES_COMMON_SEARCH",
                        type: "search",
                        typeMobile: "filter",
                        headerStyle: null,
                        primaryLabel: "Search",
                        primaryLabelVariation: "teritiary",
                        primaryLabelIcon: "FilterListAlt",
                        secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
                        minReqFields: 1,
                        defaultValues: {
                            applicationNumber: "",
                            mobileNumber: "",
                            tradeName: ""
                        },
                        fields: [
                            {
                                label: "TL_HOME_SEARCH_RESULTS_APP_NO_LABEL",
                                type: "text",
                                isMandatory: false,
                                disable: false,
                                populators: {
                                    name: "applicationNumber",
                                    error: "ERR_INVALID_APPLICATION_NO",
                                    validation: {
                                        pattern: /^[a-zA-Z0-9-]*$/i,
                                        minlength: 3
                                    }
                                }
                            },
                            {
                                label: "TL_MOBILE_NUMBER_LABEL",
                                type: "mobileNumber",
                                isMandatory: false,
                                disable: false,
                                populators: {
                                    name: "mobileNumber",
                                    error: "ERR_INVALID_MOBILE_NUMBER",
                                    validation: {
                                        pattern: /^[6-9]\d{9}$/,
                                        minlength: 10,
                                        maxlength: 10
                                    }
                                }
                            },
                            {
                                label: "TL_TRADE_NAME_LABEL",
                                type: "text",
                                isMandatory: false,
                                disable: false,
                                populators: {
                                    name: "tradeName",
                                    error: "ERR_INVALID_TRADE_NAME",
                                    validation: {
                                        pattern: /^[a-zA-Z0-9-]*$/i,
                                        minlength: 3
                                    }
                                }
                            }
                        ]
                    },
                    label: "",
                    labelMobile: "ES_COMMON_SEARCH",
                    children: {},
                    show: true
                },
                searchResult: {
                    uiConfig: {
                        totalCountJsonPath: "Count",
                        enableGlobalSearch: true,
                        enableColumnSort: true,
                        resultsJsonPath: "Licenses",
                        tableClassName: "table property-table",
                        columns: [
                            {
                                label: "TL_COMMON_TABLE_COL_APP_NO",
                                jsonPath: "applicationNumber",
                                additionalCustomization: true,
                            },
                            {
                                label: "TL_COMMON_TABLE_COL_APP_DATE",
                                jsonPath: "applicationDate",
                                additionalCustomization: true,
                            },
                            {
                                label: "TL_COMMON_TABLE_COL_TRD_NAME",
                                jsonPath: "tradeName",
                                additionalCustomization: true,
                            },
                            {
                                label: "TL_COMMON_TABLE_COL_OWN_NAME",
                                jsonPath: "tradeLicenseDetail.owners[0].name",
                            },
                            {
                                label: "TL_COMMON_TABLE_COL_STATUS",
                                jsonPath: "status",
                                additionalCustomization: true,
                            }
                        ],
                    },
                    children: {},
                    show: true,
                },
                links: {
                    show: false,
                },
                filter: {
                    show: false
                }
            },
            additionalSections: {},
            persistFormData: true,
            showAsRemovableTagsInMobile: true,
        },
        {
            headerLabel: "TL_SEARCH_LICENSE",
            label: "TL_SEARCH_LICENSE",
            type: "search",
            actions: {
                actionLabel: "TL_NEW_APPLICATION",
                actionRoles: ["TL_CEMP", "TL_DOC_VERIFIER", "TL_FIELD_INSPECTOR", "TL_APPROVER", "STADMIN", "CITIZEN"],
                actionLink: "tl/new-application",
            },
            apiDetails: {
                serviceName: "/tl-services/v1/_search",
                requestParam: {},
                requestBody: {},
                minParametersForSearchForm: 1,
                minParametersForFilterForm: 1,
                masterName: "commonUiConfig",
                moduleName: "SearchInboxConfig",
                tableFormJsonPath: "requestParam",
                filterFormJsonPath: "requestParam",
                searchFormJsonPath: "requestParam",
            },
            sections: {
                search: {
                    uiConfig: {
                        headerLabel: "ES_COMMON_SEARCH",
                        type: "search",
                        typeMobile: "filter",
                        headerStyle: null,
                        primaryLabel: "Search",
                        primaryLabelVariation: "teritiary",
                        primaryLabelIcon: "FilterListAlt",
                        secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
                        minReqFields: 1,
                        defaultValues: {
                            licenseNumbers: "",
                            mobileNumber: "",
                            tradeName: ""
                        },
                        fields: [
                            {
                                label: "TL_LICENSE_NUMBER_LABEL",
                                type: "text",
                                isMandatory: false,
                                disable: false,
                                populators: {
                                    name: "licenseNumbers",
                                    error: "ERR_INVALID_LICENSE_NO",
                                    validation: {
                                        pattern: /^[a-zA-Z0-9-]*$/i,
                                        minlength: 3
                                    }
                                }
                            },
                            {
                                label: "TL_MOBILE_NUMBER_LABEL",
                                type: "mobileNumber",
                                isMandatory: false,
                                disable: false,
                                populators: {
                                    name: "mobileNumber",
                                    error: "ERR_INVALID_MOBILE_NUMBER",
                                    validation: {
                                        pattern: /^[6-9]\d{9}$/,
                                        minlength: 10,
                                        maxlength: 10
                                    }
                                }
                            },
                            {
                                label: "TL_TRADE_NAME_LABEL",
                                type: "text",
                                isMandatory: false,
                                disable: false,
                                populators: {
                                    name: "tradeName",
                                    error: "ERR_INVALID_TRADE_NAME",
                                    validation: {
                                        pattern: /^[a-zA-Z0-9-]*$/i,
                                        minlength: 3
                                    }
                                }
                            }
                        ]
                    },
                    label: "",
                    labelMobile: "ES_COMMON_SEARCH",
                    children: {},
                    show: true
                },
                searchResult: {
                    uiConfig: {
                        totalCountJsonPath: "Count",
                        enableGlobalSearch: true,
                        enableColumnSort: true,
                        resultsJsonPath: "Licenses",
                        tableClassName: "table property-table",
                        columns: [
                            {
                                label: "TL_COMMON_TABLE_COL_LIC_NO",
                                jsonPath: "licenseNumber",
                                additionalCustomization: true,
                            },
                            {
                                label: "TL_COMMON_TABLE_COL_APP_NO",
                                jsonPath: "applicationNumber",
                                additionalCustomization: true,
                            },
                            {
                                label: "TL_COMMON_TABLE_COL_TRD_NAME",
                                jsonPath: "tradeName",
                                additionalCustomization: true,
                            },
                            {
                                label: "TL_COMMON_TABLE_COL_OWN_NAME",
                                jsonPath: "tradeLicenseDetail.owners[0].name",
                            },
                            {
                                label: "TL_COMMON_TABLE_COL_STATUS",
                                jsonPath: "status",
                                additionalCustomization: true,
                            }
                        ],
                    },
                    children: {},
                    show: true,
                },
                links: {
                    show: false,
                },
                filter: {
                    show: false
                }
            },
            additionalSections: {},
            persistFormData: true,
            showAsRemovableTagsInMobile: true,
        }
    ],
};
