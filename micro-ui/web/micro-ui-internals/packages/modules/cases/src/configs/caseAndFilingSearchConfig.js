
const defaultSearchValues = {
    filingNumber: "",
    caseNumber: ""
};

export const caseAndFilingSearchConfig = () => {
    return {
        // label: "Search Via Case and filing number",
        type: "search",
        apiDetails: {
            serviceName: "/case/case/v1/_search",
            requestParam: {
                "tenantId": Digit.ULBService.getCurrentTenantId()
            },
            requestBody: {
                // apiOperation: "SEARCH",
                tenantId: Digit.ULBService.getCurrentTenantId(),
                criteria: [
                ]
            },
            masterName: "commonUiConfig",
            moduleName: "joinCaseSearchCasesConfig",
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
                            label: "Enter Filing Number",
                            isMandatory: false,
                            key: "filingNumber",
                            type: "text",
                            populators: {
                                name: "filingNumber",
                                error: "Should not be empty"
                                // validation: {
                                //     // pattern: /^[A-Za-z]+$/,
                                //     // required: true, // Ensures the field is not empty
                                //     minLength: 1    // Optional: Ensures there's at least 1 character
                                // }
                            },
                        },
                        {
                            label: "Enter Case Number",
                            isMandatory: false,
                            key: "caseNumber",
                            type: "text",
                            populators: {
                                name: "caseNumber",
                                error: "Should not be empty"
                                // validation: { pattern: /^[A-Za-z]+$/i }
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
                            label: "Filling Number",
                            jsonPath: "filingNumber",
                        },
                        ,
                        {
                            label: "Case Number",
                            jsonPath: "caseNumber",
                        },
                        {
                            label: "Case Category",
                            jsonPath: "caseCategory",
                        },
                        {
                            label: "Case Description",
                            jsonPath: "caseDescription",
                        },
                        {
                            additionalCustomization: true,
                            label: "action"
                        }
                    ],
                    enableColumnSort: true,
                    resultsJsonPath: "criteria.[0].responseList",
                },
                show: true,
            },
        },
    };
};