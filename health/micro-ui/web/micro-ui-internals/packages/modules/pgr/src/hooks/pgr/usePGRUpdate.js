import { useQuery, useMutation } from "react-query";
import PGRService from "../../services/pgr/PGRService";

export const usePGRUpdate = (tenantId, config = {}) => {
  return useMutation((data) => PGRService.update(data, tenantId));
};

export default usePGRUpdate;