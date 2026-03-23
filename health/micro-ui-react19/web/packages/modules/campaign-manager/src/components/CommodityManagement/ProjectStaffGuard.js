import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Loader, SVG } from "@egovernments/digit-ui-components";
import getProjectServiceUrl from "../../utils/getProjectServiceUrl";

const ProjectStaffGuard = ({ children }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const user = Digit.SessionStorage.get("User");

  const staffSearchCriteria = useMemo(() => ({
    url: `${getProjectServiceUrl()}/staff/v1/_search`,
    params: { tenantId, offset: 0, limit: 100 },
    body: { ProjectStaff: { staffId: [user?.info?.uuid] } },
    config: {
      enabled: !!user?.info?.uuid,
      select: (data) => data?.ProjectStaff,
    },
  }), [tenantId, user?.info?.uuid]);

  const { isLoading, data: projectStaff } = Digit.Hooks.useCustomAPIHook(staffSearchCriteria);

  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  if (!projectStaff || projectStaff.length === 0) {
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

  return children;
};

export default ProjectStaffGuard;
