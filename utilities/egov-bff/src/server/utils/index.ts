import { NextFunction, Request, Response } from "express";
import { httpRequest } from "../utils/request";
import config from "../config/index";
import { consumerGroupUpdate } from "../Kafka/Listener";
import { Message } from 'kafka-node';
import { v4 as uuidv4 } from 'uuid';
import { produceModifiedMessages } from '../Kafka/Listener'
import { getCampaignNumber, getResouceNumber } from "../api/index";
import * as XLSX from 'xlsx';
import FormData from 'form-data';
import { Pagination } from "../utils/Pagination";

import { logger } from "./logger";
// import { userInfo } from "os";
const NodeCache = require("node-cache");
const jp = require("jsonpath");
const _ = require('lodash');

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

  const assignValueAtPath = (obj: any, path: any, value: any) => {
    _.set(obj, path, value);
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
    (detail: any) => detail.state === 'Started'
  );

  const notStartedIngestion = messages?.Job?.ingestionDetails?.history.find(
    (detail: any) => detail.state === 'Not-Started'
  );
  if (notStartedIngestion) {
    logger.info("Next Ingestion : " + JSON.stringify(notStartedIngestion));
    notStartedIngestion.state = "Started";
    messages.Job.tenantId = notStartedIngestion?.tenantId;
    messages.Job.RequestInfo = { userInfo: messages?.Job?.ingestionDetails?.userInfo };
    logger.info("Ingestion Job : " + JSON.stringify(messages.Job))
    logger.info("Ingestionurl : " + config.host.hcmMozImpl + config.paths.hcmMozImpl)
    logger.info("Ingestion Params : " + notStartedIngestion?.ingestionType + "   " + notStartedIngestion?.fileStoreId)
    const ingestionResult = await httpRequest(config.host.hcmMozImpl + config.paths.hcmMozImpl, messages.Job, { ingestionType: notStartedIngestion?.ingestionType, fileStoreId: notStartedIngestion?.fileStoreId }, undefined, undefined, undefined);
    notStartedIngestion.ingestionNumber = ingestionResult?.ingestionNumber;

    if (ifNoneStartedIngestion && notStartedIngestion?.ingestionNumber && messages?.Job?.ingestionDetails?.campaignDetails) {
      messages.Job.ingestionDetails.campaignDetails.status = "In Progress";
      messages.Job.ingestionDetails.campaignDetails.auditDetails.lastModifiedTime = new Date().getTime();
      const updateHistory: any = messages.Job.ingestionDetails;
      logger.info("Updating campaign details with status in progress: " + JSON.stringify(messages.Job.ingestionDetails.campaignDetails));
      produceModifiedMessages(updateHistory, updateCampaignTopic);
    }
    else if (!notStartedIngestion?.ingestionNumber && messages?.Job?.ingestionDetails?.campaignDetails) {
      messages.Job.ingestionDetails.campaignDetails.status = "Failed";
      messages.Job.ingestionDetails.campaignDetails.auditDetails.lastModifiedTime = new Date().getTime();
      const updateHistory: any = messages.Job.ingestionDetails;
      logger.info("Updating campaign details  with status failed: " + JSON.stringify(messages.Job.ingestionDetails.campaignDetails));
      produceModifiedMessages(updateHistory, updateCampaignTopic);
    }
    logger.info("Ingestion Result : " + JSON.stringify(ingestionResult))
  }
  else {
    logger.info("No incomplete ingestion found for Job : " + JSON.stringify(messages.Job))
    messages.Job.ingestionDetails.campaignDetails.status = "Completed";
    messages.Job.ingestionDetails.campaignDetails.auditDetails.lastModifiedTime = new Date().getTime();
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
  consumerGroupUpdate.on('message', messageHandler);

  // Set up error event handlers
  consumerGroupUpdate.on('error', (err) => {
    logger.info(`Consumer Error: ${JSON.stringify(err)}`);
  });

  consumerGroupUpdate.on('offsetOutOfRange', (err) => {
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
    status: "Not-Started",
    projectTypeId: hcmConfig.projectTypeId,
    campaignName: hcmConfig.campaignName,
    campaignNumber: campaignNumber,
    auditDetails: {
      createdBy: userInfo?.uuid,
      lastModifiedBy: userInfo?.uuid,
      createdTime: new Date().getTime(),
      lastModifiedTime: new Date().getTime(),
    },
    additionalDetails: additionalDetails ? JSON.stringify(additionalDetails) : ""
  };

  return campaignDetails;
}
async function processFile(request: any, parsingTemplates: any[], result: any, hostHcmBff: string, Job: any) {
  var parsingTemplatesLength = parsingTemplates.length
  for (let i = 0; i < parsingTemplatesLength; i++) {
    const parsingTemplate = parsingTemplates[i];
    request.body.HCMConfig['parsingTemplate'] = parsingTemplate.templateName;
    request.body.HCMConfig['data'] = result?.updatedDatas;
    var processResult: any = await httpRequest(`${hostHcmBff}${config.app.contextPath}${'/bulk'}/_process`, request.body, undefined, undefined, undefined, undefined);
    if (processResult.Error) {
      throw new Error(processResult.Error);
    }
    const updatedData = processResult?.updatedDatas;
    if (Array.isArray(updatedData)) {
      // Create a new array with simplified objects
      const simplifiedData = updatedData.map((originalObject: any) => {
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

      logger.info("File uploading url : " + config.host.filestore + config.paths.filestore);
      var fileCreationResult = await httpRequest(config.host.filestore + config.paths.filestore, formData, undefined, undefined, undefined,
        {
          'Content-Type': 'multipart/form-data',
          'auth-token': request?.body?.RequestInfo?.authToken
        }
      );
      const responseData = fileCreationResult?.files;
      logger.info("Response data after File Creation : " + JSON.stringify(responseData));
      if (Array.isArray(responseData) && responseData.length > 0) {
        Job.ingestionDetails.history.push({
          id: uuidv4(),
          campaignId: Job.ingestionDetails.campaignDetails.id,
          fileStoreId: responseData[0].fileStoreId,
          tenantId: responseData[0].tenantId,
          state: "Not-Started",
          fileType: "xlsx",
          ingestionType: parsingTemplate.ingestionType,
          additionalDetails: "{}",
          auditDetails: {
            createdBy: Job?.ingestionDetails?.campaignDetails?.auditDetails?.createdBy,
            createdTime: Job?.ingestionDetails?.campaignDetails?.auditDetails?.createdTime,
            lastModifiedBy: Job?.ingestionDetails?.campaignDetails?.auditDetails?.lastModifiedBy,
            lastModifiedTime: Job?.ingestionDetails?.campaignDetails?.auditDetails?.lastModifiedTime
          }
        });
      }
    }
  }

}

function generateSortingAndPaginationClauses(pagination: Pagination): string {
  let clauses = '';

  if (pagination && pagination.sortBy && pagination.sortOrder) {
    clauses += ` ORDER BY ${pagination.sortBy} ${pagination.sortOrder}`;
  }

  if (pagination && pagination.limit !== undefined) {
    clauses += ` LIMIT ${pagination.limit}`;
  }

  if (pagination && pagination.offset !== undefined) {
    clauses += ` OFFSET ${pagination.offset}`;
  }

  return clauses;
}
async function generateXlsxFromJson(request: any, response: any, simplifiedData: any) {
  try {
    const ws = XLSX.utils.json_to_sheet(simplifiedData);

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    const formData = new FormData();
    formData.append('file', buffer, 'filename.xlsx');
    formData.append('tenantId', request?.body?.RequestInfo?.userInfo?.tenantId);
    formData.append('module', 'pgr');

    logger.info("File uploading url : " + config.host.filestore + config.paths.filestore);
    var fileCreationResult = await httpRequest(config.host.filestore + config.paths.filestore, formData, undefined, undefined, undefined,
      {
        'Content-Type': 'multipart/form-data',
        'auth-token': request?.body?.RequestInfo?.authToken
      }
    );
    const responseData = fileCreationResult?.files;
    logger.info("Response data after File Creation : " + JSON.stringify(responseData));
    return responseData;
  } catch (e: any) {
    logger.error(String(e))
    return errorResponder({ message: String(e) + "    Check Logs" }, request, response);
  }
}

async function generateAuditDetails(request: any) {

  const createdBy = request?.body?.RequestInfo?.userInfo?.uuid;
  const lastModifiedBy = request?.body?.RequestInfo?.userInfo?.uuid;


  const auditDetails = {
    createdBy: createdBy,
    lastModifiedBy: lastModifiedBy,
    createdTime: Date.now(),
    lastModifiedTime: Date.now()
  }

  return auditDetails;
}

async function generateResourceMessage(requestBody: any, status: string) {

  const resourceMessage = {
    id: uuidv4(),
    status: status,
    tenantId: requestBody?.RequestInfo?.userInfo?.tenantId,
    processReferenceNumber: await getResouceNumber(requestBody?.RequestInfo, "RD-[cy:yyyy-MM-dd]-[SEQ_EG_RD_ID]", "resource.number"),
    fileStoreId: requestBody?.ResourceDetails?.fileStoreId,
    type: requestBody?.ResourceDetails?.type,
    auditDetails: {
      createdBy: requestBody?.RequestInfo?.userInfo?.uuid,
      lastModifiedBy: requestBody?.RequestInfo?.userInfo?.uuid,
      createdTime: Date.now(),
      lastModifiedTime: Date.now()
    },
    additionalDetails: {}
  }
  return resourceMessage;
}

async function generateActivityMessage(createdResult: any, successMessage: any, requestBody: any, status: string) {

  const activityMessage = {
    id: uuidv4(),
    status: createdResult?.status,
    retryCount: 0,
    type: requestBody?.ResourceDetails?.type,
    url: createdResult?.url,
    requestPayload: createdResult?.requestPayload,
    responsePayload: createdResult?.responsePayload,
    auditDetails: {
      createdBy: successMessage?.auditDetails?.createdBy,
      lastModifiedBy: successMessage?.auditDetails?.lastModifiedBy,
      createdTime: successMessage?.auditDetails?.createdTime,
      lastModifiedTime: successMessage?.auditDetails?.lastModifiedTime
    },
    additionalDetails: {},
    resourceDetailsId: successMessage?.id
  }
  return activityMessage;
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
  getCampaignDetails,
  processFile,
  generateSortingAndPaginationClauses,
  generateXlsxFromJson,
  generateAuditDetails,
  generateResourceMessage,
  generateActivityMessage
};
