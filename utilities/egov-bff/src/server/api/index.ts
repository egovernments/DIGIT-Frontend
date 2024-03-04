import { getErrorCodes } from "../config";
import * as XLSX from 'xlsx';
import config from "../config";
import hashSum from 'hash-sum';
import FormData from 'form-data';
import { v4 as uuidv4 } from 'uuid';
import { httpRequest } from "../utils/request";
import { logger } from "../utils/logger";
import axios from "axios";
import { correctParentValues, generateActivityMessage, generateResourceMessage, matchWithCreatedDetails, sortCampaignDetails } from "../utils/index";
import { validateProjectFacilityResponse, validateProjectResourceResponse, validateStaffResponse, validatedProjectResponseAndUpdateId } from "../utils/validator";
const jp = require("jsonpath");
const _ = require('lodash');


function processColumnValue(
  col: any,
  row: any[]
): any {
  // Handle double-digit columns like 'AA', 'AB', etc.
  const colIndex = XLSX.utils.decode_col(col);
  return (row as any[])[colIndex];
}

function convertToFieldType(value: any, fieldType: string): any {
  switch (fieldType) {
    case 'number':
      return Number(value);
    case 'string':
      return String(value);
    case 'boolean':
      return Boolean(value);
    // Add more cases for other types as needed
    default:
      return value;
  }
}

function processExcelSheet(
  desiredSheet: XLSX.WorkSheet,
  startRow: number,
  endRow: number,
  config: any,
  rowDatas: any[] = []
) {
  const sheetRef = desiredSheet['!ref'];
  const endRowMin = Math.min(XLSX.utils.decode_range(String(desiredSheet['!ref'])).e.r + 1, endRow);
  const lastColumn = sheetRef ? XLSX.utils.decode_range(sheetRef).e.c : 0;

  const range = { s: { r: startRow - 1, c: 0 }, e: { r: endRowMin - 1, c: lastColumn } };

  const rowDataArray: any[] = XLSX.utils.sheet_to_json(desiredSheet, { header: 1, range });

  for (let rowIndex = 0; rowIndex < rowDataArray.length; rowIndex++) {
    // Explicitly define the type for row as an array of any
    const row: any[] = rowDataArray[rowIndex];

    const rowData: any = {};
    rowData['#row!number#'] = startRow + rowIndex;
    // if in row array any element equals to #skip!skip# make skipValue = true
    if (row.includes('#skip!skip#')) {
      logger.info("Row " + (startRow + rowIndex) + " is empty.");
      continue;
    }
    logger.info(JSON.stringify(row) + " Row data for row " + (startRow + rowIndex));


    for (const fieldConfig of config || []) {
      if (fieldConfig.format === 'GENERATE_HASH') {
        const valuesToHash: any[] = (fieldConfig.column as any[]).map((col: any) =>
          processColumnValue(col, row)
        );
        logger.info("Values To Hash : " + JSON.stringify(valuesToHash));

        // Generate a hash using hash-sum of the extracted values
        const generatedCode = "h" + hashSum(valuesToHash);
        rowData[fieldConfig.title] = convertToFieldType(generatedCode, typeof fieldConfig.default);
        fieldConfig.default = rowData[fieldConfig.title];
      } else if (fieldConfig.format === 'AUTO_GENERATE') {
        // Generate a 10-digit phone number starting with 8 or 9
        const generatedPhoneNumber = '8' + Math.floor(100000000 + Math.random() * 900000000).toString();
        rowData[fieldConfig.title] = convertToFieldType(generatedPhoneNumber, typeof fieldConfig.default);
        fieldConfig.default = rowData[fieldConfig.title];
      } else {
        const concatValue = (fieldConfig.column as any[]).map((col: any) =>
          processColumnValue(col, row)
        ).join('');
        logger.info("Concat Value : " + concatValue);

        if (concatValue) {
          rowData[fieldConfig.title] = convertToFieldType(concatValue, typeof fieldConfig.default);
          fieldConfig.default = rowData[fieldConfig.title];
        } else {
          rowData[fieldConfig.title] = fieldConfig.default;
          if (!rowData[fieldConfig.title]) {
            rowData[fieldConfig.title] = convertToFieldType("", typeof fieldConfig.default);
          }
        }

        if (fieldConfig.conditions) {
          for (const condition of fieldConfig.conditions) {
            if (rowData[fieldConfig.title] == condition.from) {
              rowData[fieldConfig.title] = convertToFieldType(condition.to, typeof fieldConfig.default);
              if (!rowData[fieldConfig.title]) {
                rowData[fieldConfig.title] = convertToFieldType("", typeof fieldConfig.default);
              }
            }
          }
        }
      }
    }

    //if any key value pair have value as '#skip!skip#' in rowData then dont push that row
    if (Object.values(rowData).some((value) => value === '#skip!skip#')) {
      continue;
    }
    rowDatas.push(rowData);
  }
}



