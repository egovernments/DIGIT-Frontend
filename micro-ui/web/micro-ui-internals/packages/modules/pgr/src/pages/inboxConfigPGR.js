const inboxConfigPGR = () => {
  return {
      label: "CS_COMMON_INBOX",
      type: 'inbox',
      apiDetails: {
          serviceName: "/inbox-v2/v2/_search",
          requestParam: {},
          requestBody: {
              inbox: {
                  processSearchCriteria: {
                      businessService: [
                          "PGR"
                      ],
                      moduleName: "RAINMAKER-PGR"
                  },
                  moduleSearchCriteria: {}
              }
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
                  primaryLabel: 'ES_SEARCH_BOTTON',
                  secondaryLabel: 'CS_COMMON_CLEAR_SEARCH',
                  minReqFields: 1,
                  defaultValues: {
                    complaintNumber: "",
                    mobileNumber: ""
                  },
                  fields: [
                      {
                          label: "CS_COMMON_COMPLAINT_NO",
                          type: "text",
                          isMandatory: false,
                          disable: false,
                          populators: {
                              name: "complaintNumber",
                              error: `ESTIMATE_PATTERN_ERR_MSG`,
                              validation: { pattern: "PG-PGR-\d{4}-\d{2}-\d{2}-\d{6}", minlength: 2 }
                          },
                      },
                      {
                          label: "CS_COMMON_MOBILE_NO",
                          type: "text",
                          isMandatory: false,
                          disable: false,
                          populators: {
                              name: "mobileNumber",
                              error: `PROJECT_PATTERN_ERR_MSG`,
                              validation: { pattern: "^\+?[1-9]\d{0,2}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}$", minlength: 2 }
                          },
                      }
                  ]
              },
              label: "",
              children: {},
              show: true
          },
          searchResult: {
              label: "",
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
                  additionalCustomization: true,
                },
                {
                  label: "CS_COMPLAINT_DETAILS_CURRENT_STATUS",
                  jsonPath: "businessObject.service.applicationStatus",
                  additionalCustomization: true,
                },
                {
                  label: "WF_INBOX_HEADER_CURRENT_OWNER",
                  jsonPath: "ProcessInstance.assignes",
                  additionalCustomization: true,
                  key: "assignee",
                },
                {
                  label: "WF_INBOX_HEADER_SLA_DAYS_REMAINING",
                  jsonPath: "businessObject.serviceSla",
                  additionalCustomization: true,
                  key: "state",
                },
                  ],
                  enableGlobalSearch: false,
                  enableColumnSort: true,
                  resultsJsonPath: "items",
              },
              children: {},
              show: true
          },
          links: {
              uiConfig: {
                  links: [
                {
                  text: "ES_PGR_NEW_COMPLAINT",
                  url: "/employee/pgr/complaint/create",
                  roles: ["SUPERUSER"],
                },
                  ],
                  label: "CS_COMMON_HOME_COMPLAINTS",
                  logoIcon: {
                      component: "ReceiptInboxIcon",
                      customClass: "inbox-search-icon--projects"
                  }
              },
              children: {},
              show: true
          },
          filter: {
              uiConfig: {
                  type: 'filter',
                  headerStyle: null,
                  primaryLabel: 'CS_COMMON_FILTER',
                  formClassName:"filter",
                  secondaryLabel: '',
                  minReqFields: 0,
                  defaultValues: {
                      state: "",
                      serviceCode: [],
                      locality: [],
                      assignee: { code: "ASSIGNED_TO_ME", name: "ASSIGNED_TO_ME" }
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
                                  { code: "ASSIGNED_TO_ME", name: "ASSIGNED_TO_ME" },
                                  { code: "ASSIGNED_TO_ALL", name: "ASSIGNED_TO_ALL" },
                              ],
                              optionsKey: "name",
                              styles: {
                                  "gap": "1rem",
                                  "flexDirection": "column"
                              },
                              innerStyles: {
                                  "display": "flex"
                              }
                          },
                      },
                    {
            
                        label: "CS_COMPLAINT_DETAILS_COMPLAINT_SUBTYPE",
                        isMandatory: false,
                        key: "serviceCode",
                        type: "multiselectdropdown",
                        disable: false,
                        preProcess : {
                          updateDependent : ["populators.options"]
                        },
                        populators: {
                          name: "serviceCode",
                          optionsKey: "i18nKey",
                          //error: "WORKS_REQUIRED_ERR",
                          defaultText: '',
                          selectedText: "COMMON_SELECTED",
                          allowMultiSelect: true,
                          options: [],
                          isDropdownWithChip: true
                        }
                  },
                      {
            
                            label: "CS_PGR_LOCALITY",
                            isMandatory: false,
                            key: "locality",
                            type: "multiselectdropdown",
                            disable: false,
                            preProcess : {
                              updateDependent : ["populators.options"]
                            },
                            populators: {
                              name: "area",
                              optionsKey: "i18nKey",
                              //error: "WORKS_REQUIRED_ERR",
                              defaultText: '',
                              selectedText: "COMMON_SELECTED",
                              allowMultiSelect: true,
                              options: [],
                              isDropdownWithChip: true
                            }
                      },
                      {
                          label: "ES_PGR_FILTER_STATUS",
                          type: "workflowstatesfilter",
                          labelClassName: "checkbox-status-filter-label",
                          isMandatory: false,
                          disable: false,
                          populators: {
                              name: "status",
                              labelPrefix: "CS_COMMON_",
                              businessService: "PGR",
                              onlylabelPrefix:true
                          }
                      },
                  ]
              },
              label: "ES_COMMON_FILTER_BY",
              show: true
          },
      },
      additionalSections: {}
  }
}

export default inboxConfigPGR;