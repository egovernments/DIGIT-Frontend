export const SearchBillConfig = {
    "tenantId": "pg",
    "moduleName": "commonMuktaUiConfig",
    "SearchBillConfig": [
      {
        "label": "EXP_SEARCH_BILL",
        "type": "search",
        "actionLabel": "ES_COMMON_DOWNLOAD_PAYMENT_ADVICE",
        "actionRole": "BILL_ACCOUNTANT",
        "actionLink": "expenditure/download-bill",
        "apiDetails": {
          "serviceName": "/expense-calculator/v1/_search",
          "requestParam": {},
          "requestBody": {
            "searchCriteria": {}
          },
          "minParametersForSearchForm": 1,
          "masterName": "commonUiConfig",
          "moduleName": "SearchBillConfig",
          "tableFormJsonPath": "requestBody.pagination",
          "filterFormJsonPath": "requestBody.searchCriteria",
          "searchFormJsonPath": "requestBody.searchCriteria"
        },
        "sections": {
          "search": {
            "uiConfig": {
              "headerStyle": null,
              "primaryLabel": "ES_COMMON_SEARCH",
              "secondaryLabel": "ES_COMMON_CLEAR_SEARCH",
              "minReqFields": 1,
              "showFormInstruction": "BILL_SELECT_ONE_PARAM_TO_SEARCH",
              "formClassName": "custom-both-clear-search",
              "defaultValues": {
                "ward": "",
                "billType": "",
                "projectNumber": "",
                "billNumber": "",
                "status": "",
                "createdFrom": "",
                "createdTo": ""
              },
              "fields": [
                {
                  "label": "COMMON_WARD",
                  "type": "locationdropdown",
                  "isMandatory": false,
                  "disable": false,
                  "populators": {
                    "name": "ward",
                    "type": "ward",
                    "optionsKey": "i18nKey",
                    "allowMultiSelect": false,
                    "optionsCustomStyle": {
                      "top": "2.3rem"
                    }
                  }
                },
                {
                  "label": "WORKS_BILL_TYPE",
                  "type": "dropdown",
                  "isMandatory": false,
                  "disable": false,
                  "populators": {
                    "name": "billType",
                    "optionsKey": "name",
                    "optionsCustomStyle": {
                      "top": "2.3rem"
                    },
                    "mdmsConfig": {
                      "masterName": "BusinessService",
                      "moduleName": "expense",
                      "localePrefix": "COMMON_MASTERS_BILL",
                      "select": "(data)=>{ return Array.isArray(data['expense'].BusinessService) && data['expense'].BusinessService.filter(ele=>ele.code.includes('EXPENSE')).map(ele=>({...ele, name:'COMMON_MASTERS_BILL_TYPE_'+Digit.Utils.locale.getTransformedLocale(ele.code)}))}"
                    }
                  }
                },
                {
                  "label": "WORKS_PROJECT_ID",
                  "type": "text",
                  "isMandatory": false,
                  "disable": false,
                  "preProcess": {
                    "convertStringToRegEx": [
                      "populators.validation.pattern"
                    ]
                  },
                  "populators": {
                    "name": "projectNumber",
                    "error": "PROJECT_PATTERN_ERR_MSG",
                    "validation": {
                      "pattern": "PJ\\/[0-9]+-[0-9]+\\/[0-9]+\\/[0-9]+",
                      "minlength": 2
                    }
                  }
                },
                {
                  "label": "WORKS_BILL_NUMBER",
                  "type": "text",
                  "isMandatory": false,
                  "disable": false,
                  "populators": {
                    "name": "billNumber",
                    "error": "ES_COMMON_BILL_PATTERN_ERR_MSG",
                    "validation": {
                      "pattern": "^[A-Za-z0-9\\/-]*$",
                      "minlength": 2
                    }
                  }
                },
                {
                  "label": "CORE_COMMON_STATUS",
                  "type": "apidropdown",
                  "isMandatory": false,
                  "disable": false,
                  "populators": {
                    "optionsCustomStyle": {
                      "top": "2.3rem"
                    },
                    "name": "status",
                    "optionsKey": "i18nKey",
                    "allowMultiSelect": false,
                    "masterName": "commonUiConfig",
                    "moduleName": "SearchBillConfig",
                    "customfn": "populateReqCriteria"
                  }
                },
                {
                  "label": "ES_COMMON_CREATED_FROM",
                  "type": "date",
                  "isMandatory": false,
                  "disable": false,
                  "key": "createdFrom",
                  "preProcess": {
                    "updateDependent": [
                      "populators.max"
                    ]
                  },
                  "populators": {
                    "name": "createdFrom",
                    "max": "currentDate"
                  }
                },
                {
                  "label": "ES_COMMON_CREATED_TO",
                  "type": "date",
                  "isMandatory": false,
                  "disable": false,
                  "key": "createdTo",
                  "preProcess": {
                    "updateDependent": [
                      "populators.max"
                    ]
                  },
                  "populators": {
                    "name": "createdTo",
                    "error": "DATE_VALIDATION_MSG",
                    "max": "currentDate"
                  },
                  "additionalValidation": {
                    "type": "date",
                    "keys": {
                      "start": "createdFrom",
                      "end": "createdTo"
                    }
                  }
                }
              ]
            },
            "label": "",
            "children": {},
            "show": true
          },
          "searchResult": {
            "label": "",
            "uiConfig": {
              "columns": [
                {
                  "label": "WORKS_BILL_NUMBER",
                  "jsonPath": "bill.billNumber",
                  "additionalCustomization": true
                },
                {
                  "label": "WORKS_PROJECT_ID",
                  "jsonPath": "projectNumber"
                },
                {
                  "label": "ES_COMMON_LOCATION",
                  "jsonPath": "bill.tenantId",
                  "additionalCustomization": true
                },
                {
                  "label": "ES_COMMON_CBO_NAME",
                  "jsonPath": "additionalDetails.orgName"
                },
                {
                  "label": "WORKS_BILL_TYPE",
                  "jsonPath": "bill.businessService",
                  "additionalCustomization": true
                },
                {
                  "label": "CORE_COMMON_STATUS",
                  "jsonPath": "bill.wfStatus",
                  "additionalCustomization": true
                },
                {
                  "label": "EXP_BILL_AMOUNT",
                  "jsonPath": "bill.totalAmount",
                  "additionalCustomization": true,
                  "headerAlign": "right"
                }
              ],
              "enableGlobalSearch": false,
              "enableColumnSort": true,
              "resultsJsonPath": "bills",
              "showCheckBox": true,
              "checkBoxActionLabel": "ES_COMMON_GENERATE_PAYMENT_ADVICE",
              "showTableInstruction": "EXP_DOWNLOAD_BILL_INSTRUCTION"
            },
            "children": {},
            "show": true
          }
        },
        "additionalSections": {}
      }
    ]
  }