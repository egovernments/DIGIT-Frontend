import { logger } from "./logger";
import { NextFunction, Request, Response } from "express";
import { httpRequest } from "./request";
import config from "../config";
import { throwError } from "./errorUtils";
const NodeCache = require("node-cache");



export const appCache = new NodeCache({ stdTTL: 1800000, checkperiod: 300 });

export const throwErrorViaRequest = (message: any = "Internal Server Error") => {
    if (message?.message || message?.code) {
        let error: any = new Error(message?.message || message?.code);
        error = Object.assign(error, { status: message?.status || 500 });
        logger.error("Error : " + error + " " + (message?.description || ""));
        throw error;
    }
    else {
        let error: any = new Error(message);
        error = Object.assign(error, { status: 500 });
        logger.error("Error : " + error);
        throw error;
    }
};

export function shutdownGracefully() {
    logger.info('Shutting down gracefully...');
    // Perform any cleanup tasks here, like closing database connections
    process.exit(1); // Exit with a non-zero code to indicate an error
}

/*
Error handling Middleware function for logging the error message
*/
export const errorLogger = (
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
Fallback Middleware function for returning 404 error for undefined paths
*/
export const invalidPathHandler = (
    request: any,
    response: any,
    next: NextFunction
) => {
    response.status(404);
    response.send(getErrorResponse("INVALID_PATH", "invalid path"));
};

/*
Error handling Middleware function reads the error message and sends back a response in JSON format
*/
export const errorResponder = (
    error: any,
    request: any,
    response: any,
    status: any = 500,
    next: any = null
) => {
    if (error?.status) {
        status = error?.status;
    }
    const code = error?.code || (status === 500 ? "INTERNAL_SERVER_ERROR" : (status === 400 ? "BAD_REQUEST" : "UNKNOWN_ERROR"));
    response.header("Content-Type", "application/json");
    const errorMessage = trimError(error.message || "Some Error Occurred!!");
    const errorDescription = error.description || null;
    const errorResponse = getErrorResponse(code, errorMessage, errorDescription);
    response.status(status).send(errorResponse);
};

const trimError = (e: any) => {
    if (typeof e === "string") {
        e = e.trim();
        while (e.startsWith("Error:")) {
            e = e.substring(6);
            e = e.trim();
        }
    }
    return e;
}

const getErrorResponse = (
    code = "INTERNAL_SERVER_ERROR",
    message = "Some Error Occured!!",
    description: any = null
) => ({
    ResponseInfo: null,
    Errors: [
        {
            code: code,
            message: message,
            description: description,
            params: null,
        },
    ],
});

/* 
Send The Response back to client with proper response code and response info
*/
export const sendResponse = (
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
    logger.info("Send back the response to the client");
    response.status(code).send({
        ...getResponseInfo(code),
        ...responseBody,
    });
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

export async function getFileUrl(request: any) {
    const { fileStoreId, tenantId } = request.query;
    const searchParams = {
        tenantId,
        fileStoreIds: fileStoreId
    }
    const response = await httpRequest(config.host.filestore + config.paths.filestoreSearch, undefined, searchParams, "get");
    if (!response?.fileStoreIds?.[0]?.url) {
        throwError("FILE", 400, "INVALID_FILE");
    }
    return response?.fileStoreIds?.[0]?.url
}