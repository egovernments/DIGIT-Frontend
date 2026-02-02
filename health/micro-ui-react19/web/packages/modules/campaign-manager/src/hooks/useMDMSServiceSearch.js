import { useQuery } from "@tanstack/react-query";
const SERVICE_REQUEST_CONTEXT_PATH = window?.globalConfigs?.getConfig("SERVICE_REQUEST_CONTEXT_PATH") || "health-service-request";

const fetchServiceDefinition = async (serviceCodes, tenantId, limit) => {
  try {
    // Second API Call: Fetch Service Definitions
    const body = {
      ServiceDefinitionCriteria: {
        tenantId: tenantId,
        code: serviceCodes,
      },
      includeDeleted: true,
    };
    // Adding pagination if limit is provided
    if (limit) {
      body.Pagination = { limit, offset: 0 };
    }
    const res = await Digit.CustomService.getResponse({
      url: `/${SERVICE_REQUEST_CONTEXT_PATH}/service/definition/v1/_search`,
      params: {},
      body,
    });
    return res?.ServiceDefinitions;
  } catch (error) {
    console.error("Error fetching service definition:", error);
    return error;
  }
};

const mergeData = (mdmsData, campaignName) => {
  return mdmsData.map((item) => {
    const cl_code = item.data.checklistType.replace("HCM_CHECKLIST_TYPE_", "");
    const role_code = item.data.role.replace("ACCESSCONTROL_ROLES_ROLES_", "");
    const serviceCode = `${campaignName}.${cl_code}.${role_code}`;
    return serviceCode;
  });
};

const useMDMSServiceSearch = ({ url, params, body, config = {}, plainAccessRequest, changeQueryName = "Random", state, campaignName: campaignNameProp, campaignType: campaignTypeProp, serviceDefinitionLimit, enabled = true }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  // Using props if provided, otherwise fallback to URL params
  const campaignName = campaignNameProp || searchParams.get("name");
  const campaignType = campaignTypeProp || searchParams.get("projectType");
  const updatedMdmsCriteria = body?.MdmsCriteria;
  updatedMdmsCriteria.filters = { ...body?.MdmsCriteria?.filters, 
    campaignType
 };
  const fetchMDMSData = async () => {
    try {
      // First API Call: Fetch MDMS Data
      const mdmsResponse = await Digit.CustomService.getResponse({
        url: url,
        body: { MdmsCriteria: updatedMdmsCriteria },
        params: params,
      });

      // Second API Call: Merge MDMS Data with Service Definition
      const final = mergeData(mdmsResponse?.mdms,campaignName);
      const serviceData = await fetchServiceDefinition(final, tenantId, serviceDefinitionLimit);


      // Return a promise that resolves after both API calls are complete
      return new Promise((resolve) => {
        // Once the second call (`mergeData`) is done, resolve the final data

        // Merge the MDMS data with the service data
        const mergedData = mdmsResponse?.mdms.map((alldata) => ({
          ...alldata,
          ServiceRequest: serviceData?.filter((e) => e?.code?.includes(alldata?.data?.checklistType) && e?.code?.includes(alldata?.data?.role)),
        }));

        resolve(mergedData);
      });
    } catch (error) {
      console.error("Error fetching MDMS data:", error);
      return [];
    }
  };

  const { data: mdmsData, isFetching, refetch, isLoading: isMDMSLoading, error: mdmsError } = useQuery({
    queryKey:["mdmsData", tenantId, updatedMdmsCriteria, campaignName],
    queryFn:fetchMDMSData,
    gcTime:0,
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
