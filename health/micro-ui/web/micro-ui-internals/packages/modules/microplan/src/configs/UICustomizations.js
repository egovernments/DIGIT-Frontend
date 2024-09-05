import { Link,useHistory } from "react-router-dom";
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
  SearchPucarConfig: {
    customValidationCheck: (data) => {
      //checking both to and from date are present
      const { createdFrom, createdTo } = data;
      if ((createdFrom === "" && createdTo !== "") || (createdFrom !== "" && createdTo === ""))
        return { warning: true, label: "ES_COMMON_ENTER_DATE_RANGE" };

      return false;
    },
    preProcess: (data) => {
      //   data.params = { ...data.params, tenantId: Digit.ULBService.getCurrentTenantId() };

      //   let requestBody = { ...data.body.Individual };
      //   const pathConfig = {
      //     name: "name.givenName",
      //   };
      //   const dateConfig = {
      //     createdFrom: "daystart",
      //     createdTo: "dayend",
      //   };
      //   const selectConfig = {
      //     wardCode: "wardCode[0].code",
      //     socialCategory: "socialCategory.code",
      //   };
      //   const textConfig = ["name", "individualId"];
      //   let Individual = Object.keys(requestBody)
      //     .map((key) => {
      //       if (selectConfig[key]) {
      //         requestBody[key] = _.get(requestBody, selectConfig[key], null);
      //       } else if (typeof requestBody[key] == "object") {
      //         requestBody[key] = requestBody[key]?.code;
      //       } else if (textConfig?.includes(key)) {
      //         requestBody[key] = requestBody[key]?.trim();
      //       }
      //       return key;
      //     })
      //     .filter((key) => requestBody[key])
      //     .reduce((acc, curr) => {
      //       if (pathConfig[curr]) {
      //         _.set(acc, pathConfig[curr], requestBody[curr]);
      //       } else if (dateConfig[curr] && dateConfig[curr]?.includes("day")) {
      //         _.set(acc, curr, Digit.Utils.date.convertDateToEpoch(requestBody[curr], dateConfig[curr]));
      //       } else {
      //         _.set(acc, curr, requestBody[curr]);
      //       }
      //       return acc;
      //     }, {});

      //   data.body.Individual = { ...Individual };
      console.log(data, "data");
      return data;
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      //here we can add multiple conditions
      //like if a cell is link then we return link
      //first we can identify which column it belongs to then we can return relevant result
      switch (key) {
        case "MASTERS_WAGESEEKER_ID":
          return (
            <span className="link">
              <Link to={`/${window.contextPath}/employee/masters/view-wageseeker?tenantId=${row?.tenantId}&individualId=${value}`}>
                {String(value ? (column.translate ? t(column.prefix ? `${column.prefix}${value}` : value) : value) : t("ES_COMMON_NA"))}
              </Link>
            </span>
          );

        case "MASTERS_SOCIAL_CATEGORY":
          return value ? <span style={{ whiteSpace: "nowrap" }}>{String(t(`MASTERS_${value}`))}</span> : t("ES_COMMON_NA");

        case "CORE_COMMON_PROFILE_CITY":
          return value ? <span style={{ whiteSpace: "nowrap" }}>{String(t(Digit.Utils.locale.getCityLocale(value)))}</span> : t("ES_COMMON_NA");

        case "MASTERS_WARD":
          return value ? (
            <span style={{ whiteSpace: "nowrap" }}>{String(t(Digit.Utils.locale.getMohallaLocale(value, row?.tenantId)))}</span>
          ) : (
            t("ES_COMMON_NA")
          );

        case "MASTERS_LOCALITY":
          return value ? (
            <span style={{ whiteSpace: "break-spaces" }}>{String(t(Digit.Utils.locale.getMohallaLocale(value, row?.tenantId)))}</span>
          ) : (
            t("ES_COMMON_NA")
          );
        default:
          return t("ES_COMMON_NA");
      }
    },
    MobileDetailsOnClick: (row, tenantId) => {
      let link;
      Object.keys(row).map((key) => {
        if (key === "MASTERS_WAGESEEKER_ID")
          link = `/${window.contextPath}/employee/masters/view-wageseeker?tenantId=${tenantId}&wageseekerId=${row[key]}`;
      });
      return link;
    },
    additionalValidations: (type, data, keys) => {
      if (type === "date") {
        return data[keys.start] && data[keys.end] ? () => new Date(data[keys.start]).getTime() <= new Date(data[keys.end]).getTime() : true;
      }
    },
  },
  VehicleSearchConfig: {
    preProcess: (data) => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      data.body.MdmsCriteria.tenantId = tenantId;

      const filters = {};
      const custom = data.body.MdmsCriteria.customs;

      const { field, value } = custom || {};
      if (field && field.name && value) {
        filters[field.name] = value;
      }

      data.body.MdmsCriteria.filters = filters;
      delete data.body.customs;
      return data;

    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {

      if (key === "Vehicle Type") {
        return <div> ${value} </div>
      }
      return <div> Aib</div>


    },
  },



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
      // debugger;
      return data;
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      if(key==="Actions"){
        return (
          <Dropdown
          option={[
            { code: "1", name: "Edit Setup" },
            { code: "2", name: "Duplicate Setup" },
            { code: "3", name: "View Summary" },
          ]}
          select={(e)=>{console.log(e,"event")}}
          optionKey={"name"}
          selected={{ code: "1", name: "Actions" }}
        ></Dropdown>
        // <p>$${value}</p>

        );
      }

      if(key==="Name of the Microplan"){
        if (value && value !== "NA"){
          
        return(
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
      }else{
        return(
          <div>
            <p>NA</p>
          </div>
        )
      }

      }

    },
  },



};