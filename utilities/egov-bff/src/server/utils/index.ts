import { NextFunction, Request, Response } from "express";
import { httpRequest } from "../utils/request";
import config from "../config/index";
import { v4 as uuidv4 } from 'uuid';
import { produceModifiedMessages } from '../Kafka/Listener'
import { createAndUploadFile, createExcelSheet, createProjectCampaignResourcData, getAllFacilities, getBoundarySheetData, getCampaignNumber, getResouceNumber, getSchema, getSheetData, projectCreate, searchMDMS, getCount, } from "../api/index";
import * as XLSX from 'xlsx';
import FormData from 'form-data';
import { Pagination } from "../utils/Pagination";
import { Pool } from 'pg';
import { logger } from "./logger";
import dataManageController from "../controllers/dataManage/dataManage.controller";
import createAndSearch from "../config/createAndSearch";
import pool from "../config/dbPoolConfig";
// import * as xlsx from 'xlsx-populate';
const NodeCache = require("node-cache");
const _ = require('lodash');


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

async function generateActivityMessage(tenantId: any, requestBody: any, requestPayload: any, responsePayload: any, type: any, url: any, status: any) {
  const activityMessage = {
    id: uuidv4(),
    status: status,
    retryCount: 0,
    tenantId: tenantId,
    type: type,
    url: url,
    requestPayload: requestPayload,
    responsePayload: responsePayload,
    auditDetails: {
      createdBy: requestBody?.RequestInfo?.userInfo?.uuid,
      lastModifiedBy: requestBody?.RequestInfo?.userInfo?.uuid,
      createdTime: Date.now(),
      lastModifiedTime: Date.now()
    },
    additionalDetails: {},
    resourceDetailsId: null
  }
  return activityMessage;
}

function modifyAuditdetailsAndCases(responseData: any) {
  responseData.forEach((item: any) => {
    item.auditDetails = {
      lastModifiedTime: item.lastmodifiedtime,
      createdTime: item.createdtime,
      lastModifiedBy: item.lastmodifiedby,
      createdBy: item.createdby
    }
    item.tenantId = item.tenantid;
    item.additionalDetails = item.additionaldetails;
    item.fileStoreid = item.filestoreid;
    delete item.additionaldetails;
    delete item.lastmodifiedtime;
    delete item.createdtime;
    delete item.lastmodifiedby;
    delete item.createdby;
    delete item.filestoreid;
    delete item.tenantid;
  })
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

    let queryString = "SELECT * FROM health.eg_cm_generated_resource_details WHERE type = $1 AND status = $2";
    // let queryString = "SELECT * FROM eg_cm_generated_resource_details WHERE type = $1 AND status = $2";
    const status = 'Completed';
    const queryResult = await pool.query(queryString, [type, status]);
    const responseData = queryResult.rows;
    modifyAuditdetailsAndCases(responseData);
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
      count: parseInt(item.count),
      auditDetails: {
        ...item.auditDetails,
        lastModifiedTime: parseInt(item.auditDetails.lastModifiedTime),
        createdTime: parseInt(item.auditDetails.createdTime)
      }
    };
  });
}

async function getNewEntryResponse(modifiedResponse: any, request: any) {
  const { type } = request.query;
  const newEntry = {
    id: uuidv4(),
    fileStoreid: null,
    type: type,
    status: "In Progress",
    tenantId: request?.query?.tenantId,
    auditDetails: {
      lastModifiedTime: Date.now(),
      createdTime: Date.now(),
      createdBy: request?.body?.RequestInfo?.userInfo.uuid,
      lastModifiedBy: request?.body?.RequestInfo?.userInfo.uuid,
    },
    additionalDetails: {}
  };
  return [newEntry];
}
async function getOldEntryResponse(modifiedResponse: any[], request: any) {
  return modifiedResponse.map((item: any) => {
    const newItem = { ...item };
    newItem.status = "expired";
    newItem.auditDetails.lastModifiedTime = Date.now();
    newItem.auditDetails.lastModifiedBy = request?.body?.RequestInfo?.userInfo?.uuid;
    return newItem;
  });
}
async function getFinalUpdatedResponse(result: any, responseData: any, request: any) {
  return responseData.map((item: any) => {
    return {
      ...item,
      tenantId: request?.query?.tenantId,
      count: parseInt(request?.body?.generatedResourceCount ? request?.body?.generatedResourceCount : null),
      auditDetails: {
        ...item.auditDetails,
        lastModifiedTime: Date.now(),
        createdTime: Date.now(),
        lastModifiedBy: request?.body?.RequestInfo?.userInfo?.uuid
      },
      fileStoreid: result?.[0]?.fileStoreId,
      status: "Completed",
    };
  });
}

