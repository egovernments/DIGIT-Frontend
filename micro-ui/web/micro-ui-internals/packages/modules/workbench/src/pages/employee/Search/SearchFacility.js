export const SearchFacilityConfig = {
    tenantId: 'mz',
    moduleName: 'commonHCMUiConfig',
    SearchFacilityConfig: [
      {
        "label": "SEARCH_FACILITY",
        "type": "search",
        "actionLabel": "HCM_SEARCH_FACILITY",
        "actionRole": "SYSTEM_ADMINISTRATOR",
        "actionLink": "workbench-ui/employee/workbench/mdms-add-v2?moduleName=Health&masterName=Facility",
        "apiDetails": {
          "serviceName": "/facility/v1/_search",
          "requestParam": {
            "limit": 1,
            "offset": 0,
            "tenantId": "mz",
          },
          "requestBody": {
            "Facility": {
             
            }
          },
          "minParametersForSearchForm": 0,
          "masterName": "commonUiConfig",
          "moduleName": "SearchDefaultConfig",
          "tableFormJsonPath": "requestParam",
          "filterFormJsonPath": "requestBody.Facility",
          "searchFormJsonPath": "requestBody.Facility"
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
                "faciltyUsage": "",
                "storageCapacity": "",
                "localityCode": ""
              },
              "fields": [
                {
                  "key": "FACILITY_ID",
                  "label": "FACILITY_ID",
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
                  "key": "FACILITY_USAGE",
                  "label": "FACILITY_USAGE",
                  "type": "text",
                  "isMandatory": false,
                  "disable": false,
                  "preProcess": {
                    "convertStringToRegEx": ["populators.validation.pattern"]
                  },
                  "populators": {
                    "name": "faciltyUsage",
                    "error": "COMMON_PATTERN_ERR_MSG_MUSTER_ID",
                    "validation": {
                      "pattern": "^[^\\$<>?\\\\~!@$%^()+={}\\[\\]*:;“”‘’]{1,100}$"
                    }
                  }
                },
                {
                  "key": "FACILITY_STORAGE_CAPACITY",
                  "label": "FACILITY_STORAGE_CAPACITY",
                  "type": "text",
                  "isMandatory": false,
                  "disable": false,
                  "preProcess": {
                    "convertStringToRegEx": ["populators.validation.pattern"]
                  },
                  "populators": {
                    "name": "storageCapacity",
                    "error": "COMMON_PATTERN_ERR_MSG_MUSTER_ID",
                    "validation": {
                      "pattern": "^[^\\$<>?\\\\~!@$%^()+={}\\[\\]*:;“”‘’]{1,100}$"
                    }
                  }
                },
                {
                    "key": "FACILITY_LOCALITY_CODE",
                    "label":  "FACILITY_LOCALITY_CODE",
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
            "label": "Facility",
            "uiConfig": {
              "columns": [
                {
                  "label": "FACILITY_ID",
                  "jsonPath": "id"
                },
                {
                  "label": "FACILITY_NAME",
                  "jsonPath": "name"
                },
                {
                  "label": "FACILITY_IS_PERMANENT",
                  "jsonPath": "isPermanent"
                },
                {
                    "label": "FACILITY_USAGE",
                    "jsonPath": "usage"
                },
                {
                    "label": "FACILITY_STORAGE_CAPACITY",
                    "jsonPath": "storageCapacity"
                },
                {
                    "label": "FACILITY_LOCALITY_CODE",
                    "jsonPath": "address.locality.code"
                },
              ],
              "enableGlobalSearch": false,
              "enableColumnSort": true,
              "resultsJsonPath": "Facilities"
            },
            "children": {},
            "show": true
          }
        },
        "additionalSections": {}
      }
    ]
  }