import React from "react";
import { Link } from "react-router-dom";
import { I18N_KEYS } from "../../utils/i18nKeyConstants";
import AssignButton from "../AssignButton";

export const UICustomizations = {
  AssignCampaignInboxConfig: {
    preProcess: (data) => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const searchForm = (data && data.state && data.state.searchForm) || {};
      const tableForm = (data && data.state && data.state.tableForm) || {};
      const jurisdictionProjects = (data && data.body && data.body.jurisdictionProjects) || [];
      const effectiveTenantId = (jurisdictionProjects[0] && jurisdictionProjects[0].tenantId) || tenantId;

      const searchParams = {};
      if (searchForm.projectType) searchParams.projectType = (searchForm.projectType && searchForm.projectType.code) || searchForm.projectType;
      if (searchForm.name) searchParams.name = searchForm.name;
      if (searchForm.projectNumber) searchParams.projectNumber = searchForm.projectNumber;
      if (searchForm.startDate) searchParams.startDate = searchForm.startDate;
      if (searchForm.endDate) searchParams.endDate = searchForm.endDate;

      const selectedBoundaryCode = searchForm.boundary && (searchForm.boundary.code || searchForm.boundary);
      let projects;
      if (selectedBoundaryCode) {
        projects = [{ tenantId: effectiveTenantId, address: { boundary: selectedBoundaryCode }, ...searchParams }];
      } else if (jurisdictionProjects.length > 0) {
        projects = jurisdictionProjects.map((j) => ({
          tenantId: j.tenantId || effectiveTenantId,
          address: j.address,
          ...searchParams,
        }));
      } else {
        projects = [{ tenantId: effectiveTenantId, ...searchParams }];
      }

      const requestParam = {
        tenantId: effectiveTenantId,
        limit: tableForm.limit || 10,
        offset: tableForm.offset || 0,
      };

      const requestBody = {
        Projects: projects,
        tenantId: effectiveTenantId,
        apiOperation: "SEARCH",
      };

      return { ...data, body: requestBody, params: requestParam, changeQueryName: JSON.stringify({ projects, tableForm }) };
    },

    additionalCustomizations: (row, key, column, value, t) => {
      switch (key) {
        case "PROJECT_TYPE":
          return value ? <span>{t(value)}</span> : <span>{t("CORE_COMMON_NA")}</span>;
        case "PROJECT_BOUNDARY_TYPE": {
          const hierarchy = Digit.SessionStorage.get("HIERARCHY_TYPE_SELECTED");
          const hierarchyType = (hierarchy && hierarchy.hierarchyType) || "";
          return value ? <span>{t(hierarchyType + "_" + value)}</span> : <span>{t("CORE_COMMON_NA")}</span>;
        }
        case "PROJECT_BOUNDARY":
          return value ? <span>{t(value)}</span> : <span>{t("CORE_COMMON_NA")}</span>;
        case "ASSIGNMENT":
          return <AssignButton row={row} t={t} />;
        default:
          return null;
      }
    },
  },

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
              {row?.code || t(I18N_KEYS.COMMON.CORE_COMMON_NA)}
            </Link>
          );

        case "HR_EMP_NAME_LABEL":
          return row?.user?.name || t(I18N_KEYS.COMMON.CORE_COMMON_NA);

        case "HR_ROLE_NO_LABEL":
          return row?.user?.roles?.length ?? 0;

        case "HR_JURIDICTIONS_LABEL": {
          const codes = row?.jurisdictions?.map((j) => j?.boundary).filter(Boolean);
          return codes?.length ? codes.join(", ") : t(I18N_KEYS.COMMON.CORE_COMMON_NA);
        }

        case "HR_DESG_LABEL":
          return row?.assignments?.[0]?.designation
            ? t(`COMMON_MASTERS_DESIGNATION_${row.assignments[0].designation}`)
            : t(I18N_KEYS.COMMON.CORE_COMMON_NA);

        case "HR_EMPLOYMENT_DEPARTMENT_LABEL":
          return row?.assignments?.[0]?.department
            ? t(`COMMON_MASTERS_DEPARTMENT_${row.assignments[0].department}`)
            : t(I18N_KEYS.COMMON.CORE_COMMON_NA);

        default:
          return null;
      }
    },
  },
};
