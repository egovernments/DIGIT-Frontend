import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useComplaintsList = (tenantId, filters) => {
  // TODO: move city to state
  const client = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["complaintsList", filters],
    queryFn: () => Digit.PGRService.search(tenantId, filters),
  });  
  return { isLoading, error, data, revalidate: () => client.invalidateQueries(["complaintsList", filters]) };
};

export const useComplaintsListByMobile = (tenantId, mobileNumber) => {
  return useComplaintsList(tenantId, { mobileNumber });
};
