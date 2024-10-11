import { EmployeeModuleCard, WorksMgmtIcon } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const ROLES = {
  MICROPLAN: ["MICROPLAN_ADMIN"],
};

const MicroplanCard = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const generateLink = (labelKey, pathSuffix) => {
    return {
      label: t(labelKey),
      link: `/${window?.contextPath}/employee/microplan/${pathSuffix}`,
      roles: ROLES.MICROPLAN,
    };
  };

  let links = [generateLink("SETUP_MICROPLAN","setup-microplan"),generateLink("SEARCH_MICROPLANS","microplan-search"),generateLink("USER_MANAGEMENT","user-management")];

  links = links.filter((link) => (link?.roles && link?.roles?.length > 0 ? Digit.Utils.didEmployeeHasAtleastOneRole(link?.roles) : true));

  const propsForModuleCard = {
    Icon: <WorksMgmtIcon />,
    moduleName: t("MICROPLAN_MODULE_SETUP"),
    kpis: [],
    links: links,
  };
  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default MicroplanCard;
