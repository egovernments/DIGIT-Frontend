import { EmployeeModuleCard } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const ROLES = { HRMS: ["HRMS_ADMIN"] };

const HRMSCard = () => {
  const { t } = useTranslation();

  if (!Digit.Utils.didEmployeeHasAtleastOneRole(Object.values(ROLES).flatMap((e) => e))) {
    return null;
  }

  const generateLink = (labelKey, pathSuffix, roles = ROLES.HRMS) => ({
    label: t(labelKey),
    link: `/${window?.contextPath}/employee/hrms/${pathSuffix}`,
    roles,
  });

  const hasRequiredRoles = (link) => {
    if (!link?.roles?.length) return true;
    return Digit.Utils.didEmployeeHasAtleastOneRole(link.roles);
  };

  let links = [
    generateLink("SEARCH_EMPLOYEE", "inbox"),
    generateLink("CREATE_EMPLOYEE", "create"),
  ].filter(hasRequiredRoles);

  const propsForModuleCard = {
    Icon: "UpdateExpense",
    moduleName: t("HRMS"),
    kpis: [],
    links,
    className: "microplan-employee-module-card",
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default HRMSCard;
