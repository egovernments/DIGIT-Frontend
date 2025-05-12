import {  EmployeeModuleCard } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import AssignmentCreate from "../pages/employee/AssignmentCreate";

const AssignmentCard = () => {
 
  const { t } = useTranslation();

  const propsForModuleCard = {
    Icon: "BeenHere",
    moduleName: t("ABG_COMMON_TABLE_COL_ACTION"),
    kpis: [

    ],
    links: [
      {
        label: t("create"),
        link: `/${window?.contextPath}/employee/utilities/assignment-create`,
      },
      {
        label: t("search"),
        link: `/${window?.contextPath}/employee/utilities/assignment-searchs`,
      },
      {
        label: t("view"),
        link: `/${window?.contextPath}/employee/utilities/assignment-view`,
      },
  
    ],
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default AssignmentCard;