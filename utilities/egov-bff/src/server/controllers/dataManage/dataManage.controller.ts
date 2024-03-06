import * as express from "express";
import { logger } from "../../utils/logger";
import {
    errorResponder,
    processGenerate,
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
        this.router.post(`${this.path}/_generate`, this.generateData);
        this.router.post(`${this.path}/_getboundarysheet`, this.getBoundaryData);
        this.router.post(`${this.path}/generateBoundaryCode`, this.generateBoundaryCode);
    }


    generateData = async (request: express.Request, response: express.Response) => {
        try {
            validateGenerateRequest(request);
            await processGenerate(request, response);
            return sendResponse(response, { GeneratedResource: request?.body?.generatedResource }, request);

        } catch (e: any) {
            logger.error(String(e))
            return errorResponder({ message: String(e) }, request, response);
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



