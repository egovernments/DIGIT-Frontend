import { Surveys } from "../../services/elements/Surveys";
import { useMutation } from "@tanstack/react-query";

const useShowResults = (filters, config) => {
  return useMutation({
    mutationFn: (filters) => Surveys.showResults(filters),
    ...config, // Spread any additional configuration passed to the hook
  });
};

export default useShowResults;
