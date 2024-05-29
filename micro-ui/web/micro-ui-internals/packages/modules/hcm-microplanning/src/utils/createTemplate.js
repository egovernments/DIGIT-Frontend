export const fetchBoundaryData = async (tenantId, hierarchyType, codes) => {
  // request for boundary relation api
  const reqCriteria = {
    url: `/boundary-service/boundary-relationships/_search`,
    params: { tenantId, hierarchyType, codes, includeChildren: true },
    body: {},
  };
  let response;
  try {
    response = (await Digit.CustomService.getResponse(reqCriteria))?.TenantBoundary?.[0]?.boundary || {};
  } catch (error) {
    throw new Error(error);
  }
  return response;
};

export const getFacilities = async (tenantId,body)=>{
    // request for boundary relation api
    const reqCriteria = {
      url: `/facility/v1/_search`,
      params: { tenantId },
      body: body,
    };
    let response;
    try {
      response = (await Digit.CustomService.getResponse(reqCriteria))?.Facilities || {};
    } catch (error) {
      throw new Error(error);
    }
    return response;
}

// export const fetchColumnsFromMdms = (schema)=>{
//   return
// }

/**
 *
 * @param {*} xlsxData
 * @param {*} boundaryData
 * @returns xlsxData with boundary data added
 */
const addBoundaryData = (xlsxData, boundaryData) => {
  // Return the original data if there is no boundary data to add
  if (!boundaryData) return xlsxData;

  // Initialize the array to hold new data
  let newXlsxData = [];

  // Recursive function to convert boundary data into sheet format
  const convertBoundaryDataToSheets = (boundaryData, currentBoundaryPredecessor = [], hierarchyAccumulator = [], dataAccumulator = []) => {
    // Return if boundary data is not valid or not an array
    if (!boundaryData || !Array.isArray(boundaryData)) return;

    // Clone the current boundary predecessor to avoid modifying the original data
    let rowData = _.cloneDeep(currentBoundaryPredecessor);
    // Clone the data accumulator to preserve the accumulated data
    let tempDataAccumulator = _.cloneDeep(dataAccumulator);
    // Use a set to accumulate unique hierarchy levels
    let tempHierarchyAccumulator = new Set(hierarchyAccumulator);

    // Iterate over each item in the boundary data array
    boundaryData.forEach((item) => {
      if (item?.code) {
        // Create a new row with the current item's code
        let tempRow = [...rowData, item?.code];
        let response;
        // Add the current item's boundary type to the hierarchy
        tempHierarchyAccumulator.add(item.boundaryType);

        // If the current item has children, recursively process them
        if (item.children)
          response = convertBoundaryDataToSheets(item.children, tempRow, tempHierarchyAccumulator, [...tempDataAccumulator, tempRow]);

        // Update the accumulators with the response from the recursive call
        if (response) {
          tempDataAccumulator = response.tempDataAccumulator;
          tempHierarchyAccumulator = response.tempHierarchyAccumulator;
        }
      }
    });

    // Return the accumulated data and hierarchy
    return { tempDataAccumulator, tempHierarchyAccumulator };
  };

  // Convert the boundary data into sheet format and extract the sorted data and hierarchy
  let { tempDataAccumulator: sortedBoundaryDataForXlsxSheet, tempHierarchyAccumulator: hierarchy } = convertBoundaryDataToSheets(boundaryData);

  // Add the hierarchy as the first row of the sheet
  sortedBoundaryDataForXlsxSheet = [[...hierarchy], ...sortedBoundaryDataForXlsxSheet];

  // Determine the maximum row length to ensure all rows have the same length
  const topIndex = Math.max(...sortedBoundaryDataForXlsxSheet.map((row) => row.length)) - 1;

  // Ensure all rows are of the same length by filling them with empty strings
  sortedBoundaryDataForXlsxSheet = sortedBoundaryDataForXlsxSheet.map((item) => {
    if (!item) {
      item = [];
    }
    while (item.length <= topIndex) {
      item.push("");
    }
    return item;
  });

  // Add the new sheet data to the original data
  newXlsxData = [...xlsxData, ...newXlsxData, { sheetName: "boundaryData", data: sortedBoundaryDataForXlsxSheet }];

  // Return the updated data
  return newXlsxData;
};

