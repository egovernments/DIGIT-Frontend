import config from "../config";
import { throwError } from "./errorUtils";
import { addDataToSheet, addErrorsToSheet, createAndUploadFile, formatProcessedSheet, freezeStatusColumn, getExcelWorkbookFromFileURL, getNewExcelWorkbook } from "./excelUtils";
import { v4 as uuidv4 } from 'uuid';
import { httpRequest } from "./request";
import { logger } from "./logger";
import { validateForJSONErrors, validateForSheetErrors } from "../validators/mdmsValidator";
import { mdmsProcessStatus, dataStatus } from "../config/constants";
import { getFileUrl } from "./genericUtils";
import { persistDetailsOnCompletion, persistDetailsOnError } from "./persistUtils";
import { executeQuery } from "./db";
import { addErrorsToJSON, createAndUploadJSONFile, getJsonFromFileURL, putIndexNumber } from "./jsonUtils";


export async function generateMdmsTemplate(request: any) {
    const schema = request.body.currentSchema;
    const properties = schema.properties;
    const headers = Object.keys(properties);
    const sheetName = config.values.mdmsSheetName + " " + request.query.schemaCode;

    const workbook = await getNewExcelWorkbook();
    const worksheet = workbook.addWorksheet(sheetName);
    addDataToSheet(worksheet, [headers], undefined, undefined, true);
    freezeStatusColumn(worksheet);

    const fileDetails = await createAndUploadFile(workbook, request);
    request.body.mdmsGenerateDetails = getMdmsGenerateDetails(request, fileDetails?.[0]?.fileStoreId);
}

export async function generateJSONMdmsTemplate(request: any) {
    const schema: any = request.body.currentSchema;
    const schemaCode: any = request.query.schemaCode;

    // Function to transform schema properties into the desired format, handling nested objects and arrays
    const formatProperties = (
        properties: { [key: string]: any },
        required: any,
        unique: any,
        refSchemas: any
    ) => {
        const formattedProps: { [key: string]: any } = {};

        for (const [key, value] of Object.entries(properties)) {
            let typeString = value.type;

            // Check for required fields
            if (required.includes(key)) {
                typeString += ' | required';
            }

            // Check for unique fields
            if (unique.includes(key)) {
                typeString += ' | unique';
            }

            // Check for reference schemas
            if (refSchemas) {
                const ref = refSchemas.find((ref: any) => ref.fieldPath === key);
                if (ref) {
                    typeString += ` | xRefWith ${ref.schemaCode}`;
                }
            }

            // Handle nested objects
            if (value.type === 'object' && value.properties) {
                formattedProps[key] = formatProperties(
                    value.properties,
                    value.required || [],
                    value['x-unique'] || [],
                    value['x-ref-schema'] || []
                );
            } else if (value.type === 'array' && value.items && value.items.properties) {
                // Handle arrays of objects
                formattedProps[key] = [formatProperties(
                    value.items.properties,
                    value.items.required || [],
                    value.items['x-unique'] || [],
                    value.items['x-ref-schema'] || []
                )];
            } else {
                formattedProps[key] = typeString;
            }
        }

        return formattedProps;
    };

    // Format schema properties
    const formattedProperties = formatProperties(
        schema.properties,
        schema.required || [],
        schema['x-unique'] || [],
        schema['x-ref-schema'] || []
    );

    // Prepare JSON object
    const jsonObject = JSON.stringify({ [schemaCode]: [formattedProperties] }, null, 2);
    const buffer = Buffer.from(jsonObject, 'utf-8');

    // Create and upload the JSON file
    const fileDetails = await createAndUploadJSONFile(buffer, request);
    request.body.mdmsGenerateDetails = getMdmsGenerateDetails(request, fileDetails?.[0]?.fileStoreId);
}



function getMdmsGenerateDetails(request: any, fileStoreId: string) {
    const currentTime = Date.now();
    const mdmsGenerateDetails = {
        id: uuidv4(),
        tenantId: request?.query?.tenantId,
        schemaCode: request?.query?.schemaCode,
        fileStoreId: fileStoreId,
        additionalDetails: null,
        auditDetails: {
            createdTime: currentTime,
            lastModifiedTime: currentTime,
            createdBy: request?.body?.RequestInfo?.userInfo?.uuid || null,
            lastModifiedBy: request?.body?.RequestInfo?.userInfo?.uuid || null
        }
    };
    return mdmsGenerateDetails;
}

