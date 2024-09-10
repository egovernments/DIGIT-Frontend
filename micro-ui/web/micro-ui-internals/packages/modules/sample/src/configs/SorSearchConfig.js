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
                    //  "customs":{}
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
                                name:"typeOfFilterr",
                                error:"Required",
                                options:[
                                    {
                                      label:"Id",
                                      name:"Id"
                                    },
                                    {
                                        label:"Campaign Type",
                                        name:"campaignType"
                                    },
                                    {
                                        label:"Distribution Process",
                                        name:"distributionProcess"
                                    },
                                    {
                                        label:"Registration Process",
                                        name:"registration"
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
                            label:"Id",
                            jsonPath:"data.schemaCode"
                        },
                        {
                            label:"Campaign Type",
                            jsonPath:"data.campaignType"
                        },
                        {
                            label:"Distribution Process",
                            jsonPath:"data.DistributionProcess"
                        },
                        {
                             label:"Registration Process",
                            jsonPath:"data.RegistrationProcess"
                        }
                    ],
                    enableColumnSort: true,
                    enableGlobalSearch:true,
                    resultsJsonPath:"mdms"
                },
                show:true   
            }     


          }
     }
}