export const SearchPaymentInstructionConfig = {
    "tenantId": "pg",
    "moduleName": "commonMuktaUiConfig",
    "SearchPaymentInstructionConfig": [
      {
        "label": "EXP_SEARCH_PAYMENT_INS",
        "type": "search",
        "apiDetails": {
          "serviceName": "/wms/ifms-pi/_search",
          "requestParam": {},
          "requestBody": {
            "inbox": {
              "moduleSearchCriteria": {}
            }
          },
          "minParametersForSearchForm": 1,
          "masterName": "commonUiConfig",
          "moduleName": "SearchPIWMS",
          "tableFormJsonPath": "requestBody.inbox",
          "filterFormJsonPath": "requestBody.inbox.moduleSearchCriteria",
          "searchFormJsonPath": "requestBody.inbox.moduleSearchCriteria"
        },
        "sections": {
          "search": {
            "uiConfig": {
              "additionalTabs":[
                {
                  "uiConfig": {
                    "navLink":"Open Search",
                    "headerStyle": null,
                    "primaryLabel": "ES_COMMON_SEARCH",
                    "secondaryLabel": "ES_COMMON_CLEAR_SEARCH",
                    "minReqFields": 1,
                    "showFormInstruction": "PAYMENT_INS_SELECT_ONE_PARAM_TO_SEARCH",
                    "defaultValues": {
                      "piType": "",
                      "jitBillNo": "",
                      "billNumber": "",
                      "status": "",
                      "createdFrom": "",
                      "createdTo": ""
                    },
                    "fields": [
                      {
                        "label": "WORKS_PI_TYPE",
                        "type": "dropdown",
                        "isMandatory": false,
                        "disable": false,
                        "populators": {
                          "name": "piType",
                          "optionsKey": "name",
                          "optionsCustomStyle": {
                            "top": "2.3rem"
                          },
                          "mdmsConfig": {
                            "masterName": "PaymentInstructionType",
                            "moduleName": "expense",
                            "localePrefix": "EXP_PI_TYPE",
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
                        "label": "EXP_PI_ID",
                        "type": "text",
                        "isMandatory": false,
                        "disable": false,
                        "preProcess": {
                          "convertStringToRegEx": [
                            "populators.validation.pattern"
                          ]
                        },
                        "populators": {
                          "name": "jitBillNo",
                          // "error": "PROJECT_PATTERN_ERR_MSG",
                          // "validation": {
                          //   "pattern": "PI\\/[0-9]+-[0-9]+\\/[0-9]+\\/[0-9]+",
                          //   "minlength": 2
                          // }
                        }
                      },
                      {
                        "label": "CORE_COMMON_STATUS",
                        "type": "dropdown",
                        "isMandatory": false,
                        "disable": false,
                        "populators": {
                          "name": "status",
                          "optionsKey": "name",
                          "optionsCustomStyle": {
                            "top": "2.3rem"
                          },
                          "mdmsConfig": {
                            "masterName": "PaymentInstructionStatus",
                            "moduleName": "expense",
                            "localePrefix": "EXP_PI_STATUS",
                          }
                        }
                      },
                      {
                        "label": "CREATED_FROM_DATE",
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
                        "label": "CREATED_TO_DATE",
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
                  }
                }
              ],
              "configNavItems":[{
                    "name": "Pending for action",
                    "code": "PENDING_FOR_ACTION",
                    "activeByDefault": true,
                    "minParametersForSearchForm":0
                },
                {
                    "name": "Open Search",
                    "code": "OPEN_SEARCH",
                    "minParametersForSearchForm":1
                }
              ],
              "horizontalLine":true,
              "navLink":"Pending for action",
              "headerStyle": null,
              "primaryLabel": "ES_COMMON_SEARCH",
              "secondaryLabel": "ES_COMMON_CLEAR_SEARCH",
              "minReqFields": 0,
              "showFormInstruction": "PAYMENT_INS_SELECT_ONE_PARAM_TO_SEARCH",
              "defaultValues": {
                "piType": "",
                "jitBillNo": "",
                "billNumber": "",
                "status": "",
                "createdFrom": "",
                "createdTo": ""
              },
              "fields": [
                {
                  "label": "WORKS_PI_TYPE",
                  "type": "dropdown",
                  "isMandatory": false,
                  "disable": false,
                  "populators": {
                    "name": "piType",
                    "optionsKey": "name",
                    "optionsCustomStyle": {
                      "top": "2.3rem"
                    },
                    "mdmsConfig": {
                      "masterName": "PaymentInstructionType",
                      "moduleName": "expense",
                      "localePrefix": "EXP_PI_TYPE",
                    }
                  }
                },
                // {
                //   "label": "WORKS_PROJECT_ID",
                //   "type": "text",
                //   "isMandatory": false,
                //   "disable": false,
                //   "preProcess": {
                //     "convertStringToRegEx": [
                //       "populators.validation.pattern"
                //     ]
                //   },
                //   "populators": {
                //     "name": "projectNumber",
                //     "error": "PROJECT_PATTERN_ERR_MSG",
                //     "validation": {
                //       "pattern": "PJ\\/[0-9]+-[0-9]+\\/[0-9]+\\/[0-9]+",
                //       "minlength": 2
                //     }
                //   }
                // },
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
                  "label": "EXP_PI_ID",
                  "type": "text",
                  "isMandatory": false,
                  "disable": false,
                  "preProcess": {
                    "convertStringToRegEx": [
                      "populators.validation.pattern"
                    ]
                  },
                  "populators": {
                    "name": "jitBillNo",
                    // "error": "PROJECT_PATTERN_ERR_MSG",
                    // "validation": {
                    //   "pattern": "PI\\/[0-9]+-[0-9]+\\/[0-9]+\\/[0-9]+",
                    //   "minlength": 2
                    // }
                  }
                },
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
                  "label": "EXP_PI_ID",
                  "jsonPath": "businessObject.jitBillNo",
                  "additionalCustomization": true
                },
                {
                  "label": "EXP_PI_DATE",
                  "jsonPath": "businessObject.auditDetails.createdTime",
                  "additionalCustomization":true
                },
                {
                  "label": "EXP_NO_BENE",
                  "jsonPath": "businessObject.numBeneficiaries",
                  
                },
                {
                  "label": "EXP_NO_SUCC_PAYMENTS",
                  "jsonPath": "businessObject.beneficiaryDetails",
                  "additionalCustomization": true
                },
                {
                  "label": "EXP_NO_FAIL_PAYMENTS",
                  "jsonPath": "businessObject",
                  "additionalCustomization": true
                },
                {
                  "label": "CORE_COMMON_STATUS",
                  "jsonPath": "businessObject.piStatus",
                  "additionalCustomization": true
                },
                {
                  "label": "ES_COMMON_TOTAL_AMOUNT",
                  "jsonPath": "businessObject.netAmount",
                  "additionalCustomization": true,
                  "headerAlign": "right"
                }
              ],
              "enableGlobalSearch": false,
              "enableColumnSort": true,
              "resultsJsonPath": "items"
            },
            "children": {},
            "show": true
          }
        },
        "additionalSections": {}
      }
    ]
  }