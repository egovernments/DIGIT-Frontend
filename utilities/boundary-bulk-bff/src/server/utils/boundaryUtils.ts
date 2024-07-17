import config from "../config";
import { executeQuery } from "./db";
import { throwError } from "./errorUtils";
import { addDataToSheet, createAndUploadFile, createExcelSheet, getExcelWorkbookFromFileURL, getNewExcelWorkbook, getSheetData, prepareDataForExcel } from "./excelUtils";
import { getLocalizedHeaders, getLocalizedName, transformAndCreateLocalisation } from "./localisationUtils";
import { getFormattedStringForDebug, logger } from "./logger";
import { persistEntityCreate, persistError, persistRelationship, processAndPersist } from "./persistUtils";
import { httpRequest } from "./request";
const _ = require('lodash');


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


// Function to generate hierarchy from boundaries
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
  return hierarchyList; // Return the hierarchy list
}


export const getHierarchy = async (request: any, tenantId: string, hierarchyType: string) => {
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

  const response = await httpRequest(url, requestBody);
  const boundaryList = response?.BoundaryHierarchy?.[0].boundaryHierarchy;
  return generateHierarchy(boundaryList);
};

export const getHeadersOfBoundarySheet = async (fileUrl: string, sheetName: string, getRow = false, localizationMap?: any) => {
  const localizedBoundarySheetName = getLocalizedName(sheetName, localizationMap);
  const workbook: any = await getExcelWorkbookFromFileURL(fileUrl, localizedBoundarySheetName);

  const worksheet = workbook.getWorksheet(localizedBoundarySheetName);
  const columnsToValidate = worksheet.getRow(1).values.map((header: any) => header ? header.toString().trim() : undefined);

  // Filter out empty items and return the result
  return columnsToValidate.filter((header: any) => typeof header === 'string');
}

function updateBoundaryData(boundaryData: any[]): any[] {
  const map: Map<string, string> = new Map();
  const count: Map<string, number> = new Map();

  boundaryData.forEach((row) => {
    const keys = Object.keys(row);
    keys.forEach((key, index) => {
      if (index > 0) {
        const element = row[key];
        const previousKey = keys[index - 1];
        const previousElement = row[keys[index - 1]];
        const previousElementKey = `${previousKey}:${previousElement}`;
        const elementKey = `${key}:${element}`;

        if (!map.has(elementKey)) {
          map.set(elementKey, previousElementKey);
          count.set(elementKey, 1);
        } else {
          const currentCount = count.get(elementKey)!;
          if (map.get(elementKey) !== previousElementKey) {
            map.set(elementKey, previousElementKey);
            count.set(elementKey, currentCount + 1);
          }
          const uniqueCount = count.get(elementKey)!;
          const uniqueElement = (uniqueCount > 1) ? `${element}-${(uniqueCount - 1).toString().padStart(2, '0')}` : `${element}`;
          row[key] = uniqueElement;
        }
      }
    });
  });
  return boundaryData;
}

function modifyBoundaryDataHeaders(boundaryData: any[], hierarchy: any[], localizationMap?: any) {
  const updatedData = boundaryData.map((obj: any) => {
    const updatedObj: { [key: string]: string | undefined } = {}; // Updated object with modified keys

    let hierarchyIndex = 0; // Track the index of the hierarchy array

    for (const key in obj) {
      if (key != getLocalizedName(config?.boundary?.boundaryCode, localizationMap)) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const hierarchyKey = hierarchy[hierarchyIndex]; // Get the key from the hierarchy array
          updatedObj[hierarchyKey] = obj[key]; // Map the key to the updated object
          hierarchyIndex++; // Move to the next key in the hierarchy array
        }
      }
      else {
        updatedObj[key] = obj[key];
      }
    }


    return updatedObj;
  });
  return updatedData;
}

