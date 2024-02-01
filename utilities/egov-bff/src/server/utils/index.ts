import { NextFunction, Request, Response } from "express";
import { httpRequest } from "../utils/request";
import config from "../config/index";
import { consumerGroup } from "../Kafka/Listener";
import { Message } from 'kafka-node';
import { v4 as uuidv4 } from 'uuid';
import { produceModifiedMessages } from '../Kafka/Listener'
import { getCampaignNumber } from "../api/index";

import { logger } from "./logger";
// import { userInfo } from "os";
const NodeCache = require("node-cache");
const jp = require("jsonpath");

const updateCampaignTopic = config.KAFKA_UPDATE_CAMPAIGN_DETAILS_TOPIC;

/*
  stdTTL: (default: 0) the standard ttl as number in seconds for every generated
   cache element. 0 = unlimited

  checkperiod: (default: 600) The period in seconds, as a number, used for the automatic
   delete check interval. 0 = no periodic check.

   30 mins caching
*/

const appCache = new NodeCache({ stdTTL: 1800000, checkperiod: 300 });

/* 
Send The Error Response back to client with proper response code 
*/
const throwError = (
  message = "Internal Server Error",
  code = "INTERNAL_SERVER_ERROR",
  status = 500
) => {
  let error = new Error(message);
  //   error.status = status;
  //   error.code = code;
  logger.error("Error : " + error);

  throw error;
};

/* 
Error Object
*/
const getErrorResponse = (
  code = "INTERNAL_SERVER_ERROR",
  message = "Some Error Occured!!"
) => ({
  ResponseInfo: null,
  Errors: [
    {
      code: code,
      message: message,
      description: null,
      params: null,
    },
  ],
});

/* 
Send The Response back to client with proper response code and response info
*/
const sendResponse = (
  response: Response,
  responseBody: any,
  req: Request,
  code: number = 200
) => {
  /* if (code != 304) {
    appCache.set(req.headers.cachekey, { ...responseBody });
  } else {
    logger.info("CACHED RESPONSE FOR :: " + req.headers.cachekey);
  }
  */
  response.status(code).send({
    ...getResponseInfo(code),
    ...responseBody,
  });
};

/* 
Sets the cahce response
*/
const cacheResponse = (res: Response, key: string) => {
  if (key != null) {
    appCache.set(key, { ...res });
    logger.info("CACHED RESPONSE FOR :: " + key);
  }
};

/* 
gets the cahce response
*/
const getCachedResponse = (key: string) => {
  if (key != null) {
    const data = appCache.get(key);
    if (data) {
      logger.info("CACHE STATUS :: " + JSON.stringify(appCache.getStats()));
      logger.info("RETURNS THE CACHED RESPONSE FOR :: " + key);
      return data;
    }
  }
  return null;
};

/* 
Response Object
*/
const getResponseInfo = (code: Number) => ({
  ResponseInfo: {
    apiId: "egov-bff",
    ver: "0.0.1",
    ts: new Date().getTime(),
    status: "successful",
    desc: code == 304 ? "cached-response" : "new-response",
  },
});

/* 
Fallback Middleware function for returning 404 error for undefined paths
*/
const invalidPathHandler = (
  request: any,
  response: any,
  next: NextFunction
) => {
  response.status(404);
  response.send(getErrorResponse("INVALID_PATH", "invalid path"));
};

/*
Error handling Middleware function for logging the error message
*/
const errorLogger = (
  error: Error,
  request: any,
  response: any,
  next: NextFunction
) => {
  logger.error(error.stack);
  logger.error(`error ${error.message}`);
  next(error); // calling next middleware
};

/*
Error handling Middleware function reads the error message and sends back a response in JSON format
*/
const errorResponder = (
  error: any,
  request: any,
  response: Response,
  next: any = null
) => {
  response.header("Content-Type", "application/json");
  const status = 500;
  response
    .status(status)
    .send(getErrorResponse("INTERNAL_SERVER_ERROR", error?.message));
};

