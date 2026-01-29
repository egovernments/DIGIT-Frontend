export const TradeLicenseConfig = (t, isCitizen = false) => {
    return [
        {
            stepCount: 1,
            key: "trade-details",
            head: "TL_COMMON_TR_DETAILS",
            body: [
                {
                    type: "component",
                    component: "TLInfoLabel",
                    key: "tradedetils1",
                    withoutLabel: true,
                    hideInCitizen: true,
                },
                {
                    type: "component",
                    component: "TLTradeDetailsEmployee",
                    key: "tradedetils",
                    withoutLabel: true,
                    hideInCitizen: true,
                },
                {
                    type: "component",
                    component: "TLTradeUnitsEmployee",
                    key: "tradeUnits",
                    withoutLabel: true,
                    hideInCitizen: true,
                },
                {
                    type: "component",
                    component: "TLAccessoriesEmployee",
                    key: "accessories",
                    withoutLabel: true,
                    hideInCitizen: true,
                }
            ]
        },
        {
            stepCount: 2,
            key: "property-details",
            head: "TL_NEW_APPLICATION_PROPERTY",
            body: [
                {
                    component: "CPTPropertySearchNSummary",
                    withoutLabel: true,
                    key: "cpt",
                    type: "component",
                    hideInCitizen: true
                },
            ],
        },
        {
            stepCount: 3,
            key: "ownership-details",
            head: "ES_NEW_APPLICATION_OWNERSHIP_DETAILS",
            body: [
                {
                    type: "component",
                    component: "TLOwnerDetailsEmployee",
                    key: "owners",
                    withoutLabel: true,
                    hideInCitizen: true,
                },
            ],
        },
        {
            stepCount: 4,
            key: "document-details",
            head: "TL_NEW_APPLICATION_DOCUMENTS_REQUIRED",
            body: [
                {
                    component: "TLDocumentsEmployee",
                    withoutLabel: true,
                    key: "documents",
                    type: "component",
                    hideInCitizen: true
                },
            ],
        },
        {
            stepCount: 5,
            key: "summary",
            head: "TL_SUMMARY_HEADER",
            body: [] // Summary component will be handled separately or added here if needed
        }
    ];
};

