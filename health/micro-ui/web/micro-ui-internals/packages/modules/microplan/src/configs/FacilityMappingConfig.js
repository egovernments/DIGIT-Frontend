import { useMyContext } from "../utils/context";

//ProjectType will be ["LLIN-mz","MR-DN"] for microplan
const facilityMappingConfig = (projectType, disabledAction) => {

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
      minParametersForSearchForm: 0,
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
          formClassName: "custom-both-clear-search facility-mapping-config",
          primaryLabel: "ES_COMMON_FILTER",
          secondaryLabel: "ES_COMMON_CLEAR_FILTER",
          minReqFields: 0,
          showFormInstruction: "",
          defaultValues: {
            facilityName: "",
            facilityType: "",
            status: "",
            residingBoundaries: [],
          },
          fields: [
            {
              label: "MICROPLAN_FACILITY_NAME_LABEL",
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
              label: "MICROPLAN_FACILITY_TYPE_LABEL",
              type: "dropdown",
              isMandatory: false,
              disable: false,
              populators: {
                name: "facilityType",
                optionsKey: "name",
                optionsCustomStyle: {
                  top: "2.3rem",
                },
                options: state?.facilityType || []
              },
            },
            {
              label: "CORE_COMMON_STATUS_LABEL",
              type: "dropdown",
              isMandatory: false,
              disable: false,
              populators: {
                "optionsCustomStyle": {
                  "top": "2.3rem"
                },
                name: "status",
                optionsKey: "name",
                options: state?.facilityStatus || []
              },
            },
            {
              label: "MICROPLAN_RESIDING_VILLAGE_LABEL",
              type: "apidropdown",
              isMandatory: false,
              disable: false,
              populators: {
                optionsCustomStyle: {
                  top: "2.3rem",
                },
                name: "residingBoundaries",
                optionsKey: "code",
                allowMultiSelect: true,
                masterName: "commonUiConfig",
                moduleName: "FacilityMappingConfig",
                customfn: "getFacilitySearchRequest",
                lowestHierarchy: state?.lowestHierarchy
              }
            }                   
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
              label: `MICROPLAN_FACILITY_${projectType}_CAPACITY`,
              jsonPath: "additionalDetails.capacity",
              additionalCustomization: true,
              projectType: projectType,
            },
            {
              label: "MICROPLAN_FACILITY_ASSIGNED_VILLAGES",
              jsonPath: "additionalDetails.assignedVillage",
              additionalCustomization: true,
            },
            {
              label: "MICROPLAN_FACILITY_SERVINGPOPULATION",
              jsonPath: "additionalDetails.servingPopulation",
              additionalCustomization: true,
            },
            {
              label: "MICROPLAN_FACILITY_FIXEDPOST",
              jsonPath: "additionalDetails.fixedPost",
            },
            {
              label: "MICROPLAN_FACILITY_RESIDINGVILLAGE",
              jsonPath: "residingBoundary",
              additionalCustomization: true,
            },
            {
              label: disabledAction ? "HCM_MICROPLAN_FACILITY_VIEW_ASSIGNMENT":"HCM_MICROPLAN_FACILITY_ACTION_ASSIGNMENT",
              jsonPath: "",
              additionalCustomization: true,
            },
            {
              label: "VIEW_ON_MAP",
              jsonPath: "",
              additionalCustomization: true,
            },
            // {
            //   label: "MICROPLAN_FACILITY_ACTION",
            //   // jsonPath: "message",
            //   // type:"action",
            //   svg:"EditIcon",
            // }
          ],
          enableGlobalSearch: false,
          enableColumnSort: true,
          resultsJsonPath: "PlanFacility",
        },
        children: {},
        show: true,
      },
    },
    customHookName: "microplanv1.useFcilityCatchmentMapping",
    additionalSections: {},
  };
};

export default facilityMappingConfig;
