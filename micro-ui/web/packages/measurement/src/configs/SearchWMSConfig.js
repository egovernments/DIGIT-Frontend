const SearchMeasurementConfig = () => {
    return {
      label: "MB_SEARCH_MEASUREMENT",
      type: "search",
      apiDetails: {
        serviceName: "/wms/measurement-service/_search",
        requestParam: {},
        requestBody: {
        //   apiOperation: "SEARCH",
          inbox: {
            "tenantId": Digit.ULBService.getCurrentTenantId(),
            "limit": 10,
             "offset": 0,
            "moduleSearchCriteria":{
            "tenantId": Digit.ULBService.getCurrentTenantId()
          }},
        },
        minParametersForSearchForm: 1,
        masterName: "commonUiConfig",
        moduleName: "WMSSearchMeasurementConfig",

        tableFormJsonPath: "requestParam",
        filterFormJsonPath: "requestBody.inbox.moduleSearchCriteria",
        searchFormJsonPath: "requestBody.inbox.moduleSearchCriteria",
        
      },
      sections: {
        search: {
          uiConfig: {
            headerStyle: null,
            formClassName:"custom-both-clear-search",
            primaryLabel: "ES_COMMON_SEARCH",
            secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
            minReqFields: 1,
            defaultValues: {
              ward: "",
              MBNumber: "",
              measurementNumber: "",
              projectName: "",
              referenceId: "",
              status: "",
              MBReference: "",
              createdFrom: "",
              createdTo: "",

            },
            fields: [
              {

                label: "MB_WARD",

                type: "locationdropdown",
                isMandatory: false,
                disable: false,
                populators: {
                    name: "ward",
                    type: "ward",
                  optionsKey: "i18nKey",
                    defaultText: "COMMON_SELECT_WARD",
                    selectedText: "COMMON_SELECTED",
                    allowMultiSelect: false
                }
            },
              {
                label: "MB_PROJECT_NAME",
                type: "text",
                isMandatory: false,
                disable: false,
                populators: { name: "projectName", validation: { pattern: /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{1,50}$/i, maxlength: 140 } },
              },
              {
                label: "MB_NUMBER",
                type: "text",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "measurementNumber",
                  error: `PROJECT_PATTERN_ERR_MSG`,
                  validation: {  minlength: 2 },
                },
              },
              {
                label: "MB_REFERENCE_NUMBER",
                type: "text",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "referenceId",
                  error: `PROJECT_PATTERN_ERR_MSG`,
                  validation: {  minlength: 2 },
                },
              },
           
              // {
              //   label: "MB_STATUS",
              //   type: "apidropdown",
              //   isMandatory: false,
              //   disable: false,
              //   populators: {
              //     name: "status",
              //     optionsKey: "i18nKey",
              //     optionsCustomStyle: {
              //       top: "2.3rem",
              //     },
              //     mdmsConfig: {
              //       masterName: "commonUiConfig",
              //       moduleName: "SearchBillWMSConfig",
              //       localePrefix: "MASTERS",
              //     },
              //   },
              // },
              {
                label: "MB_STATUS",
                type: "apidropdown",
                isMandatory: false,
                disable: false,
                populators: {
                  optionsCustomStyle: {
                    top: "2.3rem",
                  },
                  name: "status",
                  optionsKey: "i18nKey",
                  allowMultiSelect: false,
                  masterName: "commonUiConfig",
                  moduleName: "WMSSearchMeasurementConfig", //update this based on 
                  customfn: "populateReqCriteria",
                }
            },
              {
                label: "CREATED_FROM_DATE",
                type: "date",
                isMandatory: false,
                disable: false,
                key : "createdFrom",
                preProcess : {
                  updateDependent : ["populators.max"]
                },
                populators: {
                  name: "createdFrom",
                  max : "currentDate"
                },
              },
              {
                label: "CREATED_TO_DATE",
                type: "date",
                isMandatory: false,
                disable: false,
                key : "createdTo",
                preProcess : {
                  updateDependent : ["populators.max"]
                },
                populators: {
                  name: "createdTo",
                  error: "DATE_VALIDATION_MSG",
                  max : "currentDate"
                },
                additionalValidation: {
                  type: "date",
                  keys: { start: "createdFrom", end: "createdTo" },
                },
              },
            ],
          },
          label: "",
          children: {},
          show: true,
        },
        searchResult: {
          label: "",
          uiConfig: {
            columns: [
              {
                 label: "MB_NUMBER",
                 jsonPath: "ProcessInstance.businessId",
                 additionalCustomization: true,
              },
              {
                label: "MB_REFERENCE_NUMBER",
                jsonPath: "businessObject.referenceId",
              },
              {
                label: "MB_PROJECT_NAME",
                jsonPath: "businessObject.contract.additionalDetails.projectName",
              },
              {
                label: "MB_NAME_CBO",
                jsonPath: "businessObject.contract.additionalDetails.orgName",

                // additionalCustomization: true,
              },
              {
                label: "MB_STATUS",
                jsonPath: "ProcessInstance.state.applicationStatus",
                additionalCustomization: true,
              },
              {
                label: "MB_AMOUNT",
                jsonPath: "businessObject.additionalDetails.totalAmount",

                additionalCustomization: true,
              },
            
            ],
            enableGlobalSearch: false,
            enableColumnSort: true,
            resultsJsonPath: "items",
          },
          children: {},
          show: true,
        },
      },
      additionalSections: {},
    };
  };
  
  export default SearchMeasurementConfig;