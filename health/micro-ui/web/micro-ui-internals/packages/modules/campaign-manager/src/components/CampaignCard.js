import { EmployeeModuleCard, SVG } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const ROLES = {
  CAMPAIGN_MANAGER:["CAMPAIGN_MANAGER","MICROPLAN_CAMPAIGN_INTEGRATOR"],
  BOUNDARY_MANAGER:["BOUNDARY_MANAGER"],
  CAMPAIGN_MANAGER_ONLY:["CAMPAIGN_MANAGER"],
  NATIONAL_SUPERVISOR:["NATIONAL_SUPERVISOR"]
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
 
  let links = [

    {
      label: t("ACTION_TEST_SETUP_CAMPAIGN"),
      link: `/${window?.contextPath}/employee/campaign/setup-campaign`,
      roles: ROLES.CAMPAIGN_MANAGER_ONLY
    },
    {
      label: t("ACTION_TEST_MY_CAMPAIGN"),
      link: `/${window?.contextPath}/employee/campaign/my-campaign`,
      roles: ROLES.CAMPAIGN_MANAGER,
      // count: isLoading?"-":data
    },  
    { //@Bhavya put the new url and remove the comment
      label: t("ACTION_TEST_SETUP_CAMPAIGN_FROM_MICROPLAN"),
      link: `/${window?.contextPath}/employee/campaign/setup-campaign`,
      roles: ROLES.CAMPAIGN_MANAGER
    },
    {
      label: t("NATIONAL_DASHBOARD"),
      link: "/digit-ui/employee/utilities/iframe/elastic/national",
      roles: ROLES.NATIONAL_SUPERVISOR,
      // count: isLoading?"-":data
    },
    {
      label: t("NDSS_DASHBOARD"),
      link: "/digit-ui/employee/dss/landing/national-health-dashboard",
      roles: ROLES.NATIONAL_SUPERVISOR,
      // count: isLoading?"-":data
    },
    {
      label: t("BOUNDARY_MANAGEMENT"),
      link: `/${window?.contextPath}/employee/campaign/boundary/home`,
      roles: ROLES.BOUNDARY_MANAGER,
      // count: isLoading?"-":data
    },
    {
      label: t("MICROPLAN_CAMPAIGN"),
      link: `/${window?.contextPath}/employee/campaign/my-microplan`,
      roles: ROLES.CAMPAIGN_MANAGER,
      // count: isLoading?"-":data
    },
  ];

  links = links.filter((link) => (link?.roles && link?.roles?.length > 0 ? Digit.Utils.didEmployeeHasAtleastOneRole(link?.roles) : true));

  const propsForModuleCard = {
    Icon: <SVG.Support fill="white" height="36" width="36"/>,
    moduleName: t("ACTION_TEST_CAMPAIGN"),
    kpis: [],
    links: links,
  };
  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default CampaignCard;
