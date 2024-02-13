import * as express from "express";
import config from "../../config/index";
import { logger } from "../../utils/logger";


import {
    getSheetData,
    //     getSheetData,
    searchMDMS,
    getSchema
} from "../../api/index";

import {
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
        this.router.post(`${this.path}/_validate`, this.validateData);
        this.router.post(`${this.path}/_download`, this.downloadData);
    }
    validateData = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const { type, fileStoreId } = request?.body?.ResourceDetails;
            const campaignType = "generic_" + type;

            // Search for campaign in MDMS
            const campaign: any = await searchMDMS([campaignType], config.values.campaignType, request.body.RequestInfo, response);
            if (!campaign.mdms || Object.keys(campaign.mdms).length === 0) {
                const errorMessage = "Invalid Campaign Type";
                logger.error(errorMessage);
                throw new Error(errorMessage);
            }

            const transformTemplate = campaign?.mdms?.[0]?.data?.transformTemplate;

            // Search for transform template
            const result: any = await searchMDMS([transformTemplate], config.values.transfromTemplate, request.body.RequestInfo, response);
            const url = config.host.filestore + config.paths.filestore + `/url?tenantId=${request?.body?.RequestInfo?.userInfo?.tenantId}&fileStoreIds=${fileStoreId}`;
            logger.info("File fetching url : " + url);

            const parsingTemplates = campaign?.mdms?.[0]?.data?.parsingTemplates;
            let TransformConfig: any;
            if (result?.mdms?.length > 0) {
                TransformConfig = result.mdms[0];
                logger.info("TransformConfig : " + JSON.stringify(TransformConfig));
            }

            // Get data from sheet
            const updatedDatas: any = await getSheetData(url, [{ startRow: 2, endRow: 50 }], TransformConfig?.data?.Fields, "Sheet 1");
            validateTransformedData(updatedDatas);

            const hostHcmBff = config.host.hcmBff.endsWith('/') ? config.host.hcmBff.slice(0, -1) : config.host.hcmBff;
            const parsingTemplatesLength = parsingTemplates.length;
            let processResult: any;

            // Iterate over parsing templates
            for (let i = 0; i < parsingTemplatesLength; i++) {
                const parsingTemplate = parsingTemplates[i];
                request.body.HCMConfig = {};
                request.body.HCMConfig['parsingTemplate'] = parsingTemplate.templateName;
                request.body.HCMConfig['data'] = updatedDatas;

                // Process data
                processResult = await httpRequest(`${hostHcmBff}${config.app.contextPath}${'/bulk'}/_process`, request.body, undefined, undefined, undefined, undefined);
                if (processResult.Error) {
                    logger.error(processResult.Error);
                    throw new Error(processResult.Error);
                }

                // Further processing with processResult here if needed
            }

            const healthMaster = `Health.${type.charAt(0).toUpperCase()}${type.slice(1)}`;

            // Get schema definition
            const schemaDef = await getSchema(healthMaster, request?.body?.RequestInfo);

            // Validate data with schema
            const validationErrors: any[] = [];
            processResult.updatedDatas.forEach((data: any) => {
                const validationResult = validateDataWithSchema(data, schemaDef);
                if (!validationResult.isValid) {
                    validationErrors.push({ data, error: validationResult.error });
                }
            });

            // Include error messages from MDMS service
            const mdmsErrors = processResult?.mdmsErrors || [];

            // Send response
            if (validationErrors.length > 0 || mdmsErrors.length > 0) {
                const errors = [...validationErrors, ...mdmsErrors];
                return sendResponse(response, { "validationResult": "INVALID_DATA", "errors": errors }, request);
            } else {
                return sendResponse(response, { "validationResult": "VALID_DATA" }, request);
            }
        } catch (error: any) {
            logger.error(error);
            return sendResponse(response, { "validationResult": "ERROR", "errorDetails": error.message }, request);
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

