import * as express from "express";
// import { Blob } from 'buffer';
// Import necessary modules and libraries

import { errorResponder, sendResponse } from "../../utils/index";
import { search_mdms_v2 } from "../../api/index";

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
      const { DataSync }: { DataSync: Data } = request.body;

      const respo = await search_mdms_v2("hrms.EmployeeType", DataSync);
      if (respo) {
        return sendResponse(response, { ...respo }, request);
      }

      throw new Error("Error fetching or processing data");
    } catch (e) {
      console.error(e);
      return errorResponder(
        { error: "Internal Server Error" },
        request,
        response
      );
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
    } catch (e) {
      return errorResponder(
        { error: "Internal Server Error" },
        request,
        response
      );
    }
  };
}

// Export the class
export default DataController;
