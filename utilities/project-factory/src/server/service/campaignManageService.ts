import express from "express";
import { processBasedOnAction, searchProjectCampaignResourcData } from "../utils/campaignUtils";
import { errorResponder, sendResponse } from "../utils/genericUtils";
import { logger } from "../utils/logger";
import { validateProjectCampaignRequest, validateSearchProjectCampaignRequest } from "../utils/validators/campaignValidators";
import { validateCampaignRequest } from "../utils/validators/genericValidator";
import { createRelatedResouce } from "../api/genericApis";
import { enrichCampaign } from "../api/campaignApis";

async function createProjectTypeCampaignService(request: express.Request, response: express.Response) {
    try {
        logger.info("RECEIVED A PROJECT TYPE CREATE REQUEST");
        // Validate the request for creating a project type campaign
        await validateProjectCampaignRequest(request, "create");
        logger.info("VALIDATED THE PROJECT TYPE CREATE REQUEST");

        // Process the action based on the request type
        await processBasedOnAction(request, "create");

        // Send response with campaign details
        return sendResponse(response, { CampaignDetails: request?.body?.CampaignDetails }, request);
    } catch (e: any) {
        console.log(e)
        logger.error(String(e))
        // Handle errors and send error response
        return errorResponder({ message: String(e), code: e?.code, description: e?.description }, request, response, e?.status || 500);
    }
}

async function updateProjectTypeCampaignService(request: express.Request, response: express.Response) {
    try {
        logger.info("RECEIVED A PROJECT TYPE UPDATE REQUEST");
        // Validate the request for updating a project type campaign
        await validateProjectCampaignRequest(request, "update");
        logger.info("VALIDATED THE PROJECT TYPE UPDATE REQUEST");

        // Process the action based on the request type
        await processBasedOnAction(request, "update");

        // Send response with campaign details
        return sendResponse(response, { CampaignDetails: request?.body?.CampaignDetails }, request);
    } catch (e: any) {
        console.log(e)
        logger.error(String(e))
        // Handle errors and send error response
        return errorResponder({ message: String(e), code: e?.code, description: e?.description }, request, response, e?.status || 500);
    }
}

async function searchProjectTypeCampaignService(
    request: express.Request,
    response: express.Response
) {
    try {
        logger.info("RECEIVED A PROJECT TYPE SEARCH REQUEST");
        // Validate the search request for project type campaigns
        await validateSearchProjectCampaignRequest(request);
        logger.info("VALIDATED THE PROJECT TYPE SEARCH REQUEST");

        // Search for project campaign resource data
        await searchProjectCampaignResourcData(request);
        // Send response with campaign details and total count
        return sendResponse(response, { CampaignDetails: request?.body?.CampaignDetails, totalCount: request?.body?.totalCount }, request);
    } catch (e: any) {
        console.log(e)
        logger.error(String(e))
        // Handle errors and send error response
        return errorResponder({ message: String(e), code: e?.code, description: e?.description }, request, response, e?.status || 500);
    }
};

async function createCampaignService(
    request: express.Request,
    response: express.Response
) {
    try {
        // Validate the request for creating a campaign
        logger.info("RECEIVED A CAMPAIGN CREATE REQUEST");
        await validateCampaignRequest(request.body)
        logger.info("VALIDATED THE CAMPAIGN CREATE REQUEST");

        // Create related resource
        await createRelatedResouce(request.body)

        // Enrich the campaign
        await enrichCampaign(request.body)
        // Send response with campaign details
        return sendResponse(response, { Campaign: request?.body?.Campaign }, request);
    }
    catch (e: any) {
        console.log(e)
        logger.error(String(e))
        // Handle errors and send error response
        return errorResponder({ message: String(e), code: e?.code, description: e?.description }, request, response, e?.status || 500);
    }
};


export {
    createProjectTypeCampaignService,
    updateProjectTypeCampaignService,
    searchProjectTypeCampaignService,
    createCampaignService
}