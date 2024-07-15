export const boundarySearchBodySchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "hierarchyType": {
            "type": "string",
            "maxLength": 128,
            "minLength": 1
        },
        "tenantId": {
            "type": "string",
            "maxLength": 64,
            "minLength": 1
        },
        "id": {
            "type": "string",
            "minLength": 1,
            "maxLength": 128
        }
    },
    "required": ["tenantId", "hierarchyType"]
};
