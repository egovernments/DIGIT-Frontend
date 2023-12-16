import * as express from "express";
import { convertObjectForMeasurment } from "../../utils";
import { path } from "./path";
import { defaulValue } from "./defaultValue";
import axios from "axios";
import FormData from 'form-data';
// import { Blob } from 'buffer';
import * as XLSX from 'xlsx';
// Import necessary modules and libraries

import {
  getSheetData
} from "../../api/index";

import {
  errorResponder,
  sendResponse,
} from "../../utils/index";

// Define the MeasurementController class
class BulkUploadController {
  // Define class properties
  public path = "/bulk";
  public router = express.Router();
  public dayInMilliSecond = 86400000;

  // Constructor to initialize routes
  constructor() {
    this.intializeRoutes();
  }

  // Initialize routes for MeasurementController
  public intializeRoutes() {
    this.router.post(`${this.path}/_transform`, this.getTransformedData);
    this.router.post(`${this.path}/_getxlsx`, this.getTransformedXlsx);
  }

  // This function handles the HTTP request for retrieving all measurements.
  getTransformedData = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const { fileStoreIds, startRow, endRow, config, sheetName } = request.body;
      const fileStoreIdsParam = fileStoreIds.map((id: string) => `fileStoreIds=${id}`).join('&');
      // TODO @ASHISH make interservice calls, 
      const url = `http://unified-uat.digit.org/filestore/v1/files/url?tenantId=mz&${fileStoreIdsParam}`;

      const data = await getSheetData(url, startRow, endRow, config, sheetName);

      // Check if data is an array before using map
      if (Array.isArray(data)) {
        const updatedData = data.map((element) =>
          convertObjectForMeasurment(element, path, defaulValue)
        );

        return sendResponse(
          response,
          { updatedData },
          request
        );
      } else {
        // Handle the case where data is an Error
        console.error('Error fetching or processing data:', data);
        return errorResponder(
          { error: "Internal Server Error" },
          request,
          response
        );
      }
    } catch (e) {
      console.error(e);
      return errorResponder(
        { error: "Internal Server Error" },
        request,
        response
      );
    }
  };

  getTransformedXlsx = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      // TODO @ASHISH interservice calls
      const result = await axios.post(`http://127.0.0.1:8080/egov-bff/${this.path}/_transform`, request.body);
      const data = result.data.updatedData;

      // Check if data is an array before processing
      if (Array.isArray(data)) {
        // Create a new array with simplified objects
        const simplifiedData = data.map((originalObject) => {
          // Initialize acc with an explicit type annotation
          const acc: { [key: string]: any } = {};

          // Extract key-value pairs where values are not arrays or objects
          const simplifiedObject = Object.entries(originalObject).reduce((acc, [key, value]) => {
            if (!Array.isArray(value) && typeof value !== 'object') {
              acc[key] = value;
            }
            return acc;
          }, acc);

          return simplifiedObject;
        });

        const areKeysSame = simplifiedData.every((obj, index, array) => {
          return Object.keys(obj).length === Object.keys(array[0]).length &&
            Object.keys(obj).every(key => Object.keys(array[0]).includes(key));
        });

        // Log the result
        if (areKeysSame) {
          const ws = XLSX.utils.json_to_sheet(simplifiedData);

          // Create a new workbook
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

          // Write the workbook to a buffer
          const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

          // Create a Blob from the buffer
          // const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

          // Create a FormData object and append the Blob as a file
          const formData = new FormData();
          formData.append('file', buffer, 'filename.xlsx');
          formData.append('tenantId', 'mz');
          formData.append('module', 'pgr');

          // Upload the file using axios
          try {
            const fileCreationResult = await axios.post('https://unified-uat.digit.org/filestore/v1/files', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'auth-token': '99964fc5-5059-44b3-8064-443ad83d3805'
              }
            });
            const responseData = fileCreationResult.data.files;
            return sendResponse(
              response,
              { responseData },
              request
            );
          } catch (error: any) {
            return errorResponder(
              { error: "Error in creating FileStoreId" },
              request,
              response
            );
          }

        } else {
          console.log('Keys are not the same');
        }

        return sendResponse(
          response,
          { simplifiedData },
          request
        );
      } else {
        // Handle the case where data is not an array
        console.error('Error: Data is not an array');
        return errorResponder(
          { error: "Internal Server Error" },
          request,
          response
        );
      }
    } catch (e) {
      console.error(e);
      return errorResponder(
        { error: "Internal Server Error" },
        request,
        response
      );
    }
  };

}

// Export the MeasurementController class
export default BulkUploadController;
