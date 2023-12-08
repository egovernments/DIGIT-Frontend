export const SearchProjectBeneficiary = {
  "tenantId": "mz",
  "moduleName": "commonHCMUiConfig",
  "SearchProjectBeneficiaryConfig": [
    {
      "label": "SEARCH_BENEFICIARY",
      "type": "search",
      "actionLabel": "HCM_ADD_PROJECT_BENEFICIARY",
        "actionRole": "SYSTEM_ADMINISTRATOR",
        "actionLink": "workbench-ui/employee/workbench/mdms-add-v2?moduleName=Health&masterName=ProjectBeneficiary",
      "apiDetails": {
        "serviceName": "/project/beneficiary/v1/_search",
        "requestParam": {
          "limit": 1,
          "offset": 0,
          "tenantId": "mz",
          "includeDeleted": true
        },
        "requestBody": {
          "ProjectBeneficiary": {
          },
          "limit": 1,
          "offset": 0,
          "tenantId": "mz",
          "includeDeleted": true
        },
        "minParametersForSearchForm": 0,
        "masterName": "commonUiConfig",
        "moduleName": "SearchDefaultConfig",
        "tableFormJsonPath": "requestBody",
        "filterFormJsonPath": "requestBody.ProjectBeneficiary",
        "searchFormJsonPath": "requestBody.ProjectBeneficiary"
      },
      "sections": {
        "search": {
          "uiConfig": {
            "headerStyle": null,
            "primaryLabel": "ES_COMMON_SEARCH",
            "secondaryLabel": "ES_COMMON_CLEAR_SEARCH",
            "minReqFields": 0,
            "formClassName": "custom-both-clear-search",
            "defaultValues": {
              "id": [""],
              "clientReferenceId": "",
              "projectId": "",
              "beneficiaryId": "",
              "dateOfRegistration": ""
            },
            "fields": [
              {
                "key": "ID",
                "label": "ID",
                "type": "text",
                "isMandatory": true,
                "disable": false,
                "preProcess": {
                  "convertStringToRegEx": ["populators.validation.pattern"]
                },
                "populators": {
                  "name": "id",
                  "error": "PROJECT_PATTERN_ERR_MSG",
                  "validation": {
                    "pattern": "^[^\\$<>?\\\\~!@$%^()+={}\\[\\]*:;“”‘’]{1,50}$"
                  }
                }
              },
              {
                "key": "CLIENT_REFERENCE_ID",
                "label": "CLIENT_REFERENCE_ID",
                "type": "text",
                "isMandatory": false,
                "disable": false,
                "preProcess": {
                  "convertStringToRegEx": ["populators.validation.pattern"]
                },
                "populators": {
                  "name": "clientReferenceId",
                  "error": "COMMON_PATTERN_ERR_MSG_MUSTER_ID",
                  "validation": {
                    "pattern": "^[^\\$<>?\\\\~!@$%^()+={}\\[\\]*:;“”‘’]{1,50}$"
                  }
                }
              },
              {
                "key": "PROJECT_ID",
                "label": "PROJECT_ID",
                "type": "text",
                "isMandatory": false,
                "disable": false,
                "preProcess": {
                  "convertStringToRegEx": ["populators.validation.pattern"]
                },
                "populators": {
                  "name": "projectId",
                  "error": "COMMON_PATTERN_ERR_MSG_MUSTER_ID",
                  "validation": {
                    "pattern": "^[^\\$<>?\\\\~!@$%^()+={}\\[\\]*:;“”‘’]{1,50}$"
                  }
                }
              },
              {
                "key": "BENEFICIARY_ID",
                "label": "BENEFICIARY_ID",
                "type": "text",
                "isMandatory": false,
                "disable": false,
                "preProcess": {
                  "convertStringToRegEx": ["populators.validation.pattern"]
                },
                "populators": {
                  "name": "beneficiaryId",
                  "error": "COMMON_PATTERN_ERR_MSG_MUSTER_ID",
                  "validation": {
                    "pattern": "^[^\\$<>?\\\\~!@$%^()+={}\\[\\]*:;“”‘’]{1,50}$"
                  }
                }
              },
              {
                "key": "REGISTRATION_DATE",
                "label": "REGISTRATION_DATE",
                "type": "date",
                "isMandatory": false,
                "disable": false,
                "populators": {
                  "name": "dateOfRegistration",
                  "error": "COMMON_PATTERN_ERR_MSG_MUSTER_ID"
                  // "validation": {
                  //   "required": true
                  // }
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
                "label": "ID",
                "jsonPath": "id"
              },
              {
                "label": "CLIENT_REFERENCE_ID",
                "jsonPath": "clientReferenceId"
              },
              {
                "label": "PROJECT_ID",
                "jsonPath": "projectId"
              },
              {
                "label": "BENEFICIARY_ID",
                "jsonPath": "beneficiaryId"
              },
              {
                "label": "REGISTRATION_DATE",
                "jsonPath": "dateOfRegistration"
              }
            ],
            "enableGlobalSearch": false,
            "enableColumnSort": true,
            "resultsJsonPath": "ProjectBeneficiaries"
          },
          "children": {},
          "show": true
        }
      },
      "additionalSections": {}
    }
  ]
}