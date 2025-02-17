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

export const convertDateToEpoch= (dateString) => {
    // Create a Date object from the input date string
    const date = new Date(dateString);

    // Convert the date to epoch time (seconds)
    return Math.floor(date.getTime());
}
export const getPasswordPattern = () => {
    return /^[a-zA-Z0-9@#$%]{8,15}$/i
}

const groupProjectsByProjectType = (projectDetails) => {
    return projectDetails.reduce(
        (result, item) => ({
            ...result,
            [item?.projectType]: [
                ...(result[item?.projectType] || []),
                item,
            ],
        }),
        {},
    );
}

const consolidateProjectDetails = (projects) => {
    let compressedProjectDetails = [];
    for (let i = 0; i < projects.length; i++) {
        compressedProjectDetails.push({
            name: projects[i].name,
            projectId: projects[i].id,
            startDate: projects[i].startDate,
            endDate: projects[i].endDate,
            boundaryType: projects[i]?.address?.boundaryType,
            boundary: projects[i]?.address?.boundary
        })
    }
    return compressedProjectDetails;
}

const flatten = (projects,flattenedArray) => {
    projects.forEach(project => {
        flattenedArray.push(project);
        if (project?.descendants?.length > 0) {
            flatten(project.descendants, flattenedArray);
        }
    });
    return flattenedArray;
}

export const getProjectName = (projectDetails, projectId) => {
    let projectName = "";
    for (const key in projectDetails) {
        projectName = projectDetails?.length > 0 ? projectDetails.find(el => el.projectId === projectId)?.name : ""
    }
    return projectName;
}

export const getHighLevelProjects = (projectDetails) => {
    let highLevelProjects = [];
    const heirarchy = {
        [Digit.Enums.MDMSBoundaryLabels.NATIONAL] : 0,
        [Digit.Enums.MDMSBoundaryLabels.PROVINCE] : 1,
        [Digit.Enums.MDMSBoundaryLabels.DISTRICT] : 2,
        [Digit.Enums.MDMSBoundaryLabels.ADMINISTRATIVE_PROVINCE] : 3,
        [Digit.Enums.MDMSBoundaryLabels.LOCALITY] : 4,
        [Digit.Enums.MDMSBoundaryLabels.VILLAGE] : 5,
    }
    let projectTypeProjectDetailsMapping = groupProjectsByProjectType(projectDetails);
    Object.keys(projectTypeProjectDetailsMapping).forEach((key) => {
        const projectsInfo = projectTypeProjectDetailsMapping[key];
        const sortedProjectsInfo = projectsInfo.sort((a, b) => {
            return heirarchy[a.address?.boundaryType] - heirarchy[b.address?.boundaryType];
        })
        highLevelProjects.push(sortedProjectsInfo[0]);
    })
    return highLevelProjects?.length > 0 ?
        consolidateProjectDetails(highLevelProjects) : [];
}

const emptyLowerLevelProjects = (boundaryLevel, campaignMap) => {
    const heirarchy = {
        [Digit.Enums.MDMSBoundaryLabels.NATIONAL] : 0,
        [Digit.Enums.MDMSBoundaryLabels.PROVINCE] : 1,
        [Digit.Enums.MDMSBoundaryLabels.DISTRICT] : 2,
        [Digit.Enums.MDMSBoundaryLabels.ADMINISTRATIVE_PROVINCE] : 3,
        [Digit.Enums.MDMSBoundaryLabels.LOCALITY] : 4,
        [Digit.Enums.MDMSBoundaryLabels.VILLAGE] : 5,
    }
    for (const key in heirarchy) {
        if (heirarchy[boundaryLevel] < heirarchy[key]) {
            campaignMap[key] = [];
        }
    }
}

export const getCurrentProjects = (projectId, projectDetailsWithDescendants) => {
    // include both the current projectid details and its descendants details
    let lowerLevelProjectDetails = (projectDetailsWithDescendants?.length === 1) ?
        projectDetailsWithDescendants[0]?.descendants?.filter((item) => (item?.parent === projectId )) || [] : [];
    let flattenedProjectDetails = [
        ...projectDetailsWithDescendants, ...lowerLevelProjectDetails
    ]
    let consolidatedProjectInfo = consolidateProjectDetails(flattenedProjectDetails);
    let currentProjects = {
        [consolidatedProjectInfo[0]?.boundaryType] : [consolidatedProjectInfo[0]],
    }
    if (consolidatedProjectInfo.length > 1) {
        currentProjects[consolidatedProjectInfo[1].boundaryType] = consolidatedProjectInfo.slice(1);
        emptyLowerLevelProjects(consolidatedProjectInfo[1].boundaryType, currentProjects);
    } else {
        emptyLowerLevelProjects(consolidatedProjectInfo[0]?.boundaryType, currentProjects);
    }
    return currentProjects;
}

export const pdfDownloadLink = (documents = {}, fileStoreId = "", format = "") => {
    /* Need to enhance this util to return required format*/

    let downloadLink = documents[fileStoreId] || "";
    let differentFormats = downloadLink?.split(",") || [];
    let fileURL = "";
    differentFormats.length > 0 &&
    differentFormats.map((link) => {
        if (!link.includes("large") && !link.includes("medium") && !link.includes("small")) {
            fileURL = link;
        }
    });
    return fileURL;
};

/*   method to get filename  from fielstore url*/
export const pdfDocumentName = (documentLink = "", index = 0) => {
    let documentName = decodeURIComponent(documentLink.split("?")[0].split("/").pop().slice(13)) || `Document - ${index + 1}`;
    return documentName;
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

const objectsEqual = (o1, o2) => Object.keys(o1).length === Object.keys(o2).length && Object.keys(o1).every((p) => o1[p] === o2[p]);

export const arraysEqual = (a1, a2) => a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));


