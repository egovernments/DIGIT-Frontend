import AttendanceService from "../../services/attendance/attendanceService";
import { useQuery } from "react-query";
const useAttendanceBoundaryRegisterSearch = ({data, params, config = {}}) => {
  return useQuery(["SEARCH_REGISTER_ATTENDANCE",data,config.queryKey], () => AttendanceService.attendance_registers_Search({
    body: data,
    params,
  }), { ...config });
};

export default useAttendanceBoundaryRegisterSearch;