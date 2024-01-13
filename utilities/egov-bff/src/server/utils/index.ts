import { NextFunction, Request, Response } from "express";

import { logger } from "./logger";
const NodeCache = require("node-cache");
const jp = require("jsonpath");

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
const convertObjectForMeasurment = (
  obj: any,
  config: any,
  defaultValue?: any
) => {
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
  logger,
};
