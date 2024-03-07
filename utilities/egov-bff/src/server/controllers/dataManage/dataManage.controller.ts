import * as express from "express";
import { logger } from "../../utils/logger";
import {
    errorResponder,
    processGenerate,
    sendResponse,
} from "../../utils/index";
import { validateGenerateRequest } from "../../utils/validator";
import { createAndUploadFile, getBoundarySheetData, getSheetData } from "../../api/index";
import config from "../../config/index";
import { httpRequest } from "../../utils/request";








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

    generateBoundaryCode = async (request: any, response: any) => {

    }

    createData = async (request: any, response: any) => {

        function validateAction(action: string) {
            if (!(action == "create" || action == "validate")) {
                throw new Error("Invalid action")
            }
        }

        function convertToFacilityCreateData(facilityData: any[]) {
            console.log(facilityData, " fffffffffffffffffffffffffff")
        }
        async function validateFileStoreId(fileStoreId: string, tenantId: string) {
            const fileResponse = await httpRequest(config.host.filestore + config.paths.filestore + "/url", {}, { tenantId: tenantId, fileStoreIds: fileStoreId }, "get");
            if (!fileResponse?.fileStoreIds?.[0]?.url) {
                throw new Error("Invalid file")
            }
            const facilityData = await getSheetData(fileResponse?.fileStoreIds?.[0]?.url, "List of Available Facilities")
            convertToFacilityCreateData(facilityData)
        }
        async function validateCreateRequest(request: any) {
            if (!request?.body?.ResourceDetails) {
                throw new Error("ResourceDetails is missing")
            }
            else {
                if (!request?.body?.ResourceDetails?.fileStoreId) {
                    throw new Error("fileStoreId is missing")
                }
                if (!request?.body?.ResourceDetails?.type) {
                    throw new Error("type is missing")
                }
                if (!request?.body?.ResourceDetails?.tenantId) {
                    throw new Error("tenantId is missing")
                }
                if (!request?.body?.ResourceDetails?.action) {
                    throw new Error("action is missing")
                }
                validateAction(request?.body?.ResourceDetails?.action);
                await validateFileStoreId(request?.body?.ResourceDetails?.fileStoreId, request?.body?.ResourceDetails?.tenantId);
            }
        }
        try {
            await validateCreateRequest(request);
            return sendResponse(response, { GeneratedResource: request?.body?.generatedResource }, request);

        } catch (e: any) {
            logger.error(String(e))
            return errorResponder({ message: String(e) }, request, response);
        }
    }

};
export default dataManageController;



