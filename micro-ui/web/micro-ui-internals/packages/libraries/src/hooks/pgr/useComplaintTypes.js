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
      console.log("📨 [COMPLAINT-TYPES] Received localization update event");

      // Clear serviceDefs cache
      if (window.Digit?.SessionStorage) {
        window.Digit.SessionStorage.delete('serviceDefs');
      }

      // Clear all localization cache for current locale
      const locale = Digit.StoreData.getCurrentLanguage();
      const localeWithRegion = locale.indexOf(Digit.Utils.getLocaleRegion()) === -1
        ? locale + Digit.Utils.getLocaleRegion()
        : locale;

      // Remove all locale cache keys from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(`Locale.${localeWithRegion}`)) {
          localStorage.removeItem(key);
          console.log("🗑️ [COMPLAINT-TYPES] Cleared cache:", key);
        }
      });

      // Force reload localization
      if (window.Digit?.LocalizationService) {
        console.log("🔄 [COMPLAINT-TYPES] Reloading localization...");
        await window.Digit.LocalizationService.getLocale({
          modules: ['rainmaker-pgr'],
          locale: localeWithRegion,
          tenantId: Digit.ULBService.getStateId()
        });
      }

      // Refetch menu with fresh translations
      console.log("🔄 [COMPLAINT-TYPES] Refetching menu...");
      const res = await Digit.GetServiceDefinitions.getMenu(stateCode, t);
      let menu = res.filter((o) => o.key !== "");
      menu.push({ key: "Others", name: t("SERVICEDEFS.OTHERS") });
      setComplaintTypes(menu);
      console.log("✅ [COMPLAINT-TYPES] Menu updated");
    };

    window.addEventListener('pgr-localization-updated', handleUpdate);

    return () => {
      window.removeEventListener('pgr-localization-updated', handleUpdate);
    };
  }, [stateCode, t]);

  return complaintTypes;
};

export default useComplaintTypes;
