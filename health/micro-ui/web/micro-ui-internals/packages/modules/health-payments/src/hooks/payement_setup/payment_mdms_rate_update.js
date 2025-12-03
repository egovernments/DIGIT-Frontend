import AttendanceService from "../../services/attendance/attendee_service/attendeeService";
import { useQuery,useMutation } from "react-query";
const useMDMSRatesUpdate = ({ tenantId, config = {}}) => {
  return useMutation((data) => AttendanceService.mdmsRatesUpdate(data, tenantId));
};

export default useMDMSRatesUpdate;