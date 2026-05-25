import AttendanceService from "../../services/attendance/attendee_service/attendeeService";
import { useMutation } from "@tanstack/react-query";
const useCreateAttendeeFromRegister = ({ tenantId, config = {}}) => {
  return useMutation({ mutationFn: (data) => AttendanceService.create(data, tenantId) });
};

export default useCreateAttendeeFromRegister;