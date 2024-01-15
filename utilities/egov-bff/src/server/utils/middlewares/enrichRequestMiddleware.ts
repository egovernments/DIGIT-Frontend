import { NextFunction, Request, Response } from "express";
import { errorResponder, logger, skipEnrichmentandChecks } from "..";
import config from "../../config";
import { search_user } from "../../api";

const checkForClientSecret = async (req: Request, next: NextFunction) => {
  const { body={} } = req;
  const { RequestInfo={} } = body;
  const { uuid="" } = RequestInfo;

  const userResp = await search_user(uuid, config.stateTenantId, RequestInfo);
  if (userResp && userResp?.user?.[0]?.uuid == uuid) {
    logger.info("USER FOUND :: " + userResp?.user?.[0]?.userName);
    RequestInfo["userInfo"] = userResp?.user?.[0];
    logger.info("Enriched the user info to the request ");
    next();
  } else {
    throw new Error("User Not Found");
  }

};

const enrichRequestMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //* added client secret check since we can add data without auth and user for MFORM */
    if(skipEnrichmentandChecks(req)){
      next();}
      else{
        await checkForClientSecret(req, next);
      }
  } catch (error) {
    // error.status = 400;
    // error.code = "MISSING_PARAMETERS_IN_REQUESTINFO";
    errorResponder(error, req, res);
  }
};

export default enrichRequestMiddleware;
