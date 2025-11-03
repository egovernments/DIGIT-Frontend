import { useMutation } from "react-query";
import updateChecklistService from "./services/updateChecklistService";

const useUpdateChecklist = (tenantId) => {
  return useMutation((reqData) => {
    let val = updateChecklistService(reqData, tenantId);
    val.then(result => {
    })
    return val;
  });
};

export default useUpdateChecklist;
