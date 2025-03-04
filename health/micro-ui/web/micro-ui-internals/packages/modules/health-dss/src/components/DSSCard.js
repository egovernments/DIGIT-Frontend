import { EmployeeModuleCard, SVG } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const DSSCard = () => {
  const { t } = useTranslation();
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const { isLoading: isDSSInitializing } = Digit.Hooks.DSS.useDssInitialization({
    tenantId: tenantId,
  });

  const projectInfo = Digit.SessionStorage.get("projectInfo") || {};

  console.log(projectInfo, "projectInfo");

  const updateTestUrls = (links) => {
    return links.map(link => ({
      ...link,
      link: link.link.replace("/health-ui/", "/payments-ui/")
    }));
  };

  const getDashboardUrl = (boundaryType, dashboardUrls) => {
    switch (boundaryType) {
      case "COUNTRY":
        return dashboardUrls?.NATIONAL_SUPERVISOR;
      case "PROVIANCE":
        return dashboardUrls?.PROVINCIAL_SUPERVISOR;
      case "DISTRICT":
        return dashboardUrls?.DISTRICT_SUPERVISOR;
      default:
        return null; // Handle unexpected cases
    }
  };

  const generateLinks = () => {

    if (!Array.isArray(projectInfo) || projectInfo.length === 0) return [];
    let links = [];

    projectInfo?.forEach((project) => {
      const projectType = project?.projectType; // Extract projectType from the object
      const boundaryType = project?.boundaries?.boundaryType;
      const boundaryCode = project?.boundaries?.boundary;

      if (!projectType) return;

      const url = getDashboardUrl(boundaryType, projectType?.dashboardUrls);// Get the dashboard URL
      if (!url) return;

      links.push({
        label: `${t(projectType?.code)} - ${boundaryCode ? t(boundaryCode) : ""} ${t(`ACTION_TEST_${boundaryType}_DASHBOARD`)}`,
        link: boundaryType?.toLowerCase() === "country"
          ? `${url}?projectTypeId=${projectType.id}`
          : `${url}?projectTypeId=${projectType.id}&${boundaryType.toLowerCase()}=${t(boundaryCode)}`,
      });
    });

    console.log("Generated Links before update: ", links);
    const updatedLinks = updateTestUrls(links);
    console.log("Generated Links after update: ", updatedLinks);
    return updatedLinks;
  };

  let links = generateLinks();



  const propsForModuleCard = {
    Icon: "Dashboard",
    moduleName: t("DSS_CARD_HEADER_DASHBOARD"),
    kpis: [],
    links: links,
    className: "microplan-employee-module-card",
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default DSSCard;
