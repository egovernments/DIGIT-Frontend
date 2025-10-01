import React from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState, Fragment } from "react";
import { useLocation } from "react-router-dom";
import { Loader } from "@egovernments/digit-ui-components";

const ViewDashboard = ({ stateCode }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const project = location?.state?.project;
  const boundaryCodeResponse = location?.state?.boundaryCodeResponse;
  const campaignNumber = project?.referenceID;
  const [redirected, setRedirected] = useState(false);
  const queryStrings = Digit.Hooks.useQueryParams();
  const [loaderText, setLoaderText] = useState(t("LOADING"));

  // campaign search call
  const { isLoading: campaignSearchLoading, data: campaignData, error: campaignError, refetch: refetch } = Digit.Hooks.campaign.useSearchCampaign({
    tenantId: tenantId,
    filter: {
      campaignNumber: campaignNumber,
      isActive: true,
    },
    config: { 
      enabled: campaignNumber ? true : false,
      select: (data) => {
        return data;
      },
    },
  });

  const hierarchyType = campaignData?.[0]?.hierarchyType || "";


  // boundary hierarchy definition search call
  const reqCriteriaForBoundaryDefinitionSearch = {
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

  const { isLoading: hierarchyLoading, data: hierarchyDefinition } = Digit.Hooks.useCustomAPIHook(reqCriteriaForBoundaryDefinitionSearch);

  const processBoundaryHierarchy = (hierarchyDefinition) => {
    const hierarchyList = hierarchyDefinition?.boundaryHierarchy;
    if (!Array.isArray(hierarchyList)) return {};

    const parentToChildMap = new Map();
    const allTypes = new Set();

    // Build parent -> child map and track all types
    hierarchyList.forEach(({ boundaryType, parentBoundaryType }) => {
      if (parentBoundaryType) {
        parentToChildMap.set(parentBoundaryType.toLowerCase(), boundaryType.toLowerCase());
      }
      allTypes.add(boundaryType);
    });

    // Find the root (no parentBoundaryType)
    const root = hierarchyList.find((item) => item.parentBoundaryType === null)?.boundaryType.toLowerCase();
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
  const boundaryType = project?.address.boundaryType?.toLowerCase() || "";
  const levelLinked = levelMap?.[boundaryType];

  // MDMS call : to get dashboard config id fro specific hierarchyType
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

  // Dashboard analytics call to get the dashoard data for specific dashboard id
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
  const { isLoading: isDashboardLoading, data: dashboardDataResponse } = Digit.Hooks.useCustomAPIHook(dashboardReqCriteria);


  // Boundary releationship search
  const reqCriteriaForBoundaryReleationshipSearch = {
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

  const { isLoading: boundaryDataLoading, data: boundaryData, isFetching, refetch2 } = Digit.Hooks.useCustomAPIHook(
    reqCriteriaForBoundaryReleationshipSearch
  );

  // Dynamic loader text based on current API
  useEffect(() => {
    if (campaignSearchLoading) setLoaderText(t("FETCHING_CAMPAIGN_DETAILS"));
    else if (hierarchyLoading) setLoaderText(t("FETCHING_HIERARCHY"));
    else if (isMDMSLoading) setLoaderText(t("LOADING_DASHBOARD_CONFIGURATION"));
    else if (isDashboardLoading) setLoaderText(t("LOADING_DASHBOARD"));
    else if (boundaryDataLoading) setLoaderText(t("FETCHING_BOUNDARIES"));
  }, [campaignSearchLoading, hierarchyLoading, isMDMSLoading, isDashboardLoading, boundaryDataLoading, t]);

  

  useEffect(() => {
    const boundaries =
      boundaryData?.map((item) => ({
        [item.boundaryType.toLowerCase()]: [item.code.toLowerCase()],
      })) || [];

    const projectsInfo = {
      project: project,
      boundaries: boundaries,
      boundaryCodeResponse: boundaryCodeResponse
    };

    if (dashboardDataResponse?.responseData && !redirected) {
      setRedirected(true);
      history.push(
        `/${window?.contextPath}/employee/dss/${selectedDashboard?.level === "level-one" ? "level-one" : "level-two"}/${dashboardId}?campaignNumber=${campaignNumber}&boundaryType=${queryStrings?.boundaryType}&boundaryValue=${queryStrings?.boundaryValue}`,
        {
          dashboardData: dashboardDataResponse?.responseData,
          projectTypeId: project?.projectTypeId,
          dashboardLink: selectedDashboard?.level,
          stateCode: stateCode,
          levelMap: levelMap
        }
      );
      Digit.SessionStorage.set("dashboardData", dashboardDataResponse?.responseData);
      Digit.SessionStorage.set("projectSelected", projectsInfo);
      Digit.SessionStorage.set("campaignSelected", campaignData?.[0]);
      Digit.SessionStorage.set("levelMap", levelMap);
      Digit.SessionStorage.set("selectedDashboard", selectedDashboard);
    }
  }, [dashboardDataResponse?.responseData, redirected, history, boundaryData]);

  // Always show loader until redirect
  if (!redirected) {
    return <Loader variant={"PageLoader"} className={"digit-center-loader"} loaderText={loaderText || t("LOADING")} />;
  }
  return null;
};

export default ViewDashboard;
