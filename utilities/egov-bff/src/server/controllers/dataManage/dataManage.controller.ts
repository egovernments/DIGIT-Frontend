import * as express from "express";
import { logger } from "../../utils/logger";
import { enrichResourceDetails, errorResponder, generateProcessedFileAndPersist, processGenerate, sendResponse } from "../../utils/index";
import { validateCreateRequest, validateGenerateRequest } from "../../utils/validator";
import { createAndUploadFile, getBoundarySheetData, processGenericRequest } from "../../api/index";








// Define the MeasurementController class
class dataManageController {
    // Define class properties
    public path = "/v1/data";
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
        this.router.post(`${this.path}/_create`, this.createData);
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

    createData = async (request: any, response: any) => {
        try {
            await validateCreateRequest(request);
            await processGenericRequest(request);
            await enrichResourceDetails(request);
            await generateProcessedFileAndPersist(request);
            return sendResponse(response, { ResourceDetails: request?.body?.ResourceDetails }, request);
        } catch (e: any) {
            logger.error(String(e))
            return errorResponder({ message: String(e) }, request, response);
        }
    }

};
export default dataManageController;



