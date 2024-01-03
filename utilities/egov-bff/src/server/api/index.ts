import axios from "axios";
import { getErrorCodes } from "../config";
import { Blob } from 'buffer';
import * as XLSX from 'xlsx';
import { errorResponder } from "../utils";
import config from "../config";

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
      const columnIndex = XLSX.utils.decode_col(fieldConfig.column);
      const fieldValue = (row as any[])[columnIndex] || fieldConfig.default;
      rowData[fieldConfig.title] = fieldValue;
      fieldConfig.default = fieldValue;
    }

    rowDatas.push(rowData);
  }
}

async function getWorkbook(fileUrl: string) {

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/pdf',
  };
  logger.info("FileUrl : " + fileUrl)
  const responseFile = await httpRequest(fileUrl, null, {}, 'get', 'arraybuffer', headers);

  const fileXlsx = new Blob([responseFile], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
  });

  const arrayBuffer = await fileXlsx.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);
  const workbook = XLSX.read(data, { type: 'array' });
  return workbook;
}



const getSheetData = async (
  fileUrl: string,
  startRow: number = 1,
  endRow?: number,
  config?: any,
  sheetName?: string
) => {
  const response = await httpRequest(fileUrl, undefined, undefined, 'get');
  const rowDatas: any[] = [];

  for (const file of response.fileStoreIds) {
    try {
      const workbook = await getWorkbook(file.url);
      logger.info("Workbook : " + JSON.stringify(workbook))

      let desiredSheet = workbook.Sheets[sheetName || workbook.SheetNames[0]];

      if (!desiredSheet) {
        logger.info(`Sheet "${sheetName}" not found in the workbook.`);
        return getErrorCodes("WORKS", "NO_SHEETNAME_FOUND");
      }

      if (!endRow) {
        const sheetRef = desiredSheet['!ref'];
        endRow = sheetRef ? XLSX.utils.decode_range(sheetRef).e.r + 1 : 1;
      }
      processExcelSheet(desiredSheet, startRow, endRow, config, rowDatas);

    } catch (error) {
      logger.error('Error fetching or processing file: ' + error);
    }
  }
  return rowDatas;
};

const getTemplate = async (transformTemplate: any, requestinfo: any, response: any) => {
  const apiUrl = config.host.mdms + config.paths.mdms_search;
  logger.info("Mdms url for TransformTemplate: " + apiUrl)
  const data = {
    "MdmsCriteria": {
      "tenantId": requestinfo?.userInfo?.tenantId,
      "uniqueIdentifiers": [transformTemplate],
      "schemaCode": "HCM.TransformTemplate"
    },
    "RequestInfo": requestinfo
  }
  try {
    const result = await axios.post(apiUrl, data);
    return result;
  } catch (error: any) {
    logger.error("Error: " + error?.response?.data?.Errors[0].message)
    return errorResponder({ message: error?.response?.data?.Errors[0].message }, requestinfo, response);
  }

}

const getParsingTemplate = async (parsingTemplates: any[], requestinfo: any, response: any) => {
  const apiUrl = config.host.mdms + config.paths.mdms_search;
  logger.info("Mdms url for ParsingTemplate: " + apiUrl)
  const data = {
    "MdmsCriteria": {
      "tenantId": requestinfo?.userInfo?.tenantId,
      "uniqueIdentifiers": parsingTemplates,
      "schemaCode": "HCM.ParsingTemplate"
    },
    "RequestInfo": requestinfo
  }
  try {
    const result = await axios.post(apiUrl, data);
    return result;
  } catch (error: any) {
    logger.error("Error: " + error?.response?.data?.Errors[0].message)
    return errorResponder({ message: error?.response?.data?.Errors[0].message }, requestinfo, response);
  }

}


export {
  getSheetData,
  getTemplate,
  getParsingTemplate
};