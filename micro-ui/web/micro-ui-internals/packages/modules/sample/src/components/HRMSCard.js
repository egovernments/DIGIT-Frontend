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
        label: t("HRMS Create"),
        link: `/${window?.contextPath}/employee/utilities/hrms-create`,
      },
      {
        label: t("HRMS Search"),
        link: `/${window?.contextPath}/employee/utilities/hrms-search`,
      },
      // {
      //   label: t("HRMS View Details"),
      //   link: `/${window?.contextPath}/employee/utilities/hrms-view`,
      // },
      
    ],
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default HRMSCard;