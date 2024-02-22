import { NextFunction, Request, Response } from "express";
import { httpRequest } from "../utils/request";
import config from "../config/index";
import { consumerGroupUpdate } from "../Kafka/Listener";
import { Message } from 'kafka-node';
import { v4 as uuidv4, validate } from 'uuid';
import { produceModifiedMessages } from '../Kafka/Listener'
import { getCampaignNumber, getResouceNumber, getSchema, getSheetData, searchMDMS } from "../api/index";
import * as XLSX from 'xlsx';
import FormData from 'form-data';
import { Pagination } from "../utils/Pagination";
import { Pool } from 'pg';
import { getCount } from '../api/index'
import { logger } from "./logger";
import { processValidationWithSchema, validateTransformedData } from "./validator";
const NodeCache = require("node-cache");
const jp = require("jsonpath");
const _ = require('lodash');

const updateCampaignTopic = config.KAFKA_UPDATE_CAMPAIGN_DETAILS_TOPIC;
const updateGeneratedResourceTopic = config.KAFKA_UPDATE_GENERATED_RESOURCE_DETAILS_TOPIC;
const createGeneratedResourceTopic = config.KAFKA_CREATE_GENERATED_RESOURCE_DETAILS_TOPIC;

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
    const errorMessage = "Error occurred while fetching the file store ID: " + e.message;
    logger.error(errorMessage)
    return errorResponder({ message: errorMessage + "    Check Logs" }, request, response);
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
    statusFileStoreId: null,
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
    retryCount: createdResult?.retryCount || 0,
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
    affectedRows: createdResult?.affectedRows || [],
    resourceDetailsId: successMessage?.id
  }
  return activityMessage;
}

async function getResponseFromDb(request: any, response: any) {
  const pool = new Pool({
    user: config.DB_USER,
    host: config.DB_HOST,
    database: config.DB_NAME,
    password: config.DB_PASSWORD,
    port: parseInt(config.DB_PORT)
  });

  try {
    const { type } = request.query;

    let queryString = "SELECT * FROM eg_generated_resource_details WHERE type = $1 AND status = $2";
    const status = 'Completed';
    const queryResult = await pool.query(queryString, [type, status]);
    const responseData = queryResult.rows;
    return responseData;
  } catch (error) {
    logger.error('Error fetching data from the database:', error);
    throw error;
  } finally {
    try {
      await pool.end();
    } catch (error) {
      logger.error('Error closing the database connection pool:', error);
    }
  }
}
async function getModifiedResponse(responseData: any) {
  return responseData.map((item: any) => {
    return {
      ...item,
      lastmodifiedtime: parseInt(item.lastmodifiedtime),
      createdtime: parseInt(item.createdtime)
    };
  });
}

async function getNewEntryResponse(modifiedResponse: any, request: any) {
  const { type } = request.query;
  const newEntry = {
    id: uuidv4(),
    filestoreid: null,
    type: type,
    status: "In Progress",
    lastmodifiedtime: Date.now(),
    createdtime: Date.now(),
    createdby: request?.body?.RequestInfo?.userInfo.uuid,
    lastmodifiedby: request?.body?.RequestInfo?.userInfo.uuid,
    additionaldetails: null
  };
  return [newEntry];
}
async function getOldEntryResponse(modifiedResponse: any[], request: any) {
  return modifiedResponse.map((item: any) => {
    const newItem = { ...item };
    newItem.status = "expired";
    newItem.lastmodifiedtime = Date.now();
    newItem.lastmodifiedby = request?.body?.RequestInfo?.userInfo?.uuid;
    return newItem;
  });
}
async function getFinalUpdatedResponse(result: any, responseData: any, request: any) {
  return responseData.map((item: any) => {
    return {
      ...item,
      lastmodifiedtime: Date.now(),
      createdtime: Date.now(),
      filestoreid: result?.[0]?.fileStoreId,
      status: "Completed",
      lastmodifiedby: request?.body?.RequestInfo?.userInfo?.uuid
    };
  });
}

