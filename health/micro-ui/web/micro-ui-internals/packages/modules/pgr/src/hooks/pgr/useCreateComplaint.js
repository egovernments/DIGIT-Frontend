import { useQuery, useMutation } from "react-query";
import PGRService from "../../services/pgr/PGRService";

export const useCreateComplaint = (tenantId, config = {}) => {
  return useMutation((data) => PGRService.create(data, tenantId));
};

export default useCreateComplaint;