import { HRIcon, EmployeeModuleCard, AttendanceIcon, PropertyHouse } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const SampleCard = () => {
 
  const { t } = useTranslation();

  const propsForModuleCard = {
    Icon: "BeenHere",
    moduleName: t("Sample"),
    kpis: [

    ],
    links: [
      {
        label: t("Demo"),
        link: `/${window?.contextPath}/employee/utilities/demo`,
      },
     
      {
        label: t("Individual Create"),
        link: `/${window?.contextPath}/employee/utilities/individual-create`,
      },
  
      {
        label: t("Individual Search"),
        link: `/${window?.contextPath}/employee/utilities/individual-search`,

      },
      {
        label: t("Individual View"),
        link: `/${window?.contextPath}/employee/utilities/individual-view??tenantId=pg.citya&estimateNumber=ES/2023-24/002390&projectNumber=PJ/2023-24/02/002830`,

      },
      // {
      //   label: t("Individual View Details"),
      //   link: `/${window?.contextPath}/employee/sample/individual-details-view`,
      // },
      //      {
      //   label: t("Sample Components"),
      //   link: `/${window?.contextPath}/employee/sample/sample-components`,
      // },
      {
        label: t("Sample Create"),
        link: `/${window?.contextPath}/employee/utilities/sample-create`,
      },
      {
        label: t("Sample Search"),
        link: `/${window?.contextPath}/employee/utilities/sample-search`,
      },
      {
        label: t("Individual Tab Search"),
        link: `/${window?.contextPath}/employee/utilities/tab-search-individual`,
      },
      // {
      //   label: t("New UI Components"),
      //   link: `/${window?.contextPath}/employee/utilities/components`,
      // },
      {
        label: t("Create"),
        link: `/${window?.contextPath}/employee/utilities/create`,
      },
      {
        label: t("Search"),
        link: `/${window?.contextPath}/employee/utilities/search`,
      },
      // {
      //   label: t("Inbox"),
      //   link: `/${window?.contextPath}/employee/utilities/inbox`,
      // },
      // {
      //   label: t("View"),
      //   link: `/${window?.contextPath}/employee/utilities/view`,
      // },
    ],
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default SampleCard;