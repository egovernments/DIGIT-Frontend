import * as express from "express";
import config from "../../config/index";
import { logger } from "../../utils/logger";
import { fullProcessFlowForNewEntry, getModifiedResponse, getNewEntryResponse, getOldEntryResponse, getResponseFromDb } from '../../utils/index'



import {
    sendResponse,
} from "../../utils/index";
import { errorResponder } from "../../utils/index";
import { generateAuditDetails } from "../../utils/index";
import { produceModifiedMessages } from "../../Kafka/Listener";
const updateGeneratedResourceTopic = config.KAFKA_UPDATE_GENERATED_RESOURCE_DETAILS_TOPIC;




// Define the MeasurementController class
class genericAPIController {
    // Define class properties
    public path = "/hcm";
    public router = express.Router();
    public dayInMilliSecond = 86400000;

    // Constructor to initialize routes
    constructor() {
        this.intializeRoutes();
    }

    // Initialize routes for MeasurementController
    public intializeRoutes() {
        this.router.post(`${this.path}/_download`, this.downloadData);
        this.router.post(`${this.path}/_generate`, this.generateData);
    }

    generateData = async (request: express.Request, response: express.Response) => {
        try {
            const responseData = await getResponseFromDb(request, response);
            const modifiedResponse = await getModifiedResponse(responseData);
            const newEntryResponse = await getNewEntryResponse(modifiedResponse, request);
            const oldEntryResponse = await getOldEntryResponse(modifiedResponse, request);
            const { forceUpdate, type } = request.query;
            const forceUpdateBool: boolean = forceUpdate === 'true';
            let generatedResource: any;
            if (forceUpdateBool) {
                if (responseData.length > 0) {
                    generatedResource = { generatedResource: oldEntryResponse };
                    produceModifiedMessages(generatedResource, updateGeneratedResourceTopic);
                }
            }

            if (responseData.length === 0 || forceUpdateBool) {
                await fullProcessFlowForNewEntry(newEntryResponse, request, response);
            }
            return sendResponse(response, { ResponseDetails: { type: type, status: 'Table up to date' } }, request);

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
            const auditDetails = await generateAuditDetails(request);
            const transformedResponse = responseData.map((item: any) => {
                return {
                    fileStoreId: item.filestoreid,
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
};
export default genericAPIController;



