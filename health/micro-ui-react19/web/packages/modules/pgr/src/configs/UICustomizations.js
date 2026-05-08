import { Link } from "react-router-dom";
import { Tag } from "@egovernments/digit-ui-components";

// Middleware functions called as Digit?.Customizations?.[masterName]?.[moduleName]
// Functions receive search/table data and transform it before rendering.

const businessServiceMap = {
  "muster roll": "MR",
};

export const UICustomizations = {
  businessServiceMap,

  PGRInboxConfig: {
    preProcess: (data) => {
      data.body.inbox.tenantId = Digit.ULBService.getCurrentTenantId();
      data.body.inbox.processSearchCriteria.tenantId = Digit.ULBService.getCurrentTenantId().split(".")[0];

      if (data?.body?.inbox?.moduleSearchCriteria?.mobileNumber) {
        delete data.body.inbox.moduleSearchCriteria.mobileNumber;
      }

      const assignee = data.body.inbox.moduleSearchCriteria.assignee;
      delete data.body.inbox.moduleSearchCriteria.assignee;
      if (assignee?.code === "ASSIGNED_TO_ME") {
        data.body.inbox.moduleSearchCriteria.assignee = Digit.UserService.getUser().info.uuid;
      }

      let area = data.body.inbox.moduleSearchCriteria.area ? [...data.body.inbox.moduleSearchCriteria.area] : [];
      let statuses = data.body.inbox.moduleSearchCriteria.status ? { ...data.body.inbox.moduleSearchCriteria.status } : {};
      delete data.body.inbox.moduleSearchCriteria.area;
      delete data.body.inbox.moduleSearchCriteria.status;

      area = area.map((row) => row?.code);
      statuses = Object.keys(statuses).filter((key) => statuses[key]);

      if (area.length > 0) data.body.inbox.moduleSearchCriteria.area = area;
      if (statuses.length > 0) data.body.inbox.moduleSearchCriteria.status = statuses;

      return data;
    },

    additionalCustomizations: (row, key, column, value, t) => {
      switch (key) {
        case "CS_COMMON_COMPLAINT_NO":
          return (
            <div style={{ display: "grid" }}>
              <span className="link" style={{ display: "grid" }}>
                <Link to={`/${window.contextPath}/employee/pgr/complaint/details/${value}`}>
                  {value ? (column.translate ? t(column.prefix ? `${column.prefix}${value}` : value) : value) : t("ES_COMMON_NA")}
                </Link>
              </span>
              <span>{t(`SERVICEDEFS.${row?.businessObject?.service?.serviceCode?.toUpperCase()}`)}</span>
            </div>
          );

        case "WF_INBOX_HEADER_LOCALITY":
          return value ? (
            <span>{t(`${Digit.Utils.locale.getTransformedLocale(row?.ProcessInstance?.tenantId)}_ADMIN_${value}`)}</span>
          ) : (
            <span>{t("NA")}</span>
          );

        case "CS_COMPLAINT_DETAILS_CURRENT_STATUS":
          return <span>{t(`CS_COMMON_${value}`)}</span>;

        case "WF_INBOX_HEADER_CURRENT_OWNER":
          return value ? <span>{value?.[0]?.name}</span> : <span>{t("NA")}</span>;

        case "WF_INBOX_HEADER_SLA_DAYS_REMAINING":
          return value > 0 ? (
            <Tag label={String(value)} showIcon={false} type="success" />
          ) : (
            <Tag label={String(value)} showIcon={false} type="error" />
          );

        default:
          return t("ES_COMMON_NA");
      }
    },

    populateLocalityReqCriteria: () => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      return {
        url: "/egov-location/location/v11/boundarys/_search",
        params: { tenantId, hierarchyTypeCode: "ADMIN", boundaryType: "Locality" },
        body: {},
        config: {
          enabled: true,
          select: (data) => data,
        },
      };
    },
  },
};
