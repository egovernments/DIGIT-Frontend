import * as express from "express";
import { logger } from "../../utils/logger";
import {
    enrichAndPersistProjectCampaignRequest,
    errorResponder,
    sendResponse,
} from "../../utils/index";
import { validateCampaignRequest, validateProjectCampaignRequest } from "../../utils/validator";
import { createProjectCampaignResourcData, createProjectIfNotExists, createRelatedResouce, enrichCampaign } from "../../api";






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

        try {
            await validateProjectCampaignRequest(request);
            await createProjectCampaignResourcData(request);
            await enrichAndPersistProjectCampaignRequest(request)
            return sendResponse(response, { CampaignDetails: request?.body?.CampaignDetails }, request);
        } catch (e: any) {
            logger.error(String(e))
            return errorResponder({ message: String(e) }, request, response);
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
        catch (e: any) {
            logger.error(String(e))
            return errorResponder({ message: String(e) }, request, response);

        }
    };
};
export default campaignManageController;



