import * as express from "express";
import { logger } from "../../utils/logger";
import {
    sendResponse,
} from "../../utils/index";
import { validateCampaignRequest } from "../../utils/validator";
import { createProjectIfNotExists, createRelatedResouce, enrichCampaign } from "../../api";





// Define the MeasurementController class
class campaignManageController {
    // Define class properties
    public path = "/v1/project-type";
    public router = express.Router();
    public dayInMilliSecond = 86400000;

    // Constructor to initialize routes
    constructor() {
        this.intializeRoutes();
    }

    // Initialize routes for MeasurementController
    public intializeRoutes() {
        this.router.post(`${this.path}/create`, this.createProjectTypeCampaign);
        this.router.post(`${this.path}/createCampaign`, this.createCampaign);
    }
    createProjectTypeCampaign = async (
        request: express.Request,
        response: express.Response
    ) => {

        async function validateProjectCampaignBoundaries(boundaries: any[]) {
            if (!Array.isArray(boundaries)) {
                throw new Error("boundaries should be an array");
            }
            if (boundaries.length === 0) {
                throw new Error("boundaries should not be empty");
            }
            for (const boundary of boundaries) {
                const { code, type } = boundary;
                if (!code) {
                    throw new Error("boundary code is required");
                }
                if (!type) {
                    throw new Error("boundary type is required");
                }
            }
        }
        async function validateProjectCampaignRequest(request: any) {
            const { CampaignDetails } = request.body;
            if (!CampaignDetails) {
                throw new Error("CampaignDetails is required");
            }
            const { hierarchyType, tenantId, campaignName, action, startDate, endDate, boundaries, resources, projectType, deliveryRules, additionalDetails } = CampaignDetails;

            const missingFields = [];
            if (!hierarchyType) missingFields.push("hierarchyType");
            if (!tenantId) missingFields.push("tenantId");
            if (!campaignName) missingFields.push("campaignName");
            if (!action) missingFields.push("action");
            if (!startDate) missingFields.push("startDate");
            if (!endDate) missingFields.push("endDate");
            if (!boundaries) missingFields.push("boundaries");
            if (!resources) missingFields.push("resources");
            if (!projectType) missingFields.push("projectType");
            if (!deliveryRules) missingFields.push("deliveryRules");
            if (!additionalDetails) missingFields.push("additionalDetails");

            if (missingFields.length > 0) {
                const errorMessage = "The following fields are missing: " + missingFields.join(", ");
                throw new Error(errorMessage);
            }
            await validateProjectCampaignBoundaries(boundaries);
        }
        try {
            await validateProjectCampaignRequest(request)
            // await createProjectIfNotExists(request.body)
            // await createRelatedResouce(request.body)
            // await enrichCampaign(request.body)
            return sendResponse(response, { Campaign: request?.body?.Campaign }, request);
        }
        catch (error: any) {
            logger.error(error);
            return sendResponse(response, { "error": error.message }, request);

        }
    };

    createCampaign = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            await validateCampaignRequest(request.body)
            await createProjectIfNotExists(request.body)
            await createRelatedResouce(request.body)
            await enrichCampaign(request.body)
            return sendResponse(response, { Campaign: request?.body?.Campaign }, request);
        }
        catch (error: any) {
            logger.error(error);
            return sendResponse(response, { "error": error.message }, request);

        }
    };
};
export default campaignManageController;



