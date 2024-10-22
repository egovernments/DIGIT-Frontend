import { useMyContext } from "../utils/context";

const facilityMappingConfig = () => {
  const { state, dispatch } = useMyContext();
  return {
    label: "",
    type: "search",
    apiDetails: {
      serviceName: "/plan-service/plan/facility/_search",
      requestParam: {},
      requestBody: {
        PlanFacilitySearchCriteria: {
        },
      },
      minParametersForSearchForm: 1,
      masterName: "commonUiConfig",
      moduleName: "FacilityMappingConfig",
      tableFormJsonPath: "requestBody.PlanFacilitySearchCriteria",
      filterFormJsonPath: "requestBody.PlanFacilitySearchCriteria",
      searchFormJsonPath: "requestBody.PlanFacilitySearchCriteria",
    },
    sections: {
      search: {
        uiConfig: {
          headerStyle: null,
          formClassName: "custom-both-clear-search",
          primaryLabel: "ES_COMMON_FILTER",
          secondaryLabel: "ES_COMMON_CLEAR_FILTER",
          minReqFields: 1,
          showFormInstruction: "",
          defaultValues: {
            facilityName: "",
            facilityType: "",
            status: "",
            residingVillage: "",
          },
          fields: [
            {
              label: "MICROPLAN_FACILITY_NAME",
              type: "text",
              isMandatory: false,
              disable: false,
              preProcess: {
                convertStringToRegEx: ["populators.validation.pattern"],
              },
              populators: {
                name: "facilityName",
                error: "MICROPLAN_PATTERN_ERR_MSG",
                validation: {
                  pattern: '^[^\\$"<>?\\\\~`!@$%^()+={}\\[\\]*:;“”‘’]{1,50}$',
                  minlength: 2,
                },
              },
            },
            {
              label: "MICROPLAN_FACILITY_TYPE",
              type: "dropdown",
              isMandatory: false,
              disable: false,
              populators: {
                name: "facilityType",
                optionsKey: "name",
                optionsCustomStyle: {
                  top: "2.3rem",
                },
                options:state?.facilityType || []
              },
            },
            {
              label: "CORE_COMMON_STATUS",
              type: "dropdown",
              isMandatory: false,
              disable: false,
              populators: {
                "optionsCustomStyle": {
                  "top": "2.3rem"
                },
                name: "status",
                optionsKey: "name",
                options:state?.facilityStatus || []
              },
            },
            {
              label: "MICROPLAN_RESIDING_VILLAGE",
              type: "text",
              isMandatory: false,
              disable: false,
              preProcess: {
                convertStringToRegEx: ["populators.validation.pattern"],
              },
              populators: {
                name: "residingVillage",
                error: "MICROPLAN_PATTERN_ERR_MSG",
                validation: {
                  pattern: '^[^\\$"<>?\\\\~`!@$%^()+={}\\[\\]*:;“”‘’]{1,50}$',
                  minlength: 2,
                },
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
          columns: [
            {
              label: "MICROPLAN_FACILITY_NAME",
              jsonPath: "additionalDetails.facilityName",
            },
            {
              label: "MICROPLAN_FACILITY_TYPE",
              jsonPath: "additionalDetails.facilityType",
            },
            {
              label: "MICROPLAN_FACILITY_STATUS",
              jsonPath: "additionalDetails.facilityStatus",
            },
            {
              label: "MICROPLAN_FACILITY_CAPACITY",
              jsonPath: "additionalDetails.capacity",
            },
            {
              label: "MICROPLAN_FACILITY_ASSIGNED_VILLAGES",
              jsonPath: "additionalDetails.assignedVillage",
              additionalCustomization: true,
            },
            {
              label: "MICROPLAN_FACILITY_SERVINGPOPULATION",
              jsonPath: "additionalDetails.servingPopulation",
            },
            {
              label: "MICROPLAN_FACILITY_FIXEDPOST",
              jsonPath: "additionalDetails.fixedPost",
            },
            {
              label: "MICROPLAN_FACILITY_RESIDINGVILLAGE",
              jsonPath: "residingBoundary",
            },
            {
              label: "MICROPLAN_FACILITY_ACTION",
              jsonPath: "",
              additionalCustomization: true,
            },
          ],
          enableGlobalSearch: false,
          enableColumnSort: true,
          resultsJsonPath: "PlanFacility",
        },
        children: {},
        show: true,
      },
    },
    additionalSections: {},
  };
};

export default facilityMappingConfig;
