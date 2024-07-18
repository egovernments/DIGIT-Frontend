import config from "../config";
import { throwError } from "./errorUtils";
import { addDataToSheet, createAndUploadFile, getNewExcelWorkbook } from "./excelUtils";
import { v4 as uuidv4 } from 'uuid';
import { httpRequest } from "./request";
import { logger } from "./logger";
import { validateForSheetErrors } from "../validators/mdmsValidator";


export async function generateMdmsTemplate(request: any) {
    const schema = request.body.currentSchema;
    const properties = schema.properties;
    const headers = Object.keys(properties);
    const sheetName = config.values.mdmsSheetName + " " + request.query.schemaCode;

    const workbook = await getNewExcelWorkbook();
    const worksheet = workbook.addWorksheet(sheetName);
    addDataToSheet(worksheet, [[...headers, "#status#"]], undefined, undefined, true);

    const fileDetails = await createAndUploadFile(workbook, request);
    if (fileDetails?.length > 0) request.body.fileDetails = fileDetails?.[0];
    else {
        throwError("FILE", 400, "FILE_CREATION_ERROR");
    }
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
