import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { InboxSearchComposer, Loader } from "@egovernments/digit-ui-components";
import { myCampaignConfigNew } from "../../configs/myCampaignConfigNew";
import getProjectServiceUrl from "../../utils/getProjectServiceUrl";

/**
 * The `MyCampaignNew` function is a React component that displays a header with a campaign search title
 * and an inbox search composer with tabs for different configurations.
 * @returns The `MyCampaignNew` component is returning a React fragment containing a Header component with
 * a title fetched using the `useTranslation` hook, and a div with a className of
 * "digit-inbox-search-wrapper" that contains an `InboxSearchComposer` component. The `InboxSearchComposer`
 * component is being passed props such as `configs`, `showTab`, `tabData`, and `onTabChange
 */

const MyCampaignNew = ({ showDashboardLink }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const currentUser = Digit.SessionStorage.get("User")?.info;
  const userUuid = currentUser?.uuid;
  const ASSIGNMENT_SCOPED_CAMPAIGN_ROLES = [
    "SUPERVISION_AND_REPORTING_ADMINISTRATOR",
    "WORKFORCE_AND_ATTENDANCE_ADMINISTRATOR",
    "CAMPAIGN_MAPPING_AND_MICROPLANNING_ADMINISTRATOR",
    "MOBILE_APPLICATION_CONFIGURATION_ADMINISTRATOR",
    "CAMPAIGN_CONFIGURATION_ADMINISTRATOR",
  ];
  const shouldUseAssignmentScopedCampaigns = Digit.Utils.didEmployeeHasAtleastOneRole(ASSIGNMENT_SCOPED_CAMPAIGN_ROLES);

  const [config, setConfig] = useState(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(null);
  const [tabData, setTabData] = useState(
    myCampaignConfigNew?.myCampaignConfigNew?.map((configItem, index) => ({
      key: index,
      label: configItem.label,
      active: index === 0 ? true : false,
    }))
  );
  const [isConfigReady, setIsConfigReady] = useState(false);
  const [isAssignmentScopeReady, setIsAssignmentScopeReady] = useState(!shouldUseAssignmentScopedCampaigns);

  const staffSearchCriteria = useMemo(
    () => ({
      url: `${getProjectServiceUrl()}/staff/v1/_search`,
      params: { tenantId, offset: 0, limit: 200 },
      body: { ProjectStaff: { staffId: [userUuid] } },
      config: {
        enabled: shouldUseAssignmentScopedCampaigns && !!userUuid,
        select: (data) => data?.ProjectStaff || [],
        staleTime: 0,
        cacheTime: 0,
      },
    }),
    [tenantId, userUuid, shouldUseAssignmentScopedCampaigns]
  );

  const { data: projectStaff = [], isLoading: isProjectStaffLoading } = Digit.Hooks.useCustomAPIHook(staffSearchCriteria);

  const assignedProjectIds = useMemo(() => {
    if (!projectStaff?.length) return [];
    return [...new Set(projectStaff.map((entry) => entry?.projectId).filter(Boolean))];
  }, [projectStaff]);

  const isAssignedProjectsLoading = false;

  useEffect(() => {
    const savedIndex = parseInt(sessionStorage.getItem("HCM_SELECTED_TAB_INDEX")) || 0;

    const configList = myCampaignConfigNew?.myCampaignConfigNew || [];
    setSelectedTabIndex(savedIndex);
    setConfig(configList[savedIndex]);
    setTabData(
      configList.map((item, idx) => ({
        key: idx,
        label: item.label,
        active: idx === savedIndex,
      }))
    );
    setIsConfigReady(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const hydrateAssignmentScope = async () => {
      if (!shouldUseAssignmentScopedCampaigns) {
        sessionStorage.removeItem("HCM_ASSIGNED_CAMPAIGN_SCOPE");
        setIsAssignmentScopeReady(true);
        return;
      }

      if (isProjectStaffLoading || isAssignedProjectsLoading) {
        return;
      }

      if (assignedProjectIds.length === 0) {
        sessionStorage.setItem(
          "HCM_ASSIGNED_CAMPAIGN_SCOPE",
          JSON.stringify({ projectIds: assignedProjectIds, campaignNumbers: [], campaignIds: [] })
        );
        if (!cancelled) setIsAssignmentScopeReady(true);
        return;
      }

      const staffDerivedCampaignNumbers = [
        ...new Set(
          projectStaff
            .flatMap((entry) => [
              entry?.campaignNumber,
              entry?.referenceID,
              entry?.referenceId,
              entry?.projectNumber,
              entry?.additionalDetails?.campaignNumber,
              entry?.additionalDetails?.referenceID,
              entry?.additionalDetails?.referenceId,
            ])
            .filter(Boolean)
        ),
      ];

      let allCampaigns = [];
      try {
        const pageLimit = 100;
        let offset = 0;
        let totalCount = Number.MAX_SAFE_INTEGER;

        while (offset < totalCount) {
          const response = await Digit.CustomService.getResponse({
            url: "/project-factory/v1/project-type/search",
            body: {
              CampaignDetails: {
                tenantId,
                status: ["creating", "created", "drafted", "failed"],
                isLikeSearch: true,
                pagination: {
                  limit: pageLimit,
                  offset,
                  sortBy: "createdTime",
                  sortOrder: "desc",
                },
              },
            },
          });

          const campaigns = response?.CampaignDetails || [];
          totalCount = Number.isFinite(response?.totalCount) ? response.totalCount : campaigns.length;
          allCampaigns.push(...campaigns);

          if (campaigns.length < pageLimit) break;
          offset += pageLimit;
        }
      } catch (error) {
        allCampaigns = [];
      }

      const assignedProjectIdSet = new Set(assignedProjectIds);
      const staffCampaignNumberSet = new Set(staffDerivedCampaignNumbers);

      const scopedCampaigns = allCampaigns.filter((campaign) => {
        const matchesProject = !!campaign?.projectId && assignedProjectIdSet.has(campaign.projectId);
        const matchesCampaignNumber = !!campaign?.campaignNumber && staffCampaignNumberSet.has(campaign.campaignNumber);
        return matchesProject || matchesCampaignNumber;
      });

      const resolvedCampaignIds = [...new Set(scopedCampaigns.map((campaign) => campaign?.id).filter(Boolean))];
      const resolvedCampaignNumbers = [...new Set(scopedCampaigns.map((campaign) => campaign?.campaignNumber).filter(Boolean))];

      sessionStorage.setItem(
        "HCM_ASSIGNED_CAMPAIGN_SCOPE",
        JSON.stringify({
          projectIds: assignedProjectIds,
          campaignNumbers: [...new Set(resolvedCampaignNumbers)],
          campaignIds: [...new Set(resolvedCampaignIds)],
        })
      );

      if (!cancelled) setIsAssignmentScopeReady(true);
    };

    hydrateAssignmentScope();

    return () => {
      cancelled = true;
    };
  }, [
    shouldUseAssignmentScopedCampaigns,
    isProjectStaffLoading,
    isAssignedProjectsLoading,
    projectStaff,
    assignedProjectIds,
    tenantId,
  ]);

  const onTabChange = (n) => {
    // Prevent duplicate calls when clicking on the already active tab
    const isAlreadyActive = tabData?.find((tab) => tab.key === n)?.active;
    if (isAlreadyActive) {
      return;
    }
    sessionStorage.setItem("HCM_SELECTED_TAB_INDEX", n); // Save to sessionStorage
    setSelectedTabIndex(n);
    setTabData((prev) => prev?.map((i, c) => ({ ...i, active: c === n ? true : false })));
    setConfig(myCampaignConfigNew?.myCampaignConfigNew?.[n]);
  };
  // useEffect(() => {
  //   window.Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_FORM_DATA");
  //   window.Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_UPLOAD_ID");
  //   window.Digit.SessionStorage.del("HCM_CAMPAIGN_UPDATE_FORM_DATA");
  //   window.Digit.SessionStorage.del("HCM_ADMIN_CONSOLE_DATA");
  //   sessionStorage.removeItem("HCM_CAMPAIGN_NUMBER");
  //   window.Digit.SessionStorage.del("HCM_ADMIN_CONSOLE_UPLOAD_DATA");
  // }, []);

  // useEffect(() => {
  //   const handleStorageChange = () => {
  //     const newSession = Digit.SessionStorage.get("HCM_TIMELINE_POPUP");
  //     setSession(newSession);
  //     setTimeLine(newSession);
  //   };

  //   window.addEventListener("HCM_TIMELINE_POPUP_CHANGE", handleStorageChange);

  //   return () => {
  //     window.removeEventListener("HCM_TIMELINE_POPUP_CHANGE", handleStorageChange);
  //   };
  // }, [Digit.SessionStorage.get("HCM_TIMELINE_POPUP")]);

  if (!isConfigReady || !config || !isAssignmentScopeReady) {
    return <Loader page={true} variant={"PageLoader"} />;
  }
  return (
    <React.Fragment>
      <div className="digit-inbox-search-wrapper">
        <InboxSearchComposer configs={config} showTab={true} tabData={tabData} onTabChange={onTabChange} />
      </div>
    </React.Fragment>
  );
};

export default MyCampaignNew;
