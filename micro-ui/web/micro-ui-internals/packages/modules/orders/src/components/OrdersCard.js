import {  EmployeeModuleCard, PropertyHouse } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const OrdersCard = () => {
 
  const { t } = useTranslation();

  const propsForModuleCard = {
    Icon: <PropertyHouse />,
    moduleName: t("Orders"),
    kpis: [

    ],
    links: [
   
      {
        label: t("Orders  Search"),
        link: `/${window?.contextPath}/employee/orders/orders-search`,

      },
      {
        label: t("Create Scheduling of Hearing"),
        link: `/${window?.contextPath}/employee/orders/orders-create?orderType=SCHEDULE`,

      },
      {
        label: t("Create Warrant"),
        link: `/${window?.contextPath}/employee/orders/orders-create?orderType=WARRANT`,

      },
      {
        label: t("Create Summon"),
        link: `/${window?.contextPath}/employee/orders/orders-create?orderType=SUMMON`,

      },
      {
        label: t("Create Re-issue Summon"),
        link: `/${window?.contextPath}/employee/orders/orders-create?orderType=SUMMON`,

      },

      {
        label: t("Orders Response"),
        link: `/${window?.contextPath}/employee/orders/orders-response`,

      },
      {
        label: t("Orders Home"),
        link: `/${window?.contextPath}/employee/orders/orders-home`,
      }
      
    ],
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default OrdersCard;