import { useQuery, useQueryClient } from "@tanstack/react-query";

const useWorkflowDetails = ({ tenantId, id, moduleCode, role = "CITIZEN", serviceData = {}, getStaleData,  getTripData = false,config }) => {
  const queryClient = useQueryClient();

  const staleDataConfig = { staleTime: Infinity };

  const { isLoading, error, isError, data } = useQuery({
    queryKey: ["workFlowDetails", tenantId, id, moduleCode, role, config],
    queryFn: () => Digit.WorkflowService.getDetailsById({ tenantId, id, moduleCode, role, getTripData }),
    config: getStaleData ? { ...staleDataConfig, ...config } : config,
  });

  if (getStaleData) return { isLoading, error, isError, data };

  return { isLoading, error, isError, data, revalidate: () => queryClient.invalidateQueries(["workFlowDetails", tenantId, id, moduleCode, role]) };
};

export default useWorkflowDetails;
