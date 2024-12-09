export const UserManagementConfig =() =>{

  const hrms_context_path = window?.globalConfigs?.getConfig("HRMS_CONTEXT_PATH") || 'health-hrms';

  return {
  "tenantId": "mz",
  "moduleName": "UserManagementConfig",
  "UserManagementConfig": [
    {
      "label": "USER_MANAGEMENT",
      "type": "inbox",
      "apiDetails": {
        "serviceName": `/${hrms_context_path}/employees/_search`,
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
              "name":"",
              "phone":""

            },
            "fields": [
              {
                "label": "NAME",
                "type": "text",
                "isMandatory": false,
                "disable": false,
                "populators": {
                  "name": "name",
                  "error": "ERR_INVALID_NAME",
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
                  "error": "ERR_INVALID_PHONE_NUMBER",
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
                "label": "MP_USER_MANAGEMENT_NAME",
                "jsonPath": "user.name",
              },
              {
                "label": "MP_USER_MANAGEMENT_EMAIL",
                "jsonPath": "user.emailId",
              },
              {
                "label": "MP_USER_MANAGEMENT_MOBILE_NO",
                "jsonPath": "user.mobileNumber",
              },
              {
                "label":"MP_USER_MANAGEMENT_ROLE",
                "jsonPath":"user.roles",
                "additionalCustomization":true
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
                "text": "BULK_UPLOAD_USERS",
                "url": "/employee/microplan/upload-user",
                "roles": [
                  "MICROPLAN_ADMIN"
                ]
              },
              {
                "text": "DOWNLOAD_USER_DATA",
                "url": "/employee/microplan/user-download",
                "roles": [
                  "MICROPLAN_ADMIN"
                ]
              }
            ],
            "label": "USER_MANAGEMENT",
            "logoIcon": {
              "component": "Population",
              "customClass": "inbox-links-icon"
            }
          },
          "children": {},
          "show": true
        },
        "filter": {
          "uiConfig": {
            "headerLabel": "ROLES",
            "secondaryLabel": "ES_COMMON_CLEAR_FILTER",
            "formClassName": "filter",
            "type": "filter",
            "typeMobile":"sort",
            "headerStyle": null,
            "primaryLabel": "MP_UM_FILTER",
            "minReqFields": 0,
            "defaultValues": {
              "roleschosen": '',
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
          "label": "MP_USER_MANAGEMENT_FILTER",
          "labelMobile": "TQM_INBOX_FILTER",
          "show": true
        }
      },
      "additionalSections": {},
      "persistFormData":true,
      "showAsRemovableTagsInMobile":true
    }
  ]
};
}
