import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComplaintService } from "./services/complaintService";

const useUpdateComplaint = (tenantId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateComplaintService(data, tenantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pgr-search-complaints"] });
      queryClient.invalidateQueries({ queryKey: ["pgr-inbox"] });
    },
  });
};

export default useUpdateComplaint;
