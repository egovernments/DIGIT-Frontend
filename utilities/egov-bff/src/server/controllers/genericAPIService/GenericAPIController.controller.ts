import * as express from "express";
import config from "../../config/index";
import { logger } from "../../utils/logger";
import { fetchDataAndUpdate, fullProcessFlowForNewEntry, getModifiedResponse, getNewEntryResponse, getOldEntryResponse, getResponseFromDb, processValidationResultsAndSendResponse } from '../../utils/index'


import {
    searchMDMS,
    processCreateData
} from "../../api/index";

import {
    generateResourceMessage,
    // processFile,
    // errorResponder,
    sendResponse,
} from "../../utils/index";
import { getTransformAndParsingTemplates } from "../../utils/validator";
import { httpRequest } from "../../utils/request";
import { errorResponder } from "../../utils/index";
import { generateAuditDetails } from "../../utils/index";
import { produceModifiedMessages } from "../../Kafka/Listener";
import axios from "axios";
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
        this.router.post(`${this.path}/_create`, this.createData);
        this.router.post(`${this.path}/_validate`, this.validateData);
        this.router.post(`${this.path}/_download`, this.downloadData);
        this.router.post(`${this.path}/_generate`, this.generateData);
    }
    createData = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const { type } = request?.body?.ResourceDetails;
            const hostHcmBff = config.host.hcmBff.endsWith('/') ? config.host.hcmBff.slice(0, -1) : config.host.hcmBff;
            const result = await httpRequest(`${hostHcmBff}${config.app.contextPath}${'/hcm'}/_validate`, request.body, undefined, undefined, undefined, undefined);
            if (result?.validationResult == "VALID_DATA" || result?.validationResult == "NO_VALIDATION_SCHEMA_FOUND") {
                const ResponseDetails = await processCreateData(result, type, request, response);
                return sendResponse(response, { ResponseDetails }, request);
            }
            else if (result?.validationResult == "INVALID_DATA") {
                const failedMessage: any = await generateResourceMessage(request.body, "INVALID_DATA")
                produceModifiedMessages(failedMessage, config.KAFKA_CREATE_RESOURCE_DETAILS_TOPIC);
                const ResponseDetails = failedMessage;
                ResponseDetails.error = result?.errors || "Error during validation of data, Check Logs";
                return sendResponse(response, { ResponseDetails }, request);
            }
            else {
                const failedMessage: any = await generateResourceMessage(request.body, "OTHER_ERROR")
                produceModifiedMessages(failedMessage, config.KAFKA_CREATE_RESOURCE_DETAILS_TOPIC);
                const ResponseDetails = failedMessage;
                ResponseDetails.error = "Some other error, Check Logs";
                return sendResponse(response, { ResponseDetails }, request);
            }
        } catch (error: any) {
            logger.error(error);
            return sendResponse(response, { "error": error.message }, request);
        }
    };


    validateData = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const { type, fileStoreId } = request?.body?.ResourceDetails;
            const APIResourceName = type;

            // Search for campaign in MDMS
            const APIResource: any = await searchMDMS([APIResourceName], config.values.APIResource, request.body.RequestInfo, response);

            const { transformTemplate, parsingTemplate } = await getTransformAndParsingTemplates(APIResource, request, response);
            const { processResult, schemaDef } = await fetchDataAndUpdate(transformTemplate, parsingTemplate, fileStoreId, APIResource, request, response);
            return processValidationResultsAndSendResponse(processResult, schemaDef, APIResource, response, request);
        } catch (error: any) {
            logger.error(error);
            return sendResponse(response, { "validationResult": "ERROR", "errorDetails": error.message }, request);
        }
    };



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
            const apiResponse = await axios.get(config.host.filestore + config.paths.filestore + '/url', {
                params: {
                    tenantId: 'mz',
                    fileStoreIds: responseData.map(item => item.filestoreid).join(',')
                }
            });
            const fileStoreUrl = apiResponse.data;
            const transformedResponse = responseData.map((item: any) => {
                return {
                    fileStoreId: item.filestoreid,
                    additionalDetails: {},
                    type: type,
                    url: fileStoreUrl[item.filestoreid],
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



