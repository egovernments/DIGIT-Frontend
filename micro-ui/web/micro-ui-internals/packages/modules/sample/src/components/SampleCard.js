import {  EmployeeModuleCard } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const SampleCard = () => {
 
  const { t } = useTranslation();

  const propsForModuleCard = {
    Icon: "BeenHere",
    moduleName: t("ABG_COMMON_TABLE_COL_ACTION"),
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