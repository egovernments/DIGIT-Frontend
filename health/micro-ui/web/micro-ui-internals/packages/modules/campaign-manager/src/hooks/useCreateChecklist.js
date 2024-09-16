import { useMutation } from "react-query";
import createChecklistService from "./services/createChecklistService";

const useCreateChecklist = (tenantId) => {
  return useMutation((reqData) => {
    let val = createChecklistService(reqData, tenantId);
    val.then(result => {
    })
    console.log("cehcklist returned value is", val);
    return val;
    return createChecklistService(reqData, tenantId);
  });
};

export default useCreateChecklist;
