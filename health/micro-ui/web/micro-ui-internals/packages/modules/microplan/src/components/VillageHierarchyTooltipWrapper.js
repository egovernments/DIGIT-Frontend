import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader, TooltipWrapper } from "@egovernments/digit-ui-components";
import { InfoBannerIcon } from "@egovernments/digit-ui-react-components";

const VillageHierarchyTooltipWrapper = ({ boundaryCode,wrapperClassName}) => {
    const { t } = useTranslation();
    const { microplanId, campaignId } = Digit.Hooks.useQueryParams();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const userInfo = Digit.UserService.getUser();
    const [hierarchy, setHierarchy] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const roles = userInfo?.info?.roles?.map(item => item.code);

    // Fetch Plan Employee Details
    const { isLoading:isLoadingPlanEmployee, data: planEmployeeDetailsData } = Digit.Hooks.microplanv1.usePlanSearchEmployee({
        tenantId,
        body: {
            PlanEmployeeAssignmentSearchCriteria: {
                tenantId,
                planConfigurationId: microplanId,
                employeeId: [userInfo.info.uuid],
                role: roles,
            },
        },
        config: {
            enabled: true,
            select: (data) => data?.PlanEmployeeAssignment?.[0],
        },
    });

    // Fetch Campaign Details
    const {isLoading:isLoadingCampaignObject, data: campaignObject } = Digit.Hooks.microplanv1.useSearchCampaign(
        {
            CampaignDetails: {
                tenantId,
                ids: [campaignId],
            },
        },
        {
            enabled: !!planEmployeeDetailsData,
        }
    );

    // Find hierarchy path
    useEffect(() => {
        if (campaignObject?.boundaries && planEmployeeDetailsData?.hierarchyLevel) {
            setIsLoading(true);
            const parentHierarchy = findHierarchyPath(
                boundaryCode,
                campaignObject.boundaries,
                planEmployeeDetailsData?.hierarchyLevel
            );
            setHierarchy(parentHierarchy);
            setIsLoading(false);
        }
    }, [campaignObject, planEmployeeDetailsData, boundaryCode]);

    // Utility to find the hierarchy path
    const findHierarchyPath = (boundaryCode, data, maxHierarchyLevel) => {
        const hierarchy = [];

        let currentNode = data.find(item => item.code === boundaryCode);

        while (currentNode) {
            hierarchy.unshift({ name: currentNode.name, type: currentNode.type });
            if (currentNode.type === maxHierarchyLevel) break;
            currentNode = data.find(item => item.code === currentNode.parent);
        }

        return hierarchy;
    };

    // Render Tooltip Content
    const tooltipContent =
  isLoading || isLoadingCampaignObject || isLoadingPlanEmployee
    ? t("LOADING")
    : hierarchy.length > 0
    ? hierarchy.map((item, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              flex: 1,
              textAlign: "left", 
            }}
          >
            {t(item.type)}:
          </span>
          <span
            style={{
              flex: 1, 
              textAlign: "left", 
            }}
          >
            {t(item.name)}
          </span>
        </div>
      ))
    : t("NO_DATA_AVAILABLE");



    return (
      <TooltipWrapper
        header={t(`HCM_MICROPLAN_VILLAGE_HIERARCHY_LABEL`)}
        placement="right"
        description={tooltipContent}
        wrapperClassName={wrapperClassName || ""}
      >
        <InfoBannerIcon fill={"#C84C0E"} />
      </TooltipWrapper>
    );
};

export default VillageHierarchyTooltipWrapper;
