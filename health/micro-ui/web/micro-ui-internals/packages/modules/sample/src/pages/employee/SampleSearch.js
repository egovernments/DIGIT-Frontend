import React from 'react'
import { AddFilled, Button, Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import { useNavigate } from 'react-router-dom';

const config = {
    label: "WBH_SEARCH_MDMS",
    type: "search",
    actionLabel: "WBH_ADD_MDMS",
    actionRoles: ["MDMS_ADMIN","CAMPAIGN_ADMIN","SUPERUSER"],
    actionLink: "workbench/mdms-add-v2",
    apiDetails: {  
      serviceName: `/health-facility/v1/_search?tenantId=dev&limit=10&offset=0`,
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


const SampleSearch = () => {
  console.log("sample Searchs");
  const navigate = useNavigate();

  const onClickRow = ({original:row}) => {
    console.log(row);
    // const [moduleName,masterName] = row.schemaCode.split(".")
    // const additionalParamString = new URLSearchParams(additionalParams).toString();
    navigate(`/${window.contextPath}/employee/hrms/assignment-view`, {rowData : row})
  }
  console.log("sample Searchs");
  return (
    <InboxSearchComposer configs={config} additionalConfig = {{
      resultsTable:{
        onClickRow
      }}}></InboxSearchComposer>
  )
}

export default SampleSearch;