import { Surveys } from "../../services/elements/Surveys";
import { useMutation } from "@tanstack/react-query";

const useUpdateSurvey = (filters, config) => {
  return useMutation({
    mutationFn: (filters) => Surveys.update(filters),
    ...config, // Spread any additional configuration passed to the hook
  });
};

export default useUpdateSurvey;
