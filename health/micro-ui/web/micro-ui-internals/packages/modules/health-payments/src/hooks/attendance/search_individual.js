import AttendanceService from "../../services/attendance/attendee_service/attendeeService";
import { useQuery,useMutation } from "react-query";
const useSearchIndividualForRegister = ({ tenantId, config = {}}) => {
  return useMutation((data) => AttendanceService.search(data, tenantId));
};

export default useSearchIndividualForRegister;