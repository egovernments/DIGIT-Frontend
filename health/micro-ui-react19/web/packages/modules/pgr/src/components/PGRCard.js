import { useTranslation } from "react-i18next";
import { EmployeeModuleCard } from "@egovernments/digit-ui-react-components";

const PGRCard = () => {
  const { t } = useTranslation();

  if (!Digit.Utils.pgrAccess?.()) return null;

  let role = ["CSR"];
  if (Digit.Utils.getMultiRootTenant?.()) role.push("SUPERUSER");

  let propsForCSR = [
    {
      label: t("ES_PGR_NEW_COMPLAINT"),
      link: `/${window?.contextPath}/employee/pgr/complaint/create`,
      roles: role,
    },
  ];

  propsForCSR = propsForCSR.filter((link) =>
    link?.roles ? Digit.Utils.didEmployeeHasAtleastOneRole(link.roles) : true
  );

  const propsForModuleCard = {
    Icon: "File",
    moduleName: t("ES_PGR_HEADER_COMPLAINT"),
    kpis: [
      { label: t("TOTAL_PGR"), link: `/${window?.contextPath}/employee/pgr/inbox` },
      { label: t("TOTAL_NEARING_SLA"), link: `/${window?.contextPath}/employee/pgr/inbox` },
    ],
    links: [
      { label: t("ES_PGR_INBOX"), link: `/${window?.contextPath}/employee/pgr/inbox` },
      ...propsForCSR,
    ],
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default PGRCard;
