import _ from "lodash";

const destroySessionHelper = (currentPath, pathList, sessionName) => {
  if (!pathList.includes(currentPath)) {
    sessionStorage.removeItem(`Digit.${sessionName}`);
  }
};

function createStatusMap(data, boundaryHierarchy) {
  // Initialize an empty map to store counts of each type
  const statusMap = {};
  boundaryHierarchy.forEach((boundary) => {
    statusMap[boundary.boundaryType] = 0;
  });

  if (data.length === 0) return statusMap;
  // Iterate over each object in the array
  data?.forEach((item) => {
    // If the type already exists in the map, increment the count
    if (statusMap[item.type]) {
      statusMap[item.type]++;
    } else {
      // Otherwise, initialize the count for this type
      statusMap[item.type] = 1;
    }
  });

  return statusMap;
}

export default {
  destroySessionHelper,
  createStatusMap,
};
