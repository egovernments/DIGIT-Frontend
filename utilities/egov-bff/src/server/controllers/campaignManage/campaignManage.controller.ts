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
    public path = "/process/v1";
    public router = express.Router();
    public dayInMilliSecond = 86400000;

    // Constructor to initialize routes
    constructor() {
        this.intializeRoutes();
    }

    // Initialize routes for MeasurementController
    public intializeRoutes() {
        this.router.post(`${this.path}/create`, this.createCampaign);
    }
    createCampaign = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            validateCampaignRequest(request.body)
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



