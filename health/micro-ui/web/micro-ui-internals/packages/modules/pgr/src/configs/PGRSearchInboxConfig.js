
/**
 * config for HRMS Inbox screen:
 * @Initial Data Load: On screen load, the system automatically fetches a list of HRMS users.
 * @filter section: Allows users to filter the list based on active/inactive status and assigned roles.
 * @search section: Enables users to search for specific HRMS users using username, user code, or phone number.
 * @link section: Provides navigation to the Create User screen.
 */

import Urls from "../utils/urls";

const PGRSearchInboxConfig = () => {
  return {
    type: "inbox", // Defines the type of configuration (search functionality)
    label: "Search Complaints", // Label for the search functionality

    sections: {
      filter: {
        uiConfig: {
          type: "filter",
          headerStyle: null,
          primaryLabel: "Apply Filters",
          secondaryLabel: "Clear Filters",
          minReqFields: 1,
          defaultValues: {
            // roles: [],

            // isActive: {
            //   code: true,
            //   name: "HR_ACTIVATE_HEAD",
            // },
          },
          fields: [
            // {
            //   label: "HR_COMMON_TABLE_COL_ROLE",
            //   type: "dropdown",
            //   isMandatory: false,
            //   disable: false,
            //   populators: {
            //     isDropdownWithChip: true,
            //     name: "roles",
            //     optionsKey: "name",
            //     error: "Error!",
            //     required: false,

            //     mdmsConfig: {
            //       masterName: "roles",
            //       moduleName: "ACCESSCONTROL-ROLES",
            //       localePrefix: "ACCESSCONTROL_ROLES_ROLES",
            //     },
            //   },
            // },
            // {
            //   label: "HR_EMP_STATUS_LABEL",
            //   type: "radio",
            //   isMandatory: false,
            //   disable: false,
            //   addDivider: true,
            //   populators: {
            //     alignVertical: true,
            //     name: "isActive",
            //     options: [
            //       {
            //         code: false,
            //         name: "HR_DEACTIVATE_HEAD",
            //       },
            //       {
            //         code: true,
            //         name: "HR_ACTIVATE_HEAD",
            //       },
            //     ],
            //     optionsKey: "name",
            //   },
            // },
          ],
        },
        label: "ES_COMMON_FILTERS",
        show: true,
      },

      links: {
        uiConfig: {
          links: [
            {
              text: "CREATE_COMPLAINT",
              url: "/employee/pgr/create-complaint",
              roles: ["PGR_ADMIN", "PGR-ADMIN"],
              hyperlink: true,
            },
          ],
          label: "PGR",
          logoIcon: {
            component: "Opacity",
            customClass: "search-icon--projects",
          },
        },
        children: {},
        show: true,
      },

      search: {
        show: true, // Determines whether the search section is displayed
        label: "", // No specific label assigned
        children: {}, // No child components included

        uiConfig: {
          type: "search", // UI type is a search form
          fields: [
            {
              type: "text", // Input type (text field)
              label: "PGR_COMPLAINT_NO", // Field label
              disable: false, // Field is enabled
              populators: {
                name: "complaintNumber", // Field name for form data
                // error: "ERR_INVALID_NAME", // Error message key for validation
                style: { marginBottom: "0px" }, // Inline style for UI adjustments
              },
              isMandatory: false, // Field is optional
            },
            // {
            //   type: "text",
            //   label: "HR_USERNAME_LABEL",
            //   disable: false,
            //   populators: {
            //     name: "codes",
            //     error: "ERR_INVALID_NAME",
            //     style: { marginBottom: "0px" },
            //   },
            //   isMandatory: false,
            // },
            // {
            //   type: "number",
            //   label: "HR_MOB_NO_LABEL",
            //   disable: false,
            //   populators: {
            //     name: "phone",
            //     error: "ERR_INVALID_PHONE_NUMBER",
            //     style: { marginBottom: "0px" },
            //   },
            //   isMandatory: false,
            // },
          ],

          typeMobile: "filter", // Defines mobile view as a filter
          headerLabel: "ES_COMMON_SEARCH", // Header label for search
          headerStyle: null, // No custom header style
          minReqFields: 0, // Minimum required fields to perform a search
          primaryLabel: "Search", // Label for primary search button

          defaultValues: {
            // Default search parameters
            complaintNo: "",
            limit: 10,
            // names: "",
            // phone: "",
            // roles: "",
            offset: 0,
            //   /sortBy: "lastModifiedTime",
            tenantId: "mz",
            sortOrder: "DESC",
          },

          secondaryLabel: "ES_COMMON_CLEAR_SEARCH", // Label for clear search button
          searchWrapperStyles: {},
        },
        labelMobile: "ES_COMMON_SEARCH", // Label for mobile view
      },

      searchResult: {
        show: true, // Determines whether the search result section is displayed
        children: {}, // No child components included

        uiConfig: {
          columns: [
            // Defines columns for search result table
            {
              label: "PGR_COMPLAINT_NO",
              jsonPath: "businessObject.service.serviceRequestId", // Maps data from API response
              additionalCustomization: true,
            },
            // {
            //   label: "HR_EMP_NAME_LABEL",
            //   jsonPath: "user.name",
            // },
            // {
            //   label: "HR_ROLE_NO_LABEL",
            //   jsonPath: "user.roles",
            //   additionalCustomization: true,
            // },
            // {
            //   label: "HR_DESG_LABEL",
            //   jsonPath: "assignments",
            //   additionalCustomization: true,
            // },
            // {
            //   label: "HR_EMPLOYMENT_DEPARTMENT_LABEL",
            //   jsonPath: "assignments[0]",
            //   additionalCustomization: true,
            // },
          ],
          rowClassName: "table-row-mdms table-row-mdms-hover", // Table row styles
          tableClassName: "pqm-table", // Table styles
          resultsJsonPath: "items", // API response path for results
          enableColumnSort: false, // Enables sorting on columns
          enableGlobalSearch: false, // Disables global search
          isPaginationRequired: true, // enables pagination
        },
      },
    },

    apiDetails: {
      masterName: "commonUiConfig", // Master data module for UI config
     // Configuration module name
      requestBody: {
        "inbox": {
          "processSearchCriteria": {
              "businessService": [
                  "PGR"
              ],
              "moduleName": "RAINMAKER-PGR",
              "tenantId": "mz"
          },
          "moduleSearchCriteria": {},
          "tenantId": "mz",
          "limit": 10,
          "offset": 0
      },
      }, // Request body (empty for now)
      serviceName: Urls.pgr.inboxSearch, // API endpoint for search
      requestParam: {
        // // Default request parameters for API call
        // limit: 10,
        // // names: "",
        // // roles: "",
        // complaintNumber: "",
        // offset: 0,
        // sortBy: "lastModifiedTime",
        // tenantId: "mz",
        // sortOrder: "DESC",
        // //   includeUnassigned:true
      },
      tableFormJsonPath: "requestParam", // JSON path for table form data
      filterFormJsonPath: "requestParam", // JSON path for filter form data
      searchFormJsonPath: "requestParam", // JSON path for search form data
      minParametersForFilterForm: 0, // No minimum required fields for filter
      minParametersForSearchForm: 0, // No minimum required fields for search
    },

    persistFormData: true, // Keeps form data persisted between searches
    additionalSections: {}, // No additional sections
    showAsRemovableTagsInMobile: true, // Enables removable search tags in mobile UI
  };
};

export default PGRSearchInboxConfig;