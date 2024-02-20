export const searchHierarchyConfig = {
  label: "WBH_BOUNDARY_SEARCH_HEADER",
  type: "search",
  actionLabel: "WBH_ADD_LOCALISATION",
  actionRole: "LOC_ADMIN",
  actionLink: "workbench/localisation-add",
  apiDetails: {
    serviceName: "/boundary-service/boundary-relationships/_search",
    requestParam: {},
    requestBody: {},
    minParametersForSearchForm: 1,
    masterName: "commonUiConfig",
    moduleName: "SearchHierarchyConfig",
    tableFormJsonPath: "requestBody.custom",
    filterFormJsonPath: "requestBody.custom",
    searchFormJsonPath: "requestParam",
  },
  sections: {
    search: {
      uiConfig: {
        searchWrapperStyles: {
          flexDirection: "column-reverse",
          marginTop: "2rem",
          alignItems: "center",
          justifyContent: "end",
          gridColumn: "4",
        },
        headerStyle: null,
        formClassName: "", //"custom-both-clear-search",
        primaryLabel: "ES_COMMON_SEARCH",
        secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
        minReqFields: 1,
        defaultValues: {
          locale: "",
          module: "",
          codes: "",
        },
        fields: [
          {
            label: "WBH_HIERARCHY_TYPE",
            type: "dropdown",
            isMandatory: false,
            disable: false,
            populators: {
              name: "hierarchyType",
              optionsKey: "hierarchyType",
              optionsCustomStyle: { top: "2.3rem" },
            },
          },
          // {
          //   label: "WBH_BOUNDARY_TYPE",
          //   type: "dropdown",
          //   isMandatory: false,
          //   disable: false,
          //   populators: {
          //     name: "boundaryType",
          //     optionsKey: "boundaryType",
          //     optionsCustomStyle: { top: "2.3rem" },
          //   },
          // },
          // {
          //   label: "CORE_COMMON_NAME",
          //   type: "text",
          //   isMandatory: false,
          //   disable: false,
          //   populators: {
          //     name: "codes",
          //   },
          // },
        ],
      },
      label: "",
      children: {},
      show: true,
    },
    searchResult: {
      label: "",
      uiConfig: {
        tableClassName: "table-fixed-last-column table",
        columns: [
          {
            label: "WBH_HIERARCHY_TYPE",
            jsonPath: "hierarchyType",
            additionalCustomization: true,
          }
        ],
        enableGlobalSearch: false,
        enableColumnSort: true,
        resultsJsonPath: "TenantBoundary",
        manualPagination: false,
      },
      children: {},
      show: true,
    },
  },
  additionalSections: {},
  customHookName: "",
};
