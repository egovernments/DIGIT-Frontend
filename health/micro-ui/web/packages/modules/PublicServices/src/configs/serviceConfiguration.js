export const serviceConfig = {
    "tenantId": "dev",
    "moduleName": "CommonService",
    "ServiceConfiguration": [
      {
        "module": "Tradelicense",
        "service": "NewTL",
        "fields": [
          {
            "name": "tradeDetails",
            "label": "Trade Details ",
            "type": "object",
              "properties": [
                {
                  "name": "financialYear",
                  "label": "Financial Year ",
                  "type": "string",
                  "format": "radioordropdown",
                  //"defaultValue" : "2025_26",
                  //"prefix": "FINANCIALYEAR",
                  "reference": "mdms",
                  "required": false,
                  "schema": "egf-master.FinancialYear2", 
                  "orderNumber": 1
                },
                {
                  "name": "licenseType",
                  "label": "License Type ",
                  "defaultValue" : "PERMANENT",
                  // "prefix": "LICENSETYPE",
                  "type": "string",
                  "format": "radioordropdown",
                  "required": false,
                  "orderNumber": 2
                },
                {
                  "name": "Licensedemo",
                  "label": "New License",
                  //"defaultValue" : "PERMANENT",
                  // "prefix": "LICENSETYPE",
                  "type": "enum",
                  "format": "radioordropdown",
                  "required": false,
                  "values": ["yes", "No"],
                  "orderNumber": 2
                },
                {
                  "name": "tradeName",
                  "label": "Trade Name ",
                  "type": "string",
                  "format": "text",
                  "maxLength": 128,
                  "minLength": 2,
                  "validation": {
                    "regex": "^[A-Za-z0-9 ]+$",
                    "message": "Only letters and numbers allowed"
                  },
                  "required": false,
                  "orderNumber": 3
                },
                {
                  "name": "tradeStructureType",
                  "label": "Trade Structure Type ",
                  "type": "string",
                  "format": "radioordropdown",
                  "reference": "mdms",
                  "required": false,
                  "schema": "Tradelicence.StructureType",
                  "orderNumber": 4
                },
                {
                  "name": "tradeStructureSubType",
                  "label": "Trade Structure Sub Type ",
                  //same master how to give custom output for options
                  // 1st way is to separate out master
                  // 2nd way to pass custom logck in mdms
                  "type": "string",
                  "format": "radioordropdown",
                  "reference": "mdms",
                  "dependencies": [
                    "tradeStructureType"
                  ],
                  "required": false,
                  "schema": "Tradelicence.StructureSubType",
                  "orderNumber": 5
                },
                {
                  "name": "tradeCommencementDate",
                  "label": "Trade Commencement Date ",
                  "type": "date",
                  "format": "date",
                  "required": false,
                  "orderNumber": 6
                }
              ]
          },
          {
            "name": "tradeUnits",
            "label": "Trade Units ",
            "type": "object",
              "properties": [
                {
                  "name": "tradeCategory",
                  "label": "Trade Category ",
                  "type": "string",
                  "format": "radioordropdown",
                  "reference": "mdms",
                  "required": false,
                  "schema": "Tradelicence.TradeCategory",
                  "orderNumber": 1
                },
                {
                  "name": "tradeType",
                  "label": "Trade Type ",
                  "type": "string",
                  "format": "radioordropdown",
                  "reference": "mdms",
                  "required": false,
                  "schema": "Tradelicence.TradeType",
                  "orderNumber": 2
                },
                {
                  "name": "tradeSubType",
                  "label": "Trade Sub Type ",
                  "type": "string",
                  "format": "radioordropdown",
                  "reference": "mdms",
                  "required": false,
                  "schema": "Tradelicence.TradeSubType",
                  "orderNumber": 3
                }
              ]
          },
          // {
          //   "name": "tradeAddress",
          //   "label": "Trade Address ",
          //   "type": "object",
          //     "properties": [
          //       {
          //         "name": "pincode",
          //         "label": "Pincode ",
          //         "disable" : false,
          //         "type": "string",
          //         "format": "pincode",
          //         "maxLength": 6,
          //         "minLength": 0,
          //         "validation": {
          //           "regex": "^[1-9][0-9]{5}$",
          //           "message": "Only 6 numbers allowed"
          //         },
          //         "required": false,
          //         "orderNumber": 1
          //       },
          //       {
          //         "name": "city",
          //         "label": "City ",
          //         "disable" : false,
          //         "defaultValue" : "DEV",
          //         "prefix": "CITY",
          //         "type": "string",
          //         "format": "radioordropdown",
          //         "required": false,
          //       },
          //       {
          //         "name": "streetName",
          //         "label": "Street Name ",
          //         "disable" : false,
          //         "type": "string",
          //         "format": "text",
          //         "maxLength": 256,
          //         "minLength": 0,
          //         "validation": {
          //           "regex": "^[1-9][0-9]{5}$",
          //           "message": "Only 6 numbers allowed"
          //         },
          //         "required": false,
          //         "orderNumber": 1
          //       },
          //     ]
          // },
          // {
          //   "name": "ownershipDetails",
          //   "label": "Ownership Details ",
          //   "type": "object",
          //     "properties": [
          //       {
          //         "name": "OwnerName",
          //         "label": "Owner Name ",
          //         "disable" : false,
          //         "type": "string",
          //         "format": "text",
          //         "maxLength": 256,
          //         "minLength": 0,
          //         "validation": {
          //           "regex": "^[1-9][0-9]{5}$",
          //           "message": "Only 6 numbers allowed"
          //         },
          //         "required": false,
          //         "orderNumber": 1
          //       },
          //       {
          //         "name": "mobileNumber",
          //         "label": "Mobile Number ",
          //         "disable" : false,
          //         "type": "mobileNumber",
          //         "format": "mobuleNumber",
          //         "maxLength": 256,
          //         "minLength": 0,
          //         "validation": {
          //           "regex": "^[6-9]\d{9}$",
          //           "message": "Only 9 numbers allowed"
          //         },
          //         "required": false,
          //         "orderNumber": 1
          //       },
          //       {
          //         "name": "gender",
          //         "label": "Gender ",
          //         "disable" : false,
          //         "type": "string",
          //         "format": "radioordropdown",
          //         "reference": "mdms",
          //         "required": false,
          //         "schema": "common-masters.GenderType" 
          //       },
          //     ]
          // },
          {
            "name": "accessories",
            "label": "Trade accessories ",
            "type": "array",
            "items": {
              "type": "object",
              "properties": [
                {
                  "name": "accessoryType",
                  "label": "Accessory type ",
                  "type": "string",
                  "format": "radioordropdown",
                  "reference": "mdms",
                  "required": false,
                  "schema": "TradeLicense.AccessoriesCategory",
                  "orderNumber": 1
                }
              ]
            }
          }
        ],
        "workflow": {
          "businessService": "NewTL",
          "ACTIVE": [
            "APPROVED"
          ],
          "INACTIVE": [
            "REJECTED",
            "WITHDRAWN"
          ]
        },
        "calculator": {
          "billingSlabs": [
            {
              "key": "applicationFee",
              "value": 2000
            }
          ]
        },
        "idgen": {
          "format": "tl.application.number"
        },
        "localization": {
          "modules": [
            "digit-tradelicence"
          ]
        },
        "notification": {
          "sms": {
            "TODO": "will fill later"
          },
          "email": {
            "TODO": "will fill later"
          }
        },
        "access": {
          "roles": [
            "TL_CREATOR"
          ],
          "actions": [
            {
              "url": "tl-services/v1/create"
            }
          ]
        },
        "rules": {
          "validation": {
            "type": "schema||api||custom||none",
            "service": "tradelicence",
            "schemaCode": "tradelicence.apply",
            "customFunction": "eitherhookname||function"
          },
          "calculator": {
            "type": "api||custom||none",
            "service": "tradelicence",
            "customFunction": "eitherhookname||function"
          },
          "registry": {
            "type": "api||none",
            "service": "tradelicence"
          },
          "references": [
            {
              "type": "initiate",
              "service": "tradelicence"
            }
          ]
        },
        "documents": [
          {
            "category": "address-proof",
            "documentTypes": [
              "aadhar",
              "voter"
            ],
            "active": true,
            "isMandatory": false,
            "allowedFileTypes": [
              "pdf",
              "doc",
              "docx",
              "xlsx",
              "xls",
              "jpeg",
              "jpg",
              "png"
            ],
            "maxSizeInMB": 5,
            "maxFilesAllowed": 1
          },
          {
            "category": "identity-proof",
            "documentTypes": [
              "aadhar",
              "voter"
            ],
            "active": true,
            "isMandatory": true,
            "allowedFileTypes": [
              "pdf",
              "doc",
              "docx",
              "xlsx",
              "xls",
              "jpeg",
              "jpg",
              "png"
            ],
            "maxSizeInMB": 5,
            "maxFilesAllowed": 1
          },
          {
            "category": "owner-photo",
            "documentTypes": [
              "photo"
            ],
            "active": true,
            "isMandatory": true,
            "allowedFileTypes": [
              "jpeg",
              "jpg",
              "png"
            ],
            "maxSizeInMB": 5,
            "maxFilesAllowed": 1
          }
        ],
        "pdf": [
          {
            "key": "tl-application",
            "type": "application"
          },
          {
            "key": "tl-bill",
            "type": "bill"
          },
          {
            "key": "tl-receipt",
            "type": "receipt"
          }
        ],
        "bill": {
          "service": "ApplicationFee"
        },
        "payment": {
          "gateway": "TODO"
        },
        "apiconfig": [
          {
            "type": "register",
            "host": "https://staging.digit.org||http://tl-services.egov:8080",
            "endpoint": "/tl-services/v1/create",
            "method": "post",
            "service": "tradelicence"
          },
          {
            "type": "register||calculate||validate||authenticate",
            "host": "https://staging.digit.org||http://tl-services.egov:8080",
            "endpoint": "/tl-services/v1/search",
            "method": "post",
            "service": "tradelicence"
          }
        ],
        "applicant": {
          "minimum": 1,
          "maximum": 3,
          "types": [
            "individual",
            "organisation"
          ]
        },
        "boundary": {
          "hierarchyType": "REVENUE",
          "lowestLevel": "locality"
        },
        "enabled": [
          "citizen",
          "employee"
        ]
      },
    ]
  }