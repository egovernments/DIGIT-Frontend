import { throwError } from "../utils/errorUtils";
import { boundaryCreateBodySchema } from "../config/schemas/boundaryCreateBody";
import { validateBodyViaSchema, validateHierarchyType } from "./genericValidator";
import { httpRequest } from "../utils/request";
import config from "../config";
import { getLocalizedHeaders, getLocalizedName } from "../utils/localisationUtils";
import { getHeadersOfBoundarySheet, getHierarchy } from "../utils/boundaryUtils";
import { getSheetData } from "../utils/excelUtils";
import { boundarySearchBodySchema } from "../config/schemas/boundarySearchBody";
import { boundaryTemplateGenerateBodySchema } from "../config/schemas/boundaryTemplateGenerateBody";
const _ = require('lodash');



async function validateFile(tenantID: any, fileStoreId: any) {
    const fileResponse = await httpRequest(config.host.filestore + config.paths.filestore + "/url", {}, { tenantId: tenantID, fileStoreIds: fileStoreId }, "get");
    if (!fileResponse || !fileResponse.fileStoreIds || !fileResponse.fileStoreIds[0] || !fileResponse.fileStoreIds[0].url) {
        throwError("FILE", 400, "INVALID_FILE");
    }
    else {
        return (fileResponse?.fileStoreIds?.[0]?.url);
    }
}

function validateBoundarySheetHeaders(headersOfBoundarySheet: any[], hierarchy: any[], request: any, localizationMap?: any) {
    const localizedBoundaryCode = getLocalizedName(config?.boundary?.boundaryCode, localizationMap)
    const boundaryCodeIndex = headersOfBoundarySheet.indexOf(localizedBoundaryCode);
    const keysBeforeBoundaryCode = boundaryCodeIndex === -1 ? headersOfBoundarySheet : headersOfBoundarySheet.slice(0, boundaryCodeIndex);
    if (keysBeforeBoundaryCode.some((key: any, index: any) => (key === undefined || key === null) || key !== hierarchy[index]) || keysBeforeBoundaryCode.length !== hierarchy.length) {
        const errorMessage = `Boundary Sheet Headers are not the same as the hierarchy present for the given tenant and hierarchy type ${request?.query?.hierarchyType}`;
        throwError("BOUNDARY", 400, "BOUNDARY_SHEET_HEADER_ERROR", errorMessage);
    }
}

async function validateHeaders(hierarchy: any[], headersOfBoundarySheet: any, request: any, localizationMap?: any) {
    validateBoundarySheetHeaders(headersOfBoundarySheet, hierarchy, request, localizationMap);
}

function validateForRootElementExists(boundaryData: any[], hierachy: any[], sheetName: string) {
    const root = hierachy[0];
    if (!(boundaryData.filter(e => e[root]).length == boundaryData.length)) {
        throwError("COMMON", 400, "VALIDATION_ERROR", `Invalid Boundary Sheet. Root level Boundary not present in every row  of Sheet ${sheetName}`)
    }
}
function validateForDupicateRows(boundaryData: any[]) {
    const uniqueRows = _.uniqWith(boundaryData, (obj1: any, obj2: any) => {
        // Exclude '!row#number!' property when comparing objects
        const filteredObj1 = _.omit(obj1, ['!row#number!']);
        const filteredObj2 = _.omit(obj2, ['!row#number!']);
        return _.isEqual(filteredObj1, filteredObj2);
    });
    const duplicateBoundaryRows = boundaryData.filter(e => !uniqueRows.includes(e));
    const duplicateRowNumbers = duplicateBoundaryRows.map(obj => obj['!row#number!']);
    const rowNumbersSeparatedWithCommas = duplicateRowNumbers.join(', ');
    if (duplicateRowNumbers.length > 0) {
        throwError("COMMON", 400, "VALIDATION_ERROR", `Boundary Sheet has duplicate rows at rowNumber ${rowNumbersSeparatedWithCommas}`);
    }
}

async function validateBoundarySheetData(request: any, fileUrl: any, localizationMap?: any) {
    const localizedBoundaryTab = getLocalizedName(config.boundary.boundaryTab, localizationMap);
    const headersOfBoundarySheet = await getHeadersOfBoundarySheet(fileUrl, localizedBoundaryTab, false, localizationMap);
    const hierarchy = await getHierarchy(request, request?.query?.tenantId, request?.query?.hierarchyType);
    const modifiedHierarchy = hierarchy.map(ele => `${request?.query?.hierarchyType}_${ele}`.toUpperCase())
    const localizedHierarchy = getLocalizedHeaders(modifiedHierarchy, localizationMap);
    await validateHeaders(localizedHierarchy, headersOfBoundarySheet, request, localizationMap)
    const boundaryData = await getSheetData(fileUrl, localizedBoundaryTab, true, undefined, localizationMap);
    //validate for whether root boundary level column should not be empty
    validateForRootElementExists(boundaryData, localizedHierarchy, localizedBoundaryTab);
    // validate for duplicate rows(array of objects)
    validateForDupicateRows(boundaryData);
}

export async function validateCreateBoundariesRequest(request: any, localizationMap: any) {
    // validate create request params 
    validateBodyViaSchema(boundaryCreateBodySchema, request.query);
    await validateHierarchyType(request, request?.query?.hierarchyType, request?.query?.tenantId);
    if (request?.query?.tenantId != request?.body?.RequestInfo?.userInfo?.tenantId) {
        throwError("COMMON", 400, "VALIDATION_ERROR", "tenantId is not matching with userInfo");
    }
    const fileUrl = await validateFile(request?.query?.tenantId, request?.query?.fileStoreId);
    await validateBoundarySheetData(request, fileUrl, localizationMap);
}

export function validateSearchBoundaryDetailRequest(request: any) {
    validateBodyViaSchema(boundarySearchBodySchema, request.query);
}

export async function validateBoundaryTemplateGenerateRequest(request: any) {
    validateBodyViaSchema(boundaryTemplateGenerateBodySchema, request.query);
    validateHierarchyType(request, request?.query?.hierarchyType, request?.query?.tenantId);
}
