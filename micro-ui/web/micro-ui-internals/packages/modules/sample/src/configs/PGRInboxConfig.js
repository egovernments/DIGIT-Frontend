const complaintInboxConfig = () => {
    return {
      label: "Complaints Inbox",
      postProcessResult: true,
      type: "inbox",
      apiDetails: {
        serviceName: "/inbox/v2/_search",
        requestParam: {},
        requestBody: {
          inbox: {
            // processSearchCriteria: {
            //   businessService: ["PGR"],
            //   moduleName: "PGR",
            // },
            moduleSearchCriteria: {},
          },
        },
        minParametersForSearchForm: 0,
        minParametersForFilterForm: 0,
        masterName: "commonUiConfig",
        moduleName: "PGRConfig",
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
                label: "Complaint Number",
                type: "text",
                isMandatory: false,
                disable: false,
                preProcess: {
                  convertStringToRegEx: ["populators.validation.pattern"],
                },
                populators: {
                  name: "complaintNumber",
                  error: "Invalid complaint number",
                  validation: {
                    pattern: "PGR\\/[0-9]+-[0-9]+\\/[0-9]+\\/[0-9]+",
                    minlength: 3,
                  },
                },
              },
              {
                label: "Mobile Number",
                type: "mobileNumber",
                isMandatory: false,
                disable: false,
                // preProcess: {
                //     convertStringToRegEx: ["populators.validation.pattern"],
                //   },
                populators: {
                    name: "contactNumber",
                    // error: "Invalid contact number",
                    // validation: {
                    //   pattern: "PGR\\/[0-9]+-[0-9]+\\/[0-9]+\\/[0-9]+",
                    //   minlength: 3,
                    // },
                  },
              },
              {
                label: "Date Range",
                type: "date",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "dateRange"
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
              {
                text: "New Complaints",
                url: "/employee/sample/create-pgr",
                roles: ["SYSTEM_ADMINISTRATOR"],
              },
              {
                text: "Dashboard",
                url: "/employee/sample/create-pgr",
                roles: ["SYSTEM_ADMINISTRATOR"],
              }
            ],
            label: "Complaints",
            // logoIcon: {
            //   component: "",
            //   customClass: "search-icon--projects",
            // },
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
                label: "",
                type: "radio",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "assignee",
                  options: [
                    {
                      code: "ASSIGNED_TO_ME",
                      name: "EST_INBOX_ASSIGNED_TO_ME",
                    },
                    {
                      code: "ASSIGNED_TO_ALL",
                      name: "EST_INBOX_ASSIGNED_TO_ALL",
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
                "label": "COMMON_WARD",
                "type": "locationdropdown",
                "isMandatory": false,
                "disable": false,
                "populators": {
                    "name": "ward",
                    "type": "ward",
                    "optionsKey": "i18nKey",
                    "defaultText": "COMMON_SELECT_WARD",
                    "selectedText": "COMMON_SELECTED",
                    "allowMultiSelect": true
                }
              },
              {
                label: "COMMON_WORKFLOW_STATES",
                type: "workflowstatesfilter",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "state",
                  labelPrefix: "WF_MUSTOR_",
                  businessService: "muster-roll-approval",
                },
              },
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
                label: "ATM_MUSTER_ROLL_ID",
                jsonPath: "businessObject.musterRollNumber",
                additionalCustomization: true,
              },
              {
                label: "ES_COMMON_PROJECT_NAME",
                jsonPath: "businessObject.additionalDetails.attendanceRegisterName",
              },
              {
                label: "ES_COMMON_CBO_NAME",
                jsonPath: "businessObject.additionalDetails.orgName",
              },
              {
                label: "COMMON_ASSIGNEE",
                jsonPath: "ProcessInstance.assignes[0].name",
                key: "assignee",
              },
              {
                label: "COMMON_WORKFLOW_STATES",
                jsonPath: "ProcessInstance.state.state",
                "additionalCustomization": true,
                key: "state",
              },
              {
                label: "ATM_SLA",
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
  
  export default complaintInboxConfig;
  