import { useQuery } from "@tanstack/react-query";
import { searchTestResultData } from "./services/searchTestResultData";

export const useIndividualView = ({ individualId, tenantId, t, config = {} }) => {

  return useQuery({
    queryKey: ["INDIVIDUAL_DETAILS", tenantId, individualId],
    queryFn: () => searchTestResultData({ t, individualId, tenantId }),
    ...config,
  });
};