async function getWorkbook(fileUrl: string) {

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/pdf',
  };

  logger.info("FileUrl : " + fileUrl);

  const responseFile = await httpRequest(fileUrl, null, {}, 'get', 'arraybuffer', headers);

  // Convert ArrayBuffer directly to Buffer
  const fileBuffer = Buffer.from(responseFile);

  // Assuming the response is a binary file, adjust the type accordingly
  const fileXlsx = fileBuffer;

  const arrayBuffer = await fileXlsx.buffer.slice(fileXlsx.byteOffset, fileXlsx.byteOffset + fileXlsx.length);
  const data = new Uint8Array(arrayBuffer);
  const workbook = XLSX.read(data, { type: 'array' });

  return workbook;

}


const getSheetData = async (
  fileUrl: string,
  selectedRows: any[],
  config?: any,
  sheetName?: string
) => {
  try {
    const response = await httpRequest(fileUrl, undefined, undefined, 'get');
    if (response?.fileStoreIds.length === 0) {
      throw new Error("File store Id invalid");
    }
    //  return "";
    const rowDatas: any[] = [];
    for (const file of response.fileStoreIds) {
      try {
        const workbook = await getWorkbook(file.url);

        let desiredSheet = workbook.Sheets[sheetName || workbook.SheetNames[0]];

        if (!desiredSheet) {
          logger.info(`Sheet "${sheetName}" not found in the workbook.`);
          return getErrorCodes("WORKS", "NO_SHEETNAME_FOUND");
        }

        for (const selectedRow of selectedRows) {
          // Create a copy of the original sheet to modify
          const modifiedSheet: any = { ...desiredSheet };

          // Fill empty column values with the previous row's values
          fillEmptyColumns(modifiedSheet, config);

          // Process the modified sheet
          processExcelSheet(modifiedSheet, selectedRow.startRow, selectedRow.endRow, config, rowDatas);
        }

      } catch (error) {
        logger.error('Error fetching or processing file: ' + error);
      }
    }
    logger.info("RowDatas : " + JSON.stringify(rowDatas))
    return rowDatas;
  }
  catch (error: any) {
    logger.error('Error:', error.message); // Log the error message
    return { success: false, error: error.message }; // Return error response with message
  }
};

const fillEmptyColumns = (sheet: XLSX.WorkSheet, config: any[]) => {
  var columnsAll: any[] = config.reduce((acc, element) => {
    if (element.hasOwnProperty('column')) {
      for (const c of element.column) {
        acc.push(c);
      }
    }
    return acc;
  }, []);

  // Use Set to remove duplicates and convert it back to an array using Array.from

  const columns: any[] = Array.from(new Set(columnsAll));
  const normalizedColumns: any[] = columns.map(colName => XLSX.utils.decode_col(colName));
  logger.info("NormalizedColumns : " + JSON.stringify(normalizedColumns))

  // Get the actual range of used cells in the sheet
  const usedRange = XLSX.utils.decode_range(String(sheet['!ref']));

  // Track skipped rows to avoid overwriting
  const skippedRows: Set<number> = new Set();

  // Iterate over each row
  for (let row = usedRange.s.r; row <= usedRange.e.r; row++) {

    // Check if the current row is already marked as skipped
    if (skippedRows.has(row)) {
      continue;
    }

    var allColumnsEmpty = true;
    for (const col of normalizedColumns) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cellValue = sheet[cellAddress]?.v;
      if (cellValue !== undefined && cellValue !== null && cellValue !== '') {
        allColumnsEmpty = false;
        break;
      }
    }
    if (allColumnsEmpty) {
      skippedRows.add(row);
      for (const col of normalizedColumns) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        const cellValue = '#skip!skip#';
        sheet[cellAddress] = { t: 's', v: cellValue, w: cellValue };
      }
    }
  }

  for (let col = usedRange.s.c; col <= usedRange.e.c; col++) {
    let previousValue: any = null;

    for (let row = usedRange.s.r; row <= usedRange.e.r; row++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cellValue = sheet[cellAddress]?.v;

      if (cellValue !== undefined && cellValue !== null && cellValue !== '') {
        previousValue = cellValue;
      } else if (previousValue !== null) {
        // Fill empty cell with the previous row's value
        sheet[cellAddress] = { t: 's', v: previousValue, w: String(previousValue) };
      }
    }
  }
};



