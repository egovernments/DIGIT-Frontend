import { getErrorCodes } from "../config";
import * as XLSX from 'xlsx';
import config from "../config";
import hashSum from 'hash-sum';

import { httpRequest } from "../utils/request";
import { logger } from "../utils/logger";


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

  const rowDataArray = XLSX.utils.sheet_to_json(desiredSheet, { header: 1, range });

  for (const row of rowDataArray) {
    const rowData: any = {};

    for (const fieldConfig of config || []) {
      if (fieldConfig.format === 'GENERATE_HASH') {
        // Extract values from the row for the specified columns
        const valuesToHash: any[] = fieldConfig.column.map((col: any) => {
          // Handle double-digit columns like 'AA', 'AB', etc.
          const colIndex = XLSX.utils.decode_col(col);
          return (row as any[])[colIndex];
        });
        logger.info("Values To Hash : " + JSON.stringify(valuesToHash));

        // Generate a hash using hash-sum of the extracted values
        const generatedCode = hashSum(valuesToHash);
        rowData[fieldConfig.title] = generatedCode;
        fieldConfig.default = generatedCode;
      } else if (fieldConfig.format === 'AUTO_GENERATE') {
        // Generate a 10-digit phone number starting with 8 or 9
        const generatedPhoneNumber = '8' + Math.floor(100000000 + Math.random() * 900000000).toString();
        rowData[fieldConfig.title] = generatedPhoneNumber;
        fieldConfig.default = generatedPhoneNumber;
      } else {
        // Concatenate values from the specified columns
        const concatValue = fieldConfig.column.map((col: any) => {
          // Handle double-digit columns like 'AA', 'AB', etc.
          const colIndex = XLSX.utils.decode_col(col);
          return (row as any[])[colIndex];
        }).join('');
        if (concatValue) {
          rowData[fieldConfig.title] = concatValue;
          fieldConfig.default = concatValue;
        }
        else {
          rowData[fieldConfig.title] = fieldConfig.default;
        }
        if (fieldConfig.conditions) {
          for (const condition of fieldConfig.conditions) {
            if (rowData[fieldConfig.title] == condition.from) {
              rowData[fieldConfig.title] = condition.to;
              fieldConfig.default = condition.to;
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
  const response = await httpRequest(fileUrl, undefined, undefined, 'get');
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
        processExcelSheet(desiredSheet, selectedRow.startRow, selectedRow.endRow, config, rowDatas);
      }

    } catch (error) {
      logger.error('Error fetching or processing file: ' + error);
    }
  }
  logger.info("RowDatas : " + JSON.stringify(rowDatas))
  return rowDatas;
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
    logger.info("Parsing Template search Result : " + JSON.stringify(result))
    return result;
  } catch (error: any) {
    logger.error("Error: " + error)
    return error?.response?.data?.Errors[0].message;
  }

}


export {
  getSheetData,
  searchMDMS
};