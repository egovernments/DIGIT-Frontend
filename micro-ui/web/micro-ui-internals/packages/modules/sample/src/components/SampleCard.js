import { HRIcon, EmployeeModuleCard, AttendanceIcon, PropertyHouse } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { AnnouncementIcon } from "@egovernments/digit-ui-react-components";

const SampleCard = () => {
  const { t } = useTranslation();

  const propsForModuleCard = {
    Icon: <AnnouncementIcon />,
    moduleName: t("ES_PGR_HEADER_COMPLAINT"),
    kpis: [
      {
        label: t("TOTAL_PGR"),
        link: `/${window?.contextPath}/employee/pgr/inbox`,
      },
      {
        label: t("TOTAL_NEARING_SLA"),
        link: `/${window?.contextPath}/employee/pgr/inbox`,
      },
    ],
    links: [
      {
        label: t("Inbox"),
        link: `/${window?.contextPath}/employee/sample/inbox`,
      },
      {
        label: t("New Complaint"),
        link: `/${window?.contextPath}/employee/sample/create-complaint`,
      },
    ],
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default SampleCard;
