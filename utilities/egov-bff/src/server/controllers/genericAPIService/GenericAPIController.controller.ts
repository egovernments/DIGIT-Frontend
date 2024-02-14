import * as express from "express";
import config from "../../config/index";
import { logger } from "../../utils/logger";


import {
    getSheetData,
    //     getSheetData,
    searchMDMS
} from "../../api/index";

import {
    // errorResponder,
    sendResponse,
} from "../../utils/index";
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
        this.router.post(`${this.path}/_generate`, this.generateData);

    }
    validateData = async (
        request: express.Request,
        response: express.Response
    ) => {
        const { type, fileStoreId } = request?.body?.ResourceDetails;
        const campaignType = "generic_" + type;
        const campaign: any = await searchMDMS([campaignType], config.values.campaignType, request.body.RequestInfo, response);
        if (!campaign.mdms || Object.keys(campaign.mdms).length === 0) {
            throw new Error("Invalid Campaign Type");
        }
        const transformTemplate = campaign?.mdms?.[0]?.data?.transformTemplate;
        const result: any = await searchMDMS([transformTemplate], config.values.transfromTemplate, request.body.RequestInfo, response);
        console.log(transformTemplate, fileStoreId, " tttttttttttttttttttttttttttt")
        const url = config.host.filestore + config.paths.filestore + `/url?tenantId=${request?.body?.RequestInfo?.userInfo?.tenantId}&fileStoreIds=${fileStoreId}`;
        console.log("File fetching url : " + url)
        var TransformConfig: any;
        if (result?.mdms?.length > 0) {
            TransformConfig = result.mdms[0];
            logger.info("TransformConfig : " + JSON.stringify(TransformConfig))
        }
        const updatedDatas: any = await getSheetData(url, [{ startRow: 2, endRow: 50 }], TransformConfig?.data?.Fields, "Sheet 1");
        console.log(updatedDatas, " uuuuuuuuuuuuddddddddddddddddd")
        // await processFile(request, parsingTemplates, result, hostHcmBff, Job);
        return sendResponse(response, {}, request);
    };

    generateData = async (request: express.Request, response: express.Response) => {
        try {
            const pool = new Pool({
                user: config.DB_USER,
                host: config.DB_HOST,
                database: config.DB_NAME,
                password: config.DB_PASSWORD,
                port: parseInt(config.DB_PORT)
            });
            const { type, forceUpdate } = request.query; console.log(forceUpdate, "fff")
            console.log(type, "ttttt");
            let queryString = "SELECT * FROM eg_generated_resource_details WHERE type = $1 AND status = $2";
            const status = 'completed';
            const queryResult = await pool.query(queryString, [type, status]);
            const responseData = queryResult.rows;
            console.log(responseData,"ressp")
            if(responseData.length>0)
            {
                let expiredResponse = responseData;
                expiredResponse[0].status = "expired";
            }



        } catch
        { }
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
            console.log(queryString)
            const queryResult = await pool.query(queryString, [type]);
            console.log(queryResult, "qqqqqqqqqqqqqqq");
            // response.json(queryResult.rows);
            const responseData = queryResult.rows;
            console.log(responseData, "mmmmmmmmmmmmmmmmmmmmmmmm")
            await pool.end();
            if (responseData.length > 0) {
                let result = [];
                result = await generateXlsxFromJson(request, response, responseData);
                console.log(result, "resssssuuuuultt")
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

