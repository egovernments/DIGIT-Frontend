import React, { useEffect, useState } from "react";

const useComplaintSubType = (complaintType, t) => {
  const [subTypeMenu, setSubTypeMenu] = useState([]);

  useEffect(() => {
    (async () => {
      if (complaintType) {
        const stateId = Digit.Utils.getMultiRootTenant() ? Digit.ULBService.getStateId() : Digit.ULBService.getCurrentTenantId()
        const menu = await Digit.GetServiceDefinitions.getSubMenu(stateId, complaintType, t);
        setSubTypeMenu(menu);
      }
    })();
  }, [complaintType,t]);

  return subTypeMenu;
};

export default useComplaintSubType;
