const initializeDssModule = async ({ tenantId }) => {
    const projectContextPath = window?.globalConfigs?.getConfig("PROJECT_CONTEXT_PATH") || "health-project";
    const individualContextPath = window?.globalConfigs?.getConfig("INDIVIDUAL_CONTEXT_PATH") || "health-individual";

    let user = Digit?.SessionStorage.get("User");

    const getProjectTypes = (projectTypesDetails, projectList) => {
        let keys = ["code", "dashboardUrls", "id"];
        const validProjectTypeIds = new Set(projectList.map((p) => p.projectTypeId));

        return projectTypesDetails
            .filter((projectType) => validProjectTypeIds.has(projectType.id))
            .map((projectType) =>
                Object.keys(projectType)
                    .filter((i) => keys.includes(i))
                    .reduce((acc, key) => {
                        acc[key] = projectType[key];
                        return acc;
                    }, {})
            );
    };

    try {
        // Fetch Staff Data
        const staffResponse = await Digit.CustomService.getResponse({
            url: `/${projectContextPath}/staff/v1/_search`,
            useCache: false,
            method: "POST",
            userService: false,
            params: { tenantId, offset: 0, limit: 100 },
            body: { ProjectStaff: { staffId: [user?.info?.uuid] } },
        });

        if (!staffResponse || !staffResponse.ProjectStaff?.length) {
            throw new Error("No Staff found");
        }

        const staffs = staffResponse.ProjectStaff;
        const projectIds = staffs.map((staff) => staff.projectId);

        // Fetch Projects Data
        const projectResponse = await Digit.CustomService.getResponse({
            url: `/${projectContextPath}/v1/_search`,
            useCache: false,
            method: "POST",
            userService: false,
            params: { tenantId, offset: 0, limit: 100 },
            body: { Projects: projectIds.map((id) => ({ id, tenantId })) },
        });

        if (!projectResponse || !projectResponse.Project?.length) {
            throw new Error("No linked projects found");
        }

        const projects = projectResponse.Project;

        // Fetch Boundary Data
        const nationalLevelProject = projects.find((p) => p.address?.boundary);
        if (!nationalLevelProject) {
            throw new Error("No valid project with boundary data found");
        }

        // Fetch Project Type from MDMS Data
        const projectTypeResponse = await Digit.CustomService.getResponse({
            url: `/mdms-v2/v1/_search`,
            useCache: false,
            method: "POST",
            userService: false,
            params: { tenantId, offset: 0, limit: 100 },
            body: {
                MdmsCriteria: {
                    tenantId,
                    moduleDetails: [
                        {
                            moduleName: "HCM-PROJECT-TYPES",
                            masterDetails: [{ name: "projectTypes" }],
                        },
                    ],
                },
            },
        });

        console.log(projectTypeResponse, "projectTypeResponse");

        const projectTypes = getProjectTypes(projectTypeResponse?.MdmsRes?.["HCM-PROJECT-TYPES"]?.projectTypes || [], projects);

        if (!projectTypes || !projectTypes.length) {
            throw new Error("Project types not found");
        }

        console.log(projects, projectTypeResponse, "values");

        let projectInfo = [];

        for (let i = 0; i < projects.length; i++) {
            let project = projects[i];
            console.log(project, "ppppppppppppppppp");

            let projectType = projectTypes.find((type) => type.id === project.projectTypeId);
            if (!projectType) continue;

            let beneficiaryType = project.additionalDetails?.projectType?.beneficiaryType || "HOUSEHOLD";
            let cycles = project.additionalDetails?.projectType?.cycles || [];
            let boundaryType = project?.address?.boundaryType;

            if (projectType && boundaryType) {
                projectInfo.push({
                    projectType, // Storing the entire projectType object
                    cycles,
                    beneficiaryType,
                    startDate: project?.startDate,
                    endDate: project?.endDate,
                    boundaries: {
                        boundary: project?.address?.boundary,
                        boundaryType: project?.address?.boundaryType,
                    },
                });
            }
        }

        // Save to session storage
        Digit.SessionStorage.set("projectInfo", projectInfo);

    } catch (error) {
        console.error("Error in initializeDssModule:", error);
        throw new Error(error?.response?.data?.Errors?.[0]?.message || "An unknown error occurred");
    }
};

export default initializeDssModule;
