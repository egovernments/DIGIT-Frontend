import config from "../config";
import { throwError } from "./errorUtils";
import { addDataToSheet, addErrorsToSheet, createAndUploadFile, formatProcessedSheet, freezeStatusColumn, getExcelWorkbookFromFileURL, getNewExcelWorkbook } from "./excelUtils";
import { v4 as uuidv4 } from 'uuid';
import { httpRequest } from "./request";
import { logger } from "./logger";
import { validateForSheetErrors } from "../validators/mdmsValidator";
import { mdmsProcessStatus, sheetDataStatus } from "../config/constants";
import { getFileUrl } from "./genericUtils";
import { persistDetailsOnCompletion, persistDetailsOnError } from "./persistUtils";
import { executeQuery } from "./db";


export async function generateMdmsTemplate(request: any) {
    const schema = request.body.currentSchema;
    const properties = schema.properties;
    const headers = Object.keys(properties);
    const sheetName = config.values.mdmsSheetName + " " + request.query.schemaCode;

    const workbook = await getNewExcelWorkbook();
    const worksheet = workbook.addWorksheet(sheetName);
    addDataToSheet(worksheet, [[...headers, "!status!"]], undefined, undefined, true);
    freezeStatusColumn(worksheet);

    const fileDetails = await createAndUploadFile(workbook, request);
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
                const message = "Successfully created";
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



async function generateProcessFileAfterCreate(request: any, createError: any, createSuccess: any) {
    const fileUrl = await getFileUrl(request);
    const workbook: any = await getExcelWorkbookFromFileURL(fileUrl, config.values.mdmsSheetName + " " + request.query.schemaCode);
    const worksheet: any = workbook.getWorksheet(config.values.mdmsSheetName + " " + request.query.schemaCode);
    addErrorsToSheet(request, worksheet, createError, sheetDataStatus.failed);
    addErrorsToSheet(request, worksheet, createSuccess, sheetDataStatus.created);
    changeStatus(request, createError, createSuccess)
    await formatProcessedSheet(worksheet);
    const fileDetails = await createAndUploadFile(workbook, request);
    logger.info(`File store id for after creation file is ${fileDetails?.[0]?.fileStoreId}`)
    request.body.mdmsDetails.processedFileStoreId = fileDetails?.[0]?.fileStoreId;
}

function changeStatus(request: any, createError: any, createSuccess: any) {
    if (Object.keys(createError).length > 1) {
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
    await addErrorsToSheet(request, worksheet, request.body.errors, sheetDataStatus.invalid);
    if (Object.keys(request?.body?.errors).length > 1) request.body.mdmsDetails.status = mdmsProcessStatus.invalid;
    await formatProcessedSheet(worksheet);
    const fileDetails = await createAndUploadFile(workbook, request);
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
