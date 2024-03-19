import * as XLSX from 'xlsx';
import config from "../config";
import FormData from 'form-data';
import { v4 as uuidv4 } from 'uuid';
import { httpRequest } from "../utils/request";
import { logger } from "../utils/logger";
import createAndSearch from '../config/createAndSearch';
import { correctParentValues, sortCampaignDetails, getDataFromSheet, convertToTypeData, matchData, generateActivityMessage, extractCodesFromBoundaryRelationshipResponse } from "../utils/index";
import { validateSheetData, validateProjectFacilityResponse, validateProjectResourceResponse, validateStaffResponse, validatedProjectResponseAndUpdateId } from "../utils/validator";
// import { json } from 'body-parser';
const _ = require('lodash');


const getSheetData = async (fileUrl: string, sheetName: string) => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/pdf',
  };

  const responseFile = await httpRequest(fileUrl, null, {}, 'get', 'arraybuffer', headers);
  const workbook = XLSX.read(responseFile, { type: 'buffer' });

  // Check if the specified sheet exists in the workbook
  if (!workbook.Sheets.hasOwnProperty(sheetName)) {
    throw new Error(`Sheet with name "${sheetName}" is not present in the file.`);
  }

  const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  const jsonData = sheetData.map((row: any, index: number) => {
    const rowData: any = {};
    Object.keys(row).forEach(key => {
      rowData[key] = row[key] === undefined || row[key] === '' ? null : row[key];
    });
    // rowData['!row#number!'] = index + 1; // Adding row number
    return rowData;
  });
  logger.info("Sheet Data : " + JSON.stringify(jsonData))
  return jsonData;
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