/**
 *
 * @param {array} xlsxData , xlsx data
 * @param {object} schema , schema to refer to
 * @returns {Array of Object} , xlsxData with schema data added
 *
 * adds schema data to sheets
 */
const addSchemaData = (xlsxData, schema) => {
  if (!schema) return xlsxData;
  let columnSchema = schema.schema?.Properties || {};
  let newXlsxData = [];
  let columnList = [[], [], [], []]; // Initialize columnList with four empty arrays

  Object.entries(columnSchema).forEach(([key, value]) => {
    columnList[0].push(key); // Add key to the first array

    columnList[1].push(value.type || ""); // Add type to the second array

    columnList[2].push(value.isRequired ? "MANDATORY" : "OPTIONAL"); // Add requirement status to the third array

    columnList[3].push(value.pattern || ""); // Add pattern to the fourth array
  });

  xlsxData.forEach(({ sheetName, data }) => {
    columnList.forEach((item, index) => {
      // Append the new items to the row
      if (data[index]) {
        data[index] = [...data[index], ...item];
      } else {
        data[index] = [...item];
      }
    });

    newXlsxData.push({ sheetName, data });
  });

  return newXlsxData;
};

/**
 *
 * @param {Array of Object} xlsxData
 * @param {string} hierarchyLevelName
 */
const devideXlsxDataHierarchyLevelWise = (xlsxData, hierarchyLevelName) => {
  // If no hierarchyLevelName is provided, return the original data
  if (!hierarchyLevelName) return xlsxData;

  // Initialize an array to hold the result
  const result = [];

  // Array to store the row with empty hierarchy level value
  let emptyHierarchyRow = [];

  // Iterate over each sheet in the xlsxData
  xlsxData.forEach((sheet) => {
    const sheetData = sheet.data;

    // Find the index of the hierarchy level name in the header row
    const hierarchyLevelIndex = sheetData[0].indexOf(hierarchyLevelName);

    // If the hierarchy level name is not found, skip this sheet
    if (hierarchyLevelIndex === -1) {
      result.push(sheet);
      return;
    }

    // Create a map to hold new sheets data based on hierarchy level values
    const sheetsMap = {};
    // Create a map to hold dangling data for each hierarchy value
    const danglingDataMap = {};
    // Flag to track if the last processed row had an empty hierarchy level value
    let lastWasEmpty = true;

    // Iterate through the sheet data starting from the second row (skipping header)
    for (let i = 1; i < sheetData.length; i++) {
      const row = sheetData[i];
      const hierarchyValue = row[hierarchyLevelIndex];

      // If the hierarchy value is not empty and there was previous empty data,
      if (emptyHierarchyRow.length && hierarchyValue !== "") {
        danglingDataMap[hierarchyValue] = emptyHierarchyRow;
      }

      // If hierarchy value is empty, store this row
      if (hierarchyValue === "" && lastWasEmpty) {
        emptyHierarchyRow.push(row);
      } else {
        // store the empty data in the danglingDataMap for the current hierarchy value
        if (emptyHierarchyRow.length && hierarchyValue == "") {
          emptyHierarchyRow = []; // Reset emptyHierarchyRow
        }
      }

      // If this hierarchy value hasn't been seen before, create a new sheet for it
      if (!sheetsMap[hierarchyValue] && hierarchyValue !== "") {
        // Include all rows with empty hierarchy level data or different hierarchy values
        sheetsMap[hierarchyValue] = {
          sheetName: hierarchyValue,
          data: [sheetData[0]], // Start with the header row
        };
      }

      // Include the current row if its hierarchy level data matches the sheet's hierarchy value
      if (hierarchyValue === row[hierarchyLevelIndex] && hierarchyValue !== "") {
        sheetsMap[hierarchyValue].data.push(row);
      }

      // Update the lastWasEmpty flag
      if (hierarchyValue === "" && !lastWasEmpty) {
        lastWasEmpty = true;
      } else if (hierarchyValue !== "") {
        lastWasEmpty = false;
      }
    }

    // Combine danglingDataMap with sheetsMap
    Object.keys(danglingDataMap).forEach((key) => {
      if (sheetsMap[key]) {
        // Combine dangling data with existing sheet data
        sheetsMap[key].data = [sheetData[0], ...danglingDataMap[key], ...sheetsMap[key].data.slice(1)];
      } else {
        // Create a new sheet for dangling data
        sheetsMap[key] = {
          sheetName: key,
          data: [...danglingDataMap[key], sheetData[0]], // Include header row
        };
      }
    });

    // Convert the sheets map to an array of objects and add to the result
    result.push(...Object.values(sheetsMap));
  });

  return result;
};



