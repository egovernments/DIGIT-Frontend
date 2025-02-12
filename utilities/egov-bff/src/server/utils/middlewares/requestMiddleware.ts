import { NextFunction, Request, Response } from "express";
import { errorResponder, logger } from "..";
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
    logger.info("received request in middlewares");
    requestSchema.validateSync(req.body.RequestInfo);
    next();
  } catch (error) {
    errorResponder(error, req, res);
  }
};

export default requestMiddleware;
