import { useQuery } from "react-query";
import { sampleService } from "./services/sampleService";
import { searchContractResultData } from "./services/searchContractResultData";
export const useContractView = ({ t, contractIdentifier, tenantId, config = {} }) => {
  //console.log(props);
  console.log(contractIdentifier, "test");
  //   debugger;
  return useQuery(["Contract Details", contractIdentifier], () => searchContractResultData({ t, contractIdentifier, tenantId }), config);
};