import { getErrorCodes } from "../config";
import * as XLSX from 'xlsx';
import config from "../config";
import hashSum from 'hash-sum';

import { httpRequest } from "../utils/request";
import { logger } from "../utils/logger";


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
  const lastColumn = sheetRef ? XLSX.utils.decode_range(sheetRef).e.c : 0;

  const range = { s: { r: startRow - 1, c: 0 }, e: { r: endRow - 1, c: lastColumn } };

  const rowDataArray: any[] = XLSX.utils.sheet_to_json(desiredSheet, { header: 1, range });

  for (const element of rowDataArray) {
    // Explicitly define the type for row as an array of any
    const row: any[] = element;

    const rowData: any = {};

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
          const modifiedSheet = { ...desiredSheet };

          // Fill empty column values with the previous row's values
          fillEmptyColumns(modifiedSheet);

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

const fillEmptyColumns = (sheet: XLSX.WorkSheet) => {
  const range = XLSX.utils.decode_range(String(sheet['!ref']));
  const lastColumn = range.e.c;
  const lastRow = range.e.r;

  for (let col = range.s.c; col <= lastColumn; col++) {
    let previousValue: any = null;

    for (let row = range.s.r; row <= lastRow; row++) {
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


export {
  getSheetData,
  searchMDMS,
  getCampaignNumber
};