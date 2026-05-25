/* methid to get date from epoch */
export const convertEpochToDate = (dateEpoch) => {
  // Returning null in else case because new Date(null) returns initial date from calender
  if (dateEpoch) {
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${year}-${month}-${day}`;
  } else {
    return null;
  }
};

export const convertDateToEpoch = (dateString) => {
  // Create a Date object from the input date string
  const date = new Date(dateString);

  // Convert the date to epoch time (seconds)
  return Math.floor(date.getTime());
};

export const convertEpochFormateToDate = (dateEpoch) => {
  // Returning null in else case because new Date(null) returns initial date from calender
  if (dateEpoch) {
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}/${month}/${year}`;
  } else {
    return null;
  }
};

/* function returns only the city which user has access to  */
/* exceptional incase of state level user , where return all cities*/


export const deleteProjectStaff = async (projectStaff) => {
  Digit.ProjectService.delete_staff(projectStaff).then((res) => {});
};

export const getProjectDetails = async (projects, tenantId, includeDescendants, includeImmediateChildren) => {
  let projectDetails = [];
  await Digit.ProjectService.search_project({ tenantId, projects, includeDescendants, includeImmediateChildren })
    .then((res) => {
      projectDetails = res?.Project;
    })
    .catch((err) => err);
  return projectDetails;
};
