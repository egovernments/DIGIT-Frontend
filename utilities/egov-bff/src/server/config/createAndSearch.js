createAndSearch = {
    facility: {
        createBulkDetails: {
            limit: 50,
            url: "http://localhost:8086/" + "facility/v1/bulk/_create"
        },
        searchDetails: {
            searchElements: [
                {
                    key: "limit",
                    value: 200,
                    isInParams: true,
                    isInBody: false,
                },
                {
                    key: "offset",
                    value: 0,
                    isInParams: true,
                    isInBody: false,
                },
                {
                    key: "tenantId",
                    getValueViaPath: "request.body.ResourceDetails.tenantId",
                    isInParams: true,
                    isInBody: false,
                }
            ],
            url: "http://localhost:8086/" + "facility/v1/_search",
            matchViaUserIdAndCreationTime: true
        }
    }
}