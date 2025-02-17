import { HRIcon, EmployeeModuleCard, AttendanceIcon, PropertyHouse } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const HRMSCard = () => {
 
  const { t } = useTranslation();

  const propsForModuleCard = {
    Icon: "AccountBox",
    moduleName: t("Employee"),
    kpis: [

    ],
    links: [
      {
        label: t("Individual Create"),
        link: `/${window?.contextPath}/employee/sample/create-individual`,
      },
      {
        label: t("Individual Search"),
        link: `/${window?.contextPath}/employee/sample/sample-search`,
      },
      {
        label: t("Individual View Details"),
        link: `/${window?.contextPath}/employee/sample/individual-details-view`,
      },
      
    ],
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default HRMSCard;