import _ from "lodash";
import { findParent } from "../utils/processHierarchyAndData";
import { EXCEL,LOCALITY } from "../configs/constants";
const formatDates = (value, type) => {
  if (type != "EPOC" && (!value || Number.isNaN(value))) {
    value = new Date();
  }
  switch (type) {
    case "date":
      return new Date(value)?.toISOString?.()?.split?.("T")?.[0];
    case "datetime":
      return new Date(value).toISOString();
    case "EPOC":
      return String(new Date(value)?.getTime());
  }
};

// get schema for validation
const getSchema = (campaignType, type, section, schemas) => {
  return schemas.find((schema) => {
    if (!schema.campaignType) {
      return schema.type === type && schema.section === section;
    }
    return schema.campaignType === campaignType && schema.type === type && schema.section === section;
  });
};

// Sorting 2 lists, The first list is a list of string and second one is list of Objects
const sortSecondListBasedOnFirstListOrder = (firstList, secondList)=> {
  // Create a map to store the indices of elements in the first list
  const indexMap = {};
  firstList.forEach((value, index) => {
    indexMap[value] = index;
  });

  // Sort the second list based on the order of elements in the first list
  secondList.sort((a, b) => {
    // Get the mappedTo values of each object
    const mappedToA = a.mappedTo;
    const mappedToB = b.mappedTo;

    // Get the indices of mappedTo values in the first list
    const indexA = indexMap[mappedToA];
    const indexB = indexMap[mappedToB];

    // Compare the indices
    return indexA - indexB;
  });

  return secondList;
}

const computeGeojsonWithMappedProperties = ({ campaignType, fileType, templateIdentifier, validationSchemas }) => {
  const schemaData = getSchema(campaignType, fileType, templateIdentifier, validationSchemas);
  let schemaKeys;
  if (schemaData?.schema?.["Properties"]) schemaKeys = hierarchy.concat(Object.keys(schemaData.schema["Properties"]));
  // Sorting the resourceMapping list inorder to maintain the column sequence
  const sortedSecondList = sortSecondListBasedOnFirstListOrder(schemaKeys, resourceMapping);
  // Creating a object with input data with MDMS keys
  const newFeatures = fileData.data["features"].map((item) => {
    let newProperties = {};

    sortedSecondList.forEach((e) => {
      newProperties[e["mappedTo"]] = item["properties"][e["mappedFrom"]];
    });
    item["properties"] = newProperties;
    return item;
  });
  let data = fileData.data;
  data["features"] = newFeatures;
  return data;
};

const destroySessionHelper = (currentPath, pathList, sessionName) => {
  if (!pathList.includes(currentPath)) {
    sessionStorage.removeItem(`Digit.${sessionName}`);
  }
};

const convertGeojsonToExcelSingleSheet = (InputData, fileName) => {
  if (!InputData || !Array.isArray(InputData) || InputData.length === 0) {
    return null;
  }

  // Extract keys from the first feature's properties
  const keys = Object.keys(InputData?.[0]?.properties);

  if (!keys || keys.length === 0) {
    return null;
  }

  // Extract corresponding values for each feature
  const values = InputData?.map((feature) => {
    return keys.map((key) => feature.properties[key]);
  });

  // Group keys and values into the desired format
  return { [fileName]: [keys, ...values] };
};

// function that handles dropdown selection. used in: mapping and microplan preview
const handleSelection = (e, boundaryType, boundarySelections, hierarchy, setBoundarySelections, boundaryData, setIsLoading) => {
  setIsLoading(true);
  if (!e || !boundaryType) return;
  let oldSelections = boundarySelections;
  let selections = e.map((item) => item?.[1]?.name);

  // filtering current option. if something is selected and its parent is not selected it will be discarded
  if (hierarchy && Object.keys(oldSelections))
    for (let id = 0; id < hierarchy.length; id++) {
      if (id - 1 >= 0) {
        if (
          Array.isArray(oldSelections?.[hierarchy[id]?.boundaryType]) &&
          hierarchy[id - 1].boundaryType &&
          oldSelections[hierarchy[id - 1].boundaryType]
        ) {
          oldSelections?.[hierarchy[id - 1]]?.map((e) => e.name);
          let tempCheckList = [];
          Object.entries(oldSelections)?.forEach(([key, value]) => {
            if (key !== boundaryType) tempCheckList = [...tempCheckList, ...value.map((e) => e.name)];
          });
          oldSelections[hierarchy[id].boundaryType] = oldSelections[hierarchy[id]?.boundaryType].filter((e) => {
            let parent = findParent(e?.name, Object.values(boundaryData)?.[0]?.hierarchicalData);
            return (
              (parent.some((e) => tempCheckList.includes(e.name)) && tempCheckList.includes(e?.name)) ||
              (e?.parentBoundaryType === undefined && selections?.length !== 0)
            );
          });
        }
      }
    }

  let tempData = {};
  e.forEach((item) => {
    // insert new data into tempData
    if (tempData[boundaryType]) tempData[boundaryType] = [...tempData[boundaryType], item?.[1]];
    else tempData[boundaryType] = [item?.[1]];
  });
  if (e.length === 0) {
    tempData[boundaryType] = [];
  }
  setBoundarySelections({ ...oldSelections, ...tempData });
};

