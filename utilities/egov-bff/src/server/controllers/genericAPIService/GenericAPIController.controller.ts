import * as express from "express";
import config from "../../config/index";
import { logger } from "../../utils/logger";
import { getResponseFromDb } from '../../utils/index'


import {
    getSheetData,
    //     getSheetData,
    searchMDMS,
    getSchema,
    processCreateData
} from "../../api/index";

import {
    generateResourceMessage,
    // processFile,
    // errorResponder,
    sendResponse,
} from "../../utils/index";
import { processValidationWithSchema, validateTransformedData } from "../../utils/validator";
import { httpRequest } from "../../utils/request";
// import { httpRequest } from "../../utils/request";
import { Pool } from 'pg';
import { generateXlsxFromJson } from "../../utils/index"
import { errorResponder } from "../../utils/index";
import { generateAuditDetails } from "../../utils/index";
import { produceModifiedMessages } from "../../Kafka/Listener";
import { callSearchApi } from  '../../utils/index'
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
                const ResponseDetails = await processCreateData(result, type, request);
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
            processValidationWithSchema(processResult, validationErrors, validatedData, schemaDef);

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
                    creationDetails: {
                        host: APIResource?.mdms?.[0]?.data?.host,
                        url: APIResource?.mdms?.[0]?.data?.creationConfig?.url,
                        keyName: APIResource?.mdms?.[0]?.data?.creationConfig?.keyName,
                        isBulkCreate: APIResource?.mdms?.[0]?.data?.creationConfig?.isBulkCreate,
                        creationLimit: APIResource?.mdms?.[0]?.data?.creationConfig?.limit,
                        responsePathToCheck: APIResource?.mdms?.[0]?.data?.creationConfig?.responsePathToCheck,
                        checkOnlyExistence: APIResource?.mdms?.[0]?.data?.creationConfig?.checkOnlyExistence,
                        matchDataLength: APIResource?.mdms?.[0]?.data?.creationConfig?.matchDataLength,
                        responseToMatch: APIResource?.mdms?.[0]?.data?.creationConfig?.responseToMatch
                    }
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
                   await  callSearchApi(request, response);
                }
                else {
                    generatedResource = { generatedResource: newEntryResponse }
                    produceModifiedMessages(generatedResource, createGeneratedResourceTopic);
                   await callSearchApi(request, response);

                }
            }
            else {
                if (responseData.length == 0) {
                    generatedResource = { generatedResource: newEntryResponse };
                    produceModifiedMessages(generatedResource, createGeneratedResourceTopic);
                   const responseDatas: any = await  callSearchApi(request, response);
                   console.log(responseDatas.length,"pppppp")
                   return sendResponse(
                    response,
                    { "count": responseDatas.length },
                    request
                  );
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

