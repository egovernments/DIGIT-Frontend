import React from 'react'
import { AddFilled, Button, Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

const config = {
    label: "WBH_SEARCH_MDMS",
    type: "search",
    actionLabel: "WBH_ADD_MDMS",
    actionRoles: ["MDMS_ADMIN","CAMPAIGN_ADMIN","SUPERUSER"],
    actionLink: "workbench/mdms-add-v2",
    apiDetails: {  
      serviceName: `/facility/v1/_search`,
      requestParam: {
        
      },
      requestBody: {
      },
      minParametersForSearchForm: 0,
      masterName: "commonUiConfig",
      moduleName: "SearchFacilityConfig", //used in preprocess
      tableFormJsonPath: "requestBody.Facility",
      filterFormJsonPath: "requestBody.Facility",
      searchFormJsonPath: "requestBody.Facility"
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
          secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
          minReqFields: 0,
          defaultValues: {
            // value: "",
            // field: "",
            // isActive:{
            //   code: "WBH_COMMON_ALL",
            //   value: "all",
            // }
            // createdFrom: "",
            // createdTo: "",
          },
          fields: [
            {
              label: "Search Criteria",
              type: "dropdown",
              isMandatory: false,
              disable: false,
              populators: {
                name: "field",
                optionsKey: "code",
                optionsCustomStyle: { top: "2.3rem" },
                options: [
                  {
                    code: "id",
                    value: "id",
                  },
                  {
                    code: "usage",
                    value: "usage",
                  }
                ],
              },
            },
            {
              label: "Value",
              type: "text",
              isMandatory: false,
              disable: false,
              populators: {
                name: "value",
                validation: { pattern: {}, maxlength: 140 },
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
            {
              label: "Facility Name",
              jsonPath: "name",
              // additionalCustomization:true
            },
            {
              label: "Facility Usage",
              jsonPath: "usage",
            },
            { label: "Tenant Id",
              jsonPath: "tenantId",
              additionalCustomization:true
            },
            { label: "Button",
              jsonPath: "",
              additionalCustomization:true
            },
          ],
          enableGlobalSearch: false,
          enableColumnSort: true,
          resultsJsonPath: "Facilities",
          rowClassName:"table-row-mdms table-row-mdms-hover",
          noColumnBorder:true
        },
        children: {},
        show: true,
      },
    },
    additionalSections: {},
  };  


const AssignmentSearchs = () => {
  console.log("Assignment Searchs");
  const history = useHistory();

  const onClickRow = ({original:row}) => {
    console.log(row);
    // const [moduleName,masterName] = row.schemaCode.split(".")
    // const additionalParamString = new URLSearchParams(additionalParams).toString();
    history.push(`/${window.contextPath}/employee/hrms/assignment-view`, {rowData : row})
  }
  console.log("Asgnsearch")
  return (
    <InboxSearchComposer configs={config} additionalConfig = {{
      resultsTable:{
        onClickRow
      }}}></InboxSearchComposer>
  )
}

export default AssignmentSearchs;