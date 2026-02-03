import AttendanceService from "../../services/attendance/attendee_service/attendeeService";
import { useQuery,useMutation } from "react-query";
const useCreateAttendeeFromRegister = ({ tenantId, config = {}}) => {
  return useMutation((data) => AttendanceService.create(data, tenantId));
};

export default useCreateAttendeeFromRegister;