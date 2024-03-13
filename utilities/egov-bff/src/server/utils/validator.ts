import * as express from "express";
import { getFacilitiesViaIds } from "../api";
import { convertToFacilityExsistingData, getFacilityIds, matchFacilityData } from "../utils/index";
import { logger } from "../utils/logger";
import Ajv from "ajv";
import config from "../config/index";
import { httpRequest } from "./request";
import facilityTemplateSchema from "../config/facilityTemplateSchema";
import createAndSearch from "../config/createAndSearch";


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

async function fetchBoundariesInChunks(uniqueBoundaries: any[], request: any) {
    const tenantId = request.body.ResourceDetails.tenantId;
    const boundaryEnitiySearchParams: any = {
        tenantId
    };
    const responseBoundaries: any[] = [];

    for (let i = 0; i < uniqueBoundaries.length; i += 10) {
        const chunk = uniqueBoundaries.slice(i, i + 10);
        const concatenatedString = chunk.join(',');
        boundaryEnitiySearchParams.codes = concatenatedString;

        const response = await httpRequest(config.host.boundaryHost + config.paths.boundaryEntity, request.body, boundaryEnitiySearchParams);

        if (!Array.isArray(response?.Boundary)) {
            throw new Error("Error in Boundary Search. Check Boundary codes");
        }

        responseBoundaries.push(...response.Boundary);
    }

    return responseBoundaries;
}

function compareBoundariesWithUnique(uniqueBoundaries: any[], responseBoundaries: any[]) {
    if (responseBoundaries.length >= uniqueBoundaries.length) {
        logger.info("Boundary codes exist");
    } else {
        const responseCodes = responseBoundaries.map(boundary => boundary.code);
        const missingCodes = uniqueBoundaries.filter(code => !responseCodes.includes(code));
        if (missingCodes.length > 0) {
            throw new Error(`Boundary codes ${missingCodes.join(', ')} do not exist`);
        } else {
            throw new Error("Error in Boundary Search. Check Boundary codes");
        }
    }
}

async function validateUniqueBoundaries(uniqueBoundaries: any[], request: any) {
    const responseBoundaries = await fetchBoundariesInChunks(uniqueBoundaries, request);
    compareBoundariesWithUnique(uniqueBoundaries, responseBoundaries);
}



async function validateBoundaryData(data: any[], request: any) {
    const boundarySet = new Set(); // Create a Set to store unique boundaries

    data.forEach((element, index) => {
        const boundaries = element['Boundary Code'];
        if (!boundaries) {
            throw new Error(`Boundary Code is required for element at index ${index}`);
        }

        const boundaryList = boundaries.split(",").map((boundary: any) => boundary.trim());
        if (boundaryList.length === 0) {
            throw new Error(`At least 1 boundary is required for element at index ${index}`);
        }

        for (const boundary of boundaryList) {
            if (!boundary) {
                throw new Error(`Boundary format is invalid at ${index}. Put it with one comma between boundary codes`);
            }
            boundarySet.add(boundary); // Add boundary to the set
        }
    });
    const uniqueBoundaries = Array.from(boundarySet);
    await validateUniqueBoundaries(uniqueBoundaries, request);
}

async function validateViaSchema(data: any, schema: any) {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const validationErrors: any[] = [];
    data.forEach((facility: any, index: any) => {
        if (!validate(facility)) {
            validationErrors.push({ index, errors: validate.errors });
        }
    });

    // Throw errors if any
    if (validationErrors.length > 0) {
        const errorMessage = validationErrors.map(({ index, errors }) => `Facility at index ${index}: ${JSON.stringify(errors)}`).join('\n');
        throw new Error(`Validation errors:\n${errorMessage}`);
    } else {
        logger.info("All Facilities rows are valid.");
    }
}