function modifyBoundaryData(boundaryData: any[], localizationMap?: any) {
  // Initialize arrays to store data
  const withBoundaryCode: { key: string, value: string }[][] = [];
  const withoutBoundaryCode: { key: string, value: string }[][] = [];

  // Get the key for the boundary code
  const boundaryCodeKey = getLocalizedName(config?.boundary?.boundaryCode, localizationMap);

  // Process each object in boundaryData
  boundaryData.forEach((obj: any) => {
    // Convert object entries to an array of {key, value} objects
    const row: any = Object.entries(obj)
      .filter(([key, value]: [string, any]) => value !== null && value !== undefined) // Filter out null or undefined values
      .map(([key, value]: [string, any]) => {
        // Check if the current key is the "Boundary Code" key
        if (key === boundaryCodeKey) {
          // Keep the "Boundary Code" value as is without transformation
          return { key, value: value.toString() };
        } else {
          // Transform other values
          return { key, value: value.toString().replace(/_/g, ' ').trim() };
        }
      });

    // Determine whether the object has a boundary code property
    const hasBoundaryCode = obj.hasOwnProperty(boundaryCodeKey);

    // Push the row to the appropriate array based on whether it has a boundary code property
    if (hasBoundaryCode) {
      withBoundaryCode.push(row);
    } else {
      withoutBoundaryCode.push(row);
    }
  });

  // Return the arrays
  return [withBoundaryCode, withoutBoundaryCode];
}

function getCodeMappingsOfExistingBoundaryCodes(withBoundaryCode: any[]) {
  const countMap = new Map<{ key: string, value: string }, number>();
  const mappingMap = new Map<{ key: string, value: string }, string>();

  withBoundaryCode.forEach((row: any[]) => {
    const len = row.length;
    if (len >= 3) {
      let grandParentFound = false;
      const grandParent = row[len - 3];
      if (findMapValue(mappingMap, grandParent)) {
        const countMapArray = Array.from(countMap.entries());
        for (const [key, value] of countMapArray) {
          if (_.isEqual(key, grandParent)) {
            countMap.set(key, value + 1);
            grandParentFound = true;
            break;
          }
        }
        if (grandParentFound == false) {
          countMap.set(grandParent, 1);
        }
      }
    }
    mappingMap.set(row[len - 2], row[len - 1].value);
  });
  return { mappingMap, countMap };
}

function getChildParentMap(modifiedBoundaryData: any) {
  const childParentMap: Map<{ key: string, value: string }, { key: string, value: string } | null> = new Map();

  modifiedBoundaryData.forEach((row: any) => {
    for (let j = row.length - 1; j >= 0; j--) {
      const child = row[j];
      const parent = j - 1 >= 0 ? row[j - 1] : null;
      const childIdentifier = { key: child.key, value: child.value }; // Unique identifier for the child
      const parentIdentifier = parent ? { key: parent.key, value: parent.value } : null; // Unique identifier for the parent, set to null if parent doesn't exist


      // Check if the mapping already exists in the childParentMap
      const existingMapping = Array.from(childParentMap.entries()).find(([existingChild, existingParent]) =>
        _.isEqual(existingChild, childIdentifier) && _.isEqual(existingParent, parentIdentifier)
      );

      // If the mapping doesn't exist, add it to the childParentMap
      if (!existingMapping) {
        childParentMap.set(childIdentifier, parentIdentifier);
      }
    }
  });
  return childParentMap;
}

function generateElementCode(sequence: any, parentElement: any, parentBoundaryCode: any, element: any, excludeBoundaryNameAtLastFromBoundaryCodes?: any, childParentMap?: any, elementCodesMap?: any) {
  // Pad single-digit numbers with leading zero
  const paddedSequence = sequence.toString().padStart(2, "0");
  let code;

  if (excludeBoundaryNameAtLastFromBoundaryCodes) {
    code = `${parentBoundaryCode.toUpperCase()}_${paddedSequence}`;
  } else {
    const grandParentElement = findMapValue(childParentMap, parentElement);
    if (grandParentElement != null && grandParentElement != undefined) {
      const lastUnderscoreIndex = parentBoundaryCode ? parentBoundaryCode.lastIndexOf('_') : -1;
      const parentBoundaryCodeTrimmed = lastUnderscoreIndex !== -1 ? parentBoundaryCode.substring(0, lastUnderscoreIndex) : parentBoundaryCode;
      code = `${parentBoundaryCodeTrimmed.toUpperCase()}_${paddedSequence}_${element.toString().toUpperCase()}`;
    } else {
      code = `${parentBoundaryCode.toUpperCase()}_${paddedSequence}_${element.toString().toUpperCase()}`;
    }
  }

  return code.trim();
}