// Convert the object to the format required for measurement
const convertObjectForMeasurment = (obj: any, config: any, defaultValue?: any) => {
  const resultBody: Record<string, any> = defaultValue || {};

  const assignValueAtPath = (obj: any, path: string, value: any) => {
    const pathSegments = path.split(".");
    let current = obj;
    for (let i = 0; i < pathSegments.length - 1; i++) {
      const segment = pathSegments[i];
      if (!current[segment]) {
        current[segment] = {};
      }
      current = current[segment];
    }
    current[pathSegments[pathSegments.length - 1]] = value;
  };

  config.forEach((configObj: any) => {
    const { path, jsonPath } = configObj;
    let jsonPathValue = jp.query(obj, jsonPath);
    if (jsonPathValue.length === 1) {
      jsonPathValue = jsonPathValue[0];
    }
    // Assign jsonPathValue to the corresponding property in resultBody
    assignValueAtPath(resultBody, path, jsonPathValue);
  });

  return resultBody;
};

// Extract estimateIds from all contracts
const extractEstimateIds = (contract: any): any[] => {
  const allEstimateIds = new Set();
  const contractEstimateIds = contract.lineItems.map(
    (item: { estimateId: any }) => item.estimateId
  );
  contractEstimateIds.forEach((id: any) => allEstimateIds.add(id));

  return Array.from(allEstimateIds);
};

const produceIngestion = async (messages: any) => {
  const ifNoneStartedIngestion = !messages?.Job?.ingestionDetails?.history.some(
    (detail: any) => detail.state === 'started'
  );

  const notStartedIngestion = messages?.Job?.ingestionDetails?.history.find(
    (detail: any) => detail.state === 'not-started'
  );
  if (notStartedIngestion) {
    logger.info("Next Ingestion : " + JSON.stringify(notStartedIngestion));
    notStartedIngestion.state = "started";
    messages.Job.tenantId = notStartedIngestion?.tenantId;
    messages.Job.RequestInfo = { userInfo: messages?.Job?.ingestionDetails?.userInfo };
    logger.info("Ingestion Job : " + JSON.stringify(messages.Job))
    logger.info("Ingestionurl : " + config.host.hcmMozImpl + config.paths.hcmMozImpl)
    logger.info("Ingestion Params : " + notStartedIngestion?.ingestionType + "   " + notStartedIngestion?.fileStoreId)
    const ingestionResult = await httpRequest(config.host.hcmMozImpl + config.paths.hcmMozImpl, messages.Job, { ingestionType: notStartedIngestion?.ingestionType, fileStoreId: notStartedIngestion?.fileStoreId }, undefined, undefined, undefined);
    notStartedIngestion.ingestionNumber = ingestionResult?.ingestionNumber;

    if (ifNoneStartedIngestion && notStartedIngestion?.ingestionNumber && messages?.Job?.ingestionDetails?.campaignDetails) {
      messages.Job.ingestionDetails.campaignDetails.status = "In Progress";
      messages.Job.ingestionDetails.campaignDetails.lastModifiedTime = new Date().getTime();
      const updateHistory: any = messages.Job.ingestionDetails;
      logger.info("Updating campaign details with status in progress: " + JSON.stringify(messages.Job.ingestionDetails.campaignDetails));
      produceModifiedMessages(updateHistory, updateCampaignTopic);
    }
    else if (!notStartedIngestion?.ingestionNumber && messages?.Job?.ingestionDetails?.campaignDetails) {
      messages.Job.ingestionDetails.campaignDetails.status = "Failed";
      messages.Job.ingestionDetails.campaignDetails.lastModifiedTime = new Date().getTime();
      const updateHistory: any = messages.Job.ingestionDetails;
      logger.info("Updating campaign details  with status failed: " + JSON.stringify(messages.Job.ingestionDetails.campaignDetails));
      produceModifiedMessages(updateHistory, updateCampaignTopic);
    }
    logger.info("Ingestion Result : " + JSON.stringify(ingestionResult))
  }
  else {
    logger.info("No incomplete ingestion found for Job : " + JSON.stringify(messages.Job))
    messages.Job.ingestionDetails.campaignDetails.status = "Completed";
    messages.Job.ingestionDetails.campaignDetails.lastModifiedTime = new Date().getTime();
    const updateHistory: any = messages.Job.ingestionDetails;
    logger.info("Updating campaign details  with status complete: " + JSON.stringify(messages.Job.ingestionDetails.campaignDetails));
    produceModifiedMessages(updateHistory, updateCampaignTopic);
  }
  return messages.Job;
};

