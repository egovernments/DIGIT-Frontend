import { Link, useHistory } from "react-router-dom";
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
    preProcess: (data) => {

      const { phone, name } = data?.state?.searchForm || {}
      const { sortOrder } = data?.state?.filterForm || {}
      const {roles} = data?.state?.filterForm || {}
      console.log("data",data);
      
      data.params.name=name;
      data.params.phone=phone;
      
      console.log(data,"dat");
      // data.param.roles=roles;

      return data
    },

    populatePlantUsersReqCriteria:(props) => {
      const userInfo = Digit.UserService.getUser();
      const tenantId = Digit.ULBService.getCurrentTenantId();

      return {
        params:{},
        url:'/egov-hrms/employees/_search',
        body:{
          "plantUserSearchCriteria": {
            tenantId,
            // "plantCodes": [],
            "plantUserUuids": userInfo?.info?.uuid ?  [userInfo?.info?.uuid]: [],
            "additionalDetails": {}
          },
          "pagination": {}
        },
        config: {
          select:(data)=> {
            return Digit.SessionStorage.get("user_plants");
          }
        },
        changeQueryName:"setPlantUsersInboxDropdown"
      }
    },
    
  }

};