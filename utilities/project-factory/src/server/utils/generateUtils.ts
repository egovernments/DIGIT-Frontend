import { getLocalizedMessagesHandler, processGenerate, replicateRequest, throwError } from "./genericUtils";
import _ from 'lodash';
import { logger } from "./logger";
import { getBoundarySheetData } from "../api/genericApis";
import { getLocalisationModuleName } from "./localisationUtils";

// Now you can use Lodash functions with the "_" prefix, e.g., _.isEqual(), _.sortBy(), etc.
function extractProperties(obj: any) {
    return {
        code: obj.code || null,
        includeAllChildren: obj.includeAllChildren || null,
        isRoot: obj.isRoot || null
    };
}

function areBoundariesSame(existingBoundaries: any, currentBoundaries: any) {
    if (existingBoundaries.length !== existingBoundaries.length) return false;
    const existingSetOfBoundaries = new Set(existingBoundaries.map((exboundary: any) => JSON.stringify(extractProperties(exboundary))));
    const currentSetOfBoundaries = new Set(currentBoundaries.map((currboundary: any) => JSON.stringify(extractProperties(currboundary))));
    return _.isEqual(existingSetOfBoundaries, currentSetOfBoundaries);
}

async function callGenerateIfBoundariesDiffer(request: any) {
    try {
        const ExistingCampaignDetails = request?.body?.ExistingCampaignDetails;
        if (ExistingCampaignDetails) {
            if (!areBoundariesSame(ExistingCampaignDetails?.boundaries, request?.body?.CampaignDetails?.boundaries)) {
                console.log("Boundaries differ, generating new resources");

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
                    campaignId: request?.body?.CampaignDetails?.id
                };

                const newParamsBoundary = { ...query, ...params, type: "boundary" };
                const newRequestBoundary = replicateRequest(request, newRequestBody, newParamsBoundary);
                console.log(newRequestBoundary?.body, "111111111")
                await callGenerate(newRequestBoundary, "boundary");

                const newParamsFacilityWithBoundary = { ...query, ...params, type: "facilityWithBoundary" };
                const newRequestFacilityWithBoundary = replicateRequest(request, newRequestBody, newParamsFacilityWithBoundary);
                console.log(newRequestFacilityWithBoundary?.body,"2222222")
                await callGenerate(newRequestFacilityWithBoundary, "facilityWithBoundary");

                const newParamsUserWithBoundary = { ...query, ...params, type: "userWithBoundary" };
                const newRequestUserWithBoundary = replicateRequest(request, newRequestBody, newParamsUserWithBoundary);
                console.log(newRequestUserWithBoundary?.body,"3333333")
                await callGenerate(newRequestUserWithBoundary, "userWithBoundary");
            }
        }
    } catch (error: any) {
        logger.error(error);
        throwError("COMMON", 400, "GENERATE_ERROR", "Error while generating user/facility/boundary");
    }
}

async function callGenerate(request: any, type: any) {
    console.log(`calling generate api for type ${type}`);
    if (type === "facilityWithBoundary" || type == "userWithBoundary") {
        const { hierarchyType } = request.query;
        const localizationMapHierarchy = hierarchyType && await getLocalizedMessagesHandler(
            request,
            request.query.tenantId,
            getLocalisationModuleName(hierarchyType)
        );
        const localizationMapModule = await getLocalizedMessagesHandler(request, request.query.tenantId);
        const localizationMap = { ...localizationMapHierarchy, ...localizationMapModule };
        console.log(request?.body, "rrrrrrrrrrrrrrr")
        const filteredBoundary = await getBoundarySheetData(request, localizationMap);
        await processGenerate(request, filteredBoundary);
    } else {
        console.log(request?.body?.Filters?.boundaries, "wwwwwwwwwwww")
        await processGenerate(request);
    }
}



export { callGenerateIfBoundariesDiffer }