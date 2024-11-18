const pgrInboxConfig = () => {
    return {
      label: "Complaints Inbox",
      type: "inbox",
      apiDetails: {
        serviceName: "/inbox/v2/_search",
        requestParam: {},
        requestBody: {
          inbox: {
            // processSearchCriteria: {
            //   businessService: ["mukta-estimate"],
            //   moduleName: "estimate-service",
            // },
            moduleSearchCriteria: {},
          },
        },
        minParametersForSearchForm: 0,
        minParametersForFilterForm: 0,
        masterName: "commonUiConfig",
        moduleName: "PGRInboxConfig",
        tableFormJsonPath: "requestBody.inbox",
        filterFormJsonPath: "requestBody.inbox.moduleSearchCriteria",
        searchFormJsonPath: "requestBody.inbox.moduleSearchCriteria",
      },
      sections: {
        search: {
          uiConfig: {
            headerStyle: null,
            primaryLabel: "Search",
            secondaryLabel: "Clear Search",
            minReqFields: 1,
            defaultValues: {
              complaintNumber: "",
              mobileNumber: "",
              DateRange: "",
            },
            fields: [
              {
                label: "Complaint Number",
                type: "text",
                isMandatory: false,
                disable: false,
                // preProcess: {
                //   convertStringToRegEx: ["populators.validation.pattern"],
                // },
                populators: {
                  name: "complaintNumber",
                //   error: "ESTIMATE_PATTERN_ERR_MSG",
                //   validation: {
                //     pattern: "ES\/[0-9]+-[0-9]+\/[0-9]+",
                //     minlength: 2,
                //   },
                },
              },
              {
                label: "Mobile Number",
                type: "text",
                isMandatory: false,
                disable: false,
                // preProcess: {
                //   convertStringToRegEx: ["populators.validation.pattern"],
                // },
                populators: {
                  name: "mobileNumber",
                //   error: "PROJECT_PATTERN_ERR_MSG",
                //   validation: {
                //     pattern: "PR\\/[0-9]+-[0-9]+\\/[0-9]+\\/[0-9]+",
                //     minlength: 2,
                //   },
                },
              },
              {
                label: "Date Range",
                type: "date",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "dateRange",
                },
              },
            ],
          },
          label: "",
          children: {},
          show: true,
        },
        searchResult: {
          complaintNumber: "",
          complaintType: "",
          area: "",
          status: "",
          complaintDate: "",
          uiConfig: {
            columns: [
              {
                label: "Complaint Number",
                jsonPath: "ProcessInstance.businessId",
                key: "complaintNumber",
                additionalCustomization: true,
              },
              {
                label: "Complaint Type",
                jsonPath: "businessObject.project.name",
              },
              {
                label: "Area",
                jsonPath: "businessObject.additionalDetails.creator",
              },
              {
                label: "Status",
                jsonPath: "ProcessInstance.assignes",
                key: "status",
              },
              {
                label: "Complaint Data",
                jsonPath: "ProcessInstance.state.state",
                additionalCustomization: true,
                key: "state",
              },
            ],
            enableGlobalSearch: false,
            enableColumnSort: true,
            resultsJsonPath: "items",
          },
          children: {},
          show: true,
        },
        links: {
          uiConfig: {
            links: [
              {
                text: "New Complaint",
                url: "/employee/sample/create-complaint",
                roles: ["PROJECT_VIEWER", "ESTIMATE_CREATOR"],
              },
              {
                text: "Dashboard",
                url: "/employee/sample/create-complaint",
                roles: ["ESTIMATE_VIEWER", "ESTIMATE_CREATOR", "ESTIMATE_VERIFIER", "TECHNICAL_SANCTIONER", "ESTIMATE_APPROVER"],
              },
            ],
            label: "Complaints",
            logoIcon: {
              component: "AnnouncementIcon",
              customClass: "inbox-search-icon--projects",
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
            minReqFields: 0,
            defaultValues: {
              complaintType: [],
              area: [],
              status : ""
            },
            fields: [
              {
                isMandatory: true,
                key: "complaintType",
                type: "dropdown",
                label: "Complain Type",
                disable: false,
                populators: {
                  name: "complaintType",
                  optionsKey: "name",
                  error: "required ",
                  mdmsConfig: {
                    masterName: "GenderType",
                    moduleName: "common-masters",
                    localePrefix: "COMMON_GENDER",
                  },
                },
              },
              {
                label: "Area",
                type: "locationdropdown",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "area",
                  type: "locality",
                  optionsKey: "i18nKey",
                  defaultText: "COMMON_SELECT_LOCALITY",
                  selectedText: "COMMON_SELECTED",
                  allowMultiSelect: true,
                  isDropdownWithChip:true,
                },
              },
              {
                label: "COMMON_WORKFLOW_STATES",
                type: "workflowstatesfilter",
                labelClassName:"checkbox-status-filter-label" ,
                isMandatory: false,
                disable: false,
                populators: {
                  name: "state",
                  labelPrefix: "WF_EST_",
                  businessService: "mukta-estimate",
                },
              },
            ],
          },
          label: "Filter",
          show: true,
        },
      },
      additionalSections: {},
    };
  };
  
  export default pgrInboxConfig;
  