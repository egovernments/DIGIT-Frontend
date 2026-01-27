export const InboxConfig = {
    headerLabel: "TL_INBOX",
    type: "inbox",
    apiDetails: {
        serviceName: "/egov-workflow-v2/egov-wf/process/_search",
        requestParam: {
        },
        requestBody: {
            RequestInfo: {
                apiId: "Rainmaker",
                ver: ".01",
                ts: "",
                action: "_search",
                did: "1",
                key: "",
                msgId: "20170310130900|en_IN"
            }
        },
        minParametersForSearchForm: 0,
        minParametersForFilterForm: 0,
        masterName: "commonUiConfig",
        moduleName: "TradelicenseInboxConfig",
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
                minReqFields: 0,
                showFormInstantly: false,
                defaultValues: {
                    applicationNumber: "",
                    mobileNumber: ""
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
                    }
                ],
            },
            label: "",
            labelMobile: "ES_COMMON_SEARCH",
            children: {},
            show: false
        },
        links: {
            uiConfig: {
                links: [
                    {
                        text: "TL_NEW_APPLICATION",
                        url: "/employee/tl/new-application",
                        roles: ["TL_CEMP"],
                    },
                    {
                        text: "TL_SEARCH_APPLICATIONS",
                        url: "/employee/tl/search/application",
                        roles: ["TL_CEMP", "TL_DOC_VERIFIER", "TL_FIELD_INSPECTOR", "TL_APPROVER"],
                    },
                    {
                        text: "TL_SEARCH_LICENSE",
                        url: "/employee/tl/search/license",
                        roles: ["TL_CEMP", "TL_DOC_VERIFIER", "TL_FIELD_INSPECTOR", "TL_APPROVER"],
                    }
                ],
                label: "ES_COMMON_INBOX",
                logoIcon: {
                    component: "Store",
                    customClass: "search-icon--projects",
                },
            },
            children: {},
            show: true,
        },
        searchResult: {
            uiConfig: {
                resultsJsonPath: "ProcessInstances",
                totalCountJsonPath: "totalCount",
                tableClassName: "table inbox-table",
                enableGlobalSearch: true,
                enableColumnSort: true,
                defaultSortAsc: true,
                isPaginationRequired: true,
                paginationParams: {
                    limit: 10,
                    offset: 0,
                    pageSizeOptions: [10, 25, 50, 100]
                },
                columns: [
                    {
                        label: "TL_COMMON_TABLE_COL_APP_NO",
                        jsonPath: "businessId",
                        additionalCustomization: true,
                    },
                    {
                        label: "TL_COMMON_TABLE_COL_APP_DATE",
                        jsonPath: "businesssServiceSla",
                        additionalCustomization: true,
                    },
                    {
                        label: "TL_COMMON_TABLE_COL_LOCALITY",
                        jsonPath: "businessObject.tradeLicenseDetail.address.locality.name",
                        additionalCustomization: true,
                    },
                    {
                        label: "TL_COMMON_TABLE_COL_STATUS",
                        jsonPath: "state.state",
                        additionalCustomization: true,
                    },
                    {
                        label: "TL_COMMON_TABLE_COL_ASSIGNED_TO",
                        jsonPath: "assignee.name",
                        additionalCustomization: true,
                    },
                ],
            },
            children: {},
            show: true, // boolean flag to show or hide the search results
        },
        filter: {
            uiConfig: {
                type: "filter",
                label: "", // Custom Filter Card Header
                primaryLabel: "Apply Filters", // label for filter button
                secondaryLabel: "Clear Filters",  // label for clear button
                minReqFields: 0,
                defaultValues: {
                    locality: "",
                    state: "",
                    assignee: "ASSIGNED_TO_ALL",
                },
                fields: [
                    {
                        label: "TL_LOCALITY_LABEL",
                        type: "apidropdown",
                        isMandatory: false,
                        disable: false,
                        populators: {
                            name: "locality",
                            optionsKey: "code",
                            allowMultiSelect: true,
                            masterName: "commonUiConfig",
                            moduleName: "TradelicenseInboxConfig",
                            customfn: "populateLocalityOptions",
                        },
                    },
                    {
                        label: "TL_STATUS_LABEL",
                        type: "apidropdown",
                        isMandatory: false,
                        disable: false,
                        populators: {
                            name: "state",
                            optionsKey: "code",
                            allowMultiSelect: true,
                            masterName: "commonUiConfig",
                            moduleName: "TradelicenseInboxConfig",
                            customfn: "populateStatusOptions",
                        },
                    },
                    {
                        label: "ES_INBOX_ASSIGNED_TO_ME",
                        type: "radio",
                        isMandatory: false,
                        disable: false,
                        populators: {
                            name: "assignee",
                            options: [
                                {
                                    code: "ASSIGNED_TO_ME",
                                    name: "ES_INBOX_ASSIGNED_TO_ME",
                                },
                                {
                                    code: "ASSIGNED_TO_ALL",
                                    name: "ES_INBOX_ASSIGNED_TO_ALL",
                                },
                            ],
                            optionsKey: "name",
                            innerStyles: {
                                display: "flex",
                                flexDirection: "row",
                            },
                        },
                    },
                ],
            },
            show: true, // boolean flag to show or hide the filters section
        },
        sort: { // Introduced Sort action to show in the mobile view
            show: true,
        },

    },
};
