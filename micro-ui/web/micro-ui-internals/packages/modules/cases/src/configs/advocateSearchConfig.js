
const defaultSearchValues = {
    barRegistrationNumber: ""
};

export const advocateSearchconfig = () => {
    return {
        // label: "Search Via Case and filing number",
        type: "search",
        apiDetails: {
            serviceName: "/advocate/advocate/v1/_search",
            requestParam: {
                "tenantId": Digit.ULBService.getCurrentTenantId()
            },
            requestBody: {
                // apiOperation: "SEARCH",
                // tenantId: Digit.ULBService.getCurrentTenantId(),
                criteria: [
                ]
            },
            masterName: "commonUiConfig",
            moduleName: "advocateSearchconfig",
            minParametersForSearchForm: 1,
            tableFormJsonPath: "requestParam",
            filterFormJsonPath: "requestBody.criteria.[0]",
            searchFormJsonPath: "requestBody.criteria.[0]",
        },
        sections: {
            search: {
                uiConfig: {
                    formClassName: "custom-both-clear-search",
                    primaryLabel: "ES_COMMON_SEARCH",
                    secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
                    minReqFields: 0,
                    defaultValues: defaultSearchValues, // Set default values for search fields
                    fields: [
                        {
                            label: "Search Bar id",
                            isMandatory: false,
                            key: "id",
                            type: "text",
                            populators: {
                                name: "id",
                                error: "Should not be empty"
                                // validation: {
                                //     // pattern: /^[A-Za-z]+$/,
                                //     // required: true, // Ensures the field is not empty
                                //     minLength: 1    // Optional: Ensures there's at least 1 character
                                // }
                            },
                        }
                    ],
                },

                show: true
            },
            searchResult: {
                tenantId: Digit.ULBService.getCurrentTenantId(),
                uiConfig: {
                    columns: [
                        {
                            label: "Advocate Type",
                            jsonPath: "advocateType",
                        },
                        {
                            label: "Individual Id",
                            jsonPath: "individualId",
                        },
                        {
                            label: "action",
                            additionalCustomization: true
                        }
                    ],
                    enableColumnSort: true,
                    resultsJsonPath: "advocates.[0].responseList",
                },
                show: true,
            },
        },
    };
};