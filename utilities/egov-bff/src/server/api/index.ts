import { getErrorCodes } from "../config";
import * as XLSX from 'xlsx';
import config from "../config";
import hashSum from 'hash-sum';

import { httpRequest } from "../utils/request";
import { logger } from "../utils/logger";
import axios from "axios";


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


const getCampaignNumber: any = async (RequestInfo: any, idFormat: String, idName: string) => {
  const data = {
    RequestInfo,
    "idRequests": [
      {
        "idName": idName,
        "tenantId": RequestInfo?.HCMConfig?.tenantId,
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
    if (result?.SchemaDefinitions?.[0]?.definition) {
      return result?.SchemaDefinitions?.[0]?.definition;
    }
    return result;
  } catch (error: any) {
    logger.error("Error: " + error)
    return error;
  }

}

const createValidatedData: any = async (result: any, type: string, request: any, response: any) => {
  const url = result?.url;
  const isBulkCreate = result?.isBulkCreate;
  const creationKey = result?.keyName
  if (isBulkCreate) {
    var retry: number = 0;
    const creationRequest = { RequestInfo: request.RequestInfo, [creationKey]: result?.data };
    const retryCount = parseInt(config.values.retryCount)
    let success = false;
    let creationResponse: any = {};
    while (retry <= retryCount && !success) {
      logger.info("Creation Attempt : " + retry + 1)
      logger.info("Creation Request : " + JSON.stringify(creationRequest))
      logger.info("Creation url : " + config.host.facilityHost + url);
      await axios.post(`${config.host.facilityHost}${url}`, creationRequest).then(response => {
        if (response?.data?.status == "successful") {
          creationResponse = response?.data;
          success = true;
        }
        retry++;
      })
        .catch(error => {
          creationResponse = error?.response?.data;
          logger.error("Error occurred during creation attempt:" + JSON.stringify(error?.response?.data));
          retry++;
        });
    }
    if (success) {
      return { status: "SUCCESS", type: type, url: url, requestPayload: creationRequest, responsePayload: creationResponse, retryCount: retry - 1 }
    }
    return { status: "FAILED", type: type, url: url, requestPayload: creationRequest, responsePayload: creationResponse, retryCount: retry - 1 }
  }
  else {
    return { status: "NOT_ATTEMPTED", type: type, url: url, requestPayload: null, responsePayload: null, retryCount: 0 }
  }
}


export {
  getSheetData,
  searchMDMS,
  getCampaignNumber,
  getSchema,
  createValidatedData,
  getResouceNumber
};