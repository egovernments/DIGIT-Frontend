import { NextFunction, Request, Response } from "express";
import { errorResponder, skipEnrichmentandChecks } from "..";
// import config from "../../config";

const { object, string } = require("yup");
// const { errorResponder } = require("../utils");

const requestSchema = object({
  apiId: string().nullable(),
  action: string().nullable(),
  msgId: string().required(),
  clientId: string().required(),
    uuid: string().nonNullable()
});

const requestMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    !skipEnrichmentandChecks(req) && requestSchema.validateSync(req.body.RequestInfo);
  } catch (error) {
    errorResponder(error, req, res);
  }
};

export default requestMiddleware;
