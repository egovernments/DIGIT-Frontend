import { useMutation } from "react-query";
import ApplicationUpdateActionsEstimate from "../../services/molecules/Works/ApplicationUpdateActionsEstimate";

const useApplicationActionsEstimate = () => {
    return useMutation((applicationData) => ApplicationUpdateActionsEstimate(applicationData));
};

export default useApplicationActionsEstimate;
 