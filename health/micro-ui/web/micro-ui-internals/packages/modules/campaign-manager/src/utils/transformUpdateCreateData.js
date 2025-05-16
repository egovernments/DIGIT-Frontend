export const transformUpdateCreateData = ({ campaignData }) => {
  const startDate = Digit.Utils.date.convertDateToEpoch(campaignData?.startDate);
  const endDate = Digit.Utils.date.convertDateToEpoch(campaignData?.endDate);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  return {
    CampaignDetails: {
      hierarchyType: campaignData?.hierarchyType,
      tenantId: tenantId,
      action: "create",
      parentId: null,
      campaignName: campaignData?.campaignName,
      campaignNumber: campaignData?.campaignNumber,
      deliveryRules: campaignData?.deliveryRules,
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