async function callSearchApi(request: any, response: any) {
  try {
    let result: any;
    const { type } = request.query;
    result = await searchMDMS([type], config.SEARCH_TEMPLATE, request.body.RequestInfo, response);
    const filter = request?.body?.Filters;
    const requestBody = { "RequestInfo": request?.body?.RequestInfo, filter };
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
    const type = request?.query?.type;
    const generatedResource: any = { generatedResource: newEntryResponse }
    produceModifiedMessages(generatedResource, createGeneratedResourceTopic);
    if (type === 'boundary') {
      // const BoundaryDetails = {
      //   hierarchyType: "NITISH",
      //   tenantId: "pg"
      // };
      // request.body.BoundaryDetails = BoundaryDetails;
      const dataManagerController = new dataManageController();
      const result = await dataManagerController.getBoundaryData(request, response);
      const finalResponse = await getFinalUpdatedResponse(result, newEntryResponse, request);
      const generatedResourceNew: any = { generatedResource: finalResponse }
      produceModifiedMessages(generatedResourceNew, updateGeneratedResourceTopic);
      request.body.generatedResource = finalResponse;
    }
    else if (type == "facilityWithBoundary") {
      await processGenerateRequest(request);
      const finalResponse = await getFinalUpdatedResponse(request?.body?.fileDetails, newEntryResponse, request);
      const generatedResourceNew: any = { generatedResource: finalResponse }
      produceModifiedMessages(generatedResourceNew, updateGeneratedResourceTopic);
      request.body.generatedResource = finalResponse;
    }
    else {
      const responseDatas = await callSearchApi(request, response);
      const modifiedDatas = await modifyData(request, response, responseDatas);
      const result = await generateXlsxFromJson(request, response, modifiedDatas);
      const finalResponse = await getFinalUpdatedResponse(result, newEntryResponse, request);
      const generatedResourceNew: any = { generatedResource: finalResponse }
      produceModifiedMessages(generatedResourceNew, updateGeneratedResourceTopic);
    }
  } catch (error) {
    throw error;
  }
}
async function modifyData(request: any, response: any, responseDatas: any) {
  try {
    let result: any;
    const hostHcmBff = config.host.projectFactoryBff.endsWith('/') ? config.host.projectFactoryBff.slice(0, -1) : config.host.projectFactoryBff;
    const { type } = request.query;
    result = await searchMDMS([type], config.SEARCH_TEMPLATE, request.body.RequestInfo, response);
    const modifiedParsingTemplate = result?.mdms?.[0]?.data?.modificationParsingTemplateName;
    if (!request.body.HCMConfig) {
      request.body.HCMConfig = {};
    }
    const batchSize = 50;
    const totalBatches = Math.ceil(responseDatas.length / batchSize);
    const allUpdatedData = [];

    for (let i = 0; i < totalBatches; i++) {
      const batchData = responseDatas.slice(i * batchSize, (i + 1) * batchSize);
      const batchRequestBody = { ...request.body };
      batchRequestBody.HCMConfig.parsingTemplate = modifiedParsingTemplate;
      batchRequestBody.HCMConfig.data = batchData;

      try {
        const processResult = await httpRequest(`${hostHcmBff}${config.app.contextPath}/bulk/_process`, batchRequestBody, undefined, undefined, undefined, undefined);
        if (processResult.Error) {
          throw new Error(processResult.Error);
        }
        allUpdatedData.push(...processResult.updatedDatas);
      } catch (error: any) {
        throw error;
      }
    }
    return allUpdatedData;
  }
  catch (e: any) {
    throw e;
  }
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
function generateAuditDetails(request: any) {
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

function addRowDetails(processResultUpdatedDatas: any[], updatedDatas: any[]): void {
  if (!processResultUpdatedDatas) return;
  processResultUpdatedDatas.forEach((item, index) => {
    if (index < updatedDatas.length) {
      item['#row!number#'] = updatedDatas[index]['#row!number#'];
    }
  });
}


async function getSchemaAndProcessResult(request: any, parsingTemplate: any, updatedDatas: any, APIResource: any) {
  const hostHcmBff = config.host.projectFactoryBff.endsWith('/') ? config.host.projectFactoryBff.slice(0, -1) : config.host.projectFactoryBff;
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


function sortCampaignDetails(campaignDetails: any) {
  campaignDetails.sort((a: any, b: any) => {
    // If a is a child of b, a should come after b
    if (a.parentBoundaryCode === b.boundaryCode) return 1;
    // If b is a child of a, a should come before b
    if (a.boundaryCode === b.parentBoundaryCode) return -1;
    // Otherwise, maintain the order
    return 0;
  });
  return campaignDetails;
}
// Function to correct the totals and target values of parents
function correctParentValues(campaignDetails: any) {
  // Create a map to store parent-child relationships and their totals/targets
  const parentMap: any = {};
  campaignDetails.forEach((detail: any) => {
    if (!detail.parentBoundaryCode) return; // Skip if it's not a child
    if (!parentMap[detail.parentBoundaryCode]) {
      parentMap[detail.parentBoundaryCode] = { total: 0, target: 0 };
    }
    parentMap[detail.parentBoundaryCode].total += detail.targets[0].total;
    parentMap[detail.parentBoundaryCode].target += detail.targets[0].target;
  });

  // Update parent values with the calculated totals and targets
  campaignDetails.forEach((detail: any) => {
    if (!detail.parentBoundaryCode) return; // Skip if it's not a child
    const parent = parentMap[detail.parentBoundaryCode];
    const target = detail.targets[0];
    target.total = parent.total;
    target.target = parent.target;
  });

  return campaignDetails;
}

async function createFacilitySheet(allFacilities: any[]) {
  const headers = ["Facility Code", "Facility Name", "Facility Type", "Facility Status", "Facility Capacity", "Boundary Code"]
  const facilities = allFacilities.map((facility: any) => {
    return [
      facility?.id,
      facility?.name,
      facility?.usage,
      facility?.isPermanent ? "Perm" : "Temp",
      facility?.storageCapacity,
      ""
    ]
  })
  logger.info("facilities : " + JSON.stringify(facilities));
  const facilitySheetData: any = await createExcelSheet(facilities, headers, "List of Available Facilities");
  return facilitySheetData;
}

async function createFacilityAndBoundaryFile(facilitySheetData: any, boundarySheetData: any, request: any) {
  const workbook = XLSX.utils.book_new();
  // Add facility sheet to the workbook
  XLSX.utils.book_append_sheet(workbook, facilitySheetData.ws, 'List of Available Facilities');
  // Add boundary sheet to the workbook
  XLSX.utils.book_append_sheet(workbook, boundarySheetData.ws, 'List of Campaign Boundaries');
  const fileDetails = await createAndUploadFile(workbook, request)
  request.body.fileDetails = fileDetails;
}


async function generateFacilityAndBoundarySheet(tenantId: string, request: any) {
  // Get facility and boundary data
  const allFacilities = await getAllFacilities(tenantId, request.body);
  request.body.generatedResourceCount = allFacilities.length;
  const facilitySheetData: any = await createFacilitySheet(allFacilities);
  request.body.Filters = { tenantId: tenantId, hierarchyType: request?.query?.hierarchyType, includeChildren: true }
  const boundarySheetData: any = await getBoundarySheetData(request);
  await createFacilityAndBoundaryFile(facilitySheetData, boundarySheetData, request);
}
async function processGenerateRequest(request: any) {
  const { type, tenantId } = request.query
  if (type == "facilityWithBoundary") {
    await generateFacilityAndBoundarySheet(String(tenantId), request);
  }
}

async function updateAndPersistGenerateRequest(newEntryResponse: any, oldEntryResponse: any, responseData: any, request: any, response: any) {
  const { forceUpdate } = request.query;
  const forceUpdateBool: boolean = forceUpdate === 'true';
  let generatedResource: any;
  if (forceUpdateBool && responseData.length > 0) {
    generatedResource = { generatedResource: oldEntryResponse };
    produceModifiedMessages(generatedResource, updateGeneratedResourceTopic);
    request.body.generatedResource = oldEntryResponse;
  }
  if (responseData.length === 0 || forceUpdateBool) {
    await fullProcessFlowForNewEntry(newEntryResponse, request, response);
  }
  else {
    request.body.generatedResource = responseData
  }
}

async function processGenerate(request: any, response: any) {
  const responseData = await getResponseFromDb(request, response);
  const modifiedResponse = await getModifiedResponse(responseData);
  const newEntryResponse = await getNewEntryResponse(modifiedResponse, request);
  const oldEntryResponse = await getOldEntryResponse(modifiedResponse, request);
  await updateAndPersistGenerateRequest(newEntryResponse, oldEntryResponse, responseData, request, response);
}

function convertToFacilityExsistingData(facilityData: any[]) {
  const facilityExsistingData = facilityData.map(facility => ({
    "id": facility['Facility Code'],
    "isPermanent": facility['Facility Status'] === 'Perm',
    "name": facility['Facility Name'],
    "usage": facility['Facility Type'],
    "storageCapacity": facility['Facility Capacity'],
    originalIndex: facility.originalIndex
  }));
  logger.info("facilityExsistingData : " + JSON.stringify(facilityExsistingData));
  return facilityExsistingData;
}

async function enrichResourceDetails(request: any) {
  request.body.ResourceDetails.id = uuidv4();
  if (request?.body?.ResourceDetails?.action == "create") {
    request.body.ResourceDetails.status = "data-accepted"
  }
  else {
    request.body.ResourceDetails.status = "data-validated"
  }
  request.body.ResourceDetails.auditDetails = {
    createdBy: request?.body?.RequestInfo?.userInfo?.uuid,
    createdTime: Date.now(),
    lastModifiedBy: request?.body?.RequestInfo?.userInfo?.uuid,
    lastModifiedTime: Date.now()
  }
  // delete request.body.ResourceDetails.dataToCreate
}

function getFacilityIds(data: any) {
  return data.map((obj: any) => obj["id"])
}

function matchFacilityData(data: any, searchedFacilities: any) {
  for (const dataFacility of data) {
    const searchedFacility = searchedFacilities.find((facility: any) => facility.id === dataFacility.id);

    if (!searchedFacility) {
      throw new Error(`Facility with ID "${dataFacility.id}" not found in searched facilities.`);
    }
    if (config?.values?.matchFacilityData) {
      const keys = Object.keys(dataFacility);
      for (const key of keys) {
        if (searchedFacility.hasOwnProperty(key) && searchedFacility[key] !== dataFacility[key]) {
          throw new Error(`Value mismatch for key "${key}" at index ${dataFacility.originalIndex}. Expected: "${dataFacility[key]}", Found: "${searchedFacility[key]}"`);
        }
      }
    }
  }
}

function matchData(request: any, datas: any, searchedDatas: any, createAndSearchConfig: any) {
  const uid = createAndSearchConfig.uniqueIdentifier;
  const errors = []
  for (const data of datas) {
    const searchData = searchedDatas.find((searchedData: any) => searchedData[uid] == data[uid]);

    if (!searchData) {
      errors.push({ status: "INVALID", rowNumber: data["!row#number!"], errorDetails: `Data with ${uid} ${data[uid]} not found in searched data.` })
    }
    else if (createAndSearchConfig?.matchEachKey) {
      const keys = Object.keys(data);
      var errorString = "";
      var errorFound = false;
      for (const key of keys) {
        if (searchData.hasOwnProperty(key) && searchData[key] !== data[key] && key != "!row#number!") {
          errorString += `Value mismatch for key "${key}" at index ${data["!row#number!"] - 1}. Expected: "${data[key]}", Found: "${searchData[key]}"`
          errorFound = true;
        }
      }
      if (errorFound) {
        errors.push({ status: "MISMATCHING", rowNumber: data["!row#number!"], errorDetails: errorString })
      }
      else {
        errors.push({ status: "VALID", rowNumber: data["!row#number!"], errorDetails: "" })
      }
    }
    else {
      errors.push({ status: "VALID", rowNumber: data["!row#number!"], errorDetails: "" })
    }
  }
  request.body.sheetErrorDetails = request?.body?.sheetErrorDetails ? [...request?.body?.sheetErrorDetails, ...errors] : errors;
}

function modifyBoundaryData(boundaryData: unknown[]) {
  let withBoundaryCode: string[][] = [];
  let withoutBoundaryCode: string[][] = [];

  for (const obj of boundaryData) {
    const row: string[] = [];
    if (typeof obj === 'object' && obj !== null) {
      for (const value of Object.values(obj)) {
        if (value !== null && value !== undefined) {
          row.push(value.toString()); // Convert value to string and push to row
        }
      }

      if (obj.hasOwnProperty('Boundary Code')) {
        withBoundaryCode.push(row);
      } else {
        withoutBoundaryCode.push(row);
      }
    }
  }

  return [withBoundaryCode, withoutBoundaryCode];
}



async function enrichAndSaveResourceDetails(requestBody: any) {
  if (!requestBody?.ResourceDetails?.status) {
    requestBody.ResourceDetails.status = "data-accepted"
  }
  if (!requestBody?.ResourceDetails?.processedFileStoreId) {
    requestBody.ResourceDetails.processedFileStoreId = null
  }
  requestBody.ResourceDetails.id = uuidv4()
  requestBody.ResourceDetails.auditDetails = {
    createdTime: Date.now(),
    createdBy: requestBody.RequestInfo.userInfo?.uuid,
    lastModifiedTime: Date.now(),
    lastModifiedBy: requestBody.RequestInfo.userInfo?.uuid
  }
  requestBody.ResourceDetails.additionalDetails = { ...requestBody.ResourceDetails.additionalDetails, atttemptedData: requestBody?.ResourceDetails?.dataToCreate }
  delete requestBody.ResourceDetails.dataToCreate;
  produceModifiedMessages(requestBody, config.KAFKA_CREATE_RESOURCE_DETAILS_TOPIC)
}

async function getDataFromSheet(fileStoreId: any, tenantId: any, createAndSearchConfig: any) {
  const fileResponse = await httpRequest(config.host.filestore + config.paths.filestore + "/url", {}, { tenantId: tenantId, fileStoreIds: fileStoreId }, "get");
  if (!fileResponse?.fileStoreIds?.[0]?.url) {
    throw new Error("Not any download url returned for given fileStoreId")
  }
  return await getSheetData(fileResponse?.fileStoreIds?.[0]?.url, createAndSearchConfig?.parseArrayConfig?.sheetName, true)
}

function updateRange(range: any, desiredSheet: any) {
  let maxColumnIndex = 0;

  // Iterate through each row to find the last column with data
  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      if (desiredSheet[cellAddress]) {
        maxColumnIndex = Math.max(maxColumnIndex, col);
      }
    }
  }

  // Update the end column of the range with the maximum column index found
  range.e.c = maxColumnIndex
}

function findColumns(desiredSheet: any): { statusColumn: string, errorDetailsColumn: string } {
  var range = XLSX.utils.decode_range(desiredSheet['!ref']);

  // Check if the status column already exists in the first row
  var statusColumn: any;
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: col });
    if (desiredSheet[cellAddress] && desiredSheet[cellAddress].v === '#status#') {
      statusColumn = String.fromCharCode(65 + col);
      for (let row = range.s.r; row <= range.e.r; row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: statusColumn.charCodeAt(0) - 65 });
        delete desiredSheet[cellAddress];
      }
      break;
    }
  }
  // Check if the errorDetails column already exists in the first row
  var errorDetailsColumn: any;
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: col });
    if (desiredSheet[cellAddress] && desiredSheet[cellAddress].v === '#errorDetails#') {
      errorDetailsColumn = String.fromCharCode(65 + col);
      for (let row = range.s.r; row <= range.e.r; row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: errorDetailsColumn.charCodeAt(0) - 65 });
        delete desiredSheet[cellAddress];
      }
      break;
    }
  }
  updateRange(range, desiredSheet);
  logger.info("Updated Range : " + JSON.stringify(range))
  // If the status column doesn't exist, calculate the next available column
  const emptyColumnIndex = range.e.c + 1;
  statusColumn = String.fromCharCode(65 + emptyColumnIndex);
  desiredSheet[statusColumn + '1'] = { v: '#status#', t: 's', r: '<t xml:space="preserve">#status#</t>', h: '#status#', w: '#status#' };

  // Calculate errorDetails column one column to the right of status column
  errorDetailsColumn = String.fromCharCode(statusColumn.charCodeAt(0) + 1);
  desiredSheet[errorDetailsColumn + '1'] = { v: '#errorDetails#', t: 's', r: '<t xml:space="preserve">#errorDetails#</t>', h: '#errorDetails#', w: '#errorDetails#' };
  return { statusColumn, errorDetailsColumn };
}


