import _ from "lodash";


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

function sortSecondListBasedOnFirstListOrder(firstList, secondList) {
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

const computeGeojsonWithMappedProperties = ({campaignType,fileType,templateIdentifier,validationSchemas}) => {
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

export default { formatDates , computeGeojsonWithMappedProperties};
