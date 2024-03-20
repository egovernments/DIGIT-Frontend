import { WorksService } from "../../services/elements/Works";
import { useMutation } from "react-query";

const useUpdateWO=()=>{
    return useMutation((payload)=>{
       return WorksService.updateWO(payload);
    });
}

export default useUpdateWO;