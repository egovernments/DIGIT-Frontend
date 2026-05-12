import AttendanceService from "../../services/attendance/attendee_service/attendeeService";
import { useMutation } from "@tanstack/react-query";
const useMDMSRatesUpdate = ({ tenantId, config = {}}) => {
  return useMutation({ mutationFn: (data) => AttendanceService.mdmsRatesUpdate(data, tenantId) });
};

export default useMDMSRatesUpdate;