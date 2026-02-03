import _ from "lodash";
import { useLocation, useHistory, Link, useParams } from "react-router-dom";
import React, { useState, Fragment } from "react";
import { DeleteIconv2, DownloadIcon, FileIcon, Button, Card, CardSubHeader, EditIcon, ArrowForward, Modal, CloseSvg, Close, } from "@egovernments/digit-ui-react-components";
import { Button as ButtonNew, Dropdown, Toast, Tag, Loader, FormComposerV2, PopUp, TextInput } from "@egovernments/digit-ui-components";
import { useNavigate } from "react-router-dom";


//create functions here based on module name set in mdms(eg->SearchProjectConfig)
//how to call these -> Digit?.Customizations?.[masterName]?.[moduleName]
// these functions will act as middlewares
// var Digit = window.Digit || {};


/**
 * Convert an epoch to a Date object using the local timezone
 * Works both in browser and Node.js (AWS, etc.)
 */
const toLocalDate = (epoch) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Force the epoch to interpret in the detected local timezone
  return new Date(
    new Date(epoch).toLocaleString("en-US", { timeZone })
  );
};

/**
 * Helper: Create a new Date using local time (no UTC shift)
 */
const setLocalTime = (baseDate, hours, minutes, seconds = 0) => {
  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    hours,
    minutes,
    seconds,
    0
  );
};

/**
 * enrolmentTimeWithSession
 * Always works with the current local timezone
 */
export const enrolmentTimeWithSession = (sessionType, enrolmentEpoch) => {
  // Convert epoch to local date respecting timezone
  const enrolmentTime = toLocalDate(enrolmentEpoch);

  const start9AM = setLocalTime(enrolmentTime, 9, 0);
  const noon = setLocalTime(enrolmentTime, 12, 0);
  const nextDay = new Date(enrolmentTime);
  nextDay.setDate(nextDay.getDate() + 1);

  let effectiveDate;

  if (sessionType === "0") {
    // Single session: 9AM - 6PM
    if (enrolmentTime < start9AM) {
      // before 9AM → 12:10 AM same day
      effectiveDate = setLocalTime(enrolmentTime, 0, 10, 10);
    } else {
      // after 9AM → 12:10 AM next day
      effectiveDate = setLocalTime(nextDay, 0, 10, 10);
    }
  } else if (sessionType === "2") {
    // Multi session: 9AM–12PM, 12:01PM–6PM
    if (enrolmentTime < noon) {
      if (enrolmentTime < start9AM) {
        effectiveDate = setLocalTime(enrolmentTime, 0, 10, 10);
      } else {
        effectiveDate = setLocalTime(enrolmentTime, 11, 55, 0);
      }
    } else {
      effectiveDate = setLocalTime(nextDay, 0, 10, 10);
    }
  }

  return effectiveDate.getTime();
};

const wrapTextStyle = {
  maxWidth: "15rem",
  wordWrap: "break-word",
  whiteSpace: "normal",
  overflowWrap: "break-word",
};

