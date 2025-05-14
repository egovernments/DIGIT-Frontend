export const Config = {
  label: "WBH_SEARCH_MDMS",
  type: "search",
  actionLabel: "WBH_ADD_MDMS",
  actionRoles: ["MDMS_ADMIN","CAMPAIGN_ADMIN","SUPERUSER"],
  actionLink: "workbench/mdms-add-v2",
  apiDetails: {
    serviceName: `/mdms-v2/v2/_search`,
    requestParam: {},
    requestBody: {
      MdmsCriteria: {
        
      },
    },
    minParametersForSearchForm: 0,
    masterName: "commonUiConfig",
    moduleName: "SearchMDMSConfig",
    tableFormJsonPath: "requestBody.MdmsCriteria",
    filterFormJsonPath: "requestBody.MdmsCriteria.custom",
    searchFormJsonPath: "requestBody.MdmsCriteria.custom"
  },
  sections: {
    search: {
      uiConfig: {
        searchWrapperStyles:{
          flexDirection:"column-reverse",
          marginTop:"2rem",
          alignItems:"center",
          justifyContent:"end",
          gridColumn:"4"
        },
        
        headerStyle: null,
        formClassName: "", //"custom-both-clear-search",
        primaryLabel: "ES_COMMON_SEARCH",
        secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
        minReqFields: 0,
        defaultValues: {
          value: "",
          field: "",
          isActive:{
            code: "WBH_COMMON_ALL",
            value: "all",
          }
         
        },
        fields: [
          {
            label: "WBH_FIELD",
            type: "dropdown",
            isMandatory: false,
            disable: false,
            populators: {
              name: "field",
              optionsKey: "i18nKey",
              optionsCustomStyle: { top: "2.3rem" },
              options: [
                {
                  code: "code",
                  name: "code",
                },
                {
                  code: "name",
                  name: "name",
                },
                {
                  code: "description",
                  name: "description",
                },
              ],
            },
          },
          {
            label: "WBH_FIELD_VALUE",
            type: "text",
            isMandatory: false,
            disable: false,
            populators: {
              name: "value",
              validation: { pattern: {}, maxlength: 140 },
            },
          },
          {
            label: "WBH_ISACTIVE",
            type: "dropdown",
            isMandatory: false,
            disable: false,
            populators: {
              name: "isActive",
              optionsKey: "code",
              optionsCustomStyle: { top: "2.3rem" },
              options: [
                {
                  code: "WBH_COMMON_YES",
                  value: true,
                },
                {
                  code: "WBH_COMMON_NO",
                  value: false,
                },
                {
                  code: "WBH_COMMON_ALL",
                  value: "all",
                }
              ],
            },
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
          
        ],
        enableGlobalSearch: false,
        enableColumnSort: true,
        resultsJsonPath: "mdms",
        rowClassName:"table-row-mdms table-row-mdms-hover",
        noColumnBorder:true
      },
      children: {},
      show: true,
    },
  },
  additionalSections: {},
};
