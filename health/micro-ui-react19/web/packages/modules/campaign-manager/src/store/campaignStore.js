import { configureStore, createSlice } from "@reduxjs/toolkit";
import { getBoundaryData, setBoundaryData, clearAllBoundaryData } from "../utils/boundaryIndexedDB";

// --- Storage Keys (used as KEY_CONFIG references in useCampaignStore) ---
const STORAGE_KEYS = {
  FORM_DATA: "HCM_CAMPAIGN_MANAGER_FORM_DATA",
  ADMIN_CONSOLE: "HCM_ADMIN_CONSOLE_DATA",
  UPLOAD_ID: "HCM_CAMPAIGN_MANAGER_UPLOAD_ID",
  ADMIN_UPLOAD: "HCM_ADMIN_CONSOLE_UPLOAD_DATA",
  UNIFIED_UPLOAD: "HCM_ADMIN_CONSOLE_UNIFIED_UPLOAD_DATA",
  HIERARCHY: "HCM_CAMPAIGN_SELECTED_HIERARCHY",
  HIERARCHY_CODE: "HCM_CAMPAIGN_SELECTED_HIERARCHY_CODE",
  ATTENDANCE_REGISTER: "HCM_ATTENDANCE_REGISTER_DATA",
  ATTENDANCE_ATTENDEE: "HCM_ATTENDANCE_ATTENDEE_DATA",
  ATTENDANCE_UPLOAD: "HCM_ATTENDANCE_UPLOAD_DATA",
  CREATE_REGISTERS: "HCM_CREATE_REGISTERS_DATA",
  ADMIN_SETUP: "HCM_ADMIN_CONSOLE_SET_UP",
  CAMPAIGN_NAME_INFO: "CAMPAIGN_NAME_INFO_VISIBLE",
  TIMELINE_POPUP: "HCM_TIMELINE_POPUP",
  CAMPAIGN_NUMBER: "HCM_CAMPAIGN_NUMBER",
};

// Single IndexedDB key for all persisted state
const IDB_PERSIST_KEY = "CAMPAIGN_APP_STATE";

// --- Campaign Slice (consolidates campaignForm, adminConsole, upload, hierarchy, boundary, misc.adminSetup) ---
const campaignSlice = createSlice({
  name: "campaign",
  initialState: {
    metadata: null,            // was adminConsole.data (HCM_ADMIN_CONSOLE_DATA)
    formData: null,            // merges campaignForm.data + misc.adminSetup + upload.adminUploadData
    uploadMeta: null,          // was upload.uploadId (HCM_CAMPAIGN_MANAGER_UPLOAD_ID)
    unifiedUploadConfig: null, // was upload.unifiedUploadData (HCM_ADMIN_CONSOLE_UNIFIED_UPLOAD_DATA)
    hierarchy: null,           // was hierarchy.selectedHierarchy
    hierarchyCode: null,       // was hierarchy.selectedHierarchyCode
  },
  reducers: {
    setMetadata: (state, action) => {
      state.metadata = action.payload;
    },
    clearMetadata: (state) => {
      state.metadata = null;
    },
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
    clearFormData: (state) => {
      state.formData = null;
    },
    setUploadMeta: (state, action) => {
      state.uploadMeta = action.payload;
    },
    clearUploadMeta: (state) => {
      state.uploadMeta = null;
    },
    setUnifiedUploadConfig: (state, action) => {
      state.unifiedUploadConfig = action.payload;
    },
    clearUnifiedUploadConfig: (state) => {
      state.unifiedUploadConfig = null;
    },
    setHierarchy: (state, action) => {
      state.hierarchy = action.payload;
    },
    clearHierarchy: (state) => {
      state.hierarchy = null;
    },
    setHierarchyCode: (state, action) => {
      state.hierarchyCode = action.payload;
    },
    clearHierarchyCode: (state) => {
      state.hierarchyCode = null;
    },
    clearAllCampaignState: (state) => {
      state.metadata = null;
      state.formData = null;
      state.uploadMeta = null;
      state.unifiedUploadConfig = null;
      state.hierarchy = null;
      state.hierarchyCode = null;
    },
  },
});

// --- Attendance Slice (genuinely independent data) ---
const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    registerData: null,
    attendeeData: null,
    uploadData: null,
    createRegistersData: null,
  },
  reducers: {
    setAttendanceRegisterData: (state, action) => {
      state.registerData = action.payload;
    },
    clearAttendanceRegisterData: (state) => {
      state.registerData = null;
    },
    setAttendanceAttendeeData: (state, action) => {
      state.attendeeData = action.payload;
    },
    clearAttendanceAttendeeData: (state) => {
      state.attendeeData = null;
    },
    setAttendanceUploadData: (state, action) => {
      state.uploadData = action.payload;
    },
    clearAttendanceUploadData: (state) => {
      state.uploadData = null;
    },
    setCreateRegistersData: (state, action) => {
      state.createRegistersData = action.payload;
    },
    clearCreateRegistersData: (state) => {
      state.createRegistersData = null;
    },
    clearAllAttendanceData: (state) => {
      state.registerData = null;
      state.attendeeData = null;
      state.uploadData = null;
      state.createRegistersData = null;
    },
  },
});

