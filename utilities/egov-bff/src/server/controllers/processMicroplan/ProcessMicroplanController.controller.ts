import * as express from "express";
import { processFile, produceIngestion } from "../../utils";
import config from "../../config/index";
import { logger } from "../../utils/logger";
import { produceModifiedMessages } from '../../Kafka/Listener';
import { getCampaignDetails } from '../../utils/index'
import { validateProcessMicroplan } from '../../utils/validator'
import {
  searchMDMS
} from "../../api/index";

import {
  errorResponder,
  sendResponse,
} from "../../utils/index";
import { httpRequest } from "../../utils/request";

const saveCampaignTopic = config.KAFKA_SAVE_CAMPAIGN_DETAILS_TOPIC;
const updateCampaignTopic = config.KAFKA_UPDATE_CAMPAIGN_DETAILS_TOPIC;

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
    try {
      await validateProcessMicroplan(request, response);
      const campaignDetails = await getCampaignDetails(request?.body);
      if (campaignDetails == "INVALID_CAMPAIGN_NUMBER") {
        throw new Error("Error during Campaign Number generation");
      }
      var result: any, Job: any = { ingestionDetails: { userInfo: {}, projectType: request?.body?.HCMConfig?.projectType, projectTypeId: request?.body?.HCMConfig?.projectTypeId, projectName: request?.body?.HCMConfig?.campaignName, history: [], campaignDetails: campaignDetails } };
      const saveHistory: any = Job.ingestionDetails;
      logger.info("Saving campaign details : " + JSON.stringify(campaignDetails));
      produceModifiedMessages(saveHistory, saveCampaignTopic);
      try {
        const { campaignType } = request?.body?.HCMConfig;
        const campaign: any = await searchMDMS([campaignType], config.values.campaignType, request.body.RequestInfo, response);
        if (!campaign.mdms || Object.keys(campaign.mdms).length === 0) {
          throw new Error("Invalid Campaign Type");
        }
        request.body.HCMConfig['transformTemplate'] = campaign?.mdms?.[0]?.data?.transformTemplate;
        const parsingTemplates = campaign?.mdms?.[0]?.data?.parsingTemplates;
        logger.info("ParsingTemplates : " + JSON.stringify(parsingTemplates))
        const hostHcmBff = config.host.hcmBff.endsWith('/') ? config.host.hcmBff.slice(0, -1) : config.host.hcmBff;
        result = await httpRequest(`${hostHcmBff}${config.app.contextPath}${'/bulk'}/_transform`, request.body, undefined, undefined, undefined, undefined);
        if (result.Error) {
          throw new Error(result.Error);
        }
        Job.ingestionDetails.campaignDetails.status = "Started"
        Job.ingestionDetails.campaignDetails.auditDetails.lastModifiedTime = new Date().getTime();
        produceModifiedMessages(Job.ingestionDetails, updateCampaignTopic);
        await processFile(request, parsingTemplates, result, hostHcmBff, Job);
      } catch (e: any) {
        logger.error(String(e))
        return errorResponder({ message: String(e) + "    Check Logs" }, request, response);
      }
      Job.ingestionDetails.userInfo = request?.body?.RequestInfo?.userInfo;
      Job.ingestionDetails.campaignDetails = campaignDetails;
      const updatedJob: any = await produceIngestion({ Job });
      return sendResponse(
        response,
        { Job: updatedJob },
        request
      );
    } catch (e: any) {
      logger.error(String(e))
      return errorResponder({ message: String(e) }, request, response);
    }
  };
}

// Export the MeasurementController class
export default BulkUploadController;
