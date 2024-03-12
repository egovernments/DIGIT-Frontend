const createAndSearch: any = {
    "facility": {
        createBulkDetails: {
            limit: 50,
            createPath: "Facilities",
            url: "http://localhost:8086/" + "facility/v1/bulk/_create",
            createElements: [

            ]
        },
        searchDetails: {
            searchElements: [
                {
                    keyPath: "tenantId",
                    getValueViaPath: "ResourceDetails.tenantId",
                    isInParams: true,
                    isInBody: false,
                },
                {
                    keyPath: "Facility",
                    isInParams: false,
                    isInBody: true,
                }
            ],
            searchLimit: {
                keyPath: "limit",
                value: "200",
                isInParams: true,
                isInBody: false,
            },
            searchOffset: {
                keyPath: "offset",
                value: "0",
                isInParams: true,
                isInBody: false,
            },
            url: "http://localhost:8086/" + "facility/v1/_search",
            searchPath: "Facilities"
        }
    }
}

export default createAndSearch;