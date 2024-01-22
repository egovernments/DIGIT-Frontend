import * as express from "express";
// import { produceIngestion } from "../../utils";
// import FormData from 'form-data';
import config from "../../config/index";
// import * as XLSX from 'xlsx';
import { logger } from "../../utils/logger";


import {
    getSheetData, searchMDMS
} from "../../api/index";

import {
    convertObjectForMeasurment,
    errorResponder,
    sendResponse,
} from "../../utils/index";
// import { httpRequest } from "../../utils/request";

// Define the MeasurementController class
class TransformController {
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
        this.router.post(`${this.path}/_process`, this.process);
    }
    getTransformedData = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const { fileStoreId, transformTemplate, selectedRows } = request?.body?.HCMConfig;
            logger.info("TransformTemplate :" + transformTemplate)
            const result: any = await searchMDMS([transformTemplate], config.values.transfromTemplate, request.body.RequestInfo, response);
            var TransformConfig: any;
            if (result?.mdms?.length > 0) {
                TransformConfig = result.mdms[0];
                logger.info("TransformConfig : " + JSON.stringify(TransformConfig))
            }
            else {
                logger.info("No Transform Template found");
                return errorResponder({ message: "No Transform Template found " }, request, response);
            }
            logger.info("Transform Config : ", TransformConfig);
            const url = config.host.filestore + config.paths.filestore + `/url?tenantId=${request?.body?.RequestInfo?.userInfo?.tenantId}&fileStoreIds=${fileStoreId}`;
            logger.info("File fetching url : " + url)
            const updatedDatas: any = await getSheetData(url, selectedRows, TransformConfig?.data?.Fields, TransformConfig?.data?.sheetName);
            logger.info("Updated Datas : " + JSON.stringify(updatedDatas))
            // After processing all mdms elements, send the response
            return sendResponse(response, { updatedDatas }, request);
        }
        catch (e: any) {
            return errorResponder({ message: e?.response?.data?.Errors[0].message }, request, response);
        }
    };


    process = async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            const { data, parsingTemplate } = request?.body?.HCMConfig;
            const parsingResults: any = await searchMDMS([parsingTemplate], config.values.parsingTemplate, request.body.RequestInfo, response);
            const parsingConfig = parsingResults?.mdms?.[0]?.data?.path;
            logger.info("Parsing Config : " + JSON.stringify(parsingConfig))

            // Check if data is an array before using map
            var updatedDatas: any[] = [];
            if (Array.isArray(data)) {
                updatedDatas = data.map((element) =>
                    convertObjectForMeasurment(element, parsingConfig)
                );
            }
            // Create a set of unique keys
            const groupedData: any[] = [];
            if (parsingConfig.some((configItem: any) => configItem.unique)) {
                const uniqueKeys = new Set<string>();

                // Iterate through updatedDatas and group based on unique keys
                updatedDatas.forEach((data) => {
                    const uniqueValues = parsingConfig
                        .filter((configItem: any) => configItem.unique)
                        .map((configItem: any) => data[configItem.path])
                        .join('!|!');

                    const existingIndex = groupedData.findIndex((group) => uniqueKeys.has(uniqueValues));

                    if (existingIndex !== -1) {
                        // Update consolidated fields
                        parsingConfig.forEach((configItem: any) => {
                            if (configItem.isConsolidate) {
                                const currentValue = groupedData[existingIndex][configItem.path];
                                const newValue = data[configItem.path];
                                // Consolidate based on data type
                                if (typeof currentValue === 'number' && typeof newValue === 'number') {
                                    groupedData[existingIndex][configItem.path] = currentValue + newValue;
                                } else if (typeof currentValue === 'string' && typeof newValue === 'string') {
                                    groupedData[existingIndex][configItem.path] = currentValue + newValue;
                                } else if (typeof currentValue === 'boolean' && typeof newValue === 'boolean') {
                                    groupedData[existingIndex][configItem.path] = currentValue || newValue;
                                }
                            }
                        });
                    } else {
                        // Add new group
                        uniqueKeys.add(uniqueValues);
                        groupedData.push(data);
                    }
                });
            }
            else {
                // If none have unique as true, skip the unique concept
                groupedData.push(...updatedDatas);
            }
            const uniqueKeys = new Set<string>();

            // Iterate through updatedDatas and group based on unique keys
            updatedDatas.forEach((data) => {
                const uniqueValues = parsingConfig
                    .filter((configItem: any) => configItem.unique)
                    .map((configItem: any) => data[configItem.path])
                    .join('!|!');

                const existingIndex = groupedData.findIndex((group) => uniqueKeys.has(uniqueValues));

                if (existingIndex !== -1) {
                    // Update consolidated fields
                    parsingConfig.forEach((configItem: any) => {
                        if (configItem.isConsolidate) {
                            const currentValue = groupedData[existingIndex][configItem.path];
                            const newValue = data[configItem.path];
                            // Consolidate based on data type
                            if (typeof currentValue === 'number' && typeof newValue === 'number') {
                                groupedData[existingIndex][configItem.path] = currentValue + newValue;
                            } else if (typeof currentValue === 'string' && typeof newValue === 'string') {
                                groupedData[existingIndex][configItem.path] = currentValue + newValue;
                            } else if (typeof currentValue === 'boolean' && typeof newValue === 'boolean') {
                                groupedData[existingIndex][configItem.path] = currentValue || newValue;
                            }
                        }
                    });
                } else {
                    // Add new group
                    uniqueKeys.add(uniqueValues);
                    groupedData.push(data);
                }
            });

            logger.info("Grouped Data : " + JSON.stringify(groupedData));

            return sendResponse(response, { updatedDatas: groupedData }, request);
        } catch (e: any) {
            logger.error("Error : " + JSON.stringify(e));
            return errorResponder({ message: e?.response?.data?.Errors[0].message }, request, response);
        }
    };

}

// Export the MeasurementController class
export default TransformController;
