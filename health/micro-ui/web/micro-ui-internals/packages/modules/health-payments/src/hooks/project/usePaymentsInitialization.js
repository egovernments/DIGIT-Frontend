import initializePaymentsModule from "../../services/PaymentsInitialization";
import { useQuery } from "react-query";

const usePaymentsInitialization = ({tenantId}) => {
  return useQuery(["PAYMENTS_INITIALIZATION",], () => initializePaymentsModule({tenantId}));
};

export default usePaymentsInitialization;