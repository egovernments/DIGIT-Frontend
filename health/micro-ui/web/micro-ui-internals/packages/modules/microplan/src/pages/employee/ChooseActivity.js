import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Loader, SVG } from "@egovernments/digit-ui-react-components";
import ActivityHomeCard from "../../components/ActivityCard";


const ChooseActivity = () => {
    const { t } = useTranslation();
    const { campaignId, microplanId,  } = Digit.Hooks.useQueryParams();
    const tenantId = Digit.ULBService.getStateId();
    const userInfo = Digit.UserService.getUser();
    const { isLoading: isLoadingPlanObject, data: planObject,} = Digit.Hooks.microplanv1.useSearchPlanConfig(
        {
          PlanConfigurationSearchCriteria: {
            tenantId,
            id: microplanId,
          },
        },
        {
          enabled: microplanId ? true : false,
        }
    );

    const { isLoading: isBusinessServiceLoading, data: workflowData, } = Digit.Hooks.useCustomAPIHook({
        url: "/egov-workflow-v2/egov-wf/businessservice/_search",
        params: {
          tenantId: tenantId,
          businessServices: "PLAN_CONFIGURATION",
        },
        config: {
          enabled: !isLoadingPlanObject && (planObject !== null || planObject !== undefined ),
          select: (data) => {
            const service = data.BusinessServices?.[0];
            const matchingState = service?.states.find((state) => state.applicationStatus === planObject?.status);
            return matchingState || null;
          },
        },
      });


      if(isLoadingPlanObject || isBusinessServiceLoading){
        return <Loader/>;
      }
      else{
      // Merged function to disable a card based on user roles and available actions in the current state
      const isCardDisabled = (validRoles = [], currentState) => {
      const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code) || [];

      // Check if user has any valid roles
      const hasValidRole = validRoles?.length > 0 && validRoles?.some(role => userRoles.includes(role));

      // Check if there are valid actions in the current state that match user roles
      const hasValidNextAction = currentState?.actions?.some(action =>
        action?.roles.some(role => userRoles?.includes(role))
      );

      // Disable if either hasValidRole or hasValidNextAction is false
      return !(hasValidRole && hasValidNextAction);
};

// Usage in activityCardData
    const activityCardData = [
      {
        name: t("VALIDATE_N_APPROVE_POPULATION_DATA"),
        link: `pop-inbox?campaignId=${campaignId}&microplanId=${microplanId}`,
        icon: <SVG.Population height="36" width="36" />,
        disable: isCardDisabled(["POPULATION_DATA_APPROVER", "ROOT_POPULATION_DATA_APPROVER"], workflowData)
      },
      {
        name: t("ASSIGN_FACILITIES_TO_VILLAGE"),
        link: `assign-facilities-to-villages?campaignId=${campaignId}&microplanId=${microplanId}`,
        icon: <SVG.AssignmentTurnedIn height="36" width="36" />,
        disable: isCardDisabled(["FACILITY_CATCHMENT_MAPPER", "ROOT_FACILITY_CATCHMENT_MAPPER"], workflowData)
      },
      {
        name: t("VALIDATE_N_APPROVE_MICROPLAN_ESTIMATIONS"),
        link: `plan-inbox?campaignId=${campaignId}&microplanId=${microplanId}`,
        icon: <SVG.FactCheck height="36" width="36" />,
        disable: isCardDisabled(["PLAN_ESTIMATION_APPROVER", "ROOT_PLAN_ESTIMATION_APPROVER"], workflowData)
      },
      {
        name: t("GEOSPATIAL_MAP_VIEW"),
        link: null,
        icon: <SVG.LocationOn height="36" width="36" />,
        disable: isCardDisabled([], workflowData)
      },
      {
        name: t("VIEW_MICROPLAN_ESTIMATIONS"),
        link: `pop-inbox?campaignId=${campaignId}&microplanId=${microplanId}`,
        icon: <SVG.Visibility height="36" width="36" />,
        disable: isCardDisabled(["MICROPLAN_VIEWER"], workflowData)
      }
    ];


    return (
        <React.Fragment>
            <ActivityHomeCard title={t("SELECT_AN_ACTIVITY_TO_CONTINUE")} module={activityCardData}/>
        </React.Fragment>
    );
}
}

export default ChooseActivity;