function modifyElementCodesMap(elementCodesMap: any) {
  const set = new Set<string>();
  const specialCharsRegex = /[^\w]/g; // Regular expression to match any character that is not a word character

  // Iterate over each [key, value] pair in elementCodesMap using forEach
  elementCodesMap.forEach((value: any, key: any) => {
    let modifiedValue = value.replace(specialCharsRegex, '_').trim(); // Replace special characters and spaces with underscore
    let modifiedTempValue = modifiedValue; // Store the initial modified value
    let count = 1;

    // Generate a unique modified value
    while (set.has(modifiedValue)) {
      // If it exists, append _<count> to modifiedValue
      modifiedValue = `${modifiedTempValue}_${count}`;
      count++;
    }

    // Add the modified (or original) value to the set
    set.add(modifiedValue);

    // Update the map with the modified value
    elementCodesMap.set(key, modifiedValue);
  });

}






async function getAutoGeneratedBoundaryCodes(boundaryList: any, childParentMap: any, elementCodesMap: any, countMap: any, request: any) {
  // Initialize an array to store column data
  const columnsData: { key: string, value: string }[][] = [];
  // Extract unique elements from each column
  for (const row of boundaryList) {
    row.forEach((element: any, index: any) => {
      if (!columnsData[index]) {
        columnsData[index] = [];
      }
      const existingElement = columnsData[index].find((existing: any) => _.isEqual(existing, element));
      if (!existingElement) {
        columnsData[index].push(element);
      }
    });
  }

  // Iterate over columns to generate boundary codes
  for (let i = 0; i < columnsData.length; i++) {
    const column = columnsData[i];
    for (const element of column) {
      if (!findMapValue(elementCodesMap, element)) {
        const parentElement = findMapValue(childParentMap, element);
        if (parentElement !== undefined && parentElement !== null) {
          const parentBoundaryCode = findMapValue(elementCodesMap, parentElement);
          const currentCount = (findMapValue(countMap, parentElement) || 0) + 1;
          countMap.set(parentElement, currentCount);

          const code = generateElementCode(
            currentCount,
            parentElement,
            parentBoundaryCode,
            element.value,
            config.excludeBoundaryNameAtLastFromBoundaryCodes,
            childParentMap,
            elementCodesMap
          );

          elementCodesMap.set(element, code); // Store the code of the element in the map
        } else {
          // Generate default code if parent code is not found
          const prefix = config?.excludeHierarchyTypeFromBoundaryCodes
            ? element.value.toString().substring(0, 2).toUpperCase()
            : `${(request?.query?.hierarchyType + "_").toUpperCase()}${element.value.toString().substring(0, 2).toUpperCase()}`;

          elementCodesMap.set(element, prefix);
        }
      }
    }
  }
  modifyElementCodesMap(elementCodesMap)
  return elementCodesMap; // Return the updated element codes map
}

async function getAutoGeneratedBoundaryCodesHandler(boundaryList: any, childParentMap: Map<{ key: string; value: string; }, { key: string; value: string; } | null>, elementCodesMap: any, countMap: any, request: any) {
  // Get updated element codes map
  logger.info("Auto Generation of Boundary code begins for the user uploaded sheet")
  const updatedelementCodesMap = await getAutoGeneratedBoundaryCodes(boundaryList, childParentMap, elementCodesMap, countMap, request);
  return updatedelementCodesMap; // Return the updated element codes map
}

