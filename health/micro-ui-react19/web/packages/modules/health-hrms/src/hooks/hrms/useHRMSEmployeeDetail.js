import { useQuery } from "@tanstack/react-query";
import employeeDetailsFetch from "../../services/FetchEmployeeDetails";

const useHrmsEmployeeDetail = (userCode, tenantId) => {
  return useQuery({
    queryKey: ["HRMS_EMP_DETAIL_INITIALIZATION", userCode],
    queryFn: () => employeeDetailsFetch(userCode, tenantId),
  });
};

export default useHrmsEmployeeDetail;
