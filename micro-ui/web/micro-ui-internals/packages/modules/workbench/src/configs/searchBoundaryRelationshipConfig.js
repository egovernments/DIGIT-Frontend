export const searchBoundaryRelationshipConfig = {
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
    moduleName: "SearchBoundaryHierarchyConfig",
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
          {
            label: "WBH_BOUNDARY_TYPE",
            type: "dropdown",
            isMandatory: false,
            disable: false,
            populators: {
              name: "boundaryType",
              optionsKey: "boundaryType",
              optionsCustomStyle: { top: "2.3rem" },
            },
          },
          {
            label: "CORE_COMMON_NAME",
            type: "text",
            isMandatory: false,
            disable: false,
            populators: {
              name: "codes",
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
      uiConfig: {
        tableClassName: "table-fixed-last-column table",
        columns: [
          {
            label: "CORE_COMMON_NAME",
            jsonPath: "code",
          },
          {
            label: "WBH_LEVEL",
            jsonPath: "message",
          },
          {
            label: "WBH_PARENT_BOUNDARY_NAME",
            jsonPath: "defaultMessage",
          },
          {
            label: "WBH_PARENT_BOUNDARY_LEVEL",
            jsonPath: "module",
          },
          {
            label: "CS_COMMON_ACTION",
            // jsonPath: "message",
            // type:"action",
            svg: "EditIcon",
          },
        ],
        enableGlobalSearch: false,
        enableColumnSort: true,
        resultsJsonPath: "BoundaryHierarchy",
        manualPagination: false,
      },
      children: {},
      show: true,
    },
  },
  additionalSections: {},
  customHookName: "",
};
