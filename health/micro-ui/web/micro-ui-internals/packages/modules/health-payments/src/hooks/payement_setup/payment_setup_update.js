import AttendanceService from "../../services/attendance/attendee_service/attendeeService";
import { useQuery,useMutation } from "react-query";
const usePaymentSetUpForCampaignUpdate = ({ tenantId, config = {}}) => {
  return useMutation((data) => AttendanceService.paymentSetUpUpdate(data, tenantId));
};

export default usePaymentSetUpForCampaignUpdate;