export const mdmsTemplateGenerateBody = {
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
        }
    },
    "required": ["tenantId", "schemaName"]
};
