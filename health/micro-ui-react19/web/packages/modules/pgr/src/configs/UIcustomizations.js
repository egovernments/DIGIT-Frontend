import React from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import { Tag} from "@egovernments/digit-ui-components";

//create functions here based on module name set in mdms(eg->SearchProjectConfig)
//how to call these -> Digit?.Customizations?.[masterName]?.[moduleName]
// these functions will act as middlewares
// var Digit = window.Digit || {};



export const UICustomizations = {
 

  PGRInboxConfig: {
    preProcess: (data) => {
      const tenantId = Digit.ULBService.getCurrentTenantId() || Digit.ULBService.getStateId();
      const stateTenantId = tenantId?.split(".")[0];
      const tableForm = data?.state?.tableForm || {};
      const searchForm = data?.state?.searchForm || {};
      const filterForm = data?.state?.filterForm || {};

      // Build moduleSearchCriteria fresh — never mutate the static config body reference.
      // useCustomAPIHook keys on useMemo(() => JSON.stringify(body), [body]) by reference,
      // so we must replace data.body with a new object each call to trigger recomputation.
      const moduleSearchCriteria = {};

      // Search form
      if (searchForm.complaintNumber) moduleSearchCriteria.complaintNumber = searchForm.complaintNumber;
      if (searchForm.mobileNumber) moduleSearchCriteria.mobileNumber = searchForm.mobileNumber;

      const requestDate = searchForm.range?.requestDate;
      if (requestDate?.startDate && requestDate?.endDate) {
        moduleSearchCriteria.fromDate = new Date(requestDate.startDate).getTime();
        moduleSearchCriteria.toDate = new Date(new Date(requestDate.endDate).setHours(23, 59, 59, 999)).getTime();
      }

      // Filter: assignedToMe
      if (filterForm.assignedToMe?.code === "ASSIGNED_TO_ME") {
        moduleSearchCriteria.assignedToMe = Digit.UserService.getUser().info.uuid;
      }

      // Filter: serviceCode → complaintType
      if (filterForm.serviceCode?.serviceCode) {
        moduleSearchCriteria.complaintType = filterForm.serviceCode.serviceCode;
      }

      // Filter: locality
      let rawLocality = filterForm.locality;
      let localityArray = [];
      if (rawLocality) {
        if (Array.isArray(rawLocality)) {
          localityArray = rawLocality.map((loc) => {
            const code = loc?.code;
            if (code && typeof code === "string" && code.includes(".")) {
              const segments = code.split(".");
              return segments[segments.length - 1] || null;
            }
            return code || null;
          }).filter(Boolean);
        } else if (rawLocality?.code) {
          const code = rawLocality.code;
          if (code && typeof code === "string") {
            if (code.includes(".")) {
              const segments = code.split(".");
              const lastSegment = segments[segments.length - 1];
              if (lastSegment) localityArray = [lastSegment];
            } else {
              localityArray = [code];
            }
          }
        }
      }
      if (localityArray.length > 0) moduleSearchCriteria.area = localityArray;

      // Filter: status
      const rawStatuses = filterForm.status || {};
      const statuses = Object.keys(rawStatuses).filter((key) => rawStatuses[key] === true);
      if (statuses.length > 0) moduleSearchCriteria.status = statuses;

      // Replace body with a new object so useCustomAPIHook detects the reference change
      data.body = {
        inbox: {
          tenantId: stateTenantId,
          processSearchCriteria: {
            ...data.body.inbox.processSearchCriteria,
            tenantId: stateTenantId,
          },
          moduleSearchCriteria,
          limit: tableForm.limit,
          offset: tableForm.offset,
        },
      };

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
  }

}
