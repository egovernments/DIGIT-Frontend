import { useQuery } from "@tanstack/react-query";
const SERVICE_REQUEST_CONTEXT_PATH = window?.globalConfigs?.getConfig("SERVICE_REQUEST_CONTEXT_PATH") || "health-service-request";

const getServiceRequestContextCandidates = () => {
  const configured = (SERVICE_REQUEST_CONTEXT_PATH || "").replace(/^\/+|\/+$/g, "");
  const defaults = ["health-service-request", "service-request"];
  return [...new Set(configured ? [configured, ...defaults] : defaults)];
};

const isLocalProxyMethodFailure = (error) => {
  const responseData = error?.response?.data;
  if (typeof responseData !== "string") return false;
  return responseData.includes("Cannot POST") || responseData.includes("Cannot GET");
};

const shouldTryNextContext = (error) => {
  const status = error?.response?.status;
  if (!error?.response) return true;
  if (isLocalProxyMethodFailure(error)) return true;
  if (status === 404 || status === 405) return true;
  if (status === 401 || status === 403) return false;
  if (status >= 400 && status < 500) return false;
  if (status >= 500) return true;
  return false;
};

const toChecklistTypeCode = (value = "") => String(value).replace("HCM_CHECKLIST_TYPE_", "");
const toRoleCode = (value = "") => String(value).replace("ACCESSCONTROL_ROLES_ROLES_", "");

const buildServiceCode = (campaignName, checklistType, role) => {
  return `${campaignName}.${toChecklistTypeCode(checklistType)}.${toRoleCode(role)}`;
};

const resolveCampaignName = async ({ tenantId, campaignNumber, campaignId, fallbackCampaignName }) => {
  if (!tenantId) return fallbackCampaignName;
  try {
    const criteria = { tenantId };
    if (campaignNumber) {
      criteria.campaignNumber = campaignNumber;
    } else if (campaignId) {
      criteria.ids = [campaignId];
    } else {
      return fallbackCampaignName;
    }

    const response = await Digit.CustomService.getResponse({
      url: "/project-factory/v1/project-type/search",
      body: { CampaignDetails: criteria },
    });

    return response?.CampaignDetails?.[0]?.campaignName || fallbackCampaignName;
  } catch (error) {
    return fallbackCampaignName;
  }
};

const fetchServiceDefinition = async (serviceCodes, tenantId, limit) => {
  const body = {
    ServiceDefinitionCriteria: {
      tenantId: tenantId,
      code: serviceCodes,
    },
    includeDeleted: true,
  };
  if (limit) {
    body.Pagination = { limit, offset: 0 };
  }

  const contexts = getServiceRequestContextCandidates();
  let lastError = null;

  for (const contextPath of contexts) {
    try {
      const res = await Digit.CustomService.getResponse({
        url: `/${contextPath}/service/definition/v1/_search`,
        params: {},
        body,
      });
      return res?.ServiceDefinitions || [];
    } catch (error) {
      lastError = error;
      if (!shouldTryNextContext(error)) break;
    }
  }

  console.error("Error fetching service definition:", lastError);
  return [];
};

const mapExpectedServiceCodes = (mdmsData, campaignName) => {
  const expected = new Map();
  (mdmsData || []).forEach((item) => {
    const serviceCode = buildServiceCode(campaignName, item?.data?.checklistType, item?.data?.role);
    expected.set(item?.id, serviceCode);
  });
  return expected;
};

const useMDMSServiceSearch = ({
  url,
  params,
  body,
  config = {},
  plainAccessRequest,
  changeQueryName = "Random",
  state,
  campaignName: campaignNameProp,
  campaignType: campaignTypeProp,
  campaignNumber: campaignNumberProp,
  campaignId: campaignIdProp,
  serviceDefinitionLimit,
  enabled = true,
}) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const campaignName = campaignNameProp || searchParams.get("name");
  const campaignNumber = campaignNumberProp || searchParams.get("campaignNumber");
  const campaignId = campaignIdProp || searchParams.get("campaignId");
  const campaignType = campaignTypeProp || searchParams.get("projectType");
  const updatedMdmsCriteria = {
    ...(body?.MdmsCriteria || {}),
    filters: {
      ...(body?.MdmsCriteria?.filters || {}),
      campaignType,
    },
  };

  const fetchMDMSData = async () => {
    try {
      const mdmsResponse = await Digit.CustomService.getResponse({
        url: url,
        body: { MdmsCriteria: updatedMdmsCriteria },
        params: params,
      });

      const effectiveCampaignName = await resolveCampaignName({
        tenantId,
        campaignNumber,
        campaignId,
        fallbackCampaignName: campaignName,
      });

      const expectedCodeByMdmsId = mapExpectedServiceCodes(mdmsResponse?.mdms, effectiveCampaignName);
      const serviceCodes = [...new Set([...expectedCodeByMdmsId.values()].filter(Boolean))];
      const serviceData = await fetchServiceDefinition(serviceCodes, tenantId, serviceDefinitionLimit);
      const serviceByCode = new Map((serviceData || []).map((serviceDef) => [serviceDef?.code, serviceDef]));

      const mergedData = (mdmsResponse?.mdms || []).map((item) => {
        const expectedCode = expectedCodeByMdmsId.get(item?.id);
        const matchedService = expectedCode ? serviceByCode.get(expectedCode) : null;
        return {
          ...item,
          ServiceRequest: matchedService ? [matchedService] : [],
        };
      });

      return mergedData;
    } catch (error) {
      console.error("Error fetching MDMS data:", error);
      return [];
    }
  };

  const { data: mdmsData, isFetching, refetch, isLoading: isMDMSLoading, error: mdmsError } = useQuery({
    queryKey: ["mdmsData", tenantId, updatedMdmsCriteria, campaignName, campaignNumber, campaignId, serviceDefinitionLimit],
    queryFn: fetchMDMSData,
    gcTime: 0,
    enabled,
  });

  return {
    data: { mdmsData },
    isLoading: isMDMSLoading,
    error: mdmsError,
    refetch,
    isFetching,
    revalidate: () => {
      // final && client.invalidateQueries({ queryKey: [url].filter((e) => e) });
    },
  };
};

export default useMDMSServiceSearch;
