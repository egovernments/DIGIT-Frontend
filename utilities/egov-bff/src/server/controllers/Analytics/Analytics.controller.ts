import * as express from "express";
// import { Blob } from 'buffer';
// Import necessary modules and libraries

import { errorResponder, sendResponse } from "../../utils/index";
import { createSession, endSession } from "../../services/Session.services";
import { createEvent } from "../../services/Event.services";

// Define the MeasurementController class
class AnalyticsController {
  // Define class properties
  public path = "/analytics";
  public router = express.Router();

  // Constructor to initialize routes
  constructor() {
    this.intializeRoutes();
  }

  // Initialize routes for MeasurementController
  public intializeRoutes() {
    this.router.post(`${this.path}/session/create`, this.create);
    this.router.get(`${this.path}/session/end`, this.end);
    this.router.post(`${this.path}/event/create`, this.event);
  }

  saveDataThroughGet = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      // const { DataSync } = request.body;
      // const respo = await create_mdms_v2("hrms.EmployeeType", DataSync);
      // if (respo) {
      //   return sendResponse(response, { ...respo }, request);
      // }

      throw new Error("Error fetching or processing data");
    } catch (error: any) {
      return errorResponder(error, request, response);
    }
  };
  // This function handles the HTTP request for retrieving all measurements.
  create = async (request: express.Request, response: express.Response) => {
    try {
      const respo = await createSession(request.body);
      return sendResponse(response, { ...respo }, request);
    } catch (error: any) {
      return errorResponder(error, request, response);
    }
  };
  // This function handles the HTTP request for retrieving all measurements.
  end = async (request: express.Request, response: express.Response) => {
    try {
      const respo = await endSession(request.body);
      return sendResponse(response, { ...respo }, request);
    } catch (error: any) {
      return errorResponder(error, request, response);
    }
  };
  event = async (request: express.Request, response: express.Response) => {
    try {
      const respo = await createEvent(request.body);
      return sendResponse(response, { ...respo }, request);
    } catch (error: any) {
      return errorResponder(error, request, response);
    }
  };
}

// Export the class
export default AnalyticsController;
