import * as express from "express";
import { logger } from "../../utils/logger";
import {
    errorResponder,
    processGenerateRequest,
    sendResponse,
} from "../../utils/index";
import { validateGenerateRequest } from "../../utils/validator";
import { createAndUploadFile, getBoundarySheetData } from "../../api/index";






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
        this.router.post(`${this.path}/_getboundarysheet`, this.getBoundaryData);
        this.router.post(`${this.path}/generateBoundaryCode`, this.generateBoundaryCode);
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


    getBoundaryData = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const boundarySheetData: any = await getBoundarySheetData(request);
            const BoundaryFileDetails: any = await createAndUploadFile(boundarySheetData?.wb, request);
            return BoundaryFileDetails;
        }
        catch (error: any) {
            logger.error(String(error));
            return errorResponder({ message: String(error) + "    Check Logs" }, request, response);
        }
    };

    generateBoundaryCode = async (request: any, response: any) => {

    }

};
export default dataManageController;



