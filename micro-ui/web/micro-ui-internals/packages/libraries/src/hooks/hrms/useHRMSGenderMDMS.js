import { useQuery } from "@tanstack/react-query";
import { MdmsService } from "../../services/elements/MDMS";

const useHRMSGenderMDMS = (tenantId, moduleCode, type, config = {}) => {
  const useHRGenders = () => {
    return useQuery({
      queryKey: ['HR_GENDER_DETAILS'],
      queryFn: () => MdmsService.HRGenderType(tenantId, moduleCode, type),
      ...config,
    });
};
  

  switch (type) {
    case "GenderType":
      return useHRGenders();
  }
};



export default useHRMSGenderMDMS;