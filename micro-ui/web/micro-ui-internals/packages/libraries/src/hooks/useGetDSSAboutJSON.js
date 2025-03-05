import { useQuery } from "@tanstack/react-query";

const useGetDSSAboutJSON = (tenantId) => {
  return useQuery({
    queryKey: ["About", tenantId],
    queryFn: () => Digit.MDMSService.getDSSAboutJSONData(tenantId),
  });
};

export default useGetDSSAboutJSON;