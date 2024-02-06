import { WorksService } from "../../services/elements/Works";
import { useMutation } from "react-query";

const useCreateProject=()=>{
    return useMutation((payload)=>{
       return WorksService.createProject(payload);
    });
}

export default useCreateProject;