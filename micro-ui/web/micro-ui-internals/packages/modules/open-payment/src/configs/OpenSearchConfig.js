export const OpenSearchConfig =  {
  "label": "OPEN_PAYMENT_SEARCH",
  "type": "search",
  "apiDetails": {
    "serviceName": "/billing-service/bill/v2/_fetchbill",
    "requestParam": {},
    "requestBody": {},
    "minParametersForSearchForm": 1,
    "masterName": "commonUiConfig",
    "moduleName": "OpenPaymentSearch",
    "tableFormJsonPath": "requestBody.pagination",
    "filterFormJsonPath": "requestBody.custom",
    "searchFormJsonPath": "requestBody.custom"
  },
  "sections": {
    "search": {
      "uiConfig": {
        "type":"search",
        "headerLabel": "OPEN_PAYMENT_SEARCH",
        "headerStyle": null,
        "primaryLabel": "ES_COMMON_SEARCH",
        "secondaryLabel": "ES_COMMON_CLEAR_SEARCH",
        "minReqFields": 1,
        // "showFormInstruction": "OPEN_PAYMENT_SEARCH_HINT",
        "defaultValues": {
          "consumerCode": ""
        },
        "fields": [
          {
            "label": "CONNECTION_ID",
            "type": "text",
            "isMandatory": false,
            "disable": false,
            "populators": {
              "name": "consumerCode",
              "style":{
                "marginBottom":"0px"
              }
            },
          },
        ]
      },
      "label": "",
      "children": {},
      "show": true
    },
    "searchResult": {
      "uiConfig": {
        "columns": [
          {
            "label": "OP_CONS_CODE",
            "jsonPath": "consumerCode",
            "additionalCustomization": true
          },
          {
            "label": "OP_BILL_NUM",
            "jsonPath": "billNumber",
            // "additionalCustomization": true
          },
          {
            "label": "OP_PAYER_NAME",
            "jsonPath": "payerName",
            // "additionalCustomization": true
          },
          {
            "label": "OP_MOB_NO",
            "jsonPath": "mobileNumber",
            // "additionalCustomization": true
          },
          {
            "label": "OP_BILL_DATE",
            "jsonPath": "billDate",
            "additionalCustomization": true
          },
          {
            "label": "OP_BILL_TOTAL_AMT",
            "jsonPath": "totalAmount",
            "additionalCustomization": true
          },
          // {
          //   "label": "TQM_PLANT",
          //   "jsonPath": "plantCode",
          //   "additionalCustomization": false,
          //   "prefix": "PQM.PLANT_",
          //   "translate": true
          // },
          // {
          //   "label": "TQM_TREATMENT_PROCESS",
          //   "jsonPath": "processCode",
          //   "additionalCustomization": false,
          //   "prefix": "PQM.Process_",
          //   "translate": true
          // },
          // {
          //   "label": "TQM_TEST_TYPE",
          //   "jsonPath": "testType",
          //   "additionalCustomization": false,
          //   "prefix": "PQM.TestType_",
          //   "translate": true
          // },
          // {
          //   "label": "ES_TQM_TEST_DATE",
          //   "jsonPath": "auditDetails.lastModifiedTime",
          //   "additionalCustomization": true
          // },
          // {
          //   "label": "TQM_TEST_RESULTS",
          //   "jsonPath": "status",
          //   "additionalCustomization": true
          // }
        ],
        // "showActionBarMobileCard": true,
        // "actionButtonLabelMobileCard": "TQM_VIEW_RESULTS",
        "enableGlobalSearch": false,
        "enableColumnSort": true,
        "resultsJsonPath": "Bill",
        "tableClassName":"table pqm-table"
      },
      "children": {},
      "show": true
    }
  },
  "additionalSections": {}
}
