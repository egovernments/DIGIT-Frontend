
/**
 * config for PGR Inbox screen:
 * @Initial Data Load: On screen load, the system automatically fetches a list of Complaints.
 * @filter section: Allows users to filter the list based on current application status, boundary, assigned to and complaint type parameters.
 * @search section: Enables users to search for specific complaints using complaint number, date range, or phone number.
 * @link section: Provides navigation to the Create Complaint screen.
 */

import Urls from "../utils/urls";

const PGRSearchInboxConfig = () => {
  return {
    label: "CS_COMMON_INBOX",
    type: 'inbox',
    apiDetails: {
        serviceName: Urls.pgr.inboxSearch,
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
                primaryLabel: 'ACTION_TEST_SEARCH',
                secondaryLabel: 'CS_COMMON_CLEAR_SEARCH',
                minReqFields: 1,
                defaultValues: {
                  complaintNumber: "",
                  mobileNumber: "",
                  range: ""
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
                    },
                    {
                      label: "EVENTS_DATERANGE_LABEL",
                      type: "dateRange",
                      isMandatory: false,
                      disable: false,
                      populators: {
                          name: "range",
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
                jsonPath: "ProcessInstance",
                additionalCustomization: true,
                key: "assignee",
              },
              {
                label: "WF_INBOX_HEADER_CREATED_DATE",
                jsonPath: "businessObject.auditDetails.createdTime",
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
                url: "/employee/pgr/create-complaint",
                roles: ["SUPERUSER", "PGR-ADMIN", "PGR_ADMIN", "HELPDESK_USER"],
                hyperlink: true,
              },
                ],
                label: "CS_COMMON_HOME_COMPLAINTS"
            },
            children: {},
            show: true
        },
        filter: {
            uiConfig: {
                type: 'filter',
                headerStyle: null,
                primaryLabel: 'ES_COMMON_APPLY',
                formClassName:"filter",
                secondaryLabel: 'ES_CLEAR_ALL',
                minReqFields: 0,
                defaultValues: {
                    assignedToMe: null,
                    locality: null,
                    status: []
                  },
                  
                fields: [
                    {
                        label: "",
                        type: "radio",
                        isMandatory: false,
                        disable: false,
                        populators: {
                            name: "assignedToMe",
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
                      type: "dropdown",
                      disable: false,
                      preProcess : {
                        updateDependent : ["populators.options"]
                      },
                      populators: {
                        name: "serviceCode",
                        optionsKey: "i18nKey",
                        defaultText: '',
                        selectedText: "COMMON_SELECTED",
                        allowMultiSelect: false,
                        options: [],
                        isDropdownWithChip: false
                      }
                },
                    {
          
                          label: "",
                          isMandatory: false,
                          key: "locality",
                          type: "component",
                          component: "PGRBoundaryComponent",
                          disable: false,
                          populators: {
                            name: "locality",
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
};
};

export default PGRSearchInboxConfig;