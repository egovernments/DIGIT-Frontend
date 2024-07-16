import * as express from "express";
import { searchBoundaryDetailService } from "../../service/mdmsBulkManageService";
import { logger } from "../../utils/logger";
import { errorResponder, sendResponse } from "../../utils/genericUtils";
import { createBoundariesService } from "../../service/mdmsBulkManageService";



// Define the MeasurementController class
class mdmsBulkManageController {
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
        this.router.post(`${this.path}/create`, this.createMdmsDatas);
        this.router.post(`${this.path}/search`, this.searchMdmsDatas);
    }
    /**
 * Handles the creation of a project type campaign.
 * @param request The Express request object.
 * @param response The Express response object.
 */
    createMdmsDatas = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            logger.info("RECEIVED A BULK MDMS CREATE REQUEST");
            await createMdmsDatasService(request);
            return sendResponse(response, { boundaryDetails: request.body.boundaryDetails }, request);
        } catch (e: any) {
            console.log(e)
            logger.error(String(e))
            // Handle errors and send error response
            return errorResponder({ message: String(e), code: e?.code, description: e?.description }, request, response, e?.status || 500);
        }
    };

    searchMdmsDatas = async (
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

};
export default mdmsBulkManageController;