export async function processAfterValidation(request: any) {
    try {
        await validateForSheetErrors(request);
        await makeErrorSheet(request);
        await createData(request);
        persistDetailsOnCompletion(request);
    } catch (error) {
        console.log(error);
        persistDetailsOnError(request, error);
    }
}

export async function processAfterValidationForJson(request: any) {
    try {
        await validateForJSONErrors(request);
        await makeErrorJSON(request);
        await createDataFromJson(request);
        persistDetailsOnCompletion(request);
    } catch (error) {
        console.log(error);
        persistDetailsOnError(request, error);
    }
}

async function createData(request: any) {
    if (request?.body?.mdmsDetails?.status == mdmsProcessStatus.invalid) {
        logger.info("Invalid sheet data");
        return;
    }

    var createError: any = {};
    var createSuccess: any = {};
    const dataToCreate = request?.body?.dataToCreate;

    const concurrencyLimit = 50; // Set your desired concurrency limit here
    const chunks = Math.ceil(dataToCreate.length / concurrencyLimit);

    for (let i = 0; i < chunks; i++) {
        const batch = dataToCreate.slice(i * concurrencyLimit, (i + 1) * concurrencyLimit);
        const createPromises = batch.map(async (data: any) => {
            var formattedData = JSON.parse(JSON.stringify(data));
            delete formattedData?.["!status!"];
            delete formattedData?.["!error!"];
            delete formattedData?.["!errors!"];
            delete formattedData?.["!row#number!"];

            const createBody: any = {
                RequestInfo: request.body.RequestInfo,
                Mdms: {
                    tenantId: request?.query?.tenantId,
                    schemaCode: request?.query?.schemaCode,
                    uniqueIdentifier: null,
                    isActive: true,
                    data: formattedData
                }
            };

            try {
                await httpRequest(config.host.mdmsHost + config.paths.mdmsDataCreate + `/${request?.query?.schemaCode}`, createBody);
                const rowNumber = data["!row#number!"];
                const message = "";
                if (createSuccess?.[rowNumber]) {
                    createSuccess[rowNumber].push(message);
                } else {
                    createSuccess[rowNumber] = [message];
                }
            } catch (error: any) {
                console.log(error);
                const rowNumber = data["!row#number!"];
                const message = error?.message || JSON.stringify(error) || "Unknown error";
                if (createError?.[rowNumber]) {
                    createError[rowNumber].push(message);
                } else {
                    createError[rowNumber] = [message];
                }
            }
        });

        await Promise.all(createPromises);
    }

    await generateProcessFileAfterCreate(request, createError, createSuccess);
}


async function createDataFromJson(request: any) {
    if (request?.body?.mdmsDetails?.status == mdmsProcessStatus.invalid) {
        logger.info("Invalid Json data");
        return;
    }

    var createError: any = {};
    var createSuccess: any = {};
    const dataToCreate = request?.body?.dataToCreate;

    const concurrencyLimit = 50; // Set your desired concurrency limit here
    const chunks = Math.ceil(dataToCreate.length / concurrencyLimit);

    for (let i = 0; i < chunks; i++) {
        const batch = dataToCreate.slice(i * concurrencyLimit, (i + 1) * concurrencyLimit);
        const createPromises = batch.map(async (data: any) => {
            var formattedData = JSON.parse(JSON.stringify(data));
            delete formattedData?.["!status!"];
            delete formattedData?.["!error!"];
            delete formattedData?.["!errors!"];
            delete formattedData?.["!row#number!"];
            delete formattedData?.["!index#number!"];

            const createBody: any = {
                RequestInfo: request.body.RequestInfo,
                Mdms: {
                    tenantId: request?.query?.tenantId,
                    schemaCode: request?.query?.schemaCode,
                    uniqueIdentifier: null,
                    isActive: true,
                    data: formattedData
                }
            };

            try {
                await httpRequest(config.host.mdmsHost + config.paths.mdmsDataCreate + `/${request?.query?.schemaCode}`, createBody);
                const indexNumber = data["!index#number!"];
                const message = "";
                if (createSuccess?.[indexNumber]) {
                    createSuccess[indexNumber].push(message);
                } else {
                    createSuccess[indexNumber] = [message];
                }
            } catch (error: any) {
                console.log(error);
                const indexNumber = data["!index#number!"];
                const message = error?.message || JSON.stringify(error) || "Unknown error";
                if (createError?.[indexNumber]) {
                    createError[indexNumber].push(message);
                } else {
                    createError[indexNumber] = [message];
                }
            }
        });

        await Promise.all(createPromises);
    }

    await generateJSONProcessFileAfterCreate(request, createError, createSuccess);
}