const getCampaignNumber: any = async (requestBody: any, idFormat: String, idName: string, tenantId: string) => {
  const data = {
    RequestInfo: requestBody?.RequestInfo,
    "idRequests": [
      {
        "idName": idName,
        "tenantId": tenantId,
        "format": idFormat
      }
    ]
  }
  const idGenUrl = config.host.idGenHost + config.paths.idGen;
  logger.info("IdGen url : " + idGenUrl)
  logger.info("Idgen Request : " + JSON.stringify(data))
  const result = await httpRequest(idGenUrl, data, undefined, undefined, undefined, undefined);
  if (result?.idResponses?.[0]?.id) {
    return result?.idResponses?.[0]?.id;
  }
  throw new Error("Error during generating campaign number");
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
  console.log(responseData, "tttttttttttttttt")
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

const getHierarchy = async (request: any, tenantId: string, hierarchyType: string) => {
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



async function createExcelSheet(data: any, headers: any, sheetName: string = 'Sheet1') {
  const workbook = XLSX.utils.book_new();
  const sheetData = [headers, ...data];
  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  // Define column widths (in pixels)
  const columnWidths = headers.map(() => ({ width: 30 }));

  // Apply column widths to the sheet
  ws['!cols'] = columnWidths;

  XLSX.utils.book_append_sheet(workbook, ws, sheetName);
  return { wb: workbook, ws: ws, sheetName: sheetName };
}

async function getBoundaryCodesHandler(boundaryList: any, childParentMap: any, elementCodesMap: any, countMap: any) {
  try {
    const updatedelementCodesMap = await getAutoGeneratedBoundaryCodes(boundaryList, childParentMap, elementCodesMap, countMap);
    return updatedelementCodesMap;
  } catch (error) {
    console.error("Error in getBoundaryCodesHandler:", error);
    throw error; // Propagate the error
  }
}

async function getAutoGeneratedBoundaryCodes(boundaryList: any, childParentMap: any, elementCodesMap: any, countMap: any) {
  const columnsData: string[][] = [];
  for (const row of boundaryList) {
    row.forEach((element: any, index: any) => {
      if (!columnsData[index]) {
        columnsData[index] = [];
      }
      if (!columnsData[index].includes(element)) {
        columnsData[index].push(element);
      }
    });
  }

  const elementSet = new Set<string>();
  columnsData.forEach(column => {
    column.forEach(element => {
      elementSet.add(element);
    });
  });
  console.log(countMap.get("INDIA"), "iiiiiiiiiiiiiiiiiiiiiiiiiiii")

  // const countMap = new Map();
  // const elementCodesMap = new Map();

  for (let i = 0; i < columnsData.length; i++) {
    const column = columnsData[i];
    for (const element of column) {
      if (!elementCodesMap.has(element)) {
        const parentCode = childParentMap.get(element)!;
        if (parentCode != undefined && parentCode != null) {
          if (elementSet.has(parentCode)) {
            if (countMap.has(parentCode)) {
              countMap.set(parentCode, countMap.get(parentCode)! + 1);
            } else {
              countMap.set(parentCode, 1);
            }
          }
          let code;
          const grandParentCode = childParentMap.get(parentCode);
          if (grandParentCode != null && grandParentCode != undefined) {
            const parentBoundaryCode = elementCodesMap.get(parentCode);
            const lastUnderscoreIndex = parentBoundaryCode.lastIndexOf('_');
            const parentBoundaryCodeTrimmed = lastUnderscoreIndex !== -1 ? parentBoundaryCode.substring(0, lastUnderscoreIndex) : parentBoundaryCode;
            code = generateElementCode(countMap.get(parentCode), parentBoundaryCodeTrimmed, element);
          } else {
            code = generateElementCode(countMap.get(parentCode), elementCodesMap.get(parentCode), element);
          }

          elementCodesMap.set(element, code); // Store the code of the element in the map
        }
        else {
          elementCodesMap.set(element, "ADMIN_" + element.toString().substring(0, 2));
        }
      }
    }
  }
  console.log(elementCodesMap, "ellllleeeeeeeeeeeeee")
  return elementCodesMap;
}

function generateElementCode(sequence: any, parentCode: any, element: any) {
  let paddedSequence = sequence.toString().padStart(2, '0'); // Pad single-digit numbers with leading zero
  return parentCode + '_' + paddedSequence + '_' + element;
}

async function getBoundarySheetData(request: any) {
  const url = `${config.host.boundaryHost}${config.paths.boundaryRelationship}`;
  const params = request?.body?.Filters;
  const boundaryType = params?.boundaryType;
  const boundaryRelationshipResponse = await httpRequest(url, request.body, params);
  const boundaryData = boundaryRelationshipResponse?.TenantBoundary?.[0]?.boundary;
  logger.info("boundaryData for sheet " + JSON.stringify(boundaryData))
  if (boundaryData) {
    const boundaryList = generateHierarchyList(boundaryData)
    if (Array.isArray(boundaryList) && boundaryList.length > 0) {
      const boundaryCodes = boundaryList.map(boundary => boundary.split(',').pop());
      const string = boundaryCodes.join(', ');
      const boundaryEntityResponse = await httpRequest(config.host.boundaryHost + config.paths.boundaryServiceSearch, request.body, { tenantId: "pg", codes: string });

      const boundaryCodeNameMapping: { [key: string]: string } = {};
      boundaryEntityResponse?.Boundary?.forEach((data: any) => {
        boundaryCodeNameMapping[data?.code] = data?.additionalDetails?.name;
      });

      const hierarchy = await getHierarchy(request, request?.query?.tenantId, request?.query?.hierarchyType);
      const startIndex = boundaryType ? hierarchy.indexOf(boundaryType) : -1;
      const reducedHierarchy = startIndex !== -1 ? hierarchy.slice(startIndex) : hierarchy;
      const headers = [...reducedHierarchy, "Boundary Code", "Target at the Selected Boundary level", "Start Date of Campaign (Optional Field)", "End Date of Campaign (Optional Field)"];
      const data = boundaryList.map(boundary => {
        const boundaryParts = boundary.split(',');
        const boundaryCode = boundaryParts[boundaryParts.length - 1];
        const rowData = boundaryParts.concat(Array(Math.max(0, reducedHierarchy.length - boundaryParts.length)).fill(''));
        const mappedRowData = rowData.map((cell: any, index: number) =>
          index === reducedHierarchy.length ? '' : cell !== '' ? boundaryCodeNameMapping[cell] || cell : ''
        );
        const boundaryCodeIndex = reducedHierarchy.length;
        mappedRowData[boundaryCodeIndex] = boundaryCode;
        return mappedRowData;
      });
      return await createExcelSheet(data, headers);
    }
  }
  return { wb: null, ws: null, sheetName: null }; // Return null if no data found
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

async function createBoundaryEntities(request: any, boundaryMap: Map<string, string>) {
  try {
    const requestBody = { "RequestInfo": request.body.RequestInfo } as { RequestInfo: any; Boundary?: any };
    const boundaries: any[] = [];
    const boundaryCodes: any[] = [];
    Array.from(boundaryMap.entries()).forEach(([, boundaryCode]) => {
      boundaryCodes.push(boundaryCode);
    });
    const boundaryEntityResponse = await httpRequest(config.host.boundaryHost + config.paths.boundaryServiceSearch, request.body, { tenantId: request?.body?.ResourceDetails?.tenantId, codes: boundaryCodes.join(', ') });
    const codesFromResponse = boundaryEntityResponse.Boundary.map((boundary: any) => boundary.code);
    const codeSet = new Set(codesFromResponse);  // Creating a set and filling it with the codes from the response
    Array.from(boundaryMap.entries()).forEach(async ([boundaryName, boundaryCode]) => {   // Convert the Map to an array of entries and iterate over it
      const boundary = {
        tenantId: request?.body?.ResourceDetails?.tenantId,
        code: boundaryCode,
        geometry: null,
        additionalDetails: {
          name: boundaryName
        }
      };
      if (!codeSet.has(boundaryCode)) {
        boundaries.push(boundary);
      }
    });
    if (!(boundaries.length === 0)) {
      requestBody.Boundary = boundaries;
      // console.log(requestBody, "reeeeeeeeeeeeeeeeeeeeee")
      const response = await httpRequest(`${config.host.boundaryHost}boundary-service/boundary/_create`, requestBody, {}, 'POST',);
      console.log('Boundary entities created:', response);
    }
    else {
      console.log("same boundary uploaded")
    }
  } catch (error) {
    console.error('Error creating boundary entities:', error);
    throw new Error('Error creating boundary entities:'); // Throw the error to the calling function
  }
}

async function createBoundaryRelationship(request: any, boundaryTypeMap: { [key: string]: string } = {}, modifiedChildParentMap: any) {
  try {
    const requestBody = { "RequestInfo": request.body.RequestInfo } as { RequestInfo: any; BoundaryRelationship?: any };
    const url = `${config.host.boundaryHost}${config.paths.boundaryRelationship}`;
    const params = {
      "type": request?.body?.ResourceDetails?.type,
      "tenantId": request?.body?.ResourceDetails?.tenantId,
      "boundaryType": "Country",
      "codes": null,
      "includeChildren": true,
      "hierarchyType": request?.body?.ResourceDetails?.hierarchyType
    };
    const boundaryRelationshipResponse = await httpRequest(url, request.body, params);
    const boundaryData = boundaryRelationshipResponse?.TenantBoundary?.[0]?.boundary;
    const allCodes = extractCodesFromBoundaryRelationshipResponse(boundaryData);
    console.log(allCodes, "alllllllllllllllllllllllll")
    for (const [boundaryCode, boundaryType] of Object.entries(boundaryTypeMap)) {
      console.log(modifiedChildParentMap.get(boundaryCode), "pareeeeeeeeeenytttttttttttt");
      const boundary = {
        tenantId: "pg",
        boundaryType: boundaryType,
        code: boundaryCode,
        hierarchyType: request?.body?.ResourceDetails?.hierarchyType,
        parent: modifiedChildParentMap.get(boundaryCode)
      }
      if (!allCodes.has(boundaryCode)) {
        requestBody.BoundaryRelationship = boundary;
        console.log(requestBody, "reeeeeeeeeeeeeeeeeeeeee")

        const response = await httpRequest(`${config.host.boundaryHost}boundary-service/boundary-relationships/_create`, requestBody, {}, 'POST');
        // Handle successful response
        console.log('Boundary relationship created:', response);
      }
      else {
        console.log("Same boundary upload")
      }
    }
  } catch (error) {
    // Handle error
    console.error('Error creating boundary relationship:', error);
    throw new Error('Error creating boundary relationship:'); // Throw the error to the calling function
  }

}






async function enrichCampaign(requestBody: any) {
  if (requestBody?.Campaign) {
    requestBody.Campaign.id = uuidv4();
    requestBody.Campaign.campaignNo = await getCampaignNumber(requestBody, config.values.idgen.format, config.values.idgen.idName, requestBody?.Campaign?.tenantId);
    for (const campaignDetails of requestBody?.Campaign?.CampaignDetails) {
      campaignDetails.id = uuidv4();
    }
  }
}

async function getAllFacilitiesInLoop(searchedFacilities: any[], facilitySearchParams: any, facilitySearchBody: any) {
  await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 3 seconds
  logger.info("facilitySearchParams : " + JSON.stringify(facilitySearchParams));
  const response = await httpRequest(config.host.facilityHost + config.paths.facilitySearch, facilitySearchBody, facilitySearchParams);

  if (Array.isArray(response?.Facilities)) {
    searchedFacilities.push(...response?.Facilities);
    return response.Facilities.length >= 50; // Return true if there are more facilities to fetch, false otherwise
  } else {
    throw new Error("Search failed for Facility. Check Logs");
  }
}

async function getAllFacilities(tenantId: string, requestBody: any) {
  const facilitySearchBody = {
    RequestInfo: requestBody?.RequestInfo,
    Facility: { isPermanent: true }
  };

  const facilitySearchParams = {
    limit: 50,
    offset: 0,
    tenantId: tenantId?.split('.')?.[0]
  };

  logger.info("Facility search url : " + config.host.facilityHost + config.paths.facilitySearch);
  logger.info("facilitySearchBody : " + JSON.stringify(facilitySearchBody));
  const searchedFacilities: any[] = [];
  let searchAgain = true;

  while (searchAgain) {
    searchAgain = await getAllFacilitiesInLoop(searchedFacilities, facilitySearchParams, facilitySearchBody);
    facilitySearchParams.offset += 50;
  }

  return searchedFacilities;
}

async function getFacilitiesViaIds(tenantId: string, ids: any[], requestBody: any) {
  const facilitySearchBody: any = {
    RequestInfo: requestBody?.RequestInfo,
    Facility: {}
  };

  const facilitySearchParams = {
    limit: 50,
    offset: 0,
    tenantId: tenantId?.split('.')?.[0]
  };

  logger.info("Facility search url : " + config.host.facilityHost + config.paths.facilitySearch);
  const searchedFacilities: any[] = [];

  // Split ids into chunks of 50
  for (let i = 0; i < ids.length; i += 50) {
    const chunkIds = ids.slice(i, i + 50);
    facilitySearchBody.Facility.id = chunkIds;
    logger.info("facilitySearchBody : " + JSON.stringify(facilitySearchBody));
    await getAllFacilitiesInLoop(searchedFacilities, facilitySearchParams, facilitySearchBody);
  }

  return searchedFacilities;
}

function getParamsViaElements(elements: any, request: any) {
  var params: any = {};
  if (!elements) {
    return params;
  }
  for (const element of elements) {
    if (element?.isInParams) {
      if (element?.value) {
        _.set(params, element?.keyPath, element?.value);
      }
      else if (element?.getValueViaPath) {
        _.set(params, element?.keyPath, _.get(request.body, element?.getValueViaPath))
      }
    }
  }
  return params
}

function changeBodyViaElements(elements: any, request: any) {
  if (!elements) {
    return;
  }
  for (const element of elements) {
    if (element?.isInBody) {
      if (element?.value) {
        _.set(request.body, element?.keyPath, element?.value);
      }
      else if (element?.getValueViaPath) {
        _.set(request.body, element?.keyPath, _.get(request.body, element?.getValueViaPath))
      }
      else {
        _.set(request.body, element?.keyPath, {})
      }
    }
  }
}

function changeBodyViaSearchFromSheet(elements: any, request: any, dataFromSheet: any) {
  if (!elements) {
    return;
  }
  for (const element of elements) {
    const arrayToSearch = []
    for (const data of dataFromSheet) {
      if (data[element.sheetColumnName]) {
        arrayToSearch.push(data[element.sheetColumnName]);
      }
    }
    _.set(request.body, element?.searchPath, arrayToSearch);
  }
}

function updateErrors(newCreatedData: any[], newSearchedData: any[], errors: any[], createAndSearchConfig: any, activity: any) {
  newCreatedData.forEach((createdElement: any) => {
    let foundMatch = false;
    for (const searchedElement of newSearchedData) {
      let match = true;
      for (const key in createdElement) {
        if (createdElement.hasOwnProperty(key) && !searchedElement.hasOwnProperty(key) && key != '!row#number!') {
          match = false;
          break;
        }
        if (createdElement[key] !== searchedElement[key] && key != '!row#number!') {
          match = false;
          break;
        }
      }
      if (match) {
        foundMatch = true;
        newSearchedData.splice(newSearchedData.indexOf(searchedElement), 1);
        errors.push({ status: "PERSISTED", rowNumber: createdElement["!row#number!"], isUniqueIdentifier: true, uniqueIdentifier: searchedElement[createAndSearchConfig.uniqueIdentifier], errorDetails: "" })
        break;
      }
    }
    if (!foundMatch) {
      errors.push({ status: "NOT_PERSISTED", rowNumber: createdElement["!row#number!"], errorDetails: `Can't confirm persistence of this data` })
      activity.status = 2001 // means not persisted
      logger.info("Can't confirm persistence of this data of row number : " + createdElement["!row#number!"]);
    }
  });
}

function matchCreatedAndSearchedData(createdData: any[], searchedData: any[], request: any, createAndSearchConfig: any, activity: any) {
  const newCreatedData = JSON.parse(JSON.stringify(createdData));
  const newSearchedData = JSON.parse(JSON.stringify(searchedData));
  const uid = createAndSearchConfig.uniqueIdentifier;
  newCreatedData.forEach((element: any) => {
    delete element[uid];
  })
  var errors: any[] = []
  updateErrors(newCreatedData, newSearchedData, errors, createAndSearchConfig, activity);
  request.body.sheetErrorDetails = request?.body?.sheetErrorDetails ? [...request?.body?.sheetErrorDetails, ...errors] : errors;
  request.body.Activities = [...(request?.body?.Activities ? request?.body?.Activities : []), activity]
}
function matchViaUserIdAndCreationTime(createdData: any[], searchedData: any[], request: any, creationTime: any, createAndSearchConfig: any, activity: any) {
  var matchingSearchData = [];
  const userUuid = request?.body?.RequestInfo?.userInfo?.uuid
  var count = 0;
  for (const data of searchedData) {
    if (data?.auditDetails?.createdBy == userUuid && data?.auditDetails?.createdTime >= creationTime) {
      matchingSearchData.push(data);
      count++;
    }
  }
  if (count < createdData.length) {
    request.body.ResourceDetails.status = "PERSISTER_ERROR"
  }
  matchCreatedAndSearchedData(createdData, matchingSearchData, request, createAndSearchConfig, activity);
  logger.info("New created resources count : " + count);
}

async function processSearch(createAndSearchConfig: any, request: any, params: any) {
  setSearchLimits(createAndSearchConfig, request, params);
  logger.info("Search url : " + createAndSearchConfig?.searchDetails?.url);

  const arraysToMatch = await performSearch(createAndSearchConfig, request, params);

  return arraysToMatch;
}

function setSearchLimits(createAndSearchConfig: any, request: any, params: any) {
  setLimitOrOffset(createAndSearchConfig?.searchDetails?.searchLimit, params, request.body);
  setLimitOrOffset(createAndSearchConfig?.searchDetails?.searchOffset, params, request.body);
}

function setLimitOrOffset(limitOrOffsetConfig: any, params: any, requestBody: any) {
  if (limitOrOffsetConfig) {
    if (limitOrOffsetConfig?.isInParams) {
      _.set(params, limitOrOffsetConfig?.keyPath, parseInt(limitOrOffsetConfig?.value));
    }
    if (limitOrOffsetConfig?.isInBody) {
      _.set(requestBody, limitOrOffsetConfig?.keyPath, parseInt(limitOrOffsetConfig?.value));
    }
  }
}

async function performSearch(createAndSearchConfig: any, request: any, params: any) {
  const arraysToMatch: any[] = [];
  let searchAgain = true;

  while (searchAgain) {
    logger.info("Search url : " + createAndSearchConfig?.searchDetails?.url);
    logger.info("Search params : " + JSON.stringify(params));
    logger.info("Search body : " + JSON.stringify(request.body));

    const response = await httpRequest(createAndSearchConfig?.searchDetails?.url, request.body, params);
    const resultArray = _.get(response, createAndSearchConfig?.searchDetails?.searchPath);
    if (resultArray && Array.isArray(resultArray)) {
      arraysToMatch.push(...resultArray);
      if (resultArray.length < parseInt(createAndSearchConfig?.searchDetails?.searchLimit?.value)) {
        searchAgain = false;
      }
    } else {
      searchAgain = false;
    }
    updateOffset(createAndSearchConfig, params, request.body);
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  return arraysToMatch;
}

function updateOffset(createAndSearchConfig: any, params: any, requestBody: any) {
  const offsetConfig = createAndSearchConfig?.searchDetails?.searchOffset
  const limit = createAndSearchConfig?.searchDetails?.searchLimit?.value
  if (offsetConfig) {
    if (offsetConfig?.isInParams) {
      _.set(params, offsetConfig?.keyPath, parseInt(_.get(params, offsetConfig?.keyPath) + parseInt(limit)));
    }
    if (offsetConfig?.isInBody) {
      _.set(requestBody, offsetConfig?.keyPath, parseInt(_.get(requestBody, offsetConfig?.keyPath) + parseInt(limit)));
    }
  }
}

async function processSearchAndValidation(request: any, createAndSearchConfig: any, dataFromSheet: any[]) {
  const params: any = getParamsViaElements(createAndSearchConfig?.searchDetails?.searchElements, request);
  changeBodyViaElements(createAndSearchConfig?.searchDetails?.searchElements, request)
  changeBodyViaSearchFromSheet(createAndSearchConfig?.requiresToSearchFromSheet, request, dataFromSheet)
  const arraysToMatch = await processSearch(createAndSearchConfig, request, params)
  matchData(request, request.body.dataToSearch, arraysToMatch, createAndSearchConfig)
}


async function confirmCreation(createAndSearchConfig: any, request: any, facilityCreateData: any[], creationTime: any, activity: any) {
  // wait for 5 seconds
  await new Promise(resolve => setTimeout(resolve, 5000));
  const params: any = getParamsViaElements(createAndSearchConfig?.searchDetails?.searchElements, request);
  changeBodyViaElements(createAndSearchConfig?.searchDetails?.searchElements, request)
  const arraysToMatch = await processSearch(createAndSearchConfig, request, params)
  matchViaUserIdAndCreationTime(facilityCreateData, arraysToMatch, request, creationTime, createAndSearchConfig, activity)
}

async function processValidate(request: any) {
  const type: string = request.body.ResourceDetails.type;
  const createAndSearchConfig = createAndSearch[type]
  const dataFromSheet = await getDataFromSheet(request?.body?.ResourceDetails?.fileStoreId, request?.body?.ResourceDetails?.tenantId, createAndSearchConfig)
  await validateSheetData(dataFromSheet, request, createAndSearchConfig?.sheetSchema, createAndSearchConfig?.boundaryValidation)
  const typeData = convertToTypeData(dataFromSheet, createAndSearchConfig, request.body)
  request.body.dataToSearch = typeData.searchData;
  await processSearchAndValidation(request, createAndSearchConfig, dataFromSheet)
}

async function performAndSaveResourceActivity(request: any, createAndSearchConfig: any, params: any, type: any) {
  logger.info(type + " create data : " + JSON.stringify(request?.body?.dataToCreate));
  logger.info(type + " bulk create url : " + createAndSearchConfig?.createBulkDetails?.url, params);
  if (createAndSearchConfig?.createBulkDetails?.limit) {
    const limit = createAndSearchConfig?.createBulkDetails?.limit;
    const dataToCreate = request?.body?.dataToCreate;
    const chunks = Math.ceil(dataToCreate.length / limit); // Calculate number of chunks
    for (let i = 0; i < chunks; i++) {
      const start = i * limit;
      const end = (i + 1) * limit;
      const chunkData = dataToCreate.slice(start, end); // Get a chunk of data
      const creationTime = Date.now();
      const newRequestBody = JSON.parse(JSON.stringify(request.body));
      _.set(newRequestBody, createAndSearchConfig?.createBulkDetails?.createPath, chunkData);
      const responsePayload = await httpRequest(createAndSearchConfig?.createBulkDetails?.url, newRequestBody, params, "post", undefined, undefined, true);
      var activity = await generateActivityMessage(request?.body?.ResourceDetails?.tenantId, request.body, newRequestBody, responsePayload, type, createAndSearchConfig?.createBulkDetails?.url, responsePayload?.statusCode)
      await confirmCreation(createAndSearchConfig, request, chunkData, creationTime, activity);
      logger.info("Activity : " + JSON.stringify(activity));
    }
  }
}

async function processGenericRequest(request: any) {
  if (request?.body?.ResourceDetails?.action == "create") {
    await processCreate(request)
  }
  else {
    await processValidate(request)
  }
}


async function processCreate(request: any) {
  const type: string = request.body.ResourceDetails.type;
  const createAndSearchConfig = createAndSearch[type]
  const dataFromSheet = await getDataFromSheet(request?.body?.ResourceDetails?.fileStoreId, request?.body?.ResourceDetails?.tenantId, createAndSearchConfig)
  await validateSheetData(dataFromSheet, request, createAndSearchConfig?.sheetSchema, createAndSearchConfig?.boundaryValidation)
  const typeData = convertToTypeData(dataFromSheet, createAndSearchConfig, request.body)
  request.body.dataToCreate = typeData.createData;
  request.body.dataToSearch = typeData.searchData;
  await processSearchAndValidation(request, createAndSearchConfig, dataFromSheet)
  if (createAndSearchConfig?.createBulkDetails) {
    _.set(request.body, createAndSearchConfig?.createBulkDetails?.createPath, request?.body?.dataToCreate);
    const params: any = getParamsViaElements(createAndSearchConfig?.createBulkDetails?.createElements, request);
    changeBodyViaElements(createAndSearchConfig?.createBulkDetails?.createElements, request)
    await performAndSaveResourceActivity(request, createAndSearchConfig, params, type);
  }
}

async function createProjectCampaignResourcData(request: any) {
  if (request?.body?.CampaignDetails?.action == "create") {
    for (const resource of request.body.CampaignDetails.resources) {
      const resourceDetails = {
        type: resource.type,
        fileStoreId: resource.filestoreId,
        tenantId: request?.body?.CampaignDetails?.tenantId,
        action: "create",
        hierarchyType: request?.body?.CampaignDetails?.hierarchyType,
        additionalDetails: {}
      };
      try {
        await httpRequest("http://localhost:8080/project-factory/v1/data/_create", { RequestInfo: request.body.RequestInfo, ResourceDetails: resourceDetails });
      } catch (error: any) {
        // Handle error for individual resource creation
        logger.error(`Error creating resource: ${error}`);
        throw new Error(String(error))
      }
    }
  }
}






export {
  getSheetData,
  searchMDMS,
  getCampaignNumber,
  getSchema,
  getResouceNumber,
  getCount,
  getBoundarySheetData,
  createAndUploadFile,
  createProjectIfNotExists,
  createRelatedResouce,
  enrichCampaign,
  createExcelSheet,
  getAllFacilities,
  getFacilitiesViaIds,
  confirmCreation,
  getParamsViaElements,
  changeBodyViaElements,
  processGenericRequest,
  createProjectCampaignResourcData,
  processCreate,
  getAutoGeneratedBoundaryCodes,
  getBoundaryCodesHandler,
  getHierarchy,
  createBoundaryEntities,
  createBoundaryRelationship,
};