function processErrorData(request: any, createAndSearchConfig: any, workbook: any, sheetName: any) {
  const desiredSheet: any = workbook.Sheets[sheetName];
  const columns = findColumns(desiredSheet);
  const statusColumn = columns.statusColumn;
  const errorDetailsColumn = columns.errorDetailsColumn;

  const errorData = request.body.sheetErrorDetails;
  errorData.forEach((error: any) => {
    const rowIndex = error.rowNumber;
    if (error.isUniqueIdentifier) {
      const uniqueIdentifierCell = createAndSearchConfig.uniqueIdentifierColumn + (rowIndex + 1);
      desiredSheet[uniqueIdentifierCell] = { v: error.uniqueIdentifier, t: 's', r: '<t xml:space="preserve">#uniqueIdentifier#</t>', h: error.uniqueIdentifier, w: error.uniqueIdentifier };
    }

    const statusCell = statusColumn + (rowIndex + 1);
    const errorDetailsCell = errorDetailsColumn + (rowIndex + 1);
    desiredSheet[statusCell] = { v: error.status, t: 's', r: '<t xml:space="preserve">#status#</t>', h: error.status, w: error.status };
    desiredSheet[errorDetailsCell] = { v: error.errorDetails, t: 's', r: '<t xml:space="preserve">#errorDetails#</t>', h: error.errorDetails, w: error.errorDetails };

  });

  desiredSheet['!ref'] = desiredSheet['!ref'].replace(/:[A-Z]+/, ':' + errorDetailsColumn);
  workbook.Sheets[sheetName] = desiredSheet;
}

