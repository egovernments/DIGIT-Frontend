import * as express from "express";
import { logger } from "../../utils/logger";
import {
    sendResponse,
} from "../../utils/index";





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
        this.router.post(`${this.path}/generate`, this.generate);
    }
    generate = async (
        request: express.Request,
        response: express.Response
    ) => {
        function validateGenerateRequest(request: express.Request) {
            const { tenantId, type } = request.params;
            if (!tenantId) {
                throw new Error("tenantId is required");
            }
            if (!(type == "facility" || type == "user" || type == "boundary")) {
                throw new Error("type should be facility or user or boundary");
            }
        }
        async function generateFacility(type: string, tenantId: string, requestBody: any) {

        }
        async function processGenerateRequest(request: express.Request) {
            const { type, tenantId } = request.params
            if (type == "facility") {
                await generateFacility(type, tenantId, request.body);
            }
        }
        try {
            validateGenerateRequest(request);
            await processGenerateRequest(request);
        }
        catch (error: any) {
            logger.error(error);
            return sendResponse(response, { "error": error.message }, request);
        }
    };
};
export default dataManageController;



