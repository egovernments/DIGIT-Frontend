import * as express from "express";
import { logger } from "../../utils/logger";
import { validateGenerateRequest } from "../../utils/validators/genericValidator";
import { enrichResourceDetails, errorResponder, processGenerate, sendResponse, getResponseFromDb, generateAuditDetails } from "../../utils/genericUtils";
import { processGenericRequest } from "../../api/campaignApis";
import { createAndUploadFile, getBoundarySheetData } from "../../api/genericApis";
import { validateCreateRequest, validateSearchRequest } from "../../utils/validators/campaignValidators";
import {  generateProcessedFileAndPersist, processDataSearchRequest } from "../../utils/campaignUtils";








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
        this.router.post(`${this.path}/_download`, this.downloadData)
        this.router.post(`${this.path}/_getboundarysheet`, this.getBoundaryData);
        this.router.post(`${this.path}/_create`, this.createData);
        this.router.post(`${this.path}/_search`, this.searchData);
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


    downloadData = async (request: express.Request, response: express.Response) => {
        try {
            const type = request.query.type;
            const responseData = await getResponseFromDb(request, response);
            if (!responseData || responseData.length === 0) {
                logger.error("No data of type  " + type + " with status Completed present in db")
                throw new Error('First Generate then Download');
            }
            const auditDetails = generateAuditDetails(request);
            const transformedResponse = responseData.map((item: any) => {
                return {
                    fileStoreId: item.fileStoreid,
                    additionalDetails: {},
                    type: type,
                    auditDetails: auditDetails
                };
            });
            return sendResponse(response, { fileStoreIds: transformedResponse }, request);
        } catch (e: any) {
            logger.error(String(e));
            return errorResponder({ message: String(e) + "    Check Logs" }, request, response);
        }
    }


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

    searchData = async (request: any, response: any) => {
        try {
            await validateSearchRequest(request);
            await processDataSearchRequest(request);
            return sendResponse(response, { ResourceDetails: request?.body?.ResourceDetails }, request);
        } catch (e: any) {
            logger.error(String(e))
            return errorResponder({ message: String(e) }, request, response);
        }
    }

};
export default dataManageController;



