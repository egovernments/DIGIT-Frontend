import AttendanceService from "../../services/attendance/attendee_service/attendeeService";
import { useMutation } from "@tanstack/react-query";
const usePaymentSetUpForCampaign = ({ tenantId, config = {}}) => {
  return useMutation({ mutationFn: (data) => AttendanceService.paymentSetUpCreate(data, tenantId) });
};

export default usePaymentSetUpForCampaign;