const renderText = (value, t) => {
  if (value && value !== "NA") {
    return (
      <div style={wrapTextStyle}>
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
}

const getMDMSUrl = (v2 = false) => {
  if (v2) {
    let url = window.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || window.globalConfigs?.getConfig("MDMS_CONTEXT_PATH") || "mdms-v2";
    return `/${url}`;
  }
  let url = window.globalConfigs?.getConfig("MDMS_V1_CONTEXT_PATH") || "egov-mdms-service";
  return `/${url}`;
};

const businessServiceMap = {
  "muster roll": "MR",
};

const inboxModuleNameMap = {
  "muster-roll-approval": "muster-roll-service",
};

const convertDateToEpoch = (dateString) => {
  // Create a Date object from the input date string
  const date = new Date(dateString);

  // Convert the date to epoch time (seconds)
  return Math.floor(date.getTime());
}

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
      const [showToast, setShowToast] = useState(false);
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const microplanId = row?.id;

      const { data: rootEstimationApprover } = Digit.Hooks.microplanv1.usePlanSearchEmployeeWithTagging({
        tenantId: tenantId,
        body: {
          PlanEmployeeAssignmentSearchCriteria: {
            tenantId: tenantId,
            planConfigurationId: microplanId,
            role: ["ROOT_PLAN_ESTIMATION_APPROVER"],
            active: true,
          },
        },
        config: {
          enabled: true,
        },
      });

      const { data: rootPopulationApprover } = Digit.Hooks.microplanv1.usePlanSearchEmployeeWithTagging({
        tenantId,
        body: {
          PlanEmployeeAssignmentSearchCriteria: {
            tenantId,
            planConfigurationId: microplanId,
            role: ["ROOT_POPULATION_DATA_APPROVER"],
            active: true,
          },
        },
        config: { enabled: true },
      });

      const { data: rootFacilityMapper } = Digit.Hooks.microplanv1.usePlanSearchEmployeeWithTagging({
        tenantId,
        body: {
          PlanEmployeeAssignmentSearchCriteria: {
            tenantId,
            planConfigurationId: microplanId,
            role: ["ROOT_FACILITY_CATCHMENT_MAPPER"],
            active: true,
          },
        },
        config: { enabled: true },
      });

      switch (key) {
        case "ACTIONS":
          // TODO : Replace dummy file id with real file id when API is ready
          const dummyFile = "c22a7676-d5d7-49b6-bcdb-83e9519f58df"
          const microplanFileId = row?.campaignDetails?.additionalDetails?.microplanFileId || dummyFile;
          const EstimationsfileId = row?.files.find((item) => item.templateIdentifier === "Estimations")?.filestoreId;
          let options = [];

          if (row?.status == "DRAFT") {
            options = [
              { code: "1", name: "MP_ACTIONS_EDIT_SETUP" },
              { code: "2", name: "MP_ACTIONS_DOWNLOAD_DRAFT" },
              { code: "3", name: "MP_ACTIONS_FREEZE_MICROPLAN" },
            ];
          } else {
            options = [{ code: "1", name: "MP_ACTIONS_VIEW_SUMMARY" }];
          }

          const handleDownload = ({ type }) => {

            const template = type === "Estimations" ? "Estimations" : "DraftComplete";
            const fileId = row?.files.find((item) => item.templateIdentifier === template)?.filestoreId;
            if (!fileId) {
              setShowToast({ label: t("NO_DRAFT_FILE_FOUND") });
              return;
            }
            const campaignName = row?.name || "";
            const customName = type === "Estimations" ? campaignName : `${campaignName}_DRAFT`;
            Digit.Utils.campaign.downloadExcelWithCustomName({
              fileStoreId: fileId,
              customName: customName,
            });
          };

          const onActionSelect = async (e, row) => {
            if (e.name === "MP_ACTIONS_EDIT_SETUP") {
              const key = parseInt(row?.additionalDetails?.key);
              const resolvedKey = key === 8 ? 7 : key === 10 ? 11 : key || 2;
              const url = `/${window.contextPath}/employee/microplan/setup-microplan?key=${resolvedKey}&microplanId=${row.id}&campaignId=${row.campaignDetails.id}`;
              window.location.href = url;
            }
            if (e.name === "MP_ACTIONS_DOWNLOAD_DRAFT") {
              if (row?.status == "DRAFT" && row?.assumptions.length > 0 && row?.operations.length > 0) {
                handleDownload({ type: "Draft" });
              } else {
                setShowToast({ label: t("PLEASE_UPDATE_THE_SETUP_INFORMATION_BEFORE_DOWNLOADING_DRAFT") });
              }
            }
            if (e.name === "MP_ACTIONS_FREEZE_MICROPLAN") {
              if (
                row?.status == "DRAFT" &&
                row?.assumptions.length > 0 &&
                row?.operations.length > 0 &&
                rootEstimationApprover?.data?.length > 0 &&
                rootPopulationApprover?.data?.length > 0 &&
                rootFacilityMapper?.data?.length > 0
              ) {
                const triggeredFromMain = "OPEN_MICROPLANS";
                const response = await Digit.Hooks.microplanv1.useCompleteSetUpFlow({
                  tenantId,
                  microplanId,
                  triggeredFrom: triggeredFromMain,
                });
                if (response && !response?.isError) {
                  window.history.pushState(response?.state, "", response?.redirectTo);
                  window.dispatchEvent(new PopStateEvent("popstate", { state: response?.state }));
                }
                if (response && response?.isError) {
                  console.error(`ERR_FAILED_TO_COMPLETE_SETUP`);
                }
              } else {
                setShowToast({ label: t("PLEASE_FINISH_THE_DRAFT_BEFORE_FREEZING") });
              }
            }
            if (e.name == "MP_ACTIONS_VIEW_SUMMARY") {
              window.location.href = `/${window.contextPath}/employee/microplan/setup-microplan?key=${11}&microplanId=${row.id}&campaignId=${row.campaignDetails.id
                }&setup-completed=true`;
            }
          };

          const handleToast = () => {
            setShowToast(false);
          };

          return (
            <>
              <div>
                {microplanFileId && row?.status == "RESOURCE_ESTIMATIONS_APPROVED" ? (
                  <div>
                    <ButtonNew style={{ width: "20rem" }} icon="DownloadIcon" onClick={() => handleDownload({ type: "Estimations" })} label={t("WBH_DOWNLOAD_MICROPLAN")} title={t("WBH_DOWNLOAD_MICROPLAN")} isDisabled={!EstimationsfileId} />
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
                        onOptionSelect={(item) => onActionSelect(item, row)}
                      />
                    </div>
                  </div>
                )}
              </div>
              {showToast && <Toast type={showToast?.type || "warning"} label={showToast?.label} onClose={handleToast} />}
            </>
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
      const handleFileDownload = () => {
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
          const onOptionSelect = (option) => {
            const key = option.code;
            switch (key) {
              case t("VIEW_AUDIT_LOGS"):
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
              case t("WBH_DOWNLOAD_MICROPLAN"):
                handleFileDownload();
                break;
              default:
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
              style={{ width: "290px" }}
              isDisabled={!hasRequiredRole}
              // className="dm-workbench-download-template-btn dm-hover"
              onClick={(e) => onActionSelect("START", row)}
            />
          ) : row.status === "RESOURCE_ESTIMATIONS_APPROVED" ? (
            <ButtonNew
              isSearchable={false}
              title={t("MP_ACTIONS_FOR_MICROPLANS")}
              label={t("MP_ACTIONS_FOR_MICROPLANS")}
              isDisabled={!EstimationsfileId}
              onClick={() => { }}
              variation="primary"
              onOptionSelect={(option) => onOptionSelect(option)}
              options={[
                {
                  code: t("WBH_DOWNLOAD_MICROPLAN"),
                  name: t("WBH_DOWNLOAD_MICROPLAN"),
                  icon: "FileDownload"
                },
                {
                  code: t("VIEW_AUDIT_LOGS"),
                  name: t("VIEW_AUDIT_LOGS")
                },
              ]}
              optionsKey="name"
              showBottom={true}
              style={{ width: "290px" }}
              type="actionButton"
              className="my-microplans-action-button"
            />
          ) : (
            <ButtonNew
              label={t("WBH_EDIT")}
              title={t("WBH_EDIT")}
              variation="primary"
              icon={"Edit"}
              style={{ width: "290px" }}
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
    getFacilitySearchRequest: (prop) => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const { campaignId } = Digit.Hooks.useQueryParams();
      return {
        url: `/project-factory/v1/project-type/search`,
        params: {},
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
      const [showMapPopup, setShowMapPopup] = useState(false);
      const FacilityPopUp = Digit.ComponentRegistryService.getComponent("FacilityPopup");
      const MapViewPopup = Digit.ComponentRegistryService.getComponent("MapViewPopup");
      const VillageHierarchyTooltipWrapper = Digit.ComponentRegistryService.getComponent("VillageHierarchyTooltipWrapper");
      const [refreshKey, setRefreshKey, clearRefreshKey] = Digit.Hooks.useSessionStorage("FACILITY_POPUP_KEY", 0);

      switch (key) {
        case `MICROPLAN_FACILITY_${column?.projectType}_CAPACITY`:
          if (row?.additionalDetails?.capacity || row?.additionalDetails?.capacity === 0) {
            return row?.additionalDetails?.capacity;
          }
          return t("NA");
        case "MICROPLAN_FACILITY_SERVINGPOPULATION":
          return row?.additionalDetails?.servingPopulation;
        case "MICROPLAN_FACILITY_RESIDINGVILLAGE":
          return <div style={{ display: "flex", gap: ".5rem" }}>
            {t(row?.residingBoundary)}
            <VillageHierarchyTooltipWrapper boundaryCode={row?.residingBoundary} />
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
                title={t(key)}
                label={t(key)}
                onClick={() => { setShowPopup(true); }}
                // removed this because due to popup crashing on dev
                // onClick={() => console.log("temp action")}
                options={[]}
                optionsKey=""
                size="medium"
                style={{}}
                variation="primary"
              />
              {showPopup && (
                <FacilityPopUp
                  detail={row}
                  onClose={() => {
                    setShowPopup(false);
                    setRefreshKey(prev => prev + 1);
                    window.dispatchEvent(new Event("refreshKeyUpdated"));
                  }}
                />
              )}
            </>
          );
        case "VIEW_ON_MAP":
          return (
            <>
              <ButtonNew
                className=""
                icon="MyLocation"
                iconFill=""
                isSuffix
                title={t(key)}
                label={t(key)}
                onClick={() => {
                  setShowMapPopup(true);
                }}
                options={[]}
                optionsKey=""
                size="medium"
                style={{}}
                variation="link"
              />
              {showMapPopup && (
                <MapViewPopup
                  type={"Facility"}
                  bounds={{ latitude: row?.additionalDetails?.latitude, longitude: row?.additionalDetails?.longitude }}
                  heading={row?.facilityName}
                  setShowPopup={setShowMapPopup}
                />
              )}
            </>
          );
        default:
          return null;
      }
    },
  },
  IframeInterfaceConfig: {
    addAdditionalFilters: (url, filters) => {
      const { boundaryType, campaignId } = filters || {};
      const boundaryValue = filters?.[boundaryType];
      let filter = "";
      if (boundaryType && boundaryValue && campaignId) {
        filter = `(query:(match_phrase:(Data.boundaryHierarchy.${boundaryType}.keyword:'${boundaryValue}'))),(query:(match_phrase:(Data.campaignId.keyword:'${campaignId}')))`;
      } else {
        filter = boundaryType && boundaryValue
          ? `(query:(match_phrase:(Data.boundaryHierarchy.${boundaryType}.keyword:'${boundaryValue}')))`
          : campaignId
            ? `(query:(match_phrase:(Data.campaignId.keyword:'${campaignId}')))`
            : null;
      }
      // Extract existing _g values for refreshInterval and time
      const gParamMatch = /_g=\((.*?)\)/.exec(url);
      let gParamContent = gParamMatch && gParamMatch[1] ? gParamMatch[1] : "";

      if (filter) {
        // Integrate the new filter with existing _g content
        const updatedGParam = `filters:!(${filter}),${gParamContent}`;
        const updatedUrl = url.replace(/_g=\((.*?)\)/, `_g=(${updatedGParam})`).replace(/ /g, "%20");
        return updatedUrl;
      } else {
        // No filter to add, keep original URL
        return url;
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
  PGRInboxConfig: {
    preProcess: (data) => {
      data.body.inbox.tenantId = Digit.ULBService.getCurrentTenantId();
      data.body.inbox.processSearchCriteria.tenantId = Digit.ULBService.getCurrentTenantId();
      data.body.inbox.limit= data?.state?.tableForm?.limit;

      const requestDate = data?.body?.inbox?.moduleSearchCriteria?.range?.requestDate;

      if (requestDate?.startDate && requestDate?.endDate) {
        const fromDate = new Date(requestDate.startDate).getTime();
        const toDate = new Date(new Date(requestDate.endDate).setHours(23,59,59,999)).getTime();

        data.body.inbox.moduleSearchCriteria.fromDate = fromDate;
        data.body.inbox.moduleSearchCriteria.toDate = toDate;
      } else {
        delete data.body.inbox.moduleSearchCriteria.fromDate;
        delete data.body.inbox.moduleSearchCriteria.toDate;
      }

      if (data?.state?.tableForm?.sortOrder) {
        delete data.state.tableForm.sortOrder;
      }
      
      // Always delete the full range object if it exists
      delete data.body.inbox.moduleSearchCriteria.range;

      const assignee = _.clone(data.body.inbox.moduleSearchCriteria.assignedToMe);
      delete data.body.inbox.moduleSearchCriteria.assignedToMe;
      delete data.body.inbox.moduleSearchCriteria.assignee;

      if (assignee?.code === "ASSIGNED_TO_ME" || data?.state?.filterForm?.assignedToMe?.code === "ASSIGNED_TO_ME") {
        data.body.inbox.moduleSearchCriteria.assignedToMe = Digit.UserService.getUser().info.uuid;
      }

      // if(data?.state?.filterForm){
      //   window.Digit.SessionStorage.set("filtersForInbox",data?.state?.filterForm); 
      // }

      // --- Handle serviceCode ---
      let serviceCodes = _.clone(data.body.inbox.moduleSearchCriteria.serviceCode || null);
      serviceCodes = serviceCodes?.serviceCode;
      delete data.body.inbox.moduleSearchCriteria.serviceCode;
      if (serviceCodes != null) {
        data.body.inbox.moduleSearchCriteria.complaintType = serviceCodes;
      } else {
        delete data.body.inbox.moduleSearchCriteria.complaintType;
      }

      delete data.body.inbox.moduleSearchCriteria.locality;
      let rawLocality = data?.state?.filterForm?.locality;
      let localityArray = [];
      if (rawLocality) {
        if (Array.isArray(rawLocality)) {
          localityArray = rawLocality.map((loc) => {
            // Extract last segment from dot-separated code (e.g., "MICROPLAN_MO_16_FCT__ABUJA_STATE.MICROPLAN_MO_16_01_FCT__ABUJA.MICROPLAN_MO_16_01_01_ABAJI.MICROPLAN_MO_16_01_01_02_AGYANA_PAN_DAGI" -> "MICROPLAN_MO_16_01_01_02_AGYANA_PAN_DAGI")
            const code = loc?.code;
            if (code && typeof code === 'string' && code.includes('.')) {
              const segments = code.split('.');
              const lastSegment = segments[segments.length - 1];
              return lastSegment || null;
            }
            return code || null;
          }).filter(Boolean);
        } else if (rawLocality?.code) {
          // Extract last segment for single locality
          const code = rawLocality.code;
          if (code && typeof code === 'string') {
            if (code.includes('.')) {
              const segments = code.split('.');
              const lastSegment = segments[segments.length - 1];
              if (lastSegment) {
                localityArray = [lastSegment];
              }
            } else {
              localityArray = [code];
            }
          }
        }
      }

      if (Array.isArray(localityArray) && localityArray.length > 0) {
        delete data.body.inbox.moduleSearchCriteria.locality;
        data.body.inbox.moduleSearchCriteria.area = localityArray;
      } else {
        delete data.body.inbox.moduleSearchCriteria.area;
      }

      // --- Handle status from state.filterForm ---
      const rawStatuses = _.clone(data?.state?.filterForm?.status || {});
      const statuses = Object.keys(rawStatuses).filter((key) => rawStatuses[key] === true);

      if (statuses.length > 0) {
        data.body.inbox.moduleSearchCriteria.status = statuses;
      } else {
        delete data.body.inbox.moduleSearchCriteria.status;
      }

      return data;
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      switch (key) {
        case "CS_COMMON_COMPLAINT_NO":
          return (
            <div style={{ display: "grid" }}>
              <span className="link" style={{ display: "grid" }}>
                <Link to={`/${window.contextPath}/employee/pgr/complaint-details/${value}`}>
                  {String(value ? (column.translate ? t(column.prefix ? `${column.prefix}${value}` : value) : value) : t("ES_COMMON_NA"))}
                </Link>
              </span>
              <span>
                {row?.businessObject?.service?.serviceCode
                  ? t(`SERVICEDEFS.${row.businessObject.service.serviceCode.toUpperCase()}`)
                  : t("ES_COMMON_NA")}
              </span>
            </div>
          );

          case "WF_INBOX_HEADER_LOCALITY": { 
            const formattedValue =
              typeof value === "string" && value.length > 0 && value.includes(".")
                ? value.split(".").pop() 
                : (typeof value === "string" && value.length > 0 ? value : null); 
          
            return formattedValue ? <span>{t(`${formattedValue}`)}</span> : <span>{t("NA")}</span>;
          }          

        case "CS_COMPLAINT_DETAILS_CURRENT_STATUS":
          return value && value?.length > 0 ? <span>{t(`WF_INBOX_${value}`)}</span> : <span>{t("NA")}</span>;

        case "WF_INBOX_HEADER_CURRENT_OWNER":
          return <span>{value?.assignes?.[0]?.name || t("NA")}</span>; // simplified and tightened

        case "WF_INBOX_HEADER_CREATED_DATE":
          if (!value || value <= 0) {
            return <Tag label={t("ES_COMMON_NA")} showIcon={false} type="error" />;
          }
          const createdDate = new Date(value);
          const createdDay = createdDate.getDate();
          const createdMonthKeys = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
          const createdMonth = t(`PGR_INBOX_${createdMonthKeys[createdDate.getMonth()]}`);
          const createdYear = createdDate.getFullYear().toString().slice(-2);
          const createdDateLabel = `${createdDay} ${createdMonth} ${createdYear}`;
          return <Tag label={createdDateLabel} showIcon={false} type="success" />;

        default:
          return t("ES_COMMON_NA");
      }
    },
  },
  CampaignsInboxConfig: {
    preProcess: (data, additionalDetails) => {
      data.body.ProjectStaff = {};
      data.body.ProjectStaff.staffId = [Digit.UserService.getUser().info.uuid];
      data.params.tenantId = Digit.ULBService.getCurrentTenantId();
      data.params.limit = data.state.tableForm.limit;
      data.params.offset = data.state.tableForm.offset;
      delete data.body.ProjectStaff.campaignName;
      delete data.body.ProjectStaff.campaignType;
      cleanObject(data.body.ProjectStaff);
      return data;
    },
    populateCampaignTypeReqCriteria: () => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const url = getMDMSUrl(true);
      return {
        url: `${url}/v1/_search`,
        params: { tenantId },
        body: {
          MdmsCriteria: {
            tenantId: tenantId,
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
        changeQueryName: "setWorkflowStatus",
        config: {
          enabled: true,
          select: (data) => {
            return data?.MdmsRes?.["HCM-PROJECT-TYPES"]?.projectTypes;
          },
        },
      };
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      switch (key) {
        case "ACTIONS":
          let options = [
            { code: "1", name: "VIEW_DASHBOARD" },
            { code: "2", name: "VIEW_CUSTOM_REPORT" },
          ];
          const onActionSelect = async (e, row) => {
            if (e.name == "VIEW_DASHBOARD") {
              window.location.href = `/${window.contextPath}/employee/microplan/setup-microplan?key=${11}&setup-completed=true`;
            } // TODO : NEED TO UPDATE THE LINKS ONCE CONFIRMED
            if (e.name == "VIEW_CUSTOM_REPORT") {
              window.location.href = `/${window.contextPath}/employee/microplan/setup-microplan?key=${11}&setup-completed=true`;
            } // TODO : NEED TO UPDATE THE LINKS ONCE CONFIRMED
          };
          return (
            <ButtonNew
              type="actionButton"
              variation="secondary"
              label={t("TAKE_ACTION")}
              title={t("TAKE_ACTION")}
              options={options}
              style={{ width: "20rem" }}
              optionsKey="name"
              showBottom={true}
              isSearchable={false}
              onOptionSelect={(item) => onActionSelect(item, row)}
            />
          );

        case "CAMPAIGN_NAME":
          return renderText(value, t);

        case "BOUNDARY_NAME":
          return renderText(value, t);

        case "START_DATE":
          return (
            <div
              style={{
                maxWidth: "15rem", // Set the desired maximum width
                wordWrap: "break-word", // Allows breaking within words
                whiteSpace: "normal", // Ensures text wraps normally
                overflowWrap: "break-word", // Break long words at the edge
              }}
            >
              <p>{Digit.DateUtils.ConvertEpochToDate(value)}</p>
            </div>
          );

        case "YEAR":
          return renderText(value, t);

        case "END_DATE":
          return (
            <div
              style={{
                maxWidth: "15rem", // Set the desired maximum width
                wordWrap: "break-word", // Allows breaking within words
                whiteSpace: "normal", // Ensures text wraps normally
                overflowWrap: "break-word", // Break long words at the edge
              }}
            >
              <p>{Digit.DateUtils.ConvertEpochToDate(value)}</p>
            </div>
          );

        case "PLANNED_END_DATE":
          return (
            <div
              style={{
                maxWidth: "15rem", // Set the desired maximum width
                wordWrap: "break-word", // Allows breaking within words
                whiteSpace: "normal", // Ensures text wraps normally
                overflowWrap: "break-word", // Break long words at the edge
              }}
            >
              <p>{Digit.DateUtils.ConvertEpochToDate(value)}</p>
            </div>
          );

        default:
          return null; // Handle any unexpected keys here if needed
      }
    },
  },

  HRMSInboxConfig: {
    preProcess: (data) => {
      // filterForm
      // params

      if (data.state.filterForm && Object.keys(data.state.filterForm).length > 0) {
        const updatedParams = {}; // Temporary object to store updates

        if (data.state.filterForm.roles?.code) {
          updatedParams.roles = data.state.filterForm.roles.code;
        }

        if (typeof data.state.filterForm.isActive === "object" && "code" in data.state.filterForm.isActive) {
          updatedParams.isActive = data.state.filterForm.isActive.code;
        }

        // Update `data.params` only if `updatedParams` has values
        if (Object.keys(updatedParams).length > 0) {
          data.params = { ...data.params, ...updatedParams };
        }
      }

      return data;
    },

    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      switch (key) {
        case "HR_EMP_ID_LABEL":
          return (
            <span className="link">
              <Link to={`/${window.contextPath}/employee/hrms/details/${value}`}>{value}</Link>
            </span>
          );

        case "HR_EMP_NAME_LABEL":
          return value ? `${value}` : t("ES_COMMON_NA");

        case "HR_ROLE_NO_LABEL":
          return value?.length > 0 ? value?.length : t("ES_COMMON_NA");

        case "HR_DESG_LABEL":
          return value ? t(`${value.designation}`) : t("ES_COMMON_NA");

        case "HR_EMPLOYMENT_DEPARTMENT_LABEL":
          return value ? t(`${value.department}`) : t("ES_COMMON_NA");

        case "HR_JURIDICTIONS_LABEL":
          return value?.length > 0 ? (
            value?.map((j) => t(j?.boundary)).join(",")
          ) : (
            t("ES_COMMON_NA")
          );
        default:
          return t("ES_COMMON_NA");
      }
    },
  },
  AssignCampaignInboxConfig: {
    preProcess: (data) => {
      const formState = data?.state?.searchForm || {};

      const sharedFields = {};
      if (formState.projectType?.code) sharedFields.projectType = formState.projectType.code;
      if (formState.name?.trim()) sharedFields.name = formState.name.trim();
      if (formState.projectNumber?.trim()) sharedFields.projectNumber = formState.projectNumber.trim();
      if (formState.startDate) sharedFields.startDate = new Date(formState.startDate).getTime();
      if (formState.endDate) sharedFields.endDate = new Date(formState.endDate).getTime();

      // 🟢 Reset to all original Projects from config when filters are cleared
      // ✅ Convert object to array
      const allProjects = Object.values(data?.body?.jurisdictionProjects || {});


      let filteredProjects = [...allProjects];

      if (formState.boundary?.code) {
        filteredProjects = filteredProjects.filter(
          (p) => p?.address?.boundary === formState.boundary.code
        );
      }

      // Enrich filtered projects
      data.body.Projects = filteredProjects.map((p) => ({
        ...p,
        ...sharedFields,
      }));

      return data;
    },

    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      const { id } = useParams();
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const projectContextPath = window?.globalConfigs?.getConfig("PROJECT_SERVICE_PATH") || "health-project";
      const [toast, setToast] = useState(null);
      const [modalOpen, setModalOpen] = useState(false);
      const [sessionFormData, setSessionFormData] = useState({});
      const [refreshKey, setRefreshKey,] = useState(Date.now());

      const { isLoading: isHRMSSearchLoading, isError, error, data: hrmsData } = Digit.Hooks.hrms.useHRMSSearch({ codes: id }, tenantId);      // API request criteria for fetching project staff details
      const reqCri = {
        url: `/${projectContextPath}/staff/v1/_search`,
        params: {
          tenantId: tenantId,
          limit: 100,
          offset: 0,
        },
        body: {
          ProjectStaff: {
            staffId: hrmsData.Employees[0]?.user?.userServiceUuid ? [hrmsData.Employees[0]?.user?.userServiceUuid] : [],
          },
        },
        config: {
          enabled: !!hrmsData.Employees[0]?.user?.userServiceUuid,
          select: (data) => {
            return data.ProjectStaff;
          },
        },
      };
      // Fetch project staff details using custom API hook
      const { isLoading: isProjectStaffLoading, data: projectStaff, revalidate: revalidateProjectStaff } = Digit.Hooks.useCustomAPIHook(reqCri);

      const formConfig = {
        label: {
          heading: "ASSIGN_CAMPAIGN_MODAL_TITLE",
          submit: "CORE_COMMON_SUBMIT",
          cancel: "CORE_COMMON_CANCEL"
        },
        form: [
          {
            body: [
              {
                inline: true,
                label: "HR_CAMPAIGN_FROM_DATE_LABEL",
                isMandatory: true,
                key: "startDate",
                type: "date",
                populators: {
                  name: "startDate",
                  required: true,
                  error: "CORE_COMMON_REQUIRED_ERRMSG",
                  validation: {
                    min: new Date().toISOString().split("T")[0]
                  }
                }
              },
              {
                inline: true,
                label: "HR_CAMPAIGN_TO_DATE_LABEL",
                isMandatory: false,
                key: "endDate",
                type: "date",
                populators: {
                  name: "endDate",
                  required: false,
                  error: "CORE_COMMON_REQUIRED_ERRMSG",
                  validation: {
                    min: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                  }
                }
              }
            ]
          }
        ]
      };
      const createStaffMutation = Digit.Hooks.hrms.useHRMSStaffCreate(tenantId);
      const deleteStaffMutation = Digit.Hooks.hrms.useHRMSStaffDelete(tenantId);

      const validateFormData = (formData, config, t) => {
        const missingFields = [];

        config?.form?.forEach((section) => {
          section.body?.forEach((field) => {
            const key = field.key;
            const isRequired = field.isMandatory || field.populators?.required;

            if (isRequired && !formData[key]) {
              missingFields.push(t(field.label)); // Push the translated label
            }
          });
        });

        return missingFields;
      };

      const CloseBtn = (props) => {
        return (
          <div onClick={props?.onClick} style={props?.isMobileView ? { padding: 5 } : null}>
            {props?.isMobileView ? (
              <CloseSvg />
            ) : (
              <div className={"icon-bg-secondary"} style={{ backgroundColor: "#FFFFFF" }}>
                <Close />
              </div>
            )}
          </div>
        );
      };
      const Heading = (props) => {
        return <h1 className="heading-m">{props.heading}</h1>;
      };

      const handleToastClose = () => {
        setToast(null);
      };

      const handleModalSubmit = async () => {
        const missingFields = validateFormData(sessionFormData, formConfig, t);


        if (missingFields.length > 0) {
          setToast({ key: true, label: t("ES_COMMON_PLEASE_ENTER_ALL_MANDATORY_FIELDS"), type: "error" });
          return;
        }
        else {
          setModalOpen(false);
          const payload = {
            tenantId: tenantId,
            userId: hrmsData.Employees[0]?.user?.userServiceUuid,
            projectId: row?.id,
            startDate: sessionFormData?.startDate
              ? convertDateToEpoch(sessionFormData?.startDate)
              : row?.startDate,
            endDate: sessionFormData?.endDate
              ? convertDateToEpoch(sessionFormData?.endDate)
              : row?.endDate,
          };
          await createStaffService(payload);
        }
      };
      const onFormValueChange = (setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
        if (!_.isEqual(sessionFormData, formData)) {
          setSessionFormData({ ...sessionFormData, ...formData });
        }
      }
      const createStaffService = async (payload) => {
        try {
          await createStaffMutation.mutateAsync(
            {
              projectStaff: payload,
            },
            {
              onSuccess: async (res) => {
                setToast({ key: false, label: `${id} ${t("ASSIGNED_SUCCESSFULLY")}`, type: "success" });
                setRefreshKey(Date.now());
                await revalidateProjectStaff();
              },
              onError: async (error) => {
                setToast({ key: true, label: `${id} ${t("FAILED_TO_ASSIGN_CAMPAIGN")}`, type: "error" });
                setRefreshKey(Date.now());
                await revalidateProjectStaff();
              },
            }
          );
        } catch (error) {
          // setTriggerEstimate(true);
          setToast({ key: true, label: `${id} ${t("FAILED_TO_ASSIGN_CAMPAIGN")}`, type: "error" });
        }
      };


      switch (key) {
        case "CAMPAIGN_START_DATE":
        case "CAMPAIGN_END_DATE":
          return (
            <div
              style={{
                maxWidth: "15rem", // Set the desired maximum width
                wordWrap: "break-word", // Allows breaking within words
                whiteSpace: "normal", // Ensures text wraps normally
                overflowWrap: "break-word", // Break long words at the edge
              }}
            >
              <p>{Digit.DateUtils.ConvertEpochToDate(value)}</p>
            </div>
          );
        case "PROJECT_BOUNDARY_TYPE":
          return value ? <span>{t(`${hrmsData.Employees[0]?.jurisdictions?.[0]?.hierarchy}_${value}`)}</span> : <span>{t("NA")}</span>;
        case "PROJECT_BOUNDARY":
        case "PROJECT_TYPE":
          return value ? <span>{t(`${value}`)}</span> : <span>{t("NA")}</span>;
        case "ASSIGNMENT":

          if (isHRMSSearchLoading || isProjectStaffLoading) {
            return <Loader />;
          }

          return (
            // <span style={{color: "#F18F5E", cursor: "pointer"}}>{t(`ASSIGN`)}</span>
            <>
              <Button
                key={refreshKey}
                variation={projectStaff && projectStaff?.length > 0 && projectStaff?.some(item => item.projectId === row?.id) ? "secondary" : "primary"}
                label={projectStaff && projectStaff?.length > 0 && projectStaff?.some(item => item.projectId === row?.id) ? t("UNASSIGN") : t("ASSIGN")}
                style={{ minWidth: "10rem" }}
                onButtonClick={() => {
                  if (projectStaff && projectStaff?.length > 0 && projectStaff?.some(item => item.projectId === row?.id)) {
                    deleteStaffMutation.mutateAsync(
                      {
                        projectStaff: projectStaff?.find(item => item.projectId === row?.id),
                      },
                      {
                        onSuccess: async (res) => {
                          setToast({ key: false, label: `${id} ${t("UNASSIGNED_SUCCESSFULLY")}`, type: "success" });
                          setRefreshKey(Date.now());
                          await revalidateProjectStaff();
                        },
                        onError: async (error) => {
                          setToast({ key: true, label: `${id} ${t("FAILED_TO_UNASSIGN_CAMPAIGN")}`, type: "error" });
                          setRefreshKey(Date.now());
                          await revalidateProjectStaff();
                        },
                      }
                    );
                    return;
                  }
                  else {
                    setModalOpen(true);
                  }
                }}
              />
              {modalOpen && (
                <Modal
                  popupStyles={{ width: "48.438rem", borderRadius: "0.25rem", height: "fit-content" }}
                  headerBarMain={<Heading t={t} heading={t(formConfig.label.heading)} />}
                  headerBarEnd={<CloseBtn onClick={() => setModalOpen(false)} />}
                  actionSaveLabel={t(formConfig.label.submit)}
                  actionCancelLabel={t(formConfig.label.cancel)}
                  actionCancelOnSubmit={() => setModalOpen(false)}
                  actionSaveOnSubmit={handleModalSubmit}
                  formId="modal-action"
                >
                  <FormComposerV2
                    config={formConfig.form}
                    defaultValues={sessionFormData}
                    noBoxShadow
                    inline
                    childrenAtTheBottom
                    formId="modal-action"
                    onFormValueChange={onFormValueChange}
                  />
                </Modal>
              )}
              {toast && (
                <Toast
                  error={toast.key}
                  isDleteBtn={true}
                  label={t(toast.label)}
                  onClose={handleToastClose}
                  type={toast.type}
                />
              )}
            </>
          );

        default:
          return t("ES_COMMON_NA");
      }
    },
  },
  MyCampaignConfigOngoing: {
    preProcess: (data, additionalDetails) => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      data.body = { RequestInfo: data.body.RequestInfo };
      const { limit, offset } = data?.state?.tableForm || {};
      const { campaignName, campaignType } = data?.state?.searchForm || {};
      // Convert current date to GMT (subtract 5.5 hours for IST offset)
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Local midnight IST
      const startDateEpoch = today.getTime() - 19800000; // Subtract 5.5 hours to get UTC timestamp (15th Jan 18:30 UTC)

      data.body.CampaignDetails = {
        tenantId: tenantId,
        status: ["creating", "created"],
        isLikeSearch: true,
        isOverrideDatesFromProject: true,
        createdBy: Digit.UserService.getUser().info.uuid,
        campaignsIncludeDates: true,
        startDate: startDateEpoch,
        endDate: Digit.Utils.pt.convertDateToEpoch(new Date().toISOString().split("T")[0]),
        pagination: {
          sortBy: "createdTime",
          sortOrder: data?.state?.tableForm?.sortOrder || "desc",
          limit: limit,
          offset: offset,
        },
      };
      if (campaignName) {
        data.body.CampaignDetails.campaignName = campaignName;
      }
      if (campaignType) {
        data.body.CampaignDetails.projectType = campaignType?.[0]?.code;
      }
      delete data.body.custom;
      delete data.body.inbox;
      delete data.params;
      return data;
    },
    populateCampaignTypeReqCriteria: () => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const url = getMDMSUrl(true);
      return {
        url: `${url}/v1/_search`,
        params: { tenantId },
        body: {
          MdmsCriteria: {
            tenantId: tenantId,
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
        changeQueryName: "setWorkflowStatus",
        config: {
          enabled: true,
          select: (data) => {
            return data?.MdmsRes?.["HCM-PROJECT-TYPES"]?.projectTypes;
          },
        },
      };
    },
    additionalCustomizations: (row, key, column, value, searchResult) => { },
    getCustomActionLabel: (obj, row) => {
      return "";
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
  MyCampaignConfigCompleted: {
    preProcess: (data, additionalDetails) => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      data.body = { RequestInfo: data.body.RequestInfo };
      const { limit, offset } = data?.state?.tableForm || {};
      const { campaignName, campaignType } = data?.state?.searchForm || {};
      data.body.CampaignDetails = {
        tenantId: tenantId,
        status: ["creating", "created"],
        isLikeSearch: true,
        isOverrideDatesFromProject: true,
        endDate: Digit.Utils.pt.convertDateToEpoch(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]),
        createdBy: Digit.UserService.getUser().info.uuid,
        pagination: {
          sortBy: "createdTime",
          sortOrder: data?.state?.tableForm?.sortOrder || "desc",
          limit: limit,
          offset: offset,
        },
      };
      if (campaignName) {
        data.body.CampaignDetails.campaignName = campaignName;
      }
      if (campaignType) {
        data.body.CampaignDetails.projectType = campaignType?.[0]?.code;
      }
      delete data.body.custom;
      delete data.body.inbox;
      delete data.params;
      return data;
    },
    populateCampaignTypeReqCriteria: () => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const url = getMDMSUrl(true);
      return {
        url: `${url}/v1/_search`,
        params: { tenantId },
        body: {
          MdmsCriteria: {
            tenantId: tenantId,
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
        changeQueryName: "setWorkflowStatus",
        config: {
          enabled: true,
          select: (data) => {
            return data?.MdmsRes?.["HCM-PROJECT-TYPES"]?.projectTypes;
          },
        },
      };
    },
    additionalCustomizations: (row, key, column, value, searchResult) => { },
    getCustomActionLabel: (obj, row) => {
      return "";
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
  MyCampaignConfigUpcoming: {
    preProcess: (data, additionalDetails) => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      data.body = { RequestInfo: data.body.RequestInfo };
      const { limit, offset } = data?.state?.tableForm || {};
      const { campaignName, campaignType } = data?.state?.searchForm || {};

      // Convert tomorrow's date to GMT (subtract 5.5 hours for IST offset)
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      tomorrow.setHours(0, 0, 0, 0); // Local midnight IST
      const startDateEpoch = tomorrow.getTime() - 19800000; // Subtract 5.5 hours to get UTC timestamp

      data.body.CampaignDetails = {
        tenantId: tenantId,
        status: ["creating", "created"],
        isLikeSearch: true,
        isOverrideDatesFromProject: true,
        createdBy: Digit.UserService.getUser().info.uuid,
        campaignsIncludeDates: false,
        startDate: startDateEpoch,
        pagination: {
          sortBy: "createdTime",
          sortOrder: data?.state?.tableForm?.sortOrder || "desc",
          limit: limit,
          offset: offset,
        },
      };
      if (campaignName) {
        data.body.CampaignDetails.campaignName = campaignName;
      }
      if (campaignType) {
        data.body.CampaignDetails.projectType = campaignType?.[0]?.code;
      }
      delete data.body.custom;
      delete data.body.inbox;
      delete data.params;
      return data;
    },
    populateCampaignTypeReqCriteria: () => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const url = getMDMSUrl(true);
      return {
        url: `${url}/v1/_search`,
        params: { tenantId },
        body: {
          MdmsCriteria: {
            tenantId: tenantId,
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
        changeQueryName: "setWorkflowStatus",
        config: {
          enabled: true,
          select: (data) => {
            return data?.MdmsRes?.["HCM-PROJECT-TYPES"]?.projectTypes;
          },
        },
      };
    },
    additionalCustomizations: (row, key, column, value, searchResult) => { },
    getCustomActionLabel: (obj, row) => {
      return "";
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
  MyCampaignConfigDrafts: {
    preProcess: (data, additionalDetails) => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      data.body = { RequestInfo: data.body.RequestInfo };
      const { limit, offset } = data?.state?.tableForm || {};
      const { campaignName, campaignType } = data?.state?.searchForm || {};
      data.body.CampaignDetails = {
        tenantId: tenantId,
        status: ["drafted"],
        isLikeSearch: true,
        isOverrideDatesFromProject: true,
        createdBy: Digit.UserService.getUser().info.uuid,
        pagination: {
          sortBy: "createdTime",
          sortOrder: data?.state?.tableForm?.sortOrder || "desc",
          limit: limit,
          offset: offset,
        },
      };
      if (campaignName) {
        data.body.CampaignDetails.campaignName = campaignName;
      }
      if (campaignType) {
        data.body.CampaignDetails.projectType = campaignType?.[0]?.code;
      }
      delete data.body.custom;
      delete data.body.custom;
      delete data.body.inbox;
      delete data.params;
      return data;
    },
    populateCampaignTypeReqCriteria: () => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const url = getMDMSUrl(true);
      return {
        url: `${url}/v1/_search`,
        params: { tenantId },
        body: {
          MdmsCriteria: {
            tenantId: tenantId,
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
        changeQueryName: "setWorkflowStatus",
        config: {
          enabled: true,
          select: (data) => {
            return data?.MdmsRes?.["HCM-PROJECT-TYPES"]?.projectTypes;
          },
        },
      };
    },
    additionalCustomizations: (row, key, column, value, searchResult) => { },
    getCustomActionLabel: (obj, row) => {
      return "";
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
  MyCampaignConfigDraftsNew: {
    preProcess: (data, additionalDetails) => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      data.body = { RequestInfo: data.body.RequestInfo };
      const { limit, offset } = data?.state?.tableForm || {};
      const { campaignName, campaignType } = data?.state?.searchForm || {};
      data.body.CampaignDetails = {
        tenantId: tenantId,
        status: ["drafted"],
        isLikeSearch: true,
        isOverrideDatesFromProject: true,
        createdBy: Digit.UserService.getUser().info.uuid,
        pagination: {
          sortBy: "createdTime",
          sortOrder: data?.state?.tableForm?.sortOrder || "desc",
          limit: limit,
          offset: offset,
        },
      };
      if (campaignName) {
        data.body.CampaignDetails.campaignName = campaignName;
      }
      if (campaignType) {
        data.body.CampaignDetails.projectType = campaignType?.[0]?.code;
      }
      delete data.body.custom;
      delete data.body.custom;
      delete data.body.inbox;
      delete data.params;
      return data;
    },
    populateCampaignTypeReqCriteria: () => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const url = getMDMSUrl(true);
      return {
        url: `${url}/v1/_search`,
        params: { tenantId },
        body: {
          MdmsCriteria: {
            tenantId: tenantId,
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
        changeQueryName: "setWorkflowStatus",
        config: {
          enabled: true,
          select: (data) => {
            return data?.MdmsRes?.["HCM-PROJECT-TYPES"]?.projectTypes;
          },
        },
      };
    },
    additionalCustomizations: (row, key, column, value, searchResult) => { },
    getCustomActionLabel: (obj, row) => {
      return "";
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
  MyCampaignConfigFailed: {
    preProcess: (data, additionalDetails) => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      data.body = { RequestInfo: data.body.RequestInfo };
      const { limit, offset } = data?.state?.tableForm || {};
      const { campaignName, campaignType } = data?.state?.searchForm || {};
      data.body.CampaignDetails = {
        tenantId: tenantId,
        status: ["failed"],
        isLikeSearch: true,
        isOverrideDatesFromProject: true,
        createdBy: Digit.UserService.getUser().info.uuid,
        pagination: {
          sortBy: "createdTime",
          sortOrder: data?.state?.tableForm?.sortOrder || "desc",
          limit: limit,
          offset: offset,
        },
      };
      if (campaignName) {
        data.body.CampaignDetails.campaignName = campaignName;
      }
      if (campaignType) {
        data.body.CampaignDetails.projectType = campaignType?.[0]?.code;
      }
      delete data.body.custom;
      delete data.body.inbox;
      delete data.params;
      return data;
    },
    populateCampaignTypeReqCriteria: () => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const url = getMDMSUrl(true);
      return {
        url: `${url}/v1/_search`,
        params: { tenantId },
        body: {
          MdmsCriteria: {
            tenantId: tenantId,
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
        changeQueryName: "setWorkflowStatus",
        config: {
          enabled: true,
          select: (data) => {
            return data?.MdmsRes?.["HCM-PROJECT-TYPES"]?.projectTypes;
          },
        },
      };
    },
    additionalCustomizations: (row, key, column, value, searchResult) => { },
    getCustomActionLabel: (obj, row) => {
      return "";
    },
    onCardClick: (obj) => {
      // return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
    onCardActionClick: (obj) => {
      // return `view-test-results?tenantId=${obj?.apiResponse?.businessObject?.tenantId}&id=${obj?.apiResponse?.businessObject?.testId}&from=TQM_BREAD_INBOX`;
    },
    getCustomActionLabel: (obj, row) => {
      return "TQM_VIEW_TEST_DETAILS";
    },
  },

  // for attendee search
  AttendeeSearchInboxConfig: {
    preProcess: (data) => {


      // filterForm
      // params

      if (data.state.filterForm && Object.keys(data.state.filterForm).length > 0) {
        const updatedParams = {}; // Temporary object to store updates

        if (data.state.filterForm.roles?.code) {
          updatedParams.roles = data.state.filterForm.roles.code;
        }

        if (typeof data.state.filterForm.isActive === "object" && "code" in data.state.filterForm.isActive) {
          updatedParams.isActive = data.state.filterForm.isActive.code;
        }

        // Update `data.params` only if `updatedParams` has values
        if (Object.keys(updatedParams).length > 0) {
          data.params = { ...data.params, ...updatedParams };
        }
      }
      data.params.limit = data.state.tableForm.limit;
      data.params.offset = data.state.tableForm.offset;


      const { phone, names, codes } = data.state.searchForm;
      const boundaryCode = data.state.filterForm.AttendeeBoundaryComponent
        || Digit?.SessionStorage.get("selectedBoundary")?.code;

      const Individual = {};

      // Add mobileNumber if not empty
      if (phone && phone.trim() !== "") {
        Individual.mobileNumber = [phone];
      }

      // Add name if not empty
      if (names && names.trim() !== "") {
        Individual.name = { givenName: names };
      }

      // Add username if not empty
      if (codes && codes.trim() !== "") {
        Individual.username = [codes];
      }

      // Always add locality (since it has structure, but you can also check boundaryCode if required)
      if (boundaryCode && boundaryCode.trim() !== "") {

        Individual.boundaryCode = boundaryCode
      }

      // Assign back to data.body
      data.body.Individual = Individual;

      return data;
    },

    additionalCustomizations: (row, key, column, value, t, searchResult) => {

      const tenantId = Digit.ULBService.getCurrentTenantId();

      const [openPopUp, setOpenPopUp] = useState(false);
      const [isTag, setIsTag] = useState(false);

      const [toast, setToast] = useState(null);
      const [modalOpen, setModalOpen] = useState(false);
      const [sessionFormData, setSessionFormData] = useState({});
      const [refreshKey, setRefreshKey,] = useState(Date.now());
      const [selectedId, setSelectedId] = useState(null);
      const [loading, setLoading] = useState(false);
      const { mutate: createMapping } = Digit.Hooks.payments.useCreateAttendeeFromRegister(tenantId);
      const { registerNumber, boundaryCode, registerId, sessionType } = Digit.Hooks.useQueryParams();

      const [tag, setTag] = useState("");

      const handleToastClose = () => {
        setToast(null);
      };

      const handleCreate = async (id) => {
        setSelectedId(id);
        setLoading(true);


        await createMapping({
          "attendees": [
            tag == "" ?
              {
                registerId: registerId,
                individualId: row.id,
                enrollmentDate: enrolmentTimeWithSession(sessionType, new Date().getTime()),
                tenantId: row.tenantId,

              } : {
                registerId: registerId,
                individualId: row.id,
                enrollmentDate: enrolmentTimeWithSession(sessionType, new Date().getTime()),
                tenantId: row.tenantId,
                tag: tag
              }]
        },
          {
            onError: async (error) => {

              setLoading(false);
              setSelectedId(null);
              setTag("");

              setIsTag(false);
              setOpenPopUp(false);


              const errorMessage = error?.response?.data?.Errors?.[0]?.message
              setToast(
                { key: true, label: `${t(errorMessage)}`, type: "error" }

              );



            },
            onSuccess: async (responseData) => {
              setTag("");
              setLoading(false);
              setSelectedId(null);
              setIsTag(false);
              setOpenPopUp(false);


              setToast({ key: "success", label: `${t(`HCM_AM_NEW_EMPLOYEE`)} (${row.name.givenName || ""}) ${t(`HCM_AM_ENROLLED`)}`, transitionTime: 3000 });

              setTimeout(() => {
                window.history.back();
              }, 800);

            },
          }
        );
      }

      switch (key) {
        case "HCM_HR_EMP_MOBILE_LABEL":
          return value ? `${value}` : t("ES_COMMON_NA");

        case "HCM_HR_EMP_NAME_LABEL":
          return value ? `${value}` : t("ES_COMMON_NA");

        case "HCM_HR_ROLE_NO_LABEL":
          return value?.length > 0 ? value?.length : t("ES_COMMON_NA");

        case "HR_DESG_LABEL":
          return value ? t(`${value.designation}`) : t("ES_COMMON_NA");

        case "HR_EMPLOYMENT_DEPARTMENT_LABEL":
          return value ? t(`${value.department}`) : t("ES_COMMON_NA");

        case "HCM_HR_JURIDICTIONS_LABEL":
          return value ? t(value) : (
            t("ES_COMMON_NA")
          );
        case "HCM_ASSIGNMENT":

          if (loading && (row.id === selectedId)) {
            return <Loader />;
          }

          return <> <Button
            key={refreshKey}
            variation={"primary"}
            label={t("HCM_AM_ASSIGN_BT")}
            style={{ minWidth: "10rem" }}
            onButtonClick={() => {

              // handleCreate(row.id);

              setOpenPopUp(true);
              return;


            }}
          />
            {toast && (
              <Toast
                error={toast.key}
                isDleteBtn={true}
                label={t(toast.label)}
                onClose={handleToastClose}
                type={toast.type}
              />
            )}
            {
              openPopUp && <PopUp
                style={{ minWidth: "500px" }}
                onClose={() => {
                  setTag("");
                  setIsTag(false);
                  setOpenPopUp(false);
                }}
                heading={t("HCM_AM_ACTION_NEEDED_TEAM_CODE")}
                onOverlayClick={() => {
                  setTag("");
                  setIsTag(false);
                  setOpenPopUp(false);
                }}
                children={[
                  !isTag ?
                    <div>{t("HCM_AM_INFO_TAG_CODE_MSG")}</div>
                    : <div>
                      <span>{t("HCM_AM_TAG_LABEL")}</span>
                      <TextInput type="text" name="title" placeholder={t("HCM_AM_ENTER_TEAM_CODE")} value={tag} onChange={(e) => setTag(e.target.value)} />
                    </div>

                ]}
                footerChildren={[
                  <ButtonNew
                    type={"button"}
                    size={"large"}
                    variation={"primary"}
                    label={t(isTag ? "HCM_AM_CLOSE_BT" : "HCM_AM_ENTER_TAG")}
                    onClick={() => {
                      if (isTag) {
                        setTag("");
                        setOpenPopUp(false);
                        setIsTag(false);
                      } else {
                        setIsTag(true);
                      }
                      return;
                    }}
                  />,
                  <ButtonNew
                    type={"button"}
                    size={"large"}
                    variation={"primary"}
                    label={t("HCM_AM_ASSIGN_BT")}
                    onClick={() => {
                      handleCreate(row.id);
                      return;
                    }}
                  />,
                ]}
                sortFooterChildren={true}
              />
            }
          </>
        default:
          return t("ES_COMMON_NA");
      }
    },
  },
};