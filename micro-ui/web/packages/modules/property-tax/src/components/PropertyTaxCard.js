import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard, PropertyHouse } from "@egovernments/digit-ui-react-components";

const PTCard = () => {
  const { t } = useTranslation();

  // const [total, setTotal] = useState("-");
  // const { data, isLoading, isFetching, isSuccess } = Digit.Hooks.useNewInboxGeneralV2({
  //   tenantId: Digit.ULBService.getCurrentTenantId(),
  //   ModuleCode: "PT",
  //   filters: { limit: 10, offset: 0, services: ["PT.CREATE", "PT.MUTATION", "PT.UPDATE"] },
  //   config: {
  //     select: (data) => {
  //       return { totalCount: data?.totalCount, nearingSlaCount: data?.nearingSlaCount } || "-";
  //     },
  //     enabled: Digit.Utils.ptAccess(),
  //   },
  // });

  // useEffect(() => {
  //   if (!isFetching && isSuccess) setTotal(data);
  // }, [isFetching]);

  // if (!Digit.Utils.ptAccess()) {
  //   return null;
  // }

  const links = [
    {
      label: t("SEARCH_PROPERTY"),
      link: `/${window?.contextPath}/employee/pt/search-property`,
    },
    {
      label: t("SEARCH_APPLICATION"),
      link: `/${window?.contextPath}/employee/pt/search-application`,
    },
    {
      label: t("ADD_NEW_PROPERTY"),
      link: `/${window?.contextPath}/employee/pt/assessment-form`,
    },
    {
      label: t("INBOX"),
      link: `/${window?.contextPath}/employee/pt/inbox`,
    },
    {
      label: t("INBOX_OLD"),
      link: `https://sdc-uat.lgpunjab.gov.in/employee/pt/inbox`,
      hyperlink:true
    },
  ];

  // const PT_CEMP = Digit.UserService.hasAccess(["PT_CEMP"]) || false;
  const propsForModuleCard = {
    Icon: "PropertyHouse",
    moduleName: t("ES_TITLE_PROPERTY_TAX"),
    // kpis: [
    //   {
    //     count: total?.totalCount,
    //     label: t("ES_TITLE_INBOX"),
    //     link: `/digit-ui/employee/property-tax/search`,
    //   },
    //   {
    //     count: total?.nearingSlaCount,
    //     label: t("TOTAL_NEARING_SLA"),
    //     link: `/digit-ui/employee/property-tax/search`,
    //   },
    // ],
    // links: links.filter((link) => !link?.role),
    links:links
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default PTCard;