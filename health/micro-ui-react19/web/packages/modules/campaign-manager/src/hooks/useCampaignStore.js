import { useCallback, useSyncExternalStore } from "react";
import {
  campaignStore,
  STORAGE_KEYS,
  setCampaignFormData,
  clearCampaignFormData,
  setAdminConsoleData,
  clearAdminConsoleData,
  setUploadId,
  clearUploadId,
  setUnifiedUploadData,
  clearUnifiedUploadData,
  setSelectedHierarchy,
  clearSelectedHierarchy,
  setSelectedHierarchyCode,
  clearSelectedHierarchyCode,
  setAttendanceRegisterData,
  clearAttendanceRegisterData,
  setAttendanceAttendeeData,
  clearAttendanceAttendeeData,
  setAttendanceUploadData,
  clearAttendanceUploadData,
  setCreateRegistersData,
  clearCreateRegistersData,
  setCampaignNameInfoVisible,
  clearCampaignNameInfoVisible,
  setTimelinePopup,
  clearTimelinePopup,
  setCampaignNumberInfo,
  clearCampaignNumberInfo,
} from "../store/campaignStore";

// Mapping from key -> { selector, setAction, clearAction }
// KEY DESIGN: FORM_DATA, ADMIN_SETUP, and ADMIN_UPLOAD all point to campaign.formData
const KEY_CONFIG = {
  // --- These 3 keys ALL point to campaign.formData (eliminates duplication) ---
  [STORAGE_KEYS.FORM_DATA]: {
    selector: (state) => state.campaign.formData,
    setAction: setCampaignFormData,
    clearAction: clearCampaignFormData,
  },
  [STORAGE_KEYS.ADMIN_SETUP]: {
    selector: (state) => state.campaign.formData,
    setAction: setCampaignFormData,
    clearAction: clearCampaignFormData,
  },
  [STORAGE_KEYS.ADMIN_UPLOAD]: {
    selector: (state) => state.campaign.formData,
    setAction: setCampaignFormData,
    clearAction: clearCampaignFormData,
  },

  // --- Unique keys ---
  [STORAGE_KEYS.ADMIN_CONSOLE]: {
    selector: (state) => state.campaign.metadata,
    setAction: setAdminConsoleData,
    clearAction: clearAdminConsoleData,
  },
  [STORAGE_KEYS.UPLOAD_ID]: {
    selector: (state) => state.campaign.uploadMeta,
    setAction: setUploadId,
    clearAction: clearUploadId,
  },
  [STORAGE_KEYS.UNIFIED_UPLOAD]: {
    selector: (state) => state.campaign.unifiedUploadConfig,
    setAction: setUnifiedUploadData,
    clearAction: clearUnifiedUploadData,
  },
  [STORAGE_KEYS.HIERARCHY]: {
    selector: (state) => state.campaign.hierarchy,
    setAction: setSelectedHierarchy,
    clearAction: clearSelectedHierarchy,
  },
  [STORAGE_KEYS.HIERARCHY_CODE]: {
    selector: (state) => state.campaign.hierarchyCode,
    setAction: setSelectedHierarchyCode,
    clearAction: clearSelectedHierarchyCode,
  },

  // --- Attendance (unchanged) ---
  [STORAGE_KEYS.ATTENDANCE_REGISTER]: {
    selector: (state) => state.attendance.registerData,
    setAction: setAttendanceRegisterData,
    clearAction: clearAttendanceRegisterData,
  },
  [STORAGE_KEYS.ATTENDANCE_ATTENDEE]: {
    selector: (state) => state.attendance.attendeeData,
    setAction: setAttendanceAttendeeData,
    clearAction: clearAttendanceAttendeeData,
  },
  [STORAGE_KEYS.ATTENDANCE_UPLOAD]: {
    selector: (state) => state.attendance.uploadData,
    setAction: setAttendanceUploadData,
    clearAction: clearAttendanceUploadData,
  },
  [STORAGE_KEYS.CREATE_REGISTERS]: {
    selector: (state) => state.attendance.createRegistersData,
    setAction: setCreateRegistersData,
    clearAction: clearCreateRegistersData,
  },

  // --- UI state (not persisted to IndexedDB) ---
  [STORAGE_KEYS.CAMPAIGN_NAME_INFO]: {
    selector: (state) => state.ui.campaignNameInfoVisible,
    setAction: setCampaignNameInfoVisible,
    clearAction: clearCampaignNameInfoVisible,
  },
  [STORAGE_KEYS.TIMELINE_POPUP]: {
    selector: (state) => state.ui.timelinePopup,
    setAction: setTimelinePopup,
    clearAction: clearTimelinePopup,
  },
  [STORAGE_KEYS.CAMPAIGN_NUMBER]: {
    selector: (state) => state.ui.campaignNumberInfo,
    setAction: setCampaignNumberInfo,
    clearAction: clearCampaignNumberInfo,
  },
};

// Stable subscribe reference for useSyncExternalStore
const subscribe = campaignStore.subscribe;

// Null selector for unknown keys
const NULL_SELECTOR = () => null;

/**
 * Hook that reads/writes campaign state from the campaignStore singleton.
 * Returns [value, setValue, clearValue].
 *
 * Uses useSyncExternalStore bound directly to the campaignStore — this makes
 * it work correctly even inside nested <Provider> trees (e.g. DeliverySetup's
 * own Redux store) that would otherwise shadow the campaign store.
 *
 * Usage:
 *   const [formData, setFormData, clearFormData] = useCampaignStore("HCM_CAMPAIGN_MANAGER_FORM_DATA");
 */
const useCampaignStore = (key, defaultValue = null) => {
  const config = KEY_CONFIG[key];
  const selectorFn = config ? config.selector : NULL_SELECTOR;

  const getSnapshot = useCallback(
    () => selectorFn(campaignStore.getState()),
    [selectorFn]
  );

  const reduxValue = useSyncExternalStore(subscribe, getSnapshot);

  const value = reduxValue !== null && reduxValue !== undefined ? reduxValue : defaultValue;

  const setValue = useCallback(
    (newValue) => {
      if (config) {
        const resolved = typeof newValue === 'function'
          ? newValue(selectorFn(campaignStore.getState()))
          : newValue;
        campaignStore.dispatch(config.setAction(resolved));
      }
    },
    [config, selectorFn]
  );

  const clearValue = useCallback(() => {
    if (config) {
      campaignStore.dispatch(config.clearAction());
    }
  }, [config]);

  return [value, setValue, clearValue];
};

export { useCampaignStore, KEY_CONFIG, STORAGE_KEYS };
export default useCampaignStore;
