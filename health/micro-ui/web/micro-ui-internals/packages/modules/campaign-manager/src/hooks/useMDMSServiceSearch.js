import { useQuery } from "react-query";
const SERVICE_REQUEST_CONTEXT_PATH = window?.globalConfigs?.getConfig("SERVICE_REQUEST_CONTEXT_PATH") || "health-service-request";

const fetchServiceDefinition = async (serviceCodes, tenantId) => {
  try {
    // Second API Call: Fetch Service Definitions
    const res = await Digit.CustomService.getResponse({
      url: `/${SERVICE_REQUEST_CONTEXT_PATH}/service/definition/v1/_search`,
      params: {},
      body: {
        ServiceDefinitionCriteria: {
          tenantId: tenantId,
          code: serviceCodes,
        },
        includeDeleted: true,
      },
    });
    return res?.ServiceDefinitions;
  } catch (error) {
    console.error("Error fetching service definition:", error);
    return error;
  }
};

const mergeData = (mdmsData) => {
  return mdmsData.map((item) => {
    const searchParams = new URLSearchParams(location.search);
    const campaignName = searchParams.get("name");

    const cl_code = item.data.checklistType.replace("HCM_CHECKLIST_TYPE_", "");
    const role_code = item.data.role.replace("ACCESSCONTROL_ROLES_ROLES_", "");
    const serviceCode = `${campaignName}.${cl_code}.${role_code}`;
    return serviceCode;
  });
};

const useMDMSServiceSearch = ({ url, params, body, config = {}, plainAccessRequest, changeQueryName = "Random", state }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const campaignType = searchParams.get("projectType");
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
      const final = mergeData(mdmsResponse?.mdms);
      const serviceData = await fetchServiceDefinition(final, tenantId);


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

  const { data: mdmsData, isFetching, refetch, isLoading: isMDMSLoading, error: mdmsError } = useQuery(
    ["mdmsData", tenantId, updatedMdmsCriteria],
    fetchMDMSData,
    {
      cacheTime: 0,
    }
  );

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
