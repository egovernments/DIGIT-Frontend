export const DownloadBillConfig = {
    "tenantId": "pg",
    "moduleName": "commonMuktaUiConfig",
    "DownloadBillConfig":[
        {
            label : "ES_COMMON_DOWNLOADS",
            type: 'download',
            apiDetails: {
                serviceName: "/egov-pdf/bill/_search",
                requestParam: {},
                requestBody: {},
                minParametersForSearchForm:1,
                masterName:"commonUiConfig",
                moduleName:"DownloadBillConfig",
                tableFormJsonPath:"requestParam",
                filterFormJsonPath:"requestBody",
                searchFormJsonPath:"requestBody",
            },
            sections : {
                searchResult: {
                    label: "",
                    uiConfig: {
                        columns: [
                            {
                                label: "WORKS_SNO",
                                jsonPath: "createdBy",
                                additionalCustomization:true
                            },
                            {
                                label: "ES_COMMON_PAYMENT_NO",
                                jsonPath: "paymentNumber"
                            },
                            {
                                label: "ES_COMMON_DATE",
                                jsonPath: "createdtime",
                                additionalCustomization:true
                            },
                            {
                                label: "ES_COMMON_NO_OF_BILLS",
                                jsonPath: "numberofbills"
                            },
                            {
                                label: "ES_COMMON_NO_OF_BENEFICIARIES",
                                jsonPath: "numberofbeneficialy"
                            },
                            {
                                label: "ES_COMMON_TOTAL_AMOUNT",
                                jsonPath: "totalamount",
                                additionalCustomization:true,
                                headerAlign: "right"
                            },
                            {
                                label: "CORE_COMMON_STATUS",
                                jsonPath: "status",
                                additionalCustomization:true
                            },
                            {
                                label: "CS_COMMON_ACTION",
                                jsonPath: "filestoreid",
                                additionalCustomization:true
                            }
                        ],
                        enableGlobalSearch: false,
                        enableColumnSort: true,
                        resultsJsonPath: "searchresult",
                        tableClassName:"download-table",
                    },
                    children: {},
                    show: true 
                }
            },
            additionalSections : {}
        }
      ]
}