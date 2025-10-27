import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useComplaintTypes = ({ stateCode }) => {
  const [complaintTypes, setComplaintTypes] = useState(null);
  const { t } = useTranslation();

  // Normal fetch on mount
  useEffect(() => {
    (async () => {
      const res = await Digit.GetServiceDefinitions.getMenu(stateCode, t);
      let menu = res.filter((o) => o.key !== "");
      menu.push({ key: "Others", name: t("SERVICEDEFS.OTHERS") });
      setComplaintTypes(menu);
    })();
  }, [t, stateCode]);

  // Listen for updates from workbench - ONLY refetch when event is triggered
  useEffect(() => {
    const handleUpdate = async () => {
      // Clear cache
      if (window.Digit?.SessionStorage) {
        window.Digit.SessionStorage.delete('serviceDefs');
      }

      // Refetch menu
      const res = await Digit.GetServiceDefinitions.getMenu(stateCode, t);
      let menu = res.filter((o) => o.key !== "");
      menu.push({ key: "Others", name: t("SERVICEDEFS.OTHERS") });
      setComplaintTypes(menu);
    };

    window.addEventListener('pgr-localization-updated', handleUpdate);

    return () => {
      window.removeEventListener('pgr-localization-updated', handleUpdate);
    };
  }, [stateCode, t]);

  return complaintTypes;
};

export default useComplaintTypes;
