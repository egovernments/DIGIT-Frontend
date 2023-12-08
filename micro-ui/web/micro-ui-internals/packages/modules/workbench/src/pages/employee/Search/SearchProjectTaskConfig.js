export const SearchProjectTask = {
  "tenantId": "mz",
  "moduleName": "commonHCMUiConfig",
  "SearchProjectTaskConfig": [
    {
      "label": "SEARCH_TASK",
      "type": "search",
      "actionLabel": "HCM_SEARCH_HOUSEHOLD",
      "actionRole": "SYSTEM_ADMINISTRATOR",
      "actionLink": "workbench-ui/employee/workbench/mdms-add-v2?moduleName=Health&masterName=ProjectTask",
      "apiDetails": {
        "serviceName": "/project/task/v1/_search",
        "requestParam": {
          "limit": 10,
          "offset": 0,
          "tenantId": "mz",
          "includeDeleted": true
        },
        "requestBody": {
          "tenantId": "mz",
          "Task": {

          }
        },
        "minParametersForSearchForm": 0,
        "masterName": "commonUiConfig",
        "moduleName": "SearchDefaultConfig",
        "tableFormJsonPath": "requestParam",
        "filterFormJsonPath": "requestBody.Task",
        "searchFormJsonPath": "requestBody.Task"
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
              "clientReferenceId": [""],
              "projectId": "",
              "projectBeneficiaryId": "",
              "plannedStartDate": "",
              "plannedEndDate": "",
              "actualStartDate": "",
              "actualEndDate": "",
              "localityCode": "",
              "status": ""
            },
            "fields": [
              {
                "key": "TASK_ID",
                "label": "TASK_ID",
                "type": "text",
                "isMandatory": false,
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
                "key": "PROJECT_BENEFICIARY_ID",
                "label": "PROJECT_BENEFICIARY_ID",
                "type": "text",
                "isMandatory": false,
                "disable": false,
                "preProcess": {
                  "convertStringToRegEx": ["populators.validation.pattern"]
                },
                "populators": {
                  "name": "projectBeneficiaryId",
                  "error": "COMMON_PATTERN_ERR_MSG_MUSTER_ID",
                  "validation": {
                    "pattern": "^[^\\$<>?\\\\~!@$%^()+={}\\[\\]*:;“”‘’]{1,50}$"
                  }
                }
              },
              {
                "key": "START_DATE",
                "label": "START_DATE",
                "type": "date",
                "isMandatory": false,
                "disable": false,
                "populators": {
                  "name": "plannedStartDate",
                  "error": "COMMON_PATTERN_ERR_MSG_MUSTER_ID",
                  "validation": {}
                }
              },
              {
                "key": "END_DATE",
                "label": "END_DATE",
                "type": "date",
                "isMandatory": false,
                "disable": false,
                "populators": {
                  "name": "plannedEndDate",
                  "error": "COMMON_PATTERN_ERR_MSG_MUSTER_ID",
                  "validation": {}
                }
              },
              {
                "key": "ACTUAL_START_DATE",
                "label": "ACTUAL_START_DATE",
                "type": "date",
                "isMandatory": false,
                "disable": false,
                "populators": {
                  "name": "actualStartDate",
                  "error": "COMMON_PATTERN_ERR_MSG_MUSTER_ID",
                  "validation": {}
                }
              },
              {
                "key": "ACTUAL_END_DATE",
                "label": "ACTUAL_END_DATE",
                "type": "date",
                "isMandatory": false,
                "disable": false,
                "populators": {
                  "name": "actualEndDate",
                  "error": "COMMON_PATTERN_ERR_MSG_MUSTER_ID",
                  "validation": {}
                }
              },
              {
                "key": "LOCALITY_CODE",
                "label": "LOCALITY_CODE",
                "type": "text",
                "isMandatory": false,
                "disable": false,
                "preProcess": {
                  "convertStringToRegEx": ["populators.validation.pattern"]
                },
                "populators": {
                  "name": "localityCode",
                  "error": "COMMON_PATTERN_ERR_MSG_MUSTER_ID",
                  "validation": {
                    "pattern": "^[^\\$<>?\\\\~!@$%^()+={}\\[\\]*:;“”‘’]{1,50}$"
                  }
                }
              },
              {
                "key": "STATUS",
                "label": "STATUS",
                "type": "text",
                "isMandatory": false,
                "disable": false,
                "preProcess": {
                  "convertStringToRegEx": ["populators.validation.pattern"]
                },
                "populators": {
                  "name": "status",
                  "error": "COMMON_PATTERN_ERR_MSG_MUSTER_ID",
                  "validation": {
                    "pattern": "^[^\\$<>?\\\\~!@$%^()+={}\\[\\]*:;“”‘’]{1,50}$"
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
                "label": "TASK_ID",
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
                "label": "PROJECT_BENEFICIARY_ID",
                "jsonPath": "projectBeneficiaryId"
              },
              {
                "label": "START_DATE",
                "jsonPath": "plannedStartDate"
              },
              {
                "label": "END_DATE",
                "jsonPath": "plannedEndDate"
              },
              {
                "label": "ACTUAL_START_DATE",
                "jsonPath": "actualStartDate"
              },
              {
                "label": "ACTUAL_END_DATE",
                "jsonPath": "actualEndDate"
              },
              {
                "label": "LOCALITY_CODE",
                "jsonPath": "localityCode"
              },
              {
                "label": "STATUS",
                "jsonPath": "status"
              }
            ],
            "enableGlobalSearch": false,
            "enableColumnSort": true,
            "resultsJsonPath": "Tasks"
          },
          "children": {},
          "show": true
        }
      },
      "additionalSections": {}
    }
  ]
}