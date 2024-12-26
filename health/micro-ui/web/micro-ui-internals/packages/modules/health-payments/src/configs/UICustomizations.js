import { Link, useHistory } from "react-router-dom";
import React, { useState, Fragment } from "react";
import _ from "lodash";

//create functions here based on module name set in mdms(eg->SearchProjectConfig)
//how to call these -> Digit?.Customizations?.[masterName]?.[moduleName]
// these functions will act as middlewares
// var Digit = window.Digit || {};

const businessServiceMap = {};

const inboxModuleNameMap = {};

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

  AttendanceInboxConfig: {
    preProcess: (data) => {
      console.log(data,"dataaaaaa");
      //set tenantId
      data.body.tenantId = Digit.ULBService.getCurrentTenantId();

      //adding tenantId to moduleSearchCriteria

      //setting limit and offset becoz somehow they are not getting set in muster inbox

      return data;
    },

    postProcess: (responseArray, uiConfig) => {
      
     
      // const statusOptions = responseArray?.statusMap
      //   ?.filter((item) => item.applicationstatus)
      //   ?.map((item) => ({ code: item.applicationstatus, i18nKey: `COMMON_MASTERS_${item.applicationstatus}` }));
      // if (uiConfig?.type === "filter") {
      //   let fieldConfig = uiConfig?.fields?.filter((item) => item.type === "dropdown" && item.populators.name === "musterRollStatus");
      //   if (fieldConfig.length) {
      //     fieldConfig[0].populators.options = statusOptions;
      //   }
      // }
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {

      //registerNumber
      // const tenantId = searchResult[0]?.ProcessInstance?.tenantId;

      switch (key) {
        case "ATTENDANCE_ID":
          return (
            <span className="link">
              <Link to={`/${window?.contextPath}/employee/payments/view-attendance?registerNumber=${row.registerNumber}`}>
                {String(row.registerNumber ? row.registerNumber : t("ES_COMMON_NA"))}
              </Link>
            </span>
          );
        case "MB_ASSIGNEE":
          return value ? <span>{value?.[0]?.name}</span> : <span>{t("NA")}</span>;
        case "MB_WORKFLOW_STATE":
          return <span>{t(`MB_STATE_${value}`)}</span>;
        case "MB_AMOUNT":
          return <Amount customStyle={{ textAlign: "right" }} value={Math.round(value)} t={t}></Amount>;
        case "MB_SLA_DAYS_REMAINING":
          return value > 0 ? <span className="sla-cell-success">{value}</span> : <span className="sla-cell-error">{value}</span>;
        default:
          return t("ES_COMMON_NA");
      }
    },

    MobileDetailsOnClick: (row, tenantId) => {
      let link;
      Object.keys(row).map((key) => {
        if (key === "ATM_MUSTER_ROLL_ID")
          link = `/${window.contextPath}/employee/attendencemgmt/view-attendance?tenantId=${tenantId}&musterRollNumber=${row[key]}`;
      });
      return link;
    },
    populateReqCriteria: () => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      return {
        url: "/org-services/organisation/v1/_search",
        params: { limit: 50, offset: 0 },
        body: {
          SearchCriteria: {
            tenantId: tenantId,
            functions: {
              type: "CBO",
            },
          },
        },
        config: {
          enabled: true,
          select: (data) => {
            return data?.organisations;
          },
        },
      };
    },
  },
};