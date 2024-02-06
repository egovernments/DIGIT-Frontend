import { WorksService } from "../../services/elements/Works";
import { useMutation } from "react-query";

const useCreateEstimateNew = (businessService = "WORKS") => {
    return useMutation((data) => WorksService.createEstimate(data, businessService));
}

export default useCreateEstimateNew;