async function callSearchApi(request: any, response: any) {
  try {
    let result: any;
    const { type } = request.query;
    result = await searchMDMS([type], "HCM.APIResourceTemplate3", request.body.RequestInfo, response);
    const requestBody = { "RequestInfo": request?.body?.RequestInfo };
    const responseData = result?.mdms?.[0]?.data;
    if (!responseData || responseData.length === 0) {
      return errorResponder({ message: "Invalid ApiResource Type. Check Logs" }, request, response);
    }
    const host = responseData?.host;
    const url = responseData?.searchConfig?.url;
    var queryParams: any = {};
    for (const searchItem of responseData?.searchConfig?.searchBody) {
      if (searchItem.isInParams) {
        queryParams[searchItem.path] = searchItem.value;
      }
      else if (searchItem.isInBody) {
        _.set(requestBody, `${searchItem.path}`, searchItem.value);
      }
    }
    const countknown = responseData?.searchConfig?.isCountGiven === true;
    let responseDatas: any[] = [];
    const searchPath = responseData?.searchConfig?.keyName;
    let fetchedData: any;
    let responseObject: any;

    if (countknown) {
      const count = await getCount(responseData, request, response);
      let noOfTimesToFetchApi = Math.ceil(count / queryParams.limit);
      for (let i = 0; i < noOfTimesToFetchApi; i++) {
        responseObject = await httpRequest(host + url, requestBody, queryParams, undefined, undefined, undefined);
        fetchedData = _.get(responseObject, searchPath);
        fetchedData.forEach((item: any) => {
          responseDatas.push(item);
        });
        queryParams.offset = (parseInt(queryParams.offset) + parseInt(queryParams.limit)).toString();
      }
    }

    else {
      while (true) {
        responseObject = await httpRequest(host + url, requestBody, queryParams, undefined, undefined, undefined);
        fetchedData = _.get(responseObject, searchPath);
        fetchedData.forEach((item: any) => {
          responseDatas.push(item);
        });
        queryParams.offset = (parseInt(queryParams.offset) + parseInt(queryParams.limit)).toString();
        if (fetchedData.length < parseInt(queryParams.limit)) {
          break;
        }
      }
    }
    return responseDatas;
  }
  catch (e: any) {
    logger.error(String(e))
    return errorResponder({ message: String(e) + "    Check Logs" }, request, response);
  }
}

async function fullProcessFlowForNewEntry(newEntryResponse: any, request: any, response: any) {
  try {
    const generatedResource: any = { generatedResource: newEntryResponse }
    produceModifiedMessages(generatedResource, createGeneratedResourceTopic);
    const responseDatas = await callSearchApi(request, response);
    const result = await generateXlsxFromJson(request, response, responseDatas);
    const finalResponse = await getFinalUpdatedResponse(result, newEntryResponse, request);
    const generatedResourceNew: any = { generatedResource: finalResponse }
    produceModifiedMessages(generatedResourceNew, updateGeneratedResourceTopic);
  } catch (error) {
    throw error;
  }
}

function isEpoch(value: any): boolean {
  // Check if the value is a number
  if (typeof value !== 'number') {
    return false;
  }

  // Create a new Date object from the provided value
  const date = new Date(value);

  // Check if the date is valid and the value matches the provided epoch time
  return !isNaN(date.getTime()) && date.getTime() === value;
}

function dateToEpoch(dateString: string): number | null {
  // Parse the date string
  const parsedDate = Date.parse(dateString);

  // Check if the parsing was successful
  if (!isNaN(parsedDate)) {
    // Convert milliseconds since epoch to seconds since epoch
    return parsedDate / 1000;
  } else {
    return null; // Parsing failed, return null
  }
}

