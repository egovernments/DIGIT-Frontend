export const SearchProductConfig = {
  "tenantId": "mz",
  "moduleName": "commonHCMUiConfig",
  "SearchProductConfig": [
    {
      "label": "SEARCH_PRODUCT",
      "type": "search",
      "actionLabel": "HCM_ADD_PRODUCT",
      "actionRole": "SYSTEM_ADMINISTRATOR",
      "actionLink": "workbench-ui/employee/workbench/mdms-add-v2?moduleName=Health&masterName=Product",
      "apiDetails": {
        "serviceName": "/product/v1/_search",
        "requestParam": {
          "limit": 10,
          "offset": 0,
          "tenantId": "mz"
        },
        "requestBody": {
          "Product": {
          },

          "apiOperation": "SEARCH",
          // "limit": 10,
          // "offset": 0,
          "tenantId": "mz"
        },
        "minParametersForSearchForm": 0,
        "masterName": "commonUiConfig",
        "moduleName": "SearchDefaultConfig",
        "tableFormJsonPath": "requestParam",
        "filterFormJsonPath": "requestBody.Product",
        "searchFormJsonPath": "requestBody.Product"
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
              "name": "",
              "manufacturer": "",
              "type": "",
              "id": ""
            },
            "fields": [
              {
                "key": "DRUG_NAME",
                "label": "DRUG_NAME",
                "type": "text",
                "isMandatory": false,
                "disable": false,
                "preProcess": {
                  "convertStringToRegEx": ["populators.validation.pattern"]
                },
                "populators": {
                  "name": "name",
                  "error": "PROJECT_PATTERN_ERR_MSG",
                  "validation": {
                    "pattern": "^[^\\$<>?\\\\~!@$%^()+={}\\[\\]*:;“”‘’]{1,50}$"
                  }
                }
              },
              {
                "key": "DRUG_MANUFACTURER",
                "label": "DRUG_MANUFACTURER",
                "type": "text",
                "isMandatory": false,
                "disable": false,
                "preProcess": {
                  "convertStringToRegEx": ["populators.validation.pattern"]
                },
                "populators": {
                  "name": "manufacturer",
                  "error": "COMMON_PATTERN_ERR_MSG_MUSTER_ID",
                  "validation": {
                    "pattern": "^[^\\$<>?\\\\~!@$%^()+={}\\[\\]*:;“”‘’]{1,50}$"
                  }
                }
              },
              {
                "key": "DRUG_TYPE",
                "label": "DRUG_TYPE",
                "type": "text",
                "isMandatory": false,
                "disable": false,
                "preProcess": {
                  "convertStringToRegEx": ["populators.validation.pattern"]
                },
                "populators": {
                  "name": "type",
                  "error": "COMMON_PATTERN_ERR_MSG_MUSTER_ID",
                  "validation": {
                    "pattern": "^[^\\$<>?\\\\~!@$%^()+={}\\[\\]*:;“”‘’]{1,50}$"
                  }
                }
              },
              {
                "key": "DRUG_IDS",
                "label": "DRUG_IDS",
                "type": "text",
                "isMandatory": false,
                "disable": false,
                "preProcess": {
                  "convertStringToRegEx": ["populators.validation.pattern"]
                },
                "populators": {
                  "name": "id",
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
                "label": "DRUG_NAME",
                "jsonPath": "name"
              },
              {
                "label": "DRUG_MANUFACTURER",
                "jsonPath": "manufacturer"
              },
              {
                "label": "DRUG_TYPE",
                "jsonPath": "type"
              },
              {
                "label": "DRUG_IDS",
                "jsonPath": "id"
              }
            ],
            "enableGlobalSearch": false,
            "enableColumnSort": true,
            "resultsJsonPath": "Product"
          },
          "children": {},
          "show": true
        }
      },
      "additionalSections": {}
    }
  ]
}