import * as express from "express";
import { generateBoundaryTemplateService, searchBoundaryDetailService } from "../../service/boundaryManageService";
import { logger } from "../../utils/logger";
import { errorResponder, sendResponse } from "../../utils/genericUtils";
import { createBoundariesService } from "../../service/boundaryManageService";



// Define the MeasurementController class
class boundaryManageController {
    // Define class properties
    public path = "/v1/boundary";
    public router = express.Router();
    public dayInMilliSecond = 86400000;

    // Constructor to initialize routes
    constructor() {
        this.intializeRoutes();
    }

    // Initialize routes for MeasurementController
    public intializeRoutes() {
        this.router.post(`${this.path}/create`, this.createBoundaries);
        this.router.post(`${this.path}/search`, this.searchBoundaryDetails);
        this.router.post(`${this.path}/generate`, this.generateBoundaryTemplate);
    }
    /**
 * Handles the creation of a project type campaign.
 * @param request The Express request object.
 * @param response The Express response object.
 */
    createBoundaries = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            logger.info("RECEIVED A BULK BOUNDARY CREATE REQUEST");
            await createBoundariesService(request, response);
            return sendResponse(response, { boundaryDetails: request.body.boundaryDetails }, request);
        } catch (e: any) {
            console.log(e)
            logger.error(String(e))
            // Handle errors and send error response
            return errorResponder({ message: String(e), code: e?.code, description: e?.description }, request, response, e?.status || 500);
        }
    };

    searchBoundaryDetails = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            logger.info("RECEIVED A BOUNDARY DETAILS SEARCH REQUEST");
            await searchBoundaryDetailService(request);
            return sendResponse(response, { boundaryDetails: request.body.boundaryDetails }, request);
        } catch (e: any) {
            console.log(e)
            logger.error(String(e))
            // Handle errors and send error response
            return errorResponder({ message: String(e), code: e?.code, description: e?.description }, request, response, e?.status || 500);
        }
    };

    generateBoundaryTemplate = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            logger.info("RECEIVED A BOUNDARY TEMPLATE GENERATE REQUEST");
            await generateBoundaryTemplateService(request);
            return sendResponse(response, { boundaryDetails: request.body.boundaryDetails }, request);
        } catch (e: any) {
            console.log(e)
            logger.error(String(e))
            // Handle errors and send error response
            return errorResponder({ message: String(e), code: e?.code, description: e?.description }, request, response, e?.status || 500);
        }
    };

};
export default boundaryManageController;



