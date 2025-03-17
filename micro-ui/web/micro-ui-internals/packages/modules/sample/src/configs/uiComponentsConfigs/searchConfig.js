import React from "react";

const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;

export const searchConfig = {
  headerLabel: "Search", // label is changed to headerLabel (Screen Header Label)
  type: "search", // type of the screen ("inbox","serach")
  // moved actions releated props inside actions object
  actions: {
    actionLabel: "Action1", // label of the action
    actionRoles: ["MDMS_ADMIN"], // action will be shown only when user has any one of the actionRoles
    actionLink: "workbench/mdms-add-v2", // link to be directed when action is clicked
  },
  apiDetails: {
    serviceName: `/egov-mdms-service/v2/_search`,
    requestParam: {}, // Todo: these two are not required
    requestBody: {
      MdmsCriteria: {},
    },
    minParametersForSearchForm: 0,
    masterName: "commonUiConfig",
    moduleName: "SearchMDMSConfig",
    tableFormJsonPath: "requestBody.MdmsCriteria",
    filterFormJsonPath: "requestBody.MdmsCriteria.custom",
    searchFormJsonPath: "requestBody.MdmsCriteria.custom",
  },
  sections: {
    search: {
      uiConfig: {
        headerStyle: null,
        formClassName: "",
        primaryLabel: "ES_COMMON_SEARCH",
        secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
        minReqFields: 1,
        defaultValues: {
          value: "",
          field: "",
          isActive: {
            code: "WBH_COMMON_ALL",
            value: "all",
          },
        },
        fields: [
          {
            label: "Field",
            type: "dropdown",
            isMandatory: false,
            disable: false,
            // Todo: all field level props should be outside populators
            populators: {
              name: "field", // Todo: call it as jsonPath
              optionsKey: "name",
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
            label: "Value",
            type: "text",
            isMandatory: false,
            disable: false,
            populators: {
              name: "value",
              validation: { pattern: {}, maxlength: 140 },
            },
          },
          {
            label: "IsActive",
            type: "dropdown",
            isMandatory: false,
            disable: false,
            populators: {
              name: "isActive",
              optionsKey: "code",
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
                },
              ],
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
            label: "Unique Identifier",
            jsonPath: "uniqueIdentifier",
            disableSortBy: true,
          },
          {
            label: "Id",
            jsonPath: "id",
            link: true, // to show as a link button,
            buttonProps:{
              size: "", // can configure link button size
              icon: "Edit",
              // linkTo: "microplan/components", // can add icon to link button
            }
          },
          {
            label: "tenantId",
            jsonPath: "tenantId",
          },
          {
            label: "Active",
            jsonPath: "isActive",
            additionalCustomization: true,
          },
        ],
        selectionProps: {
          showCheckBox: true,
          showSelectedState: true,
          selectableRowsNoSelectAll: false,
          // showSelectedStatePosition:"bottom", can also be sent like this
        },
        expandableProps: {
          expandableRows: true,
          expandableRowsComponent: ExpandedComponent,
        },
        tableProps: {
          showTableDescription: "This is the search table description",
          showTableTitle: "Search table title",
        },
        actionProps: {
          actions: [
            {
              label: "Action1",
              variation: "secondary",
              icon: "Edit",
            },
            {
              label: "Action2",
              variation: "primary",
              icon: "CheckCircle",
            },
          ],
        },
        enableGlobalSearch: true,
        enableColumnSort: true,
        resultsJsonPath: "mdms",
        rowClassName: "table-row-mdms table-row-mdms-hover",
        defaultSortAsc: true,
      },
      children: {},
      show: true,
    },
  },
  footerProps: {
    showFooter: true, // to show the footer
    allowedRolesForFooter: ["MDMS_ADMIN"], // shows the footer only when user has any one of the allowed roles
    actionFields: [
      {
        label: "FooterAction1",
        icon: "ArrowBack",
        isSuffix: false,
        variation: "secondary",
        allowedRoles: ["MDMS_ADMIN"],// shows only when user has any one of the allowed roles
      },
      {
        label: "FooterAction2",
        icon: "ArrowForward",
        isSuffix: true,
        variation: "primary",
        allowedRoles: ["MDMS_USER"],// shows only when user has any one of the allowed roles
      },
    ],
    // maxActionFieldsAllowed: 1, // can set the maxfields to be shown on footer
    // setactionFieldsToLeft :false, // alignment of fields
    setactionFieldsToRight: true, // alignment of fields
    // sortActionFields : false, // flag to sort the action buttons
    className: "inbox-footer",
    style: {},
  },
  // additionalSections: {}, // no more additional sections will be supported
};
