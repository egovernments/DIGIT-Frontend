import { CAMPAIGN_TEMPLATE_SCHEMA_CODE } from "../utils/campaignTemplate";

/**
 * The campaign type held by the template a campaign was created from.
 *
 * Shared by the three screens that configure delivery, so all of them resolve a template the same
 * way. Given no template id it asks for nothing and reports itself loaded, which leaves a campaign
 * created from scratch on exactly the path it is on today.
 *
 * Looked up by `data.id`, which a template sets to its own uniqueIdentifier.
 */
const useCampaignTemplate = (templateId) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const mdmsContextPath = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

  const { isLoading, data } = Digit.Hooks.useCustomAPIHook({
    url: `/${mdmsContextPath}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId,
        schemaCode: CAMPAIGN_TEMPLATE_SCHEMA_CODE,
        isActive: true,
        limit: 1,
        filters: { id: templateId },
      },
    },
    changeQueryName: `campaignTemplate-${templateId}`,
    config: {
      enabled: !!templateId,
      select: (response) => response?.mdms?.[0]?.data?.projectType,
    },
  });

  return {
    templateProjectType: data,
    // A disabled query still reports itself as loading, so without the id check every screen that
    // waits on this would wait forever for a request that is never sent.
    isTemplateLoading: !!templateId && isLoading,
  };
};

export default useCampaignTemplate;
