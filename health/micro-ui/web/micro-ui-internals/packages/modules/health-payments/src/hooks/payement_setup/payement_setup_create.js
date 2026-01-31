import AttendanceService from "../../services/attendance/attendee_service/attendeeService";
import { useQuery,useMutation } from "react-query";
const usePaymentSetUpForCampaign = ({ tenantId, config = {}}) => {
  return useMutation((data) => AttendanceService.paymentSetUpCreate(data, tenantId));
};

export default usePaymentSetUpForCampaign;