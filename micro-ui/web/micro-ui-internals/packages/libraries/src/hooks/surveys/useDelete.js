import { Surveys } from "../../services/elements/Surveys";
import { useMutation } from "@tanstack/react-query";

const useDeleteSurveys = (filters, config) => {
  return useMutation({
    mutationFn: (filters) => Surveys.delete(filters),
    ...config, // Spread any additional configuration passed to the hook
  });
};

export default useDeleteSurveys;
