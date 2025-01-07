// hooks/useAttendanceWithUserDetails.js
import { useQuery } from "react-query";
import searchAttendanceWithUserDetails from "../hooks/services/searchAttendanceWithUserDetails";

const useAttendanceWithUserDetails = ({ tenantId, limit, offset, config = {} }) => {
  console.log("hook eorking");
  return useQuery(
    ["ATTENDANCE_WITH_USER_DETAILS", tenantId, limit, offset, config?.queryKey],
    () => searchAttendanceWithUserDetails({ tenantId, limit, offset }),
    {
        enabled: true,
        ...config,
    }
  );
};

export default useAttendanceWithUserDetails;