import { HRIcon, EmployeeModuleCard, AttendanceIcon, PropertyHouse } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const ServiceDesignerCard = () => {
 
  const { t } = useTranslation();
  const user = Digit.UserService.getUser();
  const userRoles = user?.info?.roles?.map((e) => e.code);
  const isAccessible = userRoles?.some((role) => role?.includes("STUDIO_DESIGNER"))


  //To show the card at main page
  const propsForModuleCard = {
    Icon: "BeenHere",
    moduleName: t("SERVICE_DESIGNER_HEADER"),
    kpis: [

    ],
    links: [
      {
        label: t("SERVICE_DESIGNER_LANDING"),
        link: `/${window?.contextPath}/employee/servicedesigner/LandingPage`,
      },
      // {
      //   label: t("SERVICE_DESIGNER_WORKFLOW"),
      //   link: `/${window?.contextPath}/employee/servicedesigner/Workflow`,
      // },
      // {
      //   label: t("SERVICE_DESIGNER_CHECKLIST"),
      //   link: `/${window?.contextPath}/employee/servicedesigner/Checklist`,
      // },
      // {
      //   label: t("SERVICE_DESIGNER_ROLES"),
      //   link: `/${window?.contextPath}/employee/servicedesigner/Roles`,
      // },
    ],
  };

  //employee module card categorization
  return  isAccessible ? <EmployeeModuleCard {...propsForModuleCard} /> : null;
};

export default ServiceDesignerCard;