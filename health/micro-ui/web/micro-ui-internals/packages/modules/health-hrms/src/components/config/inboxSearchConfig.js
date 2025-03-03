const inboxSearchConfig = () => {
  return {
    type: "search", // Defines the type of configuration (search functionality)
    label: "Search Employee", // Label for the search functionality

    sections: {
      search: {
        show: true, // Determines whether the search section is displayed
        label: "", // No specific label assigned
        children: {}, // No child components included

        uiConfig: {
          type: "search", // UI type is a search form
          fields: [
            {
              type: "text", // Input type (text field)
              label: "HR_NAME_LABEL", // Field label
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
              label: "HR_USERNAME_LABEL",
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
              label: "CONTACT_NUMBER",
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
            tenantId: "mz",
            sortOrder: "DESC",
          },

          secondaryLabel: "ES_COMMON_CLEAR_SEARCH", // Label for clear search button
          searchWrapperStyles: {
            // Custom styles for search UI
            marginTop: "1.4rem",
            alignItems: "center",
            gridColumn: "3",
            flexDirection: "column-reverse",
            justifyContent: "end",
          },
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
              label: "HR_EMP_ID_LABEL",
              jsonPath: "code", // Maps data from API response
               additionalCustomization: true,
            },
            {
              label: "HR_EMP_NAME_LABEL",
              jsonPath: "user.name",
              // additionalCustomization: true,
            },
            {
              label: "HR_ROLE_NO_LABEL",
              jsonPath: "user.roles",
               additionalCustomization: true,
            },
            {
              label: "HR_DESG_LABEL",
              jsonPath: "assignments",
              additionalCustomization: true,
            },
            {
              label: "HR_EMPLOYMENT_DEPARTMENT_LABEL",
              jsonPath: "assignments[0]",
              additionalCustomization: true,
            },
          ],
          rowClassName: "table-row-mdms table-row-mdms-hover", // Table row styles
          tableClassName: "table pqm-table", // Table styles
          resultsJsonPath: "Employees", // API response path for results
          enableColumnSort: false, // Enables sorting on columns
          enableGlobalSearch: false, // Disables global search
        },
      },

      links: {
      uiConfig: {
        links: [
          {
            text: "MB_CREATE_MB",
            url: "/employee/contracts/search-contract?status=ACCEPTED",
            roles: ["MB_CREATOR"],
          },
        ],
        label: "ACTION_TEST_MEASUREMENT_HEADER",
        // logoIcon: {
        //   component: "MeasurementInboxIcon",
        //   customClass: "inbox-search-icon--projects",
        // },
      },
      children: {},
      show: true,
    },
    },

    apiDetails: {
      masterName: "commonUiConfig", // Master data module for UI config
      moduleName: "SearchDefaultConfigMain", // Configuration module name
      requestBody: {}, // Request body (empty for now)
      serviceName: "/egov-hrms/employees/_search", // API endpoint for search
      requestParam: {
        // Default request parameters for API call
        limit: 10,
        names: "",
        roles: "",
        offset: 0,
        sortBy: "lastModifiedTime",
        tenantId: "mz",
        sortOrder: "DESC",
       // includeUnassigned:true
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

export default inboxSearchConfig;
