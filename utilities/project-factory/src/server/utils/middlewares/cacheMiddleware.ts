import { errorResponder, appCache } from "../index";
import { NextFunction, Request, Response } from "express";

const cacheEnabled = false;

const cacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheData = appCache.get(req.headers.cachekey);
    if (cacheData && cacheEnabled) {
      return cacheData;
    } else {
      next();
    }
  } catch (error) {
    // error.status = 400;
    // error.code = "MISSING_PARAMETERS_IN_REQUESTINFO";
    errorResponder(error, req, res, next);
  }
};


export default cacheMiddleware;
