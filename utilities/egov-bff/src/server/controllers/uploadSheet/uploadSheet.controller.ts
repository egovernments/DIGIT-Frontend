import * as express from "express";
import { convertObjectForMeasurment, produceIngestion } from "../../utils";
import axios from "axios";
import FormData from 'form-data';
import config from "../../config/index";
import * as XLSX from 'xlsx';


import {
  getSheetData, getTemplate, getParsingTemplate
} from "../../api/index";

import {
  errorResponder,
  sendResponse,
} from "../../utils/index";
import { httpRequest } from "../../utils/request";

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
      const { fileStoreId, startRow, endRow, transformTemplate, parsingTemplates } = request.body;
      const result: any = await getTemplate(transformTemplate, request.body.RequestInfo, response);
      const parseResult: any = await getParsingTemplate(parsingTemplates, request.body.RequestInfo, response);
      var TransformConfig, parsingConfig: any;
      if (result?.data?.mdms?.length > 0) {
        TransformConfig = result.data.mdms[0];
      }
      else {
        return errorResponder({ message: "No Transform Template found " }, request, response);
      }
      const url = config.host.filestore + config.paths.filestore + `/url?tenantId=${request?.body?.RequestInfo?.userInfo?.tenantId}&fileStoreIds=${fileStoreId}`;
      var updatedDatas: any[] = [];
      if (parseResult?.data?.mdms?.length > 0) {
        const mdmsArray = parseResult.data.mdms;

        // Iterate through all elements in mdms array
        for (const mdmsElement of mdmsArray) {
          parsingConfig = mdmsElement?.data?.path;

          const data: any = await getSheetData(url, startRow, endRow, TransformConfig?.data?.Fields, TransformConfig?.data?.sheetName);

          // Check if data is an array before using map
          if (Array.isArray(data)) {
            const updatedData = data.map((element) =>
              convertObjectForMeasurment(element, parsingConfig)
            );

            // Add updatedData to the array
            updatedDatas.push(updatedData);
          }
        }

        // After processing all mdms elements, send the response
        return sendResponse(response, { updatedDatas }, request);
      }

      else {
        return errorResponder({ message: "No Parsing Template found " }, request, response);
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
      // const result = await httpRequest(`${"http://127.0.0.1:8080"}${config.app.contextPath}${this.path}/_transform`, request.body, undefined, undefined, undefined, undefined);
      const result = await httpRequest(`${config.host.serverHost}${config.app.contextPath}${this.path}/_transform`, request.body, undefined, undefined, undefined, undefined);
      const datas = result?.updatedDatas;

      // Check if data is an array before processing
      var Job: any = { ingestionDetails: [] };
      for (const data of datas) {
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

            5
            // Upload the file using axios
            try {
              var fileCreationResult;
              try {
                fileCreationResult = await axios.post(config.host.filestore + config.paths.filestore, formData, {
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
              if (Array.isArray(responseData) && responseData.length > 0) {
                Job.ingestionDetails.push({ id: responseData[0].fileStoreId, tenanId: responseData[0].tenantId, state: "not-started", type: "xlsx" });
              }
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
        }
      }
    } catch (e: any) {
      return errorResponder({ message: e?.response?.data?.Errors[0].message }, request, response);
    }
    const fileStoreId = request?.body?.fileStoreId;
    const tenantId = request?.body?.RequestInfo?.userInfo?.tenantId;
    Job.tenantId = tenantId
    produceIngestion({ Job }, fileStoreId, request.body.RequestInfo)
    return sendResponse(
      response,
      { Job },
      request
    );
  };

}

// Export the MeasurementController class
export default BulkUploadController;
