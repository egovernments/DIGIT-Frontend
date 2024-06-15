import { useQuery } from "react-query";
import { searchTestResultData } from "./services/searchTestResultData";

export const useIndividualView = ({t,individualId,tenantId,config={} }) =>{
  //console.log(props);
  console.log(individualId,'test');
  return useQuery(["Individual Details"], () => searchTestResultData({ t, individualId, tenantId }), config);
};


