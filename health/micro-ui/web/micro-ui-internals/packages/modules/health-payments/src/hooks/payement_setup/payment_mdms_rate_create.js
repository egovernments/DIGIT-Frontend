import AttendanceService from "../../services/attendance/attendee_service/attendeeService";
import { useQuery,useMutation } from "react-query";
const useMDMSRatesCreate = ({ tenantId, config = {}}) => {
  return useMutation((data) => AttendanceService.mdmsRatesCreate(data, tenantId));
};

export default useMDMSRatesCreate;