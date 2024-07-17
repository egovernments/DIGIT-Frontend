import config from "../config";
import { throwError } from "./errorUtils";
import { addDataToSheet, createAndUploadFile, getNewExcelWorkbook } from "./excelUtils";
import { v4 as uuidv4 } from 'uuid';


export async function generateMdmsTemplate(request: any) {
    const schema = request.body.currentSchema;
    const properties = schema.properties;
    const headers = Object.keys(properties);
    const sheetName = config.values.mdmsSheetName;

    const workbook = await getNewExcelWorkbook();
    const worksheet = workbook.addWorksheet(sheetName);
    addDataToSheet(worksheet, [headers], undefined, undefined, true);

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
        schemaName: request?.query?.schemaName,
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