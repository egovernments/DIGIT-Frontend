import { HRIcon, EmployeeModuleCard, AttendanceIcon, PropertyHouse } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const SampleCard = () => {
 
  const { t } = useTranslation();
  const allLinks = [
    { text: t("ES_PGR_INBOX"), link: `/${window?.contextPath}/employee/pgr/inbox` },
    { text: t("ES_PGR_NEW_COMPLAINT"), link: `/${window?.contextPath}/employee/pgr/complaint/create`, accessTo: ["CSR"] },
  ];
  const Icon = () => <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
  <path d="M0 0h24v24H0z" fill="none"></path>
  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z" fill="white"></path>
</svg>

let propsForCSR =[
  {
    label: t("ES_PGR_NEW_COMPLAINT"),
    link: `/${window?.contextPath}/employee/pgr/complaint/create`,
    role: "CSR"
  }
]

  const propsForModuleCard = {
    Icon: <Icon />,
    moduleName: t("Complaint"),
    kpis: [
      {
          label: t("TOTAL_PGR"),
          link: `/${window?.contextPath}/employee/pgr/inbox`
      },
      {
        label: t("TOTAL_NEARING_SLA"),
        link: `/${window?.contextPath}/employee/sample/inbox`
    }
  ],
    links: [
   
     
      {
        label: t("Inbox"),
        link: `/${window?.contextPath}/employee/sample/inbox`,

      },
      {
        label: t("New Complaint"),
        link: `/${window?.contextPath}/employee/sample/complaint/create`,

      }
      
    ],
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default SampleCard;