const searchMDMS: any = async (uniqueIdentifiers: any[], schemaCode: string, requestinfo: any, response: any) => {
  if (!uniqueIdentifiers) {
    return;
  }
  const apiUrl = config.host.mdms + config.paths.mdms_search;
  logger.info("Mdms url : " + apiUrl)
  const data = {
    "MdmsCriteria": {
      "tenantId": requestinfo?.userInfo?.tenantId,
      "uniqueIdentifiers": uniqueIdentifiers,
      "schemaCode": schemaCode
    },
    "RequestInfo": requestinfo
  }
  try {
    const result = await httpRequest(apiUrl, data, undefined, undefined, undefined, undefined);
    logger.info("Template search Result : " + JSON.stringify(result))
    return result;
  } catch (error: any) {
    logger.error("Error: " + error)
    return error?.response?.data?.Errors[0].message;
  }

}


const getCampaignNumber: any = async (requestBody: any, idFormat: String, idName: string) => {
  const data = {
    RequestInfo: requestBody?.RequestInfo,
    "idRequests": [
      {
        "idName": idName,
        "tenantId": requestBody?.HCMConfig?.tenantId,
        "format": idFormat
      }
    ]
  }
  const idGenUrl = config.host.idGenHost + config.paths.idGen;
  logger.info("IdGen url : " + idGenUrl)
  logger.info("Idgen Request : " + JSON.stringify(data))
  try {
    const result = await httpRequest(idGenUrl, data, undefined, undefined, undefined, undefined);
    if (result?.idResponses?.[0]?.id) {
      return result?.idResponses?.[0]?.id;
    }
    return result;
  } catch (error: any) {
    logger.error("Error: " + error)
    return error;
  }

}

const getCampaignNumberForCampaignController: any = async (requestBody: any, idFormat: String, idName: string) => {
  const data = {
    RequestInfo: requestBody?.RequestInfo,
    "idRequests": [
      {
        "idName": idName,
        "tenantId": requestBody?.Campaign?.tenantId,
        "format": idFormat
      }
    ]
  }
  const idGenUrl = config.host.idGenHost + config.paths.idGen;
  logger.info("IdGen url : " + idGenUrl)
  logger.info("Idgen Request : " + JSON.stringify(data))
  try {
    const result = await httpRequest(idGenUrl, data, undefined, undefined, undefined, undefined);
    if (result?.idResponses?.[0]?.id) {
      return result?.idResponses?.[0]?.id;
    }
    return result;
  } catch (error: any) {
    logger.error("Error: " + error)
    return error;
  }

}

const getResouceNumber: any = async (RequestInfo: any, idFormat: String, idName: string) => {
  const data = {
    RequestInfo,
    "idRequests": [
      {
        "idName": idName,
        "tenantId": RequestInfo?.userInfo?.tenantId,
        "format": idFormat
      }
    ]
  }
  const idGenUrl = config.host.idGenHost + config.paths.idGen;
  logger.info("IdGen url : " + idGenUrl)
  logger.info("Idgen Request : " + JSON.stringify(data))
  try {
    const result = await httpRequest(idGenUrl, data, undefined, undefined, undefined, undefined);
    if (result?.idResponses?.[0]?.id) {
      return result?.idResponses?.[0]?.id;
    }
    return result;
  } catch (error: any) {
    logger.error("Error: " + error)
    return error;
  }

}

const getSchema: any = async (code: string, RequestInfo: any) => {
  const data = {
    RequestInfo,
    SchemaDefCriteria: {
      "tenantId": RequestInfo?.userInfo?.tenantId,
      "limit": 200,
      "codes": [
        code
      ]
    }
  }
  const mdmsSearchUrl = config.host.mdms + config.paths.mdmsSchema;
  logger.info("Schema search url : " + mdmsSearchUrl)
  logger.info("Schema search Request : " + JSON.stringify(data))
  try {
    const result = await httpRequest(mdmsSearchUrl, data, undefined, undefined, undefined, undefined);
    return result?.SchemaDefinitions?.[0]?.definition;
  } catch (error: any) {
    logger.error("Error: " + error)
    return error;
  }

}

function matchLength(result: any, existingDataToCheck: any): boolean {
  // Get length of the first element
  const resultLength = Array.isArray(result) ? result.length : (result ? 1 : 0);
  // Get length of the second element
  const existingDataLength = Array.isArray(existingDataToCheck) ? existingDataToCheck.length : (existingDataToCheck ? 1 : 0);
  // Check if lengths match
  return resultLength === existingDataLength;
}

function getAffectedRows(data: any[]): number[] {
  if (!data) return [];
  return data.map(item => item['#row!number#']).filter(rowNumber => !!rowNumber) as number[];
}

