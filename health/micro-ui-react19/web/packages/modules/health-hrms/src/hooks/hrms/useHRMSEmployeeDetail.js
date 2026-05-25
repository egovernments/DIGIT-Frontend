import employeeDetailsFetch from "../../services/FetchEmployeeDetails";
import { useQuery } from "@tanstack/react-query";

const useHrmsEmployeeDetail = (userCode, tenantId) => {
  return useQuery({
    queryKey: ["HRMS_EMP_DETAIL_INITIALIZATION", userCode],
    queryFn: () => employeeDetailsFetch(userCode, tenantId),
  });
};

export default useHrmsEmployeeDetail;