async function generateProcessFileAfterCreate(request: any, createError: any, createSuccess: any) {
    const fileUrl = await getFileUrl(request);
    const workbook: any = await getExcelWorkbookFromFileURL(fileUrl, config.values.mdmsSheetName + " " + request.query.schemaCode);
    const worksheet: any = workbook.getWorksheet(config.values.mdmsSheetName + " " + request.query.schemaCode);
    await addErrorsToSheet(request, worksheet, createError, dataStatus.failed);
    await addErrorsToSheet(request, worksheet, createSuccess, dataStatus.created);
    changeStatus(request, createError, createSuccess)
    await formatProcessedSheet(worksheet);
    const fileDetails = await createAndUploadFile(workbook, request);
    logger.info(`File store id for after creation file is ${fileDetails?.[0]?.fileStoreId}`)
    request.body.mdmsDetails.processedFileStoreId = fileDetails?.[0]?.fileStoreId;
}

async function generateJSONProcessFileAfterCreate(request: any, createError: any, createSuccess: any) {
    const fileUrl = await getFileUrl(request);
    const jsonData: any = await getJsonFromFileURL(fileUrl);
    let dataFromJsonFile = jsonData?.[request.query.schemaCode];
    putIndexNumber(dataFromJsonFile);
    await addErrorsToJSON(dataFromJsonFile, createError, dataStatus.failed);
    await addErrorsToJSON(dataFromJsonFile, createSuccess, dataStatus.created);
    changeStatus(request, createError, createSuccess)
    const jsonObject = JSON.stringify({ [request.query.schemaCode]: dataFromJsonFile }, null, 2);
    const buffer = Buffer.from(jsonObject, 'utf-8');
    const fileDetails = await createAndUploadJSONFile(buffer, request);
    logger.info(`File store id for after creation file is ${fileDetails?.[0]?.fileStoreId}`)
    request.body.mdmsDetails.processedFileStoreId = fileDetails?.[0]?.fileStoreId;
}

export function addXrefToRequire(schema: any) {
    const xref = schema?.["x-ref-schema"];
    let requiredFields = schema?.required;
    if (xref) {
        for (const x of xref) {
            const fieldName = x?.fieldPath;
            if (!requiredFields) {
                requiredFields = [fieldName];
            }
            if (!requiredFields?.includes(fieldName)) {
                requiredFields.push(fieldName);
            }
        }
    }
    schema.required = requiredFields;
}

function changeStatus(request: any, createError: any, createSuccess: any) {
    if (Object.keys(createError).length > 0) {
        if (Object.keys(createSuccess).length > 0) {
            request.body.mdmsDetails.status = mdmsProcessStatus.partiallyFailed;
        }
        else {
            request.body.mdmsDetails.status = mdmsProcessStatus.failed;
        }
    }
    else {
        request.body.mdmsDetails.status = mdmsProcessStatus.completed;
    }
}

async function makeErrorSheet(request: any) {
    const fileUrl = await getFileUrl(request);
    const workbook: any = await getExcelWorkbookFromFileURL(fileUrl, config.values.mdmsSheetName + " " + request.query.schemaCode);
    const worksheet: any = workbook.getWorksheet(config.values.mdmsSheetName + " " + request.query.schemaCode);
    await addErrorsToSheet(request, worksheet, request.body.errors, dataStatus.invalid);
    if (Object.keys(request?.body?.errors).length > 0) request.body.mdmsDetails.status = mdmsProcessStatus.invalid;
    await formatProcessedSheet(worksheet);
    const fileDetails = await createAndUploadFile(workbook, request);
    logger.info(`File store id for processed error file is ${fileDetails?.[0]?.fileStoreId}`)
    request.body.mdmsDetails.processedFileStoreId = fileDetails?.[0]?.fileStoreId;
}

