import React from "react";
import { Link } from "react-router-dom";

export const UICustomizations = {
  HRMSInboxConfig: {
    preProcess: (data) => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const searchForm = data?.state?.searchForm || {};
      const filterForm = data?.state?.filterForm || {};
      const tableForm = data?.state?.tableForm || {};

      const requestParam = {
        tenantId,
        limit: tableForm.limit ?? 10,
        offset: tableForm.offset ?? 0,
        sortBy: "lastModifiedTime",
        sortOrder: "DESC",
      };

      if (searchForm.names) requestParam.names = searchForm.names;
      if (searchForm.codes) requestParam.codes = searchForm.codes;
      if (searchForm.phone) requestParam.phone = searchForm.phone;

      const isActive = filterForm.isActive;
      if (isActive !== null && isActive !== undefined && isActive !== "") {
        requestParam.isActive = typeof isActive === "object" ? isActive.code : isActive;
      }

      const roles = filterForm.roles;
      if (roles && !(Array.isArray(roles) && roles.length === 0) && roles !== "") {
        if (Array.isArray(roles)) {
          requestParam.roles = roles.map((r) => (typeof r === "object" ? r.code : r)).join(",");
        } else if (typeof roles === "object") {
          requestParam.roles = roles.code;
        } else {
          requestParam.roles = roles;
        }
      }

      // params = GET query string; changeQueryName forces React Query key to change (body is always {} for HRMS GET)
      return { ...data, params: requestParam, changeQueryName: JSON.stringify(requestParam) };
    },

    additionalCustomizations: (row, key, column, value, t) => {
      switch (key) {
        case "HR_EMP_ID_LABEL":
          return (
            <Link
              to={`/${window?.contextPath}/employee/hrms/details/${row?.code}`}
              style={{ color: "#C84C0E", textDecoration: "underline" }}
            >
              {row?.code || t("CORE_COMMON_NA")}
            </Link>
          );

        case "HR_EMP_NAME_LABEL":
          return row?.user?.name || t("CORE_COMMON_NA");

        case "HR_ROLE_NO_LABEL":
          return row?.user?.roles?.length ?? 0;

        case "HR_JURIDICTIONS_LABEL": {
          const codes = row?.jurisdictions?.map((j) => j?.boundary).filter(Boolean);
          return codes?.length ? codes.join(", ") : t("CORE_COMMON_NA");
        }

        case "HR_DESG_LABEL":
          return row?.assignments?.[0]?.designation
            ? t(`COMMON_MASTERS_DESIGNATION_${row.assignments[0].designation}`)
            : t("CORE_COMMON_NA");

        case "HR_EMPLOYMENT_DEPARTMENT_LABEL":
          return row?.assignments?.[0]?.department
            ? t(`COMMON_MASTERS_DEPARTMENT_${row.assignments[0].department}`)
            : t("CORE_COMMON_NA");

        default:
          return null;
      }
    },
  },
};
