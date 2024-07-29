import { httpRequest } from "../utils/request";
import { mdmsCreateBodySchema } from "../config/schemas/mdmsCreateBody";
import { validateBodyViaSchema, validateBodyViaSchemaOfJSONData, validateBodyViaSchemaOfSheetData } from "./genericValidator";
import config from "../config";
import { throwError } from "../utils/errorUtils";
import { getSheetData } from "../utils/excelUtils";
import { getFileUrl } from "../utils/genericUtils";
import { mdmsTemplateGenerateBody } from "../config/schemas/mdmsTemplateGenerateBody";
import { logger } from "../utils/logger";
import { addXrefToRequire, getAllMdmsData, getMdmsDetails, getUniqueFieldSet } from "../utils/mdmsBulkUploadServiceUtil";
import { dataStatus } from "../config/constants";
import { mdmsSearchBodySchema } from "../config/schemas/mdmsSearchBody";
import { getJsonFromFileURL, putIndexNumber } from "../utils/jsonUtils";

export async function validateCreateMdmsDatasRequest(request: any) {
    validateBodyViaSchema(mdmsCreateBodySchema, request.query);
    await validateMdmsSchema(request);
    await validateSheetData(request);
}

export async function validateCreateMdmsDatasRequestForJson(request: any) {
    validateBodyViaSchema(mdmsCreateBodySchema, request.query);
    await validateMdmsSchema(request);
    await validateJSONData(request);
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
        if (!(request.originalUrl.includes('/v1/mdmsbulk/generatejson') || request.originalUrl.includes('/v1/mdmsbulk/createfromjson'))) {
            validateSchemaCompatibility(schema?.definition);
        }
        var schemaDef = schema?.definition;
        addXrefToRequire(schemaDef);
        request.body.currentSchema = schemaDef;
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
    const dataToCreate = sheetData.filter((data: any) => data?.["!status!"] != dataStatus.created);
    if (dataToCreate.length === 0) {
        throwError("COMMON", 400, "VALIDATION_ERROR", `There is no data in the sheet to create`);
    }
    const schema = request.body.currentSchema;
    validateBodyViaSchemaOfSheetData(schema, dataToCreate);
    request.body.dataToCreate = dataToCreate;
}

async function validateJSONData(request: any) {
    const fileUrl = await getFileUrl(request);
    const jsonData: any = await getJsonFromFileURL(fileUrl);
    let dataToCreate = jsonData?.[request.query.schemaCode];
    putIndexNumber(dataToCreate);
    dataToCreate = dataToCreate.filter((data: any) => data?.["!status!"] != dataStatus.created);
    if (dataToCreate.length === 0) {
        throwError("COMMON", 400, "VALIDATION_ERROR", `There is no data in the json file to create`);
    }
    const schema = request.body.currentSchema;
    validateBodyViaSchemaOfJSONData(schema, dataToCreate);
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
    await validateXRefSchemaData(request, errors);
    request.body.errors = errors;
}

export async function validateForJSONErrors(request: any) {
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
            const indexNumber = data['!index#number!'];
            if (errors?.[indexNumber]) {
                errors[indexNumber].push(message);
            } else {
                errors[indexNumber] = [message];
            }
        }

        if (uniqueFieldMap.has(uniqueIdentifier)) {
            uniqueFieldMap.get(uniqueIdentifier).push(data['!index#number!']);
        } else {
            uniqueFieldMap.set(uniqueIdentifier, [data['!index#number!']]);
        }
    });

    uniqueFieldMap.forEach((rows, identifier) => {
        if (rows.length > 1) {
            const message = `Duplicate entry found at indexes ${rows.join(', ')}`;
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
    await validateXRefSchemaData(request, errors);
    request.body.errors = errors;
}

async function validateXRefSchemaData(request: any, errors: any) {
    const schema = request?.body?.currentSchema;
    const xRefSchema = schema?.["x-ref-schema"];
    const sheetData = request?.body?.dataToCreate;
    if (!xRefSchema) {
        return;
    }
    for (const xRef of xRefSchema) {
        const fieldPath = xRef?.fieldPath;
        const xRefSchemaCode = xRef?.schemaCode;
        const allData = await getAllMdmsData(request, xRefSchemaCode);
        const allUniqueIdentifiers = new Set();
        allData.forEach((data: any) => {
            allUniqueIdentifiers.add(data?.uniqueIdentifier);
        });
        for (const data of sheetData) {
            const uniqueIdentifier = data[fieldPath];
            if (!allUniqueIdentifiers.has(uniqueIdentifier)) {
                const message = `Reference Entry ${uniqueIdentifier} not found in MDMS for schema ${xRefSchemaCode}`;
                logger.info(message);
                if (errors?.[data['!row#number!']]) {
                    errors[data['!row#number!']].push(message);
                } else {
                    errors[data['!row#number!']] = [message];
                }
            }
        }
    }
}

export async function validateSearchRequest(request: any) {
    validateBodyViaSchema(mdmsSearchBodySchema, request.query);
    await getMdmsDetails(request);
}
