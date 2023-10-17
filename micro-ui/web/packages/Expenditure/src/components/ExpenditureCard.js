import { EmployeeModuleCard, DocumentIconSolid } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const ExpenditureCard = () => {
  // if (!Digit.Utils.wsAccess()) {
  //   return null;
  // }
  const { t } = useTranslation();

  // let links = [
  //   {
  //     label: t("WS_APPLY_NEW_CONNECTION_HOME_CARD_LABEL"),
  //     link: `/${window?.contextPath}/employee/ws/create-application`,
  //     roles: ["WS_CEMP", "SW_CEMP"],
  //   },
  // ];

  // links = links.filter((link) => (link.roles ? checkForEmployee(link.roles) : true));

  const propsForModuleCard = {
    Icon: <DocumentIconSolid />,
    moduleName: t("ACTION_TEST_BILLS"),
    kpis: [
      {
        //Pass Count Value from Inbox API here
        count: 21,
        label: t("WORKS_INBOX"),
        link: `/${window?.contextPath}/employee/expenditure/billinbox`,
      }
    ],
    links: [
      {
        label: t("ES_COMMON_INBOX"),
        link: `/${window?.contextPath}/employee/expenditure/billinbox`,
        roles: ["EST_CREATOR", "EST_CHECKER", "EST_TECH_SANC", "EST_FIN_SANC", "EMPLOYEE"],
      },
      {
        label: t("WORKS_SEARCH_BILLS"),
        link: `/${window?.contextPath}/employee/expenditure/search`,
        roles: ["EST_CREATOR", "EST_CHECKER", "EST_TECH_SANC", "EST_FIN_SANC", "EMPLOYEE"],
      },
      {
        label: t("WORKS_EXP_CREATE"),
        link: `/${window?.contextPath}/employee/contracts/search-contract`,
        roles: ["EST_CREATOR", "EST_CHECKER", "EST_TECH_SANC", "EST_FIN_SANC", "EMPLOYEE"],
      },
      {
        label: t("COMMON_VIEW_BILLS"),
        link: `/${window?.contextPath}/employee/expenditure/view-bills/menu`,
        roles: ["EST_CREATOR", "EST_CHECKER", "EST_TECH_SANC", "EST_FIN_SANC", "EMPLOYEE"],
      }
    ],
  };
  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default ExpenditureCard;