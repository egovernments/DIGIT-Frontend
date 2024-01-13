import * as express from "express";
// import { Blob } from 'buffer';
// Import necessary modules and libraries

import { errorResponder, sendResponse } from "../../utils/index";
import { create_mdms_v2, search_mdms_v2 } from "../../api/index";

// Define the MeasurementController class
class DataController {
  // Define class properties
  public path = "/data";
  public router = express.Router();
  public dayInMilliSecond = 86400000;

  // Constructor to initialize routes
  constructor() {
    this.intializeRoutes();
  }

  // Initialize routes for MeasurementController
  public intializeRoutes() {
    this.router.post(`${this.path}/_save`, this.saveData);
    this.router.post(`${this.path}/_get`, this.getData);
  }

  // This function handles the HTTP request for retrieving all measurements.
  saveData = async (request: express.Request, response: express.Response) => {
    try {
      const { DataSync } = request.body;
      const respo = await create_mdms_v2("hrms.EmployeeType", DataSync);
      if (respo) {
        return sendResponse(response, { ...respo }, request);
      }

      throw new Error("Error fetching or processing data");
    } catch (error: any) {
      return errorResponder(error, request, response);
    }
  };
  // This function handles the HTTP request for retrieving all measurements.
  getData = async (request: express.Request, response: express.Response) => {
    try {
      const respo = await search_mdms_v2("WORKS-SOR.SOR", {});
      if (respo) {
        return sendResponse(response, { resp: [...respo?.mdms] }, request);
      }

      throw new Error("Error fetching or processing data");
    } catch (error: any) {
      return errorResponder(error, request, response);
    }
  };
}

// Export the class
export default DataController;