async function createBoundaryEntities(request: any, boundaryMap: Map<any, any>) {
  const updatedBoundaryMap: Array<{ key: string, value: string }> = Array.from(boundaryMap).map(([key, value]) => ({ key: key.value, value: value }));

  // Create boundary entities
  const requestBody = { "RequestInfo": request.body.RequestInfo } as { RequestInfo: any; Boundary?: any };
  const boundaries: any[] = [];
  const codesFromResponse: any = [];
  const boundaryCodes: any[] = [];

  Array.from(boundaryMap.entries()).forEach(([, boundaryCode]) => {
    boundaryCodes.push(boundaryCode);
  });

  const boundaryEntitiesCreated: any[] = [];
  const boundaryEntityCreateChunkSize = 200;
  const chunkSize = 20;
  const boundaryCodeChunks = [];

  for (let i = 0; i < boundaryCodes.length; i += chunkSize) {
    boundaryCodeChunks.push(boundaryCodes.slice(i, i + chunkSize));
  }

  for (const chunk of boundaryCodeChunks) {
    const boundaryCodeString = chunk.join(', ');
    if (chunk.length > 0 && boundaryCodeString) {
      logger.info(`Creating boundary entities for codes: ${boundaryCodeString}`);

      try {
        const boundaryEntityResponse = await httpRequest(
          config.host.boundaryHost + config.paths.boundaryEntitySearch,
          request.body,
          { tenantId: request?.query?.tenantId, codes: boundaryCodeString }
        );
        const boundaryCodesFromResponse = boundaryEntityResponse.Boundary.flatMap((boundary: any) => boundary.code.toString());
        codesFromResponse.push(...boundaryCodesFromResponse);
      } catch (error: any) {
        console.log(error);
        logger.error(`Failed to fetch boundary entities for codes: ${boundaryCodeString}, Error: ${error.message}`);
        throw error;
      }
    } else {
      logger.debug(`Skipping empty or invalid chunk: ${boundaryCodeString}`);
    }
  }

  const codeSet = new Set(codesFromResponse); // Creating a set and filling it with the codes from the response
  for (const { key: boundaryName, value: boundaryCode } of updatedBoundaryMap) {
    if (!codeSet.has(boundaryCode.toString())) {
      const boundary = {
        tenantId: request?.query?.tenantId,
        code: boundaryCode,
        geometry: null,
        additionalDetails: {
          name: boundaryName
        }
      };
      boundaries.push(boundary);
    }
  }

  const totalBoundaryCount = boundaries.length;
  if (totalBoundaryCount !== 0) {
    let createdCount = 0;
    for (let i = 0; i < totalBoundaryCount; i += boundaryEntityCreateChunkSize) {
      requestBody.Boundary = boundaries.slice(i, i + boundaryEntityCreateChunkSize);
      try {
        const response = await httpRequest(
          `${config.host.boundaryHost}${config.paths.boundaryEntityCreate}`,
          requestBody,
          {},
          'POST'
        );
        boundaryEntitiesCreated.push(response);
        createdCount += requestBody.Boundary.length;
        persistEntityCreate(request, createdCount, totalBoundaryCount);
      } catch (error: any) {
        console.log(error);
        logger.error(`Failed to create boundary entities, Error: ${error.message}`);
        throw error;
      }
    }
    logger.info('Boundary entities created');
    logger.debug('Boundary entities response: ' + getFormattedStringForDebug(boundaryEntitiesCreated));
  }
}


function findMapValue(map: Map<any, any>, key: any): any | null {
  let foundValue = null;
  map.forEach((value, mapKey) => {
    if (mapKey.key === key.key && mapKey.value === key.value) {
      foundValue = value;
    }
  });
  return foundValue;
}

