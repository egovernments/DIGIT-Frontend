import React from "react";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard } from "@egovernments/digit-ui-react-components";

const EngagementCard = () => {
  const { t } = useTranslation();

  const links = [
    {
      label: t("Engagement"),
      link: "https://sdc-uat.lgpunjab.gov.in/employee/engagement/surveys/inbox",
    },
  ];

  const propsForModuleCard = {
    Icon: "SurveyIconSolid",
    moduleName: t("Engagement"),
    links: links,
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default EngagementCard;
