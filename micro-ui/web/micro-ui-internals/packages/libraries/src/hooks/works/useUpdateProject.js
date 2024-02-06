import { WorksService } from "../../services/elements/Works";
import { useMutation } from "react-query";

const useUpdateProject=()=>{
    return useMutation((payload)=>{
       return WorksService.updateProject(payload);
    });
}

export default useUpdateProject;