import employeeDetailsFetch from "../../services/FetchEmployeeDetails";
import initializeHrmsModule from "../../services/HRMSInitialization";
import { useQuery } from "react-query";

const useHrmsEmployeeDetail = (userCode, tenantId ) => {
  
  return useQuery(["HRMS_EMP_DETAIL_INITIALIZATION",userCode], () => employeeDetailsFetch( userCode,tenantId ));
};

export default useHrmsEmployeeDetail;
