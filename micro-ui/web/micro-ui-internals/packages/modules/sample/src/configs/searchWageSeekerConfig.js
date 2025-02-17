const searchWageSeekerConfig = () => {
  return {
    type: "search",
    label: "Search Employee",
    sections: {
      search: {
        show: true,
        label: "",
        children: {},
        uiConfig: {
          type: "search",
          fields: [
            {
              type: "text",
              label: "NAME",
              disable: false,
              populators: {
                name: "name",
                error: "ERR_INVALID_NAME",
                style: {
                  marginBottom: "0px",
                },
              },
              isMandatory: false,
            },
            {
              type: "text",
              label: "EMPLOYEE_CODE",
              disable: false,
              populators: {
                name: "codes",
                error: "ERR_INVALID_NAME",
                style: {
                  marginBottom: "0px",
                },
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
                style: {
                  marginBottom: "0px",
                },
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
                style: {
                  marginBottom: "0px",
                },
              },
              isMandatory: false,
            },
          ],
          typeMobile: "filter",
          headerLabel: "ES_COMMON_SEARCH",
          headerStyle: null,
          minReqFields: 0,
          primaryLabel: "Search",
          defaultValues: {
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
          secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
          searchWrapperStyles: {
            marginTop: "1.4rem",
            alignItems: "center",
            gridColumn: "3",
            flexDirection: "column-reverse",
            justifyContent: "end",
          },
        },
        labelMobile: "ES_COMMON_SEARCH",
      },
      searchResult: {
        show: true,
        children: {},
        uiConfig: {
          columns: [
            {
              label: "USER_MANAGEMENT_CODE",
              jsonPath: "code",
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
          rowClassName: "table-row-mdms table-row-mdms-hover",
          tableClassName: "table pqm-table",
          resultsJsonPath: "Employees",
          enableColumnSort: true,
          enableGlobalSearch: false,
        },
      },
    },
    apiDetails: {
      masterName: "commonUiConfig",
      moduleName: "SearchDefaultConfig",
      requestBody: {},
      serviceName: "/egov-hrms/employees/_search",
      requestParam: {
        limit: 10,
        names: "",
        roles: "",
        offset: 0,
        sortBy: "lastModifiedTime",
        tenantId: "pg.amhara",
        sortOrder: "DESC",
      },
      tableFormJsonPath: "requestParam",
      filterFormJsonPath: "requestParam",
      searchFormJsonPath: "requestParam",
      minParametersForFilterForm: 0,
      minParametersForSearchForm: 0,
    },
    persistFormData: true,
    additionalSections: {},
    showAsRemovableTagsInMobile: true,
  };
};

export default searchWageSeekerConfig;
