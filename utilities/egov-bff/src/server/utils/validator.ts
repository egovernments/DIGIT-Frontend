import * as express from "express";
import { searchMDMS } from "../api";
import { errorResponder } from "../utils/index";
import { logger } from "../utils/logger";
import Ajv from "ajv";
import config from "../config/index";
import { httpRequest } from "./request";





const validateProcessMicroplan = async (
    request: express.Request,
    response: express.Response
) => {
    try {
        const { HCMConfig } = request.body;
        // Ensure that the request body is not empty
        if (!request.body || Object.keys(request.body).length === 0) {
            throw new Error('Request body is empty');
        }

        // Ensure that HCMConfig is present in the request body
        if (!request.body.HCMConfig) {
            throw new Error('HCMConfig is missing in the request body');
        }
        validateField(HCMConfig.tenantId, 'TenantId');
        validateField(HCMConfig.campaignName, 'CampaignName');
        validateField(HCMConfig.projectType, 'ProjectType');
        validateField(HCMConfig.projectTypeId, 'ProjectTypeId');
        validateField(HCMConfig.fileStoreId, 'FileStoreId');
        validateSelectedRows(HCMConfig.selectedRows);
        validateField(HCMConfig.campaignType, 'CampaignType');
        validateProjectType(HCMConfig.projectTypeId, request, response);

    } catch (error: any) {
        response.status(400).send(error.message);
    }
};

const validateField = (field: any, fieldName: string): void => {
    if (!field) {
        throw new Error(`${fieldName} is missing in HCMConfig`);
    }
}
const validateSelectedRows = (selectedRows: any[]): void => {
    if (!selectedRows || selectedRows.length === 0) {
        throw new Error('SelectedRows is missing or empty in HCMConfig');
    }
}

const validateProjectType = async (projectTypeId: any, request: express.Request,
    response: express.Response) => {
    const result: any = await searchMDMS([projectTypeId], "HCM-PROJECT-TYPES.projectTypes", request.body.RequestInfo, response);
    try {
        if (result.mdms.length == 0) {
            // Throw an error with a proper message
            throw new Error("Invalid Project Type ID.");
        }
        const projectTypeFromMDMS = result?.mdms?.[0]?.data?.code;
        if (projectTypeFromMDMS != request?.body?.HCMConfig?.projectType) {
            throw new Error("Invalid Project Type.")
        }
    }
    catch (e: any) {
        logger.error(String(e))
        return errorResponder({ message: String(e) + "  Check Logs" }, request, response);
    }
}

const validateTransformedData = (transformedData: any[]): void => {
    const duplicates: Map<string, number[]> = new Map(); // Map to store duplicates

    for (let i = 0; i < transformedData.length; i++) {
        const rowData1 = transformedData[i];
        const rowNumber1 = rowData1['#row!number#']; // Get the row number of rowData1

        // Iterate over other elements to compare with rowData1
        for (let j = i + 1; j < transformedData.length; j++) {
            const rowData2 = transformedData[j];
            const rowNumber2 = rowData2['#row!number#']; // Get the row number of rowData2

            // Check if rowData1 and rowData2 have the same values for all keys except '#row!number#'
            let isDuplicate = true;
            for (const key of Object.keys(rowData1)) {
                if (key !== '#row!number#' && rowData1[key] !== rowData2[key]) {
                    isDuplicate = false;
                    break;
                }
            }

            // If rowData1 and rowData2 are duplicates, store the row numbers in the duplicates map
            if (isDuplicate) {
                if (!duplicates.has(rowNumber1.toString())) {
                    duplicates.set(rowNumber1.toString(), [rowNumber1]);
                }
                duplicates.get(rowNumber1.toString())?.push(rowNumber2);
            }
        }
    }

    // If duplicates are found, throw an error
    if (duplicates.size > 0) {
        const errorMessage = Array.from(duplicates.entries())
            .map(([rowNumber, duplicateRowNumbers]) => {
                return `Duplicate data in row ${rowNumber} and ${duplicateRowNumbers.slice(1).join(', ')}`;
            })
            .join('; ');
        throw new Error(errorMessage);
    }
};

