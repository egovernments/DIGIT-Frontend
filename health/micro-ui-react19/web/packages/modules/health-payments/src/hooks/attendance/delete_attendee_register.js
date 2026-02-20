import AttendanceService from "../../services/attendance/attendee_service/attendeeService";
import { useMutation } from "@tanstack/react-query";
const useDeleteAttendeeFromRegister = ({ tenantId, config = {}}) => {
  return useMutation({ mutationFn: (data) => AttendanceService.delete(data, tenantId) });
};

export default useDeleteAttendeeFromRegister;