export const InboxPaymentInstructionConfig = {
    "tenantId": "pg",
    "moduleName": "commonMuktaUiConfig",
    "InboxPaymentInstructionConfig": [
      {
        "label": "ES_COMMON_INBOX",
        "postProcessResult": false,
        "type": "inbox",
        "apiDetails": {
          "serviceName": "/expense/payment/v1/_search",
          "requestParam": {},
          "requestBody": {
            "paymentCriteria": {
              
            }
          },
          "minParametersForSearchForm": 0,
          "masterName": "commonUiConfig",
          "moduleName": "SearchPaymentInstruction",
          "tableFormJsonPath": "requestBody",
          "filterFormJsonPath": "requestBody.paymentCriteria",
          "searchFormJsonPath": "requestBody.paymentCriteria"
        },
        "sections": {
          "search": {
            "uiConfig": {
              "headerStyle": null,
              "primaryLabel": "ES_COMMON_SEARCH",
              "secondaryLabel": "ES_COMMON_CLEAR_SEARCH",
              "minReqFields": 0,
              "defaultValues": {
                "billNumber": "",
                "projectName": "",
                "projectType": ""
              },
              "fields": [
                {
                  "label": "WORKS_BILL_NUMBER",
                  "type": "text",
                  "isMandatory": false,
                  "disable": false,
                  "preProcess": {
                    "convertStringToRegEx": [
                      "populators.validation.pattern"
                    ]
                  },
                  "populators": {
                    "name": "billNumber",
                    "error": "Enter valid bill number",
                    "validation": {
                      "pattern": "^[A-Za-z0-9\\/-]*$",
                      "minlength": 2
                    }
                  }
                },
                {
                  "label": "WORKS_PROJECT_NAME",
                  "type": "text",
                  "isMandatory": false,
                  "disable": false,
                  "preProcess": {
                    "convertStringToRegEx": [
                      "populators.validation.pattern"
                    ]
                  },
                  "populators": {
                    "name": "projectName",
                    "error": "PROJECT_PATTERN_ERR_MSG",
                    "validation": {
                      "pattern": "^[^\\$\"<>?\\\\~`!@$%^()+={}\\[\\]*:;“”‘’]{1,50}$",
                      "minlength": 2
                    }
                  }
                },
                {
                  "label": "WORKS_PI_TYPE",
                  "type": "dropdown",
                  "isMandatory": false,
                  "disable": false,
                  "populators": {
                    "name": "projectType",
                    "optionsKey": "name",
                    "optionsCustomStyle": {
                      "top": "2.3rem"
                    },
                    "mdmsConfig": {
                      "masterName": "ProjectType",
                      "moduleName": "works",
                      "localePrefix": "COMMON_MASTERS"
                    }
                  }
                },
              ]
            },
            "label": "",
            "children": {},
            "show": true
          },
          "links": {
            "uiConfig": {
              "links": [
                {
                  "text": "EXP_CREATE_PI",
                  "url": "/employee/expenditure/view-payment-instruction",
                  "roles": []
                },
                {
                  "text": "EXP_SEARCH_PAYMENT_INS",
                  "url": "/employee/expenditure/search-payment-instruction",
                  "roles": []
                }
              ],
              "label": "MUKTA",
              "logoIcon": {
                "component": "ExpenditureIcon",
                "customClass": "inbox-links-icon"
              }
            },
            "children": {},
            "show": true
          },
          "filter": {
            "uiConfig": {
              "type": "filter",
              "headerStyle": null,
              "primaryLabel": "ES_COMMON_APPLY",
              "minReqFields": 0,
              "secondaryLabel": "",
              "defaultValues": {
                "assignee": {
                  "code": "ASSIGNED_TO_ALL",
                  "name": "COMMON_INBOX_ASSIGNED_TO_ALL"
                },
                "state": ""
              },
              "fields": [
                {
                  "label": "",
                  "type": "radio",
                  "isMandatory": false,
                  "disable": false,
                  "populators": {
                    "name": "assignee",
                    "options": [
                      {
                        "code": "ASSIGNED_TO_ME",
                        "name": "COMMON_INBOX_ASSIGNED_TO_ME"
                      },
                      {
                        "code": "ASSIGNED_TO_ALL",
                        "name": "COMMON_INBOX_ASSIGNED_TO_ALL"
                      }
                    ],
                    "optionsKey": "name",
                    "styles": {
                      "gap": "1rem",
                      "flexDirection": "column"
                    },
                    "innerStyles": {
                      "display": "flex"
                    }
                  }
                },
                {
                  "label": "COMMON_WARD",
                  "type": "locationdropdown",
                  "isMandatory": false,
                  "disable": false,
                  "populators": {
                    "name": "ward",
                    "type": "ward",
                    "optionsKey": "name",
                    "defaultText": "COMMON_SELECT_WARD",
                    "selectedText": "COMMON_SELECTED",
                    "allowMultiSelect": true,
                    "optionsCustomStyle": {
                      "top": "2.3rem"
                    }
                  }
                },
                {
                  "label": "COMMON_LOCALITY",
                  "type": "locationdropdown",
                  "isMandatory": false,
                  "disable": false,
                  "populators": {
                    "name": "locality",
                    "type": "locality",
                    "optionsKey": "name",
                    "defaultText": "COMMON_SELECT_LOCALITY",
                    "selectedText": "COMMON_SELECTED",
                    "allowMultiSelect": true
                  }
                },
                {
                  "type": "workflowstatesfilter",
                  "isMandatory": false,
                  "disable": false,
                  "populators": {
                    "componentLabel": "COMMON_WORKFLOW_STATES",
                    "name": "state",
                    "labelPrefix": "WF_"
                  }
                }
              ]
            },
            "label": "ES_COMMON_FILTERS",
            "show": true
          },
          "searchResult": {
            "label": "",
            "uiConfig": {
              "columns": [
                {
                  "label": "EXP_PI_ID",
                  "jsonPath": "businessObject.billNumber",
                  // "additionalCustomization": true
                },
                {
                  "label": "EXP_PI_DATE",
                  "jsonPath": "businessObject.additionalDetails.projectName",
                  // "additionalCustomization": true
                },
                {
                  "label": "EXP_NO_BENE",
                  "jsonPath": "businessObject.additionalDetails",
                  // "additionalCustomization": true
                },
                {
                  "label": "EXP_NO_SUCC_PAYMENTS",
                  "jsonPath": "businessObject.additionalDetails.orgName"
                },
                {
                  "label": "EXP_NO_FAIL_PAYMENTS",
                  "jsonPath": "ProcessInstance.businessService",
                  // "additionalCustomization": true
                },
                {
                  "label": "CORE_COMMON_STATUS",
                  "jsonPath": "businessObject.paymentStatus",
                  // "additionalCustomization": true
                },
                {
                  "label": "ES_COMMON_TOTAL_AMOUNT",
                  "jsonPath": "businessObject.totalAmount",
                  // "additionalCustomization": true,
                  "headerAlign": "right"
                }
              ],
              "enableGlobalSearch": false,
              "enableColumnSort": true,
              "resultsJsonPath": "payments",
            },
            "children": {},
            "show": true
          }
        },
        "additionalSections": {}
      }
    ]
  }