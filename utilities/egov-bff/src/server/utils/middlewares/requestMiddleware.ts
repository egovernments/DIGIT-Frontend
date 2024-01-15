import { NextFunction, Request, Response } from "express";
import { errorResponder, skipEnrichmentandChecks } from "..";
import config from "../../config";

const { object, string } = require("yup");
// const { errorResponder } = require("../utils");

const requestSchema = object({
  apiId: string().nullable(),
  action: string().nullable(),
  msgId: string().required(),
  clientSecret: config?.client?.checkDisabled
    ? string().required()
    : string().nullable(),
    uuid: string().nonNullable()
});

const checkForClientSecret = (req: Request, next: NextFunction) => {
  const conditions= config?.client?.checkDisabled ||
  req?.body?.RequestInfo?.clientSecret == config?.client?.secret || skipEnrichmentandChecks(req);
  if (
    conditions
  ) {
    next();
  } else {
    throw new Error("Invalid ClientSecret");
  }
};

const requestMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    !skipEnrichmentandChecks(req) && requestSchema.validateSync(req.body.RequestInfo);
    //* added client secret check since we can add data without auth and user for MFORM */
    checkForClientSecret(req, next);
  } catch (error) {
    // error.status = 400;
    // error.code = "MISSING_PARAMETERS_IN_REQUESTINFO";
    errorResponder(error, req, res);
  }
};

export default requestMiddleware;
