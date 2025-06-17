import React from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState, Fragment } from "react";

const ViewDashbaord = ({ stateCode }) => {
  const { t } = useTranslation();
  const [redirected, setRedirected] = useState(false);
  const history = useHistory();
  const queryStrings = Digit.Hooks.useQueryParams();
  const roles = Digit.UserService.getUser().info.roles;
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const data = {
    Projects: [
      {
        id: queryStrings?.projectId,
        tenantId: Digit.ULBService.getCurrentTenantId(),
      },
    ],
  };

  const params = {
    tenantId: Digit.ULBService.getCurrentTenantId(),
    limit: 1000,
    offset: 0,
  };

  const projectResult = Digit.Hooks.DSS.useProjectSearch({
    data,
    params,
    config: {},
  })?.data?.[0];

  const { isLoading: isLoadingMdmsData, data: levelConfig } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    "dashboard-level-config",
    [{ name: "roleToDashboardLevelMapping" }],
    {
      select: (data) => {
        return data?.["dashboard-level-config"]?.["roleToDashboardLevelMapping"]?.filter(
          (item) => item.heirarchyType === queryStrings?.hierarchyType
        );
      },
    },
    { schemaCode: "dashboard-level-config.roleToDashboardLevelMapping" } //mdmsv2
  );

  const dashboardLinks = levelConfig?.[0]?.config.filter((configItem) => roles.some((role) => role.code === configItem.role));

  const dashboardId = dashboardLinks?.[0]?.dashboardId;

  const reqCriteria = {
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
  const { data: dashboardDataResponse } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  useEffect(() => {
    if (dashboardDataResponse?.responseData && !redirected) {
      setRedirected(true);
      history.push(`/${window?.contextPath}/employee/dss/${dashboardLinks?.[0]?.level}/${dashboardLinks?.[0]?.dashboardId}?projectTypeId=${projectResult?.projectTypeId}`, {
          dashboardData: dashboardDataResponse?.responseData,
          projectTypeId: projectResult?.projectTypeId,
          dashboardLink: dashboardLinks?.[0],
          stateCode: stateCode,
        });
    }
  }, [dashboardDataResponse?.responseData, redirected, history]);

  return <>{!dashboardDataResponse?.responseData || isLoadingMdmsData || !projectResult?.projectTypeId || projectResult?.projectTypeId === undefined ? <div>{t("IN_PROGRESS")}</div> : null}</>;
};

export default ViewDashbaord;
