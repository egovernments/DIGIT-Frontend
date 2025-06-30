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
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const project = location?.state?.project;
  const campaignId = project?.referenceID;
  const [redirected, setRedirected] = useState(false);
  const queryStrings = Digit.Hooks.useQueryParams();

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
    const dashboardConfigs = mdmsData?.MdmsRes?.["hcm-dashboard"]?.dashboardProjectConfig;
    if (!Array.isArray(dashboardConfigs)) return null;

    // Try to find matching campaignType first
    let campaignConfig = dashboardConfigs.find((cfg) => cfg.campaignType === projectType);

    // Fallback to "FALLBACK-CAMPAIGNTYPE" if not found
    if (!campaignConfig) {
      campaignConfig = dashboardConfigs.find((cfg) => cfg.campaignType === "FALLBACK-CAMPAIGNTYPE");
    }

    // Get the config entry matching the level
    const matchedConfig = campaignConfig?.config?.find((cfg) => cfg.level === levelLinked);
    return matchedConfig || null;
  };
  const selectedDashboard = getDashboardId(mdmsData, project?.projectType, levelLinked);
  const dashboardId = selectedDashboard?.dashboardId;

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
  const { data: dashboardDataResponse } = Digit.Hooks.useCustomAPIHook(dashboardReqCriteria);

  const reqCriteriaResource = {
    url: `/boundary-service/boundary-relationships/_search`,
    changeQueryName: hierarchyType,
    params: {
      tenantId: tenantId,
      includeParents: true,
      codes: project?.address?.boundary,
      hierarchyType: hierarchyType,
    },
    config: {
      enabled: !!hierarchyType,
      select: (data) => {
        return data?.["TenantBoundary"]?.[0]?.boundary;
      },
    },
  };

  const { isLoading: dataLoading, data: data, isFetching, refetch2 } = Digit.Hooks.useCustomAPIHook(reqCriteriaResource);

  useEffect(() => {
    const boundaries =
      data?.map((item) => ({
        [item.boundaryType.toLowerCase()]: [t(item.code)],
      })) || [];

    const projectsInfo = {
      project: project,
      boundaries: boundaries,
    };
    if (dashboardDataResponse?.responseData && !redirected) {
      setRedirected(true);
      history.push(
        `/${window?.contextPath}/employee/dss/${selectedDashboard?.level}/${dashboardId}?campaignId=${campaignData?.[0]?.id}&boundaryType=${queryStrings?.boundaryType}&boundaryValue=${queryStrings?.boundaryValue}`,
        {
          dashboardData: dashboardDataResponse?.responseData,
          projectTypeId: project?.projectTypeId,
          dashboardLink: selectedDashboard?.level,
          stateCode: stateCode,
        }
      );
      Digit.SessionStorage.set("dashboardData", dashboardDataResponse?.responseData);
      Digit.SessionStorage.set("projectSelected", projectsInfo);
      Digit.SessionStorage.set("campaignSelected", campaignData?.[0]);
    }
  }, [dashboardDataResponse?.responseData, redirected, history,data]);

  if (campaignSearchLoading || hierarchyLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }
  if (!campaignData || campaignData.length === 0) {
    return <div>{t("CAMPAIGN_NOT_FOUND")}</div>;
  }
  return null;
};

export default ViewDashbaord;