async function updateStatusFile(request: any) {
  const fileStoreId = request?.body?.ResourceDetails?.fileStoreId;
  const tenantId = request?.body?.ResourceDetails?.tenantId;
  const createAndSearchConfig = createAndSearch[request?.body?.ResourceDetails?.type];
  const fileResponse = await httpRequest(config.host.filestore + config.paths.filestore + "/url", {}, { tenantId: tenantId, fileStoreIds: fileStoreId }, "get");

  if (!fileResponse?.fileStoreIds?.[0]?.url) {
    throw new Error("No download URL returned for the given fileStoreId");
  }

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/pdf',
  };

  const fileUrl = fileResponse?.fileStoreIds?.[0]?.url;
  const sheetName = createAndSearchConfig?.parseArrayConfig?.sheetName;
  const responseFile = await httpRequest(fileUrl, null, {}, 'get', 'arraybuffer', headers);
  const workbook = XLSX.read(responseFile, { type: 'buffer' });

  // Check if the specified sheet exists in the workbook
  if (!workbook.Sheets.hasOwnProperty(sheetName)) {
    throw new Error(`Sheet with name "${sheetName}" is not present in the file.`);
  }
  processErrorData(request, createAndSearchConfig, workbook, sheetName);

  const responseData = await createAndUploadFile(workbook, request);
  logger.info('File updated successfully:' + JSON.stringify(responseData));
  if (responseData?.[0]?.fileStoreId) {
    request.body.ResourceDetails.processedFileStoreId = responseData?.[0]?.fileStoreId;
  }
  else {
    throw new Error("Error in Creatring Status File");
  }
}


