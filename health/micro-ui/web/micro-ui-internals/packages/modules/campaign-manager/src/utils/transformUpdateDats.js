export const transformUpdateData = ({ totalFormData, hierarchyType, id }) => {
  const startDate = Digit.Utils.date.convertDateToEpoch(totalFormData?.HCM_CAMPAIGN_DATE?.DateSelection?.startDate);
  const endDate = Digit.Utils.date.convertDateToEpoch(totalFormData?.HCM_CAMPAIGN_DATE?.DateSelection?.endDate);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  return {
    CampaignDetails: {
      hierarchyType: hierarchyType,
      tenantId: tenantId,
      action: "draft",
      parentId: null,
      campaignName: totalFormData?.HCM_CAMPAIGN_NAME?.CampaignName,
      id: id,
      resources: [],
      projectType: totalFormData?.HCM_CAMPAIGN_TYPE?.CampaignType?.code,
      endDate: endDate,
      startDate: startDate,
      isActive: true,
      status: "drafted",
      additionalDetails: {
        beneficiaryType: totalFormData?.HCM_CAMPAIGN_TYPE?.CampaignType?.beneficiaryType,
        key: 2,
        cycleData: {},
      },
    },
  };
};
