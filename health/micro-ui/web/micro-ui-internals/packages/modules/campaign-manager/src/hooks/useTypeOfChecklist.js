import { useMutation } from "react-query";
import createTypeOfChecklist from "./services/createTypeOfChecklist";
import { result } from "lodash";

const useTypeOfChecklist = (tenantId) => {
  return useMutation((reqData) => {
    let ret = createTypeOfChecklist(reqData, tenantId);
    let val;
    ret.then(result => {
        val=result;
    })
    return val;
  });
};

export default useTypeOfChecklist;