function convertToType(dataToSet: any, type: any) {
  switch (type) {
    case "string":
      return String(dataToSet);
    case "number":
      return Number(dataToSet);
    case "boolean":
      // Convert to boolean assuming any truthy value should be true and falsy should be false
      return Boolean(dataToSet);
    // Add more cases if needed for other types
    default:
      // If type is not recognized, keep dataToSet as it is
      return dataToSet;
  }
}

function setTenantId(
  resultantElement: any,
  requestBody: any,
  createAndSearchConfig: any
) {
  if (createAndSearchConfig?.parseArrayConfig?.tenantId) {
    const tenantId = _.get(requestBody, createAndSearchConfig?.parseArrayConfig?.tenantId?.getValueViaPath);
    _.set(resultantElement, createAndSearchConfig?.parseArrayConfig?.tenantId?.resultantPath, tenantId);
  }

}


function processData(dataFromSheet: any[], createAndSearchConfig: any) {
  const parseLogic = createAndSearchConfig?.parseArrayConfig?.parseLogic;
  const requiresToSearchFromSheet = createAndSearchConfig?.requiresToSearchFromSheet;
  var createData = [], searchData = [];
  for (const data of dataFromSheet) {
    const resultantElement: any = {};
    for (const element of parseLogic) {
      let dataToSet = _.get(data, element.sheetColumnName);
      if (element.conversionCondition) {
        dataToSet = element.conversionCondition[dataToSet];
      }
      if (element.type) {
        dataToSet = convertToType(dataToSet, element.type);
      }
      _.set(resultantElement, element.resultantPath, dataToSet);
    }
    resultantElement["!row#number!"] = data["!row#number!"];
    var addToCreate = true;
    for (const key of requiresToSearchFromSheet) {
      if (data[key.sheetColumnName]) {
        searchData.push(resultantElement)
        addToCreate = false;
        break;
      }
    }
    if (addToCreate) {
      createData.push(resultantElement)
    }
  }
  return { searchData, createData };
}

function setTenantIdAndSegregate(processedData: any, createAndSearchConfig: any, requestBody: any) {
  for (const resultantElement of processedData.createData) {
    setTenantId(resultantElement, requestBody, createAndSearchConfig);
  }
  for (const resultantElement of processedData.searchData) {
    setTenantId(resultantElement, requestBody, createAndSearchConfig);
  }
  return processedData;
}

// Original function divided into two parts
function convertToTypeData(dataFromSheet: any[], createAndSearchConfig: any, requestBody: any) {
  const processedData = processData(dataFromSheet, createAndSearchConfig);
  return setTenantIdAndSegregate(processedData, createAndSearchConfig, requestBody);
}

function updateActivityResourceId(request: any) {
  if (request?.body?.Activities && Array.isArray(request?.body?.Activities)) {
    for (const activity of request?.body?.Activities) {
      activity.resourceDetailsId = request?.body?.ResourceDetails?.id
    }
  }
}

async function generateProcessedFileAndPersist(request: any) {
  await updateStatusFile(request);
  updateActivityResourceId(request);
  logger.info("ResourceDetails to persist : " + JSON.stringify(request?.body?.ResourceDetails));
  logger.info("Activities to persist : " + JSON.stringify(request?.body?.Activities));
  produceModifiedMessages(request?.body, config.KAFKA_CREATE_RESOURCE_DETAILS_TOPIC);
  await new Promise(resolve => setTimeout(resolve, 2000));
  produceModifiedMessages(request?.body, config.KAFKA_CREATE_RESOURCE_ACTIVITY_TOPIC);
}

function getRootBoundaryCode(boundaries: any[]) {
  for (const boundary of boundaries) {
    if (boundary.isRoot) {
      return boundary.code;
    }
  }
  return "";
}

function enrichRootProjectId(requestBody: any) {
  var rootBoundary;
  for (const boundary of requestBody?.CampaignDetails?.boundaries) {
    if (boundary?.isRoot) {
      rootBoundary = boundary?.code
      break;
    }
  }
  if (rootBoundary) {
    requestBody.CampaignDetails.projectId = requestBody?.boundaryProjectMapping?.[rootBoundary]?.projectId
  }
}