async function matchWithCreatedDetails(request: any, response: any, ResponseDetails: any, creationTime: any, rowsToMatch: number) {
  const waitTime = config.waitTime;
  logger.info("Waiting for " + waitTime + "ms before Checking Persistence");
  await new Promise(resolve => setTimeout(resolve, parseInt(waitTime)));
  var requestWithParams = { ...request }
  requestWithParams.query = { ...requestWithParams.query, type: request?.body?.ResourceDetails?.type, forceUpdate: true }
  const rows: any = await callSearchApi(requestWithParams, response);
  var count = 0;
  var createdDetailsPresent = false;
  logger.info("Checking Persistence with createdBy for  " + request?.body?.RequestInfo?.userInfo?.uuid + " and createdTime " + creationTime);
  rows.forEach((item: any) => {
    var createdBy = item?.auditDetails?.createdBy || item?.createdBy;
    var createdTime = item?.auditDetails?.createdTime || item?.createdTime || item?.auditDetails?.createdDate || item?.createdDate;
    if (createdBy && createdTime) {
      var userMatch = false;
      var timeMatch = false;
      if (validate(createdBy)) {
        userMatch = createdBy == request?.body?.RequestInfo?.userInfo?.uuid
      }
      else {
        userMatch = createdBy == request?.body?.RequestInfo?.userInfo?.id
      }
      if (isEpoch(createdTime)) {
        timeMatch = createdTime >= creationTime
      }
      else {
        createdTime = dateToEpoch(createdBy);
        if (createdTime) {
          timeMatch = createdTime >= creationTime
        }
      }
      if (userMatch && timeMatch) {
        count++;
      }
    }
    if (createdBy && createdTime) {
      createdDetailsPresent = true;
    }
  })
  logger.info("Got " + count + " rows with recent persistence");
  if (count >= rowsToMatch) {
    return ResponseDetails;
  }
  else if (createdDetailsPresent) {
    ResponseDetails.status = "PERSISTING_ERROR";
    return ResponseDetails;
  }
  logger.info("No createdBy and createdTime found in Rows.");
  ResponseDetails.status = "PERSISTENCE_CHECK_REQUIRED";
  return ResponseDetails;
}

function getCreationDetails(APIResource: any, sheetName: any) {
  // Assuming APIResource has the necessary structure to extract creation details
  // Replace the following lines with the actual logic to extract creation details
  const host = APIResource?.mdms?.[0]?.data?.host;
  const url = APIResource?.mdms?.[0]?.data?.creationConfig?.url;
  const keyName = APIResource?.mdms?.[0]?.data?.creationConfig?.keyName;
  const isBulkCreate = APIResource?.mdms?.[0]?.data?.creationConfig?.isBulkCreate;
  const creationLimit = APIResource?.mdms?.[0]?.data?.creationConfig?.limit;
  const responsePathToCheck = APIResource?.mdms?.[0]?.data?.creationConfig?.responsePathToCheck;
  const checkOnlyExistence = APIResource?.mdms?.[0]?.data?.creationConfig?.checkOnlyExistence;
  const matchDataLength = APIResource?.mdms?.[0]?.data?.creationConfig?.matchDataLength;
  const responseToMatch = APIResource?.mdms?.[0]?.data?.creationConfig?.responseToMatch;
  const createBody = APIResource?.mdms?.[0]?.data?.creationConfig?.createBody;

  return {
    host,
    url,
    keyName,
    isBulkCreate,
    creationLimit,
    responsePathToCheck,
    checkOnlyExistence,
    matchDataLength,
    responseToMatch,
    createBody,
    sheetName
  };
}

function addRowDetails(processResultUpdatedDatas: any[], updatedDatas: any[]): void {
  if (!processResultUpdatedDatas) return;
  processResultUpdatedDatas.forEach((item, index) => {
    if (index < updatedDatas.length) {
      item['#row!number#'] = updatedDatas[index]['#row!number#'];
    }
  });
}


