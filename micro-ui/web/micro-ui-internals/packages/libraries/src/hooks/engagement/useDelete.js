import { Engagement } from "../../services/elements/Engagement";
import { useMutation } from "@tanstack/react-query";

const useDelteDocument = (filters, config) => {
  return useMutation({
    mutationFn: (filters) => Engagement.delete(filters),
    ...config,
  });
};

export default useDelteDocument;
