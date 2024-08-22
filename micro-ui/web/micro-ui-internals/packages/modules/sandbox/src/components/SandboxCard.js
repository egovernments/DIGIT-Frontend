import { EmployeeModuleCard, PropertyHouse } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const SandboxCard = () => {
  const { t } = useTranslation();

  const propsForModuleCard = {
    Icon: <PropertyHouse />,
    moduleName: t("Sandbox"),
    kpis: [],
    links: [
      {
        label: t("SANDBOX_TENANT_CREATE"),
        link: `/${window?.contextPath}/employee/sandbox/tenant-management/create`,
      },
      {
        label: t("SANDBOX_TENANT_SEARCH"),
        link: `/${window?.contextPath}/employee/sandbox/tenant-management/search`,
      },
      {
        label: t("Application Management"),
        link: `/${window?.contextPath}/employee/sandbox/application-management`,
      }
    ],
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default SandboxCard;