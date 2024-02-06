import React from "react";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard, PTIcon } from "@egovernments/digit-ui-react-components";

const ProjectCard = () => {
  const { t } = useTranslation();

  const propsForModuleCard = {
    Icon: <PTIcon />,
    moduleName: t("WORKS_PROJECT"),
    kpis: [],
    links: [
      {
        label: t("WORKS_CREATE_PROJECT"),
        link: `/${window?.contextPath}/employee/project/create-project`,
        roles: [],
      },
      {
        label: t("WORKS_PROJECT_DETAILS"),
        link: `/${window?.contextPath}/employee/project/project-details`,
      },
      {
        label: t("WORKS_KICKOFF_CHECKLIST"),
        link: `/${window?.contextPath}/employee/works/checklist`,
        roles: ["WS_CEMP", "WS_APPROVER", "WS_FIELD_INSPECTOR", "WS_DOC_VERIFIER", "WS_CLERK"],
        count: 21,
      },
      {
        label: t("ACTION_TEST_VIEW_WORK_ORDER"),
        link: `/${window?.contextPath}/employee/works/checklist`,
        roles: ["EST_CREATOR", "EST_CHECKER", "EST_TECH_SANC", "EST_FIN_SANC", "EMPLOYEE"],
      },
      {
        label: t("WORKS_CHECKLIST_INBOX"),
        link: `/${window?.contextPath}/employee/works/checklistinbox`,
        roles: ["WS_CEMP", "WS_APPROVER", "WS_FIELD_INSPECTOR", "WS_DOC_VERIFIER", "WS_CLERK"],
      },
      {
        label: t("WORKS_PROJECT_CLOSURE"),
        link: `/${window?.contextPath}/employee/works/projectclosure`,
        roles: [],
      },
    ],
  };
  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default ProjectCard;
