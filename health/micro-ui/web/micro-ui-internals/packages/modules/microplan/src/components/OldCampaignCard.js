import { EmployeeModuleCard, SVG } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const ROLES = {
  CAMPAIGN_MANAGER:["CAMPAIGN_MANAGER","MICROPLAN_CAMPAIGN_INTEGRATOR"],
  BOUNDARY_MANAGER:["BOUNDARY_MANAGER"],
  CAMPAIGN_MANAGER_ONLY:["CAMPAIGN_MANAGER"],
  NATIONAL_SUPERVISOR:["NATIONAL_SUPERVISOR"]
};

/* @nipun delete this card once migrated  */
const CampaignCard = () => {
  if (!Digit.Utils.didEmployeeHasAtleastOneRole(Object.values(ROLES).flatMap((e) => e))) {
  return null;
  }

  const { t } = useTranslation();
  const userId = Digit.UserService.getUser().info.uuid;
  const microplanStatus = "RESOURCE_ESTIMATIONS_APPROVED";

  useEffect(() => {
    sessionStorage.removeItem("HCM_SELECTED_TAB_INDEX");
  }, []);

  let links = [
    {
      label: t("ACTION_TEST_CREATE_CAMPAIGN"),
      link: `/workbench-ui/employee/campaign/campaign-home`,
      roles: ROLES.CAMPAIGN_MANAGER,
      // count: isLoading?"-":data
    },
    {
      label: t("ACTION_TEST_MY_CAMPAIGN_NEW"),
      link: `/${window?.contextPath}/employee/campaign/my-campaign-new`,
      roles: ROLES.CAMPAIGN_MANAGER,
      // count: isLoading?"-":data
    },
    { 
      label: t("ACTION_TEST_SETUP_CAMPAIGN_FROM_MICROPLAN"),
      link: `/${window?.contextPath}/employee/campaign/setup-from-microplan?userId=${userId}&status=${microplanStatus}`,
      roles: ROLES.BOUNDARY_MANAGER,
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
      link: `/workbench-ui/employee/campaign/boundary/home`,
      roles: ROLES.BOUNDARY_MANAGER,
      // count: isLoading?"-":data
    }
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