async function validateFacilityData(data: any, request: any) {
    await validateViaSchema(data, facilityTemplateSchema);
    const facilityDataWithCode = data.map((facility: any, index: number) => ({ ...facility, originalIndex: index }))
        .filter((facility: any) => 'Facility Code' in facility)
    const facilityDataWithoutCode = data.map((facility: any, index: number) => ({ ...facility, originalIndex: index }))
        .filter((facility: any) => !('Facility Code' in facility))
    const facilityExsistingData = convertToFacilityExsistingData(facilityDataWithCode)
    await validateFacilityViaSearch(request?.body?.ResourceDetails?.tenantId, facilityExsistingData, request.body)
    await validateBoundaryData(data, request);
    request.body.facilityToCreate = facilityDataWithoutCode;
    request.body.facilityToSearch = facilityDataWithCode;
}
function validateBooleanField(obj: any, fieldName: any, index: any) {
    if (!obj.hasOwnProperty(fieldName)) {
        throw new Error(`Object at index ${index} is missing field "${fieldName}".`);
    }
    if (typeof obj[fieldName] !== 'boolean') {
        throw new Error(`Object at index ${index} has invalid type for field "${fieldName}". It should be a boolean.`);
    }
}

function validateStringField(obj: any, fieldName: any, index: any) {
    if (!obj.hasOwnProperty(fieldName)) {
        throw new Error(`Object at index ${index} is missing field "${fieldName}".`);
    }
    if (typeof obj[fieldName] !== 'string') {
        throw new Error(`Object at index ${index} has invalid type for field "${fieldName}". It should be a string.`);
    }
    if (obj[fieldName].length < 1) {
        throw new Error(`Object at index ${index} has empty value for field "${fieldName}".`);
    }
    if (obj[fieldName].length > 128) {
        throw new Error(`Object at index ${index} has value for field "${fieldName}" that exceeds the maximum length of 128 characters.`);
    }
}

function validateStorageCapacity(obj: any, index: any) {
    if (!obj.hasOwnProperty('storageCapacity')) {
        throw new Error(`Object at index ${index} is missing field "storageCapacity".`);
    }
    if (typeof obj.storageCapacity !== 'number') {
        throw new Error(`Object at index ${index} has invalid type for field "storageCapacity". It should be a number.`);
    }
}

function validateAction(action: string) {
    if (!(action == "create" || action == "validate")) {
        throw new Error("Invalid action")
    }
}

function validateResourceType(type: string) {
    if (!createAndSearch[type]) {
        throw new Error("Invalid resource type")
    }
}

async function validateCreateRequest(request: any) {
    if (!request?.body?.ResourceDetails) {
        throw new Error("ResourceDetails is missing")
    }
    else {
        if (!request?.body?.ResourceDetails?.fileStoreId) {
            throw new Error("fileStoreId is missing")
        }
        if (!request?.body?.ResourceDetails?.type) {
            throw new Error("type is missing")
        }
        if (!request?.body?.ResourceDetails?.tenantId) {
            throw new Error("tenantId is missing")
        }
        if (!request?.body?.ResourceDetails?.action) {
            throw new Error("action is missing")
        }
        validateAction(request?.body?.ResourceDetails?.action);
        validateResourceType(request?.body?.ResourceDetails?.type);
    }
}

function validateFacilityCreateData(data: any) {
    data.forEach((obj: any) => {
        const originalIndex = obj.originalIndex;

        // Validate string fields
        const stringFields = ['tenantId', 'name', 'usage'];
        stringFields.forEach(field => {
            validateStringField(obj, field, originalIndex);
        });

        // Validate storageCapacity
        validateStorageCapacity(obj, originalIndex);

        // Validate isPermanent
        validateBooleanField(obj, 'isPermanent', originalIndex);
    });

}

async function validateFacilityViaSearch(tenantId: string, data: any, requestBody: any) {
    const ids = getFacilityIds(data);
    const searchedFacilities = await getFacilitiesViaIds(tenantId, ids, requestBody)
    matchFacilityData(data, searchedFacilities)
}




export {
    validateDataWithSchema,
    processValidationWithSchema,
    getTransformAndParsingTemplates,
    validateCampaignRequest,
    validatedProjectResponseAndUpdateId,
    validateStaffResponse,
    validateProjectFacilityResponse,
    validateProjectResourceResponse,
    validateGenerateRequest,
    validateCreateRequest,
    validateFacilityData,
    validateFacilityCreateData,
    validateFacilityViaSearch
};