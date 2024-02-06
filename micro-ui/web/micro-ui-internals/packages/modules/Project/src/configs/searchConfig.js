const searchConfig = () => {
    return {
        label : "WORKS_SEARCH_PROJECTS",
        type: 'search',
        "actionLabel": "WORKS_CREATE_PROJECT",
        "actionRole": "EMPLOYEE",
        "actionLink": "project/create-project",
        apiDetails: {
            serviceName: "/pms/project/v1/_search",
            requestParam: {
                
            },
            requestBody: {
                apiOperation: "SEARCH",
                Projects: [
                    {
                        
                    }
                ]
            },
            minParametersForSearchForm:1,
            masterName:"commonUiConfig",
            moduleName:"SearchProjectConfig",
            tableFormJsonPath:"requestParam",
            filterFormJsonPath:"requestBody.Projects[0]",
            searchFormJsonPath:"requestBody.Projects[0]",
        },
        sections : {
            search : {
                uiConfig : {
                    headerStyle : null,
                    primaryLabel: 'ES_COMMON_SEARCH',
                    secondaryLabel: 'ES_COMMON_CLEAR_SEARCH',
                    minReqFields: 1,
                    defaultValues : {
                        projectNumber: "",
                        subProjectId: "",
                        name: "",
                        projectType: "",
                        startDate: "",
                        endDate: ""
                    },
                    fields : [
                        {
                            label:"WORKS_PROJECT_ID",
                            type: "text",
                            isMandatory: false,
                            disable: false,
                            populators: { 
                                name: "projectNumber",
                                error: `PROJECT_PATTERN_ERR_MSG`,
                                validation: { pattern: /^[a-z0-9\/-]*$/i, minlength : 2 }
                            }
                        },
                        {
                            label: "PROJECT_PRJ_SUB_ID",
                            type: "text",
                            isMandatory: false,
                            disable: false,
                            populators: { 
                                name: "projectNumber",
                                error: `PROJECT_PATTERN_ERR_MSG`,
                                validation: { pattern: /^[a-z0-9\/-]*$/i, minlength : 2 }
                            }
                        },
                        {
                          label: "PROJECT_NAME",
                          type: "text",
                          isMandatory: false,
                          disable: false,
                          populators: { 
                              name: "name",
                              error: `PROJECT_PATTERN_ERR_MSG`,
                              validation: { pattern: /^[a-z0-9\/-@# ]*$/i, minlength : 2 }
                          }
                        },
                        {
                          label: "WORKS_PROJECT_TYPE",
                          type: "dropdown",
                          isMandatory: false,
                          disable: false,
                          populators: {
                            name: "projectType",
                            optionsKey: "code",
                            mdmsConfig: {
                              masterName: "ProjectType",
                              moduleName: "works",
                              localePrefix: "COMMON_MASTERS"
                            }
                          },
                        },
                        {
                          label: "CREATED_FROM_DATE",
                          type: "date",
                          isMandatory: false,
                          disable: false,
                          populators: { 
                              name: "createdFrom",
                          }
                        },
                        {
                            label: "CREATED_TO_DATE",
                            type: "date",
                            isMandatory: false,
                            disable: false,
                            populators: { 
                                name: "createdTo",
                                error: 'DATE_VALIDATION_MSG'
                            },
                            additionalValidation: {
                                type: 'date',
                                keys: {start: 'createdFrom', end: 'createdTo'}
                            }
                        }
                    ]
                },
                label : "",
                children : {},
                show : true
            },
            searchResult: {
                label: "",
                uiConfig: {
                    columns: [
                        {
                            label: "WORKS_PRJ_SUB_ID",
                            jsonPath: "projectNumber",
                            additionalCustomization:true
                        },
                        {
                            label: "WORKS_PROJECT_NAME",
                            jsonPath: "name",
                            additionalCustomization:true
                        },
                        {
                            label: "PROJECT_OWNING_DEPT",
                            jsonPath: "department",
                            translate:true,
                            prefix:"COMMON_MASTERS_DEPARTMENT_",
                        },
                        {
                            label: "WORKS_PROJECT_TYPE",
                            jsonPath: "projectType",
                        },
                        {
                            label: "WORKS_SUB_PROJECT_TYPE",
                            jsonPath: "projectSubType",
                        },
                        {
                            label: "ES_COMMON_WORK_NATURE",
                            jsonPath: "natureOfWork",
                        },
                        {
                            label: "WORKS_PARENT_PROJECT_ID",
                            jsonPath: "ancestors[0].projectNumber",
                            additionalCustomization:true
                        },
                        {
                            label: "ES_COMMON_CREATED_BY",
                            jsonPath: "additionalDetails.creator",
                        },
                        {
                            label: "ES_COMMON_STATUS",
                            jsonPath: "status",
                        },
                        {
                            label: "ES_COMMON_TOTAL_AMOUNT",
                            jsonPath: "additionalDetails.estimatedCostInRs",
                        }
                    ],
                    enableGlobalSearch: false,
                    enableColumnSort: true,
                    resultsJsonPath: "Projects",
                },
                children: {},
                show: true 
            }
        },
        additionalSections : {}
    }
}

export default searchConfig;