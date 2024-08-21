import { getLocalizedMessagesHandler, processGenerate, replicateRequest, throwError } from "./genericUtils";
import _ from 'lodash';
import { logger } from "./logger";
import { getBoundarySheetData } from "../api/genericApis";
import { getLocalisationModuleName } from "./localisationUtils";
import { searchProjectTypeCampaignService } from "../service/campaignManageService";

// Now you can use Lodash functions with the "_" prefix, e.g., _.isEqual(), _.sortBy(), etc.
function extractProperties(obj: any) {
    return {
        code: obj.code || null,
        includeAllChildren: obj.includeAllChildren || null,
        isRoot: obj.isRoot || null
    };
}

function areBoundariesSame(existingBoundaries: any, currentBoundaries: any) {
    if (!existingBoundaries || !currentBoundaries) return false;
    if (existingBoundaries.length !== currentBoundaries.length) return false;
    const existingSetOfBoundaries = new Set(existingBoundaries.map((exboundary: any) => JSON.stringify(extractProperties(exboundary))));
    const currentSetOfBoundaries = new Set(currentBoundaries.map((currboundary: any) => JSON.stringify(extractProperties(currboundary))));
    return _.isEqual(existingSetOfBoundaries, currentSetOfBoundaries);
}

function getTargetResourceFile(campaignDetails: any) {
    const resources = campaignDetails?.resources
    for (const resource of resources) {
        if (resource?.type === "boundaryWithTarget") {
            return resource?.filestoreId
        }
    }
    return null;
}
async function enhanceBoundarySheetDataWithParent(request: any, boundarySheetData: any, localizedBoundaryTab: any) {
    const parentCampaignId = request?.query?.parentCampaignId;
    if (parentCampaignId) {
        const tenantId = request.query?.tenantId
        const searchBodyForParent: any = {
            RequestInfo: request.body.RequestInfo,
            CampaignDetails: {
                tenantId: tenantId,
                ids: [parentCampaignId]
            }
        }
        const req: any = replicateRequest(request, searchBodyForParent)
        const parentSearchResponse: any = await searchProjectTypeCampaignService(req)
        if (Array.isArray(parentSearchResponse?.CampaignDetails)) {
            if (parentSearchResponse?.CampaignDetails?.length <= 0) {
                throwError("CAMPAIGN", 400, "PARENT_CAMPAIGN_ERROR");
            }
            else {
                request.body.parentCampaign = parentSearchResponse?.CampaignDetails[0]
            }
        }
        const targetResourceFileId = getTargetResourceFile(request?.body?.parentCampaign);
        if (!targetResourceFileId) {
            throwError("CAMPAIGN", 400, "PARENT_CAMPAIGN_NO_TARGET_ERROR");
        }
    }
}

async function callGenerateIfBoundariesDiffer(request: any) {
    try {
        const ExistingCampaignDetails = request?.body?.ExistingCampaignDetails;
        const parentCampaign = request?.body?.parentCampaign;
        const newRequestBody = {
            RequestInfo: request?.body?.RequestInfo,
            Filters: {
                boundaries: request?.body?.CampaignDetails?.boundaries
            }
        };

        const { query } = request;
        const params = {
            tenantId: request?.body?.CampaignDetails?.tenantId,
            forceUpdate: 'true',
            hierarchyType: request?.body?.CampaignDetails?.hierarchyType,
            campaignId: request?.body?.CampaignDetails?.id,
            parentCampaignId: parentCampaign?.id || null
        };
        if (ExistingCampaignDetails) {
            if (!areBoundariesSame(ExistingCampaignDetails?.boundaries, request?.body?.CampaignDetails?.boundaries)) {
                logger.info("Boundaries differ, generating new resources");

                const newParamsBoundary = { ...query, ...params, type: "boundary" };
                const newRequestBoundary = replicateRequest(request, newRequestBody, newParamsBoundary);
                await callGenerate(newRequestBoundary, "boundary");

                const newParamsFacilityWithBoundary = { ...query, ...params, type: "facilityWithBoundary" };
                const newRequestFacilityWithBoundary = replicateRequest(request, newRequestBody, newParamsFacilityWithBoundary);
                await callGenerate(newRequestFacilityWithBoundary, "facilityWithBoundary");

                const newParamsUserWithBoundary = { ...query, ...params, type: "userWithBoundary" };
                const newRequestUserWithBoundary = replicateRequest(request, newRequestBody, newParamsUserWithBoundary);
                await callGenerate(newRequestUserWithBoundary, "userWithBoundary");
            }
        }
        else if (request?.body?.CampaignDetails?.boundaries?.length > 0) {
            logger.info("Generating new templates for new campaign");

            const newParamsBoundary = { ...query, ...params, type: "boundary" };
            const newRequestBoundary = replicateRequest(request, newRequestBody, newParamsBoundary);
            await callGenerate(newRequestBoundary, "boundary");

            const newParamsFacilityWithBoundary = { ...query, ...params, type: "facilityWithBoundary" };
            const newRequestFacilityWithBoundary = replicateRequest(request, newRequestBody, newParamsFacilityWithBoundary);
            await callGenerate(newRequestFacilityWithBoundary, "facilityWithBoundary");

            const newParamsUserWithBoundary = { ...query, ...params, type: "userWithBoundary" };
            const newRequestUserWithBoundary = replicateRequest(request, newRequestBody, newParamsUserWithBoundary);
            await callGenerate(newRequestUserWithBoundary, "userWithBoundary");
        }
    } catch (error: any) {
        logger.error(error);
        throwError("COMMON", 400, "GENERATE_ERROR", `Error while generating user/facility/boundary: ${error.message}`);
    }
}

async function callGenerate(request: any, type: any, enableCaching = false) {
    logger.info(`calling generate api for type ${type}`);
    if (type === "facilityWithBoundary" || type == "userWithBoundary") {
        const { hierarchyType } = request.query;
        const localizationMapHierarchy = hierarchyType && await getLocalizedMessagesHandler(
            request,
            request.query.tenantId,
            getLocalisationModuleName(hierarchyType)
        );
        const localizationMapModule = await getLocalizedMessagesHandler(request, request.query.tenantId);
        const localizationMap = { ...localizationMapHierarchy, ...localizationMapModule };
        const filteredBoundary = await getBoundarySheetData(request, localizationMap);
        await processGenerate(request, enableCaching, filteredBoundary);
    } else {
        await processGenerate(request, enableCaching);
    }
}



export { callGenerateIfBoundariesDiffer, callGenerate, areBoundariesSame, enhanceBoundarySheetDataWithParent }
