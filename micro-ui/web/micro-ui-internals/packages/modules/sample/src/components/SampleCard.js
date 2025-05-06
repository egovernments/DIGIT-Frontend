import {  EmployeeModuleCard } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const SampleCard = () => {
 
  const { t } = useTranslation();

  const propsForModuleCard = {
    Icon: "BeenHere",
    moduleName: t("Sample"),
    kpis: [

    ],
    links: [
      {
        label: t("Demo"),
        link: `/${window?.contextPath}/employee/utilities/demo`,
      },
  
    ],
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default SampleCard;