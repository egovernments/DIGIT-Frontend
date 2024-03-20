export const createProjectConfigMUKTA = {
  "tenantId": "pg",
  "moduleName": "commonMuktaUiConfig",
  "CreateProjectConfig": [
    {
      "defaultValues": {},
      "metaData": {
        "showNavs": false,
        "currentFormCategory": false
      },
      "form": [
        {
          "head": "",
          "subHead": "",
          "body": [
            {
              "inline": true,
              "label": "WORKS_PROJECT_ID",
              "isMandatory": false,
              "key": "basicDetails_projectID",
              "type": "text",
              "disable": true,
              "preProcess" : {
                "updateDependent" : ["populators.customStyle.display"]
              },
              "populators": { 
                "name": "basicDetails_projectID", 
                "customStyle" : {
                  "display" : "none"
                },
                "customClass" : "field-value-no-border"
              }
            },
            {
              "inline": true,
              "label": "ES_COMMON_PROPOSAL_DATE",
              "isMandatory": false,
              "key": "basicDetails_dateOfProposal",
              "type": "date",
              "disable": false,
              "preProcess" : {
                "updateDependent" : ["populators.validation.max"]
              },
              "populators": {
                "name": "basicDetails_dateOfProposal",
                "validation":{
                  "max":"currentDate"
                }
              }
            },
            {
              "inline": true,
              "label": "ES_COMMON_PROJECT_NAME",
              "isMandatory": true,
              "key": "basicDetails_projectName",
              "type": "text",
              "disable": false,
              "preProcess": {
                "convertStringToRegEx": [
                  "populators.validation.pattern"
                ]
              },
              "populators": {
                "name": "basicDetails_projectName",
                "error": "PROJECT_PATTERN_ERR_MSG_PROJECT_NAME",
                "validation": {
                  "pattern": "^[a-zA-Z0-9\\/{ \\/ .\\- _$@#\\' } ]*$",
                  "minlength": 2,
                  "maxlength" : 128
                }
              }
            },
            {
              "inline": true,
              "label": "PROJECT_PROJECT_DESC",
              "isMandatory": true,
              "key": "basicDetails_projectDesc",
              "type": "textarea",
              "disable": false,
              "preProcess": {
                "convertStringToRegEx": [
                  "populators.validation.pattern"
                ]
              },
              "populators": {
                "name": "basicDetails_projectDesc",
                "error": "PROJECT_PATTERN_ERR_MSG_PROJECT_DESC",
                "validation": {
                  "pattern": "^[a-zA-Z0-9\\/{ \\/ .\\- ,_$@#\\'() } ]*$",
                  "minlength": 2,
                  "maxlength" : 256
                }
              }
            }
          ]
        },
        {
          "navLink": "Project_Details",
          "head": "WORKS_PROJECT_DETAILS",
          "body": [
            {
              "inline": true,
              "label": "WORKS_LOR",
              "isMandatory": false,
              "key": "noSubProject_letterRefNoOrReqNo",
              "type": "text",
              "disable": false,
              "preProcess": {
                "convertStringToRegEx": [
                  "populators.validation.pattern"
                ]
              },
              "populators": {
                "name": "noSubProject_letterRefNoOrReqNo",
                "error": "PROJECT_PATTERN_ERR_MSG_PROJECT_LOR",
                "validation": {
                  "pattern": "^[a-zA-Z0-9\\/{ \\/ .\\- _$@#\\' } ]*$",
                  "minlength": 2,
                  "maxlength" : 32
                }
              }
            },
            {
              "isMandatory": true,
              "key": "noSubProject_typeOfProject",
              "type": "radioordropdown",
              "label": "WORKS_PROJECT_TYPE",
              "disable": false,
              "populators": {
                "name": "noSubProject_typeOfProject",
                "optionsKey": "name",
                "error": "WORKS_REQUIRED_ERR",
                "required": true,
                "mdmsConfig": {
                  "masterName": "ProjectType",
                  "moduleName": "works",
                  "localePrefix": "COMMON_MASTERS"
                }
              }
            },
            {
              "isMandatory": false,
              "key": "noSubProject_targetDemography",
              "type": "radioordropdown",
              "label": "PROJECT_TARGET_DEMOGRAPHY",
              "disable": false,
              "populators": {
                "name": "noSubProject_targetDemography",
                "optionsKey": "name",
                "error": "WORKS_REQUIRED_ERR",
                "required": false,
                "mdmsConfig": {
                  "masterName": "TargetDemography",
                  "moduleName": "works",
                  "localePrefix": "COMMON_MASTERS"
                }
              }
            },
            {
              "inline": true,
              "label": "PROJECT_ESTIMATED_COST_IN_RS",
              "isMandatory": false,
              "key": "noSubProject_estimatedCostInRs",
              "type": "amount",
              "disable": false,
              "preProcess": {
                  "convertStringToRegEx": [
                    "populators.validation.pattern"
                  ]
              },
              "populators": {
                "prefix":"₹ ",
                  "name": "noSubProject_estimatedCostInRs",
                  "error": "PROJECT_PATTERN_ERR_MSG_PROJECT_ESTIMATED_COST",
                  "validation": {
                    "pattern": "^[1-9]\\d*(\\.\\d+)?$",
                    "maxlength" : 16,
                    "step" : "0.01",
                    "min" : 0,
                    "max" : 5000000
                  }
                }
            }
          ]
        },
        {
          "navLink": "Project_Details",
          "head": "ES_COMMON_LOCATION_DETAILS",
          "body": [
            {
              "type": "component",
              "component": "SelectGeoLocation",
              "withoutLabel": true,
              "key": "noSubProject_geoLocation",
              "populators":{
                "name":"geolocation"
              }
            },
            {
              "isMandatory": false,
              "key": "noSubProject_ulb",
              "type": "radioordropdown",
              "label": "ES_COMMON_ULB",
              "disable": true,
              "preProcess": {
                "updateDependent": [
                  "populators.options"
                ]
              },
              "populators": {
                "name": "noSubProject_ulb",
                "optionsKey": "i18nKey",
                "options": [],
                "error": "WORKS_REQUIRED_ERR",
                "required": true,
              }
            },
            {
              "isMandatory": true,
              "key": "noSubProject_ward",
              "type": "radioordropdown",
              "label": "PDF_STATIC_LABEL_ESTIMATE_WARD",
              "disable": false,
              "preProcess": {
                "updateDependent": [
                  "populators.options"
                ]
              },
              "populators": {
                "name": "noSubProject_ward",
                "optionsKey": "i18nKey",
                "error": "WORKS_REQUIRED_ERR",
                "required": false,
                "options": []
              }
            },
            {
              "isMandatory": true,
              "key": "noSubProject_locality",
              "type": "radioordropdown",
              "label": "WORKS_LOCALITY",
              "disable": false,
              "preProcess": {
                "updateDependent": [
                  "populators.options"
                ]
              },
              "populators": {
                "name": "noSubProject_locality",
                "optionsKey": "i18nKey",
                "error": "WORKS_REQUIRED_ERR",
                "required": false,
                "options": []
              }
            }
          ]
        },
        {
          "navLink": "Project_Details",
          "head": "",
          "body": [
            {
              "type": "documentUpload",
              "withoutLabel": true,
              "module": "Project",
              "error": "WORKS_REQUIRED_ERR",
              "name": "noSubProject_docs",
              "customClass": "",
              "localePrefix": "PROJECT",
              "populators":{
                "name":"documents"
              }
            }
          ]
        }
      ]
    }
  ]
}