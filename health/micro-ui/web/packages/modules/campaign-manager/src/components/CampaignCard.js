import { useTranslation } from "react-i18next";

import React, { Fragment, useEffect } from "react";
import { EmployeeModuleCard } from "@egovernments/digit-ui-react-components";

const ROLES = {
  CAMPAIGN_MANAGER: ["CAMPAIGN_MANAGER", "MICROPLAN_CAMPAIGN_INTEGRATOR"],
  BOUNDARY_MANAGER: ["BOUNDARY_MANAGER"],
  MICROPLAN_INTEGRATOR: ["MICROPLAN_CAMPAIGN_INTEGRATOR"],
  CAMPAIGN_MANAGER_ONLY: ["CAMPAIGN_MANAGER"],
  NATIONAL_SUPERVISOR: ["NATIONAL_SUPERVISOR"],
};

/**
 * The CampaignCard component renders a card with links related to campaign management, filtering out
 * links based on employee roles.
 * @returns The CampaignCard component is being returned. It contains a list of links related to
 * campaign actions, such as setting up a campaign and viewing personal campaigns. The links are
 * filtered based on employee roles before being displayed in the EmployeeModuleCard component.
 */

const CampaignCard = () => {
  if (!Digit.Utils.didEmployeeHasAtleastOneRole(Object.values(ROLES).flatMap((e) => e))) {
    return null;
  }

  const { t } = useTranslation();
  const microplanStatus = "RESOURCE_ESTIMATIONS_APPROVED";

  useEffect(() => {
    sessionStorage.removeItem("HCM_SELECTED_TAB_INDEX");
  }, []);

  let links = [
    // {
    //   label: t("ACTION_TEST_SETUP_CAMPAIGN"),
    //   link: `/${window?.contextPath}/employee/campaign/setup-campaign`,
    //   roles: ROLES.BOUNDARY_MANAGER,
    // },
    // {
    //   label: t("ACTION_TEST_MY_CAMPAIGN"),
    //   link: `/${window?.contextPath}/employee/campaign/my-campaign`,
    //   roles: ROLES.BOUNDARY_MANAGER,
    //   // count: isLoading?"-":data
    // },
    {
      label: t("ACTION_TEST_CREATE_CAMPAIGN"),
      link: `/workbench-ui/employee/campaign/campaign-home`,
      id:`admin-console-home-screen-create-campaign-link`,
      roles: ROLES.CAMPAIGN_MANAGER,
      // count: isLoading?"-":data
    },
    {
      label: t("ACTION_TEST_MY_CAMPAIGN_NEW"),
      link: `/${window?.contextPath}/employee/campaign/my-campaign-new`,
      id:`admin-console-home-screen-my-campaign-new-link`,
      roles: ROLES.CAMPAIGN_MANAGER,
      // count: isLoading?"-":data
    },
    {
      label: t("CAMPAIGN_TEMPLATES"),
      link: `/${window?.contextPath}/employee/campaign/campaign-templates`,
      id:`admin-console-home-screen-campaign-templates-link`,
      roles: ROLES.CAMPAIGN_MANAGER,
    },
    // {
    //   label: t("NEW APP CONFIGURATION"),
    //   link: `/${window?.contextPath}/employee/campaign/new-app-configuration-redesign`,
    //   roles: ROLES.CAMPAIGN_MANAGER,
    //   // count: isLoading?"-":data
    // },
    {
      label: t("ACTION_TEST_SETUP_CAMPAIGN_FROM_MICROPLAN"),
      link: `/${window?.contextPath}/employee/campaign/setup-from-microplan?status=${microplanStatus}`,
      roles: ROLES.BOUNDARY_MANAGER,
    },
    {
      label: t("NATIONAL_DASHBOARD"),
      link: "/digit-ui/employee",
      roles: ROLES.NATIONAL_SUPERVISOR,
      // count: isLoading?"-":data
    },
    {
      label: t("BOUNDARY_MANAGEMENT"),
      link: `/${window?.contextPath}/employee/workbench/boundary/home`,
      id:`admin-console-home-screen-boundary-management-link`,
      roles: ROLES.BOUNDARY_MANAGER,
      // count: isLoading?"-":data
    },
    // {
    //   label: t("ACTION_TEST_APP_CONFIGURATION_PARENT_MOBILE"),
    //   link: `/workbench-ui/employee/campaign/app-configuration-parent?variant=app&masterName=SimplifiedAppConfigOne&fieldType=AppFieldType&prefix=APPONE&localeModule=APPONE`,
    //   roles: ROLES.CAMPAIGN_MANAGER,
    //   // count: isLoading?"-":data
    // },
    // {
    //   label: t("ACTION_TEST_APP_CONFIGURATION_PARENT_WEB"),
    //   link: `/workbench-ui/employee/campaign/app-configuration-parent?variant=web&masterName=FormBuilderConfig&fieldType=FormBuilderFieldType&prefix=FORMONE`,
    //   roles: ROLES.CAMPAIGN_MANAGER,
    //   // count: isLoading?"-":data
    // },
    // {
    //   label: t("ACTION_TEST_APP_CONFIGURATION_3.0"),
    //   link: `/workbench-ui/employee/campaign/app-configuration-redesign?variant=app&masterName=SimplifiedAppConfigOne&fieldType=AppFieldType&prefix=APPONE&localeModule=APPONE&formId=default`,
    //   roles: ROLES.CAMPAIGN_MANAGER,
    //   // count: isLoading?"-":data
    // },
    // {
    //   label: t("ACTION_TEST_APP_CONFIGURATION"),
    //   link: `/workbench-ui/employee/campaign/app-configuration`,
    //   roles: ROLES.CAMPAIGN_MANAGER,
    //   // count: isLoading?"-":data
    // },  WILLBEDISABLEDINPATCHRELEASE
  ];

  links = links.filter((link) => (link?.roles && link?.roles?.length > 0 ? Digit.Utils.didEmployeeHasAtleastOneRole(link?.roles) : true));

  const propsForModuleCard = {
    Icon: "Engineering",
    moduleName: t("ACTION_TEST_CAMPAIGN"),
    kpis: [],
    links: links,
  };
  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default CampaignCard;
