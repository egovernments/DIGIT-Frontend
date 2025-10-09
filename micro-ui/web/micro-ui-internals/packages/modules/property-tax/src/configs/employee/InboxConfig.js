export const InboxConfig = {
    headerLabel: "PT_PROPERTY_TAX_INBOX",
    type: "inbox",
    apiDetails: {
        serviceName: "/property-services/property/_search",
        requestParam: {},
        requestBody: {},
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
                minReqFields: 1,
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
            show: true
        },
        links: {
            uiConfig: {
                links: [
                    {
                        text: "SEARCH_PROPERTY",
                        url: "/employee/pt/search-property",
                        roles: ["STADMIN"],
                        hyperlink: false,
                    },
                    {
                        text: "SEARCH_APPLICATION",
                        url: "/employee/pt/search-application",
                        roles: ["STADMIN"],
                        hyperlink: false,
                    },
                    {
                        text: "ADD_NEW_PROPERTY",
                        url: "/employee/pt/assessment-form",
                        roles: ["STADMIN"],
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
            show: true,
        },
        filter: {
            uiConfig: {
                type: "filter",
                label: "", // Custom Filter Card Header
                primaryLabel: "Apply Filters", // label for filter button
                secondaryLabel: "Clear Filters",  // label for clear button
                minReqFields: 1,
                defaultValues: {
                    propertyMohalla: "",
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
                ],
            },
            show: true, // boolean flag to show or hide the filters section
        },
        sort: { // Introduced Sort action to show in the mobile view
            show: true,
        },
        searchResult: {
            uiConfig: {
                totalCountJsonPath: "count",
                enableGlobalSearch: true,
                enableColumnSort: true,
                resultsJsonPath: "Properties",
                tableClassName: "table inbox-table",
                columns: [
                    {
                        label: "PT_COMMON_TABLE_COL_PT_ID",
                        jsonPath: "propertyId",
                        additionalCustomization: true,
                    },
                    {
                        label: "PT_COMMON_TABLE_COL_OWNER_NAME",
                        jsonPath: "owners[0].name",
                    },
                    {
                        label: "PT_GUARDIAN_NAME",
                        jsonPath: "owners[0].fatherOrHusbandName",
                    },
                    {
                        label: "PT_COMMON_COL_EXISTING_PROP_ID",
                        jsonPath: "oldPropertyId",
                    },
                    {
                        label: "PT_COMMON_COL_ADDRESS",
                        jsonPath: "address",
                        additionalCustomization: true,
                    },
                    {
                        label: "PT_COMMON_TABLE_COL_STATUS_LABEL",
                        jsonPath: "status",
                        additionalCustomization: true,
                    },
                    {
                        label: "PT_COMMON_TABLE_COL_APP_NO",
                        jsonPath: "acknowldgementNumber",
                        additionalCustomization: true,
                    },
                    {
                        label: "PT_COMMON_TABLE_COL_APP_TYPE",
                        jsonPath: "creationReason",
                        additionalCustomization: true,
                    },
                ],
                enableGlobalSearch: true,
                enableColumnSort: true,
                resultsJsonPath: "Properties",
                totalCountJsonPath: "count",
                defaultSortAsc: true,
                isPaginationRequired: true,
            },
            children: {},
            show: true, // boolean flag to show or hide the search results 
        },
    },
};