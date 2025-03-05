import { useQuery } from "@tanstack/react-query";

const useGetDSSFAQsJSON = (tenantId) => {
  return useQuery({
    queryKey: ["FAQS", tenantId],
    queryFn: () => Digit.MDMSService.getDSSFAQsJSONData(tenantId),
  });
};

export default useGetDSSFAQsJSON;