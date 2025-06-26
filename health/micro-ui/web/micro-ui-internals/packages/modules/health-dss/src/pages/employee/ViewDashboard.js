import React from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState, Fragment } from "react";
import { useLocation } from "react-router-dom";
import { Loader } from "@egovernments/digit-ui-components";

const ViewDashbaord = ({ stateCode }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const queryStrings = Digit.Hooks.useQueryParams();
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const project = location?.state?.project;
  const campaignId = project?.referenceID;

  const { isLoading: campaignSearchLoading, data: campaignData, error: campaignError, refetch: refetch } = Digit.Hooks.campaign.useSearchCampaign({
    tenantId: tenantId,
    filter: {
      campaignNumber: campaignId,
      isActive: true,
    },
    config: {
      enabled: campaignId ? true : false,
      select: (data) => {
        return data;
      },
    },
  });

  const hierarchyType = campaignData?.[0]?.hierarchyType || "";

  const reqCriteria = {
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    changeQueryName: `${hierarchyType}`,
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId: tenantId,
        limit: 2,
        offset: 0,
        hierarchyType: hierarchyType,
        hierarchyType: "NEWTEST00222",
      },
    },
    config: {
      enabled: !!hierarchyType,
      select: (data) => {
        return data?.BoundaryHierarchy?.[0];
      },
    },
  };

  const { isLoading: hierarchyLoading, data: hierarchyDefinition } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  const processBoundaryHierarchy = (hierarchyDefinition) => {
    const hierarchyList = hierarchyDefinition?.boundaryHierarchy;
    if (!Array.isArray(hierarchyList)) return {};

    const parentToChildMap = new Map();
    const allTypes = new Set();

    // Build parent -> child map and track all types
    hierarchyList.forEach(({ boundaryType, parentBoundaryType }) => {
      if (parentBoundaryType) {
        parentToChildMap.set(parentBoundaryType, boundaryType);
      }
      allTypes.add(boundaryType);
    });

    // Find the root (no parentBoundaryType)
    const root = hierarchyList.find((item) => item.parentBoundaryType === null)?.boundaryType;
    if (!root) return {};

    // Build level map from root down
    const levelMap = {};
    let current = root;
    let level = 1;

    while (current) {
      levelMap[current] = `level-${["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"][level - 1]}`;
      current = parentToChildMap.get(current);
      level++;
    }

    return levelMap;
  };

  const levelMap = processBoundaryHierarchy(hierarchyDefinition);
  const boundaryType = project?.address.boundaryType?.toUpperCase() || "";
  const levelLinked = levelMap?.[boundaryType];

  const { data: mdmsData, isLoading: isMDMSLoading } = Digit.Hooks.useCustomMDMS(
    tenantId,
    "hcm-dashboard",
    [{ name: "dashboardProjectConfig" }],
    {},
    { schemaCode: "hcm-dashboard.dashboardProjectConfig" }
  );

  const getDashboardId = (mdmsData, projectType, levelLinked) => {
    const dashboardConfigs = mdmsData?.["hcm-dashboard"]?.dashboardProjectConfig;
    if (!Array.isArray(dashboardConfigs)) return null;

    // Try to find matching campaignType first
    let campaignConfig = dashboardConfigs.find((cfg) => cfg.campaignType === projectType);

    // Fallback to "FALLBACK-CAMPAIGNTYPE" if not found
    if (!campaignConfig) {
      campaignConfig = dashboardConfigs.find((cfg) => cfg.campaignType === "FALLBACK-CAMPAIGNTYPE");
    }

    // Get the config entry matching the level
    const matchedConfig = campaignConfig?.config?.find((cfg) => cfg.level === levelLinked);
    return matchedConfig?.dashboardId || null;
  };
  const dashboardId = getDashboardId(mdmsData, project?.projectType, levelLinked);

  const dashboardReqCriteria = {
    url: `/dashboard-analytics/dashboard/getDashboardConfig/${dashboardId}`,
    changeQueryName: dashboardId,
    body: {},
    params: {
      tenantId,
    },
    headers: {
      "auth-token": Digit.UserService.getUser()?.access_token || null,
    },
    method: "GET",
    config: {
      enabled: !!dashboardId,
      select: (data) => {
        return data;
      },
    },
  };
  const { data: dashboardDataResponse } = Digit.Hooks.DSS.useAPIHook(dashboardReqCriteria);

  if (campaignSearchLoading || hierarchyLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }
  if (!campaignData || campaignData.length === 0) {
    return <div>{t("CAMPAIGN_NOT_FOUND")}</div>;
  }
  return null;
};

export default ViewDashbaord;
