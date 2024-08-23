import { EmployeeModuleCard, PropertyHouse } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const SandboxCard = () => {
  const { t } = useTranslation();

  const propsForModuleCard = {
    Icon: <PropertyHouse />,
    moduleName: t("SANDBOX_CARD_HEADER"),
    kpis: [],
    links: [
      {
        label: t("SANDBOX_TENANT_CREATE_HOMECARD_LABEL"),
        link: `/${window?.contextPath}/employee/sandbox/tenant-management/create`,
      },
      {
        label: t("SANDBOX_TENANT_SEARCH_HOMECARD_LABEL"),
        link: `/${window?.contextPath}/employee/sandbox/tenant-management/search`,
      },
      {
        label: t("SANDBOX_APPLICATION_MANAGEMENT_HOMECARD_LABEL"),
        link: `/${window?.contextPath}/employee/sandbox/application-management/home`,
      },
    ],
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default SandboxCard;
