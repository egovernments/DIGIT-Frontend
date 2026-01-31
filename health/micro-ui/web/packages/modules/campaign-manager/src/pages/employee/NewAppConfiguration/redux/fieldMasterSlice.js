import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dummyFieldTypeConfig from "../configs/dummyFieldTypeConfig.json";

// Async thunk with status/error tracking
export const getFieldMaster = createAsyncThunk(
  "fieldTypeMaster/fetch",
  async ({ tenantId, moduleName = "HCM-ADMIN-CONSOLE", name = "FieldMaster", limit = 1000, mdmsContext }, { getState, rejectWithValue }) => {
    try {
      // Always check for 'fieldTypeMappingConfig' regardless of the master name
      const existing = getState()?.fieldTypeMaster?.byName?.fieldTypeMappingConfig;
      if (existing) return existing;

      const contextPath = mdmsContext || window?.globalConfigs?.getConfig("MDMS_V1_CONTEXT_PATH") || "egov-mdms-service";
      const url = `/${contextPath}/v1/_search`;

      const response = await Digit.CustomService.getResponse({
        url,
        body: {
          MdmsCriteria: {
            tenantId,
            moduleDetails: [
              {
                moduleName,
                masterDetails: [
                  {
                    name,
                    limit,
                  },
                ],
              },
            ],
          },
        },
      });
      const data = response?.MdmsRes?.[moduleName]?.[name] || [];
      return data;
    } catch (err) {
      // Fallback to dummy data on error
      console.error("Failed to fetch from MDMS, using fallback:", err);
      // Sort the fallback data alphabetically by type
      const sortedFallback = Array.isArray(dummyFieldTypeConfig)
        ? [...dummyFieldTypeConfig].sort((a, b) => {
            const typeA = a?.type?.toLowerCase() || "";
            const typeB = b?.type?.toLowerCase() || "";
            return typeA.localeCompare(typeB);
          })
        : dummyFieldTypeConfig;
      return sortedFallback;
    }
  }
);
const fieldMasterSlice = createSlice({
  name: "fieldTypeMaster",
  initialState: {
    byName: {},
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    clearFieldMasterData(state) {
      state.byName = {};
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFieldMaster.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getFieldMaster.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Sort the payload alphabetically by type before saving
        const sortedPayload = Array.isArray(action.payload)
          ? [...action.payload].sort((a, b) => {
              const typeA = a?.type?.toLowerCase() || "";
              const typeB = b?.type?.toLowerCase() || "";
              return typeA.localeCompare(typeB);
            })
          : action.payload;
        // Always save as 'fieldTypeMappingConfig' regardless of the master name
        state.byName.fieldTypeMappingConfig = sortedPayload;
      })
      .addCase(getFieldMaster.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearFieldMasterData } = fieldMasterSlice.actions;
export default fieldMasterSlice.reducer;
