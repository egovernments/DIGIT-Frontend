export const SearchHouseholdConfig = {
  tenantId: 'mz',
  moduleName: 'commonHCMUiConfig',
  SearchHouseholdConfig: [
    {
      "label": "SEARCH_HOUSEHOLD",
      "type": "search",
      "actionLabel": "HCM_SEARCH_HOUSEHOLD",
      "actionRole": "SYSTEM_ADMINISTRATOR",
      "actionLink": "workbench-ui/employee/workbench/mdms-add-v2?moduleName=Health&masterName=Household",
      "apiDetails": {
        "serviceName": "/household/v1/_search",
        "requestParam": {
          "limit": 1,
          "offset": 0,
          "tenantId": "mz",
          "includeDeleted": true
        },
        "requestBody": {
          "Household": {
            "tenantId": "mz"
          }
        },
        "minParametersForSearchForm": 0,
        "masterName": "commonUiConfig",
        "moduleName": "SearchDefaultConfig",
        "tableFormJsonPath": "requestParam",
        "filterFormJsonPath": "requestBody.Household",
        "searchFormJsonPath": "requestBody.Household"
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
              "clientReferenceId": "",
              "boundaryCode": ""
            },
            "fields": [
              {
                "key": "CLIENT_ID",
                "label": "CLIENT_ID",
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
                    "pattern": "^[^\\$<>?\\\\~!@$%^()+={}\\[\\]*:;“”‘’]{1,100}$"
                  }
                }
              },
              {
                "key": "CLIENT_REF_ID",
                "label": "CLIENT_REF_ID",
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
                    "pattern": "^[^\\$<>?\\\\~!@$%^()+={}\\[\\]*:;“”‘’]{1,100}$"
                  }
                }
              },
              {
                "key": "BOUNDARY_CODE",
                "label": "BOUNDARY_CODE",
                "type": "text",
                "isMandatory": false,
                "disable": false,
                "preProcess": {
                  "convertStringToRegEx": ["populators.validation.pattern"]
                },
                "populators": {
                  "name": "boundaryCode",
                  "error": "COMMON_PATTERN_ERR_MSG_MUSTER_ID",
                  "validation": {
                    "pattern": "^[^\\$<>?\\\\~!@$%^()+={}\\[\\]*:;“”‘’]{1,100}$"
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
          "label": "Household",
          "uiConfig": {
            "columns": [
              {
                "label": "CLIENT_ID",
                "jsonPath": "id"
              },
              {
                "label": "CLIENT_REF_ID",
                "jsonPath": "clientReferenceId"
              },
              {
                "label": "BOUNDARY_CODE",
                "jsonPath": "boundaryCode"
              }
            ],
            "enableGlobalSearch": false,
            "enableColumnSort": true,
            "resultsJsonPath": "Households"
          },
          "children": {},
          "show": true
        }
      },
      "additionalSections": {}
    }
  ]
}