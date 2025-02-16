import { useQuery, useQueryClient } from "react-query";
import { useState, useCallback, useEffect } from "react";

// const useMDMSServiceSearch = (campaignName, tenantId) => {

const useMDMSServiceSearch = ({ url, params, body, config = {}, plainAccessRequest, changeQueryName = "Random", state }) => {
    const queryClient = useQueryClient();
    const searchParams = new URLSearchParams(location.search);
    const [apiCache, setApiCache] = useState({});
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const campaignName = searchParams.get("campaignName");
    let response;
    const fetchMDMSData = useCallback(async () => {
        try {
            const response = await Digit.CustomService.getResponse({
                url: url,
                body: body,
                params: params
            }

            );
            console.log("ressssss", response);
            return response?.mdms || [];
        } catch (error) {
            console.error("Error fetching MDMS data:", error);
            return [];
        }
    }, []);

    const mergeData = async (mdmsData) => {
        console.log("merging", mdmsData);
        if (!mdmsData) return [];

        const newCrit = mdmsData.map((ele) => {
            const item = ele.data;
            const searchParams = new URLSearchParams(location.search);
            const campaignName = searchParams.get("name");

            const cl_code = item.checklistType.replace("HCM_CHECKLIST_TYPE_", "");
            const role_code = item.role.replace("ACCESSCONTROL_ROLES_ROLES_", "");
            const serviceCode = `${campaignName}.${cl_code}.${role_code}`;
            return serviceCode;
        });
        const serviceData = await fetchServiceDefinition(newCrit);

        const mergedData = mdmsData.map(alldata => ({ ...alldata, SVC: serviceData }));

        console.log("hehe", mergedData);

        return mergedData;
    };


    const fetchServiceDefinition = async (serviceCode) => {
        // console.log("this is gettgin called", serviceCode);
        // if (apiCache[serviceCode] && !apiCache[serviceCode].isLoading) {
        //   return apiCache[serviceCode];
        // }

        try {
            const res = await Digit.CustomService.getResponse({
                url: "/service-request/service/definition/v1/_search",
                params: {},
                body: {
                    ServiceDefinitionCriteria: {
                        tenantId: tenantId,
                        code: serviceCode
                    },
                    includeDeleted: true
                },
            });

            const newData = res?.ServiceDefinitions?.[0]
                ? {
                    isLoading: false,
                    isActive: res.ServiceDefinitions[0].isActive,
                    attributes: res.ServiceDefinitions[0].attributes
                }
                : { isLoading: false, isActive: false, attributes: null };

            setApiCache(prevCache => ({
                ...prevCache,
                [serviceCode]: newData
            }));
            return newData;
        } catch (error) {
            console.error("Error fetching service definition:", error);
            const errorData = { isLoading: false, isActive: false, attributes: null, error: true };
            setApiCache(prevCache => ({
                ...prevCache,
                [serviceCode]: errorData
            }));
            return errorData;
        }
    };

    const { data: mdmsData,isFetching,refetch, isLoading: isMDMSLoading, error: mdmsError } = useQuery(
        ["mdmsData", tenantId],
        fetchMDMSData,
        {
            staleTime: 24 * 60 * 60 * 1000, // 24 hours,
            select: async(mdms) => {
                const respo=await mergeData(mdms);
            console.log(respo);
            return respo;
            }
        }
    );

    console.log("mdms", mdmsData?.then(e=>e));

const final={mdmsData};
console.log(final);

    return {
        data: final,
        isLoading: isMDMSLoading ,
        error: mdmsError ,
        refetch,
        isFetching,
        revalidate: () => {
            // final && client.invalidateQueries({ queryKey: [url].filter((e) => e) });
          },
    };
};

export default useMDMSServiceSearch;