function validateDataWithSchema(data: any, schema: any): { isValid: boolean; error: Ajv.ErrorObject[] | null | undefined } {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const isValid: any = validate(data);
    if (!isValid) {
        logger.error(JSON.stringify(validate.errors));
    }
    return { isValid, error: validate.errors };
}

function processValidationWithSchema(processResult: any, validationErrors: any, validatedData: any, schemaDef: any) {
    if (schemaDef) {
        processResult.updatedDatas.forEach((data: any) => {
            const validationResult = validateDataWithSchema(data, schemaDef);
            if (!validationResult.isValid) {
                validationErrors.push({ data, error: validationResult.error });
            }
            else {
                validatedData.push(data)
            }
        });
    }
    else {
        logger.info("Skipping Validation of Data as Schema is not defined");
        validationErrors.push("NO_VALIDATION_SCHEMA_FOUND");
        processResult.updatedDatas.forEach((data: any) => {
            validatedData.push(data)
        });
    }
}

async function getTransformAndParsingTemplates(APIResource: any, request: any, response: any) {
    if (!APIResource.mdms || Object.keys(APIResource.mdms).length === 0) {
        const errorMessage = "Invalid APIResourceType Type";
        logger.error(errorMessage);
        throw new Error(errorMessage);
    }

    const transformTemplate = APIResource?.mdms?.[0]?.data?.transformTemplateName;
    const parsingTemplate = APIResource?.mdms?.[0]?.data?.parsingTemplateName;

    return { transformTemplate, parsingTemplate };
}


function validateBoundaries(requestBody: any) {
    const { boundaryCode } = requestBody?.Campaign;
    if (!boundaryCode) {
        throw new Error("Enter BoundaryCode In Campaign")
    }
    for (const campaignDetails of requestBody?.Campaign?.CampaignDetails) {
        const { boundaryCode: campaignBoundaryCode, parentBoundaryCode } = campaignDetails;
        if (!parentBoundaryCode && boundaryCode != campaignBoundaryCode) {
            throw new Error("Enter ParentBoundaryCode In CampaignDetails")
        }
        if (!campaignBoundaryCode) {
            throw new Error("Enter BoundaryCode In CampaignDetails")
        }
    }
}
async function validateUserId(resourceId: any, requestBody: any) {
    const userSearchBody = {
        RequestInfo: requestBody?.RequestInfo,
        tenantId: requestBody?.Campaign?.tenantId.split('.')?.[0],
        uuid: [resourceId]
    }
    logger.info("User search url : " + config.host.userHost + config.paths.userSearch);
    logger.info("userSearchBody : " + JSON.stringify(userSearchBody));
    const response = await httpRequest(config.host.userHost + config.paths.userSearch, userSearchBody);
    if (!response?.user?.[0]?.uuid) {
        throw new Error("Invalid resourceId for resource type staff with id " + resourceId);
    }
}
async function validateProductVariantId(resourceId: any, requestBody: any) {
    const productVariantSearchBody = {
        RequestInfo: requestBody?.RequestInfo,
        ProductVariant: { id: [resourceId] }
    }
    const productVariantSearchParams = {
        limit: 10,
        offset: 0,
        tenantId: requestBody?.Campaign?.tenantId.split('.')?.[0]
    }
    logger.info("ProductVariant search url : " + config.host.productHost + config.paths.productVariantSearch);
    logger.info("productVariantSearchBody : " + JSON.stringify(productVariantSearchBody));
    logger.info("productVariantSearchParams : " + JSON.stringify(productVariantSearchParams));
    const response = await httpRequest(config.host.productHost + config.paths.productVariantSearch, productVariantSearchBody, productVariantSearchParams);
    if (!response?.ProductVariant?.[0]?.id) {
        throw new Error("Invalid resourceId for resource type resource with id " + resourceId);
    }
}
async function validateProjectFacilityId(resourceId: any, requestBody: any) {
    const facilitySearchBody = {
        RequestInfo: requestBody?.RequestInfo,
        Facility: {
            id: [resourceId]
        }
    }
    const facilitySearchParams = {
        limit: 10,
        offset: 0,
        tenantId: requestBody?.Campaign?.tenantId?.split('.')?.[0]
    }
    logger.info("Facility search url : " + config.host.facilityHost + config.paths.facilitySearch);
    logger.info("facilitySearchBody : " + JSON.stringify(facilitySearchBody));
    logger.info("facilitySearchParams : " + JSON.stringify(facilitySearchParams));
    const response = await httpRequest(config.host.facilityHost + config.paths.facilitySearch, facilitySearchBody, facilitySearchParams);
    if (!response?.Facilities?.[0]?.id) {
        throw new Error("Invalid resourceId for resource type facility with id " + resourceId);
    }
}
async function validateResourceId(type: any, resourceId: any, requestBody: any) {
    if (type == "staff") {
        await validateUserId(resourceId, requestBody)
    }
    else if (type == "resource") {
        await validateProductVariantId(resourceId, requestBody)
    }
    else if (type == "facility") {
        await validateProjectFacilityId(resourceId, requestBody)
    }
    else {
        throw new Error("Invalid resource type " + type)
    }
}
async function validateProjectResource(requestBody: any) {
    for (const campaignDetails of requestBody?.Campaign?.CampaignDetails) {
        for (const resource of campaignDetails?.resources) {
            const type = resource?.type;
            for (const resourceId of resource?.resourceIds) {
                if (!type) {
                    throw new Error("Enter Type In Resources")
                }
                if (!resourceId) {
                    throw new Error("Enter ResourceId In Resources")
                }
                await validateResourceId(type, resourceId, requestBody)
            }
        }
    }
}

