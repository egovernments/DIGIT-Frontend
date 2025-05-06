import { Engagement } from "../../services/elements/Engagement";
import { useMutation } from "@tanstack/react-query";

const useUpdateDocument = (filters, config) => {
  return useMutation({
    mutationFn: (filters) => Engagement.update(filters),
    ...config,
  });
};

export default useUpdateDocument;
