import AttendanceService from "../../services/attendance/attendee_service/attendeeService";
import { useMutation } from "@tanstack/react-query";
const usePaymentSetUpForCampaignUpdate = ({ tenantId, config = {}}) => {
  return useMutation({ mutationFn: (data) => AttendanceService.paymentSetUpUpdate(data, tenantId) });
};

export default usePaymentSetUpForCampaignUpdate;