export const serviceConfigPGR = {
    "tenantId": "pg",
    "moduleName": "CommonService",
    "ServiceConfiguration": [
      {
        "module": "PGR",
        "service": "Newpgr",
        "fields": [
          {
            "name": "mobileNumber",
            "label": "Mobile Number ",
            "format": "mobileNumber",
            "disable" : false,
            "type": "mobileNumber",
            "required": true,
          },
          {
            "name": "citizenName",
            "label": "Citizen Name ",
            "format": "text",
            "disable" : false,
            "type": "string",
            "maxLength": 128,
            "minLength": 2,
            "validation": {
              "regex": "^[A-Za-z0-9 ]+$",
              "message": "Only letters and numbers allowed"
            },
            "required": true,
            "orderNumber": 1
          },
          {
            "name": "complaintType",
            "label": "Complaint Type ",
            "format": "radioordropdown",
            "disable" : false,
            "type": "string",
            "reference": "mdms",
            "required": true,
            "schema": "RAINMAKER-PGR.ServiceDefs" 
          },
          {
            "name": "complaintSubType",
            "label": "Complaint Sub Type ",
            "format": "radioordropdown",
            //same master how to give custom output for options
            // 1st way is to separate out master
            // 2nd way to pass custom logck in mdms
            "disable" : false,
            "type": "string",
            "reference": "mdms",
            "dependencies": [
              "complaintType"
            ],
            "required": true,
            "schema": "RAINMAKER-PGR.ServiceDefs"
          },
          // {
          //   "name": "complaintLocation",
          //   "label": "Complaint Location ",
          //   "type": "object",
          //     "properties": [
          //       {
          //           "name": "pincode",
          //           "label": "Pincode ",
          //           "disable" : false,
          //           "type": "string",
          //           "format": "number",
          //           "maxLength": 6,
          //           "minLength": 2,
          //           "validation": {
          //             "regex": "^[1-9][0-9]{5}$",
          //             "message": "Only numbers allowed",
          //             "maxLength": 6,
          //             "minLength": 2,
          //           },
          //           "required": true,
          //           "orderNumber": 1
          //         },
          //         {
          //           "name": "city",
          //           "label": "City ",
          //           "disable" : false,
          //           "type": "string",
          //           "format": "radioordropdown",
          //           "maxLength": 6,
          //           "minLength": 2,
          //           "validation": {
          //             "regex": "^[A-Za-z0-9 ]+$",
          //             "message": "Only char and numbers allowed"
          //           },
          //           "required": true,
          //           "orderNumber": 1
          //         },
          //         {
          //           "name": "locality",
          //           "label": "Locality ",
          //           "disable" : false,
          //           "type": "string",
          //           "format": "text",
          //           "maxLength": 6,
          //           "minLength": 2,
          //           "validation": {
          //             "regex": "^[A-Za-z0-9 ]+$",
          //             "message": "Only char and numbers allowed"
          //           },
          //           "required": true,
          //           "orderNumber": 1
          //         },
          //     ]
          // }
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
      {
        "service": "Tradelicence",
        "fields": null,
        "workflow": {
          "businessService": "ApprovedTL"
        },
        "idgen": {
          "format": "tl.licence.number"
        },
        "rules": [
          {
            "referenceType": "NewTL"
          }
        ],
        "documents": null,
        "pdf": [
          {
            "key": "tl-certificate",
            "type": "certificate"
          }
        ],
        "bill": null
      },
      {
        "service": "Tradelicence",
        "fields": null,
        "workflow": {
          "businessService": "RenewTL"
        },
        "idgen": {
          "format": "tl.renewalapplication.number"
        },
        "rules": [
          {
            "referenceType": "ApprovedTL"
          }
        ],
        "documents": [
          {
            "category": "owner-photo",
            "documentTypes": [
              "photo"
            ],
            "active": true,
            "isMandatory": false,
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
            "key": "tl-renew-application",
            "type": "application"
          }
        ],
        "calculator": {
          "billingSlabs": [
            {
              "key": "applicationFee",
              "value": 2000
            }
          ]
        },
        "bill": {
          "service": "RenewalFee"
        }
      }
    ]
  }