const createValidatedData: any = async (result: any, type: string, request: any) => {
  let host = result?.creationDetails?.host;
  const url = result?.creationDetails?.url;
  const creationKey = result?.creationDetails?.keyName
  var retry: number = 0;
  const creationRequest = { RequestInfo: request.RequestInfo };
  var params: any = {};
  _.set(creationRequest, creationKey, result?.data);
  if (result?.creationDetails?.createBody) {
    for (const createItem of result?.creationDetails?.createBody) {
      if (createItem.isInParams) {
        params[createItem.path] = createItem.value;
      }
      if (createItem.isInBody) {
        _.set(creationRequest, createItem.path, createItem.value);
      }
    }
  }
  const retryCount = parseInt(config.values.retryCount)
  let success = false;
  let creationResponse: any = {};
  const affectedRows = getAffectedRows(result?.data);
  while (retry <= retryCount && !success) {
    logger.info("Creation Attempt : " + Number(retry + 1))
    logger.info("Creation Request : " + JSON.stringify(creationRequest))
    logger.info("Creation Params : " + JSON.stringify(params))
    // host = 'http://localhost:8086/'
    logger.info("Creation url : " + host + url);
    await axios.post(`${host}${url}`, creationRequest, params).then(response => {
      // FIXME : need to complete logic
      if (result?.creationDetails?.checkOnlyExistence) {
        if (result?.creationDetails?.matchDataLength) {
          const existingDataToCheck = jp.query(response?.data, result?.creationDetails?.responsePathToCheck);
          if (matchLength(result?.data, existingDataToCheck)) {
            logger.info("Existing Data To Check: " + existingDataToCheck)
            creationResponse = response?.data;
            success = true;
          }
          else {
            logger.error("Number of attempted data not matching with created data.")
            creationResponse = response?.data;
          }
        }
        else {
          const existingDataToCheck = jp.query(response?.data, result?.creationDetails?.responsePathToCheck);
          if (existingDataToCheck) {
            logger.info("Existing Data To Check: " + existingDataToCheck)
            creationResponse = response?.data;
            success = true;
          }
          else {
            logger.error("Existing Data To Check: " + existingDataToCheck)
            creationResponse = response?.data;
          }
        }
      }
      else {
        const existingDataToCheck = jp.query(response?.data, result?.creationDetails?.responsePathToCheck);
        if (existingDataToCheck == result?.creationDetails?.responseToMatch) {
          logger.info("Existing Data To Check: " + existingDataToCheck)
          logger.info("Existing Data Matching.")
          creationResponse = response?.data;
          success = true;
        }
        else {
          logger.error("Existing Data To Check: " + existingDataToCheck)
          logger.error("Existing Data Not Matching.")
          creationResponse = response?.data;
        }
      }
      retry++;
    })
      .catch((error: any) => {
        creationResponse = error?.response?.data;
        logger.error("Error occurred during creation attempt:" + JSON.stringify(error?.response?.data));
        retry++;
      });
  }
  if (success) {
    return { status: "SUCCESS", type: type, url: url, requestPayload: creationRequest, responsePayload: creationResponse, retryCount: retry - 1, affectedRows: affectedRows }
  }
  return { status: "FAILED", type: type, url: url, requestPayload: creationRequest, responsePayload: creationResponse, retryCount: retry - 1, affectedRows: affectedRows }
}

const getCount: any = async (responseData: any, request: any, response: any) => {
  try {
    const host = responseData?.host;
    const url = responseData?.searchConfig?.countUrl;
    const requestInfo = { "RequestInfo": request?.body?.RequestInfo }
    const result = await httpRequest(host + url, requestInfo, undefined, undefined, undefined, undefined);
    const count = _.get(result, responseData?.searchConfig?.countPath);
    return count;
  } catch (error: any) {
    logger.error("Error: " + error)
    throw error;
  }

}

async function createAndUploadFile(updatedWorkbook: XLSX.WorkBook, request: any) {
  const buffer = XLSX.write(updatedWorkbook, { bookType: 'xlsx', type: 'buffer' });
  const formData = new FormData();
  formData.append('file', buffer, 'filename.xlsx');
  formData.append('tenantId', request?.body?.RequestInfo?.userInfo?.tenantId);
  formData.append('module', 'pgr');

  logger.info("File uploading url : " + config.host.filestore + config.paths.filestore);
  var fileCreationResult = await httpRequest(config.host.filestore + config.paths.filestore, formData, undefined, undefined, undefined,
    {
      'Content-Type': 'multipart/form-data',
      'auth-token': request?.body?.RequestInfo?.authToken
    }
  );
  const responseData = fileCreationResult?.files;
  return responseData;
}

function generateHierarchyList(data: any[], parentChain: any = []) {
  let result: any[] = [];

  // Iterate over each boundary in the current level
  for (let boundary of data) {
    let currentChain = [...parentChain, boundary.code];

    // Add the current chain to the result
    result.push(currentChain.join(','));

    // If there are children, recursively call the function
    if (boundary.children.length > 0) {
      let childResults = generateHierarchyList(boundary.children, currentChain);
      result = result.concat(childResults);
    }
  }
  return result;
}

