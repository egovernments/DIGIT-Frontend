import AttendanceService from "../../services/attendance/attendanceService";
import { useQuery } from "@tanstack/react-query";
const useAttendanceBoundaryRegisterSearch = ({data, params, config = {}}) => {
  return useQuery({
    queryKey: ["SEARCH_REGISTER_ATTENDANCE",data,config.queryKey],
    queryFn: () => AttendanceService.attendance_registers_Search({
      body: data,
      params,
    }),
    ...config,
  });
};

export default useAttendanceBoundaryRegisterSearch;