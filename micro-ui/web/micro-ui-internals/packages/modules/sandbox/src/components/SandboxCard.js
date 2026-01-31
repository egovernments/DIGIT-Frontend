import { EmployeeModuleCard, PropertyHouse } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const SandboxCard = () => {
  const { t } = useTranslation();

  const ROLES = {
    SUPERUSER: ["SUPERUSER"],
  };

  if (!Digit.Utils.sandboxAccess()) {
    return null;
  }
  const propsForModuleCard = {
    Icon: <PropertyHouse />,
    moduleName: t("SANDBOX_CARD_HEADER"),
    kpis: [],
    links: [
      {
        label: t("SANDBOX_TENANT_CREATE_HOMECARD_LABEL"),
        link: `/${window?.contextPath}/employee/sandbox/tenant-management/create`,
        roles: ROLES.SUPERUSER,
      },
      {
        label: t("SANDBOX_TENANT_SEARCH_HOMECARD_LABEL"),
        link: `/${window?.contextPath}/employee/sandbox/tenant-management/search`,
        roles: ROLES.SUPERUSER,
      },
      // {
      //   label: t("SANDBOX_APPLICATION_MANAGEMENT_HOMECARD_LABEL"),
      //   link: `/${window?.contextPath}/employee/sandbox/application-management/home`,
      //   roles: ROLES.SUPERUSER,
      // },
    ],
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default SandboxCard;
