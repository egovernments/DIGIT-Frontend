export const transformUpdateCreateData = ({ campaignData }) => {
  const startDate = Digit.Utils.date.convertDateToEpoch(campaignData?.startDate);
  const endDate = Digit.Utils.date.convertDateToEpoch(campaignData?.endDate);
  const tenantId = Digit.ULBService.getCurrentTenantId();

  function normalizeRangeConditions(cycleData) {
    const normalizeCondition = (condition) => {
      // Step 1: Normalize range expressions
      const patterns = [
        {
          regex: /(\d+)\s*<\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*<=\s*(\d+)/g,
          format: (_, low, varName, high) => `${low}<=${varName.toLowerCase()}and${varName.toLowerCase()}<=${high}`,
        },
        {
          regex: /(\d+)\s*<=\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*<\s*(\d+)/g,
          format: (_, low, varName, high) => `${low}<=${varName.toLowerCase()}and${varName.toLowerCase()}<${high}`,
        },
        {
          regex: /(\d+)\s*<\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*<\s*(\d+)/g,
          format: (_, low, varName, high) => `${low}<${varName.toLowerCase()}and${varName.toLowerCase()}<${high}`,
        },
        {
          regex: /(\d+)\s*<=\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*<=\s*(\d+)/g,
          format: (_, low, varName, high) => `${low}<=${varName.toLowerCase()}and${varName.toLowerCase()}<=${high}`,
        },
      ];

      for (const { regex, format } of patterns) {
        condition = condition.replace(regex, format);
      }

      return condition;
    };

    return cycleData.map((cycle) => ({
      ...cycle,
      deliveries: cycle?.deliveries.map((delivery) => ({
        ...delivery,
        doseCriteria: delivery.doseCriteria.map((criteria) => {
          // ...criteria,
          // condition: normalizeCondition(criteria.condition),
          let conditionString;

          const projectType = campaignData?.projectType;
          const originalCondition = criteria.condition;

          let memberCount, maxCount;

          // extract memberCount
          const memberMatch = originalCondition.match(/memberCount\s*(>=|<=|>|<|==)\s*([\d.]+)/i);
          if (memberMatch) {
            memberCount = memberMatch[2];
          }

          // extract maxCount
          const maxMatch = originalCondition.match(/maxCount\s*(>=|<=|>|<|==)\s*([\d.]+)/i);
          if (maxMatch) {
            maxCount = maxMatch[2];
          }
          if ( memberCount !== undefined && maxCount !== undefined) {
            conditionString = `MIN(CEIL(memberCount/${memberCount}), ${maxCount})`;
          } else {
            conditionString = normalizeCondition(criteria.condition);
          }
          return {
            ...criteria,
            condition: conditionString,
          };
        }),
      })),
    }));
  }

  const updatedDeliveryRules = campaignData?.deliveryRules?.map((rule, index) => {
    if (index === 0) {
      return {
        ...rule,
        cycles: normalizeRangeConditions(rule.cycles),
      };
    }
    return rule;
  });

  return {
    CampaignDetails: {
      hierarchyType: campaignData?.hierarchyType,
      tenantId: tenantId,
      action: "create",
      parentId: null,
      campaignName: campaignData?.campaignName,
      campaignNumber: campaignData?.campaignNumber,
      deliveryRules: updatedDeliveryRules,
      boundaries: campaignData?.boundaries,
      id: campaignData?.id,
      resources: campaignData?.resources,
      projectType: campaignData?.projectType,
      endDate: endDate,
      startDate: startDate,
      isActive: true,
      status: "drafted",
      additionalDetails: {
        beneficiaryType: campaignData?.additionalDetails?.beneficiaryType,
        key: 2,
        cycleData: {},
      },
    },
  };
};
