import * as express from "express";
// import { Blob } from 'buffer';
// Import necessary modules and libraries

import { errorResponder, sendResponse } from "../../utils/index";
import { create_mdms_v2, search_mdms_v2 } from "../../api/index";
import config from "../../config";

// Define the MeasurementController class
class DataController {
  // Define class properties
  public path = "/data";
  public router = express.Router();

  // Constructor to initialize routes
  constructor() {
    this.intializeRoutes();
  }

  // Initialize routes for MeasurementController
  public intializeRoutes() {
    this.router.post(`${this.path}/_save`, this.saveData);
    this.router.get(`${this.path}/_save`, this.saveDataThroughGet);
    this.router.post(`${this.path}/_get`, this.getData);
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
  saveData = async (request: express.Request, response: express.Response) => {
    try {
      const respo = await create_mdms_v2(
        config.client.schemaCode,
        request.body
      );
      if (respo) {
        const newResponse = { ...respo };
        if (newResponse?.mdms) {
          newResponse["DataSync"] = [...newResponse?.mdms];
          delete newResponse?.mdms;
        }
        return sendResponse(response, { ...newResponse }, request);
      }

      throw new Error("Error fetching or processing data");
    } catch (error: any) {
      return errorResponder(error, request, response);
    }
  };
  // This function handles the HTTP request for retrieving all measurements.
  getData = async (request: express.Request, response: express.Response) => {
    try {
      const { DataSync = {} } = request.body;
      const { key = "", type = "", id = "" } = DataSync;
      const filters = {
        ...(key && { key }),
        ...(type && { type }),
      };
      const respo = await search_mdms_v2(config.client.schemaCode, filters, id);
      if (respo) {
        return sendResponse(response, { DataSync: [...respo?.mdms] }, request);
      }

      throw new Error("Error fetching or processing data");
    } catch (error: any) {
      return errorResponder(error, request, response);
    }
  };
}

// Export the class
export default DataController;
