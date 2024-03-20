import { useQuery,useMutation } from "react-query";
import { WorksService } from "../../services/elements/Works";

const useSearchEstimate=(businessService = "WORKS")=>{
    return useMutation((data)=>WorksService.SearchEstimate(data,businessService));
}


export default useSearchEstimate; 