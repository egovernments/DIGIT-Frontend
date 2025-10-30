import React from "react";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard } from "@egovernments/digit-ui-react-components";

const EngagementCard = () => {
  const { t } = useTranslation();

  const links = [
    {
      label: t("ENGAGEMENT"),
      link: "https://sdc-uat.lgpunjab.gov.in/employee/engagement/surveys/inbox",
      hyperlink:true
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