async function getSchemaAndProcessResult(request: any, parsingTemplate: any, updatedDatas: any, APIResource: any) {
  const hostHcmBff = config.host.hcmBff.endsWith('/') ? config.host.hcmBff.slice(0, -1) : config.host.hcmBff;
  let processResult;
  request.body.HCMConfig = {};
  request.body.HCMConfig['parsingTemplate'] = parsingTemplate;
  request.body.HCMConfig['data'] = updatedDatas;

  // Process data
  processResult = await httpRequest(`${hostHcmBff}${config.app.contextPath}${'/bulk'}/_process`, request.body, undefined, undefined, undefined, undefined);
  addRowDetails(processResult?.updatedDatas, updatedDatas);
  if (processResult.Error) {
    logger.error(processResult.Error);
    throw new Error(processResult.Error);
  }

  const healthMaster = APIResource?.mdms?.[0]?.data?.masterDetails?.masterName + "." + APIResource?.mdms?.[0]?.data?.masterDetails?.moduleName;

  // Get schema definition
  const schemaDef = await getSchema(healthMaster, request?.body?.RequestInfo);

  return { processResult, schemaDef };
}

async function processValidationResultsAndSendResponse(sheetName: any, processResult: any, schemaDef: any, APIResource: any, response: any, request: any) {
  const validationErrors: any[] = [];
  const validatedData: any[] = [];
  processValidationWithSchema(processResult, validationErrors, validatedData, schemaDef);

  // Include error messages from MDMS service
  const mdmsErrors = processResult?.mdmsErrors || [];

  // Send response
  if (validationErrors.length > 0 || mdmsErrors.length > 0) {
    if (validationErrors?.[0] == "NO_VALIDATION_SCHEMA_FOUND") {
      const creationDetails = getCreationDetails(APIResource, sheetName);
      return sendResponse(response, {
        "validationResult": "NO_VALIDATION_SCHEMA_FOUND",
        "data": validatedData,
        creationDetails
      }, request);
    }
    const errors = [...validationErrors, ...mdmsErrors];
    return sendResponse(response, { "validationResult": "INVALID_DATA", "errors": errors }, request);
  } else {
    const creationDetails = getCreationDetails(APIResource, sheetName);
    return sendResponse(response, {
      "validationResult": "VALID_DATA",
      "data": validatedData,
      creationDetails
    }, request);
  }
}


const fetchDataAndUpdate = async (
  transformTemplate: any,
  parsingTemplate: any,
  fileStoreId: any,
  APIResource: any,
  request: any,
  response: any
) => {
  const result = await searchMDMS([transformTemplate], config.values.transfromTemplate, request.body.RequestInfo, response);
  const url = config.host.filestore + config.paths.filestore + `/url?tenantId=${request?.body?.RequestInfo?.userInfo?.tenantId}&fileStoreIds=${fileStoreId}`;
  logger.info("File fetching url : " + url);

  let TransformConfig;
  if (result?.mdms?.length > 0) {
    TransformConfig = result.mdms[0];
    logger.info("TransformConfig : " + JSON.stringify(TransformConfig));
  }

  const updatedDatas = await getSheetData(url, [{ startRow: 2, endRow: 1000 }], TransformConfig?.data?.Fields, TransformConfig?.data?.sheetName);
  if (!Array.isArray(updatedDatas)) {
    throw new Error(JSON.stringify(updatedDatas));
  }
  validateTransformedData(updatedDatas);
  const { processResult, schemaDef } = await getSchemaAndProcessResult(request, parsingTemplate, updatedDatas, APIResource);

  return { sheetName: TransformConfig?.data?.sheetName, processResult, schemaDef };
};


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
  generateActivityMessage,
  getResponseFromDb,
  callSearchApi,
  matchWithCreatedDetails,
  getCreationDetails,
  getSchemaAndProcessResult,
  getModifiedResponse,
  getNewEntryResponse,
  getOldEntryResponse,
  getFinalUpdatedResponse,
  fullProcessFlowForNewEntry,
  processValidationResultsAndSendResponse,
  fetchDataAndUpdate
};
