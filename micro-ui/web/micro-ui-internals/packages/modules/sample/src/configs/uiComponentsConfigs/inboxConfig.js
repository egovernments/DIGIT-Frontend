import React from "react";

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);

export const inboxConfig = {
  headerLabel: "ES_COMMON_INBOX", // label is changed to headerLabel (Screen Header Label)
  postProcessResult: true,
  type: "inbox", // type of the screen ("inbox","serach")
  apiDetails: {
    serviceName: "/mdms-v2/v2/_search",
    requestParam: {},
    requestBody: {
      inbox:{
        "SearchCriteria":{

        }
      }
    },
    minParametersForSearchForm: 0,
    minParametersForFilterForm: 0,
    masterName: "commonUiConfig",
    moduleName: "SampleInboxConfig",
    tableFormJsonPath: "requestBody.inbox",
    filterFormJsonPath: "requestBody.inbox.SearchCriteria",
    searchFormJsonPath: "requestBody.inbox.SearchCriteria",
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
            label: "Search field 1",
            type: "text",
            isMandatory: false,
            disable: false,
            preProcess: {
              convertStringToRegEx: ["populators.validation.pattern"],
            },
            populators: {
              name: "text",
              error: "COMMON_PATTERN_ERR_MSG_MUSTER_ID",
              validation: {
                pattern: "MR\\/[0-9]+-[0-9]+\\/[0-9]+\\/[0-9]+",
                minlength: 2,
              },
            },
          },
          {
            label: "Search field 2",
            type: "date",
            isMandatory: false,
            disable: false,
            populators: {
              name: "date",
              error: "PROJECT_PATTERN_ERR_MSG",
            },
          },
          {
            label: "Search field 3",
            type: "geolocation",
            isMandatory: false,
            disable: false,
            populators: {
              name: "geolocation",
              error: "PROJECT_PATTERN_ERR_MSG",
            },
          },
          {
            label: "Search field 4",
            type: "dropdown",
            isMandatory: false,
            disable: false,
            populators: {
              name: "dropdown",
              optionsKey: "name",
              error: "Error!",
              required: false,
              options: [
                {
                  code: "Option1",
                  name: "Option 1",
                },
                {
                  code: "Option2",
                  name: "Option 2",
                },
                {
                  code: "Option3",
                  name: "Option 3",
                },
              ],
            },
          },
          {
            label: "Search field 5",
            type: "multiselectdropdown",
            isMandatory: false,
            disable: false,
            populators: {
              name: "multiselectdropdown",
              optionsKey: "name",
              error: "Error!",
              required: false,
              options: [
                {
                  code: "Option1",
                  name: "Option 1",
                },
                {
                  code: "Option2",
                  name: "Option 2",
                },
                {
                  code: "Option3",
                  name: "Option 3",
                },
              ],
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
            text: "Menu1",
            url: "/employee/sample/components",
            roles: ["SYSTEM_ADMINISTRATOR", "MICROPLAN_ADMIN"],
            hyperlink: false,
          },
          {
            text: "Menu2",
            url: "/employee/sample/search",
            roles: ["SYSTEM_ADMINISTRATOR", "MICROPLAN_ADMIN"],
            hyperlink: false,
          },
        ],
        label: "Module Name",
        logoIcon: {
          component: "Opacity",
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
        primaryLabel: "Apply Filters",
        secondaryLabel: "Clear Filters",
        minReqFields: 1,
        defaultValues: {
          dropdown: "",
          apidropdown: [],
          status: "",
          radio: {
            code: "ASSIGNED_TO_ME",
            name: "Assigned to me",
          },
        },
        fields: [
          {
            label: "",
            type: "radio",
            isMandatory: false,
            disable: false,
            addDivider: true,
            populators: {
              alignVertical: true,
              name: "radio",
              options: [
                {
                  code: "ASSIGNED_TO_ALL",
                  name: "Assigned to all",
                },
                {
                  code: "ASSIGNED_TO_ME",
                  name: "Assigned to me",
                },
              ],
              optionsKey: "name",
            },
          },
          {
            label: "Filter field 1",
            type: "text",
            isMandatory: false,
            disable: false,
            preProcess: {
              convertStringToRegEx: ["populators.validation.pattern"],
            },
            populators: {
              name: "textfilter",
              error: "COMMON_PATTERN_ERR_MSG_MUSTER_ID",
              validation: {
                pattern: "MR\\/[0-9]+-[0-9]+\\/[0-9]+\\/[0-9]+",
                minlength: 2,
              },
            },
          },
          {
            label: "Filter field 2",
            type: "date",
            isMandatory: false,
            disable: false,
            populators: {
              name: "datefilter",
              error: "PROJECT_PATTERN_ERR_MSG",
            },
          },
          {
            label: "Filter field 3",
            type: "geolocation",
            isMandatory: false,
            disable: false,
            populators: {
              name: "geolocationfilter",
              error: "PROJECT_PATTERN_ERR_MSG",
            },
          },
          {
            label: "Filter field 4",
            type: "dropdown",
            isMandatory: false,
            addDivider: true,
            disable: false,
            populators: {
              name: "dropdown",
              options: [
                {
                  code: "Option1",
                  name: "Option 1",
                },
                {
                  code: "Option2",
                  name: "Option 2",
                },
              ],
              optionsKey: "name",
            },
          },
          {
            label: "Filter field 5",
            type: "multiselectdropdown",
            isMandatory: false,
            disable: false,
            populators: {
              isDropdownWithChip:true,
              name: "multiselectdropdownfilter",
              optionsKey: "name",
              error: "Error!",
              required: false,
              options: [
                {
                  code: "Option1",
                  name: "Option 1",
                },
                {
                  code: "Option2",
                  name: "Option 2",
                },
                {
                  code: "Option3",
                  name: "Option 3",
                },
              ],
            },
          },
          // {
          //   label: "ApiDropdown",
          //   type: "apidropdown",
          //   addDivider: true,
          //   isMandatory: false,
          //   disable: false,
          //   populators: {
          //     name: "apidropdown",
          //     optionsKey: "code",
          //     allowMultiSelect: true,
          //     masterName: "commonUiConfig",
          //     moduleName: "SampleInboxConfig",
          //     customfn: "getSearchRequest",
          //   },
          // },
          // {
          //   label: "Status",
          //   type: "workflowstatesfilter",
          //   labelClassName:"checkbox-status-filter-label" ,
          //   isMandatory: false,
          //   disable: false,
          //   populators: {
          //     name: "status",
          //     labelPrefix: "WF_MUSTOR_",
          //     businessService: "PLAN_ESTIMATION",
          //   },
          // },
        ],
      },
      label: "ES_COMMON_FILTERS",
      show: true,
    },
    sort: { // Introduced Sort action to show in the mobile view
      show: true,
    },
    searchResult: {
      label: "",
      uiConfig: {
        columns: [
          {
            label: "Facility name",
            jsonPath: "additionalDetails.facilityName",
            additionalCustomization: true,
          },
          {
            label: "Facility id",
            jsonPath:"additionalDetails.facilityId",
          },
          {
            label: "Hierarchy type",
            jsonPath: "hierarchyType",
          },
          {
            label: "Status",
            jsonPath: "status",
          },
          {
            label: "boundaryCode",
            jsonPath: "boundaryCode",
          },
        ],
        selectionProps: {
          showCheckBox: true,
          showSelectedState: true,
          selectableRowsNoSelectAll: false,
          // showSelectedStatePosition:"bottom", can also be sent like this
        },
        expandableProps: {
          expandableRows: true,
          expandableRowsComponent: ExpandedComponent,
        },
        tableProps: {
          showTableDescription: "This is the search table description",
          showTableTitle: "Search table title",
        },
        actionProps: {
          actions: [
            {
              label: "Action1",
              variation: "secondary",
              icon: "Edit",
            },
            {
              label: "Action2",
              variation: "primary",
              icon: "CheckCircle",
            },
          ],
        },
        enableGlobalSearch: true,
        enableColumnSort: true,
        resultsJsonPath: "items",
        defaultSortAsc: true,
        isPaginationRequired: true,
      },
      children: {},
      show: true,
    },
  },
  // additionalSections: {}, // no more additional sections will be supported
};
