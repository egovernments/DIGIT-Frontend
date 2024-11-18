const defaultSearchValues = {
  options: [],
  value: "",
};

const SearchEstimateConfig = () => {
  return {
    label: "Estimate Search",
    type: "search",
    apiDetails: {
      serviceName: "/mdms-v2/v2/_search",
      requestBody: {
        apiOperation: "SEARCH",
        MdmsCriteria: {
          tenantId: Digit.ULBService.getCurrentTenantId(),
          customs: {},
          // tenantId: "pg",
        },
      },
      masterName: "commonUiConfig",
      moduleName: "SearchEstimateConfig",
      minParametersForSearchForm: 0,
      tableFormJsonPath: "requestParam",
      searchFormJsonPath: "requestBody.MdmsCriteria.customs",
      filterFormJsonPath: "requestBody.MdmsCriteria.customs",
    },
    sections: {
      search: {
        uiConfig: {
          formClassName: "custom-both-clear-search",
          primaryLabel: "ES_COMMON_SEARCH",
          secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
          minReqFields: 0,
          defaultValues: defaultSearchValues, // Set default values for search fields
          fields: [
            {
              label: "Options",
              isMandatory: false,
              key: "options",
              type: "dropdown",
              populators: {
                name: "options",
                error: "Required",
                optionsKey: "label",
                // options: requestBody.MdmsCriteria,
                options: [
                  {
                    label: "Name",
                    // type: "text",
                    name: "name",
                  },
                  {
                    label: "Description",
                    name: "description",
                  },

                  {
                    label: "Executing Department",
                    name: "executingDepartment",
                  },
                ],
                validation: { pattern: /^[A-Za-z]+$/i },
              },
            },
            {
              label: "Value",
              isMandatory: false,
              key: "value",
              type: "text",
              disable: false,
              populators: { name: "value", error: "sample error message" },
            },
          ],
        },

        show: true,
      },
      searchResult: {
        tenantId: Digit.ULBService.getCurrentTenantId(),
        // tenantId: "pb",
        uiConfig: {
          columns: [
            {
              label: "Name",
              jsonPath: "data.name",
            },

            {
              label: "Description",
              jsonPath: "data.description",
            },
            {
              label: "Executing Department",
              jsonPath: "data.executingDepartment",
            },
          ],

          enableColumnSort: true,
          resultsJsonPath: "mdms",
        },
        show: true,
      },
    },
  };
};

export default SearchEstimateConfig;
