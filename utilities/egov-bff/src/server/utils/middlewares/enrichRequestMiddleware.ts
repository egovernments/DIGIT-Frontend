import { NextFunction, Request, Response } from "express";
import { errorResponder, logger } from "..";


const checkForClientSecret = async (req: Request, next: NextFunction) => {
  const { body={} } = req;
  const { RequestInfo={} } = body;
  const { clientId} = RequestInfo;

  if (clientId) {
   // add some check for client ids
    logger.info(`clientId received : ${clientId}`);
    console.log(body)
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

        await checkForClientSecret(req, next);
      
  } catch (error) {
    // error.status = 400;
    // error.code = "MISSING_PARAMETERS_IN_REQUESTINFO";
    errorResponder(error, req, res);
  }
};

export default enrichRequestMiddleware;
