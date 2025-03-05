import { Surveys } from "../../services/elements/Surveys";
import { useMutation } from "@tanstack/react-query";

const useSubmitResponse = (filters, config) => {
    return useMutation({
        mutationFn: (filters) => Surveys.submitResponse(filters),
        ...config, // Spread any additional configuration passed to the hook
      });
    };

export default useSubmitResponse;