async function validateCampaign(requestBody: any) {
    for (const campaignDetails of requestBody?.Campaign?.CampaignDetails) {
        var { startDate, endDate } = campaignDetails;
        startDate = parseInt(startDate);
        endDate = parseInt(endDate);

        // Check if startDate and endDate are valid integers
        if (isNaN(startDate) || isNaN(endDate)) {
            throw new Error("Start date or end date is not a valid epoch timestamp");
        }
    }
    await validateProjectResource(requestBody)
}
async function validateCampaignRequest(requestBody: any) {
    if (requestBody?.Campaign) {
        if (!requestBody?.Campaign?.tenantId) {
            throw new Error("Enter TenantId")
        }
        validateBoundaries(requestBody)
        const { projectType } = requestBody?.Campaign
        if (!projectType) {
            throw new Error("Enter ProjectType")
        }
        await validateCampaign(requestBody)
    }
    else {
        throw new Error("Campaign is required")
    }

}


function validatedProjectResponseAndUpdateId(projectResponse: any, projectBody: any, campaignDetails: any) {
    if (projectBody?.Projects?.length != projectResponse?.Project?.length) {
        throw new Error("Project creation failed. Check Logs")
    }
    else {
        for (const project of projectResponse?.Project) {
            if (!project?.id) {
                throw new Error("Project creation failed. Check Logs")
            }
            else {
                campaignDetails.projectId = project.id;
            }
        }
    }
}
function validateStaffResponse(staffResponse: any) {
    if (!staffResponse?.ProjectStaff?.id) {
        throw new Error("Project staff creation failed. Check Logs")
    }
}
function validateProjectResourceResponse(projectResouceResponse: any) {
    if (!projectResouceResponse?.ProjectResource?.id) {
        throw new Error("Project Resource creation failed. Check Logs")
    }
}
function validateProjectFacilityResponse(projectFacilityResponse: any) {
    if (!projectFacilityResponse?.ProjectFacility?.id) {
        throw new Error("Project Facility creation failed. Check Logs")
    }
}

function validateGenerateRequest(request: express.Request) {
    const { tenantId, type } = request.query;
    if (!tenantId) {
        throw new Error("tenantId is required");
    }
    if (!["facility", "user", "boundary", "facilityWithBoundary"].includes(String(type))) {
        throw new Error("type should be facility, user, boundary or facilityWithBoundary");
    }
}




export {
    validateProcessMicroplan,
    validateTransformedData,
    validateDataWithSchema,
    processValidationWithSchema,
    getTransformAndParsingTemplates,
    validateCampaignRequest,
    validatedProjectResponseAndUpdateId,
    validateStaffResponse,
    validateProjectFacilityResponse,
    validateProjectResourceResponse,
    validateGenerateRequest
};