import * as express from "express";
import config from "../../config/index";
import { logger } from "../../utils/logger";
import { getResponseFromDb } from '../../utils/index'


import {
    getSheetData,
    //     getSheetData,
    searchMDMS,
    getSchema,
    createValidatedData
} from "../../api/index";

import {
    generateActivityMessage,
    generateResourceMessage,
    // processFile,
    // errorResponder,
    sendResponse,
} from "../../utils/index";
import { validateDataWithSchema, validateTransformedData } from "../../utils/validator";
import { httpRequest } from "../../utils/request";
// import { httpRequest } from "../../utils/request";
import { Pool } from 'pg';
import { generateXlsxFromJson } from "../../utils/index"
import { errorResponder } from "../../utils/index";
import { generateAuditDetails } from "../../utils/index";
import { produceModifiedMessages } from "../../Kafka/Listener";
const updateGeneratedResourceTopic = config.KAFKA_UPDATE_GENERATED_RESOURCE_DETAILS_TOPIC;
const createGeneratedResourceTopic = config.KAFKA_CREATE_GENERATED_RESOURCE_DETAILS_TOPIC;




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
            if (result?.validationResult == "VALID_DATA") {
                const createdResult = await createValidatedData(result, type, request.body)
                logger.info(type + " creation result : " + createdResult)
                if (createdResult?.status == "SUCCESS") {
                    const successMessage: any = await generateResourceMessage(request.body, "Completed")
                    const activityMessage: any = await generateActivityMessage(createdResult, successMessage, request.body, "Completed")
                    produceModifiedMessages(successMessage, config.KAFKA_CREATE_RESOURCE_DETAILS_TOPIC);
                    const activities: any = { activities: [activityMessage] }
                    logger.info("Activity Message : " + JSON.stringify(activities))
                    produceModifiedMessages(activities, config.KAFKA_CREATE_RESOURCE_ACTIVITY_TOPIC);
                    logger.info("Success Message : " + JSON.stringify(successMessage))
                    return sendResponse(response, { "result": successMessage }, request);
                }
                else {
                    const failedMessage: any = await generateResourceMessage(request.body, "FAILED")
                    const activityMessage: any = await generateActivityMessage(createdResult, failedMessage, request.body, "FAILED")
                    produceModifiedMessages(failedMessage, config.KAFKA_CREATE_RESOURCE_DETAILS_TOPIC);
                    const activities: any = { activities: [activityMessage] }
                    logger.info("Activity Message : " + JSON.stringify(activities))
                    produceModifiedMessages(activities, config.KAFKA_CREATE_RESOURCE_ACTIVITY_TOPIC);
                    logger.info("Success Message : " + JSON.stringify(failedMessage))
                    return sendResponse(response, { error: createdResult?.responsePayload?.Errors || "Some error occured during creation. Check Logs" }, request);
                }
            }
            else if (result?.validationResult == "INVALID_DATA") {
                const failedMessage: any = await generateResourceMessage(request.body, "INVALID_DATA")
                produceModifiedMessages(failedMessage, config.KAFKA_CREATE_RESOURCE_DETAILS_TOPIC);
                return sendResponse(response, { "error": result?.errors, result: failedMessage }, request);
            }
            else {
                const failedMessage: any = await generateResourceMessage(request.body, "OTHER_ERROR")
                produceModifiedMessages(failedMessage, config.KAFKA_CREATE_RESOURCE_DETAILS_TOPIC);
                return sendResponse(response, { "error": "Error during validated data, Check Logs", result: failedMessage }, request);
            }
        } catch (error: any) {
            logger.error(error);
            return sendResponse(response, { "error": error.message }, request);
        }
    }

    validateData = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const { type, fileStoreId } = request?.body?.ResourceDetails;
            const APIResourceName = type;

            // Search for campaign in MDMS
            const APIResource: any = await searchMDMS([APIResourceName], config.values.APIResource, request.body.RequestInfo, response);
            if (!APIResource.mdms || Object.keys(APIResource.mdms).length === 0) {
                const errorMessage = "Invalid APIResourceType Type";
                logger.error(errorMessage);
                throw new Error(errorMessage);
            }

            const transformTemplate = APIResource?.mdms?.[0]?.data?.transformTemplateName;

            // Search for transform template
            const result: any = await searchMDMS([transformTemplate], config.values.transfromTemplate, request.body.RequestInfo, response);
            const url = config.host.filestore + config.paths.filestore + `/url?tenantId=${request?.body?.RequestInfo?.userInfo?.tenantId}&fileStoreIds=${fileStoreId}`;
            logger.info("File fetching url : " + url);

            const parsingTemplate = APIResource?.mdms?.[0]?.data?.parsingTemplateName;
            let TransformConfig: any;
            if (result?.mdms?.length > 0) {
                TransformConfig = result.mdms[0];
                logger.info("TransformConfig : " + JSON.stringify(TransformConfig));
            }

            // Get data from sheet
            const updatedDatas: any = await getSheetData(url, [{ startRow: 2, endRow: 50 }], TransformConfig?.data?.Fields, "Sheet 1");
            validateTransformedData(updatedDatas);

            const hostHcmBff = config.host.hcmBff.endsWith('/') ? config.host.hcmBff.slice(0, -1) : config.host.hcmBff;
            let processResult: any;
            request.body.HCMConfig = {}
            request.body.HCMConfig['parsingTemplate'] = parsingTemplate;
            request.body.HCMConfig['data'] = updatedDatas;

            // Process data
            processResult = await httpRequest(`${hostHcmBff}${config.app.contextPath}${'/bulk'}/_process`, request.body, undefined, undefined, undefined, undefined);
            if (processResult.Error) {
                logger.error(processResult.Error);
                throw new Error(processResult.Error);
            }

            const healthMaster = APIResource?.mdms?.[0]?.data?.masterDetails?.masterName + "." + APIResource?.mdms?.[0]?.data?.masterDetails?.moduleName;

            // Get schema definition
            const schemaDef = await getSchema(healthMaster, request?.body?.RequestInfo);

            // Validate data with schema
            const validationErrors: any[] = [];
            const validatedData: any[] = [];
            processResult.updatedDatas.forEach((data: any) => {
                const validationResult = validateDataWithSchema(data, schemaDef);
                if (!validationResult.isValid) {
                    validationErrors.push({ data, error: validationResult.error });
                }
                else {
                    validatedData.push(data)
                }
            });

            // Include error messages from MDMS service
            const mdmsErrors = processResult?.mdmsErrors || [];

            // Send response
            if (validationErrors.length > 0 || mdmsErrors.length > 0) {
                const errors = [...validationErrors, ...mdmsErrors];
                return sendResponse(response, { "validationResult": "INVALID_DATA", "errors": errors }, request);
            } else {
                return sendResponse(response, {
                    "validationResult": "VALID_DATA",
                    "data": validatedData,
                    url: APIResource?.mdms?.[0]?.data?.creationConfig?.url,
                    keyName: APIResource?.mdms?.[0]?.data?.creationConfig?.keyName,
                    isBulkCreate: APIResource?.mdms?.[0]?.data?.isBulkCreate
                }, request);
            }
        } catch (error: any) {
            logger.error(error);
            return sendResponse(response, { "validationResult": "ERROR", "errorDetails": error.message }, request);
        }
    };


    generateData = async (request: express.Request, response: express.Response) => {
        try {
            const responseObject = await getResponseFromDb(request, response);
            const responseData = responseObject.responseData;
            const newEntryResponse = responseObject.newEntryResponse;
            const oldEntryResponse = responseObject.oldEntryResponse;
            const { forceUpdate } = request.query;
            const forceUpdateBool: boolean = forceUpdate === 'true';
            let generatedResource: any;

            if (forceUpdateBool) {
                if (responseData.length > 0) {
                    generatedResource = { generatedResource: oldEntryResponse }
                    produceModifiedMessages(generatedResource, updateGeneratedResourceTopic);
                    generatedResource = { generatedResource: newEntryResponse }
                    produceModifiedMessages(generatedResource, createGeneratedResourceTopic);
                }
                else {
                    generatedResource = { generatedResource: newEntryResponse }
                    produceModifiedMessages(generatedResource, createGeneratedResourceTopic);
                }
            }
            else {
                if (responseData.length == 0) {
                    generatedResource = { generatedResource: newEntryResponse };
                    produceModifiedMessages(generatedResource, createGeneratedResourceTopic);
                }
            }

        } catch (e: any) {
            logger.error(String(e))
            return errorResponder({ message: String(e) }, request, response);
        }
    };

    downloadData = async (request: express.Request, response: express.Response) => {
        try {
            const type = request.query.type;
            const pool = new Pool({
                user: config.DB_USER,
                host: config.DB_HOST,
                database: config.DB_NAME,
                password: config.DB_PASSWORD,
                port: parseInt(config.DB_PORT)
            });
            let queryString = "SELECT * FROM eg_generated_resource_details WHERE type = $1";
            logger.info("queryString : " + queryString)
            const queryResult = await pool.query(queryString, [type]);
            logger.info("queryResult : " + JSON.stringify(queryResult.rows))
            // response.json(queryResult.rows);
            const responseData = queryResult.rows;
            await pool.end();
            if (responseData.length > 0) {
                let result = [];
                result = await generateXlsxFromJson(request, response, responseData);
                const auditDetails = await generateAuditDetails(request);
                const transformedResponse = result.map((item: any) => {
                    return {
                        fileStoreId: item.fileStoreId,
                        additionalDetails: {},
                        type: type,
                        url: config.host.filestore + config.paths.filestore + "?" + type,
                        auditDetails: auditDetails // Use the generated audit details for each item
                    };
                });
                return sendResponse(response, { fileStoreIds: transformedResponse }, request);
            }
            else {
                return errorResponder({ message: "No data present of  given type " + "    Check Logs" }, request, response);
            }
        } catch (e: any) {
            logger.error(String(e));
            return errorResponder({ message: String(e) + "    Check Logs" }, request, response);
        }
    };
}
// Export the MeasurementController class
export default genericAPIController;

