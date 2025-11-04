import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dummyLabelFieldPairConfigData from "../configs/dummyLabelFieldPairConfig.json";

// Extract the array from the dummy config object
const dummyLabelFieldPairConfig = dummyLabelFieldPairConfigData?.dummyLabelFieldConfig || [];

const mdmsContext = window.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

// Async thunk to fetch LabelFieldPairConfig from MDMS
export const getLabelFieldPairConfig = createAsyncThunk(
  "labelFieldPair/fetch",
  async ({ tenantId, moduleName = "HCM-ADMIN-CONSOLE", schemaCode = "HCM-ADMIN-CONSOLE.LabelFieldPairConfig", limit = 1000 }, { getState, rejectWithValue }) => {
    try {
      // Check if we already have the config cached
      const existing = getState()?.labelFieldPair?.config;
      if (existing && Array.isArray(existing) && existing.length > 0) {
        console.log("Using cached config:", existing);
        return existing;
      }

      console.log("Fetching from MDMS...");
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

      console.log("MDMS Response:", response);

      if (response?.mdms && Array.isArray(response.mdms) && response.mdms.length > 0) {
        // MDMS returns an array where each item has a 'data' property
        // Extract the 'data' from each item to create the config array
        const configData = response.mdms.map(item => item.data).filter(Boolean);
        
        console.log("Extracted Config Data:", configData);
        
        if (configData.length > 0) {
          return configData;
        }
      }

      // Return dummy data if no data found
      console.log("No data from MDMS, using dummy config");
      return dummyLabelFieldPairConfig;
    } catch (err) {
      console.error("Failed to fetch LabelFieldPairConfig from MDMS, using fallback:", err);
      // Fallback to dummy data on error
      return dummyLabelFieldPairConfig;
    }
  } 
);

const labelFieldPairSlice = createSlice({
  name: "labelFieldPair",
  initialState: {
    config: dummyLabelFieldPairConfig, // Initialize with the ARRAY
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    clearLabelFieldPairConfig(state) {
      state.config = [];
      state.status = "idle";
      state.error = null;
    },
    setLabelFieldPairConfig(state, action) {
      // Ensure we're always storing an array
      state.config = Array.isArray(action.payload) ? action.payload : dummyLabelFieldPairConfig;
      state.status = "succeeded";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLabelFieldPairConfig.pending, (state) => {
        console.log("Loading label field pair config...");
        state.status = "loading";
        state.error = null;
      })
      .addCase(getLabelFieldPairConfig.fulfilled, (state, action) => {
        console.log("Label field pair config loaded:", action.payload);
        state.status = "succeeded";
        // Store the array
        state.config = Array.isArray(action.payload) ? action.payload : dummyLabelFieldPairConfig;
      })
      .addCase(getLabelFieldPairConfig.rejected, (state, action) => {
        console.log("Failed to load label field pair config");
        state.status = "failed";
        state.error = action.payload || action.error.message;
        // Keep dummy data on failure
        state.config = dummyLabelFieldPairConfig;
      });
  },
});

export const { clearLabelFieldPairConfig, setLabelFieldPairConfig } = labelFieldPairSlice.actions;
export default labelFieldPairSlice.reducer;