export const tqmInboxConfig = {
  "tenantId": "pb",
  "moduleName": "UserManagementConfig",
  "tqmInboxConfig": [
    {
      "label": "USER_MANAGEMENT",
      "type": "inbox",
      "apiDetails": {
        "serviceName": "/health-hrms/employees/_search",
        "requestParam": {},
        "requestBody": {
          
        },
        "minParametersForSearchForm": 0,
        "minParametersForFilterForm": 0,
        "masterName": "commonUiConfig",
        "moduleName": "UserManagementConfig",
        "tableFormJsonPath": "requestParam",
        "filterFormJsonPath": "requestParam",
        "searchFormJsonPath": "requestParam"
      },
      "sections": {
        "search": {
          "uiConfig": {
            "headerLabel": "ES_COMMON_SEARCH",
            "type":"search",
            "typeMobile":"filter",
            "searchWrapperStyles": {
              "flexDirection": "column-reverse",
              "marginTop": "1.4rem",
              "alignItems": "center",
              "justifyContent": "end",
              "gridColumn": "3"
            },
            "headerStyle": null,
            "primaryLabel": "Search",
            "secondaryLabel": "ES_COMMON_CLEAR_SEARCH",
            "minReqFields": 0,
            "defaultValues": {
              name:"",
              phone:""

            },
            "fields": [
              {
                "label": "NAME",
                "type": "text",
                "isMandatory": false,
                "disable": false,
                "populators": {
                  "name": "name",
                  "error": "TQM_ERR_VALID_TEST_ID",
                  "style":{
                    "marginBottom":"0px"
                  }
                },
                
              },
              {
                "label": "CONTACT_NUMBER",
                "type": "number",
                "isMandatory": false,
                "disable": false,
                "populators": {
                  "name": "phone",
                  "error": "TQM_ERR_VALID_TEST_ID",
                  "style":{
                    "marginBottom":"0px"
                  },
        
                },
                
              },
            ]
          },
          "label": "",
          "labelMobile": "ES_COMMON_SEARCH",
          "children": {},
          "show": true
        },
        "searchResult": {
          "uiConfig": {
            "columns": [
              {
                label: "Name",
                jsonPath: "user.name",
              },
              {
                label: "Email",
                jsonPath: "user.emailId",
              },
              {
                label: "Contact Number",
                jsonPath: "user.mobileNumber",
              },
              {
                label:"Role",
                jsonPath:"user.roles",
                additionalCustomization:true
              }
            ],
            "enableGlobalSearch": false,
            "enableColumnSort": true,
            "resultsJsonPath": "Employees",
            "tableClassName":"table pqm-table",
            "rowClassName":"table-row-mdms table-row-mdms-hover",

          },
          "children": {},
          "show": true
        },
        "links": {
          "uiConfig": {
            "links": [
              {
                "text": "Bulk Upload Users",
                "url": "/employee",
                "roles": [
                  "MICROPLAN_ADMIN"
                ]
              },
              {
                "text": "Dowload User Data",
                "url": "/employee",
                "roles": [
                  "MICROPLAN_ADMIN"
                ]
              }
            ],
            "label": "USER_MANAGEMENT",
            "logoIcon": {
              "component": "TqmInboxIcon",
              "customClass": "inbox-links-icon"
            }
          },
          "children": {},
          "show": true
        },
        "filter": {
          "uiConfig": {
            "headerLabel": "TQM_INBOX_FILTER",
            "secondaryLabel": "ES_COMMON_CLEAR_SEARCH",
            "formClassName": "filter",
            "type": "filter",
            "typeMobile":"sort",
            "headerStyle": null,
            "primaryLabel": "Filter",
            "minReqFields": 0,
            "defaultValues": {
              "roleschosen": [],
            },
            "fields": [

              {
                "label": "ROLES",
                "type": "apicheckboxes",
                "isMandatory": false,
                "disable": false,
                "populators": {
                  "optionsCustomStyle": {
                    "top": "2.3rem"
                  },
                  "name": "roleschosen",
                  "optionsKey": "roleCode",
                  "labelKey":"i18nKey",
                  "allowMultiSelect": false,
                  "masterName": "commonUiConfig",
                  "moduleName": "UserManagementConfig",
                  "customfn": "rolesForFilter"
                },
              },
            ]
          },
          "label": "Filter",
          "labelMobile": "TQM_INBOX_FILTER",
          "show": true
        }
      },
      "additionalSections": {},
      "persistFormData":true,
      "showAsRemovableTagsInMobile":true
    }
  ]
}
