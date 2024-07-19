import { httpRequest } from "../utils/request";
import { mdmsCreateBodySchema } from "../config/schemas/mdmsCreateBody";
import { validateBodyViaSchema } from "./genericValidator";
import config from "../config";
import { throwError } from "../utils/errorUtils";
import { getSheetData } from "../utils/excelUtils";
import { getFileUrl } from "../utils/genericUtils";
import { mdmsTemplateGenerateBody } from "../config/schemas/mdmsTemplateGenerateBody";
import { logger } from "../utils/logger";
import { getMdmsDetails, getUniqueFieldSet } from "../utils/mdmsBulkUploadServiceUtil";
import { sheetDataStatus } from "../config/constants";
import { mdmsSearchBodySchema } from "../config/schemas/mdmsSearchBody";

export async function validateCreateMdmsDatasRequest(request: any) {
    validateBodyViaSchema(mdmsCreateBodySchema, request.query);
    await validateMdmsSchema(request);
    await validateSheetData(request);
}

async function validateMdmsSchema(request: any) {
    const { schemaCode, tenantId } = request.query;
    const searchBody = {
        RequestInfo: request.body.RequestInfo,
        SchemaDefCriteria: {
            tenantId,
            codes: [schemaCode]
        }
    }
    const schemaResponse = await httpRequest(config.host.mdmsHost + config.paths.mdmsSchemaSearch, searchBody);
    if (schemaResponse && schemaResponse?.SchemaDefinitions && schemaResponse?.SchemaDefinitions?.length > 0) {
        const schema = schemaResponse.SchemaDefinitions[0];
        if (!schema.isActive) {
            throwError("MDMS", 400, "INVALID_MDMS_SCHEMA", `Schema ${schemaCode} is not active`);
        }
        if (!schema?.definition) {
            throwError("MDMS", 400, "INVALID_MDMS_SCHEMA", `Schema ${schemaCode} not found`);
        }
        validateSchemaCompatibility(schema?.definition);
        request.body.currentSchema = schema?.definition;
    }
    else {
        throwError("MDMS", 400, "INVALID_MDMS_SCHEMA", `Schema ${schemaCode} not found`);
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
    const sheetData = await getSheetData(fileUrl, config.values.mdmsSheetName + " " + request.query.schemaCode, true);
    const dataToCreate = sheetData.filter((data: any) => data?.["!status!"] != sheetDataStatus.created);
    if (dataToCreate.length === 0) {
        throwError("COMMON", 400, "VALIDATION_ERROR", `There is no data in the sheet to create`);
    }
    const schema = request.body.currentSchema;
    for (const rowData of dataToCreate) {
        validateBodyViaSchema(schema, rowData);
    }
    request.body.dataToCreate = dataToCreate;
}

export async function validateGenerateMdmsTemplateRequest(request: any) {
    validateBodyViaSchema(mdmsTemplateGenerateBody, request.query);
    await validateMdmsSchema(request);
}

export async function validateForSheetErrors(request: any) {
    const uniqueFieldSet = await getUniqueFieldSet(request);
    const sheetData = request.body.dataToCreate;
    const xUniqueFields = request?.body?.currentSchema?.["x-unique"];
    logger.info(`Unique fields in schema ${request?.query?.schemaCode} are ${xUniqueFields.join(", ")}`);
    const uniqueFieldMap = new Map();
    const duplicateEntries: any = [];
    var errors: any = {};

    sheetData.forEach((data: any) => {
        let uniqueIdentifier = xUniqueFields.map((key: any) => data[key]).join('|');

        if (uniqueFieldSet.has(uniqueIdentifier)) {
            const message = `Entry already in mdms`;
            logger.info(message);
            duplicateEntries.push(message);
            const rowNumber = data['!row#number!'];
            if (errors?.[rowNumber]) {
                errors[rowNumber].push(message);
            } else {
                errors[rowNumber] = [message];
            }
        }

        if (uniqueFieldMap.has(uniqueIdentifier)) {
            uniqueFieldMap.get(uniqueIdentifier).push(data['!row#number!']);
        } else {
            uniqueFieldMap.set(uniqueIdentifier, [data['!row#number!']]);
        }
    });

    uniqueFieldMap.forEach((rows, identifier) => {
        if (rows.length > 1) {
            const message = `Duplicate entry found at rows ${rows.join(', ')}`;
            logger.info(message);
            duplicateEntries.push(message);
            rows.forEach((row: any) => {
                if (errors?.[row]) {
                    errors[row].push(message);
                } else {
                    errors[row] = [message];
                }
            })
        }
    });
    request.body.errors = errors;
}

export async function validateSearchRequest(request: any) {
    validateBodyViaSchema(mdmsSearchBodySchema, request.query);
    await getMdmsDetails(request);
}