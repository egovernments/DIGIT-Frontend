import _ from "lodash";
import { useLocation, useHistory, Link, useParams } from "react-router-dom";
import React, { useState, Fragment } from "react";
import { DeleteIconv2, DownloadIcon, FileIcon, Button, Card, CardSubHeader, EditIcon, ArrowForward } from "@egovernments/digit-ui-react-components";
import { Button as ButtonNew, Dropdown } from "@egovernments/digit-ui-components";

//create functions here based on module name set in mdms(eg->SearchProjectConfig)
//how to call these -> Digit?.Customizations?.[masterName]?.[moduleName]
// these functions will act as middlewares
// var Digit = window.Digit || {};


const businessServiceMap = {
  "muster roll": "MR",
};

const inboxModuleNameMap = {
  "muster-roll-approval": "muster-roll-service",
};

function filterUniqueByKey(arr, key) {
  const uniqueValues = new Set();
  const result = [];

  arr.forEach((obj) => {
    const value = obj[key];
    if (!uniqueValues.has(value)) {
      uniqueValues.add(value);
      result.push(obj);
    }
  });

  return result;
}

const epochTimeForTomorrow12 = () => {
  const now = new Date();

  // Create a new Date object for tomorrow at 12:00 PM
  const tomorrowNoon = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 12, 0, 0, 0);

  // Format the date as "YYYY-MM-DD"
  const year = tomorrowNoon.getFullYear();
  const month = String(tomorrowNoon.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(tomorrowNoon.getDate()).padStart(2, "0");

  return Digit.Utils.date.convertDateToEpoch(`${year}-${month}-${day}`);
};

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
              to={`/${window.contextPath
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
  SearchDefaultConfig: {
    customValidationCheck: (data) => {
      //checking both to and from date are present
      const { createdFrom, createdTo } = data;
      if ((createdFrom === "" && createdTo !== "") || (createdFrom !== "" && createdTo === ""))
        return { warning: true, label: "ES_COMMON_ENTER_DATE_RANGE" };

      return false;
    },
    preProcess: (data) => {
      const location = useLocation();
      data.params = { ...data.params };
      const { masterName } = useParams();

      const searchParams = new URLSearchParams(location.search);
      const paths = {
        SearchProjectConfig: {
          basePath: "Projects",
          pathConfig: {
            // id: "id[0]",
            tenantId: "tenantId",
          },
          dateConfig: {
            endDate: "dayend",
            startDate: "daystart",
          },
          selectConfig: {},
          textConfig: ["id", "tenantId", "name", "projectNumber", "projectSubType", "projectType"],
        },
        SearchProductConfig: {
          basePath: "Product",
          pathConfig: {
            id: "id[0]",
          },
          dateConfig: {},
          selectConfig: {},
          textConfig: ["id", "manufacturer", "name", "type"],
        },
        SearchHouseholdConfig: {
          basePath: "Household",
          pathConfig: {
            id: "id[0]",
            clientReferenceId: "clientReferenceId[0]",
          },
          dateConfig: {},
          selectConfig: {},
          textConfig: ["boundaryCode", "clientReferenceId", "id"],
        },
        SearchProductVariantConfig: {
          basePath: "ProductVariant",
          pathConfig: {
            id: "id[0]",
          },
          dateConfig: {},
          selectConfig: {},
          textConfig: ["productId", "sku", "variation"],
        },
        SearchProjectBeneficiaryConfig: {
          basePath: "ProjectBeneficiary",
          pathConfig: {
            id: "id[0]",
            clientReferenceId: "clientReferenceId[0]",
          },
          dateConfig: {
            dateOfRegistration: "daystart",
          },
          selectConfig: {},
          textConfig: ["beneficiaryId", "projectId"],
        },
        SearchProjectStaffConfig: {
          basePath: "ProjectStaff",
          pathConfig: {
            id: "id[0]",
          },
          dateConfig: {
            startDate: "daystart",
            endDate: "dayend",
          },
          selectConfig: {},
          textConfig: ["projectId", "userId"],
        },
        SearchProjectResourceConfig: {
          basePath: "ProjectResource",
          pathConfig: {
            id: "id[0]",
          },
          dateConfig: {},
          selectConfig: {},
          textConfig: [],
        },
        SearchProjectTaskConfig: {
          basePath: "Task",
          pathConfig: {
            id: "id[0]",
            clientReferenceId: "clientReferenceId[0]",
          },
          dateConfig: {
            plannedEndDate: "dayend",
            plannedStartDate: "daystart",
            actualEndDate: "dayend",
            actualStartDate: "daystart",
          },
          selectConfig: {},
          textConfig: ["projectId", "localityCode", "projectBeneficiaryId", "status"],
        },
        SearchFacilityConfig: {
          basePath: "Facility",
          pathConfig: {
            id: "id[0]",
          },
          dateConfig: {},
          selectConfig: {},
          textConfig: ["faciltyUsage", "localityCode", "storageCapacity", "id"],
        },
        SearchProjectFacilityConfig: {
          basePath: "ProjectFacility",
          pathConfig: {
            id: "id[0]",
            projectId: "projectId[0]",
            facilityId: "facilityId[0]",
          },
          dateConfig: {},
          selectConfig: {},
          textConfig: [],
        },
      };

      const id = searchParams.get("config") || masterName;

      if (!paths || !paths?.[id]) {
        return data;
      }
      let requestBody = { ...data.body[paths[id]?.basePath] };
      const pathConfig = paths[id]?.pathConfig;
      const dateConfig = paths[id]?.dateConfig;
      const selectConfig = paths[id]?.selectConfig;
      const textConfig = paths[id]?.textConfig;

      if (paths[id].basePath == "Projects") {
        data.state.searchForm = { ...data.state.searchForm, tenantId: "mz" };
      }
      let Product = Object.keys(requestBody)
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

      if (paths[id].basePath == "Projects") {
        data.body[paths[id].basePath] = [{ ...Product }];
      } else data.body[paths[id].basePath] = { ...Product };
      return data;
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      //here we can add multiple conditions
      //like if a cell is link then we return link
      //first we can identify which column it belongs to then we can return relevant result
      switch (key) {
        case "ID":
          return (
            <span className="link">
              <Link to={`/${window.contextPath}/employee/workbench/mdms-view?tenantId=${tenantId}&projectNumber=${masterName}`}></Link>
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
  SearchCampaign: {
    preProcess: (data, additionalDetails) => {
      const { campaignName = "", endDate = "", projectType = "", startDate = "" } = data?.state?.searchForm || {};
      data.body.CampaignDetails = {};
      data.body.CampaignDetails.pagination = data?.state?.tableForm;
      data.body.CampaignDetails.tenantId = Digit.ULBService.getCurrentTenantId();
      // data.body.CampaignDetails.boundaryCode = boundaryCode;
      data.body.CampaignDetails.createdBy = Digit.UserService.getUser().info.uuid;
      data.body.CampaignDetails.campaignName = campaignName;
      data.body.CampaignDetails.status = ["drafted"];
      if (startDate) {
        data.body.CampaignDetails.startDate = Digit.Utils.date.convertDateToEpoch(startDate);
      } else {
        data.body.CampaignDetails.startDate = epochTimeForTomorrow12();
      }
      if (endDate) {
        data.body.CampaignDetails.endDate = Digit.Utils.date.convertDateToEpoch(endDate);
      }
      data.body.CampaignDetails.projectType = projectType?.[0]?.code;

      cleanObject(data.body.CampaignDetails);

      return data;
    },
    populateProjectType: () => {
      const tenantId = Digit.ULBService.getCurrentTenantId();

      return {
        url: "/egov-mdms-service/v1/_search",
        params: { tenantId },
        body: {
          MdmsCriteria: {
            tenantId,
            moduleDetails: [
              {
                moduleName: "HCM-PROJECT-TYPES",
                masterDetails: [
                  {
                    name: "projectTypes",
                  },
                ],
              },
            ],
          },
        },
        changeQueryName: "projectType",
        config: {
          enabled: true,
          select: (data) => {
            const dropdownData = filterUniqueByKey(data?.MdmsRes?.["HCM-PROJECT-TYPES"]?.projectTypes, "code").map((row) => {
              return {
                ...row,
                i18nKey: Digit.Utils.locale.getTransformedLocale(`CAMPAIGN_TYPE_${row.code}`),
              };
            });
            return dropdownData;
          },
        },
      };
    },
    customValidationCheck: (data) => {
      //checking if both to and from date are present then they should be startDate<=endDate
      const { startDate, endDate } = data;
      const startDateEpoch = Digit.Utils.date.convertDateToEpoch(startDate);
      const endDateEpoch = Digit.Utils.date.convertDateToEpoch(endDate);

      if (startDate && endDate && startDateEpoch > endDateEpoch) {
        return { warning: true, label: "ES_COMMON_ENTER_DATE_RANGE" };
      }
      return false;
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      if (key === "CAMPAIGN_DATE") {
        return `${Digit.DateUtils.ConvertEpochToDate(value)} - ${Digit.DateUtils.ConvertEpochToDate(row?.endDate)}`;
      }
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
        data.body.PlanConfigurationSearchCriteria.name = data?.state?.searchForm?.microplanName;
        cleanObject(data.body.PlanConfigurationSearchCriteria);
  
        const dic = {
          0: null,
          1: ["DRAFT"],
          2: ["EXECUTION_TO_BE_DONE"],
          3: ["CENSUS_DATA_APPROVAL_IN_PROGRESS", "CENSUS_DATA_APPROVED", "RESOURCE_ESTIMATION_IN_PROGRESS"],
          4: ["RESOURCE_ESTIMATIONS_APPROVED"],
        };
        const url = Digit.Hooks.useQueryParams();
  
        const tabId = url.tabId || "0"; // Default to '0' if tabId is undefined
        data.body.PlanConfigurationSearchCriteria.status = dic[String(tabId)];
        cleanObject(data.body.PlanConfigurationSearchCriteria);
        return data;
      },
      additionalCustomizations: (row, key, column, value, t, searchResult) => {
  
        switch (key) {
          case "ACTIONS":
            // TODO : Replace dummy file id with real file id when API is ready
            const dummyFile = "c22a7676-d5d7-49b6-bcdb-83e9519f58df"
            const microplanFileId = row?.campaignDetails?.additionalDetails?.microplanFileId || dummyFile;
            let options = [];
  
            if (row?.status == "DRAFT") {
              options = [{ code: "1", name: "MP_ACTIONS_EDIT_SETUP" }];
            } else {
              options = [{ code: "1", name: "MP_ACTIONS_VIEW_SUMMARY" }];
            }
  
            const handleDownload = () => {
              const files = row?.files;
              const file = files.find((item) => item.templateIdentifier === "Population");
              const fileId = file?.filestoreId;
              if (!fileId) {
                    console.error("Population template file not found");
                    return;
                  }
              const campaignName = row?.name || "";
              Digit.Utils.campaign.downloadExcelWithCustomName({
                fileStoreId: fileId,
                customName: campaignName
              });
            };
  
            const onActionSelect = (e) => {
              if (e.name === "MP_ACTIONS_EDIT_SETUP") {
                const key = parseInt(row?.additionalDetails?.key);
                const resolvedKey = key === 8 ? 7 : key === 9 ? 10 : key || 2;
                const url = `/${window.contextPath}/employee/microplan/setup-microplan?key=${resolvedKey}&microplanId=${row.id}&campaignId=${row.campaignDetails.id}`;
                window.location.href = url;
              }
              if (e.name == "MP_ACTIONS_VIEW_SUMMARY") {
                window.location.href = `/${window.contextPath}/employee/microplan/setup-microplan?key=${10}&microplanId=${row.id}&campaignId=${
                  row.campaignDetails.id
                }&setup-completed=true`;
              }
            };
  
            return (
              <div>
                {microplanFileId && row?.status == "RESOURCE_ESTIMATIONS_APPROVED" ? (
                  <div>
                    <ButtonNew style={{ width: "20rem" }} icon="DownloadIcon" onClick={handleDownload} label={t("WBH_DOWNLOAD_MICROPLAN")} title={t("WBH_DOWNLOAD_MICROPLAN")}  />
                  </div>
                ) : (
                  <div className={"action-button-open-microplan"}>
                    <div style={{ position: "relative" }}>
                      <ButtonNew
                        type="actionButton"
                        variation="secondary"
                        label={t("MP_ACTIONS_FOR_MICROPLAN_SEARCH")}
                        title={t("MP_ACTIONS_FOR_MICROPLAN_SEARCH")}
                        options={options}
                        style={{ width: "20rem" }}
                        optionsKey="name"
                        showBottom={true}
                        isSearchable={false}
                        onOptionSelect={(item) => onActionSelect(item)}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
  
          case "NAME_OF_MICROPLAN":
            if (value && value !== "NA") {
              return (
                <div
                  style={{
                    maxWidth: "15rem", // Set the desired maximum width
                    wordWrap: "break-word", // Allows breaking within words
                    whiteSpace: "normal", // Ensures text wraps normally
                    overflowWrap: "break-word", // Break long words at the edge
                  }}
                >
                  <p>{t(value)}</p>
                </div>
              );
            } else {
              return (
                <div>
                  <p>{t("NA")}</p>
                </div>
              );
            }
  
          case "MICROPLAN_STATUS":
            if (value && value != "NA") {
              return <p>{t(Digit.Utils.locale.getTransformedLocale("MICROPLAN_STATUS_" + value))}</p>;
            } else {
              return (
                <div>
                  <p>{t("NA")}</p>
                </div>
              );
            }
  
          case "CAMPAIGN_DISEASE":
            if (value && value != "NA") {
              return <p>{t(Digit.Utils.locale.getTransformedLocale("MICROPLAN_DISEASE_" + value))}</p>;
            } else {
              return (
                <div>
                  <p>{t("NA")}</p>
                </div>
              );
            }
  
          case "CAMPAIGN_TYPE":
            if (value && value != "NA") {
              return <p>{t(Digit.Utils.locale.getTransformedLocale("MICROPLAN_TYPE_" + value))}</p>;
            } else {
              return (
                <div>
                  <p>{t("NA")}</p>
                </div>
              );
            }
  
          case "DISTIRBUTION_STRATEGY":
            if (value && value != "NA") {
              return <p>{t(Digit.Utils.locale.getTransformedLocale("MICROPLAN_DISTRIBUTION_" + value))}</p>;
            } else {
              return (
                <div>
                  <p>{t("NA")}</p>
                </div>
              );
            }
  
          default:
            return null; // Handle any unexpected keys here if needed
        }
      },
    },
  MyMicroplanSearchConfig: {
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
      data.body.PlanConfigurationSearchCriteria.name = data?.state?.searchForm?.microplanName;
      cleanObject(data.body.PlanConfigurationSearchCriteria);

      const dic = {
        0: [
          "EXECUTION_TO_BE_DONE",
          "CENSUS_DATA_APPROVAL_IN_PROGRESS",
          "CENSUS_DATA_APPROVED",
          "RESOURCE_ESTIMATION_IN_PROGRESS",
          "RESOURCE_ESTIMATIONS_APPROVED",
        ],
        1: ["EXECUTION_TO_BE_DONE"],
        2: ["CENSUS_DATA_APPROVAL_IN_PROGRESS", "CENSUS_DATA_APPROVED", "RESOURCE_ESTIMATION_IN_PROGRESS"],
        3: ["RESOURCE_ESTIMATIONS_APPROVED"],
      };
      const url = Digit.Hooks.useQueryParams();

      const tabId = url.tabId || "0"; // Default to '0' if tabId is undefined
      data.body.PlanConfigurationSearchCriteria.status = dic[String(tabId)];
      return data;
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      const rolesCodes = Digit.Hooks.useSessionStorage("User", {})[0]?.info?.roles;
      const roles = rolesCodes.map((item) => item.code);
      const hasRequiredRole = roles.some((role) => role === "ROOT_POPULATION_DATA_APPROVER" || role === "POPULATION_DATA_APPROVER");
      const EstimationsfileId = row?.files.find((item) => item.templateIdentifier === "Estimations")?.filestoreId;
      const handleFileDownload=()=>{
        const fileId = row?.files.find((item) => item.templateIdentifier === "Estimations")?.filestoreId;
        if (!fileId) {
          console.error("Estimation template file not found");
              return;
            }
        const campaignName = row?.name || "";
        Digit.Utils.campaign.downloadExcelWithCustomName({
          fileStoreId: fileId,
          customName: campaignName
        });

      }
      switch (key) {
        case "ACTIONS":
          const onActionSelect = (key, row) => {
            switch (key) {
              case "START":
                window.history.pushState(
                  {
                    microplanId: row?.id,
                    campaignId: row?.campaignId,
                  },
                  "",
                  `/${window.contextPath}/employee/microplan/select-activity?microplanId=${row?.id}&campaignId=${row?.campaignId}`
                );
                const navEvent = new PopStateEvent("popstate");
                window.dispatchEvent(navEvent);
                break;
              case "EDIT":
                window.history.pushState(
                  {
                    microplanId: row?.id,
                    campaignId: row?.campaignId,
                  },
                  "",
                  `/${window.contextPath}/employee/microplan/select-activity?microplanId=${row?.id}&campaignId=${row?.campaignId}`
                );
                const navEvent2 = new PopStateEvent("popstate");
                window.dispatchEvent(navEvent2);
                break;
                case "DOWNLOAD":
                  handleFileDownload();
                  break;
                
              default:
                console.log(value);
                break;
            }
          };
          return row.status === "EXECUTION_TO_BE_DONE" ? (
            <ButtonNew
              label={t("START")}
              title={t("START")}
              variation="primary"
              icon={"ArrowForward"}
              type="button"
              isSuffix={true}
              style={{width:"290px"}}
              isDisabled={!hasRequiredRole}
              // className="dm-workbench-download-template-btn dm-hover"
              onClick={(e) => onActionSelect("START", row)}
            />
          ) : row.status === "RESOURCE_ESTIMATIONS_APPROVED" ? (
            <ButtonNew
              label={t("WBH_DOWNLOAD_MICROPLAN")}
              title={t("WBH_DOWNLOAD_MICROPLAN")}
              variation="primary"
              icon={"FileDownload"}
              style={{width:"290px"}}
              type="button"
              isDisabled={!EstimationsfileId}
              // className="dm-workbench-download-template-btn dm-hover"
              onClick={(e) => onActionSelect("DOWNLOAD", row)}
            />
          ) : (
            <ButtonNew
              label={t("WBH_EDIT")}
              title={t("WBH_EDIT")}
              variation="primary"
              icon={"Edit"}
              style={{width:"290px"}}
              type="button"
              // className="dm-workbench-download-template-btn dm-hover"
              onClick={(e) => onActionSelect("EDIT", row)}
            />
          );
        case "NAME_OF_MICROPLAN":
          if (value && value !== "NA") {
            return (
              <div
                style={{
                  maxWidth: "15rem", // Set the desired maximum width
                  wordWrap: "break-word", // Allows breaking within words
                  whiteSpace: "normal", // Ensures text wraps normally
                  overflowWrap: "break-word", // Break long words at the edge
                }}
              >
                <p>{t(value)}</p>
              </div>
            );
          } else {
            return (
              <div>
                <p>{t("ES_COMMON_NA")}</p>
              </div>
            );
          }
        case "CAMPAIGN_DISEASE":
          if (value && value !== "NA") {
            return (
              <div
                style={{
                  maxWidth: "15rem", // Set the desired maximum width
                  wordWrap: "break-word", // Allows breaking within words
                  whiteSpace: "normal", // Ensures text wraps normally
                  overflowWrap: "break-word", // Break long words at the edge
                }}
              >
                <p>{t(Digit.Utils.locale.getTransformedLocale("MICROPLAN_DISEASE_" + value))}</p>
              </div>
            );
          } else {
            return (
              <div>
                <p>{t("ES_COMMON_NA")}</p>
              </div>
            );
          }
        case "CAMPAIGN_TYPE":
          if (value && value !== "NA") {
            return (
              <div
                style={{
                  maxWidth: "15rem", // Set the desired maximum width
                  wordWrap: "break-word", // Allows breaking within words
                  whiteSpace: "normal", // Ensures text wraps normally
                  overflowWrap: "break-word", // Break long words at the edge
                }}
              >
                <p>{t(Digit.Utils.locale.getTransformedLocale("MICROPLAN_TYPE_" + value))}</p>
              </div>
            );
          } else {
            return (
              <div>
                <p>{t("ES_COMMON_NA")}</p>
              </div>
            );
          }
        case "DISTIRBUTION_STRATEGY":
          if (value && value !== "NA") {
            return (
              <div
                style={{
                  maxWidth: "15rem", // Set the desired maximum width
                  wordWrap: "break-word", // Allows breaking within words
                  whiteSpace: "normal", // Ensures text wraps normally
                  overflowWrap: "break-word", // Break long words at the edge
                }}
              >
                <p>{t(Digit.Utils.locale.getTransformedLocale("MICROPLAN_DISTRIBUTION_" + value))}</p>
              </div>
            );
          } else {
            return (
              <div>
                <p>{t("ES_COMMON_NA")}</p>
              </div>
            );
          }
        case "MICROPLAN_STATUS":
          if (value && value != "NA") {
            return <p>{t(Digit.Utils.locale.getTransformedLocale("MICROPLAN_STATUS_" + value))}</p>;
          } else {
            return (
              <div>
                <p>{t("NA")}</p>
              </div>
            );
          }
        default:
          return t("ES_COMMON_NA");
      }
    },
  },

  UserManagementConfig: {
    customValidationCheck: (data) => {
      const { phone } = data;
      const mobileRegex = /^[0-9]{10}$/;

      // Allow empty mobile number
      if (!phone || phone.trim() === "") {
        return false;
      }

      // Check if phone matches the regex
      if (!mobileRegex.test(phone)) {
        return { error: true, label: "INVALID_MOBILE_NUMBER" }; // Return an error message if invalid
      }

      return false;
    },

    preProcess: (data, additionalDetails) => {
      const { phone, name } = data?.state?.searchForm || {};
      const { sortOrder } = data?.state?.filterForm || {};
      let { roleschosen } = data?.state?.filterForm || [];

      if (!roleschosen) {
        roleschosen = {};
      }
      if (Object.keys(roleschosen).length === 0) {
        for (const obj of additionalDetails["microplanData"]) {
          roleschosen[obj["roleCode"]] = true;
        }
      }

      let rolesString = "";
      if (roleschosen) {
        rolesString = Object.keys(roleschosen)
          .filter((role) => roleschosen[role] === true)
          .join(",");
      }

      data.params.names = name;
      data.params.sortOrder = "DESC";
      data.params.sortBy = "lastModifiedTime";

      data.params.phone = phone;

      data.params.roles = rolesString;
      data.params.tenantId = Digit.ULBService.getCurrentTenantId();
      cleanObject(data.params);
      delete data.params.roleschosen;
      delete data.params.name;

      return data;
    },

    rolesForFilter: (props) => {
      const userInfo = Digit.UserService.getUser();
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
      return {
        params: {},
        url: `/${mdms_context_path}/v2/_search`, //mdms fetch from

        body: {
          MdmsCriteria: {
            tenantId: Digit.ULBService.getCurrentTenantId(),
            filters: {},
            schemaCode: "hcm-microplanning.rolesForMicroplan",
            limit: 10,
            offset: 0,
          },
        },
        config: {
          enabled: true,
          select: (data) => {
            const roles = data?.mdms.map((item) => {
              return {
                roleCode: item.data.roleCode,
                i18nKey: Digit.Utils.locale.getTransformedLocale(`MP_ROLE_${item.data.roleCode}`),
                // orderNumber: item.data.orderNumber

                // roleCode:{labelKey:item.data.roleCode}
              };
            });

            return roles;
          },
        },
        // changeQueryName:"setPlantUsersInboxDropdown"
      };
    },

    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      if (key === "MP_USER_MANAGEMENT_ROLE") {
        return (
          <div>
            {value.map((item, index) => (
              <span key={index} className="dm-code">
                {t(`MP_ROLE_${item.code}`)}
                {index < value.length - 1 && ", "}
              </span>
            ))}
          </div>
        );
      }
    },
  },
  FacilityMappingConfig: {
    preProcess: (data) => {
      return data;
    },
    getFacilitySearchRequest: ( prop) => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const {campaignId} = Digit.Hooks.useQueryParams();
      return {
        url: `/project-factory/v1/project-type/search`,
        params: {  },
        body: {
          CampaignDetails: {
            "tenantId": tenantId,
            "ids": [
              campaignId
            ]
        }
        },
        changeQueryName: `boundarySearchForPlanFacility`,
        config: {
          enabled: true,
          select: (data) => {
            const result = data?.CampaignDetails?.[0]?.boundaries?.filter((item) => item.type == prop.lowestHierarchy) || [];
            return result
          },
        },
      };
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      const [showPopup, setShowPopup] = useState(false);
      const FacilityPopUp = Digit.ComponentRegistryService.getComponent("FacilityPopup");
      const VillageHierarchyTooltipWrapper = Digit.ComponentRegistryService.getComponent("VillageHierarchyTooltipWrapper");

      switch (key) {
        case `MICROPLAN_FACILITY_${column?.projectType}_CAPACITY`:
          if (row?.additionalDetails?.capacity || row?.additionalDetails?.capacity === 0) {
            return row?.additionalDetails?.capacity;
          }
          return t("NA");
        case "MICROPLAN_FACILITY_SERVINGPOPULATION":
          return row?.additionalDetails?.servingPopulation;
        case "MICROPLAN_FACILITY_RESIDINGVILLAGE":
          return <div style={{display:"flex", gap:".5rem"}}>
          {t(row?.residingBoundary)}
          <VillageHierarchyTooltipWrapper  boundaryCode={row?.residingBoundary}/>
        </div>
        case "MICROPLAN_FACILITY_ASSIGNED_VILLAGES":
          const assignedVillages = row?.serviceBoundaries;
          return assignedVillages ? assignedVillages.length : null;
        case "HCM_MICROPLAN_FACILITY_VIEW_ASSIGNMENT":
        case "HCM_MICROPLAN_FACILITY_ACTION_ASSIGNMENT":
          return (
            <>
              <ButtonNew
                className=""
                icon="ArrowForward"
                iconFill=""
                isSuffix
                label={t(key)}
                onClick={() => setShowPopup(true)}
                // removed this because due to popup crashing on dev
                // onClick={() => console.log("temp action")}
                options={[]}
                optionsKey=""
                size="medium"
                style={{}}
                title={t(key)}
                variation="primary"
              />
              {showPopup && (
                <FacilityPopUp
                  detail={row}
                  onClose={() => {
                    setShowPopup(false);
                  }}
                />
              )}
            </>
          );
        default:
          return null;
      }
    },
  },
  MyMicroplanSearchConfigExample: {
    test: "yes",
  },
  FacilityMappingConfigExample: {
    test: "yes",
  },
  UserManagementConfigExample: {
    test: "yes",
  },
  MyMicroplanSearchConfigPlan: {
    test: "yes",
  },
  FacilityMappingConfigPlan: {
    test: "yes",
  },
  UserManagementConfigPlan: {
    test: "yes",
  },
};
