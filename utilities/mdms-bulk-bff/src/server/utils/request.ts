import { Response } from "express";
import { getFormattedStringForDebug, logger } from "./logger";
import { throwErrorViaRequest } from "./genericUtils";
import config from "../config";
import { redis, checkRedisConnection } from "./redisUtils";

var Axios = require("axios").default;
var get = require("lodash/get");
const axiosInstance = Axios.create({
  timeout: 0,
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

axiosInstance.interceptors.response.use(
  (res: Response) => {
    return res;
  },
  (err: any) => {
    if (err && !err.response) {
      err.response = {
        status: 400,
      };
    }
    if (err && err.response && !err.response.data) {
      err.response.data = {
        Errors: [{ code: err.message }],
      };
    }
    throw err;
  }
);

export const defaultheader = {
  "content-type": "application/json;charset=UTF-8",
  accept: "application/json, text/plain, */*",
};

const getServiceName = (url = "") => url && url.slice && url.slice(url.lastIndexOf(url.split("/")[3]));

const cacheEnabled = config.cacheValues.cacheEnabled;

async function httpRequest(
  _url: string,
  _requestBody: any,
  _params: any = {},
  _method: string = "post",
  responseType: string = "",
  headers: any = defaultheader,
  sendStatusCode: any = false,
  retry: any = false,
  dontThrowError: any = false
) {
  let attempt = 0;
  const maxAttempts = parseInt(config.values.maxHttpRetries) || 4;
  const cacheKey = headers && headers.cachekey ? `cache:${headers.cachekey}` : null;
  const cacheTTL = 300;

  while (attempt < maxAttempts) {
    try {
      const isRedisConnected = await checkRedisConnection();
      if (cacheKey && cacheEnabled && isRedisConnected) {
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
          logger.info("CACHE HIT :: " + cacheKey);
          logger.debug(`CACHED DATA :: ${getFormattedStringForDebug(cachedData)}`);
          if (config.cacheValues.resetCache) {
            await redis.expire(cacheKey, cacheTTL);
          }
          return JSON.parse(cachedData);
        }
        logger.info("NO CACHE FOUND :: REQUEST :: " + cacheKey);
      }

      logger.info(
        "INTER-SERVICE :: REQUEST :: " +
        getServiceName(_url) +
        " CRITERIA :: " +
        JSON.stringify(_params)
      );
      logger.debug("INTER-SERVICE :: REQUESTBODY :: " + getFormattedStringForDebug(_requestBody));
      delete headers.cachekey;

      // Add debug log before axios request
      logger.debug(`Attempting HTTP request to ${_url}, attempt ${attempt + 1}`);

      const response = await axiosInstance({
        method: _method,
        url: _url,
        data: _requestBody,
        params: _params,
        headers: { ...defaultheader, ...headers },
        responseType,
      });

      const responseStatus = parseInt(get(response, "status"), 10);
      logger.info(
        "INTER-SERVICE :: SUCCESS :: " +
        getServiceName(_url) +
        ":: CODE :: " +
        responseStatus
      );
      logger.debug("INTER-SERVICE :: RESPONSEBODY :: " + getFormattedStringForDebug(response.data));

      if ([200, 201, 202].includes(responseStatus)) {
        if (cacheKey && isRedisConnected) {
          await redis.set(cacheKey, JSON.stringify(response.data), "EX", cacheTTL);
        }
        return sendStatusCode ? { ...response.data, statusCode: responseStatus } : response.data;
      }
    } catch (error: any) {
      const errorResponse = error?.response;
      logger.error(
        "INTER-SERVICE :: FAILURE :: " +
        getServiceName(_url) +
        ":: CODE :: " +
        errorResponse?.status +
        ":: ERROR :: " +
        (errorResponse?.data?.Errors?.[0]?.code || error) +
        ":: DESCRIPTION :: " +
        errorResponse?.data?.Errors?.[0]?.description
      );
      logger.error(
        "error occurred while making request to " +
        getServiceName(_url) +
        ": error response :" +
        (errorResponse ? parseInt(errorResponse?.status, 10) : error?.message)
      );
      logger.error(":: ERROR STACK :: " + (error?.stack || error));
      logger.warn(
        `Error occurred while making request to ${getServiceName(_url)}: with error response ${JSON.stringify(
          errorResponse?.data || { Errors: [{ code: error.message, description: error.stack }] }
        )}`
      );
      if (retry) {
        attempt++;
        if (attempt >= maxAttempts) {
          if (dontThrowError) {
            logger.warn(`Maximum retry attempts reached for httprequest with url ${_url}`);
            return errorResponse?.data || { Errors: [{ code: error.message, description: error.stack }] };
          } else {
            throwTheHttpError(errorResponse, error, _url);
          }
        }
        logger.warn(`Waiting for 20 seconds before retrying httprequest with url ${_url}`);
        await new Promise((resolve) => setTimeout(resolve, 20000));
      } else if (dontThrowError) {
        logger.warn(
          `Error occurred while making request to ${getServiceName(_url)}: returning error response ${JSON.stringify(
            errorResponse?.data || { Errors: [{ code: error.message, description: error.stack }] }
          )}`
        );
        return errorResponse?.data || { Errors: [{ code: error.message, description: error.stack }] };
      } else {
        throwTheHttpError(errorResponse, error, _url);
      }
    }
  }
};

function throwTheHttpError(errorResponse?: any, error?: any, _url?: string) {
  if (errorResponse?.data?.Errors?.[0]) {
    errorResponse.data.Errors[0].status = errorResponse?.data?.Errors?.[0]?.status || errorResponse?.status;
    throwErrorViaRequest(errorResponse?.data?.Errors?.[0]);
  } else {
    throwErrorViaRequest(
      "error occurred while making request to " +
      getServiceName(_url) +
      ": error response :" +
      (errorResponse ? parseInt(errorResponse?.status, 10) : error?.message)
    );
  }
}

export { httpRequest };
