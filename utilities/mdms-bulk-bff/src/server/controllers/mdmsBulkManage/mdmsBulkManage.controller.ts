import * as express from "express";
import { createMdmsDatasService, generateMdmsJSONTemplateService, generateMdmsTemplateService, searchMdmsBulkDetailService } from "../../service/mdmsBulkManageService";
import { logger } from "../../utils/logger";
import { errorResponder, sendResponse } from "../../utils/genericUtils";


// Define the MeasurementController class
class mdmsBulkManageController {
    // Define class properties
    public path = "/v1/mdmsbulk";
    public router = express.Router();
    public dayInMilliSecond = 86400000;

    // Constructor to initialize routes
    constructor() {
        this.intializeRoutes();
    }

    // Initialize routes for MeasurementController
    public intializeRoutes() {
        this.router.post(`${this.path}/create`, this.createMdmsDatas);
        this.router.post(`${this.path}/generate`, this.generateMdmsTemplate);
        this.router.post(`${this.path}/search`, this.searchMdmsBulkDetails);
        this.router.post(`${this.path}/generatejson`, this.generateMdmsJSONTemplate);
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
            return sendResponse(response, { mdmsDetails: request.body.mdmsDetails }, request);
        } catch (e: any) {
            console.log(e)
            logger.error(String(e))
            // Handle errors and send error response
            return errorResponder({ message: String(e), code: e?.code, description: e?.description }, request, response, e?.status || 500);
        }
    };

    generateMdmsTemplate = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            logger.info("RECEIVED A BULK MDMS TEMPLATE GENERATE REQUEST");
            await generateMdmsTemplateService(request);
            return sendResponse(response, { mdmsGenerateDetails: request.body.mdmsGenerateDetails }, request);
        } catch (e: any) {
            console.log(e)
            logger.error(String(e))
            // Handle errors and send error response
            return errorResponder({ message: String(e), code: e?.code, description: e?.description }, request, response, e?.status || 500);
        }
    };

    generateMdmsJSONTemplate = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            logger.info("RECEIVED A BULK MDMS JSON TEMPLATE GENERATE REQUEST");
            await generateMdmsJSONTemplateService(request);
            return sendResponse(response, { mdmsGenerateDetails: request.body.mdmsGenerateDetails }, request);
        } catch (e: any) {
            console.log(e)
            logger.error(String(e))
            // Handle errors and send error response
            return errorResponder({ message: String(e), code: e?.code, description: e?.description }, request, response, e?.status || 500);
        }
    };

    searchMdmsBulkDetails = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            logger.info("RECEIVED A MDMS DETAILS SEARCH REQUEST");
            await searchMdmsBulkDetailService(request);
            return sendResponse(response, { mdmsDetails: request.body.mdmsDetails }, request);
        } catch (e: any) {
            console.log(e)
            logger.error(String(e))
            // Handle errors and send error response
            return errorResponder({ message: String(e), code: e?.code, description: e?.description }, request, response, e?.status || 500);
        }
    };

};
export default mdmsBulkManageController;



