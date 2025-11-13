export const InboxConfig = {
    headerLabel: "PT_PROPERTY_TAX_INBOX",
    type: "inbox",
    apiDetails: {
        serviceName: "/egov-workflow-v2/egov-wf/process/_search",
        requestParam: {
            offset: 0,
            limit: 10
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
        moduleName: "PropertyInboxConfig",
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
                    ulbCity: "",
                    ownerMobNo: "",
                    propertyTaxUniqueId: "",
                    existingPropertyId: "",
                    ownerName: "",
                    surveyId: "",
                    propertyTaxApplicationNo: "",
                    ownerMobNoProp: "",
                    applicationPropertyTaxUniqueId: "",
                },
                fields: [
                    {
                        label: "ULB_CITY",
                        type: "apidropdown",
                        isMandatory: false,
                        disable: false,
                        populators: {
                            name: "ulbCity",
                            optionsKey: "code",
                            allowMultiSelect: false,
                            masterName: "commonUiConfig",
                            moduleName: "PropertyInboxConfig",
                            customfn: "populateULBCityOptions",
                            error: "PT_ULB_CITY_VALIDATION",
                            style: {
                                marginBottom: "0px",
                            },
                        },
                    },
                    {
                        label: "PT_HOME_SEARCH_RESULTS_OWN_MOB_LABEL",
                        type: "text",
                        isMandatory: false,
                        disable: false,
                        populators: {
                            name: "ownerMobNo",
                            error: "ERR_INVALID_MOBILE_NUMBER",
                            validation: {
                                pattern: /^[6-9]\d{9}$/,
                            },
                            style: {
                                marginBottom: "0px",
                            },
                        },
                    },
                    {
                        label: "PT_PROPERTY_UNIQUE_ID",
                        type: "text",
                        isMandatory: false,
                        disable: false,
                        populators: {
                            name: "propertyTaxUniqueId",
                            error: "ERR_INVALID_PROPERTY_ID",
                            validation: {
                                pattern: /^[a-zA-Z0-9-]*$/i,
                            },
                            style: {
                                marginBottom: "0px",
                            },
                        },
                    },
                    {
                        label: "PT_EXISTING_PROPERTY_ID",
                        type: "text",
                        isMandatory: false,
                        disable: false,
                        populators: {
                            name: "existingPropertyId",
                            error: "ERR_INVALID_PROPERTY_ID",
                            validation: {
                                pattern: /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*:;""'']{1,64}$/i,
                            },
                            style: {
                                marginBottom: "0px",
                            },
                        },
                    },
                    {
                        label: "PT_OWNER_NAME",
                        type: "text",
                        isMandatory: false,
                        disable: false,
                        populators: {
                            name: "ownerName",
                            error: "ERR_INVALID_PROPERTY_ID",
                            style: {
                                marginBottom: "0px",
                            },
                        },
                    },
                    {
                        label: "PT_SURVEY_ID",
                        type: "text",
                        isMandatory: false,
                        disable: false,
                        populators: {
                            name: "surveyId",
                            error: "ERR_INVALID_SURVEY_ID",
                            style: {
                                marginBottom: "0px",
                            },
                        },
                    },
                    {
                        label: "PT_PROPERTY_APPLICATION_NO",
                        type: "text",
                        isMandatory: false,
                        disable: false,
                        populators: {
                            name: "propertyTaxApplicationNo",
                            error: "ERR_INVALID_APPLICATION_NO",
                            validation: {
                                pattern: /^[a-zA-Z0-9-]*$/i,
                            },
                            style: {
                                marginBottom: "0px",
                            },
                        },
                    },
                    {
                        label: "PT_HOME_SEARCH_APP_OWN_MOB_LABEL",
                        type: "text",
                        isMandatory: false,
                        disable: false,
                        populators: {
                            name: "ownerMobNoProp",
                            error: "ERR_INVALID_MOBILE_NUMBER",
                            validation: {
                                pattern: /^[6-9]\d{9}$/,
                            },
                            style: {
                                marginBottom: "0px",
                            },
                        },
                    },
                    {
                        label: "PT_PROPERTY_UNIQUE_ID",
                        type: "text",
                        isMandatory: false,
                        disable: false,
                        populators: {
                            name: "applicationPropertyTaxUniqueId",
                            error: "ERR_INVALID_PROPERTY_ID",
                            validation: {
                                pattern: /^[a-zA-Z0-9-]*$/i,
                            },
                            style: {
                                marginBottom: "0px",
                            },
                        },
                    },
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
                        text: "SEARCH_PROPERTY",
                        url: "/employee/pt/search-property",
                        roles: ["STADMIN","CITIZEN"],
                        hyperlink: false,
                    },
                    {
                        text: "SEARCH_APPLICATION",
                        url: "/employee/pt/search-application",
                        roles: ["STADMIN","CITIZEN"],
                        hyperlink: false,
                    },
                    {
                        text: "ADD_NEW_PROPERTY",
                        url: "/employee/pt/assessment-form",
                        roles: ["STADMIN","CITIZEN"],
                        hyperlink: false,
                    },
                ],
                label: "Module Name",
                logoIcon: {
                    component: "Opacity",
                    customClass: "search-icon--projects",
                },
            },
            children: {},
            show: false,
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
                        label: "PT_COMMON_TABLE_COL_APP_NO",
                        jsonPath: "businessId",
                        additionalCustomization: true,
                    },
                    {
                        label: "WF_INBOX_HEADER_STATUS",
                        jsonPath: "state.state",
                        additionalCustomization: true,
                    },
                    {
                        label: "PT_LOCALITY_MOHALLA",
                        jsonPath: "locality",
                        additionalCustomization: true,
                    },
                    {
                        label: "WF_INBOX_HEADER_ASSIGNED_TO",
                        jsonPath: "assignee.name",
                        additionalCustomization: true,
                    },
                    {
                        label: "WF_INBOX_HEADER_SLA_DAYS_REMAINING",
                        jsonPath: "businesssServiceSla",
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
                    propertyMohalla: "",
                    status: "",
                    assignedToMe: "ASSIGNED_TO_ALL",
                },
                fields: [
                    {
                        label: "PT_LOCALITY_MOHALLA",
                        type: "apidropdown",
                        isMandatory: false,
                        disable: false,
                        populators: {
                            name: "propertyMohalla",
                            optionsKey: "code",
                            allowMultiSelect: false,
                            masterName: "commonUiConfig",
                            moduleName: "PropertyInboxConfig",
                            customfn: "populateLocalityOptions",
                            style: {
                                marginBottom: "0px",
                            },
                        },
                    },
                    {
                        label: "WF_INBOX_HEADER_STATUS",
                        type: "apidropdown",
                        isMandatory: false,
                        disable: false,
                        populators: {
                            name: "status",
                            optionsKey: "code",
                            allowMultiSelect: false,
                            masterName: "commonUiConfig",
                            moduleName: "PropertyInboxConfig",
                            customfn: "populateStatusOptions",
                            style: {
                                marginBottom: "0px",
                            },
                        },
                    },
                    {
                        label: "ES_INBOX_ASSIGNED_TO_ME",
                        type: "radio",
                        isMandatory: false,
                        disable: false,
                        populators: {
                            name: "assignedToMe",
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
                            style: {
                                marginBottom: "0px",
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