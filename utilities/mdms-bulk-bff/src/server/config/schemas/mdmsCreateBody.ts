export const mdmsCreateBodySchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "schemaName": {
            "type": "string",
            "maxLength": 128,
            "minLength": 1
        },
        "tenantId": {
            "type": "string",
            "maxLength": 64,
            "minLength": 1
        },
        "fileStoreId": {
            "type": "string",
            "minLength": 1,
            "maxLength": 128
        }
    },
    "required": ["schemaName", "tenantId", "fileStoreId"]
};
