import { useQuery } from "@tanstack/react-query";

const useCampaignTemplateSearch = ({ state }) => {
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const searchForm = state?.searchForm || {};

  const templateName = (searchForm.templateName || "").trim().toLowerCase();

  const campaignType = searchForm.campaignType;
  const campaignTypeCode = Array.isArray(campaignType)
    ? campaignType?.[0]?.code
    : campaignType?.code || (typeof campaignType === "string" ? campaignType : "");

  const disease = searchForm.disease;
  const diseaseCode = Array.isArray(disease)
    ? disease?.[0]?.code
    : disease?.code || (typeof disease === "string" ? disease : "");

  const filters = {};
  if (campaignTypeCode) filters.projectTypeCode = campaignTypeCode;
  if (diseaseCode) filters.diseaseCode = diseaseCode;

  const mdmsContextPath = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ["campaignTemplateSearch", tenantId, campaignTypeCode, diseaseCode],
    queryFn: async () => {
      const response = await Digit.CustomService.getResponse({
        url: `/${mdmsContextPath}/v2/_search`,
        body: {
          MdmsCriteria: {
            tenantId,
            schemaCode: "HCM-ADMIN-CONSOLE.campaignTypeTemplates",
            limit: 10000,
            isActive: true,
            ...(Object.keys(filters).length > 0 && { filters }),
          },
        },
        params: { tenantId },
      });
      return response;
    },
    staleTime: 0,
    cacheTime: 0,
  });

  const allTemplates = data?.mdms || [];
  const filteredTemplates = templateName
    ? allTemplates.filter((item) => (item?.data?.name || "").toLowerCase().includes(templateName))
    : allTemplates;

  return {
    data: { mdms: filteredTemplates, totalCount: filteredTemplates.length },
    isLoading,
    isFetching,
    refetch,
    error,
    revalidate: () => {},
  };
};

export default useCampaignTemplateSearch;