function generateHierarchy(boundaries: any[]) {
  // Create an object to store boundary types and their parents
  const parentMap: any = {};

  // Populate the object with boundary types and their parents
  for (const boundary of boundaries) {
    parentMap[boundary.boundaryType] = boundary.parentBoundaryType;
  }

  // Traverse the hierarchy to generate the hierarchy list
  const hierarchyList = [];
  for (const boundaryType in parentMap) {
    if (Object.prototype.hasOwnProperty.call(parentMap, boundaryType)) {
      const parentBoundaryType = parentMap[boundaryType];
      if (parentBoundaryType === null) {
        // This boundary type has no parent, add it to the hierarchy list
        hierarchyList.push(boundaryType);
        // Traverse its children recursively
        traverseChildren(boundaryType, parentMap, hierarchyList);
      }
    }
  }
  return hierarchyList;
}

function traverseChildren(parent: any, parentMap: any, hierarchyList: any[]) {
  for (const boundaryType in parentMap) {
    if (Object.prototype.hasOwnProperty.call(parentMap, boundaryType)) {
      const parentBoundaryType = parentMap[boundaryType];
      if (parentBoundaryType === parent) {
        // This boundary type has the current parent, add it to the hierarchy list
        hierarchyList.push(boundaryType);
        // Traverse its children recursively
        traverseChildren(boundaryType, parentMap, hierarchyList);
      }
    }
  }
}

