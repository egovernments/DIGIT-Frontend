import * as express from "express";
import { convertObjectForMeasurment } from "../../utils";
import axios from "axios";
import FormData from 'form-data';
// import { Blob } from 'buffer';
import * as XLSX from 'xlsx';
// Import necessary modules and libraries

import {
  getSheetData, getTemplate, getParsingTemplate
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
      const { fileStoreId, startRow, endRow, templateName } = request.body;
      const result: any = await getTemplate(templateName, request.body.RequestInfo, response);
      const parseResult: any = await getParsingTemplate(templateName, request.body.RequestInfo, response);
      var config, parsingConfig: any;
      if (result?.data?.mdms?.length > 0) {
        config = result.data.mdms[0];
      }
      else {
        return errorResponder({ message: "No Transform Template found " }, request, response);
      }
      if (parseResult?.data?.mdms?.length > 0) {
        parsingConfig = parseResult.data.mdms[0]?.data?.path;
      }
      else {
        return errorResponder({ message: "No Parsing Template found " }, request, response);
      }

      const url = `http://unified-uat.digit.org/filestore/v1/files/url?tenantId=mz&fileStoreIds=${fileStoreId}`;
      const data: any = await getSheetData(url, startRow, endRow, config?.data?.Fields, config?.data?.sheetName);
      // Check if data is an array before using map
      if (Array.isArray(data)) {
        const updatedData = data.map((element) =>
          convertObjectForMeasurment(element, parsingConfig)
        );
        return sendResponse(
          response,
          { updatedData },
          request
        );
      } else {
        if (data?.code == "NO_SHEETNAME_FOUND") {
          return errorResponder({ message: `No sheet found for  sheetName ${config?.data?.sheetName}` }, request, response);
        }
        return errorResponder({ message: 'Error fetching or processing data...Check Console' }, request, response);
      }
    } catch (e: any) {
      return errorResponder({ message: e?.response?.data?.Errors[0].message }, request, response);
    }
  };

  getTransformedXlsx = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {

      const result = await axios.post(`http://127.0.0.1:8080/egov-bff/${this.path}/_transform`, request.body);
      const data = result?.data?.updatedData;
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
          const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
          const formData = new FormData();
          formData.append('file', buffer, 'filename.xlsx');
          formData.append('tenantId', request?.body?.RequestInfo?.userInfo?.tenantId);
          formData.append('module', 'pgr');


          // Upload the file using axios
          try {
            var fileCreationResult;

            try {
              fileCreationResult = await axios.post('https://unified-uat.digit.org/filestore/v1/files', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'auth-token': request?.body?.RequestInfo?.authToken
                }
              });
            } catch (error: any) {

              return errorResponder(
                { message: error?.response?.data?.Errors[0]?.message },
                request,
                response
              );
            }
            const responseData = fileCreationResult?.data?.files;
            return sendResponse(
              response,
              { responseData },
              request
            );
          } catch (error: any) {
            return errorResponder(
              { message: "Error in creating FileStoreId" },
              request,
              response
            );
          }

        } else {
          return errorResponder({ message: 'Keys are not the same' }, request, response);
        }
      } else {
        return errorResponder(
          { message: 'Error: Data is not an array' },
          request,
          response
        );
      }
    } catch (e: any) {
      return errorResponder({ message: e?.response?.data?.Errors[0].message }, request, response);
    }
  };

}

// Export the MeasurementController class
export default BulkUploadController;