function filterBoundaries(boundaryData, boundaryFilters) {
  // Define a helper function to recursively filter boundaries
  function filterRecursive(boundary) {
      // Find the filter that matches the current boundary
      const filter = boundaryFilters?.find(f => f.code === boundary.code && f.boundaryType === boundary.boundaryType);

      // If no filter is found, return the boundary with its children filtered recursively
      if (!filter) {
          return {
              ...boundary,
              children: boundary.children.map(filterRecursive)
          };
      }

      // If the boundary has no children, handle the case where includeAllChildren is false
      if (!boundary.children.length) {
          // Return the boundary with an empty children array
          return {
              ...boundary,
              children: []
          };
      }

      // If includeAllChildren is true, return the boundary with all children
      if (filter.includeAllChildren) {
          return {
              ...boundary,
              children: boundary.children.map(filterRecursive)
          };
      }

      // Filter children based on the filters
      const filteredChildren = boundary.children
          .filter(child =>
              boundaryFilters.some(f => f.code === child.code && f.boundaryType === child.boundaryType))
          .map(filterRecursive);

      // Return the boundary with filtered children
      return {
          ...boundary,
          children: filteredChildren
      };
  }

  // Map through the boundary data and apply the recursive filter function to each boundary
  const filteredData = boundaryData.map(filterRecursive);
  return filteredData;
}




/**
 * Retrieves all facilities for a given tenant ID.
 * @param tenantId The ID of the tenant.
 * @param requestBody The request body containing additional parameters.
 * @returns An array of facilities.
 */
async function getAllFacilities(tenantId, requestBody) {
  // Retrieve all facilities for the given tenant ID
  const facilitySearchBody = {
    RequestInfo: requestBody?.RequestInfo,
    Facility: { isPermanent: true }
  };

  const facilitySearchParams = {
    limit: 50,
    offset: 0,
    tenantId: tenantId
  };

  const searchedFacilities = [];
  let searchAgain = true;

  while (searchAgain) {
    searchAgain = await getFacilities(searchedFacilities, facilitySearchParams, facilitySearchBody);
    facilitySearchParams.offset += 50;
  }

  return searchedFacilities;
}


/**
 *
 * @param {boolean} hierarchyLevelWiseSheets
 * @param {string} hierarchyLevelName , if district Wise is true, then this must be present,
 * @param {boolean} addFacilityData
 * @param {Object} schema
 *
 */
export const createTemplate = async ({ hierarchyLevelWise: hierarchyLevelWiseSheets = true, hierarchyLevelName, addFacilityData = false, schema, boundaries, tenentId, hierarchyType }) => {
  if(!boundaries) throw Error("Boundaries not provided")
  const rootBoundary = boundaries?.filter((boundary) => boundary.isRoot);
  const boundaryData = await fetchBoundaryData(tenentId, hierarchyType, rootBoundary?.[0]?.code);
  const filteredBoundaryData = filterBoundaries(boundaryData,boundaries)
  let xlsxData = [];
  // adding boundary data to xlsxData
  xlsxData = addBoundaryData(xlsxData, boundaryData);

  if (hierarchyLevelWiseSheets) {
    // district wise boundary Data sheets
    xlsxData = devideXlsxDataHierarchyLevelWise(xlsxData, hierarchyLevelName);
    if (addFacilityData) {
      // adding facility sheet
    } else {
      // not adding facility sheet
      // adding schema data to xlsxData
      xlsxData = addSchemaData(xlsxData, schema);
    }
  } else {
    // total boundary Data in one sheet
    if (addFacilityData) {
      // adding facility sheet
    } else {
      // not adding facility sheet

      // adding schema data to xlsxData
      xlsxData = addSchemaData(xlsxData, schema);
    }
  }
  return xlsxData;
};
