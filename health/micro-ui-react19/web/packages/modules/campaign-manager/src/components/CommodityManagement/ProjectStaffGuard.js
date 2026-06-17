import React from "react";
import { useTranslation } from "react-i18next";
import { Loader, SVG } from "@egovernments/digit-ui-components";
import { CommodityProjectProvider, useCommodityProject } from "./CommodityProjectContext";

const ProjectStaffGuardInner = ({ children }) => {
  const { t } = useTranslation();
  const { isLoading, hasStaff, isAuthorizedForCommodity } = useCommodityProject();

  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  if (!hasStaff) {
    return (
      <div
        className="digit-no-data-found"
        style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}
      >
        <SVG.NoResultsFoundIcon height={262} width={336} />
        <span className="digit-error-msg">{t("HCM_NO_CAMPAIGNS_ASSIGNED")}</span>
      </div>
    );
  }

  if (!isAuthorizedForCommodity) {
    return (
      <div
        style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}
      >
        <SVG.NoResultsFoundIcon height={262} width={336} />
        <span className="digit-error-msg">{t("HCM_NOT_AUTHORIZED_COMMODITY")}</span>
        <span style={{ marginTop: "8px", color: "#505A5F", textAlign: "center" }}>
          {t("HCM_CONTACT_ADMIN_USE_MOBILE_APP")}
        </span>
      </div>
    );
  }

  return children;
};

const ProjectStaffGuard = ({ children }) => {
  return (
    <CommodityProjectProvider>
      <ProjectStaffGuardInner>{children}</ProjectStaffGuardInner>
    </CommodityProjectProvider>
  );
};

export default ProjectStaffGuard;