// --- Hydration Slice (tracks whether IndexedDB hydration is complete) ---
const hydrationSlice = createSlice({
  name: "hydration",
  initialState: {
    hydrated: false,
  },
  reducers: {
    setHydrated: (state) => {
      state.hydrated = true;
    },
  },
});

// --- UI Slice (NOT persisted to IndexedDB — in-memory only) ---
const uiSlice = createSlice({
  name: "ui",
  initialState: {
    campaignNameInfoVisible: null,
    timelinePopup: null,
    campaignNumberInfo: null,
  },
  reducers: {
    setCampaignNameInfoVisible: (state, action) => {
      state.campaignNameInfoVisible = action.payload;
    },
    clearCampaignNameInfoVisible: (state) => {
      state.campaignNameInfoVisible = null;
    },
    setTimelinePopup: (state, action) => {
      state.timelinePopup = action.payload;
    },
    clearTimelinePopup: (state) => {
      state.timelinePopup = null;
    },
    setCampaignNumberInfo: (state, action) => {
      state.campaignNumberInfo = action.payload;
    },
    clearCampaignNumberInfo: (state) => {
      state.campaignNumberInfo = null;
    },
    clearAllUiData: (state) => {
      state.campaignNameInfoVisible = null;
      state.timelinePopup = null;
      state.campaignNumberInfo = null;
    },
  },
});

// --- Store Configuration ---
const campaignStore = configureStore({
  reducer: {
    campaign: campaignSlice.reducer,
    attendance: attendanceSlice.reducer,
    hydration: hydrationSlice.reducer,
    ui: uiSlice.reducer,
  },
});

// --- Hydration: Read single key from IndexedDB on app mount ---
async function hydrateFromIndexedDB() {
  try {
    const persisted = await getBoundaryData(IDB_PERSIST_KEY);
    if (persisted) {
      // Hydrate campaign slice
      if (persisted.campaign) {
        const c = persisted.campaign;
        if (c.metadata !== null && c.metadata !== undefined) campaignStore.dispatch(campaignSlice.actions.setMetadata(c.metadata));
        if (c.formData !== null && c.formData !== undefined) campaignStore.dispatch(campaignSlice.actions.setFormData(c.formData));
        if (c.uploadMeta !== null && c.uploadMeta !== undefined) campaignStore.dispatch(campaignSlice.actions.setUploadMeta(c.uploadMeta));
        if (c.unifiedUploadConfig !== null && c.unifiedUploadConfig !== undefined) campaignStore.dispatch(campaignSlice.actions.setUnifiedUploadConfig(c.unifiedUploadConfig));
        if (c.hierarchy !== null && c.hierarchy !== undefined) campaignStore.dispatch(campaignSlice.actions.setHierarchy(c.hierarchy));
        if (c.hierarchyCode !== null && c.hierarchyCode !== undefined) campaignStore.dispatch(campaignSlice.actions.setHierarchyCode(c.hierarchyCode));
      }
      // Hydrate attendance slice
      if (persisted.attendance) {
        const a = persisted.attendance;
        if (a.registerData !== null && a.registerData !== undefined) campaignStore.dispatch(attendanceSlice.actions.setAttendanceRegisterData(a.registerData));
        if (a.attendeeData !== null && a.attendeeData !== undefined) campaignStore.dispatch(attendanceSlice.actions.setAttendanceAttendeeData(a.attendeeData));
        if (a.uploadData !== null && a.uploadData !== undefined) campaignStore.dispatch(attendanceSlice.actions.setAttendanceUploadData(a.uploadData));
        if (a.createRegistersData !== null && a.createRegistersData !== undefined) campaignStore.dispatch(attendanceSlice.actions.setCreateRegistersData(a.createRegistersData));
      }
    }
  } catch (e) {
    console.warn("[campaignStore] IndexedDB hydration failed:", e);
  }
  campaignStore.dispatch(hydrationSlice.actions.setHydrated());
}

// --- Debounced Write-back to IndexedDB (single key) ---
let writeBackTimeout = null;
const WRITE_BACK_DELAY = 500;
let previousState = campaignStore.getState();

campaignStore.subscribe(() => {
  const currentState = campaignStore.getState();

  // Don't write-back during hydration
  if (!currentState.hydration.hydrated) {
    previousState = currentState;
    return;
  }

  // Only persist if campaign or attendance slices changed
  const campaignChanged = currentState.campaign !== previousState.campaign;
  const attendanceChanged = currentState.attendance !== previousState.attendance;

  if (!campaignChanged && !attendanceChanged) {
    previousState = currentState;
    return;
  }

  if (writeBackTimeout) {
    clearTimeout(writeBackTimeout);
  }
  writeBackTimeout = setTimeout(() => {
    const stateNow = campaignStore.getState();
    const persistPayload = {
      campaign: stateNow.campaign,
      attendance: stateNow.attendance,
    };
    setBoundaryData(IDB_PERSIST_KEY, persistPayload).catch(() => {});
    previousState = stateNow;
  }, WRITE_BACK_DELAY);
});

