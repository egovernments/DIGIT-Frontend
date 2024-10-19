import { EmployeeModuleCard, SVG } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const ROLES = {
  MICROPLAN: ["MICROPLAN_ADMIN"],
  SUPERVISOR:[
    "PLAN_ESTIMATION_APPROVER",
    "ROOT_PLAN_ESTIMATION_APPROVER",
    "POPULATION_DATA_APPROVER",
    "ROOT_POPULATION_DATA_APPROVER",
    "FACILITY_CATCHMENT_MAPPER",
    "ROOT_FACILITY_CATCHMENT_MAPPER",
    "MICROPLAN_VIEWER"
  ]
};

const MicroplanCard = () => {
  const { t } = useTranslation();

  const generateLink = (labelKey, pathSuffix,roles=ROLES.MICROPLAN) => {
    return {
      label: t(labelKey),
      link: `/${window?.contextPath}/employee/microplan/${pathSuffix}`,
      roles: roles,
    };
  };

  let links = [
    generateLink("SETUP_MICROPLAN","setup-microplan"),
    generateLink("SEARCH_MICROPLANS","microplan-search"),
    generateLink("USER_MANAGEMENT","user-management"),
    generateLink("MY_MICROPLANS","my-microplans",ROLES.SUPERVISOR),
  ];
  links = links.filter((link) => (link?.roles && link?.roles?.length > 0 ? Digit.Utils.didEmployeeHasAtleastOneRole(link?.roles) : true));

  const propsForModuleCard = {
    Icon: <SVG.UpdateExpense fill="white"  height="50" width="50" />,
    moduleName: t("MICROPLAN_MODULE_SETUP"),
    kpis: [],
    links: links,
  };
  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default MicroplanCard;