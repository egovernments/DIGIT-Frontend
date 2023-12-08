export const SearchProjectConfig = {
    "tenantId": "mz",
    "moduleName": "commonHCMUiConfig",
    "SearchProjectConfig": [
        {
            "label": "SEARCH_PROJECT",
            "type": "search",
            "actionLabel": "HCM_ADD_PROJECT",
            "actionRole": "SYSTEM_ADMINISTRATOR",
            "actionLink": "workbench-ui/employee/workbench/mdms-add-v2?moduleName=Health&masterName=Project",
            "apiDetails": {
                "serviceName": "/project/v1/_search",
                "requestParam": {
                    "limit": 10,
                    "offset": 0,
                    "tenantId": "mz"
                },
                "requestBody": {
                    "Projects": {
                        "tenantId": "mz"
                    },
                    "apiOperation": "SEARCH",
                    "limit": 10,
                    "offset": 0,
                    "tenantId": "mz"
                },
                "minParametersForSearchForm": 0,
                "masterName": "commonUiConfig",
                "moduleName": "SearchDefaultConfig",
                "tableFormJsonPath": "requestParam",
                "filterFormJsonPath": "requestBody.Projects",
                "searchFormJsonPath": "requestBody.Projects"
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
                            "id": ""
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
                            }
                        ],
                        "enableGlobalSearch": false,
                        "enableColumnSort": true,
                        "resultsJsonPath": "Projects"
                    },
                    "children": {},
                    "show": true
                }
            },
            "additionalSections": {}
        }
    ]
}