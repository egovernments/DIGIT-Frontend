import AttendanceService from "../../services/attendance/attendee_service/attendeeService";
import { useMutation } from "@tanstack/react-query";
const useMDMSRatesCreate = ({ tenantId, config = {}}) => {
  return useMutation({ mutationFn: (data) => AttendanceService.mdmsRatesCreate(data, tenantId) });
};

export default useMDMSRatesCreate;