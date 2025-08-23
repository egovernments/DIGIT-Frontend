import { Surveys } from "../../services/elements/Surveys";
import { useMutation } from "@tanstack/react-query";

const useCreateSurveys = (filters, config) => {
  return useMutation({
    mutationFn: (filters) => Surveys.create(filters),
    ...config, // Spread any additional configuration passed to the hook
  });
};

export default useCreateSurveys;
