import AttendanceService from "../../services/attendance/attendee_service/attendeeService";
import { useMutation } from "@tanstack/react-query";
const useSearchIndividualForRegister = ({ tenantId, config = {}}) => {
  return useMutation({ mutationFn: (data) => AttendanceService.search(data, tenantId) });
};

export default useSearchIndividualForRegister;