/* function returns only the city which user has access to  */
/* exceptional incase of state level user , where return all cities*/
export const getCityThatUserhasAccess = (cities = []) => {
    const userInfo = Digit.UserService.getUser();
    let roleObject = {};
    userInfo?.info?.roles.map((roleData) => { roleObject[roleData?.code] = roleObject[roleData?.code] ? [...roleObject[roleData?.code], roleData?.tenantId] : [roleData?.tenantId] });
    const tenant = Digit.ULBService.getCurrentTenantId();
    if (roleObject[Digit.Utils?.hrmsRoles?.[0]].includes(Digit.ULBService.getStateId())) {
        return cities;
    }
    return cities.filter(city => roleObject[Digit.Utils?.hrmsRoles?.[0]]?.includes(city?.code));
}

const updateSelectedBoundaryProject = (consolidatedCurrentProject, boundaryType, assignmentDetails) => {
    switch (boundaryType)  {
        case Digit.Enums.MDMSBoundaryLabels.NATIONAL:
            assignmentDetails.selectedNation = consolidatedCurrentProject;
            break;
        case Digit.Enums.MDMSBoundaryLabels.PROVINCE:
            assignmentDetails.selectedProvince = consolidatedCurrentProject;
            break;
        case Digit.Enums.MDMSBoundaryLabels.DISTRICT:
            assignmentDetails.selectedDistrict = consolidatedCurrentProject;
            break;
        case Digit.Enums.MDMSBoundaryLabels.ADMINISTRATIVE_PROVINCE:
            assignmentDetails.selectedAP = consolidatedCurrentProject;
            break;
        case Digit.Enums.MDMSBoundaryLabels.LOCALITY:
            assignmentDetails.selectedLocality = consolidatedCurrentProject;
            break;
        case Digit.Enums.MDMSBoundaryLabels.VILLAGE:
            assignmentDetails.selectedVillage = consolidatedCurrentProject;
            break;
    }
}

export const getProjectStaff = async (userId, tenantId) => {
    let projectStaff;
    await Digit.ProjectService.search_staff({userId, tenantId}).then((res) => {
        projectStaff = res?.ProjectStaff;
    });
    return projectStaff;
}

export const deleteProjectStaff = async (projectStaff) => {
    Digit.ProjectService.delete_staff(projectStaff).then((res) => {
    });
}

export const getProjectDetails = async (projects, tenantId, includeDescendants,includeImmediateChildren) => {
    let projectDetails = []
    await Digit.ProjectService.search_project({tenantId, projects, includeDescendants,includeImmediateChildren}).then((res) => {
        projectDetails = res?.Project;
    }).catch((err) => err);
    return projectDetails;
}

export const getAssignmentDetails = async (assignedCampaigns, tenantId, projectDateDetails) => {
    let projectDetails = assignedCampaigns?.length > 0 ? assignedCampaigns : await Digit.ProjectService.getProjectDetails({userId: Digit.SessionStorage.get("User")?.info?.uuid, tenantId});
    let allAssignments = [];
    for (let i = 0; i < projectDetails?.length; i++) {
        let assignmentDetails = {
            key: i + 1,
            fromDate: convertEpochToDate(projectDateDetails[projectDetails?.[i]?.id]?.startDate) || convertEpochToDate(projectDetails?.[i]?.startDate),
            toDate: convertEpochToDate(projectDateDetails[projectDetails?.[i]?.id]?.endDate) || convertEpochToDate(projectDetails?.[i]?.startDate),
            selectedProject: {
                id: projectDetails?.[i]?.id,
                projectType: projectDetails?.[i]?.projectType,
                projectTypeId: projectDetails?.[i]?.projectTypeId,
                boundary: projectDetails?.[i]?.address?.boundary,
                boundaryType: projectDetails?.[i]?.address?.boundaryType,
                i18text: `${projectDetails?.[i]?.name}_${projectDetails?.[i]?.address?.boundary}`,
            }
        }
        allAssignments.push(assignmentDetails);
    }
    return allAssignments;
}

export const getProjectNameLabel = (allProjects, projectId) => {
    for(const key in allProjects) {
        let projectName = allProjects[key].find((project) => project.projectId === projectId)?.name;
        if (projectName) {
            return projectName;
        }
    }
    return "UnNamed";
}

export const pushIfKeyValuePairNotExists = (arr, key, value, newObj) => {
    const exists = arr.some(obj => obj[key] === value);

    if (!exists) {
        arr.push(newObj);
    }
}




