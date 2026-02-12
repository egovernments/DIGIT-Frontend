import Urls from "../services/urls";
import BoundaryComponent from "../components/BoundaryComponent";
import React from "react";

/**
 * config for HRMS Inbox screen:
 * @Initial Data Load: On screen load, the system automatically fetches a list of HRMS users.
 * @filter section: Allows users to filter the list based on active/inactive status and assigned roles.
 * @search section: Enables users to search for specific HRMS users using username, user code, or phone number.
 * @link section: Provides navigation to the Create User screen.
 */

const inboxAttendeeSearchConfig = (boundarycode) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const individualContextPath = window?.globalConfigs?.getConfig("INDIVIDUAL_CONTEXT_PATH") || "health-individual";
  return {
    type: "inbox", // Defines the type of configuration (search functionality)
    label: "Search Employee", // Label for the search functionality

    sections: {
      filter: {
        uiConfig: {
          type: "filter",
          headerStyle: null,
          primaryLabel: "HCM_AM_APPLY_PAYMENT_FILTER",
          //secondaryLabel: "HRMS_CLEAR_FILTER",
          formClassName: "filter",
          minReqFields: 0,
          defaultValues: {},
          fields: [
            {
              //label: "HCM_AM_COMMON_TABLE_COL_FILTER",
              isMandatory: false,
              key: "AttendeeBoundaryComponent",
              type: "component",
              disable: false,
              component: "AttendeeBoundaryComponent",

              populators: {
                name: "AttendeeBoundaryComponent",
              },
            },
          ],
        },
        // label: "ES_COMMON_FILTERS",
        show: true,
      },

      links: {
        uiConfig: {
          links: [
            {
              text: "HR_COMMON_CREATE_EMPLOYEE_HEADER",
              url: `/employee/hrms/create?boundarycode=${boundarycode}`,
              roles: ["SYSTEM_ADMINISTRATOR", "HRMS_ADMIN"],
              hyperlink: true,
            },
          ],
          label: "HRMS",
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
              label: "HCM_AM_HR_NAME_LABEL", // Field label
              disable: false, // Field is enabled
              populators: {
                name: "names", // Field name for form data
                error: "ERR_INVALID_NAME", // Error message key for validation
                style: { marginBottom: "0px" }, // Inline style for UI adjustments
              },
              isMandatory: false, // Field is optional
            },
            {
              type: "text",
              label: "HCM_AM_HR_USER_NAME_LABEL",
              disable: false,
              populators: {
                name: "codes",
                error: "ERR_INVALID_NAME",
                style: { marginBottom: "0px" },
              },
              isMandatory: false,
            },
            {
              type: "number",
              label: "HCM_AM_HR_USER_PHONE_LABEL",
              disable: false,
              populators: {
                name: "phone",
                error: "ERR_INVALID_PHONE_NUMBER",
                style: { marginBottom: "0px" },
              },
              isMandatory: false,
            },
          ],

          typeMobile: "filter", // Defines mobile view as a filter
          headerLabel: "ES_COMMON_SEARCH", // Header label for search
          headerStyle: null, // No custom header style
          minReqFields: 0, // Minimum required fields to perform a search
          primaryLabel: "Search", // Label for primary search button

          defaultValues: {
            // Default search parameters
            codes: "",
            limit: 10,
            names: "",
            phone: "",
            roles: "",
            offset: 0,
            //   /sortBy: "lastModifiedTime",
            tenantId: tenantId,
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
              label: "HCM_HR_EMP_NAME_LABEL",
              jsonPath: "name.givenName",
              additionalCustomization: true,
            },
            {
              label: "HCM_HR_EMP_MOBILE_LABEL",
              jsonPath: "mobileNumber", // Maps data from API response
              additionalCustomization: true,
            },
            {
              label: "HCM_HR_ROLE_NO_LABEL",
              jsonPath: "userDetails.roles",
              additionalCustomization: true,
            },
            {
              label: "HCM_HR_JURIDICTIONS_LABEL",
              jsonPath: "address[0].locality.code",
              additionalCustomization: true,
            },
            {
              label: "HCM_ASSIGNMENT",
              //jsonPath: "assignments[0]",
              additionalCustomization: true,
            },
            // {
            //   label: "HR_EMPLOYMENT_DEPARTMENT_LABEL",
            //   jsonPath: "assignments[0]",
            //   additionalCustomization: true,
            // },
          ],
          totalCountJsonPath: "TotalCount",
          rowClassName: "table-row-mdms table-row-mdms-hover", // Table row styles
          tableClassName: "pqm-table", // Table styles
          resultsJsonPath: "Individual", // API response path for results
          enableColumnSort: false, // Enables sorting on columns
          enableGlobalSearch: false, // Disables global search
          isPaginationRequired: true, // enables pagination
        },
      },
    },

    apiDetails: {
      masterName: "commonUiConfig", // Master data module for UI config
      moduleName: "AttendeeSearchInboxConfig", // Configuration module name
      requestBody: {}, // Request body (empty for now)
      serviceName: `/${individualContextPath}/v1/_search`, // API endpoint for search
      requestParam: {
        // Default request parameters for API call
        // limit: 10,
        // names: "",
        // roles: "",
        offset: 0,
        //sortBy: "lastModifiedTime",
        tenantId: tenantId,
        // sortOrder: "DESC",
        //   includeUnassigned:true
      },
      tableFormJsonPath: "requestParam", // JSON path for table form data
      filterFormJsonPath: "requestParam", // JSON path for filter form data
      searchFormJsonPath: "requestParam", // JSON path for search form data
      minParametersForFilterForm: 0, // No minimum required fields for filter
      minParametersForSearchForm: 0, // No minimum required fields for search
    },
    //component: BoundaryComponent,

    persistFormData: true, // Keeps form data persisted between searches
    additionalSections: {}, // No additional sections
    showAsRemovableTagsInMobile: true, // Enables removable search tags in mobile UI
  };
};

export default inboxAttendeeSearchConfig;
