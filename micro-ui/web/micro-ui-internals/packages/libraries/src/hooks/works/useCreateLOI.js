import { WorksService } from "../../services/elements/Works";
import { useMutation } from "react-query";

const useCreateLOI = () => {
    return useMutation((data) => WorksService.createLOI(data));
};

export default useCreateLOI;