async function enrichAndPersistProjectCampaignRequest(request: any) {
  request.body.CampaignDetails.campaignNumber = await getCampaignNumber(request.body, "CMP-[cy:yyyy-MM-dd]-[SEQ_EG_CMP_ID]", "campaign.number", request?.body?.CampaignDetails?.tenantId);
  request.body.CampaignDetails.campaignDetails = { deliveryRules: request?.body?.CampaignDetails?.deliveryRules, startDate: request?.body?.CampaignDetails?.startDate, endDate: request?.body?.CampaignDetails?.endDate };
  request.body.CampaignDetails.status = "started"
  request.body.CampaignDetails.boundaryCode = getRootBoundaryCode(request.body.CampaignDetails.boundaries)
  request.body.CampaignDetails.projectId = null;
  request.body.CampaignDetails.auditDetails = {
    createdBy: request?.body?.RequestInfo?.userInfo?.uuid,
    createdTime: Date.now(),
    lastModifiedBy: request?.body?.RequestInfo?.userInfo?.uuid,
    lastModifiedTime: Date.now(),
  }
  enrichRootProjectId(request.body);
  produceModifiedMessages(request?.body, config.KAFKA_SAVE_PROJECT_CAMPAIGN_DETAILS_TOPIC);
  delete request.body.CampaignDetails.campaignDetails
}


function getChildParentMap(modifiedBoundaryData: any) {
  const childParentMap: Map<string, string | null> = new Map();

  for (let i = 0; i < modifiedBoundaryData.length; i++) {
    const row = modifiedBoundaryData[i];
    for (let j = row.length - 1; j > 0; j--) {
      const child = row[j];
      const parent = row[j - 1]; // Parent is the element to the immediate left
      childParentMap.set(child, parent);
    }
  }

  return childParentMap;
}


function getCodeMappingsOfExistingBoundaryCodes(withBoundaryCode: any[]) {
  console.log(withBoundaryCode, "withhhhhhhhhhhhhhhhhh")
  const countMap = new Map<string, number>();
  const mappingMap = new Map<string, string>();
  withBoundaryCode.forEach((row: any[]) => {
    const len = row.length;
    if (len >= 3) {
      const grandParent = row[len - 3];
      if (mappingMap.has(grandParent)) {
        countMap.set(grandParent, (countMap.get(grandParent) || 0) + 1);
      } else {
        throw new Error("Insert boundary hierarchy level wise");
      }
    }
    mappingMap.set(row[len - 2], row[len - 1]);
    console.log(mappingMap, "mapppppp");
  });
  return { mappingMap, countMap };
}




function getBoundaryTypeMap(boundaryData: any[], boundaryMap: Map<string, string>) {
  const boundaryTypeMap: { [key: string]: string } = {};

  boundaryData.forEach((boundary) => {
    Object.entries(boundary).forEach(([key, value]) => {
      if (typeof value === 'string' && key !== 'Boundary Code') {
        const boundaryCode = boundaryMap.get(value);
        if (boundaryCode !== undefined) {
          boundaryTypeMap[boundaryCode] = key;
        }
      }
    });
  });

  return boundaryTypeMap;
}

function addBoundaryCodeToData(withBoundaryCode: any[], withoutBoundaryCode: any[], boundaryMap: Map<string, string>) {
  const boundaryDataWithBoundaryCode = withBoundaryCode;
  const boundaryDataForWithoutBoundaryCode = withoutBoundaryCode.map((row: any[]) => {
    const boundaryName = row[row.length - 1]; // Get the last element of the row
    const boundaryCode = boundaryMap.get(boundaryName); // Fetch corresponding boundary code from map
    return [...row, boundaryCode]; // Append boundary code to the row and return updated row
  });
  const boundaryDataForSheet = [...boundaryDataWithBoundaryCode, ...boundaryDataForWithoutBoundaryCode];
  return boundaryDataForSheet;
}

function prepareDataForExcel(boundaryDataForSheet: any, hierarchy: any[], boundaryMap: any) {
  const data = boundaryDataForSheet.map((boundary: any[]) => {
    const boundaryCode = boundary.pop();
    const rowData = boundary.concat(Array(Math.max(0, hierarchy.length - boundary.length)).fill(''));
    const boundaryCodeIndex = hierarchy.length;
    rowData[boundaryCodeIndex] = boundaryCode;
    return rowData;
  });
  return data;
}
function extractCodesFromBoundaryRelationshipResponse(boundaries: any[]): any {
  const codes = new Set();
  for (const boundary of boundaries) {
    codes.add(boundary.code); // Add code to the Set
    if (boundary.children && boundary.children.length > 0) {
      const childCodes = extractCodesFromBoundaryRelationshipResponse(boundary.children); // Recursively get child codes
      childCodes.forEach((code: any) => codes.add(code)); // Add child codes to the Set
    }
  }
  return codes;
}

async function searchProjectCampaignResourcData(request: any) {
  const CampaignDetails = request.body.CampaignDetails;
  const { tenantId, pagination, ids, ...searchFields } = CampaignDetails;
  const queryData = buildSearchQuery(tenantId, pagination, ids, searchFields);
  const responseData = await executeSearchQuery(queryData.query, queryData.values);
  request.body.CampaignDetails = responseData;
}

function buildSearchQuery(tenantId: string, pagination: any, ids: string[], searchFields: any): { query: string, values: any[] } {
  let conditions = [];
  let values = [tenantId];
  let index = 2;

  for (const field in searchFields) {
    if (searchFields[field] !== undefined) {
      conditions.push(`${field} = $${index}`);
      values.push(searchFields[field]);
      index++;
    }
  }

  let query = `
      SELECT *
      FROM health.eg_cm_campaign_details
      WHERE tenantId = $1
  `;

  if (ids && ids.length > 0) {
    const idParams = ids.map((id, i) => `$${index + i}`);
    query += ` AND id IN (${idParams.join(', ')})`;
    values.push(...ids);
  }

  if (conditions.length > 0) {
    query += ` AND ${conditions.join(' AND ')}`;
  }

  if (pagination) {
    query += '\n';

    if (pagination.sortBy) {
      query += `ORDER BY ${pagination.sortBy}`;
      if (pagination.sortOrder) {
        query += ` ${pagination.sortOrder.toUpperCase()}`;
      }
      query += '\n';
    }

    if (pagination.limit !== undefined) {
      query += `LIMIT ${pagination.limit}`;
      if (pagination.offset !== undefined) {
        query += ` OFFSET ${pagination.offset}`;
      }
      query += '\n';
    }
  }

  return { query, values };
}

