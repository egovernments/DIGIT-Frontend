import { Link, useHistory } from "react-router-dom";
import _ from "lodash";
import React from "react";

//create functions here based on module name set in mdms(eg->SearchProjectConfig)
//how to call these -> Digit?.Customizations?.[masterName]?.[moduleName]
// these functions will act as middlewares
// var Digit = window.Digit || {};

const businessServiceMap = {};

const inboxModuleNameMap = {};

export const UICustomizations = {
  MyCampaignConfigAdmin: {
    preProcess: (data, additionalDetails) => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      data.body = { RequestInfo: data.body.RequestInfo };
      data.params.tenantId = tenantId;
      const { limit, offset } = data?.state?.tableForm || {};
      delete data.body.custom;
      delete data.body.inbox;
      return data;
    },
    populateStatusReqCriteria: () => {
      const tenantId = Digit.ULBService.getCurrentTenantId();

      return {
        url: "/egov-workflow-v2/egov-wf/businessservice/_search",
        params: { tenantId, businessServices: businessServiceMap?.tqm },
        body: {},
        changeQueryName: "setWorkflowStatus",
        config: {
          enabled: true,
          select: (data) => {
            const wfStates = data?.BusinessServices?.[0]?.states
              ?.filter((state) => state.applicationStatus)
              ?.map((state) => {
                return {
                  i18nKey: `WF_STATUS_${businessServiceMap?.tqm}_${state?.applicationStatus}`,
                  ...state,
                };
              });
            return wfStates;
          },
        },
      };
    },
    getCustomActionLabel: (obj, row) => {
      return "";
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      switch (key) {
        case "TQM_INBOX_SLA":
          let sla = 0;
          const currentDate = new Date();
          const targetTimestamp = row?.businessObject?.scheduledDate;
          const targetDate = new Date(targetTimestamp);
          const remainingSLA = targetDate - currentDate;
          sla = Math.ceil(remainingSLA / (24 * 60 * 60 * 1000));
          if (!row?.businessObject?.scheduledDate) return t("ES_COMMON_NA");
          return Math.sign(sla) === -1 ? (
            <span className="sla-cell-error">
              {Math.ceil(sla)} {t("COMMON_DAYS_OVERDUE")}
            </span>
          ) : (
            <span className="sla-cell-success">
              {sla} {t("COMMON_DAYS")}
            </span>
          );

        case "TQM_PENDING_DATE":
          return Digit.DateUtils.ConvertEpochToDate(value);

        case "TQM_TEST_ID":
          return (
            <span className="link">
              <Link
                to={`/${
                  window.contextPath
                }/employee/tqm/view-test-results?tenantId=${Digit.ULBService.getCurrentTenantId()}&id=${value}&from=TQM_BREAD_INBOX`}
              >
                {String(value ? (column.translate ? t(column.prefix ? `${column.prefix}${value}` : value) : value) : t("ES_COMMON_NA"))}
              </Link>
            </span>
          );

        default:
          return "case_not_found";
      }
    },
    populatePlantUsersReqCriteria: (props) => {
      const userInfo = Digit.UserService.getUser();
      const tenantId = Digit.ULBService.getCurrentTenantId();

      return {
        params: {},
        url: "/pqm-service/plant/user/v1/_search",
        body: {
          plantUserSearchCriteria: {
            tenantId,
            // "plantCodes": [],
            plantUserUuids: userInfo?.info?.uuid ? [userInfo?.info?.uuid] : [],
            additionalDetails: {},
          },
          pagination: {},
        },
        config: {
          select: (data) => {
            return Digit.SessionStorage.get("user_plants");
          },
        },
        changeQueryName: "setPlantUsersInboxDropdown",
      };
    },
    onCardClick: (obj) => {
      return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
    onCardActionClick: (obj) => {
      return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
    getCustomActionLabel: (obj, row) => {
      return "TQM_VIEW_TEST_DETAILS";
    },
  },
  TabVehicleConfigAdmin: {
    populateMdmsv2SearchReqCriteria: ({ schemaCode }) => {
      const tenantId = Digit.ULBService.getCurrentTenantId();

      return {
        url: "/mdms-v2/v2/_search",
        params: {},
        body: {
          tenantId,
          MdmsCriteria: {
            tenantId: tenantId,
            schemaCode: schemaCode,
            isActive: true,
          },
        },
        changeQueryName: `mdms-v2-${schemaCode}`,
        config: {
          enabled: schemaCode ? true : true,
          select: (response) => {
            const { mdms } = response;
            //first filter with isActive
            //then make a data array with actual data
            //refer the "code" key in data(for now) and set options array , also set i18nKey in each object to show in UI
            const options = mdms?.map((row) => {
              return {
                i18nKey: Digit.Utils.locale.getTransformedLocale(`${row?.schemaCode}_${row?.data?.code}`),
                ...row.data,
              };
            });
            return options;
          },
        },
      };
    },
    preProcess: (data, additionalDetails) => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      delete data.body.custom;
      delete data.body.inbox;
      data.body = { RequestInfo: data.body.RequestInfo };
      data.params.tenantId = tenantId;
      return data;
    },
    populateStatusReqCriteria: () => {
      const tenantId = Digit.ULBService.getCurrentTenantId();

      return {
        url: "/egov-workflow-v2/egov-wf/businessservice/_search",
        params: { tenantId, businessServices: businessServiceMap?.tqm },
        body: {},
        changeQueryName: "setWorkflowStatus",
        config: {
          enabled: true,
          select: (data) => {
            const wfStates = data?.BusinessServices?.[0]?.states
              ?.filter((state) => state.applicationStatus)
              ?.map((state) => {
                return {
                  i18nKey: `WF_STATUS_${businessServiceMap?.tqm}_${state?.applicationStatus}`,
                  ...state,
                };
              });
            return wfStates;
          },
        },
      };
    },
    getCustomActionLabel: (obj, row) => {
      return "";
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      console.log("MADARCHOD", row, key, column, value, searchResult);
      switch (key) {
        case "TQM_INBOX_SLA":
          let sla = 0;
          const currentDate = new Date();
          const targetTimestamp = row?.businessObject?.scheduledDate;
          const targetDate = new Date(targetTimestamp);
          const remainingSLA = targetDate - currentDate;
          sla = Math.ceil(remainingSLA / (24 * 60 * 60 * 1000));
          if (!row?.businessObject?.scheduledDate) return t("ES_COMMON_NA");
          return Math.sign(sla) === -1 ? (
            <span className="sla-cell-error">
              {Math.ceil(sla)} {t("COMMON_DAYS_OVERDUE")}
            </span>
          ) : (
            <span className="sla-cell-success">
              {sla} {t("COMMON_DAYS")}
            </span>
          );

        case "TQM_PENDING_DATE":
          return Digit.DateUtils.ConvertEpochToDate(value);

        case "TQM_TEST_ID":
          return (
            <span className="link">
              <Link
                to={`/${
                  window.contextPath
                }/employee/tqm/view-test-results?tenantId=${Digit.ULBService.getCurrentTenantId()}&id=${value}&from=TQM_BREAD_INBOX`}
              >
                {String(value ? (column.translate ? t(column.prefix ? `${column.prefix}${value}` : value) : value) : t("ES_COMMON_NA"))}
              </Link>
            </span>
          );

        default:
          return "case_not_found";
      }
    },
    populatePlantUsersReqCriteria: (props) => {
      const userInfo = Digit.UserService.getUser();
      const tenantId = Digit.ULBService.getCurrentTenantId();

      return {
        params: {},
        url: "/pqm-service/plant/user/v1/_search",
        body: {
          plantUserSearchCriteria: {
            tenantId,
            // "plantCodes": [],
            plantUserUuids: userInfo?.info?.uuid ? [userInfo?.info?.uuid] : [],
            additionalDetails: {},
          },
          pagination: {},
        },
        config: {
          select: (data) => {
            return Digit.SessionStorage.get("user_plants");
          },
        },
        changeQueryName: "setPlantUsersInboxDropdown",
      };
    },
    onCardClick: (obj) => {
      return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
    onCardActionClick: (obj) => {
      return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
    getCustomActionLabel: (obj, row) => {
      return "TQM_VIEW_TEST_DETAILS";
    },
  },
};
