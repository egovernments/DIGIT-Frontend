const defaultSearchValues = {
    fieldValue:"",
    typeOfFilter:{}
}

export const sorSearchConfig = ()=>{


     return {
        label:"SOR_Search",
        type:"search",
        apiDetails:{
            serviceName:"/mdms-v2/v2/_search",
            requestParam:{
                "tenantId":Digit.ULBService.getCurrentTenantId()
            },
            requestBody:{
                apiOperation:"SEARCH",
                MdmsCriteria: {
                    "tenantId": Digit.ULBService.getCurrentTenantId(),
                     "customs":{}
                    //  customs: {
                    //     field: { name: "field-name" },
                    //     value: "some-value"
                    //   },
                    //   filters: {} // This will be populated by the preProcess function
                  }
            },
            masterName:"commonUiConfig",
            moduleName:"SorSearchConfig",
            minParametersForSearchForm:0,
            tableFormJsonPath:"requestParam",
            filterFormJsonPath: "requestBody.MdmsCriteria.customs",
            searchFormJsonPath: "requestBody.MdmsCriteria.customs",
          },
        
          sections:{
            search:{
                uiConfig:{

                    headerStyle: null,
                    formClassName:"custom-both-clear-search",
                    primaryLabel: "ES_COMMON_SEARCH",
                    secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
                    minReqFields: 0,
                    defaultValues:defaultSearchValues,
                    searchWrapperStyles:{
                       flexDirection:"column-reverse",
                       marginTop:"2rem",
                       alignItems:"center",
                       justifyContent:"end",
                       gridColumn:"4"
                    },
                    fields:[
                        {
                            label:"Type Of Filter",
                            isMandatory: false,
                            key:"typeOfFilter",
                            type:"dropdown",
                            disable: false,
                            populators:{
                                name:"typeOfFilter",
                                error:"Required",
                                options:[
                                    {
                                      label:"Name",
                                      name:"name"
                                    },
                                    {
                                        label:"Description",
                                        name:"description"
                                    },
                                    {
                                        label:"Executing Department",
                                        name:"executingDEpartment"
                                    },
                                    {
                                        label:"Workflow Status",
                                        name:"wfStatus"
                                    }
                                ],
                                optionsKey:"label",
                               optionsCustomStyle:{ top: "2.3rem" }

                            }

                        },
                        {
                            label:"Field Value",
                            isMandatory: false,
                            key:"fieldValue",
                            type:"text",
                            disable:false,
                            populators:{name:"fieldValue", error:"Required", validation: { pattern: {}, maxlength: 140 }}

                        }
                     ]

                },
                show: true,
                label:"",
                children:{}
            },

            searchResult:{
                tenantId: Digit.ULBService.getCurrentTenantId(),
                uiConfig:{
                    columns:[
                        {
                            label:"Name",
                            jsonPath:"data.name"
                        },
                        {
                            label:"Description",
                            jsonPath:"data.description"
                        },
                        {
                            label:"Executing Department",
                            jsonPath:"data.executingDepartment"
                        },
                        {
                             label:"Workflow Status",
                            jsonPath:"data.wfStatus"
                        }
                    ],
                    enableColumnSort: true,
                    enabelGlobalSearch:false,
                    resultsJsonPath:"mdms"
                },
                show:true
            }     


          }
     }
}