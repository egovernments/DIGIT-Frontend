export const transformCreateData = ({totalFormData, hierarchyType , params , formData ,id , hasDateChanged}) => {
  function getStartDateEpoch(rawDate) {
  if (!rawDate) return null;

  let dateObj;

  // Case 1: ISO format "2025-07-27T00:00:00.000Z"
  if (rawDate.includes("T")) {
    dateObj = new Date(rawDate);
  } else {
    // Case 2: "2025-07-27"
    const [year, month, day] = rawDate.split("-").map(Number);
    dateObj = new Date(Date.UTC(year, month - 1, day)); // UTC midnight
  }

  return dateObj.getTime(); // Epoch in milliseconds
}
  const startDate =  getStartDateEpoch(totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate || formData?.DateSelection?.startDate || params?.DateSelection?.startDate);
  const endDate =  Digit.Utils.date.convertDateToEpoch(totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate || formData?.DateSelection?.endDate || params?.DateSelection?.endDate);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const cycleDataFromForm =
    totalFormData?.HCM_CAMPAIGN_DATE?.additionalDetails?.cycleData?.cycleData ||
    params?.additionalDetails?.cycleData?.cycleData ||
    [];

  const cycleConfgureDateFromForm =
    totalFormData?.HCM_CAMPAIGN_DATE?.additionalDetails?.cycleData?.cycleConfgureDate ||
    params?.additionalDetails?.cycleData?.cycleConfgureDate ||
    {};
  return {
    CampaignDetails: {
      hierarchyType: hierarchyType,
      tenantId: tenantId,
      action: "draft",
      parentId: null,
      id: id,
      campaignName: totalFormData?.HCM_CAMPAIGN_NAME?.CampaignName || params?.CampaignName,
      resources: params?.resources,
      boundaries: params?.boundaries,
      deliveryRules: id && hasDateChanged ? [] : params?.deliveryRules,
      projectType: totalFormData?.HCM_CAMPAIGN_TYPE?.CampaignType?.code || params?.CampaignType?.code || params?.CampaignType,
      endDate: endDate,
      startDate: startDate,
      isActive: true,
      status: "drafted",
      additionalDetails: {
        beneficiaryType: totalFormData?.HCM_CAMPAIGN_TYPE?.CampaignType?.beneficiaryType,
        key: 2,
        cycleData:{
          cycleData: cycleDataFromForm,
          cycleConfgureDate: cycleConfgureDateFromForm,
        }
      },
    },
  };
};
