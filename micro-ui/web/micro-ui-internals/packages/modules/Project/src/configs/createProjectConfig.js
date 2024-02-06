export const createProjectConfig = {
  tenantId: "pg",
  moduleName: "commonUiConfig",
  CreateProjectConfig: [
    {
      defaultValues: {
        basicDetails_dateOfProposal: "",
        basicDetails_hasSubProjects: { name: "COMMON_YES", code: "COMMON_YES" },
        withSubProject_project_estimatedCostInRs: 0,
      },
      metaData: {
        showNavs: true,
        currentFormCategory: "project",
      },
      form: [
        {
          head: "",
          subHead: "",
          body: [
            {
              inline: true,
              label: "ES_COMMON_PROPOSAL_DATE",
              isMandatory: false,
              key: "basicDetails_dateOfProposal",
              type: "date",
              disable: false,
              populators: { name: "basicDetails_dateOfProposal" },
            },
            {
              inline: true,
              label: "ES_COMMON_PROJECT_NAME",
              isMandatory: true,
              key: "basicDetails_projectName",
              type: "text",
              disable: false,
              preProcess: {
                convertStringToRegEx: ["populators.validation.pattern"],
              },
              populators: {
                name: "basicDetails_projectName",
                error: "PROJECT_PATTERN_ERR_MSG_PROJECT_NAME",
                validation: { pattern: /^[^\$\"<>?\\\\~`!@$%^()+={}\[\]*:;“”‘’]{1,50}$/i, minlength: 2 },
              },
            },
            {
              inline: true,
              label: "PROJECT_DESC",
              isMandatory: false,
              key: "basicDetails_projectDesc",
              type: "text",
              disable: false,
              preProcess: {
                convertStringToRegEx: ["populators.validation.pattern"],
              },
              populators: {
                name: "basicDetails_projectDesc",
                error: "PROJECT_PATTERN_ERR_MSG_PROJECT_DESC",
                validation: { pattern: /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{1,50}$/i, minlength: 2 },
              },
            },
            {
              isMandatory: false,
              key: "basicDetails_hasSubProjects",
              type: "radio",
              label: "WORKS_HAS_SUB_PROJECT_LABEL",
              disable: false,
              populators: {
                name: "basicDetails_hasSubProjects",
                optionsKey: "name",
                error: "Required",
                required: false,
                options: [
                  {
                    code: "COMMON_YES",
                    name: "COMMON_YES",
                  },
                  {
                    code: "COMMON_NO",
                    name: "COMMON_NO",
                  },
                ],
              },
            },
            {
              key: "citizenInfoLabel",
              type: "component",
              component: "CitizenInfoLabel",
              label: "",
              disable: false,
              preProcess: {
                translate: ["customProps.info", "customProps.text"],
                updateDependent: ["customProps.className"],
              },
              customProps: {
                showInfo: true,
                info: "WORKS_INFO",
                text: "WORKS_SUB_PROJECT_INFO_MSG",
                className: "project-banner",
                fill: "#CC7B2F",
              },
              populators: { name: "basicDetails_dateOfProposal" },
            },
          ],
        },
        {
          navLink: "Project_Details",
          sectionFormCategory: "noSubProject",
          head: "",
          body: [
            {
              isMandatory: true,
              key: "noSubProject_owningDepartment",
              type: "radioordropdown",
              label: "PROJECT_OWNING_DEPT",
              disable: false,
              populators: {
                name: "noSubProject_owningDepartment",
                optionsKey: "name",
                error: "WORKS_REQUIRED_ERR",
                required: true,
                optionsCustomStyle: {
                  top: "2.5rem",
                },
                mdmsConfig: {
                  masterName: "Department",
                  moduleName: "common-masters",
                  localePrefix: "COMMON_MASTERS_DEPARTMENT",
                },
              },
            },
            {
              isMandatory: false,
              key: "noSubProject_targetDemocracy",
              type: "radioordropdown",
              label: "PROJECT_TARGET_DEMOGRAPHY",
              disable: false,
              populators: {
                name: "noSubProject_targetDemography",
                optionsKey: "name",
                error: "WORKS_REQUIRED_ERR",
                required: false,
                optionsCustomStyle: {
                  top: "2.5rem",
                },
                mdmsConfig: {
                  masterName: "TargetDemography",
                  moduleName: "works",
                  localePrefix: "COMMON_MASTERS",
                },
              },
            },
            {
              inline: true,
              label: "WORKS_LOR",
              isMandatory: false,
              key: "noSubProject_letterRefNoOrReqNo",
              type: "text",
              disable: false,
              preProcess: {
                convertStringToRegEx: ["populators.validation.pattern"],
              },
              populators: {
                name: "noSubProject_letterRefNoOrReqNo",
                error: "PROJECT_PATTERN_ERR_MSG_PROJECT_LOR",
                validation: { pattern: /^[^\$\"<>?\\\\~`!@$%^()+={}\[\]*:;“”‘’]{1,50}$/i, minlength: 2 },
              },
            },
            {
              inline: true,
              label: "PROJECT_ESTIMATED_COST_IN_RS",
              isMandatory: false,
              key: "noSubProject_estimatedCostInRs",
              type: "number",
              disable: false,
              populators: { name: "noSubProject_estimatedCostInRs" },
            },
          ],
        },
        {
          navLink: "Project_Details",
          sectionFormCategory: "noSubProject",
          head: "WORKS_WORK_DETAILS",
          body: [
            {
              isMandatory: true,
              key: "noSubProject_typeOfProject",
              type: "radioordropdown",
              label: "WORKS_PROJECT_TYPE",
              disable: false,
              populators: {
                name: "noSubProject_typeOfProject",
                optionsKey: "name",
                error: "WORKS_REQUIRED_ERR",
                required: true,
                optionsCustomStyle: {
                  top: "2.5rem",
                },
                mdmsConfig: {
                  masterName: "ProjectType",
                  moduleName: "works",
                  localePrefix: "COMMON_MASTERS",
                },
              },
            },
            {
              isMandatory: false,
              key: "noSubProject_subTypeOfProject",
              type: "radioordropdown",
              label: "WORKS_SUB_PROJECT_TYPE",
              disable: false,
              preProcess: {
                updateDependent: ["populators.options"],
              },
              populators: {
                name: "noSubProject_subTypeOfProject",
                optionsKey: "name",
                error: "WORKS_REQUIRED_ERR",
                required: false,
                optionsCustomStyle: {
                  top: "2.5rem",
                },
                options: [],
              },
            },
            {
              isMandatory: false,
              key: "noSubProject_natureOfWork",
              type: "radioordropdown",
              label: "WORKS_WORK_NATURE",
              disable: false,
              populators: {
                name: "noSubProject_natureOfWork",
                optionsKey: "name",
                error: "WORKS_REQUIRED_ERR",
                required: false,
                optionsCustomStyle: {
                  top: "2.5rem",
                },
                mdmsConfig: {
                  masterName: "NatureOfWork",
                  moduleName: "works",
                  localePrefix: "COMMON_MASTERS",
                },
              },
            },
            {
              inline: true,
              label: "PROJECT_PLANNED_START_DATE",
              isMandatory: false,
              key: "noSubProject_startDate",
              description: "",
              type: "date",
              disable: false,
              populators: {
                name: "noSubProject_startDate",
              },
            },
            {
              inline: true,
              label: "PROJECT_PLANNED_END_DATE",
              isMandatory: false,
              key: "noSubProject_endDate",
              description: "",
              type: "date",
              disable: false,
              preProcess: {
                updateDependent: ["populators.validation.customValidation"],
              },
              populators: {
                name: "noSubProject_endDate",
                error: "COMMON_END_DATE_SHOULD_BE_GREATER_THAN_START_DATE",
                validation: {
                  customValidation: true,
                },
              },
            },
            {
              isMandatory: false,
              key: "noSubProject_recommendedModeOfEntrustment",
              type: "radioordropdown",
              label: "ES_COMMON_MODE_OF_ENTRUSTMENT",
              disable: false,
              populators: {
                name: "noSubProject_recommendedModeOfEntrustment",
                optionsKey: "name",
                error: "WORKS_REQUIRED_ERR",
                required: false,
                optionsCustomStyle: {
                  top: "2.5rem",
                },
                mdmsConfig: {
                  masterName: "EntrustmentMode",
                  moduleName: "works",
                  localePrefix: "COMMON_MASTERS",
                },
              },
            },
          ],
        },
        {
          navLink: "Project_Details",
          sectionFormCategory: "noSubProject",
          head: "ES_COMMON_LOCATION_DETAILS",
          body: [
            {
              inline: true,
              label: "WORKS_GEO_LOCATION",
              isMandatory: true,
              key: "noSubProject_geoLocation",
              type: "text",
              disable: false,
              populators: { name: "noSubProject_geoLocation", error: "WORKS_REQUIRED_ERR" },
            },
            {
              isMandatory: true,
              key: "noSubProject_ulb",
              type: "radioordropdown",
              label: "ES_COMMON_ULB",
              disable: false,
              preProcess: {
                updateDependent: ["populators.options"],
              },
              populators: {
                name: "noSubProject_ulb",
                optionsKey: "i18nKey",
                options: [],
                error: "WORKS_REQUIRED_ERR",
                required: true,
                optionsCustomStyle: {
                  top: "2.5rem",
                },
              },
            },
            {
              isMandatory: false,
              key: "noSubProject_ward",
              type: "radioordropdown",
              label: "PDF_STATIC_LABEL_ESTIMATE_WARD",
              disable: false,
              preProcess: {
                updateDependent: ["populators.options"],
              },
              populators: {
                name: "noSubProject_ward",
                optionsKey: "i18nKey",
                error: "WORKS_REQUIRED_ERR",
                required: false,
                optionsCustomStyle: {
                  top: "2.5rem",
                },
                options: [],
              },
            },
            {
              isMandatory: false,
              key: "noSubProject_locality",
              type: "radioordropdown",
              label: "WORKS_LOCALITY",
              disable: false,
              preProcess: {
                updateDependent: ["populators.options"],
              },
              populators: {
                name: "noSubProject_locality",
                optionsKey: "i18nKey",
                error: "WORKS_REQUIRED_ERR",
                required: false,
                optionsCustomStyle: {
                  top: "2.5rem",
                },
                options: [],
              },
            },
          ],
        },
        {
          navLink: "Project_Details",
          sectionFormCategory: "noSubProject",
          head: "WORKS_RELEVANT_DOCS",
          body: [
            {
              type: "multiupload",
              label: "WORKS_UPLOAD_FILES",
              preProcess: {
                convertStringToRegEx: ["populators.allowedFileTypes"],
              },
              populators: {
                name: "noSubProject_uploadedFiles",
                allowedMaxSizeInMB: 5,
                maxFilesAllowed: 2,
                allowedFileTypes: /(.*?)(pdf|docx|msword|openxmlformats-officedocument|wordprocessingml|document|spreadsheetml|sheet)$/i,
                customClass: "upload-margin-bottom",
                errorMessage: "WORKS_FILE_UPLOAD_CUSTOM_ERROR_MSG",
                hintText: "WORKS_DOC_UPLOAD_HINT",
                showHintBelow: true,
              },
            },
          ],
        },
        {
          navLink: "Financial_Details",
          sectionFormCategory: "noSubProject",
          head: "",
          body: [
            {
              isMandatory: true,
              key: "noSubProject_fund",
              type: "radioordropdown",
              label: "WORKS_FUND",
              disable: false,
              populators: {
                name: "noSubProject_fund",
                optionsKey: "name",
                error: "WORKS_REQUIRED_ERR",
                required: true,
                optionsCustomStyle: {
                  top: "2.5rem",
                },
                mdmsConfig: {
                  masterName: "Fund",
                  moduleName: "finance",
                  localePrefix: "COMMON_MASTERS_FUND",
                },
              },
            },
            {
              isMandatory: true,
              key: "noSubProject_function",
              type: "radioordropdown",
              label: "WORKS_FUNCTION",
              disable: false,
              populators: {
                name: "noSubProject_function",
                optionsKey: "name",
                error: "WORKS_REQUIRED_ERR",
                required: true,
                optionsCustomStyle: {
                  top: "2.5rem",
                },
                mdmsConfig: {
                  masterName: "Functions",
                  moduleName: "finance",
                  localePrefix: "COMMON_MASTERS_FUN",
                },
              },
            },
            {
              isMandatory: true,
              key: "noSubProject_budgetHead",
              type: "radioordropdown",
              label: "WORKS_BUDGET_HEAD",
              disable: false,
              populators: {
                name: "noSubProject_budgetHead",
                optionsKey: "name",
                error: "WORKS_REQUIRED_ERR",
                required: true,
                optionsCustomStyle: {
                  top: "2.5rem",
                },
                mdmsConfig: {
                  masterName: "BudgetHead",
                  moduleName: "finance",
                  localePrefix: "COMMON_MASTERS_BUDGET_HEAD",
                },
              },
            },
            {
              isMandatory: true,
              key: "noSubProject_scheme",
              type: "radioordropdown",
              label: "WORKS_SCHEME",
              disable: false,
              populators: {
                name: "noSubProject_scheme",
                optionsKey: "name",
                error: "WORKS_REQUIRED_ERR",
                required: true,
                optionsCustomStyle: {
                  top: "2.5rem",
                },
                mdmsConfig: {
                  masterName: "Scheme",
                  moduleName: "finance",
                  localePrefix: "COMMON_MASTERS_SCHEME",
                },
              },
            },
            {
              isMandatory: true,
              key: "noSubProject_subScheme",
              type: "radioordropdown",
              label: "WORKS_SUB_SCHEME",
              disable: false,
              preProcess: {
                updateDependent: ["populators.options"],
              },
              populators: {
                name: "noSubProject_subScheme",
                optionsKey: "code",
                error: "WORKS_REQUIRED_ERR",
                required: true,
                optionsCustomStyle: {
                  top: "2.5rem",
                },
                options: [],
              },
            },
          ],
        },
        {
          navLink: "Project_Details_In_Sub_Project",
          sectionFormCategory: "withSubProject",
          head: "",
          body: [
            {
              isMandatory: false,
              key: "withSubProject_project_owningDepartment",
              type: "radioordropdown",
              label: "PROJECT_OWNING_DEPT",
              disable: false,
              populators: {
                name: "withSubProject_project_owningDepartment",
                optionsKey: "name",
                error: "WORKS_REQUIRED_ERR",
                required: false,
                optionsCustomStyle: {
                  top: "2.5rem",
                },
                mdmsConfig: {
                  masterName: "Department",
                  moduleName: "common-masters",
                  localePrefix: "COMMON_MASTERS_DEPARTMENT",
                },
              },
            },
            {
              isMandatory: false,
              key: "withSubProject_project_targetDemography",
              type: "radioordropdown",
              label: "PROJECT_TARGET_DEMOGRAPHY",
              disable: false,
              populators: {
                name: "withSubProject_project_targetDemography",
                optionsKey: "name",
                error: "WORKS_REQUIRED_ERR",
                required: false,
                optionsCustomStyle: {
                  top: "2.5rem",
                },
                mdmsConfig: {
                  masterName: "TargetDemography",
                  moduleName: "works",
                  localePrefix: "COMMON_MASTERS",
                },
              },
            },
            {
              inline: true,
              label: "WORKS_LOR",
              isMandatory: false,
              key: "withSubProject_project_LetterRefNoOrReqNo",
              type: "text",
              disable: false,
              preProcess: {
                convertStringToRegEx: ["populators.validation.pattern"],
              },
              populators: {
                name: "withSubProject_project_letterRefNoOrReqNo",
                error: "PROJECT_PATTERN_ERR_MSG_PROJECT_LOR",
                validation: { pattern: /^[^\$\"<>?\\\\~`!@$%^()+={}\[\]*:;“”‘’]{1,50}$/i, minlength: 2 },
              },
            },
            {
              inline: true,
              label: "PROJECT_TOTAL_ESTIMATED_COST_IN_RS",
              isMandatory: false,
              key: "withSubProject_project_estimatedCostInRs",
              type: "number",
              disable: true,
              populators: { name: "withSubProject_project_estimatedCostInRs" },
            },
          ],
        },
        {
          navLink: "Financial_Details_In_Sub_Project",
          sectionFormCategory: "withSubProject",
          head: "",
          body: [
            {
              isMandatory: true,
              key: "withSubProject_project_fund",
              type: "radioordropdown",
              label: "WORKS_FUND",
              disable: false,
              populators: {
                name: "withSubProject_project_fund",
                optionsKey: "name",
                error: "WORKS_REQUIRED_ERR",
                required: true,
                optionsCustomStyle: {
                  top: "2.5rem",
                },
                mdmsConfig: {
                  masterName: "Fund",
                  moduleName: "finance",
                  localePrefix: "COMMON_MASTERS_FUND",
                },
              },
            },
            {
              isMandatory: true,
              key: "withSubProject_project_function",
              type: "radioordropdown",
              label: "WORKS_FUNCTION",
              disable: false,
              populators: {
                name: "withSubProject_project_function",
                optionsKey: "name",
                error: "WORKS_REQUIRED_ERR",
                required: true,
                optionsCustomStyle: {
                  top: "2.5rem",
                },
                mdmsConfig: {
                  masterName: "Functions",
                  moduleName: "finance",
                  localePrefix: "COMMON_MASTERS_FUN",
                },
              },
            },
            {
              isMandatory: true,
              key: "withSubProject_project_budgetHead",
              type: "radioordropdown",
              label: "WORKS_BUDGET_HEAD",
              disable: false,
              populators: {
                name: "withSubProject_project_budgetHead",
                optionsKey: "name",
                error: "WORKS_REQUIRED_ERR",
                required: true,
                optionsCustomStyle: {
                  top: "2.5rem",
                },
                mdmsConfig: {
                  masterName: "BudgetHead",
                  moduleName: "finance",
                  localePrefix: "COMMON_MASTERS_BUDGET_HEAD",
                },
              },
            },
            {
              isMandatory: true,
              key: "withSubProject_project_scheme",
              type: "radioordropdown",
              label: "WORKS_SCHEME",
              disable: false,
              populators: {
                name: "withSubProject_project_scheme",
                optionsKey: "name",
                error: "WORKS_REQUIRED_ERR",
                required: true,
                optionsCustomStyle: {
                  top: "2.5rem",
                },
                mdmsConfig: {
                  masterName: "Scheme",
                  moduleName: "finance",
                  localePrefix: "COMMON_MASTERS_SCHEME",
                },
              },
            },
            {
              isMandatory: true,
              key: "withSubProject_project_subScheme",
              type: "radioordropdown",
              label: "WORKS_SUB_SCHEME",
              disable: false,
              preProcess: {
                updateDependent: ["populators.options"],
              },
              populators: {
                name: "withSubProject_project_subScheme",
                optionsKey: "code",
                error: "WORKS_REQUIRED_ERR",
                required: true,
                optionsCustomStyle: {
                  top: "2.5rem",
                },
                options: [],
              },
            },
          ],
        },
        {
          navLink: "Sub_Project_Details_In_Sub_Project",
          sectionFormCategory: "withSubProject",
          head: "",
          body: [
            {
              key: "withSubProject_subProjects_DetailsComponent",
              type: "component",
              component: "SubProjectDetailsTable",
              withoutLabel: true,
            },
          ],
        },
      ],
    },
  ],
};
