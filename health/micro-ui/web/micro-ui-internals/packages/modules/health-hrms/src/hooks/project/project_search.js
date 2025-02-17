import initializeHrmsModule from "../../services/hrms_initialization";
import { useQuery } from "react-query";

const useHrmsInitialization = ({ tenantId }) => {
  return useQuery(["HRMS_INITIALIZATION"], () => initializeHrmsModule({ tenantId }));
};

export default useHrmsInitialization;
