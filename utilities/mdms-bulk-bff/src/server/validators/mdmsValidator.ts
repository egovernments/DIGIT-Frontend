import { httpRequest } from "../utils/request";
import { mdmsCreateBodySchema } from "../config/schemas/mdmsCreateBody";
import { validateBodyViaSchema } from "./genericValidator";
import config from "../config";
import { throwError } from "../utils/errorUtils";
import { getSheetData } from "../utils/excelUtils";
import { getFileUrl } from "../utils/genericUtils";
import { mdmsTemplateGenerateBody } from "../config/schemas/mdmsTemplateGenerateBody";

export async function validateCreateMdmsDatasRequest(request: any) {
    validateBodyViaSchema(mdmsCreateBodySchema, request.query);
    await validateMdmsSchema(request);
    await validateSheetData(request);
}

async function validateMdmsSchema(request: any) {
    const { schemaName, tenantId } = request.query;
    const searchBody = {
        RequestInfo: request.body.RequestInfo,
        SchemaDefCriteria: {
            tenantId,
            codes: [schemaName]
        }
    }
    const schemaResponse = await httpRequest(config.host.mdmsHost + config.paths.mdmsSchemaSearch, searchBody);
    if (schemaResponse && schemaResponse?.SchemaDefinitions && schemaResponse?.SchemaDefinitions?.length > 0) {
        const schema = schemaResponse.SchemaDefinitions[0];
        if (!schema.isActive) {
            throwError("MDMS", 400, "INVALID_MDMS_SCHEMA", `Schema ${schemaName} is not active`);
        }
        if (!schema?.definition) {
            throwError("MDMS", 400, "INVALID_MDMS_SCHEMA", `Schema ${schemaName} not found`);
        }
        validateSchemaCompatibility(schema?.definition);
        request.body.currentSchema = schema?.definition;
    }
    else {
        throwError("MDMS", 400, "INVALID_MDMS_SCHEMA", `Schema ${schemaName} not found`);
    }
}

// Function to check if a type is complex (object or array)
const isComplexType = (type: string | string[]): boolean => {
    if (Array.isArray(type)) {
        return type.includes("object") || type.includes("array");
    }
    return type === "object" || type === "array";
};

function validateSchemaCompatibility(schemaDefination: any) {
    // Check each property type in the schema
    const properties = schemaDefination.properties;
    for (const propName in properties) {
        const prop = properties[propName];
        if (isComplexType(prop.type)) {
            throwError("MDMS", 400, "INVALID_MDMS_SCHEMA", `Schema ${propName} have complex types`);
        }
    }
}

async function validateSheetData(request: any) {
    const fileUrl = await getFileUrl(request);
    const data = await getSheetData(fileUrl, config.values.mdmsSheetName, true);
    const schema = request.body.currentSchema;
    for (const rowData of data) {
        validateBodyViaSchema(schema, rowData);
    }
}

export async function validateGenerateMdmsTemplateRequest(request: any) {
    validateBodyViaSchema(mdmsTemplateGenerateBody, request.query);
    await validateMdmsSchema(request);
}