// Preventing default action when we scroll on input[number] is that it increments or decrements the number
const inputScrollPrevention = (e) => {
  e.target.addEventListener(
    "wheel",
    function (e) {
      e.preventDefault();
    },
    { passive: false }
  );
};

// Construct api request body
const mapDataForApi = (data, Operators, microplanName, campaignId, status) => {
  let files = [],
    resourceMapping = [];
  if (data && data.upload) {
    Object.values(data?.upload).forEach((item) => {
      if (item?.error) return;
      const data = { filestoreId: item.filestoreId, inputFileType: item.fileType, templateIdentifier: item.section, id: item.fileId };
      files.push(data);
    });
    Object.values(data?.upload).forEach((item) => {
      if (item?.error) return;
      resourceMapping.push(item?.resourceMapping);
    });
    resourceMapping = resourceMapping.flatMap((inner) => inner);
  }

  // return a Create API body
  return {
    PlanConfiguration: {
      status,
      tenantId: Digit.ULBService.getStateId(),
      name: microplanName,
      executionPlanId: campaignId,
      files,
      assumptions: data?.hypothesis?.map((item) => {
        let templist = JSON.parse(JSON.stringify(item));
        return templist;
      }),
      operations: data?.ruleEngine?.map((item) => {
        const data = JSON.parse(JSON.stringify(item));
        const operator = Operators.find((e) => e.name === data.operator);
        if (operator && operator.code) data.operator = operator?.code;
        return data;
      }),
      resourceMapping,
    },
  };
};

const resourceMappingAndDataFilteringForExcelFiles = (schemaData, hierarchy, selectedFileType, fileDataToStore,t, translatedData = true) => {
  
  let resourceMappingData = [];
  let newFileData = {};
  let toAddInResourceMapping;
  if (selectedFileType.id === EXCEL && fileDataToStore) {
    // Extract all unique column names from fileDataToStore and then doing thir resource mapping
    const columnForMapping = new Set(Object.values(fileDataToStore).flatMap((value) => value?.[0] || []));
    if (schemaData?.schema?.["Properties"]) {
      let toChange;
      if (LOCALITY && hierarchy[hierarchy?.length - 1] !== LOCALITY) toChange = hierarchy[hierarchy?.length - 1];
      const schemaKeys = Object.keys(schemaData.schema["Properties"]).concat(hierarchy);
      schemaKeys.forEach((item) => {
        if ((translatedData && columnForMapping.has(t(item))) || (!translatedData && columnForMapping.has(item))) {
          if (LOCALITY && toChange === item) {
            toAddInResourceMapping = {
              mappedFrom: t(item),
              mappedTo: LOCALITY,
            };
          }
          resourceMappingData.push({
            mappedFrom: t(item),
            mappedTo: item,
          });
        }
      });
    }

    // Filtering the columns with respect to the resource mapping and removing the columns that are not needed
    Object.entries(fileDataToStore).forEach(([key, value]) => {
      let data = [];
      let headers = [];
      let toRemove = [];
      if (value && value.length > 0) {
        value[0].forEach((item, index) => {
          const mappedTo = resourceMappingData.find((e) => (translatedData && e.mappedFrom === item) || (!translatedData && e.mappedFrom === t(item)))?.mappedTo;
          if (!mappedTo) {
            toRemove.push(index);
            return;
          }
          headers.push(mappedTo);
          return;
        });
        for (let i = 1; i < value?.length; i++) {
          let temp = [];
          for (let j = 0; j < value[i].length; j++) {
            if (!toRemove.includes(j)) {
              temp.push(value[i][j]);
            }
          }
          data.push(temp);
        }
      }
      newFileData[key] = [headers, ...data];
    });
  }
  resourceMappingData.pop();
  resourceMappingData.push(toAddInResourceMapping);
  return { tempResourceMappingData: resourceMappingData, tempFileDataToStore: newFileData };
};




export default {
  formatDates,
  computeGeojsonWithMappedProperties,
  destroySessionHelper,
  mapDataForApi,
  inputScrollPrevention,
  handleSelection,
  convertGeojsonToExcelSingleSheet,
  resourceMappingAndDataFilteringForExcelFiles,
  sortSecondListBasedOnFirstListOrder
};
