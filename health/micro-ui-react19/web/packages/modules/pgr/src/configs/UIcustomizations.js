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
  }

}