const waitAndCheckIngestionStatus = async (ingestionNumber: String) => {
  const MAX_WAIT_TIME = 3 * 60 * 1000; // Maximum wait time: 3 minutes
  const startTime = Date.now();
  let isCompleted = "notReceived";

  // Set up a one-time event handler for the first completion message
  const messageHandler = async (message: Message) => {
    const ingestionStatus: any = JSON.parse(message.value?.toString() || '{}');
    if (ingestionStatus?.Job?.ingestionNumber == ingestionNumber && ingestionStatus?.Job?.executionStatus === 'Completed') {
      logger.info(`Ingestion ${ingestionNumber} is completed`);
      isCompleted = "receivedTrue";
    } else if (ingestionStatus?.Job?.ingestionNumber == ingestionNumber) {
      isCompleted = "receivedFalse";
    }
  };

  // Register the message handler
  consumerGroup.on('message', messageHandler);

  // Set up error event handlers
  consumerGroup.on('error', (err) => {
    logger.info(`Consumer Error: ${JSON.stringify(err)}`);
  });

  consumerGroup.on('offsetOutOfRange', (err) => {
    logger.info(`Offset out of range error: ${JSON.stringify(err)}`);
  });

  // Keep checking for completion and waiting until MAX_WAIT_TIME
  while (Date.now() - startTime < MAX_WAIT_TIME) {
    // Check if completed
    if (isCompleted !== "notReceived") {
      return isCompleted;
    }

    // Add a delay (e.g., using setTimeout) before checking again.
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // If not completed within the specified time, return the current status
  return isCompleted;
};

async function getCampaignDetails(requestBody: any): Promise<any> {
  const hcmConfig: any = requestBody?.HCMConfig;
  const userInfo: any = requestBody?.RequestInfo?.userInfo;
  const additionalDetails = { selectedRows: hcmConfig?.selectedRows };
  const campaignNumber = await getCampaignNumber(requestBody, config.values.idgen.format, config.values.idgen.idName);
  if (typeof campaignNumber !== 'string') {
    return "INVALID_CAMPAIGN_NUMBER"
  }
  logger.info("Campaign number : " + campaignNumber)
  // Extract details from HCMConfig 
  const campaignDetails = {
    id: uuidv4(),
    tenantId: hcmConfig.tenantId,
    fileStoreId: hcmConfig.fileStoreId,
    campaignType: hcmConfig.campaignType,
    status: "started",
    projectTypeId: hcmConfig.projectTypeId,
    campaignName: hcmConfig.campaignName,
    campaignNumber: campaignNumber,
    createdBy: userInfo?.uuid,
    lastModifiedBy: userInfo?.uuid,
    createdTime: new Date().getTime(),
    lastModifiedTime: new Date().getTime(),
    additionalDetails: additionalDetails ? JSON.stringify(additionalDetails) : ""
  };

  return campaignDetails;
}




export {
  errorResponder,
  errorLogger,
  invalidPathHandler,
  getResponseInfo,
  throwError,
  sendResponse,
  appCache,
  convertObjectForMeasurment,
  extractEstimateIds,
  cacheResponse,
  getCachedResponse,
  produceIngestion,
  waitAndCheckIngestionStatus,
  getCampaignDetails
};
