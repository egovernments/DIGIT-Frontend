export const processHierarchyAndData = (hierarchy, allData) => {
  const hierarchyLists = {};
  let hierarchicalData = {};

  try {
    // Process hierarchy
    hierarchy.forEach((item) => {
      hierarchyLists[item.boundaryType] = [];
    });

    // Process all sets of data
    allData.forEach((data) => {
      const dataHierarchicalData = {};

      // Process data for this set
      data.slice(1).forEach((row) => {
        // Exclude the header row
        let currentNode = dataHierarchicalData;
        hierarchy.forEach((item, index) => {
          const boundaryType = item.boundaryType;
          const cellValue = row[index];

          // Populate hierarchy lists
          if (!hierarchyLists[boundaryType].includes(cellValue) && cellValue !== null && cellValue !== "" && cellValue !== undefined) {
            hierarchyLists[boundaryType].push(cellValue);
          }

          // Populate hierarchical data
          if (!currentNode[cellValue]) {
            currentNode[cellValue] = {
              name: cellValue,
              boundaryType: boundaryType,
              children: {},
              data: null,
            };
          }

          // Assign row data to the correct hierarchical level
          if (index === hierarchy.length - 1) {
            currentNode[cellValue].data = createDataObject(data[0], row);
          }

          currentNode = currentNode[cellValue].children;
        });
      });

      // Merge dataHierarchicalData into hierarchicalData
      hierarchicalData = mergeHierarchicalData(hierarchicalData, dataHierarchicalData);
    });

    // Remove null element from children of each province
    Object.values(hierarchicalData).forEach((country) => {
      if (country.children[null]) {
        country.data = country.children[null].data;
        delete country.children[null];
      }
    });
  } catch (error) {
    // Return empty objects in case of error
    return { hierarchyLists: {}, hierarchicalData: {} };
  }

  return { hierarchyLists, hierarchicalData };
};

// Function to merge two hierarchical data objects
const mergeHierarchicalData = (data1, data2) => {
  for (const [key, value] of Object.entries(data2)) {
    if (!data1[key]) {
      data1[key] = value;
    } else {
      data1[key].data = value.data; // Merge data
      mergeHierarchicalData(data1[key].children, value.children); // Recursively merge children
    }
  }
  return data1;
};

// Function to create a data object with key-value pairs from headers and row data
const createDataObject = (headers, row) => {
  const dataObject = {};
  headers.forEach((header, index) => {
    dataObject[header] = row[index];
  });
  return dataObject;
};

// Find parent in hierarchy
export const findParent = (name, hierarchy, parent) => {
  if (!name || !hierarchy) return null;
  for (let key in hierarchy) {
    if (!parent) {
      let response = findParent(name, hierarchy[key]?.children, hierarchy[key]);
      if (response) return response;
    }
    if (hierarchy[key]?.name == name) return parent;
  }
};



export const fetchDropdownValues = (boundaryData, hierarchy) => {
  let dataMap = {};
  Object.values(boundaryData)?.forEach((item) => {
    Object.entries(item?.hierarchyLists)?.forEach(([key, value]) => {
      if (value) {
        if (dataMap?.[key]) dataMap[key] = new Set([...dataMap[key], ...value]);
        else dataMap[key] = new Set([...value]);
      }
    });
  });
  let processedHierarchyTemp = hierarchy.map((item) => {
    if (dataMap?.[item?.boundaryType])
      return {
        ...item,
        dropDownOptions: [...dataMap[item.boundaryType]].map((data, index) => ({
          name: data,
          code: data,
          boundaryType: item?.boundaryType,
          parentBoundaryType: item?.parentBoundaryType,
        })),
      };
    else return item;
  });
  return processedHierarchyTemp;
};

