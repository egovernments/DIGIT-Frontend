import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dummyFieldTypeConfig from "../dummyFieldTypeConfig.json";

// Async thunk with status/error tracking
export const getFieldMaster = createAsyncThunk(
  "fieldTypeMaster/fetch",
  async ({ tenantId, moduleName, name, limit = 1000, mdmsContext }, { getState, rejectWithValue }) => {
    console.log("namenamename", name);
    try {
      const existing = getState()?.fieldTypeMaster?.byName?.[name];
      if (existing) return existing;

      // For development, use dummy data for FieldTypeMappingConfig
      if (name === "FieldTypeMappingConfig") {
        return dummyFieldTypeConfig;
      }

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
      // Fallback to dummy data for FieldTypeMappingConfig on error
      if (name === "FieldTypeMappingConfig") {
        return dummyFieldTypeConfig;
      }
      return rejectWithValue(err?.message || "Failed to fetch field master");
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
        const { name } = action.meta.arg;
        state.byName[name] = action.payload;
      })
      .addCase(getFieldMaster.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearFieldMasterData } = fieldMasterSlice.actions;
export default fieldMasterSlice.reducer;
