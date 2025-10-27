import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch all pages in a flow
export const fetchFlowPages = createAsyncThunk(
  "flowPages/fetch",
  async ({ tenantId, campaignNumber, flowId, moduleName = "HCM-ADMIN-CONSOLE", masterName = "AppFlowConfig" }, { rejectWithValue }) => {
    try {
      const response = await Digit.CustomService.getResponse({
        url: "/mdms-v2/v2/_search",
        body: {
          MdmsCriteria: {
            tenantId: tenantId,
            schemaCode: `${moduleName}.${masterName}`,
            filters: {
              project: campaignNumber, // FIXED: Use parameter instead of hardcoding
            },
            isActive: true,
          },
        },
      });


      if (response?.mdms && response.mdms.length > 0) {
        // Extract all flows from MDMS response
        const flows = response.mdms?.[0]?.data?.flows || [];
        
        // Find the REGISTRATION flow and return its pages
        const registrationFlow = flows.find((flow) => flow?.id === flowId);
        const pages = registrationFlow?.pages || [];
        
        return pages;
      }

      return [];
    } catch (err) {
      console.error("Error fetching flow pages:", err);
      return rejectWithValue(err.message);
    }
  }
);

const flowPagesSlice = createSlice({
  name: "flowPages",
  initialState: {
    pages: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    clearFlowPages(state) {
      state.pages = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlowPages.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFlowPages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pages = action.payload;
      })
      .addCase(fetchFlowPages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearFlowPages } = flowPagesSlice.actions;
export default flowPagesSlice.reducer;