import { useMutation } from "react-query";
import ApplicationUpdateActionsLOI from "../../services/molecules/Works/ApplicationUpdateActionsLOI";

const useApplicationActionsLOI = (businessService) => {
    return useMutation((applicationData) => ApplicationUpdateActionsLOI(applicationData, businessService));
};

export default useApplicationActionsLOI;
