import * as express from "express";
import { logger } from "../../utils/logger";
import {
    processGenerateRequest,
    sendResponse,
} from "../../utils/index";
import { validateGenerateRequest } from "../../utils/validator";






// Define the MeasurementController class
class dataManageController {
    // Define class properties
    public path = "/data/v1";
    public router = express.Router();
    public dayInMilliSecond = 86400000;

    // Constructor to initialize routes
    constructor() {
        this.intializeRoutes();
    }

    // Initialize routes for MeasurementController
    public intializeRoutes() {
        this.router.post(`${this.path}/_generate`, this.generate);
    }
    generate = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            validateGenerateRequest(request);
            await processGenerateRequest(request);
            return sendResponse(response, { fileDetails: request?.body?.fileDetails }, request);
        }
        catch (error: any) {
            logger.error(error);
            return sendResponse(response, { "error": error.message }, request);
        }
    };
};
export default dataManageController;



