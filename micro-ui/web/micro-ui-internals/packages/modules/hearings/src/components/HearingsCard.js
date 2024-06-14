import {  EmployeeModuleCard, PropertyHouse } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const HearingsCard = () => {
 
  const { t } = useTranslation();

  const propsForModuleCard = {
    Icon: <PropertyHouse />,
    moduleName: t("Hearings"),
    kpis: [

    ],
    links: [
   
      {
        label: t("Hearings  Search"),
        link: `/${window?.contextPath}/employee/hearings/hearings-search`,

      },
      {
        label: t("Hearings  Create"),
        link: `/${window?.contextPath}/employee/hearings/hearings-create`,

      },
    
      {
        label: t("Hearings Response"),
        link: `/${window?.contextPath}/employee/hearings/hearings-response`,

      },
      {
        label: t("Inside Hearing"),
        link: `/${window?.contextPath}/employee/hearings/inside-hearing`,

      }
      
    ],
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default HearingsCard;