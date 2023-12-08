export const SearchProjectStaff = {
  "tenantId": "mz",
  "moduleName": "commonHCMUiConfig",
  "SearchProjectStaffConfig": [
    {
      "label": "SEARCH_PROJECT_STAFF",
      "type": "search",
      "actionLabel": "HCM_SEARCH_HOUSEHOLD",
      "actionRole": "SYSTEM_ADMINISTRATOR",
      "actionLink": "workbench-ui/employee/workbench/mdms-add-v2?moduleName=Health&masterName=ProjectStaff",
      "apiDetails": {
        "serviceName": "/project/staff/v1/_search",
        "requestParam": {
          "limit": 10,
          "offset": 10,
          "tenantId": "mz"
        },
        "requestBody": {
          "ProjectStaff": {

          },
          "tenantId": "mz",
          "limit": 10,
          "offset": 10,
        },
        "minParametersForSearchForm": 0,
        "masterName": "commonUiConfig",
        "moduleName": "SearchDefaultConfig",
        "tableFormJsonPath": "requestParam",
        "filterFormJsonPath": "requestBody.ProjectStaff",
        "searchFormJsonPath": "requestBody.ProjectStaff"
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
              "id": "",
              "userId": "",
              "projectId": "",
              "startDate": "",
              "endDate": ""
            },
            "fields": [
              {
                "key": "ID",
                "label": "ID",
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
                "key": "USER_ID",
                "label": "USER_ID",
                "type": "text",
                "isMandatory": false,
                "disable": false,
                "preProcess": {
                  "convertStringToRegEx": ["populators.validation.pattern"]
                },
                "populators": {
                  "name": "userId",
                  "error": "COMMON_PATTERN_ERR_MSG_MUSTER_ID",
                  "validation": {
                    "pattern": "^[^\\$\"<>?\\\\~`!@$%^()+={}\\[\\]*:;“”‘’]{1,50}$"
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
                "key": "START_DATE",
                "label": "START_DATE",
                "type": "date",
                "isMandatory": false,
                "disable": false,
                "populators": {
                  "name": "startDate",
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
                  "name": "endDate",
                  "error": "COMMON_PATTERN_ERR_MSG_MUSTER_ID",
                  "validation": {}
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
                "label": "USER_ID",
                "jsonPath": "userId"
              },
              {
                "label": "PROJECT_ID",
                "jsonPath": "projectId"
              },
              {
                "label": "START_DATE",
                "jsonPath": "startDate"
              },
              {
                "label": "END_DATE",
                "jsonPath": "endDate"
              }
            ],
            "enableGlobalSearch": false,
            "enableColumnSort": true,
            "resultsJsonPath": "ProjectStaff"
          },
          "children": {},
          "show": true
        }
      },
      "additionalSections": {}
    }
  ]
}