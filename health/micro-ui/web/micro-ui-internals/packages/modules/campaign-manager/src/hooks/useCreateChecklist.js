import { useMutation } from "react-query";
import createChecklistService from "./services/createChecklistService";

const useCreateChecklist = (tenantId) => {
  return useMutation((reqData) => {
    let val = createChecklistService(reqData, tenantId);
    val.then(result => {
    })
    return val;
  });
};

export default useCreateChecklist;
