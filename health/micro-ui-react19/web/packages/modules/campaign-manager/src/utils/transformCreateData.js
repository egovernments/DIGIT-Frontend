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
  const startDate =  getStartDateEpoch(totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate || params?.campaignDates?.startDate || params?.DateSelection?.startDate || formData?.DateSelection?.startDate);
  const endDate =  Digit.Utils.date.convertDateToEpoch(totalFormData?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate || params?.campaignDates?.endDate || params?.DateSelection?.endDate || formData?.DateSelection?.endDate);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const cycleDataFromForm =
    totalFormData?.HCM_CAMPAIGN_DATE?.additionalDetails?.cycleData?.cycleData ||
    params?.additionalDetails?.cycleData?.cycleData ||
    [];

  const cycleConfgureDateFromForm =
    totalFormData?.HCM_CAMPAIGN_DATE?.additionalDetails?.cycleData?.cycleConfgureDate ||
    params?.additionalDetails?.cycleData?.cycleConfgureDate ||
    {};

  // Detect hierarchy change — if the saved draft's hierarchyType differs from what the user just selected,
  // boundaries and resources are no longer valid and must be cleared.
  const hierarchyChanged = !!(params?.hierarchyType && hierarchyType && params.hierarchyType !== hierarchyType);

  // Transform resource types for API - unified-console should be sent as unified-console-resources
  const transformedResources = hierarchyChanged
    ? []
    : params?.resources?.map((resource) => ({
        ...resource,
        type: resource?.type === "unified-console" ? "unified-console-resources" : resource?.type,
      }));

  // Check if resources contain unified-console-resources type
  const hasUnifiedResource = totalFormData?.additionalDetails?.isUnifiedCampaign || false;
  // transformedResources?.some(
  //   (r) => r?.type === "unified-console" || r?.type === "unified-console-resources"
  // );

  return {
    CampaignDetails: {
      hierarchyType: hierarchyType,
      tenantId: tenantId,
      action: "draft",
      parentId: null,
      id: id,
      campaignName: totalFormData?.HCM_CAMPAIGN_NAME?.CampaignName || params?.CampaignName,
      resources: transformedResources,
      boundaries: hierarchyChanged ? [] : params?.boundaries,
      deliveryRules: id && (hasDateChanged || hierarchyChanged) ? [] : params?.deliveryRules,
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
        },
        isUnifiedCampaign: hasUnifiedResource,
      },
    },
  };
};
