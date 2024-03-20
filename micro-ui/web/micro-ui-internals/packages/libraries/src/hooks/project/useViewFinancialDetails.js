import { useQuery } from "react-query";
import { getFinancialDetails } from "../../services/molecules/Project/getFinancialDetails";

const useViewFinancialDetails = (t, tenantId="", projectID="", config = { cacheTime : 0 }) => {
    return useQuery(
        ["FINANCIAL_DETAILS", tenantId, projectID], getFinancialDetails)
}

export default useViewFinancialDetails;