async function executeSearchQuery(query: string, values: any[]) {
  const queryResult = await pool.query(query, values);
  return queryResult.rows.map((row: any) => ({
    id: row.id,
    tenantId: row.tenantid,
    status: row.status,
    action: row.action,
    campaignNumber: row.campaignnumber,
    campaignName: row.campaignname,
    projectType: row.projecttype,
    hierarchyType: row.hierarchytype,
    boundaryCode: row.boundarycode,
    projectId: row.projectid,
    createdBy: row.createdby,
    lastModifiedBy: row.lastmodifiedby,
    createdTime: Number(row?.createdtime),
    lastModifiedTime: row.lastmodifiedtime ? Number(row.lastmodifiedtime) : null,
    additionalDetails: row.additionaldetails,
    campaignDetails: row.campaigndetails
  }));
}

async function processDataSearchRequest(request: any) {
  const { SearchCriteria } = request.body;
  const query = buildWhereClauseForDataSearch(SearchCriteria);
  const queryResult = await pool.query(query.query, query.values);
  const results = queryResult.rows.map((row: any) => ({
    id: row.id,
    tenantId: row.tenantid,
    status: row.status,
    action: row.action,
    fileStoreId: row.filestoreid,
    processedFilestoreId: row.processedfilestoreid,
    type: row.type,
    createdBy: row.createdby,
    lastModifiedBy: row.lastmodifiedby,
    createdTime: Number(row?.createdtime),
    lastModifiedTime: row.lastmodifiedtime ? Number(row.lastmodifiedtime) : null,
    additionalDetails: row.additionaldetails
  }));
  request.body.ResourceDetails = results;
}

