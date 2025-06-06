import { EmployeeModuleCard, SVG } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const ROLES = {
  CAMPAIGN_MANAGER: ["CAMPAIGN_MANAGER", "MICROPLAN_CAMPAIGN_INTEGRATOR"],
  BOUNDARY_MANAGER: ["BOUNDARY_MANAGER"],
  CAMPAIGN_MANAGER_ONLY: ["CAMPAIGN_MANAGER"],
  NATIONAL_SUPERVISOR: ["NATIONAL_SUPERVISOR"],
};

/* @nipun delete this card once migrated  */
const CampaignCard = () => {
  if (!Digit.Utils.didEmployeeHasAtleastOneRole(Object.values(ROLES).flatMap((e) => e))) {
    return null;
  }

  const { t } = useTranslation();
  const userId = Digit.UserService.getUser().info.uuid;
  const microplanStatus = "RESOURCE_ESTIMATIONS_APPROVED";

  let links = [
    {
      label: t("ACTION_TEST_SETUP_CAMPAIGN"),
      link: `/workbench-ui/employee/campaign/setup-campaign`,
      roles: ROLES.BOUNDARY_MANAGER,
    },
    {
      label: t("ACTION_TEST_MY_CAMPAIGN"),
      link: `/workbench-ui/employee/campaign/my-campaign`,
      roles: ROLES.BOUNDARY_MANAGER,
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
    },
    // {
    //   label: t("ACTION_TEST_APP_CONFIGURATION_PARENT_MOBILE"),
    //   link: `/workbench-ui/employee/campaign/app-configuration-parent?variant=app&masterName=AppScreenConfigTemplateSchema&fieldType=AppFieldType&prefix=APPONE`,
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
    //   label: t("ACTION_TEST_APP_CONFIGURATION_PARENT_WEB_EDIT"),
    //   link: `/workbench-ui/employee/campaign/app-configuration-parent?variant=web&masterName=FormBuilderConfig&formComposerMasterName=FormBuilderFormComposerConfig&fieldType=FormBuilderFieldType&prefix=FORMONE&formId=b2cd4285-1735-49da-85fd-a5f4ea219e3b`,
    //   roles: ROLES.CAMPAIGN_MANAGER,
    //   // count: isLoading?"-":data
    // },
    // {
    //   label: t("ACTION_TEST_FORM_BUILDER"),
    //   link: `/workbench-ui/employee/campaign/form-builder-configuration`,
    //   roles: ROLES.CAMPAIGN_MANAGER,
    //   // count: isLoading?"-":data
    // },
    // {
    //   label: t("ACTION_TEST_SCHEMA_BUILDER"),
    //   link: `/workbench-ui/employee/campaign/app-configuration-parent?variant=schema&masterName=SchemaTemplateConfig&fieldType=schemaFieldType`,
    //   roles: ROLES.CAMPAIGN_MANAGER,
    //   // count: isLoading?"-":data
    // },
    // {
    //   label: t("ACTION_TEST_APP_CONFIGURATION_2.0"),
    //   link: `/workbench-ui/employee/campaign/app-configuration-redesign?variant=app&masterName=AppScreenConfigTemplateSchema&fieldType=AppFieldType&prefix=APPONE`,
    //   roles: ROLES.CAMPAIGN_MANAGER,
    //   // count: isLoading?"-":data
    // },
    {
      label: t("ACTION_TEST_APP_CONFIGURATION_3.0"),
      link: `/workbench-ui/employee/campaign/app-configuration-redesign?variant=app&masterName=SimplifiedAppConfigTwo&fieldType=AppFieldTypeOne&prefix=APPTWO&localeModule=APPTWO&formId=default`,
      roles: ROLES.BOUNDARY_MANAGER,
      // count: isLoading?"-":data
    },
    {
      label: t("ACTION_TEST_CREATE_CAMPAIGN"),
      link: `/workbench-ui/employee/campaign/campaign-home`,
      roles: ROLES.CAMPAIGN_MANAGER,
      // count: isLoading?"-":data
    },
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
