import {  EmployeeModuleCard, PropertyHouse } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const SubmissionsCard = () => {
 
  const { t } = useTranslation();

  const propsForModuleCard = {
    Icon: <PropertyHouse />,
    moduleName: t("Submissions"),
    kpis: [

    ],
    links: [
   
      {
        label: t("Submissions  Search"),
        link: `/${window?.contextPath}/employee/submissions/submissions-search`,

      },
      {
        label: t("Submissions  Create"),
        link: `/${window?.contextPath}/employee/submissions/submissions-create`,

      },
    
      {
        label: t("Submissions Response"),
        link: `/${window?.contextPath}/employee/submissions/submissions-response`,

      },
      
    ],
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default SubmissionsCard;