import { useMutation } from "@tanstack/react-query";
import { createComplaintService } from "./services/complaintService";

const useCreateComplaint = (tenantId) => {
  return useMutation({
    mutationFn: (data) => createComplaintService(data, tenantId),
  });
};

export default useCreateComplaint;
