import * as express from "express";
import { logger } from "../../utils/logger";
import { errorResponder, sendResponse } from "../../utils/index";
import { validateGenericCreateRequest } from "../../utils/validator";
import { processCreate } from "../../api/index";








// Define the MeasurementController class
class genericApiManageController {
    // Define class properties
    public path = "/v1/generic";
    public router = express.Router();
    public dayInMilliSecond = 86400000;

    // Constructor to initialize routes
    constructor() {
        this.intializeRoutes();
    }

    // Initialize routes for MeasurementController
    public intializeRoutes() {
        this.router.post(`${this.path}/_create`, this.create);
    }

    create = async (request: any, response: any) => {
        try {
            await validateGenericCreateRequest(request);
            await processCreate(request);
            return sendResponse(response, { ResourceDetails: request?.body?.ResourceDetails }, request);
        } catch (e: any) {
            logger.error(String(e))
            return errorResponder({ message: String(e) }, request, response);
        }
    }

};
export default genericApiManageController;



