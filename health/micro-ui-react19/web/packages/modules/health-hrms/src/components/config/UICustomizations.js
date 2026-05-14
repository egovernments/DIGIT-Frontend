import React from "react";
import { Link } from "react-router-dom";

export const UICustomizations = {
  HRMSInboxConfig: {
    preProcess: (data) => {
      const requestParam = { ...(data?.requestParam || {}) };

      if (requestParam.isActive && typeof requestParam.isActive === "object") {
        requestParam.isActive = requestParam.isActive.code;
      }

      if (requestParam.roles && typeof requestParam.roles === "object" && !Array.isArray(requestParam.roles)) {
        requestParam.roles = requestParam.roles.code;
      }

      Object.keys(requestParam).forEach((key) => {
        if (requestParam[key] === "" || requestParam[key] === null || requestParam[key] === undefined) {
          delete requestParam[key];
        }
      });

      return { ...data, requestParam };
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
