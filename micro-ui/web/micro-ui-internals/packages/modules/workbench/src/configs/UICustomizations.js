import { Link, useHistory } from "react-router-dom";
import _ from "lodash";
import React from "react";
import { Button } from "@egovernments/digit-ui-react-components";
import axios from "axios";

//create functions here based on module name set in mdms(eg->SearchProjectConfig)
//how to call these -> Digit?.Customizations?.[masterName]?.[moduleName]
// these functions will act as middlewares
var Digit = window.Digit || {};

const businessServiceMap = {
  "muster roll": "MR",
};

const inboxModuleNameMap = {
  "muster-roll-approval": "muster-roll-service",
};

const convertEpochToDate = (dateEpoch) => {
  if (dateEpoch == null || dateEpoch == undefined || dateEpoch == "") {
    return "NA";
  }
  const dateFromApi = new Date(dateEpoch);
  let month = dateFromApi.getUTCMonth() + 1;
  let day = dateFromApi.getUTCDate();
  let year = dateFromApi.getUTCFullYear();
  month = (month > 9 ? "" : "0") + month;
  day = (day > 9 ? "" : "0") + day;
  return `${day}/${month}/${year}`;
};

export const UICustomizations = {
  businessServiceMap,
  updatePayload: (applicationDetails, data, action, businessService) => {
    if (businessService === businessServiceMap.estimate) {
      const workflow = {
        comment: data.comments,
        documents: data?.documents?.map((document) => {
          return {
            documentType: action?.action + " DOC",
            fileName: document?.[1]?.file?.name,
            fileStoreId: document?.[1]?.fileStoreId?.fileStoreId,
            documentUid: document?.[1]?.fileStoreId?.fileStoreId,
            tenantId: document?.[1]?.fileStoreId?.tenantId,
          };
        }),
        assignees: data?.assignees?.uuid ? [data?.assignees?.uuid] : null,
        action: action.action,
      };
      //filtering out the data
      Object.keys(workflow).forEach((key, index) => {
        if (!workflow[key] || workflow[key]?.length === 0) delete workflow[key];
      });

      return {
        estimate: applicationDetails,
        workflow,
      };
    }
    if (businessService === businessServiceMap.contract) {
      const workflow = {
        comment: data?.comments,
        documents: data?.documents?.map((document) => {
          return {
            documentType: action?.action + " DOC",
            fileName: document?.[1]?.file?.name,
            fileStoreId: document?.[1]?.fileStoreId?.fileStoreId,
            documentUid: document?.[1]?.fileStoreId?.fileStoreId,
            tenantId: document?.[1]?.fileStoreId?.tenantId,
          };
        }),
        assignees: data?.assignees?.uuid ? [data?.assignees?.uuid] : null,
        action: action.action,
      };
      //filtering out the data
      Object.keys(workflow).forEach((key, index) => {
        if (!workflow[key] || workflow[key]?.length === 0) delete workflow[key];
      });

      return {
        contract: applicationDetails,
        workflow,
      };
    }
    if (businessService === businessServiceMap?.["muster roll"]) {
      const workflow = {
        comment: data?.comments,
        documents: data?.documents?.map((document) => {
          return {
            documentType: action?.action + " DOC",
            fileName: document?.[1]?.file?.name,
            fileStoreId: document?.[1]?.fileStoreId?.fileStoreId,
            documentUid: document?.[1]?.fileStoreId?.fileStoreId,
            tenantId: document?.[1]?.fileStoreId?.tenantId,
          };
        }),
        assignees: data?.assignees?.uuid ? [data?.assignees?.uuid] : null,
        action: action.action,
      };
      //filtering out the data
      Object.keys(workflow).forEach((key, index) => {
        if (!workflow[key] || workflow[key]?.length === 0) delete workflow[key];
      });

      return {
        musterRoll: applicationDetails,
        workflow,
      };
    }
    if (businessService === businessServiceMap?.["works.purchase"]) {
      const workflow = {
        comment: data.comments,
        documents: data?.documents?.map((document) => {
          return {
            documentType: action?.action + " DOC",
            fileName: document?.[1]?.file?.name,
            fileStoreId: document?.[1]?.fileStoreId?.fileStoreId,
            documentUid: document?.[1]?.fileStoreId?.fileStoreId,
            tenantId: document?.[1]?.fileStoreId?.tenantId,
          };
        }),
        assignees: data?.assignees?.uuid ? [data?.assignees?.uuid] : null,
        action: action.action,
      };
      //filtering out the data
      Object.keys(workflow).forEach((key, index) => {
        if (!workflow[key] || workflow[key]?.length === 0) delete workflow[key];
      });

      const additionalFieldsToSet = {
        projectId: applicationDetails.additionalDetails.projectId,
        invoiceDate: applicationDetails.billDate,
        invoiceNumber: applicationDetails.referenceId.split("_")?.[1],
        contractNumber: applicationDetails.referenceId.split("_")?.[0],
        documents: applicationDetails.additionalDetails.documents,
      };
      return {
        bill: { ...applicationDetails, ...additionalFieldsToSet },
        workflow,
      };
    }
  },
  enableModalSubmit: (businessService, action, setModalSubmit, data) => {
    if (businessService === businessServiceMap?.["muster roll"] && action.action === "APPROVE") {
      setModalSubmit(data?.acceptTerms);
    }
  },
  enableHrmsSearch: (businessService, action) => {
    if (businessService === businessServiceMap.estimate) {
      return action.action.includes("TECHNICALSANCTION") || action.action.includes("VERIFYANDFORWARD");
    }
    if (businessService === businessServiceMap.contract) {
      return action.action.includes("VERIFY_AND_FORWARD");
    }
    if (businessService === businessServiceMap?.["muster roll"]) {
      return action.action.includes("VERIFY");
    }
    if (businessService === businessServiceMap?.["works.purchase"]) {
      return action.action.includes("VERIFY_AND_FORWARD");
    }
    return false;
  },
  getBusinessService: (moduleCode) => {
    if (moduleCode?.includes("estimate")) {
      return businessServiceMap?.estimate;
    } else if (moduleCode?.includes("contract")) {
      return businessServiceMap?.contract;
    } else if (moduleCode?.includes("muster roll")) {
      return businessServiceMap?.["muster roll"];
    } else if (moduleCode?.includes("works.purchase")) {
      return businessServiceMap?.["works.purchase"];
    } else if (moduleCode?.includes("works.wages")) {
      return businessServiceMap?.["works.wages"];
    } else if (moduleCode?.includes("works.supervision")) {
      return businessServiceMap?.["works.supervision"];
    } else {
      return businessServiceMap;
    }
  },
  getInboxModuleName: (moduleCode) => {
    if (moduleCode?.includes("estimate")) {
      return inboxModuleNameMap?.estimate;
    } else if (moduleCode?.includes("contract")) {
      return inboxModuleNameMap?.contracts;
    } else if (moduleCode?.includes("attendence")) {
      return inboxModuleNameMap?.attendencemgmt;
    } else {
      return inboxModuleNameMap;
    }
  },

  AttendanceInboxConfig: {
    preProcess: (data) => {
      //set tenantId
      data.body.inbox.tenantId = Digit.ULBService.getCurrentTenantId();
      data.body.inbox.processSearchCriteria.tenantId = Digit.ULBService.getCurrentTenantId();

      const musterRollNumber = data?.body?.inbox?.moduleSearchCriteria?.musterRollNumber?.trim();
      if (musterRollNumber) data.body.inbox.moduleSearchCriteria.musterRollNumber = musterRollNumber;

      const attendanceRegisterName = data?.body?.inbox?.moduleSearchCriteria?.attendanceRegisterName?.trim();
      if (attendanceRegisterName) data.body.inbox.moduleSearchCriteria.attendanceRegisterName = attendanceRegisterName;

      // deleting them for now(assignee-> need clarity from pintu,ward-> static for now,not implemented BE side)
      const assignee = _.clone(data.body.inbox.moduleSearchCriteria.assignee);
      delete data.body.inbox.moduleSearchCriteria.assignee;
      if (assignee?.code === "ASSIGNED_TO_ME") {
        data.body.inbox.moduleSearchCriteria.assignee = Digit.UserService.getUser().info.uuid;
      }

      //cloning locality and workflow states to format them
      // let locality = _.clone(data.body.inbox.moduleSearchCriteria.locality ? data.body.inbox.moduleSearchCriteria.locality : []);

      let selectedOrg = _.clone(data.body.inbox.moduleSearchCriteria.orgId ? data.body.inbox.moduleSearchCriteria.orgId : null);
      delete data.body.inbox.moduleSearchCriteria.orgId;
      if (selectedOrg) {
        data.body.inbox.moduleSearchCriteria.orgId = selectedOrg?.[0]?.applicationNumber;
      }

      // let selectedWard =  _.clone(data.body.inbox.moduleSearchCriteria.ward ? data.body.inbox.moduleSearchCriteria.ward : null);
      // delete data.body.inbox.moduleSearchCriteria.ward;
      // if(selectedWard) {
      //    data.body.inbox.moduleSearchCriteria.ward = selectedWard?.[0]?.code;
      // }

      let states = _.clone(data.body.inbox.moduleSearchCriteria.state ? data.body.inbox.moduleSearchCriteria.state : []);
      let ward = _.clone(data.body.inbox.moduleSearchCriteria.ward ? data.body.inbox.moduleSearchCriteria.ward : []);
      // delete data.body.inbox.moduleSearchCriteria.locality;
      delete data.body.inbox.moduleSearchCriteria.state;
      delete data.body.inbox.moduleSearchCriteria.ward;

      // locality = locality?.map((row) => row?.code);
      states = Object.keys(states)?.filter((key) => states[key]);
      ward = ward?.map((row) => row?.code);

      // //adding formatted data to these keys
      // if (locality.length > 0) data.body.inbox.moduleSearchCriteria.locality = locality;
      if (states.length > 0) data.body.inbox.moduleSearchCriteria.status = states;
      if (ward.length > 0) data.body.inbox.moduleSearchCriteria.ward = ward;
      const projectType = _.clone(data.body.inbox.moduleSearchCriteria.projectType ? data.body.inbox.moduleSearchCriteria.projectType : {});
      if (projectType?.code) data.body.inbox.moduleSearchCriteria.projectType = projectType.code;

      //adding tenantId to moduleSearchCriteria
      data.body.inbox.moduleSearchCriteria.tenantId = Digit.ULBService.getCurrentTenantId();

      //setting limit and offset becoz somehow they are not getting set in muster inbox
      data.body.inbox.limit = data.state.tableForm.limit;
      data.body.inbox.offset = data.state.tableForm.offset;
      delete data.state;
      return data;
    },
    postProcess: (responseArray, uiConfig) => {
      const statusOptions = responseArray?.statusMap
        ?.filter((item) => item.applicationstatus)
        ?.map((item) => ({ code: item.applicationstatus, i18nKey: `COMMON_MASTERS_${item.applicationstatus}` }));
      if (uiConfig?.type === "filter") {
        let fieldConfig = uiConfig?.fields?.filter((item) => item.type === "dropdown" && item.populators.name === "musterRollStatus");
        if (fieldConfig.length) {
          fieldConfig[0].populators.options = statusOptions;
        }
      }
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      if (key === "ATM_MUSTER_ROLL_ID") {
        return (
          <span className="link">
            <Link
              to={`/${
                window.contextPath
              }/employee/attendencemgmt/view-attendance?tenantId=${Digit.ULBService.getCurrentTenantId()}&musterRollNumber=${value}`}
            >
              {String(value ? (column.translate ? t(column.prefix ? `${column.prefix}${value}` : value) : value) : t("ES_COMMON_NA"))}
            </Link>
          </span>
        );
      }
      if (key === "ATM_ATTENDANCE_WEEK") {
        const week = `${Digit.DateUtils.ConvertTimestampToDate(value?.startDate, "dd/MM/yyyy")}-${Digit.DateUtils.ConvertTimestampToDate(
          value?.endDate,
          "dd/MM/yyyy"
        )}`;
        return <div>{week}</div>;
      }
      if (key === "ATM_NO_OF_INDIVIDUALS") {
        return <div>{value?.length}</div>;
      }
      if (key === "ATM_AMOUNT_IN_RS") {
        return <span>{value ? Digit.Utils.dss.formatterWithoutRound(value, "number") : t("ES_COMMON_NA")}</span>;
      }
      if (key === "ATM_SLA") {
        return parseInt(value) > 0 ? (
          <span className="sla-cell-success">{t(value) || ""}</span>
        ) : (
          <span className="sla-cell-error">{t(value) || ""}</span>
        );
      }
      if (key === "COMMON_WORKFLOW_STATES") {
        return <span>{t(`WF_MUSTOR_${value}`)}</span>;
      }
      //added this in case we change the key and not updated here , it'll throw that nothing was returned from cell error if that case is not handled here. To prevent that error putting this default
      return <span>{t(`CASE_NOT_HANDLED`)}</span>;
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
  SearchWageSeekerConfig: {
    customValidationCheck: (data) => {
      //checking both to and from date are present
      const { createdFrom, createdTo } = data;
      if ((createdFrom === "" && createdTo !== "") || (createdFrom !== "" && createdTo === ""))
        return { warning: true, label: "ES_COMMON_ENTER_DATE_RANGE" };

      return false;
    },
    preProcess: (data) => {
      data.params = { ...data.params, tenantId: Digit.ULBService.getCurrentTenantId() };

      let requestBody = { ...data.body.Individual };
      const pathConfig = {
        name: "name.givenName",
      };
      const dateConfig = {
        createdFrom: "daystart",
        createdTo: "dayend",
      };
      const selectConfig = {
        wardCode: "wardCode[0].code",
        socialCategory: "socialCategory.code",
      };
      const textConfig = ["name", "individualId"];
      let Individual = Object.keys(requestBody)
        .map((key) => {
          if (selectConfig[key]) {
            requestBody[key] = _.get(requestBody, selectConfig[key], null);
          } else if (typeof requestBody[key] == "object") {
            requestBody[key] = requestBody[key]?.code;
          } else if (textConfig?.includes(key)) {
            requestBody[key] = requestBody[key]?.trim();
          }
          return key;
        })
        .filter((key) => requestBody[key])
        .reduce((acc, curr) => {
          if (pathConfig[curr]) {
            _.set(acc, pathConfig[curr], requestBody[curr]);
          } else if (dateConfig[curr] && dateConfig[curr]?.includes("day")) {
            _.set(acc, curr, Digit.Utils.date.convertDateToEpoch(requestBody[curr], dateConfig[curr]));
          } else {
            _.set(acc, curr, requestBody[curr]);
          }
          return acc;
        }, {});

      data.body.Individual = { ...Individual };
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
  SearchMDMSConfig: {
    customValidationCheck: (data) => {
      //checking both to and from date are present

      const { createdFrom, createdTo, field, value } = data;
      if ((createdFrom === "" && createdTo !== "") || (createdFrom !== "" && createdTo === ""))
        return { warning: true, label: "ES_COMMON_ENTER_DATE_RANGE" };

      if ((field && !value) || (!field && value)) {
        return { warning: true, label: "WBH_MDMS_SEARCH_VALIDATION_FIELD_VALUE_PAIR" };
      }

      return false;
    },
    preProcess: (data, additionalDetails) => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      data.body.MdmsCriteria.tenantId = tenantId;

      const filters = {};
      const custom = data.body.MdmsCriteria.custom;
      const { field, value, isActive } = custom || {};
      filters[field?.code] = value;
      if (isActive) {
        if (isActive.value === "all") delete data.body.MdmsCriteria.isActive;
        else data.body.MdmsCriteria.isActive = isActive?.value;
      } else {
        delete data.body.MdmsCriteria.isActive;
      }
      data.body.MdmsCriteria.filters = filters;
      data.body.MdmsCriteria.schemaCode = additionalDetails?.currentSchemaCode;
      delete data.body.MdmsCriteria.custom;
      return data;
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      //here we can add multiple conditions
      //like if a cell is link then we return link
      //first we can identify which column it belongs to then we can return relevant result
      switch (key) {
        case "WORKS_SOR_RATES_VALIDFROM":
        case "WORKS_SOR_COMPOSITION_EFFECTIVEFROM":
        case "WORKS_SOR_RATES_VALIDTO":
        case "WORKS_SOR_COMPOSITION_TO":
          return value ? convertEpochToDate(Number(value)) : t("ES_COMMON_NA");
        case "WBH_UNIQUE_IDENTIFIER":
          const [moduleName, masterName] = row.schemaCode.split(".");
          return (
            <span className="link">
              <Link
                to={`/${window.contextPath}/employee/workbench/mdms-view?moduleName=${moduleName}&masterName=${masterName}&uniqueIdentifier=${row.uniqueIdentifier}`}
              >
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
        case "WBH_ISACTIVE":
          return value ? <span style={{ color: "green" }}>{t("WBH_COMMON_YES")}</span> : <span style={{ color: "red" }}>{t("WBH_COMMON_NO")}</span>;
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
  SearchLocalisationConfig: {
    customValidationCheck: (data) => {
      //checking locale must be present
      const { locale } = data;
      if (locale === "") return { warning: true, label: "WBH_LOC_WARNING_LOCALE_MUST_BE_PRESENT" };

      return false;
    },
    preProcess: (data, additionalDetails) => {
      delete data.body.custom;
      const tenant = Digit.ULBService.getStateId();

      const { locale = undefined, module: modulee = undefined, codes = undefined, message = undefined } = data.params;

      delete data.params.locale;
      delete data.params.module;
      delete data.params.codes;
      delete data.params.message;

      data.params.tenantId = tenant;
      if (locale) {
        data.params.locale = locale.value;
      }
      if (modulee) {
        data.params.module = modulee.value;
      }
      if (codes) {
        data.params.codes = codes;
      }

      return data;
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      //here we can add multiple conditions
      //like if a cell is link then we return link
      //first we can identify which column it belongs to then we can return relevant result
      switch (key) {
        case "Unique Identifier":
          const [moduleName, masterName] = row.schemaCode.split(".");
          return (
            <span className="link">
              <Link
                to={`/${window.contextPath}/employee/workbench/mdms-view?moduleName=${moduleName}&masterName=${masterName}&uniqueIdentifier=${row.uniqueIdentifier}`}
              >
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
    combineData: ({ isLoading, isFetching, data, defaultData, refetch, refetchDefault }) => {
      //for every message in data we need to query defaultData , if same code is there then populate a field in data and return data
      // data?.messages?.forEach((message,idx) => {
      //   message.defaultMessage = ""
      //   defaultData?.messages?.forEach((defaultMessage,defaultIdx)=> {
      //     if(message.code === defaultMessage.code){
      //       message.defaultMessage = defaultMessage.message
      //     }
      //   })
      // })
      // return data
      //TODO: Revisit this logic
      defaultData?.messages?.forEach((message, idx) => {
        message.defaultMessage = "";
        data?.messages?.forEach((defaultMessage, defaultIdx) => {
          if (message.code === defaultMessage.code) {
            message.defaultMessage = defaultMessage.message;
            message.originalLocale = defaultMessage.locale;
          }
        });
      });
      return defaultData;
    },
  },
  SearchMDMSConfigPopup: {
    customValidationCheck: (data) => {
      //checking both to and from date are present
      const { createdFrom, createdTo, field, value } = data;
      if ((createdFrom === "" && createdTo !== "") || (createdFrom !== "" && createdTo === ""))
        return { warning: true, label: "ES_COMMON_ENTER_DATE_RANGE" };

      if ((field && !value) || (!field && value)) {
        return { warning: true, label: "WBH_MDMS_SEARCH_VALIDATION_FIELD_VALUE_PAIR" };
      }

      return false;
    },
    preProcess: (data, additionalDetails) => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      data.body.MdmsCriteria.tenantId = tenantId;
      const filters = {};
      const custom = data.body.MdmsCriteria.custom;
      const { field, value, isActive } = custom || {};
      filters[field?.code] = value;
      if (isActive) {
        if (isActive.value === "all") delete data.body.MdmsCriteria.isActive;
        else data.body.MdmsCriteria.isActive = isActive?.value;
      } else {
        delete data.body.MdmsCriteria.isActive;
      }
      data.body.MdmsCriteria.filters = filters;
      data.body.MdmsCriteria.isActive = true;
      data.body.MdmsCriteria.schemaCode = additionalDetails?.currentSchemaCode;
      delete data.body.MdmsCriteria.custom;

      // const {field,value} = data.body.MdmsCriteria.moduleDetails[0].masterDetails[0].custom || {}

      // const tenantId = Digit.ULBService.getCurrentTenantId()
      // data.body.MdmsCriteria.tenantId = tenantId

      // //generate filter
      // const filter = `[?(@.${field?.code}=='${value}')]`

      // data.body.MdmsCriteria.moduleDetails[0].masterDetails[0].filter = filter
      // delete data.body.MdmsCriteria.moduleDetails[0].masterDetails[0].custom
      //we simply
      // data.params = { ...data.params, tenantId: Digit.ULBService.getCurrentTenantId() };

      // let requestBody = { ...data.body.Individual };
      // const pathConfig = {
      //   name: "name.givenName",
      // };
      // const dateConfig = {
      //   createdFrom: "daystart",
      //   createdTo: "dayend",
      // };
      // const selectConfig = {
      //   wardCode: "wardCode[0].code",
      //   socialCategory: "socialCategory.code",
      // };
      // const textConfig = ["name", "individualId"];
      // let Individual = Object.keys(requestBody)
      //   .map((key) => {
      //     if (selectConfig[key]) {
      //       requestBody[key] = _.get(requestBody, selectConfig[key], null);
      //     } else if (typeof requestBody[key] == "object") {
      //       requestBody[key] = requestBody[key]?.code;
      //     } else if (textConfig?.includes(key)) {
      //       requestBody[key] = requestBody[key]?.trim();
      //     }
      //     return key;
      //   })
      //   .filter((key) => requestBody[key])
      //   .reduce((acc, curr) => {
      //     if (pathConfig[curr]) {
      //       _.set(acc, pathConfig[curr], requestBody[curr]);
      //     } else if (dateConfig[curr] && dateConfig[curr]?.includes("day")) {
      //       _.set(acc, curr, Digit.Utils.date.convertDateToEpoch(requestBody[curr], dateConfig[curr]));
      //     } else {
      //       _.set(acc, curr, requestBody[curr]);
      //     }
      //     return acc;
      //   }, {});

      // data.body.Individual = { ...Individual };
      return data;
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      //here we can add multiple conditions
      //like if a cell is link then we return link
      //first we can identify which column it belongs to then we can return relevant result
      switch (key) {
        case " ":
          return (
            <Button
              label={"Select"}
              onButtonClick={(e) => {
                e.stopPropagation();
                column.onClick(row);
              }}
            />
          );
        case "WBH_UNIQUE_IDENTIFIER":
          const [moduleName, masterName] = row.schemaCode.split(".");
          return (
            <span className="link">
              <Link
                to={`/${window.contextPath}/employee/workbench/mdms-view?moduleName=${moduleName}&masterName=${masterName}&uniqueIdentifier=${row.uniqueIdentifier}`}
              >
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
        case "WBH_ISACTIVE":
          return value ? <span style={{ color: "green" }}>{t("WBH_COMMON_YES")}</span> : <span style={{ color: "red" }}>{t("WBH_COMMON_NO")}</span>;
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
  ViewMdmsConfig: {
    fetchActionItems: (data, props) => {
      let hostname = window.location.hostname;

      let roleActions = {
        ADD_SOR_COMPOSITION: ["MDMS_STATE_ADMIN"],
        VIEW_RATE_ANALYSIS: ["MDMS_STATE_ADMIN", "MDMS_CITY_ADMIN"],
      };
      const getUserRoles = Digit.SessionStorage.get("User")?.info?.roles;

      const roles = getUserRoles?.map((role) => {
        return role.code;
      });
      console.log(roles);

      const hasRoleAccess = (action) => {
        const allowedRoles = roleActions[action] || [];
        return roles.some((role) => allowedRoles.includes(role));
      };

      let actionItems = [
        {
          action: "EDIT",
          label: "Edit Master",
        },
      ];

      const isActive = data?.isActive;
      if (isActive)
        actionItems.push({
          action: "DISABLE",
          label: "Disable Master",
        });
      else
        actionItems.push({
          action: "ENABLE",
          label: "Enable Master",
        });

      switch (true) {
        case hostname.includes("mukta-uat") || hostname.includes("localhost"): {
          if (data?.data?.sorType?.includes("W")) {
            if (isActive && hasRoleAccess("ADD_SOR_COMPOSITION"))
              actionItems?.push({
                action: "ADD_SOR_COMPOSITION",
                label: "Add SOR Composition",
              });
            if (hasRoleAccess("VIEW_RATE_ANALYSIS")) {
              actionItems.push({
                action: "VIEW_RATE_ANALYSIS",
                label: "View Rate Analysis",
              });
            }
          }
          if (props?.masterName === "Rates") {
            actionItems = actionItems.filter((ac) => ac?.action !== "DISABLE");
          }

          if (props?.masterName === "Rates" && props?.sorData?.data?.sorType === "W") {
            actionItems = actionItems.filter((ac) => ac?.action !== "EDIT");
          }
        }
      }
      return actionItems;
    },
    onActionSelect: (action, props) => {
      const { action: actionSelected } = action;
      //to ADD SOR Composition
      if (actionSelected === "ADD_SOR_COMPOSITION") {
        window.location.href = `/works-ui/employee/rateanalysis/create-rate-analysis?sorid=${props?.uniqueIdentifier}`;
      } else if (actionSelected === "VIEW_RATE_ANALYSIS") {
        window.location.href = `/works-ui/employee/rateanalysis/view-rate-analysis?sorId=${
          props?.masterName === "Composition" ? props?.data?.data?.sorId : props?.uniqueIdentifier
        }&fromeffective=${props?.masterName === "Composition" ? props?.data?.data?.effectiveFrom : Date.now()}`;
      }
      //action===EDIT go to edit screen
      else if (actionSelected === "EDIT") {
        props?.history.push(
          `/${window?.contextPath}/employee/workbench/mdms-edit?moduleName=${props?.moduleName}&masterName=${props?.masterName}&uniqueIdentifier=${props?.uniqueIdentifier}`
        );
      }
      //action===DISABLE || ENABLE call update api and show toast respectively
      else {
        //call update mutation
        props?.handleEnableDisable(actionSelected);
      }
    },
  },
  AddMdmsConfig: {
    "WORKS-SOR.Rates": {
      validateForm: async (data, props) => {
        try {
          const response = await axios.post("/mdms-v2/v2/_search", {
            MdmsCriteria: {
              tenantId: props?.tenantId?.split(".")[0],
              uniqueIdentifiers: [data.sorId],
              schemaCode: "WORKS-SOR.SOR",
            },
          });
  
          const validFrom = data?.validFrom;
          const validTo = data?.validTo;
  
          if (validFrom > validTo) {
            return { isValid: false, message: "RA_DATE_RANGE_ERROR" };
          }
  
          if (response?.data?.mdms?.[0]?.data?.sorType !== "W") {
            return { isValid: true };
          } else {
            return { isValid: false, message: "RATE_NOT_ALLOWED_FOR_W_TYPE" };
          }
        } catch (error) {
          return { isValid: false, message: "VALIDATION_ERROR" };
        }
      },
    },
  },
  SearchMDMSv2Config: {
    "WORKS-SOR.Rates": {
      sortValidDatesFirst : (arr)  => {
        const validFrom = arr.find(item => item.name === 'validFrom');
        const validTo = arr.find(item => item.name === 'validTo');
    
        if (validFrom && validTo) {
            const validFromIndex = arr.indexOf(validFrom);
            const validToIndex = arr.indexOf(validTo);
    
            if (validFromIndex > validToIndex) {
                arr.splice(validFromIndex, 1);
                arr.splice(validToIndex, 0, validFrom);
            }
        }
    
        return arr;
    }
    
    },
    "WORKS-SOR.Composition": {
      sortValidDatesFirst : (arr)  => {
        const validFrom = arr.find(item => item.name === 'effectiveFrom');
        const validTo = arr.find(item => item.name === 'effectiveTo');
    
        if (validFrom && validTo) {
            const validFromIndex = arr.indexOf(validFrom);
            const validToIndex = arr.indexOf(validTo);
    
            if (validFromIndex > validToIndex) {
                arr.splice(validFromIndex, 1);
                arr.splice(validToIndex, 0, validFrom);
            }
        }
    
        return arr;
    }
    
    }
  }
};
