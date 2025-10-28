import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useComplaintTypes = ({ stateCode }) => {
  const [complaintTypes, setComplaintTypes] = useState(null);
  const { t, i18n, ready } = useTranslation();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch menu function
  const fetchMenu = React.useCallback(async () => {
    console.log("🔄 [COMPLAINT-TYPES] Fetching menu with translations...");
    const res = await Digit.GetServiceDefinitions.getMenu(stateCode, t);
    let menu = res.filter((o) => o.key !== "");
    console.log(menu,"menu");

    menu.push({ key: "Others", name: t("SERVICEDEFS.OTHERS") });
    setComplaintTypes(menu);
    console.log("✅ [COMPLAINT-TYPES] Menu loaded with", menu.length, "items");
    return menu;
  }, [stateCode, t, refreshTrigger]);

  // Initial fetch - wait for i18next to be ready
  useEffect(() => {
    if (ready) {
      console.log("✅ [COMPLAINT-TYPES] i18next is ready, fetching menu");
      fetchMenu();
    } else {
      console.log("⏳ [COMPLAINT-TYPES] Waiting for i18next to be ready...");
    }
  }, [ready, fetchMenu]);

  // Listen for updates from workbench - ONLY refetch when event is triggered
  useEffect(() => {
    const handleUpdate = async (eventDetail) => {
      console.log("📨 [COMPLAINT-TYPES] Received localization update event", eventDetail);

      // Clear serviceDefs cache
      if (window.Digit?.SessionStorage) {
        window.Digit.SessionStorage.delete('serviceDefs');
        console.log("🗑️  [COMPLAINT-TYPES] Cleared serviceDefs from SessionStorage");
      }

      // Clear MDMS cache for ServiceDefs (this is the cached MDMS data)
      const tenantId = Digit.ULBService.getStateId();
      const mdmsKeys = Object.keys(localStorage).filter(key =>
        key.startsWith(`MDMS.${tenantId}.PGR.serviceDefs`)
      );

      console.log("🗑️  [COMPLAINT-TYPES] Clearing MDMS cache keys:", mdmsKeys);
      mdmsKeys.forEach(key => {
        localStorage.removeItem(key);
        console.log("   ✓ Removed:", key);
      });

      // Directly upsert localization into localStorage cache AND i18next
      if (eventDetail?.messages && eventDetail?.locale) {
        const { messages, locale } = eventDetail;
        const localeWithRegion = locale.indexOf(Digit.Utils.getLocaleRegion()) === -1
          ? locale + Digit.Utils.getLocaleRegion()
          : locale;

        console.log("💉 [COMPLAINT-TYPES] Upserting localization:", { messageCount: messages.length, locale: localeWithRegion });
        console.log("📝 [COMPLAINT-TYPES] Messages to upsert:", messages);

        // 1. Upsert into localStorage cache (for the module)
        const moduleKey = `Locale.${localeWithRegion}.rainmaker-pgr`;
        const existingCache = Digit.PersistantStorage.get(moduleKey) || [];

        console.log("📦 [COMPLAINT-TYPES] Existing cache:", existingCache.length, "messages");

        // Merge existing cache with new messages (upsert logic)
        const messageMap = new Map();
        existingCache.forEach(msg => messageMap.set(msg.code, msg));

        // Track which messages are new or updated
        const newMessages = [];
        const updatedMessages = [];
        messages.forEach(msg => {
          const existing = messageMap.get(msg.code);
          if (!existing) {
            newMessages.push(msg);
          } else if (existing.message !== msg.message) {
            updatedMessages.push({ old: existing.message, new: msg.message, code: msg.code });
          }
          messageMap.set(msg.code, msg);
        });

        const updatedCache = Array.from(messageMap.values());
        Digit.PersistantStorage.set(moduleKey, updatedCache);

        console.log("✅ [COMPLAINT-TYPES] Updated localStorage cache:", moduleKey);
        console.log("   📊 Total messages:", updatedCache.length);
        console.log("   ➕ New messages added:", newMessages.length, newMessages);
        console.log("   🔄 Messages updated:", updatedMessages.length, updatedMessages);

        // 2. Update the locale modules list
        const localeListKey = `Locale.${localeWithRegion}.List`;
        const modulesList = Digit.PersistantStorage.get(localeListKey) || [];
        if (!modulesList.includes('rainmaker-pgr')) {
          modulesList.push('rainmaker-pgr');
          Digit.PersistantStorage.set(localeListKey, modulesList);
        }

        // 3. Directly inject into i18next
        const localizationMap = {};
        messages.forEach(msg => {
          // Store with original MDMS key
          localizationMap[msg.code] = msg.message;

          // Also create SERVICEDEFS keys that the complaint page expects
          // Pattern: RAINMAKER-PGR-SERVICEDEFS-SERVICECODE-XXX -> SERVICEDEFS.XXX
          // Pattern: RAINMAKER-PGR-SERVICEDEFS-MENUPATH-XXX -> SERVICEDEFS.XXX
          const upperCode = msg.code.toUpperCase();
          if (upperCode.includes('SERVICEDEFS-SERVICECODE-')) {
            const serviceCode = msg.code.split(/SERVICEDEFS-SERVICECODE-/i)[1];
            localizationMap[`SERVICEDEFS.${serviceCode.toUpperCase()}`] = msg.message;
            console.log(`   🔗 Mapped: ${msg.code} → SERVICEDEFS.${serviceCode.toUpperCase()}`);
          } else if (upperCode.includes('SERVICEDEFS-MENUPATH-')) {
            const menuPath = msg.code.split(/SERVICEDEFS-MENUPATH-/i)[1];
            localizationMap[`SERVICEDEFS.${menuPath.toUpperCase()}`] = msg.message;
            console.log(`   🔗 Mapped: ${msg.code} → SERVICEDEFS.${menuPath.toUpperCase()}`);
          }
        });

        console.log("💉 [COMPLAINT-TYPES] Injecting into i18next...");
        console.log("   📝 Translations to inject:", localizationMap);

        if (window.i18next) {
          Object.keys(localizationMap).forEach(code => {
            const oldValue = window.i18next.t(code);
            window.i18next.addResource(localeWithRegion, 'translation', code, localizationMap[code]);
            const newValue = window.i18next.t(code);
            console.log(`   🔄 [${code}]: "${oldValue}" → "${newValue}"`);
          });
          console.log("✅ [COMPLAINT-TYPES] Successfully injected", Object.keys(localizationMap).length, "translations into i18next");
        } else {
          console.warn("⚠️  [COMPLAINT-TYPES] window.i18next not available");
        }

        // 4. Also use LocalizationService to update resources
        if (window.Digit?.LocalizationService) {
          window.Digit.LocalizationService.updateResources(localeWithRegion, updatedCache);
          console.log("✅ [COMPLAINT-TYPES] Updated via LocalizationService");
        }
      }

      // Trigger a refresh by changing the refresh trigger
      console.log("🔄 [COMPLAINT-TYPES] Triggering menu refresh...");
      setRefreshTrigger(prev => prev + 1);
    };

    // Listen to window custom event (for same page updates)
    const handleWindowEvent = (event) => {
      console.log("📨 [COMPLAINT-TYPES] Received window event");
      handleUpdate(event.detail);
    };

    // Listen to localStorage changes (for cross-tab updates)
    const handleStorageEvent = (event) => {
      if (event.key === 'pgr-localization-event' && event.newValue) {
        try {
          const eventData = JSON.parse(event.newValue);
          console.log("📨 [COMPLAINT-TYPES] Received localStorage event from another tab");
          handleUpdate(eventData);
        } catch (e) {
          console.error("Failed to parse storage event:", e);
        }
      }
    };

    console.log("👂 [COMPLAINT-TYPES] Setting up event listeners");
    window.addEventListener('pgr-localization-updated', handleWindowEvent);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      console.log("🔇 [COMPLAINT-TYPES] Removing event listeners");
      window.removeEventListener('pgr-localization-updated', handleWindowEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only set up once on mount

  return complaintTypes;
};

export default useComplaintTypes;
