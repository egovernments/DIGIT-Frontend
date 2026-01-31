const tenantId = Digit?.ULBService?.getCurrentTenantId();
export const boundarySearchConfig = [
    {
      // label: "Search",
      type: "search",
      apiDetails: {
        serviceName: "/boundary-service/boundary-hierarchy-definition/_search",
        requestParam: {
            "offset": 0,
            "limit": 10
        },
        requestBody: {
          BoundaryTypeHierarchySearchCriteria: {
            "tenantId": tenantId,
            "hierarchyType": "",
            "limit": 10,
            "offset": 0,
          
          },
          

        },
          Pagination:{
            "offset": 0,
            "limit": 10
          },
        masterName: "commonUiConfig",
        moduleName: "MyBoundarySearchConfig",
        minParametersForSearchForm: 0,
        tableFormJsonPath: "requestBody.BoundaryTypeHierarchySearchCriteria",
        filterFormJsonPath: "requestBody",
        searchFormJsonPath: "requestBody",
      },
      sections: {
        search: {
          uiConfig: {
            formClassName: "custom-both-clear-search",
            primaryLabel: "ES_COMMON_SEARCH",
            secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
            minReqFields: 0,
            defaultValues: {
              Name: ""
            },
            fields: [
              {
                  label: "HIERARCHY_NAME",
                  isMandatory: "false",
                  key: "Name",
                  type: "text",
                  populators: {
                    name: "Name",
                    optionsKey: "code",
                    // options:[]
                  }
              },
              // {
              //   label: "Type of Campaign",
              //   isMandatory: "false",
              //   key: "Type",
              //   type: "text",
              //   populators: {
              //     name: "Type",
              //     optionsKey: "list",
              //     // options:[]
              //   }
              // },
            ],
          },
  
          show: true
        },
        searchResult: {
          // tenantId: Digit?.ULBService?.getCurrentTenantId(),
          uiConfig: {
            columns: [
              {
                label: "HIERARCHY_NAME",
                jsonpath: "hierarchyType",
                additionalCustomization: true
              },
              {
                label: "LEVELS",
                jsonpath: "auditDetails.createdBy",
                additionalCustomization: true
              },
              {
                label: "CREATION_DATE",
                jsonpath: "auditDetails.createdTime",
                additionalCustomization: true
              },
              {
                label: "ACTION",
                jsonPath:"isActive",
                additionalCustomization: true
              }
            ],
  
            enableColumnSort: true,
            resultsJsonPath: "BoundaryHierarchy"
          },
          show: true,
        },
      },
    },
  ];
  