import { HRIcon, EmployeeModuleCard } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const HRMSCard = () => {
  const ADMIN = Digit.Utils.hrmsAccess();
  if (!ADMIN) {
    return null;
  }
  const { t } = useTranslation();
 
  const propsForModuleCard = {
    Icon: 'SupervisorAccount',
    moduleName: t("ACTION_TEST_9HRMS"),
    kpis: [

    ],
    links: [
      {
        label: t("HR_HOME_SEARCH_RESULTS_HEADING"),
        link: `/${window?.contextPath}/employee/hrms/inbox`,
      },
      {
        label: t("HR_COMMON_CREATE_EMPLOYEE_HEADER"),
        link: `/${window?.contextPath}/employee/hrms/create`,
      },
    ],
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default HRMSCard;
