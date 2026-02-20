import AttendanceService from "../../services/attendance/attendanceService";
import { useQuery } from "@tanstack/react-query";
const useAttendanceBoundarySearch = ({data, params, config = {}}) => {
  return useQuery({
    queryKey: ["SEARCH_BOUNDARY_ATTENDANCE",data,config.queryKey,params],
    queryFn: () => AttendanceService.attendance_boundary_Search({
      body: data,
      params,
    }),
    ...config,
  });
};

export default useAttendanceBoundarySearch;