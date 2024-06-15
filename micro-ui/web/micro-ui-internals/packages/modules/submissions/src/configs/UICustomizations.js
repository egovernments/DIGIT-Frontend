import { Link, useHistory } from "react-router-dom";
import _ from "lodash";

//create functions here based on module name set in mdms(eg->SearchProjectConfig)
//how to call these -> Digit?.Customizations?.[masterName]?.[moduleName]
// these functions will act as middlewares
// var Digit = window.Digit || {};
const customColumnStyle={ whiteSpace: "nowrap" };
const businessServiceMap = {};

const inboxModuleNameMap = {};

export const UICustomizations = {
     SearchSubmissionsConfig: {
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
        console.log(data,"data");
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
              return value ? <span style={customColumnStyle}>{String(t(`MASTERS_${value}`))}</span> : t("ES_COMMON_NA");
    
            case "CORE_COMMON_PROFILE_CITY":
              return value ? <span style={customColumnStyle}>{String(t(Digit.Utils.locale.getCityLocale(value)))}</span> : t("ES_COMMON_NA");
    
            case "MASTERS_WARD":
              return value ? (
                <span style={customColumnStyle}>{String(t(Digit.Utils.locale.getMohallaLocale(value, row?.tenantId)))}</span>
              ) : (
                t("ES_COMMON_NA")
              );
    
            case "MASTERS_LOCALITY":
              return value ? (
                <span style={customColumnStyle}>{String(t(Digit.Utils.locale.getMohallaLocale(value, row?.tenantId)))}</span>
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
};