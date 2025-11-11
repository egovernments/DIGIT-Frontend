import React, { useState } from "react";
import { JsonEditor, githubDarkTheme } from "json-edit-react";
import { Card } from "@egovernments/digit-ui-components";
import { InboxSearchComposer, Header } from "@egovernments/digit-ui-react-components";

const defaultConfig = {
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
            label: "NAME", // Field label
            disable: false, // Field is enabled
            populators: {
              name: "name", // Field name for form data
              error: "ERR_INVALID_NAME", // Error message key for validation
              style: { marginBottom: "0px" }, // Inline style for UI adjustments
            },
            isMandatory: false, // Field is optional
          },
          {
            type: "text",
            label: "EMPLOYEE_CODE",
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
          {
            type: "text",
            label: "Role",
            disable: false,
            populators: {
              name: "role",
              error: "ERR_INVALID_ROLE",
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
          sortBy: "lastModifiedTime",
          tenantId: "pg.amhara",
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
            label: "USER_MANAGEMENT_CODE",
            jsonPath: "code", // Maps data from API response
          },
          {
            label: "USER_MANAGEMENT_NAME",
            jsonPath: "user.name",
          },
          {
            label: "USER_MANAGEMENT_MOBILE_NO",
            jsonPath: "user.mobileNumber",
          },
          {
            label: "MP_USER_MANAGEMENT_ROLE",
            jsonPath: "user.roles[0].code",
          },
          {
            label: "USER_MANAGEMENT_EMAIL",
            jsonPath: "user.emailId",
          },
        ],
        rowClassName: "table-row-mdms table-row-mdms-hover", // Table row styles
        tableClassName: "table pqm-table", // Table styles
        resultsJsonPath: "Employees", // API response path for results
        enableColumnSort: true, // Enables sorting on columns
        enableGlobalSearch: false, // Disables global search
      },
    },
  },

  apiDetails: {
    masterName: "commonUiConfig", // Master data module for UI config
    moduleName: "SearchDefaultConfig", // Configuration module name
    requestBody: {}, // Request body (empty for now)
    serviceName: "/egov-hrms/employees/_search", // API endpoint for search
    requestParam: {
      // Default request parameters for API call
      limit: 10,
      names: "",
      roles: "",
      offset: 0,
      sortBy: "lastModifiedTime",
      tenantId: "pg.amhara",
      sortOrder: "DESC",
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

const InboxExplorer = ({ stateCode }) => {
  const [jsonData, setJsonData] = useState({ configs: defaultConfig });
  const [showToast, setShowToast] = useState(null);

  const onSubmit = async (data) => {
    console.log(data, "data"); // Debug log of submitted form data

    await mutation.mutate(
      {
        url: `/egov-hrms/employees/_create`,
        params: { tenantId }, // Include tenant ID in API request
        body: data, // Transform data before sending to API
        config: {
          enable: true,
        },
      },
      {
        // Handle success response
        onSuccess: (data) => {
          setShowToast({ key: "success", label: "Individual Created Successfully" });
        },
        // Handle error response
        onError: (error) => {
          setShowToast({ key: "error", label: "Individual Creation Failed" });
        },
      }
    );
  };

  return (
    <Card type={"secondary"}>
      <Header>{"Playground for Inbox Search Composer"}</Header>

      <div className="form-explorer">
        {" "}
        <JsonEditor
          rootName="ScreenConfig"
          data={jsonData}
          collapse={3}
          theme={githubDarkTheme}
          setData={setJsonData} // optional
        />
        <div className="form-component">
          {" "}
          <InboxSearchComposer configs={jsonData?.configs}></InboxSearchComposer>
        </div>
      </div>
    </Card>
  );
};

export default InboxExplorer;