function buildWhereClauseForDataSearch(SearchCriteria: any): { query: string; values: any[] } {
  const { id, tenantId, type, status } = SearchCriteria;
  let conditions = [];
  let values = [];

  if (id && id.length > 0) {
    conditions.push(`id = ANY($${values.length + 1})`);
    values.push(id);
  }

  if (tenantId) {
    conditions.push(`tenantId = $${values.length + 1}`);
    values.push(tenantId);
  }

  if (type) {
    conditions.push(`type = $${values.length + 1}`);
    values.push(type);
  }

  if (status) {
    conditions.push(`status = $${values.length + 1}`);
    values.push(status);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  return {
    query: `
  SELECT *
  FROM health.eg_cm_resource_details
  ${whereClause};`, values
  };
}

async function processBoundary(boundary: any, boundaryCodes: any, boundaries: any[], request: any, parent?: any) {
  if (!boundaryCodes.has(boundary.code)) {
    boundaries.push({ code: boundary?.code, type: boundary?.boundaryType });
    boundaryCodes.add(boundary?.code);
  }
  if (!request?.body?.boundaryProjectMapping?.[boundary?.code]) {
    request.body.boundaryProjectMapping[boundary?.code] = {
      parent: parent ? parent : null,
      projectId: null
    }
  }
  else {
    request.body.boundaryProjectMapping[boundary?.code].parent = parent
  }
  if (boundary?.includeAllChildren) {
    const params = {
      tenantId: request?.body?.CampaignDetails?.tenantId,
      codes: boundary?.code,
      hierarchyType: request?.body?.CampaignDetails?.hierarchyType,
      includeChildren: true
    }
    logger.info("Boundary relationship search url : " + config.host.boundaryHost + config.paths.boundaryRelationship);
    logger.info("Boundary relationship search params : " + JSON.stringify(params));
    const boundaryResponse = await httpRequest(config.host.boundaryHost + config.paths.boundaryRelationship, request.body, params);
    if (boundaryResponse?.TenantBoundary?.[0]) {
      logger.info("Boundary found " + JSON.stringify(boundaryResponse?.TenantBoundary?.[0]?.boundary));
      for (const childBoundary of boundaryResponse.TenantBoundary[0]?.boundary?.[0].children) {
        await processBoundary(childBoundary, boundaryCodes, boundaries, request, boundary?.code);
      }
    }
  }
}

async function addBoundaries(request: any) {
  const { boundaries } = request?.body?.CampaignDetails;
  var boundaryCodes = new Set(boundaries.map((boundary: any) => boundary.code));
  for (const boundary of boundaries) {
    await processBoundary(boundary, boundaryCodes, boundaries, request);
  }
}

function reorderBoundariesWithParentFirst(reorderedBoundaries: any[], boundaryProjectMapping: any) {
  // Function to get the index of a boundary in the reordered boundaries array
  function getIndex(code: any) {
    return reorderedBoundaries.findIndex((boundary: any) => boundary.code === code);
  }

  // Reorder boundaries so that parents come first
  for (const boundary of reorderedBoundaries) {
    const parentCode = boundaryProjectMapping[boundary.code]?.parent;
    if (parentCode) {
      const parentIndex = getIndex(parentCode);
      const boundaryIndex = getIndex(boundary.code);
      if (parentIndex !== -1 && boundaryIndex !== -1 && parentIndex > boundaryIndex) {
        // Move the boundary to be right after its parent
        reorderedBoundaries.splice(parentIndex + 1, 0, reorderedBoundaries.splice(boundaryIndex, 1)[0]);
      }
    }
  }

  return reorderedBoundaries;
}


// TODO: FIX THIS FUNCTION...NOT REORDERING CORRECTLY
async function reorderBoundaries(request: any) {
  request.body.boundaryProjectMapping = {}
  await addBoundaries(request)
  logger.info("Boundaries after addition " + JSON.stringify(request?.body?.CampaignDetails?.boundaries));
  console.log("Boundary Project Mapping " + JSON.stringify(request?.body?.boundaryProjectMapping));
  reorderBoundariesWithParentFirst(request?.body?.CampaignDetails?.boundaries, request?.body?.boundaryProjectMapping)
  logger.info("Reordered Boundaries " + JSON.stringify(request?.body?.CampaignDetails?.boundaries));
}

async function createProject(request: any) {
  const { tenantId, boundaries, projectType, startDate, endDate } = request?.body?.CampaignDetails;
  request.body.CampaignDetails.id = uuidv4()
  var Projects: any = [{
    tenantId,
    projectType,
    startDate,
    endDate,
    "projectSubType": "Campaign",
    "department": "Campaign",
    "description": "Campaign ",
  }]
  const projectCreateBody = {
    RequestInfo: request?.body?.RequestInfo,
    Projects
  }
  await reorderBoundaries(request)
  for (const boundary of boundaries) {
    Projects[0].address = { tenantId: tenantId, boundary: boundary?.code, boundaryType: boundary?.type }
    if (request?.body?.boundaryProjectMapping?.[boundary?.code]?.parent) {
      const parent = request?.body?.boundaryProjectMapping?.[boundary?.code]?.parent
      Projects[0].parent = request?.body?.boundaryProjectMapping?.[parent]?.projectId
    }
    else {
      Projects[0].parent = null
    }
    Projects[0].referenceID = request?.body?.CampaignDetails?.id
    await projectCreate(projectCreateBody, request)
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

async function processBasedOnAction(request: any) {
  if (request?.body?.CampaignDetails?.action == "create") {
    await createProjectCampaignResourcData(request);
    await createProject(request)
    await enrichAndPersistProjectCampaignRequest(request)
  }
}
async function appendSheetsToWorkbook(boundaryData: any[]) {
  try {
    const uniqueDistricts: string[] = [];
    const uniqueDistrictsForMainSheet: string[] = [];
    const workbook = XLSX.utils.book_new();
    const mainSheetData: any[] = [];
    const headersForMainSheet = Object.keys(boundaryData[0]);
    mainSheetData.push(headersForMainSheet);

    for (const data of boundaryData) {
      const rowData = Object.values(data);
      const districtIndex = rowData.indexOf(data.District);
      const districtLevelRow = rowData.slice(0, districtIndex + 1);
      if (!uniqueDistrictsForMainSheet.includes(districtLevelRow.join('_'))) {
        uniqueDistrictsForMainSheet.push(districtLevelRow.join('_'));
        mainSheetData.push(rowData);
      }
    }
    const mainSheet = XLSX.utils.aoa_to_sheet(mainSheetData);
    XLSX.utils.book_append_sheet(workbook, mainSheet, 'Sheet1');
    
    for (const item of boundaryData) {
      if (item.District && !uniqueDistricts.includes(item.District)) {
        uniqueDistricts.push(item.District);
      }
    }
    for (const district of uniqueDistricts) {
      const districtDataFiltered = boundaryData.filter(item => item.District === district);
      const districtIndex = Object.keys(districtDataFiltered[0]).indexOf('District');
      const headers = Object.keys(districtDataFiltered[0]).slice(districtIndex);
      const newSheetData = [headers];
      for (const data of districtDataFiltered) {
        const rowData = Object.values(data).slice(districtIndex).map(value => value === null ? '' : String(value)); // Replace null with empty string
        newSheetData.push(rowData);
      }
      const ws = XLSX.utils.aoa_to_sheet(newSheetData);
      XLSX.utils.book_append_sheet(workbook, ws, district);
    }
    return workbook;
  } catch (error) {
    throw Error("An error occurred while appending sheets:");
  }
}

// async function getWorkbook(fileUrl: string, sheetName: string) {
//   try {
//     const headers = {
//       'Content-Type': 'application/json',
//       Accept: 'application/pdf',
//     };
//     const workbookData = await httpRequest(fileUrl, null, {}, 'get', 'arraybuffer', headers);
//     const workbook = XLSX.read(workbookData, { type: 'buffer' });
//     if (!workbook.Sheets.hasOwnProperty(sheetName)) {
//       throw new Error(`Sheet with name "${sheetName}" is not present in the file.`);
//     }
//     return workbook;
//   } catch (error) {
//     throw new Error("Error while fetching sheet");
//   }
// }






export {
  errorResponder,
  errorLogger,
  invalidPathHandler,
  getResponseInfo,
  throwError,
  sendResponse,
  appCache,
  cacheResponse,
  getCachedResponse,
  generateSortingAndPaginationClauses,
  generateXlsxFromJson,
  generateAuditDetails,
  generateResourceMessage,
  generateActivityMessage,
  getResponseFromDb,
  callSearchApi,
  getCreationDetails,
  getSchemaAndProcessResult,
  getModifiedResponse,
  getNewEntryResponse,
  getOldEntryResponse,
  getFinalUpdatedResponse,
  fullProcessFlowForNewEntry,
  modifyData,
  correctParentValues,
  sortCampaignDetails,
  processGenerateRequest,
  processGenerate,
  convertToFacilityExsistingData,
  enrichResourceDetails,
  getFacilityIds,
  matchFacilityData,
  enrichAndSaveResourceDetails,
  getDataFromSheet,
  convertToTypeData,
  matchData,
  generateProcessedFileAndPersist,
  modifyBoundaryData,
  getChildParentMap,
  getBoundaryTypeMap,
  addBoundaryCodeToData,
  prepareDataForExcel,
  extractCodesFromBoundaryRelationshipResponse,
  searchProjectCampaignResourcData,
  processDataSearchRequest,
  getCodeMappingsOfExistingBoundaryCodes,
  processBasedOnAction,
  appendSheetsToWorkbook
};


