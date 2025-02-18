import { Engagement } from "../../services/elements/Engagement";
import { useMutation } from "@tanstack/react-query";

const useCreateDocument = (filters, config) => {
  return useMutation({
    mutationFn: (filters) => Engagement.create(filters),
    ...config,
  });
};

export default useCreateDocument;