const getHierarchy = async (hierarchyType: any, tenantId: any, request: any) => {
  const url = `${config.host.boundaryHost}${config.paths.boundaryHierarchy}`;

  // Create request body
  const requestBody = {
    "RequestInfo": request?.body?.RequestInfo,
    "BoundaryTypeHierarchySearchCriteria": {
      "tenantId": tenantId,
      "limit": 5,
      "offset": 0,
      "hierarchyType": hierarchyType
    }
  };

  try {
    const response = await httpRequest(url, requestBody);
    const boundaryList = response?.BoundaryHierarchy?.[0].boundaryHierarchy;
    return generateHierarchy(boundaryList);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};



async function createExcelSheet(data: any, headers: any) {
  const workbook = XLSX.utils.book_new();
  const sheetName = 'Sheet1';
  const sheetData = [headers, ...data];
  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  XLSX.utils.book_append_sheet(workbook, ws, sheetName);
  return { wb: workbook, ws: ws, sheetName: sheetName }
}

async function getBoundarySheetData(hierarchyType: any, tenantId: any, request: any) {
  const url = `${config.host.boundaryHost}${config.paths.boundaryRelationship}`;
  const params = {
    "tenantId": tenantId,
    "hierarchyType": hierarchyType,
    "includeChildren": true
  }
  const response = await httpRequest(url, request.body, params);
  if (response?.TenantBoundary?.[0]?.boundary) {
    const boundaryList = generateHierarchyList(response?.TenantBoundary?.[0]?.boundary)
    if (Array.isArray(boundaryList) && boundaryList.length > 0) {

      const boundaryCodes = boundaryList.map(boundary => boundary.split(',').pop());
      const string = boundaryCodes.join(', ');
      const boundaryResponse = await httpRequest('http://localhost:8087/boundary-service/boundary/_search', request.body, { tenantId: "pg", codes: string });

      const mp: { [key: string]: string } = {};
      boundaryResponse?.Boundary?.forEach((data: any) => {
        mp[data?.code] = data?.additionalDetails?.name;
      });

      const hierarchy = await getHierarchy(hierarchyType, tenantId, request);
      const headers = [...hierarchy, "Boundary Code", "Target at the Selected Boundary level", "Start Date of Campaign (Optional Field)", "End Date of Campaign (Optional Field)"];
      const data = boundaryList.map(boundary => {
        const boundaryParts = boundary.split(',');
        const boundaryCode = boundaryParts[boundaryParts.length - 1];
        const rowData = boundaryParts.concat(Array(Math.max(0, hierarchy.length - boundaryParts.length)).fill(''));
        const mappedRowData = rowData.map((cell: any, index: number) =>
          index === hierarchy.length ? '' : cell !== '' ? mp[cell] || cell : ''
        );
        const boundaryCodeIndex = hierarchy.length;
        mappedRowData[boundaryCodeIndex] = boundaryCode;
        return mappedRowData;
      });
      return await createExcelSheet(data, headers);
    }
  }
  return { wb: null, ws: null, sheetName: null }; // Return null if no data found
}




async function updateFile(fileStoreId: any, finalResponse: any, sheetName: any, request: any) {
  try {
    const fileUrl = `${config.host.filestore}${config.paths.filestore}/url?tenantId=${request?.body?.RequestInfo?.userInfo?.tenantId}&fileStoreIds=${fileStoreId}`;
    const response = await httpRequest(fileUrl, undefined, undefined, 'get');

    if (response?.fileStoreIds.length === 0) {
      throw new Error("No file found with the provided file store ID");
    }

    for (const file of response.fileStoreIds) {
      try {
        const workbook = await getWorkbook(file.url);
        const desiredSheet: any = workbook.Sheets[sheetName || workbook.SheetNames[0]];

        if (desiredSheet) {
          const range = XLSX.utils.decode_range(desiredSheet['!ref']);
          const emptyColumnIndex = range.e.c + 1;
          const statusColumn = String.fromCharCode(65 + emptyColumnIndex); // Get next column letter

          // Add header for status column
          desiredSheet[statusColumn + '1'] = { v: '#status#', t: 's', r: '<t xml:space="preserve">#status#</t>', h: '#status#', w: '#status#' };

          // Populate status values for affected rows
          const activities = finalResponse?.Activities || [];
          activities.forEach((activity: any) => {
            activity.affectedRows.forEach((row: any) => {
              const rowIndex = row - 1; // Adjust for zero-based 
              desiredSheet[statusColumn + (rowIndex + 1)] = { v: activity.status, t: 's', r: `<t xml:space="preserve">${activity.status}</t>`, h: activity.status, w: activity.status }; // Adjust row index and add status value
            });
          });

          // Update range
          desiredSheet['!ref'] = desiredSheet['!ref'].replace(/:[A-Z]+/, ':' + statusColumn);
          workbook.Sheets[sheetName] = desiredSheet;

          // Call the function to create and upload the file with the updated sheet
          const responseData = await createAndUploadFile(workbook, request);
          logger.info('File updated successfully:' + JSON.stringify(responseData));
          if (responseData?.[0]?.fileStoreId) {
            const statusFileStoreId = responseData?.[0]?.fileStoreId;

            // Update finalResponse.ResponseDetails with statusFileStoreId
            finalResponse.ResponseDetails.forEach((detail: any) => {
              detail.statusFileStoreId = statusFileStoreId;
            });
          }
          else {
            throw new Error("Error in Creatring Status File");
          }

        }

      } catch (error) {
        logger.error('Error processing file:' + error);
      }
    }
  } catch (error) {
    logger.error('Error fetching file information:' + JSON.stringify(error));
  }
}











const processCreateData: any = async (result: any, type: string, request: any, response: any) => {
  var finalResponse: any = { ResponseDetails: [], Activities: [] };
  if (result?.creationDetails?.isBulkCreate) {
    if (result?.creationDetails?.creationLimit) {
      let currentIndex = 0;
      while (currentIndex < result?.data?.length) {
        const creationTime = Date.now();
        let batchResult = JSON.parse(JSON.stringify(result));
        batchResult.data = result?.data?.slice(currentIndex, currentIndex + result?.creationDetails?.creationLimit);
        const createdResult = await createValidatedData(batchResult, type, request.body)
        logger.info(type + " creation result : " + JSON.stringify(createdResult))
        if (createdResult?.status == "SUCCESS") {
          var successMessage: any = await generateResourceMessage(request.body, "COMPLETED")
          const activityMessage: any = await generateActivityMessage(createdResult, successMessage, request.body, "COMPLETED")
          const activities: any = { activities: [activityMessage] }
          logger.info("Activity Message : " + JSON.stringify(activities))
          logger.info("Success Message : " + JSON.stringify(successMessage))
          successMessage.batchNumber = currentIndex / result?.creationDetails?.creationLimit + 1;
          successMessage = await matchWithCreatedDetails(request, response, successMessage, creationTime, batchResult?.data?.length);
          finalResponse.Activities.push(activityMessage);
          finalResponse.ResponseDetails.push(successMessage);
        }
        else {
          var failedMessage: any = await generateResourceMessage(request.body, "FAILED")
          const activityMessage: any = await generateActivityMessage(createdResult, failedMessage, request.body, "FAILED")
          const activities: any = { activities: [activityMessage] }
          logger.info("Activity Message : " + JSON.stringify(activities))
          logger.info("Failed Message : " + JSON.stringify(failedMessage))
          failedMessage.error = createdResult?.responsePayload?.Errors || "Some error occured. Check logs"
          failedMessage.batchNumber = currentIndex / result?.creationDetails?.creationLimit + 1;
          finalResponse.Activities.push(activityMessage);
          finalResponse.ResponseDetails.push(failedMessage);
        }
        currentIndex += result?.creationDetails?.creationLimit;
      }
      return finalResponse;
    }
    else {
      const creationTime = Date.now();
      const createdResult = await createValidatedData(result, type, request.body)
      logger.info(type + " creation result : " + createdResult)
      if (createdResult?.status == "SUCCESS") {
        var successMessage: any = await generateResourceMessage(request.body, "COMPLETED")
        const activityMessage: any = await generateActivityMessage(createdResult, successMessage, request.body, "COMPLETED")
        const activities: any = { activities: [activityMessage] }
        logger.info("Activity Message : " + JSON.stringify(activities));
        logger.info("Success Message : " + JSON.stringify(successMessage))
        successMessage = await matchWithCreatedDetails(request, response, successMessage, creationTime, result?.data?.length);
        finalResponse.Activities.push(activityMessage);
        finalResponse.ResponseDetails.push(successMessage);
        return finalResponse;
      }
      else {
        const failedMessage: any = await generateResourceMessage(request.body, "FAILED")
        const activityMessage: any = await generateActivityMessage(createdResult, failedMessage, request.body, "FAILED")
        const activities: any = { activities: [activityMessage] }
        logger.info("Activity Message : " + JSON.stringify(activities))
        logger.info("Success Message : " + JSON.stringify(failedMessage))
        finalResponse.Activities.push(activityMessage);
        finalResponse.ResponseDetails.push(createdResult?.responsePayload?.Errors || "Some error occured during creation. Check Logs")
        return finalResponse;
      }
    }
  }
  else {
    for (let currentIndex = 0; currentIndex < result?.data?.length; currentIndex++) {
      let batchResult = JSON.parse(JSON.stringify(result));
      batchResult.data = result?.data?.[currentIndex];
      const createdResult = await createValidatedData(batchResult, type, request.body)
      logger.info(type + " creation result : " + createdResult)
      if (createdResult?.status == "SUCCESS") {
        const successMessage: any = await generateResourceMessage(request.body, "COMPLETED")
        const activityMessage: any = await generateActivityMessage(createdResult, successMessage, request.body, "COMPLETED")
        const activities: any = { activities: [activityMessage] }
        logger.info("Activity Message : " + JSON.stringify(activities))
        logger.info("Success Message : " + JSON.stringify(successMessage))
        finalResponse.Activities.push(activityMessage);
        finalResponse.ResponseDetails.push(successMessage);
      }
      else {
        const failedMessage: any = await generateResourceMessage(request.body, "FAILED")
        const activityMessage: any = await generateActivityMessage(createdResult, failedMessage, request.body, "FAILED")
        const activities: any = { activities: [activityMessage] }
        logger.info("Activity Message : " + JSON.stringify(activities))
        logger.info("Success Message : " + JSON.stringify(failedMessage))
        failedMessage.error = createdResult?.responsePayload?.Errors || "Some error occured. Check logs"
        finalResponse.Activities.push(activityMessage);
        finalResponse.ResponseDetails.push(failedMessage);
      }
    }
    return finalResponse;
  }
}

async function createProjectAndUpdateId(projectBody: any, boundaryProjectIdMapping: any, boundaryCode: any, campaignDetails: any) {
  const projectCreateUrl = `${config.host.projectHost}` + `${config.paths.projectCreate}`
  logger.info("Project Creation url " + projectCreateUrl)
  logger.info("Project Creation body " + JSON.stringify(projectBody))
  const projectResponse = await httpRequest(projectCreateUrl, projectBody, undefined, "post", undefined, undefined);
  logger.info("Project Creation response" + JSON.stringify(projectResponse))
  validatedProjectResponseAndUpdateId(projectResponse, projectBody, campaignDetails);
  boundaryProjectIdMapping[boundaryCode] = projectResponse?.Project[0]?.id
  await new Promise(resolve => setTimeout(resolve, 10000));
}

async function createProjectIfNotExists(requestBody: any) {
  const { projectType, tenantId } = requestBody?.Campaign
  sortCampaignDetails(requestBody?.Campaign?.CampaignDetails)
  correctParentValues(requestBody?.Campaign?.CampaignDetails)
  var boundaryProjectIdMapping: any = {};
  for (const campaignDetails of requestBody?.Campaign?.CampaignDetails) {
    const projectBody: any = {
      RequestInfo: requestBody.RequestInfo,
      Projects: []
    }
    var { projectId, startDate, endDate, boundaryCode, boundaryType, parentBoundaryCode, description, department, referenceID, projectSubType, isTaskEnabled = true, documents = [], rowVersion = 0 } = campaignDetails;
    const address = {
      tenantId,
      boundary: boundaryCode,
      boundaryType
    }
    startDate = parseInt(startDate);
    endDate = parseInt(endDate);
    if (!projectId) {
      projectBody.Projects.push({
        tenantId, parent: boundaryProjectIdMapping[parentBoundaryCode] || null, address, description, department, referenceID, projectSubType, projectType, startDate, endDate, isTaskEnabled, documents, rowVersion
      })
      await createProjectAndUpdateId(projectBody, boundaryProjectIdMapping, boundaryCode, campaignDetails)
    }
  }
}

async function createStaff(resouceBody: any) {
  const staffCreateUrl = `${config.host.projectHost}` + `${config.paths.staffCreate}`
  logger.info("Staff Creation url " + staffCreateUrl)
  logger.info("Staff Creation body " + JSON.stringify(resouceBody))
  const staffResponse = await httpRequest(staffCreateUrl, resouceBody, undefined, "post", undefined, undefined);
  logger.info("Staff Creation response" + JSON.stringify(staffResponse))
  validateStaffResponse(staffResponse);
}

async function createProjectResource(resouceBody: any) {
  const projectResourceCreateUrl = `${config.host.projectHost}` + `${config.paths.projectResourceCreate}`
  logger.info("Project Resource Creation url " + projectResourceCreateUrl)
  logger.info("Project Resource Creation body " + JSON.stringify(resouceBody))
  const projectResourceResponse = await httpRequest(projectResourceCreateUrl, resouceBody, undefined, "post", undefined, undefined);
  logger.info("Project Resource Creation response" + JSON.stringify(projectResourceResponse))
  validateProjectResourceResponse(projectResourceResponse);
}

async function createProjectFacility(resouceBody: any) {
  const projectFacilityCreateUrl = `${config.host.projectHost}` + `${config.paths.projectFacilityCreate}`
  logger.info("Project Facility Creation url " + projectFacilityCreateUrl)
  logger.info("Project Facility Creation body " + JSON.stringify(resouceBody))
  const projectFacilityResponse = await httpRequest(projectFacilityCreateUrl, resouceBody, undefined, "post", undefined, undefined);
  logger.info("Project Facility Creation response" + JSON.stringify(projectFacilityResponse))
  validateProjectFacilityResponse(projectFacilityResponse);
}
async function createRelatedEntity(resources: any, tenantId: any, projectId: any, startDate: any, endDate: any, resouceBody: any) {
  for (const resource of resources) {
    const type = resource?.type
    for (const resourceId of resource?.resourceIds) {
      if (type == "staff") {
        const ProjectStaff = {
          // FIXME : Tenant Id should not be splitted
          tenantId: tenantId.split('.')?.[0],
          projectId,
          userId: resourceId,
          startDate,
          endDate
        }
        resouceBody.ProjectStaff = ProjectStaff
        await createStaff(resouceBody)
      }
      else if (type == "resource") {
        const ProjectResource = {
          // FIXME : Tenant Id should not be splitted
          tenantId: tenantId.split('.')?.[0],
          projectId,
          resource: {
            productVariantId: resourceId,
            type: "DRUG",
            "isBaseUnitVariant": false
          },
          startDate,
          endDate
        }
        resouceBody.ProjectResource = ProjectResource
        await createProjectResource(resouceBody)
      }
      else if (type == "facility") {
        const ProjectFacility = {
          // FIXME : Tenant Id should not be splitted
          tenantId: tenantId.split('.')?.[0],
          projectId,
          facilityId: resourceId
        }
        resouceBody.ProjectFacility = ProjectFacility
        await createProjectFacility(resouceBody)
      }
    }
  }
}

async function createRelatedResouce(requestBody: any) {
  const { tenantId } = requestBody?.Campaign

  for (const campaignDetails of requestBody?.Campaign?.CampaignDetails) {
    const resouceBody: any = {
      RequestInfo: requestBody.RequestInfo,
    }
    var { projectId, startDate, endDate, resources } = campaignDetails;
    startDate = parseInt(startDate);
    endDate = parseInt(endDate);
    await createRelatedEntity(resources, tenantId, projectId, startDate, endDate, resouceBody);
  }
}

async function enrichCampaign(requestBody: any) {
  if (requestBody?.Campaign) {
    requestBody.Campaign.id = uuidv4();
    requestBody.Campaign.campaignNo = await getCampaignNumberForCampaignController(requestBody, "CMP-[cy:yyyy-MM-dd]-[SEQ_EG_CMP_ID]", "campaign.number")
    for (const campaignDetails of requestBody?.Campaign?.CampaignDetails) {
      campaignDetails.id = uuidv4();
    }
  }
}


export {
  getSheetData,
  searchMDMS,
  getCampaignNumber,
  getSchema,
  createValidatedData,
  getResouceNumber,
  getCount,
  processCreateData,
  updateFile,
  getBoundarySheetData,
  createAndUploadFile,
  createProjectIfNotExists,
  createRelatedResouce,
  enrichCampaign
};