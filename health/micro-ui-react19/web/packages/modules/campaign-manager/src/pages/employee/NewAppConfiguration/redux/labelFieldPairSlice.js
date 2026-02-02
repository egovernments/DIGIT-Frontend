import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dummyLabelFieldPairConfigData from "../configs/dummyLabelFieldPairConfig.json";

// Extract the array from the dummy config object
const dummyLabelFieldPairConfig = dummyLabelFieldPairConfigData?.dummyLabelFieldConfig || [];

const mdmsContext = window.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

// Async thunk to fetch LabelFieldPairConfig from MDMS
export const getLabelFieldPairConfig = createAsyncThunk(
  "labelFieldPair/fetch",
  async (
    { tenantId, moduleName = "HCM-ADMIN-CONSOLE", schemaCode = "HCM-ADMIN-CONSOLE.LabelFieldPairConfig", limit = 1000 },
    { getState, rejectWithValue }
  ) => {
    try {
      // Check if we already have the config cached from MDMS
      const existing = getState()?.labelFieldPair;
      if (existing?.config && Array.isArray(existing.config) && existing.config.length > 0 && existing.dataSource === 'mdms') {
        return existing.config;
      }

      const response = await Digit.CustomService.getResponse({
        url: `/${mdmsContext}/v2/_search`,
        body: {
          MdmsCriteria: {
            tenantId: tenantId,
            schemaCode: schemaCode,
            limit: limit,
            isActive: true,
          },
        },
      });

      if (response?.mdms && Array.isArray(response.mdms) && response.mdms.length > 0) {
        // MDMS returns an array where each item has a 'data' property
        // Extract the 'data' from each item to create the config array
        const configData = response.mdms.map((item) => item.data).filter(Boolean);
        if (configData.length > 0) {
          return configData;
        }
      }

      // Reject when no MDMS data is found, will fallback to dummy in rejected case
      return rejectWithValue("No data found in MDMS");
    } catch (err) {
      console.error("Failed to fetch LabelFieldPairConfig from MDMS:", err);
      // Reject on error, will fallback to dummy in rejected case
      return rejectWithValue(err.message || "Failed to fetch from MDMS");
    }
  }
);

const labelFieldPairSlice = createSlice({
  name: "labelFieldPair",
  initialState: {
    config: [], // Initialize with empty array
    status: "idle", // idle | loading | succeeded | failed
    error: null,
    dataSource: null, // Track data source: 'mdms' | 'dummy' | null
  },
  reducers: {
    clearLabelFieldPairConfig(state) {
      state.config = [];
      state.status = "idle";
      state.error = null;
      state.dataSource = null;
    },
    setLabelFieldPairConfig(state, action) {
      // Ensure we're always storing an array
      state.config = Array.isArray(action.payload) ? action.payload : [];
      state.status = "succeeded";
      state.dataSource = "manual"; // Manually set config
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLabelFieldPairConfig.pending, (state) => {
        state.status = "loading";
        state.error = null;
        // Don't clear config or dataSource during loading
        // This prevents dummy data from being applied prematurely
      })
      .addCase(getLabelFieldPairConfig.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Store the array from MDMS
        state.config = Array.isArray(action.payload) ? action.payload : [];
        state.dataSource = "mdms"; // Mark as MDMS data
        state.error = null;
      })
      .addCase(getLabelFieldPairConfig.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
        // Only use dummy data on failure/error
        state.config = dummyLabelFieldPairConfig;
        state.dataSource = "dummy"; // Mark as dummy data
      });
  },
});

export const { clearLabelFieldPairConfig, setLabelFieldPairConfig } = labelFieldPairSlice.actions;
export default labelFieldPairSlice.reducer;