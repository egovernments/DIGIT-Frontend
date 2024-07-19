import config from "../config";
import { throwError } from "./errorUtils";
import { addDataToSheet, addErrorsToSheet, createAndUploadFile, formatProcessedSheet, freezeStatusColumn, getExcelWorkbookFromFileURL, getNewExcelWorkbook } from "./excelUtils";
import { v4 as uuidv4 } from 'uuid';
import { httpRequest } from "./request";
import { logger } from "./logger";
import { validateForSheetErrors } from "../validators/mdmsValidator";
import { sheetDataStatus } from "../config/constants";
import { getFileUrl } from "./genericUtils";


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
    await validateForSheetErrors(request);
    await makeErrorSheet(request);
    await createData(request)
}

async function createData(request: any) {
    var createError: any = {};
    var createSuccess: any = {};
    const dataToCreate = request?.body?.dataToCreate;
    const createBody: any = {
        RequestInfo: request.body.RequestInfo,
        Mdms: {
            tenantId: request?.query?.tenantId,
            schemaCode: request?.query?.schemaCode,
            uniqueIdentifier: null,
            isActive: true
        }
    }
    for (const data of dataToCreate) {
        var formattedData = JSON.parse(JSON.stringify(data));
        delete formattedData?.["!status!"];
        delete formattedData?.["!error!"];
        delete formattedData?.["!row#number!"];
        createBody.Mdms.data = formattedData;
        try {
            await httpRequest(config.host.mdmsHost + config.paths.mdmsDataCreate + `/${request?.query?.schemaCode}`, createBody);
            const rowNumber = data["!row#number!"];
            const message = "Successfully created";
            if (createSuccess?.[rowNumber]) {
                createSuccess[rowNumber].push(message);
            }
            else {
                createSuccess[rowNumber] = [message];
            }
        } catch (error: any) {
            console.log(error)
            const rowNumber = data["!row#number!"];
            const message = error?.message || JSON.stringify(error) || "Unknown error";
            if (createError?.[rowNumber]) {
                createError[rowNumber].push(message);
            }
            else {
                createError[rowNumber] = [message];
            }
        }
    }
    await generateProcessFileAfterCreate(request, createError, createSuccess);
}

async function generateProcessFileAfterCreate(request: any, createError: any, createSuccess: any) {
    const fileUrl = await getFileUrl(request);
    const workbook: any = await getExcelWorkbookFromFileURL(fileUrl, config.values.mdmsSheetName + " " + request.query.schemaCode);
    const worksheet: any = workbook.getWorksheet(config.values.mdmsSheetName + " " + request.query.schemaCode);
    addErrorsToSheet(request, worksheet, createError, sheetDataStatus.failed);
    addErrorsToSheet(request, worksheet, createSuccess, sheetDataStatus.created);
    await formatProcessedSheet(worksheet);
    const fileDetails = await createAndUploadFile(workbook, request);
    logger.info(`File store id for after creation file is ${fileDetails?.[0]?.fileStoreId}`)
    request.body.mdmsDetails.processedFileStoreId = fileDetails?.[0]?.fileStoreId;
}

async function makeErrorSheet(request: any) {
    const fileUrl = await getFileUrl(request);
    const workbook: any = await getExcelWorkbookFromFileURL(fileUrl, config.values.mdmsSheetName + " " + request.query.schemaCode);
    const worksheet: any = workbook.getWorksheet(config.values.mdmsSheetName + " " + request.query.schemaCode);
    await addErrorsToSheet(request, worksheet, request.body.errors, sheetDataStatus.invalid);
    await formatProcessedSheet(worksheet);
    const fileDetails = await createAndUploadFile(workbook, request);
    logger.info(`File store id for processed error file is ${fileDetails?.[0]?.fileStoreId}`)
    request.body.mdmsDetails.processedFileStoreId = fileDetails?.[0]?.fileStoreId;
}

export async function getUniqueFieldSet(request: any) {
    var allData = await getAllMdmsData(request);
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






async function getAllMdmsData(request: any) {
    const allData = [];
    let offset = 0;
    const limit = 100;

    while (true) {
        const searchBody = {
            RequestInfo: request.body.RequestInfo,
            MdmsCriteria: {
                tenantId: request.query.tenantId,
                schemaCode: request.query.schemaCode,
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
            throwError("COMMON", 500, "INTERNAL_SERVER_ERROR", `Some error occurred while fetching data from MDMS of schema ${request.query.schemaCode}`);
        }
    }
    return allData;
}
