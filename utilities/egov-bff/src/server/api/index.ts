import axios from "axios";
import config, { getErrorCodes } from "../config";
import { Blob } from 'buffer';
import * as XLSX from 'xlsx';
import { RowData, Config } from "../controllers/uploadSheet/Types";
import { errorResponder } from "../utils";



var url = require("url");
import { httpRequest } from "../utils/request";



const search_user = async (uuid: string, tenantId: string, requestinfo: any) => {
  return await httpRequest(
    url.resolve(config.host.user, config.paths.user_search),
    {
      RequestInfo: requestinfo.RequestInfo,
      uuid: [uuid],
      tenantId: tenantId,
    }
  );
}

/*
  This asynchronous function searches for muster rolls based on the provided parameters.
*/
const search_muster = async (params: any, requestinfo: any) => {
  // Send an HTTP request to the muster search endpoint using the provided parameters and request information.
  const musterResponse = await httpRequest(
    url.resolve(config.host.muster, config.paths.mus_search),
    requestinfo,
    params
  );

  // Check if there are muster rolls in the response.
  if (musterResponse?.musterRolls?.length > 0) {
    // If muster rolls are found, return them.
    return musterResponse?.musterRolls?.[0];
  }

  // If no muster rolls are found, return an error code.
  return getErrorCodes("WORKS", "NO_MUSTER_ROLL_FOUND");
}



const search_individual = async (individualIds: Array<string>, tenantId: string, requestinfo: any) => {
  // currently single property pdfs supported
  // if (individualIds) {
  //   individualId = individualId.trim();
  // }
  var params = {
    tenantId: tenantId,
    limit: 100,
    offset: 0,
  };
  requestinfo.Individual = {
    id: individualIds,
  };

  return await httpRequest(
    url.resolve(config.host.individual, config.paths.ind_search),
    requestinfo,
    params
  );
}

const search_workflow = async (applicationNumber: string, tenantId: string, requestinfo: any) => {
  var params = {
    tenantId: tenantId,
    businessIds: applicationNumber,
  };
  return await httpRequest(
    url.resolve(config.host.workflow, config.paths.workflow_search),
    requestinfo,
    params
  );
}
const search_localization = async (tenantId: string, module: string = "rainmaker-common", locale: string = "en_IN", requestinfo: any) => {
  return await httpRequest(
    url.resolve(config.host.localization, config.paths.localization_search),
    requestinfo,
    {
      tenantId: tenantId,
      module: module,
      locale: locale
    }
  );
}

const search_mdms = async (tenantId: string, module: string, master: string, requestinfo: any) => {
  const requestBody = {
    RequestInfo: requestinfo.RequestInfo,
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: module,
          masterDetails: [
            {
              name: master,
            },
          ],
        },
      ],
    },
  };
  return await httpRequest(
    url.resolve(config.host.mdms, config.paths.mdms_search),
    requestBody,
    null,
    "post",
    "",
    { cachekey: `${tenantId}-${module}-${master}` }
  ).then((response: { MdmsRes: any; }) => response.MdmsRes[module][master]);
}

const create_pdf = async (tenantId: string, key: string, data: string, requestinfo: any) => {
  return await httpRequest(
    url.resolve(config.host.pdf, config.paths.pdf_create),
    Object.assign(requestinfo, data),
    {
      tenantId: tenantId,
      key: key,
    },
    "post",
    "stream"
  );
}

const create_pdf_and_upload = async (tenantId: string, key: string, data: any, requestinfo: any) => {
  return await httpRequest(
    url.resolve(config.host.pdf, config.paths.pdf_create),
    Object.assign(requestinfo, data),
    {
      tenantId: tenantId,
      key: key,
    }
  );
}


/*
  This asynchronous function searches for contracts based on the provided parameters.
*/
const search_contract = async (params: any, requestinfo: any, cachekey: any) => {
  // Send an HTTP request to the contract search endpoint using the provided parameters and request information.
  const contractResponse = await httpRequest(
    url.resolve(config.host.contract, config.paths.contract_search),
    requestinfo,
    params,
    "post",
    "",
    { cachekey }
  );

  // Check if there are contracts in the response.
  if (contractResponse?.contracts?.length > 0) {
    // If contracts are found, return the first one.
    return contractResponse?.contracts?.[0];
  }

  // If no contracts are found, return an error code.
  return getErrorCodes("WORKS", "NO_CONTRACT_FOUND");
}

