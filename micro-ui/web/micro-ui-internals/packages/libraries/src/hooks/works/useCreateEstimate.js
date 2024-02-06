import { WorksService } from "../../services/elements/Works";
import { useMutation } from "react-query";

const useCreateEstimate=(businessService = "WORKS")=>{
    return useMutation((data)=>WorksService.createEstimate(data,businessService));
}

export default useCreateEstimate;