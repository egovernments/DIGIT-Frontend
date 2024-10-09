import { Link } from "react-router-dom";
import _ from "lodash";
import React from "react";
import { Dropdown } from "@egovernments/digit-ui-components";


//create functions here based on module name set in mdms(eg->SearchProjectConfig)
//how to call these -> Digit?.Customizations?.[masterName]?.[moduleName]
// these functions will act as middlewares
// var Digit = window.Digit || {};

const businessServiceMap = {};

const inboxModuleNameMap = {};



function cleanObject(obj) {
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      if (Array.isArray(obj[key])) {
        if (obj[key].length === 0) {
          delete obj[key];
        }
      } else if (
        obj[key] === undefined ||
        obj[key] === null ||
        obj[key] === false ||
        obj[key] === "" || // Check for empty string
        (typeof obj[key] === "object" && Object.keys(obj[key]).length === 0)
      ) {
        delete obj[key];
      }
    }
  }
  return obj;
}

export const UICustomizations = {

  MicroplanSearchConfig: {
    preProcess: (data, additionalDetails) => {
      const { name, status } = data?.state?.searchForm || {};

      data.body.PlanConfigurationSearchCriteria = {};
      data.body.PlanConfigurationSearchCriteria.limit = data?.state?.tableForm?.limit;
      // data.body.PlanConfigurationSearchCriteria.limit = 10
      data.body.PlanConfigurationSearchCriteria.offset = data?.state?.tableForm?.offset;
      data.body.PlanConfigurationSearchCriteria.name = name;
      data.body.PlanConfigurationSearchCriteria.tenantId = Digit.ULBService.getCurrentTenantId();
      data.body.PlanConfigurationSearchCriteria.userUuid = Digit.UserService.getUser().info.uuid;
      // delete data.body.PlanConfigurationSearchCriteria.pagination
      data.body.PlanConfigurationSearchCriteria.status = status?.status;
      cleanObject(data.body.PlanConfigurationSearchCriteria);

      return data;
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      if (key === "Actions") {
        return (
          <Dropdown
            option={[
              { code: "1", name: "Edit Setup" },
              { code: "2", name: "Duplicate Setup" },
              { code: "3", name: "View Summary" },
            ]}
            select={(e) => { console.log(e, "event") }}
            optionKey={"name"}
            selected={{ code: "1", name: "Actions" }}
          ></Dropdown>
          // <p>$${value}</p>

        );
      }

      if (key === "Name of the Microplan") {
        if (value && value !== "NA") {

          return (
            <div
              style={{
                maxWidth: '15rem', // Set the desired maximum width
                wordWrap: 'break-word', // Allows breaking within words
                whiteSpace: 'normal', // Ensures text wraps normally
                overflowWrap: 'break-word' // Break long words at the edge
              }}
            >
              <p>{value}</p>
            </div>
          )
        } else {
          return (
            <div>
              <p>NA</p>
            </div>
          )
        }

      }

    },
  },

  UserManagementConfig: {

    customValidationCheck: (data) => {
      //checking both to and from date are present
      const { mobileNumber } = data;
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(mobileNumber)) {
        return { error: true, label: "INVALID_MOBILE_NUMBER" }; // Return an error message if invalid
      }

      return true;
    },
    preProcess: (data, additionalDetails) => {

      const { phone, name } = data?.state?.searchForm || {}
      const { sortOrder } = data?.state?.filterForm || {}
      let { roleschosen } = data?.state?.filterForm || []
      // console.log(additionalDetails["microplanData"])
      // debugger;
      if (!roleschosen) {
        roleschosen = {}
      }
      // if(Object.keys(roleschosen).length === 0){
      //   for(const obj of additionalDetails["microplanData"]){

      //     roleschosen[obj["roleCode"]]=true;

      //   }
      // }

      let rolesString = '';
      if (roleschosen) {
        rolesString = Object.keys(roleschosen).filter(role => roleschosen[role] === true).join(',');
      }
      // debugger;
      console.log("data", data);
      console.log("additionalDetails", additionalDetails);

      data.params.names = name;

      data.params.phone = phone;
      // debugger
      data.params.roles = rolesString;
      data.params.tenantId = Digit.ULBService.getCurrentTenantId();
      cleanObject(data.params);
      delete data.params.roleschosen;
      delete data.params.name;
      // console.log(data,"dat");
      // data.param.roles=roles;

      return data
    },

    rolesForFilter: (props) => {
      const userInfo = Digit.UserService.getUser();
      const tenantId = Digit.ULBService.getCurrentTenantId();
      // debugger
      return {
        params: {},
        url: '/mdms-v2/v2/_search', //mdms fetch from

        body: {
          MdmsCriteria: {
            tenantId: "mz",
            filters: {},
            schemaCode: "hcm-microplanning.rolesForMicroplan",
            limit: 10,
            offset: 0
          }

        },
        config: {
          enabled: true,
          select: (data) => {
            console.log("dates", data)
            const roles = data?.mdms.map(item => {
              return (
                {
                  roleCode: item.data.roleCode,
                  i18nKey: Digit.Utils.locale.getTransformedLocale(`MP_ROLE_${item.data.roleCode}`)
                  // orderNumber: item.data.orderNumber

                  // roleCode:{labelKey:item.data.roleCode}

                }
              )
            })
            // debugger
            return roles
          },
        },
        // changeQueryName:"setPlantUsersInboxDropdown"
      }
    },




    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      debugger

      if (key === "Name") {
        if (value && value !== "NA") {

          return (
            <span className="link">
              <Link to={`/digit-ui/employee/hrms/details/mz/${value}`}>{value}</Link>
            </span>
          )
        } else {
          return (
            <div>
              <p>NA</p>
            </div>
          )
        }

      }

    },

  }

};