function modifyChildParentMap(childParentMap: Map<any, any>, boundaryMap: Map<any, any>): Map<string, string | null> {
  const modifiedMap: Map<string, string | null> = new Map();

  // Iterate over each entry in childParentMap
  childParentMap.forEach((value, key) => {
    // Get the modified key and value from boundaryMap
    const modifiedKey = findMapValue(boundaryMap, key) || null;
    const modifiedValue = value ? findMapValue(boundaryMap, value) : null;

    // Set the modified key-value pair in modifiedMap
    modifiedMap.set(modifiedKey, modifiedValue);
  });

  return modifiedMap;
}

async function confirmBoundaryParentCreation(request: any, code: any) {
  if (code) {
    const searchBody = {
      RequestInfo: request.body.RequestInfo,
    }
    const params: any = {
      hierarchyType: request?.query?.hierarchyType,
      tenantId: request?.query?.tenantId,
      codes: code
    }
    var retry = 6;
    var boundaryFound = false;
    // const header = {
    //   ...defaultheader,
    //   cachekey: `boundaryRelationShipSearch${params?.hierarchyType}${params?.tenantId}${params.codes || ''}${params?.includeChildren || ''}`,
    // }
    while (!boundaryFound && retry >= 0) {
      const response = await httpRequest(config.host.boundaryHost + config.paths.boundaryRelationship, searchBody, params, undefined, undefined);
      if (response?.TenantBoundary?.[0].boundary?.[0]) {
        boundaryFound = true;
      }
      else {
        logger.info("Boundary not found. Waiting for 1 seconds");
        retry = retry - 1
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    if (!boundaryFound) {
      throwError("BOUNDARY", 500, "INTERNAL_SERVER_ERROR", "Boundary creation failed, for the boundary with code " + code);
    }
  }
}

function extractCodesFromBoundaryRelationshipResponse(boundaries: any[]): any {
  const codes = new Set();
  for (const boundary of boundaries) {
    codes.add(boundary.code); // Add code to the Set
    if (boundary.children && boundary.children.length > 0) {
      const childCodes = extractCodesFromBoundaryRelationshipResponse(boundary.children); // Recursively get child codes
      childCodes.forEach((code: any) => codes.add(code)); // Add child codes to the Set
    }
  }
  return codes;
}

async function createBoundaryRelationship(request: any, boundaryMap: Map<{ key: string, value: string }, string>, modifiedChildParentMap: Map<string, string | null>) {
  const updatedBoundaryMap: Array<{ key: string, value: string }> = Array.from(boundaryMap).map(([key, value]) => ({ key: value, value: key.key }));
  const requestBody = { "RequestInfo": request.body.RequestInfo } as { RequestInfo: any; BoundaryRelationship?: any };
  const url = `${config.host.boundaryHost}${config.paths.boundaryRelationship}`;
  const params = {
    "tenantId": request?.query?.tenantId,
    "boundaryType": null,
    "codes": null,
    "includeChildren": true,
    "hierarchyType": request?.query?.hierarchyType
  };
  // const header = {
  //   ...defaultheader,
  //   cachekey: `boundaryRelationShipSearch${params?.hierarchyType}${params?.tenantId}${params.codes || ''}${params?.includeChildren || ''}`,
  // }

  const boundaryRelationshipResponse = await httpRequest(url, request.body, params, undefined, undefined);
  const boundaryData = boundaryRelationshipResponse?.TenantBoundary?.[0]?.boundary;
  const allCodes = extractCodesFromBoundaryRelationshipResponse(boundaryData);
  const alreadyPresentBoundaryCodes = []

  let flag = 1;

  const totalBoundaryCount = updatedBoundaryMap.length; // Total number of boundary relationships to process
  let createdCount = 0; // Initialize counter for successfully created relationships

  for (const { key: boundaryCode, value: boundaryType } of updatedBoundaryMap) {
    if (!allCodes.has(boundaryCode)) {
      const boundary = {
        tenantId: request?.query?.tenantId,
        boundaryType: boundaryType,
        code: boundaryCode,
        hierarchyType: request?.query?.hierarchyType,
        parent: modifiedChildParentMap.get(boundaryCode) || null
      };

      flag = 0;
      requestBody.BoundaryRelationship = boundary;
      await confirmBoundaryParentCreation(request, modifiedChildParentMap.get(boundaryCode) || null);
      try {
        const response = await httpRequest(`${config.host.boundaryHost}${config.paths.boundaryRelationshipCreate}`, requestBody, {}, 'POST', undefined, undefined, true);

        if (!response.TenantBoundary || !Array.isArray(response.TenantBoundary) || response.TenantBoundary.length === 0) {
          throwError("BOUNDARY", 500, "BOUNDARY_RELATIONSHIP_CREATE_ERROR");
        }

        // Increment the counter and log the count after each successful creation
        createdCount++;
        logger.info(`[${createdCount}/${totalBoundaryCount}] Boundary relationship created for boundaryType :: ${boundaryType} & boundaryCode :: ${boundaryCode} `);
        persistRelationship(request, createdCount, totalBoundaryCount);
      } catch (error) {
        // Log the error and rethrow to be caught by the outer try...catch block
        logger.error(`Error creating boundary relationship for boundaryType :: ${boundaryType} & boundaryCode :: ${boundaryCode} :: `, error);
        throw error;
      }
    }
    else {
      alreadyPresentBoundaryCodes.push(boundaryCode);
      logger.info(`Boundary relationship already exists for boundaryType :: ${boundaryType} & boundaryCode :: ${boundaryCode} `);
    }
  };
  if (flag === 1) {
    throwError("COMMON", 400, `VALIDATION_ERROR`, `Boundaries ${alreadyPresentBoundaryCodes.join(",")} already present in the hierarchyType ${request?.query?.hierarchyType}`);
  }
}

function addBoundaryCodeToData(withBoundaryCode: any[], withoutBoundaryCode: any[], boundaryMap: Map<any, any>) {
  const boundaryDataWithBoundaryCode = withBoundaryCode;
  const modifiedBoundaryDataWithBoundaryCode = boundaryDataWithBoundaryCode.map((array) => {
    return array.map((obj: any) => {
      if (obj.key === 'Boundary Code') {
        return obj.value;
      } else {
        return obj;
      }
    });
  });

  const boundaryDataForWithoutBoundaryCode = withoutBoundaryCode.map((row: any[]) => {
    const boundaryName = row[row.length - 1]; // Get the last element of the row
    const boundaryCode = findMapValue(boundaryMap, boundaryName); // Fetch corresponding boundary code from map
    return [...row, boundaryCode]; // Append boundary code to the row and return updated row
  });
  const boundaryDataForSheet = [...modifiedBoundaryDataWithBoundaryCode, ...boundaryDataForWithoutBoundaryCode];
  return boundaryDataForSheet;
}

const autoGenerateBoundaryCodes = async (request: any, localizationMap?: any) => {
  const { hierarchyType, tenantId } = request?.query || {};
  const fileResponse = await httpRequest(config.host.filestore + config.paths.filestore + "/url", {}, { tenantId, fileStoreIds: request?.query?.fileStoreId }, "get");
  const localizedBoundaryTab = getLocalizedName(config?.boundary?.boundaryTab, localizationMap);
  const boundaryData = await getSheetData(fileResponse?.fileStoreIds?.[0]?.url, localizedBoundaryTab, false, undefined, localizationMap);
  const updatedBoundaryData = updateBoundaryData(boundaryData);
  const hierarchy = await getHierarchy(request, tenantId, hierarchyType) || [];
  const modifiedBoundaryData = modifyBoundaryDataHeaders(updatedBoundaryData, hierarchy, localizationMap);
  const [withBoundaryCode, withoutBoundaryCode] = modifyBoundaryData(modifiedBoundaryData, localizationMap);
  const { mappingMap, countMap } = getCodeMappingsOfExistingBoundaryCodes(withBoundaryCode);
  const childParentMap = getChildParentMap(withoutBoundaryCode);
  const boundaryMap = await getAutoGeneratedBoundaryCodesHandler(withoutBoundaryCode, childParentMap, mappingMap, countMap, request);
  logger.info("Boundary Code Auto Generation Completed");
  await createBoundaryEntities(request, boundaryMap);
  logger.info("waiting for 2 secs to persist the boundary entities before creating boundary relationship")
  await new Promise(resolve => setTimeout(resolve, 2000));
  const modifiedChildParentMap = modifyChildParentMap(childParentMap, boundaryMap);
  await createBoundaryRelationship(request, boundaryMap, modifiedChildParentMap);
  const boundaryDataForSheet = addBoundaryCodeToData(withBoundaryCode, withoutBoundaryCode, boundaryMap);
  logger.info("Initiated the localisation message creation for the uploaded boundary");
  await transformAndCreateLocalisation(boundaryMap, request);
  const modifiedHierarchy = hierarchy.map(ele => `${hierarchyType}_${ele}`.toUpperCase())
  const headers = [...modifiedHierarchy, config?.boundary?.boundaryCode];
  const data = prepareDataForExcel(boundaryDataForSheet, hierarchy, boundaryMap);
  const localizedHeaders = getLocalizedHeaders(headers, localizationMap);
  const boundarySheetData: any = await createExcelSheet(data, localizedHeaders);
  const workbook = getNewExcelWorkbook();
  const boundarySheet = workbook.addWorksheet(localizedBoundaryTab);
  addDataToSheet(boundarySheet, boundarySheetData);
  const boundaryFileDetails: any = await createAndUploadFile(workbook, request);
  request.body.boundaryDetails.processedFileStoreId = boundaryFileDetails?.[0]?.fileStoreId;
  processAndPersist(request);
}

export async function boundaryBulkUpload(request: any, localizationMap?: any) {
  try {
    logger.info("Boundary Relationship Creation Starts");
    await autoGenerateBoundaryCodes(request, localizationMap);
  }
  catch (error: any) {
    console.log(error)
    persistError(error, request);
  }
}

export async function getBoundaryDetails(request: any) {
  const boundaryDetails = await getBoundaryDetailsViaDb(request?.query);
  request.body.boundaryDetails = boundaryDetails;
}

async function getBoundaryDetailsViaDb(searchBody: any) {
  const { hierarchyType, tenantId, id, status } = searchBody || {};

  let query = `SELECT * FROM ${config.DB_CONFIG.DB_BOUNDARY_DETAILS_TABLE_NAME} WHERE 1=1`;
  const values: any[] = [];

  if (tenantId) {
    query += ' AND tenantId = $' + (values.length + 1);
    values.push(tenantId);
  }
  if (hierarchyType) {
    query += ' AND hierarchyType = $' + (values.length + 1);
    values.push(hierarchyType);
  }
  if (id) {
    query += ' AND id = $' + (values.length + 1);
    values.push(id);
  }
  if (status) {
    query += ' AND status = $' + (values.length + 1);
    values.push(status);
  }

  try {
    const result = await executeQuery(query, values);
    formatRows(result.rows);
    return result.rows;
  } catch (error: any) {
    console.log(error)
    logger.error(`Error fetching boundary details: ${error.message}`);
    throw error;
  }
}

function formatRows(rows: any) {
  rows.forEach((row: any) => {
    row.tenantId = row.tenantid;
    delete row.tenantid;
    row.hierarchyType = row.hierarchytype;
    delete row.hierarchytype;
    row.fileStoreId = row.filestoreid;
    delete row.filestoreid;
    row.processedFileStoreId = row.processedfilestoreid;
    delete row.processedfilestoreid;
    row.additionalDetails = row.additionaldetails;
    delete row.additionaldetails;
    row.auditDetails = {
      createdTime: parseInt(row.createdtime),
      createdBy: row.createdby,
      lastModifiedTime: parseInt(row.lastmodifiedtime),
      lastModifiedBy: row.lastmodifiedby
    }
    delete row.createdtime;
    delete row.lastmodifiedtime;
    delete row.createdby;
    delete row.lastmodifiedby;
  });
}
