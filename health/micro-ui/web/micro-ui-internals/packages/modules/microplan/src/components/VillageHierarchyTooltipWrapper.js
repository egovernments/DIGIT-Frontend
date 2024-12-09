import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader, TooltipWrapper } from "@egovernments/digit-ui-components";
import { InfoBannerIcon } from "@egovernments/digit-ui-react-components";
import { InfoOutline } from "@egovernments/digit-ui-svg-components";

const VillageHierarchyTooltipWrapper = ({ boundaryCode,placement="right",wrapperClassName}) => {
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
            gap: "0.5rem", 
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              width: "50%", 
              textAlign: "left",
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {t(item.type)}:
          </span>
          <span
            style={{
              width: "50%", 
              textAlign: "left",
              wordBreak: "break-word",
              whiteSpace: "normal",
            }}
          >
            {t(item.name)}
          </span>
        </div>
      ))
    : t("HCM_MICROPLAN_NOT_ABLE_TO_FETCH_DETAILS");
  



    return (
      <TooltipWrapper
        header={t(`HCM_MICROPLAN_VILLAGE_HIERARCHY_LABEL`)}
        placement={placement}
        description={tooltipContent}
        wrapperClassName={`${wrapperClassName} tooltip-warpper-village-hierarchy`}
      >
        <InfoOutline fill={"#C84C0E"} width={"20px"} height={"20px"} />
      </TooltipWrapper>
    );
};

export default VillageHierarchyTooltipWrapper;
