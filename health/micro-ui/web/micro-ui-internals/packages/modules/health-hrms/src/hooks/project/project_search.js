import initializeHrmsModule from "../../services/HRMSInitialization";
import { useQuery } from "react-query";

const useHrmsInitialization = ({ tenantId }) => {
  return useQuery(["HRMS_INITIALIZATION"], () => initializeHrmsModule({ tenantId }));
};

export default useHrmsInitialization;
