import React from "react";
import { Link, useHistory } from "react-router-dom";
import _ from "lodash";
import { SVG } from "@egovernments/digit-ui-components";

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
    tenantSearchConfig: {
      customValidationCheck: (data) => {
        //checking both to and from date are present
      },
      preProcess: (data) => {
        const tenantId = Digit.ULBService.getCurrentTenantId();
        data.params = {
          code: tenantId,
          includeSubTenants: true,
        };
        //   data.params = { ...data.params, tenantId: Digit.ULBService.getCurrentTenantId() };
        const { name, code } = data?.state?.searchForm || {};
        if (name) {
          data.params.name = name;
        }
        if (code) {
          data.params.code = code;
        }
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
        return data;
      },
      additionalCustomizations: (row, key, column, value, t, searchResult) => {},
      MobileDetailsOnClick: (row, tenantId) => {},
      additionalValidations: (type, data, keys) => {},
    },
    moduleMasterConfig: {
      preProcess: (data, additionalDetails) => {
        const tenantId = Digit.ULBService.getCurrentTenantId();
        data.params = {
          tenantId: tenantId,
        };
        data.body = { RequestInfo: data.body.RequestInfo };
        data.body.MdmsCriteria = {
          tenantId: tenantId,
          moduleDetails: [
            {
              moduleName: "sandbox-ui",
              masterDetails: [
                {
                  name: "ModuleMasterConfig",
                },
              ],
            },
          ],
        };
        data.config.select = (data) => {
          const temp = data?.MdmsRes?.["sandbox-ui"]?.ModuleMasterConfig?.find((item) => item?.module === additionalDetails?.moduleName);
          return {
            module: temp?.module,
            master: temp?.master?.filter((item) => item.type === "module" || item.type === "common"),
          };
        };
  
        delete data.body.custom;
        delete data.body.inbox;
        // delete data.params;
  
        return data;
      },
      additionalCustomizations: (row, key, column, value, t, searchResult) => {
        //here we can add multiple conditions
        //like if a cell is link then we return link
        //first we can identify which column it belongs to then we can return relevant result
        switch (key) {
          case "SANDBOX_MODULE_NAME":
            // return value?.split(".")?.[0];
            return (
              <span className="link">
                <Link
                  to={`/${window.contextPath}/employee/workbench/mdms-search-v2?moduleName=${value?.split(".")?.[0]}&masterName=${
                    value?.split(".")?.[1]
                  }`}
                >
                  {t(Digit.Utils.workbench.getMDMSLabel(`SCHEMA_` + value))}
                  {/* {t(`SANDBOX_${value?.split(".")?.[0]}`)} */}
                </Link>
              </span>
            );
          case "SANDBOX_MASTER_NAME":
            // return row?.code?.split(".")?.[1] ? t(`SANDBOX_${row?.code?.split(".")?.[1]}`) : t(`SANDBOX_${row?.code?.split(".")?.[0]}`);
            return t(Digit.Utils.workbench.getMDMSLabel(`SCHEMA_` + row?.code));
  
          case "SANDBOX_MASTER_DESCRIPTION":
            return t(`SANDBOX_MASTER_SETUP_DESC_${row.code}`);
  
          case "SANDBOX_ACTIONS":
            const handleRedirect = (e, value, type) => {
              e.stopPropagation();
              if (type === "boundary") {
                window.history.pushState(
                  null,
                  "",
                  `/${window.contextPath}/employee/workbench/upload-boundary?hierarchyType=${value}&from=sandbox&module=${column?.module}`
                );
                const navEvent = new PopStateEvent("popstate");
                window.dispatchEvent(navEvent);
              } else {
                window.history.pushState(
                  null,
                  "",
                  `/${window.contextPath}/employee/workbench/mdms-search-v2?moduleName=${value?.split(".")?.[0]}&masterName=${
                    value?.split(".")?.[1]
                  }&from=sandbox&module=${column?.module}`
                );
                const navEvent = new PopStateEvent("popstate");
                window.dispatchEvent(navEvent);
              }
            };
            return (
              <div>
                <SVG.Edit style={{ cursor: "pointer" }} onClick={(e) => handleRedirect(e, row?.code, row?.type)} />
              </div>
            );
          default:
            return t("ES_COMMON_NA");
        }
      },
    },
  };