/*
  This asynchronous function searches for estimates based on the provided parameters.
*/
const search_estimate = async (params: any, requestinfo: any, cachekey: any) => {
  // Send an HTTP request to the estimate search endpoint using the provided parameters and request information.
  const estimateResponse = await httpRequest(
    url.resolve(config.host.estimate, config.paths.estimate_search),
    requestinfo,
    params,
    "post",
    "",
    { cachekey }
  );

  // Check if there are estimates in the response.
  if (estimateResponse?.estimates?.length > 0) {
    // If estimates are found, return the first one.
    return estimateResponse?.estimates?.[0];
  }

  // If no estimates are found, return an error code.
  return getErrorCodes("WORKS", "NO_ESTIMATE_FOUND");
}

/*
  This asynchronous function searches for measurements based on the provided parameters.
*/
const search_measurement = async (requestinfo: any, cachekey: any, allResponse: boolean = false) => {
  // Send an HTTP request to the measurement search endpoint using the provided parameters and request information.
  const musterResponse = await httpRequest(
    url.resolve(config.host.measurement, config.paths.measurement_search),
    requestinfo,
    null,
    "post",
    "",
    { cachekey }
  );

  // Check if there are measurements in the response.
  if (musterResponse?.measurements?.length > 0) {
    // If measurements are found, return either all of them or just the first one based on the 'allResponse' parameter.
    return allResponse ? musterResponse?.measurements : musterResponse?.measurements?.[0];
  }

  // If no measurements are found, return an error code.
  return getErrorCodes("WORKS", "NO_MEASUREMENT_ROLL_FOUND");
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
  config?: Config,
  sheetName?: string
) => {
  const response = await httpRequest(fileUrl, undefined, undefined, 'get');
  const rowDatas: RowData[] = [];

  for (const file of response.fileStoreIds) {
    try {
      const workbook = await getWorkbook(file.url);

      let desiredSheet = workbook.Sheets[sheetName || workbook.SheetNames[0]];

      if (!desiredSheet) {
        console.log(`Sheet "${sheetName}" not found in the workbook. Using the first sheet...`);
        return getErrorCodes("WORKS", "NO_SHEETNAME_FOUND");
      }

      if (!endRow) {
        const sheetRef = desiredSheet['!ref'];
        endRow = sheetRef ? XLSX.utils.decode_range(sheetRef).e.r + 1 : 1;
      }
      processExcelSheet(desiredSheet, startRow, endRow, config, rowDatas);

    } catch (error) {
      console.error('Error fetching or processing file:', error);
    }
  }
  return rowDatas;
};

const getTemplate = async (templateName: any, requestinfo: any, response: any) => {
  const apiUrl = 'https://unified-uat.digit.org/mdms-v2/v2/_search';

  const data = {
    "MdmsCriteria": {
      "tenantId": requestinfo?.userInfo?.tenantId,
      "uniqueIdentifiers": [templateName],
      "schemaCode": "HCM.TransformTemplate"
    },
    "RequestInfo": requestinfo
  }
  try {
    const result = await axios.post(apiUrl, data);
    return result;
  } catch (error: any) {
    return errorResponder({ message: error?.response?.data?.Errors[0].message }, requestinfo, response);
  }

}

const getParsingTemplate = async (templateName: any, requestinfo: any, response: any) => {
  const apiUrl = 'https://unified-uat.digit.org/mdms-v2/v2/_search';

  const data = {
    "MdmsCriteria": {
      "tenantId": requestinfo?.userInfo?.tenantId,
      "uniqueIdentifiers": [templateName],
      "schemaCode": "HCM.ParsingTemplate"
    },
    "RequestInfo": requestinfo
  }
  try {

    const result = await axios.post(apiUrl, data);
    return result;
  } catch (error: any) {
    return errorResponder({ message: error?.response?.data?.Errors[0].message }, requestinfo, response);
  }

}


export {
  create_pdf,
  create_pdf_and_upload,
  search_mdms,
  search_user,
  search_workflow,
  search_muster,
  search_individual,
  search_localization,
  search_contract,
  search_estimate,
  search_measurement,
  getSheetData,
  getTemplate,
  getParsingTemplate
};