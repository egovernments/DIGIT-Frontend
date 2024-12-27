import React from 'react'
import { AddFilled, Button, Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";

const config = {
    // label: "WBH_SEARCH_MDMS",
    type: "search",
    // actionLabel: "WBH_ADD_MDMS",
    // actionRoles: ["MDMS_ADMIN","CAMPAIGN_ADMIN","SUPERUSER"],
    // actionLink: "workbench/mdms-add-v2",
    apiDetails: {  
      serviceName: `/mdms-v2/v2/_search`,
      requestParam: {
      },
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
          // submitContainerStyles:{
          //   flexDirection:"column-reverse",
          //   marginTop:"2rem",
          //   alignItems:"center",
          //   justifyContent:"end"
          // },
          headerStyle: null,
          formClassName: "", //"custom-both-clear-search",
          primaryLabel: "ES_COMMON_SEARCH",
          secondaryLabel: "ASSIGNMENT_CLEAR_SEARCH",
          minReqFields: 0,
          defaultValues: {
            value: "",
            field: "",
            isActive:{
              code: "WBH_COMMON_ALL",
              value: "all",
            }
            // createdFrom: "",
            // createdTo: "",
          },
          fields: [
            {
              label: "assignment_FIELD",
              type: "dropdown",
              isMandatory: false,
              disable: false,
              populators: {
                name: "field",
                optionsKey: "code",
                optionsCustomStyle: { top: "2.3rem" },
                options: [
                  {
                    code: "DUMMY_1",
                    value: true,
                  },
                  {
                    code: "DUMMY_2",
                    value: false,
                  },
                  {
                    code: "DUMMY_3",
                    value: "all",
                  },
                  {
                    code: "DUMMY_4",
                    value: true,
                  },
                  {
                    code: "DUMMY_5",
                    value: false,
                  },
                  {
                    code: "DUMMY_6",
                    value: "all",
                  },
                ],
              },
            },
            {
              label: "assignment_VALUE",
              type: "text",
              isMandatory: false,
              disable: false,
              populators: {
                name: "value",
                validation: { pattern: {}, maxlength: 140 },
              },
            },
            {
              label: "assignment_ISACTIVE",
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
            // {
            //   label: "CREATED_FROM_DATE",
            //   type: "date",
            //   isMandatory: false,
            //   disable: false,
            //   key: "createdFrom",
            //   preProcess: {
            //     updateDependent: ["populators.max"],
            //   },
            //   populators: { name: "createdFrom", max: "currentDate" },
            // },
            // {
            //   label: "CREATED_TO_DATE",
            //   type: "date",
            //   isMandatory: false,
            //   disable: false,
            //   key: "createdTo",
            //   preProcess: {
            //     updateDependent: ["populators.max"],
            //   },
            //   populators: {
            //     name: "createdTo",
            //     error: "DATE_VALIDATION_MSG",
            //     max: "currentDate",
            //   },
            //   additionalValidation: {
            //     type: "date",
            //     keys: { start: "createdFrom", end: "createdTo" },
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
          columns: [
            {
              label: "Schema Code",
              jsonPath: "schemaCode"
              // additionalCustomization:true
            },
            {
              label: "Id",
              jsonPath: "id",
            },
            {
              label: "Action Id",
              jsonPath: "data.actionid",
            },
            {
              label: "is Active",
              jsonPath: "isActive",
            },
            { label: "Tenant Id",
              jsonPath: "tenantId" }
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


const AssignmentSearch = () => {
    console.log("Asgnsearch")
  return (
    <InboxSearchComposer configs={config}></InboxSearchComposer>
  )
}

export default AssignmentSearch