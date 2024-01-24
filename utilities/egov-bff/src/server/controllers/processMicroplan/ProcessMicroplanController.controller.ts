import * as express from "express";
import { produceIngestion } from "../../utils";
import FormData from 'form-data';
import config from "../../config/index";
import * as XLSX from 'xlsx';
import { logger } from "../../utils/logger";

import {
  searchMDMS
} from "../../api/index";

import {
  errorResponder,
  sendResponse,
} from "../../utils/index";
import { httpRequest } from "../../utils/request";

// Define the MeasurementController class
class BulkUploadController {
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
    this.router.post(`${this.path}/_processmicroplan`, this.processMicroplan);
  }


  processMicroplan = async (
    request: express.Request,
    response: express.Response
  ) => {
    var result: any, Job: any = { ingestionDetails: { userInfo: {}, history: [] } };
    try {
      try {
        const { campaignType } = request?.body?.HCMConfig;
        const campaign: any = await searchMDMS([campaignType], config.values.campaignType, request.body.RequestInfo, response);
        request.body.HCMConfig['transformTemplate'] = campaign?.mdms?.[0]?.data?.transformTemplate;
        const parsingTemplates = campaign?.mdms?.[0]?.data?.parsingTemplates;
        logger.info("ParsingTemplates : " + JSON.stringify(parsingTemplates))
        const hostHcmBff = config.host.hcmBff.endsWith('/') ? config.host.hcmBff.slice(0, -1) : config.host.hcmBff;
        result = await httpRequest(`${hostHcmBff}${config.app.contextPath}${'/bulk'}/_transform`, request.body, undefined, undefined, undefined, undefined);
        var parsingTemplatesLength = parsingTemplates.length
        for (let i = 0; i < parsingTemplatesLength; i++) {
          const parsingTemplate = parsingTemplates[i];
          request.body.HCMConfig['parsingTemplate'] = parsingTemplate.templateName;
          request.body.HCMConfig['data'] = result?.updatedDatas;
          var processResult: any = await httpRequest(`${hostHcmBff}${config.app.contextPath}${'/bulk'}/_process`, request.body, undefined, undefined, undefined, undefined);
          const updatedData = processResult?.updatedDatas;
          if (Array.isArray(updatedData)) {
            // Create a new array with simplified objects
            const simplifiedData = updatedData.map((originalObject) => {
              // Initialize acc with an explicit type annotation
              const acc: { [key: string]: any } = {};

              // Extract key-value pairs where values are not arrays or objects
              const simplifiedObject = Object.entries(originalObject).reduce((acc, [key, value]) => {
                if (!Array.isArray(value) && typeof value !== 'object') {
                  acc[key] = value;
                }
                return acc;
              }, acc);

              return simplifiedObject;
            });
            logger.info("SimplifiedData for sheet : " + JSON.stringify(simplifiedData))
            const ws = XLSX.utils.json_to_sheet(simplifiedData);

            // Create a new workbook
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
            const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
            const formData = new FormData();
            formData.append('file', buffer, 'filename.xlsx');
            formData.append('tenantId', request?.body?.RequestInfo?.userInfo?.tenantId);
            formData.append('module', 'pgr');

            try {
              var fileCreationResult;
              try {
                logger.info("File uploading url : " + config.host.filestore + config.paths.filestore);
                fileCreationResult = await httpRequest(config.host.filestore + config.paths.filestore, formData, undefined, undefined, undefined,
                  {
                    'Content-Type': 'multipart/form-data',
                    'auth-token': request?.body?.RequestInfo?.authToken
                  }
                );
              } catch (error: any) {
                logger.error("File Creation Error : " + JSON.stringify(error));
                return errorResponder(
                  { message: error?.response?.data?.Errors[0]?.message },
                  request,
                  response
                );
              }
              const responseData = fileCreationResult?.files;
              logger.info("Response data after File Creation : " + JSON.stringify(responseData));
              if (Array.isArray(responseData) && responseData.length > 0) {
                Job.ingestionDetails.history.push({ id: responseData[0].fileStoreId, tenantId: responseData[0].tenantId, state: "not-started", type: "xlsx", ingestionType: parsingTemplate.ingestionType });
              }
            } catch (error: any) {
              return errorResponder(
                { message: "Error in creating FileStoreId" },
                request,
                response
              );
            }
          }
        }
      } catch (e: any) {
        logger.error(String(e))
        return errorResponder({ message: String(e) + "    Check Logs" }, request, response);
      }
    } catch (e: any) {
      return errorResponder({ message: e?.response?.data?.Errors[0].message }, request, response);
    }
    Job.ingestionDetails.userInfo = request?.body?.RequestInfo?.userInfo;
    const updatedJob: any = await produceIngestion({ Job });
    return sendResponse(
      response,
      { Job: updatedJob },
      request
    );
  };

}

// Export the MeasurementController class
export default BulkUploadController;
