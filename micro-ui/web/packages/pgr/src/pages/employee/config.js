export const configs = {
  label: "ACTION_TEST_ESTIMATE_INBOX_V2",
  type: "inbox",
  apiDetails: {
    serviceName: "/inbox/v2/_search",
    requestParam: {},
    requestBody: {
      inbox: {
        processSearchCriteria: {
          businessService: ["PGR"],
          moduleName: "RAINMAKER-PGR",
        },

        moduleSearchCriteria: {
          sortOrder: "ASC",
        },
      },
    },
    minParametersForSearchForm: 0,
    minParametersForFilterForm: 0,
    masterName: "commonUiConfig",
    moduleName: "EstimateInboxConfig",
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
        },
        fields: [
          {
            label: "CS_COMMON_COMPLAINT_NO",
            type: "text",
            isMandatory: false,
            disable: false,
            preProcess: {
              convertStringToRegEx: ["populators.validation.pattern"],
            },
            populators: {
              name: "complaintNumber",
              error: "ESTIMATE_PATTERN_ERR_MSG",
              validation: {
                minlength: 2,
              },
            },
          },
          {
            label: "CS_COMMON_MOBILE_NO",
            type: "text",
            isMandatory: false,
            disable: false,
            preProcess: {
              convertStringToRegEx: ["populators.validation.pattern"],
            },
            populators: {
              name: "mobileNumber",
              error: "PROJECT_PATTERN_ERR_MSG",
              validation: {
                pattern: "PJ\\/[0-9]+-[0-9]+\\/[0-9]+\\/[0-9]+",
                minlength: 2,
              },
            },
          },
        ],
      },
      label: "",
      children: {},
      show: true,
    },
    searchResult: {
      label: "",
      estimateNumber: "",
      projectId: "",
      department: "",
      estimateStatus: "",
      fromProposalDate: "",
      toProposalDate: "",
      uiConfig: {
        columns: [
          {
            label: "CS_COMMON_COMPLAINT_NO",
            jsonPath: "businessObject.service.serviceRequestId",
            key: "complaintNumber",
            additionalCustomization: true,
          },
          {
            label: "WF_INBOX_HEADER_LOCALITY",
            jsonPath: "businessObject.service.address.locality.code",
            additionalCustomization: false,
          },
          {
            label: "CS_COMPLAINT_DETAILS_CURRENT_STATUS",
            jsonPath: "businessObject.service.applicationStatus",
          },
          {
            label: "WF_INBOX_HEADER_CURRENT_OWNER",
            jsonPath: "ProcessInstance.assignes",
            additionalCustomization: true,
            key: "assignee",
          },
          {
            label: "WF_INBOX_HEADER_SLA_DAYS_REMAINING",
            jsonPath: "businessObject.service.auditDetails.createdTime",
            additionalCustomization: false,
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
            text: "ES_PGR_NEW_COMPLAINT",
            url: "/employee/pgr/complaint/create",
            roles: ["SYSTEM_ADMINISTRATOR"],
          },
        ],
        label: "PGR",
        logoIcon: {
          component: "PropertyHouse",
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
          state: "",
          locality: [],
          assignee: {
            code: "ASSIGNED_TO_ME",
            name: "ASSIGNED_TO_ME",
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
                  name: "ASSIGNED_TO_ME",
                },
                {
                  code: "ASSIGNED_TO_ALL",
                  name: "ASSIGNED_TO_ALL",
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
            label: "COMMON_ORG_NAME",
            type: "apidropdown",
            isMandatory: false,
            disable: false,
            populators: {
              name: "locality",
              optionsKey: "name",
              allowMultiSelect: false,
              masterName: "commonUiConfig",
              moduleName: "EstimateInboxConfig",
              customfn: "populateReqCriteria",
            },
          },
          {
            label: "COMMON_ORG_NAME",
            type: "apidropdown",
            isMandatory: false,
            disable: false,
            populators: {
              name: "status",
              optionsKey: "applicationStatus",
              allowMultiSelect: true,
              masterName: "commonUiConfig",
              moduleName: "EstimateInboxConfig",
              customfn: "populateStatusList",
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
