const InboxMeasurementConfig = () => {
    return {
      label: "MB_INBOX",
      type: "inbox",
      // actionLabel: "WORKS_ADD_WAGESEEKER",
      // actionRole: "INDIVIDUAL_CREATOR",
      // actionLink: "masters/create-wageseeker",
      apiDetails: {
        serviceName: "/inbox/v2/_search",
        requestParam: {},
        requestBody: {
          inbox: {
            tenantId: Digit.ULBService.getCurrentTenantId(),
            moduleSearchCriteria: {
              tenantId: Digit.ULBService.getCurrentTenantId()
            },
            processSearchCriteria: {
              businessService: ["MB"],
              moduleName: "measurement-service"
            }
          }
        },
        minParametersForSearchForm: 1,
        masterName: "commonUiConfig",
        moduleName: "InboxMeasurementConfig",
        tableFormJsonPath: "requestBody.inbox",
        filterFormJsonPath: "requestBody.inbox.moduleSearchCriteria",
        searchFormJsonPath: "requestBody.inbox.moduleSearchCriteria",
      },
      sections: {
        search: {
          uiConfig: {
            headerStyle: null,
            formClassName: "custom-both-clear-search",
            primaryLabel: "ES_COMMON_SEARCH",
            secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
            minReqFields: 1,
            defaultValues: {
              ProjectId: "",
              measurementNumber: "",
              projectType: "",
            },
            fields: [
              {
                label: "MB_REFERENCE_NUMBER",
                type: "text",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "measurementNumber",
                  error: `PROJECT_PATTERN_ERR_MSG`,
                  validation: { minlength: 2 },
                },
              },
              {
                label: "MB_PROJECT_ID",
                type: "text",
                isMandatory: false,
                disable: false,
                populators: { name: "ProjectId", validation: { 
                  // pattern: /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;""'']{1,50}$/i, 
                  maxlength: 140 } },
              },
              {
                label: "MB_PROJECT_TYPE",
                type: "dropdown",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "projectType",
                  optionsKey: "name",
                  optionsCustomStyle: {
                    top: "2.3rem",
                  },
                  mdmsConfig: {
                    masterName: "ProjectType",
                    moduleName: "works",
                    localePrefix: "COMMON_MASTERS",
                  },
                },
              },
            ],
          },
          label: "",
          children: {},
          show: true,
        },
        links: {
          uiConfig: {
            links: [
              // {
              //   text: "MB_SEARCH_MB",
              //   url: "/employee/measurement/search",
              //   roles: ["MB_CREATOR", "MB_VERIFIER", "MB_APPROVER", "MB_VIEWER"],
              // },
              {
                text: "MB_SEARCH_MB",
                url: "/employee/measurement/search",
                roles: ["MB_CREATOR", "MB_VERIFIER", "MB_APPROVER", "MB_VIEWER"],
              },
              {
                text: "MB_CREATE_MB",
                url: "/employee/measurement/create",
                roles: ["MB_CREATOR"],
              },
            ],
            label: "ES_COMMON_ATTENDENCEMGMT",
            logoIcon: {
              component: "MuktaIcon",
              customClass: "search-icon--projects",
            },
          },
          children: {},
          show: true,
        },
        filter: {
          uiConfig: {
            type: "filter",
            headerStyle: null,
            primaryLabel: "MB_APPLY",
            secondaryLabel: "",
            minReqFields: 1,
            defaultValues: {
              state: "",
              ward: [],
              locality: [],
              assignee: {
                code: "ASSIGNED_TO_ALL",
                name: "ASSIGNED_TO_ALL",
              },
            },
            fields: [
              {
                label: "",
                type: "radio",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "assignee",
                  options: [
                    {
                      code: "ASSIGNED TO ME",
                      name: "MB_ASSIGNED_TO_ME",
                    },
                    {
                      code: "ASSIGNED_TO_ALL",
                      name: "MB_ASSIGNED_TO_ALL",
                    },
                  ],
                  optionsKey: "name",
                  styles: {
                    gap: "1rem",
                    flexDirection: "column",
                  },
                  innerStyles: {
                    display: "flex",
                  },
                },
              },
              {
                label: "MB_WARD",
                type: "locationdropdown",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "ward",
                  type: "ward",
                  optionsKey: "i18nKey",
                  defaultText: "COMMON_SELECT_WARD",
                  selectedText: "COMMON_SELECTED",
                  allowMultiSelect: true
                }
              },
              {
                label: "MB_WORKFLOW_STATUS",
                type: "workflowstatesfilter",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "status",
                  labelPrefix: "MB_WF",
                  businessService: "MB",
                },
              },
            ],
          },
          label: "Filter",
          show: true,
        },
        searchResult: {
          label: "",
          uiConfig: {
            columns: [
              {
                label: "MB_REFERENCE_NUMBER",
                jsonPath: "ProcessInstance.businessId",
                additionalCustomization: true,
              },
              {
                label: "MB_PROJECT_NAME",
                jsonPath: "businessObject.contract.additionalDetails.projectName",
              },
              {
                label: "MB_ASSIGNEE",
                jsonPath: "ProcessInstance.assignes",
                additionalCustomization: true,
              },
              {
                label: "MB_WORKFLOW_STATE",
                jsonPath: "ProcessInstance.state.state",
                additionalCustomization: true,
              },
              {
                label: "MB_AMOUNT",
                jsonPath: "businessObject.additionalDetails.totalAmount",
                additionalCustomization: true,
              },
              {
                label: "MB_SLA_DAYS_REMAINING",
                jsonPath: "businessObject.serviceSla",
                additionalCustomization: true,
              },
            ],
            enableGlobalSearch: false,
            enableColumnSort: true,
            resultsJsonPath: "items",
          },
          children: {},
          show: true,
        },
      },
      additionalSections: {},
    };
  };
  export default InboxMeasurementConfig;