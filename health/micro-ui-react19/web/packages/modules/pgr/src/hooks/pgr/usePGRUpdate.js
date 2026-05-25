import { useMutation } from "@tanstack/react-query";
import PGRService from "../../services/pgr/PGRService";

export const usePGRUpdate = (tenantId, config = {}) => {
  return useMutation({ mutationFn: (data) => PGRService.update(data, tenantId) });
};

export default usePGRUpdate;
