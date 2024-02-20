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
        minReqFields: 0,
        defaultValues: {
          hierarchyType: "",
          boundaryType: "",
          codes: "",
        },
        fields: [
          {
            label: "WBH_HIERARCHY_TYPE",
            type: "text",
            isMandatory: false,
            disable: true,
            populators: {
              name: "hierarchyType",
              // optionsKey: "hierarchyType",
              // optionsCustomStyle: { top: "2.3rem" },
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
            label: "WBH_LEVEL",
            jsonPath: "boundaryType",
            additionalCustomization: true,
          },
          {
            label: "WBH_CODE",
            jsonPath: "code",
            additionalCustomization: true,
          },
          {
            label: "WBH_PARENT_BOUNDARY_NAME",
            jsonPath: "hierarchyType",
            // additionalCustomization: true,
          },

          {
            label: "WBH_LEVEL",
            jsonPath: "",
            // additionalCustomization: true,
          },
          // {
          //   label: "WBH_PARENT_BOUNDARY_NAME",
          //   jsonPath: "",
          // },
          // {
          //   label: "WBH_PARENT_BOUNDARY_LEVEL",
          //   jsonPath: "boundaryType",
          // },
          {
            label: "CS_COMMON_ACTION",
            // jsonPath: "message",
            // type:"action",
            svg: "EditIcon",
          },
        ],
        enableGlobalSearch: false,
        enableColumnSort: true,
        resultsJsonPath: "TenantBoundary[0].boundary",
        manualPagination: false,
      },
      children: {},
      show: true,
    },
  },
  additionalSections: {},
  customHookName: "",
};
