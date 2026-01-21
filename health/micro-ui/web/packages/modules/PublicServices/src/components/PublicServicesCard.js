import { HRIcon, EmployeeModuleCard, AttendanceIcon, PropertyHouse } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const PublicServicesCard = () => {
 
  const { t } = useTranslation();
  const user = Digit.UserService.getUser();
  const userRoles = user?.info?.roles?.map((e) => e.code) || [];
  const restrictedRoles = ["HRMS_ADMIN", "MDMS_ADMIN", "LOC_ADMIN"];

  const isAccessible = !(
    userRoles.length > 0 &&
    userRoles.every((r) => restrictedRoles.includes(r))
  );

  //To show the card at main page
  const propsForModuleCard = {
    Icon: "BeenHere",
    moduleName: t("DIGIT_STUDIO"),
    kpis: [

    ],
    links: [
      {
        label: t("DIGIT_STUDIO_APPLY"),
        link: `/${window?.contextPath}/employee/publicservices/modules?selectedPath=Apply`,
      },
    ],
  };

  //employee module card categorization
  return isAccessible ? <EmployeeModuleCard {...propsForModuleCard} /> : null;
  //return null
};

export default PublicServicesCard;