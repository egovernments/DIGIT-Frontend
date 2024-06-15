import { HRIcon, EmployeeModuleCard, AttendanceIcon, PropertyHouse } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const SampleCard = () => {
 
  const { t } = useTranslation();

  const propsForModuleCard = {
    Icon: <PropertyHouse />,
    moduleName: t("Program Management System"),
    kpis: [

    ],
    links: [
   
     
      // {
      //   label: t("Individual Search"),
      //   link: `/${window?.contextPath}/employee/sample/search-individual`,

      // },
      {
        label: t("Program Create"),
        link: `/${window?.contextPath}/employee/sample/create-program`,

      },
      {
        label: t("Agency Create"),
        link: `/${window?.contextPath}/employee/sample/create-agency`,

      },
      {
        label: t("Project Create"),
        link: `/${window?.contextPath}/employee/sample/create-project`,

      },
      {
        label: t("Organization Create"),
        link: `/${window?.contextPath}/employee/sample/create-organization`,

      },
      {
        label: t("Estimate Create"),
        link: `/${window?.contextPath}/employee/sample/create-estimate`,

      },
      {
        label: t("Sanction Create"),
        link: `/${window?.contextPath}/employee/sample/create-sanction`,

      },
      {
        label: t("Allocation Create"),
        link: `/${window?.contextPath}/employee/sample/create-allocation`,

      },
      {
        label: t("Disburse Create"),
        link: `/${window?.contextPath}/employee/sample/create-disburse`,

      },
      {
        label: t("Program Search"),
        link: `/${window?.contextPath}/employee/sample/program-search`,

      },
      {
        label: t("Project Search"),
        link: `/${window?.contextPath}/employee/sample/project-search`,

      },
      {
        label: t("Estimate Search"),
        link: `/${window?.contextPath}/employee/sample/estimate-search`,

      },
      {
        label: t("Allocation Search"),
        link: `/${window?.contextPath}/employee/sample/allocation-search`,

      },
      {
        label: t("Sanction Search"),
        link: `/${window?.contextPath}/employee/sample/sanction-search`,

      },
      {
        label: t("Disburse Search"),
        link: `/${window?.contextPath}/employee/sample/disburse-search`,

      },
      {
        label: t("Organization Search"),
        link: `/${window?.contextPath}/employee/sample/organization-search`,

      },
      // {
      //   label: t("Sample Create"),
      //   link: `/${window?.contextPath}/employee/sample/sample-create`,

      // },
      // {
      //   label: t("Sample Search"),
      //   link: `/${window?.contextPath}/employee/sample/sample-search`,

      // },
      // {
      //   label: t("Sample View"),
      //   link: `/${window?.contextPath}/employee/sample/sample-view??tenantId=pg.citya&estimateNumber=ES/2023-24/002390&projectNumber=PJ/2023-24/02/002830`,

      // },
      
    ],
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default SampleCard;