async function makeErrorJSON(request: any) {
    const fileUrl = await getFileUrl(request);
    const jsonData: any = await getJsonFromFileURL(fileUrl);
    let dataFromJsonFile = jsonData?.[request.query.schemaCode];
    putIndexNumber(dataFromJsonFile);
    await addErrorsToJSON(dataFromJsonFile, request.body.errors, dataStatus.invalid);
    if (Object.keys(request?.body?.errors).length > 0) request.body.mdmsDetails.status = mdmsProcessStatus.invalid;
    const jsonObject = JSON.stringify({ [request.query.schemaCode]: dataFromJsonFile }, null, 2);
    const buffer = Buffer.from(jsonObject, 'utf-8');
    const fileDetails = await createAndUploadJSONFile(buffer, request);
    logger.info(`File store id for processed error file is ${fileDetails?.[0]?.fileStoreId}`)
    request.body.mdmsDetails.processedFileStoreId = fileDetails?.[0]?.fileStoreId;
}

export async function getUniqueFieldSet(request: any) {
    var allData = await getAllMdmsData(request, request?.query?.schemaCode);
    const xUniqueFields = request?.body?.currentSchema?.["x-unique"];

    logger.info(`Unique fields in schema ${request?.query?.schemaCode} are ${xUniqueFields.join(", ")}`);
    // Extract the data properties from allData
    var datasFromMdms = allData.map((data) => data.data);

    // Create a set of unique identifiers
    var uniqueFieldSet = new Set();
    datasFromMdms.forEach((item: any) => {
        let uniqueIdentifier = xUniqueFields.map((key: any) => item[key]).join('|');
        uniqueFieldSet.add(uniqueIdentifier);
    });

    return uniqueFieldSet;
}






export async function getAllMdmsData(request: any, schemaCode: any) {
    const allData = [];
    let offset = 0;
    const limit = 100;

    while (true) {
        const searchBody = {
            RequestInfo: request.body.RequestInfo,
            MdmsCriteria: {
                tenantId: request.query.tenantId,
                schemaCode: schemaCode,
                limit: limit,
                offset: offset
            }
        };
        const mdmsResponse = await httpRequest(config.host.mdmsHost + config.paths.mdmsDataSearch, searchBody);
        if (mdmsResponse && Array.isArray(mdmsResponse.mdms)) {
            allData.push(...mdmsResponse.mdms);
            if (mdmsResponse.mdms.length < limit) {
                break;
            }
            offset += limit;
        } else {
            throwError("COMMON", 500, "INTERNAL_SERVER_ERROR", `Some error occurred while fetching data from MDMS of schema ${schemaCode}`);
        }
    }
    return allData;
}

export async function getMdmsDetails(request: any) {
    const mdmsDetails = await getMdmsDetailsViaDb(request?.query);
    request.body.mdmsDetails = mdmsDetails;
}

async function getMdmsDetailsViaDb(searchBody: any) {
    const { schemaCode, tenantId, id, status } = searchBody || {};

    let query = `SELECT * FROM ${config.DB_CONFIG.DB_MDMS_DETAILS_TABLE_NAME} WHERE 1=1`;
    const values: any[] = [];

    if (tenantId) {
        query += ' AND "tenantId" = $' + (values.length + 1);
        values.push(tenantId);
    }
    if (schemaCode) {
        query += ' AND "schemaCode" = $' + (values.length + 1);
        values.push(schemaCode);
    }
    if (id) {
        query += ' AND "id" = $' + (values.length + 1);
        values.push(id);
    }
    if (status) {
        query += ' AND "status" = $' + (values.length + 1);
        values.push(status);
    }

    try {
        const result = await executeQuery(query, values);
        formatRows(result.rows);
        return result.rows;
    } catch (error: any) {
        console.log(error)
        logger.error(`Error fetching boundary details: ${error.message}`);
        throw error;
    }
}

function formatRows(rows: any) {
    rows.forEach((row: any) => {
        row.auditDetails = {
            createdTime: parseInt(row.createdTime),
            createdBy: row.createdBy,
            lastModifiedTime: parseInt(row.lastModifiedTime),
            lastModifiedBy: row.lastModifiedBy
        }
        delete row.createdTime;
        delete row.lastModifiedTime;
        delete row.createdBy;
        delete row.lastModifiedBy;
    });
}
