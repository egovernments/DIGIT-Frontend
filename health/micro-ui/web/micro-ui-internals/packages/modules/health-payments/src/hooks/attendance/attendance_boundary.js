import AttendanceService from "../../services/attendance/attendanceService";
import { useQuery } from "react-query";
const useAttendanceBoundarySearch = ({data, params, config = {}}) => {
  return useQuery(["SEARCH_BOUNDARY_ATTENDANCE",data,config.queryKey], () => AttendanceService.attendance_boundary_Search({
    body: data,
    params,
  }), { ...config });
};

export default useAttendanceBoundarySearch;