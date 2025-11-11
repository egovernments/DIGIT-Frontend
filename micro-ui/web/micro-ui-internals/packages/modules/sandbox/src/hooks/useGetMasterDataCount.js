import { useQuery } from "react-query";
const getMasterDataCountService = async ({ filter, tenantId }) => {
  try {
    const response = await Digit.CustomService.getResponse({
      url: "/mdms-v2/v1/_count",
      body: {
        MdmsCriteria: {
          tenantId: tenantId,
          moduleDetails: filter,
        },
      },
      params: {},
    });
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.Errors?.[0].description);
  }
};

export const useGetMasterDataCount = ({ filter, tenantId, config = {} }) => {
  return useQuery(["GET_MASTER_DATA_COUNT"], () => getMasterDataCountService({ filter, tenantId }), config);
};
