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

}

// Export the MeasurementController class
export default genericAPIController;
