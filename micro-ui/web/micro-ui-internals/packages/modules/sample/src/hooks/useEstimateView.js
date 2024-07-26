import { useQuery } from "react-query";
import { sampleService } from "./services/sampleService";
import { searchEstimateResultData } from "./services/searchEstimateResultData";

export const useEstimateView = ({ t, estimateIdentifier, tenantId, config }) => {
  //console.log(props);
  console.log(estimateIdentifier, "estimateIdentifier");
  //   debugger;
  return useQuery(["Estimate Details", estimateIdentifier], () => searchEstimateResultData({ t, estimateIdentifier, tenantId }), config);
};
