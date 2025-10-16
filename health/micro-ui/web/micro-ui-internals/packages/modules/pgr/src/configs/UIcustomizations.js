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
        const toDate = new Date(requestDate.endDate).getTime();

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

      if(data?.state?.filterForm){
        window.Digit.SessionStorage.set("filtersForInbox",data?.state?.filterForm); 
      }

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
          localityArray = rawLocality.map((loc) => loc?.code).filter(Boolean);
        } else if (rawLocality.code) {
          localityArray = [rawLocality.code];
        }
      }

      if (localityArray.length > 0) {
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
              <span>{t(`SERVICEDEFS.${row?.businessObject?.service?.serviceCode.toUpperCase()}`)}</span>
            </div>
          );

        case "WF_INBOX_HEADER_LOCALITY":
          return value ? <span>{t(`${value}`)}</span> : <span>{t("NA")}</span>;

        case "CS_COMPLAINT_DETAILS_CURRENT_STATUS":
          return value && value?.length>0
            ? <span>{t(`WF_INBOX_${value}`)}</span>: <span>{t("NA")}</span>;

        case "WF_INBOX_HEADER_CURRENT_OWNER":
          return value ? <span>{value?.[0]?.name}</span> : <span>{t("NA")}</span>;

        case "WF_INBOX_HEADER_CREATED_DATE":
          return value > 0 ? (
            <Tag label={new Date(value).toLocaleDateString()} showIcon={false} type="success" />
          ) : (
            <Tag label={new Date(value).toLocaleDateString()} showIcon={false} type="error" />
          );
        default:
          return t("ES_COMMON_NA");
      }
    },
  }

}
