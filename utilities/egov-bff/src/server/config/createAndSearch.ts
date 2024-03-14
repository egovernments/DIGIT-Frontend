const createAndSearch: any = {
    "facility": {
        requiresToSearchFromSheet: [
            {
                sheetColumnName: "Facility Code",
                searchPath: "Facility.id"
            }
        ],
        uniqueIdentifier: "id",
        uniqueIdentifierColumn: "A",
        matchEachKey: true,
        parseArrayConfig: {
            sheetName: "List of Available Facilities",
            parseLogic: [
                {
                    sheetColumnName: "Facility Code",
                    resultantPath: "id",
                    type: "string"
                },
                {
                    sheetColumnName: "Facility Name",
                    resultantPath: "name",
                    type: "string"
                },
                {
                    sheetColumnName: "Facility Type",
                    resultantPath: "usage",
                    type: "string"
                },
                {
                    sheetColumnName: "Facility Status",
                    resultantPath: "isPermanent",
                    type: "boolean",
                    conversionCondition: {
                        "Perm": "true",
                        "Temp": ""
                    }
                },
                {
                    sheetColumnName: "Facility Capacity",
                    resultantPath: "storageCapacity",
                    type: "number"
                }
            ],
            tenantId: {
                getValueViaPath: "ResourceDetails.tenantId",
                resultantPath: "tenantId"
            }
        },
        createBulkDetails: {
            limit: 50,
            createPath: "Facilities",
            url: "http://localhost:8086/" + "facility/v1/bulk/_create"
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