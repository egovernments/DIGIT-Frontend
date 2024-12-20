export const AttendanceInboxConfig = () => {
    return {
      label: "ES_COMMON_INBOX",
      // postProcessResult: true,
      type: "inbox",
      apiDetails: {
        serviceName: "/health-attendance/v1/_search",
        requestParam: {
          tenantId: "mz"
        },
        requestBody: {
          // inbox: {
          //   processSearchCriteria: {
          //     businessService: ["muster-roll-approval"],
          //     moduleName: "muster-roll-service",
          //   },
          //   moduleSearchCriteria: {},
          // },
           tenantId: Digit.ULBService.getCurrentTenantId()
        },
        minParametersForSearchForm: 0,
        minParametersForFilterForm: 0,
        masterName: "commonUiConfig",
        moduleName: "AttendanceInboxConfig",
        tableFormJsonPath: "requestBody.inbox",
        filterFormJsonPath: "requestBody.inbox.moduleSearchCriteria",
        searchFormJsonPath: "requestBody.inbox.moduleSearchCriteria",
      },
      sections: {
        search: {
          uiConfig: {
            headerStyle: null,
            primaryLabel: "ES_COMMON_SEARCH",
            secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
            minReqFields: 1,
            defaultValues: {
              attendanceRegisterName: "",
              orgId: "",
              musterRollNumber: "",
            },
            fields: [
              {
                label: "ATTENDANCE_ID",
                type: "text",
                isMandatory: false,
                disable: false,
                // preProcess: {
                //   convertStringToRegEx: ["populators.validation.pattern"],
                // },
                populators: {
                  name: "musterRollNumber",
                  error: "COMMON_PATTERN_ERR_MSG_MUSTER_ID",
                  validation: {
                    pattern: "MR\\/[0-9]+-[0-9]+\\/[0-9]+\\/[0-9]+",
                    minlength: 2,
                  },
                },
              },
              // {
              //   label: "ES_COMMON_PROJECT_NAME",
              //   type: "text",
              //   isMandatory: false,
              //   disable: false,
              //   populators: {
              //     name: "attendanceRegisterName",
              //     error: "PROJECT_PATTERN_ERR_MSG",
              //   },
              // },
              // {
              //   label: "COMMON_ORG_NAME",
              //   type: "apidropdown",
              //   isMandatory: false,
              //   disable: false,
              //   populators: {
              //     name: "orgId",
              //     optionsKey: "name",
              //     allowMultiSelect: false,
              //     masterName: "commonUiConfig",
              //     moduleName: "AttendanceInboxConfig",
              //     customfn: "populateReqCriteria",
              //   },
              // },
            ],
          },
          label: "",
          children: {},
          show: true,
        },
        links: {
          uiConfig: {
            links: [],
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
            primaryLabel: "Filter",
            secondaryLabel: "",
            minReqFields: 1,
            defaultValues: {
              state: "",
              ward: [],
              locality: [],
              assignee: {
                code: "ASSIGNED_TO_ALL",
                name: "EST_INBOX_ASSIGNED_TO_ALL",
              },
            },
            fields: [
              {
                label: "COMMON_WARD",
                type: "locationdropdown",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "ward",
                  type: "ward",
                  optionsKey: "i18nKey",
                  defaultText: "COMMON_SELECT_WARD",
                  selectedText: "COMMON_SELECTED",
                  allowMultiSelect: true,
                },
              },
              // {
              //   label: "COMMON_WORKFLOW_STATES",
              //   type: "workflowstatesfilter",
              //   labelClassName:"checkbox-status-filter-label" ,
              //   isMandatory: false,
              //   disable: false,
              //   populators: {
              //     name: "state",
              //     labelPrefix: "WF_MUSTOR_",
              //     businessService: "muster-roll-approval",
              //   },
              // },
            ],
          },
          label: "ES_COMMON_FILTERS",
          show: true,
        },
  
        searchResult: {
          label: "",
          uiConfig: {
            columns: [
              {
                label: "ATTENDANCE_ID",
                jsonPath: "registerNumber",
                additionalCustomization: true,
              },
              {
                label: "ATTENDANCE_PROJECTNAME",
                jsonPath: "name",
              },
              {
                label: "ATTENDANCE_STATUS",
                jsonPath: "status",
              },
             
            ],
            enableGlobalSearch: false,
            enableColumnSort: true,
            resultsJsonPath: "attendanceRegister",
          },
          children: {},
          show: true,
        },
      },
      additionalSections: {},
    };
  };
  
  
  