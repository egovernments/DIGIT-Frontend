import { HRIcon, EmployeeModuleCard, AttendanceIcon, PropertyHouse } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const ServiceBuilderCard = () => {
    const {module, service, edit} = Digit.Hooks.useQueryParams();

 
  const { t } = useTranslation();

  //To show the card at main page
  const propsForModuleCard = {
    Icon: "BeenHere",
    moduleName: t(service.replaceAll("_"," ")),
    kpis: [

    ],
    links: [
      {
        label: t("SERVICE_DESIGNER_FORMS"),
        link: `/${window?.contextPath}/employee/servicedesigner/forms?module=${module}&service=${service}&edit=${true}`,
      },
      {
        label: t("SERVICE_DESIGNER_CHECKLIST"),
        link: `/${window?.contextPath}/employee/servicedesigner/Checklist?module=${module}&service=${service}&edit=${true}`,
      },
      {
        label: t("SERVICE_DESIGNER_ROLES"),
        link: `/${window?.contextPath}/employee/servicedesigner/Roles?module=${module}&service=${service}&edit=${true}`,
      },
      {
        label: t("SERVICE_DESIGNER_NOTIFICATIONS"),
        link: `/${window?.contextPath}/employee/servicedesigner/notifications?module=${module}&service=${service}&edit=${true}`,
      },
      {
        label: t("SERVICE_DESIGNER_WORKFLOW"),
        link: `/${window?.contextPath}/employee/servicedesigner/Workflow?module=${module}&service=${service}&edit=${true}`,
      },
    ],
  };

  //employee module card categorization
  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default ServiceBuilderCard;