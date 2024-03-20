import { WorksService } from "../../services/elements/Works";
import { useMutation } from "react-query";

const useCreateWO=()=>{
    return useMutation((payload)=>{
       return WorksService.createWO(payload);
    });
}

export default useCreateWO;