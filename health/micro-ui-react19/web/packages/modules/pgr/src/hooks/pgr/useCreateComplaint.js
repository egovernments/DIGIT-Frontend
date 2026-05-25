import { useMutation } from "@tanstack/react-query";
import PGRService from "../../services/pgr/PGRService";

export const useCreateComplaint = (tenantId, config = {}) => {
  return useMutation({ mutationFn: (data) => PGRService.create(data, tenantId) });
};

export default useCreateComplaint;
