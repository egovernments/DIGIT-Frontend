import AttendanceService from "../../services/attendance/attendee_service/attendeeService";
import { useQuery,useMutation } from "react-query";
const useDeleteAttendeeFromRegister = ({ tenantId, config = {}}) => {
  return useMutation((data) => AttendanceService.delete(data, tenantId));
};

export default useDeleteAttendeeFromRegister;