// --- Reset Actions ---
const resetSetupCampaignData = () => (dispatch) => {
  dispatch(campaignSlice.actions.clearFormData());
  dispatch(campaignSlice.actions.clearUploadMeta());
  dispatch(campaignSlice.actions.clearHierarchy());
  dispatch(campaignSlice.actions.clearHierarchyCode());
  dispatch(uiSlice.actions.clearTimelinePopup());
};

const resetCreateCampaignData = () => (dispatch) => {
  dispatch(campaignSlice.actions.clearMetadata());
  dispatch(campaignSlice.actions.clearFormData());
  dispatch(campaignSlice.actions.clearUploadMeta());
  dispatch(campaignSlice.actions.clearUnifiedUploadConfig());
  dispatch(attendanceSlice.actions.clearAllAttendanceData());
  dispatch(uiSlice.actions.clearCampaignNameInfoVisible());
  dispatch(uiSlice.actions.clearCampaignNumberInfo());
};

const resetAllCampaignData = () => (dispatch) => {
  dispatch(campaignSlice.actions.clearAllCampaignState());
  dispatch(attendanceSlice.actions.clearAllAttendanceData());
  dispatch(uiSlice.actions.clearAllUiData());
  // Also wipe all persisted data from IndexedDB
  clearAllBoundaryData().catch(() => {});
};

// --- Exports ---
export {
  campaignStore,
  STORAGE_KEYS,
  hydrateFromIndexedDB,
  // Reset thunks
  resetSetupCampaignData,
  resetCreateCampaignData,
  resetAllCampaignData,
};

// --- Backward-compatible action exports ---
// These map old names to the new consolidated slice actions.
// FORM_DATA, ADMIN_UPLOAD, and ADMIN_SETUP all map to the SAME setFormData/clearFormData.

// Campaign form data (all 3 duplicate keys map here)
export const setCampaignFormData = campaignSlice.actions.setFormData;
export const clearCampaignFormData = campaignSlice.actions.clearFormData;

// Admin console metadata
export const setAdminConsoleData = campaignSlice.actions.setMetadata;
export const clearAdminConsoleData = campaignSlice.actions.clearMetadata;

// Upload ID → uploadMeta
export const setUploadId = campaignSlice.actions.setUploadMeta;
export const clearUploadId = campaignSlice.actions.clearUploadMeta;

// Admin upload data → formData (same as setCampaignFormData)
export const setAdminUploadData = campaignSlice.actions.setFormData;
export const clearAdminUploadData = campaignSlice.actions.clearFormData;

// Unified upload data
export const setUnifiedUploadData = campaignSlice.actions.setUnifiedUploadConfig;
export const clearUnifiedUploadData = campaignSlice.actions.clearUnifiedUploadConfig;

// clearAllUploadData clears uploadMeta + unifiedUploadConfig + formData
export const clearAllUploadData = () => (dispatch) => {
  dispatch(campaignSlice.actions.clearUploadMeta());
  dispatch(campaignSlice.actions.clearFormData());
  dispatch(campaignSlice.actions.clearUnifiedUploadConfig());
};

// Hierarchy
export const setSelectedHierarchy = campaignSlice.actions.setHierarchy;
export const clearSelectedHierarchy = campaignSlice.actions.clearHierarchy;
export const setSelectedHierarchyCode = campaignSlice.actions.setHierarchyCode;
export const clearSelectedHierarchyCode = campaignSlice.actions.clearHierarchyCode;
export const clearAllHierarchyData = () => (dispatch) => {
  dispatch(campaignSlice.actions.clearHierarchy());
  dispatch(campaignSlice.actions.clearHierarchyCode());
};

// Boundary — removed as separate key; boundary data lives inside formData
// Keep exports for backward compat but they now point to formData
export const setBoundarySelectedData = campaignSlice.actions.setFormData;
export const clearBoundaryState = campaignSlice.actions.clearFormData;

// Admin setup → formData (same as setCampaignFormData)
export const setAdminSetup = campaignSlice.actions.setFormData;
export const clearAdminSetup = campaignSlice.actions.clearFormData;

// Attendance (unchanged)
export const {
  setAttendanceRegisterData,
  clearAttendanceRegisterData,
  setAttendanceAttendeeData,
  clearAttendanceAttendeeData,
  setAttendanceUploadData,
  clearAttendanceUploadData,
  setCreateRegistersData,
  clearCreateRegistersData,
  clearAllAttendanceData,
} = attendanceSlice.actions;

// UI slice (not persisted)
export const {
  setCampaignNameInfoVisible,
  clearCampaignNameInfoVisible,
  setTimelinePopup,
  clearTimelinePopup,
  setCampaignNumberInfo,
  clearCampaignNumberInfo,
  clearAllUiData,
} = uiSlice.actions;

// Legacy compat aliases
export const setBoundaryOptions = campaignSlice.actions.setFormData;
export const clearAllMiscData = () => (dispatch) => {
  dispatch(campaignSlice.actions.clearFormData());
  dispatch(uiSlice.actions.clearAllUiData());
};

export default campaignStore;
