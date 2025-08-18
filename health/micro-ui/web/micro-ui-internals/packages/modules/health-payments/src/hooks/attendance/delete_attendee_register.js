import AttendanceService from "../../services/attendance/attendanceService";
import { useQuery } from "react-query";
const useDeleteAttendeeFromRegister = ({data, params, config = {}}) => {
  return useQuery(["DELETE_ATTENDEE_REGISTER",data,config.queryKey], () => AttendanceService.deEnrollment_attendee({
    body: data,
    params,
  }), { ...config });
};

export default useDeleteAttendeeFromRegister;