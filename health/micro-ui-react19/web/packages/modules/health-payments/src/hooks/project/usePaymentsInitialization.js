import initializePaymentsModule from "../../services/PaymentsInitialization";
import { useQuery } from "@tanstack/react-query";

const usePaymentsInitialization = ({tenantId}) => {
  return useQuery({
    queryKey: ["PAYMENTS_INITIALIZATION"],
    queryFn: () => initializePaymentsModule({tenantId}),
  });
};

export default usePaymentsInitialization;