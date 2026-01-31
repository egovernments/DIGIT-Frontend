import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const mdmsContext = window.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

// Async thunk to fetch all pages in a flow
export const fetchFlowPages = createAsyncThunk(
  "flowPages/fetch",
  async ({ tenantId, campaignNumber, flowId, moduleName = "HCM-ADMIN-CONSOLE", masterName = "AppFlowConfig" }, { rejectWithValue }) => {
    try {
      const response = await Digit.CustomService.getResponse({
        url: `/${mdmsContext}/v2/_search`,
        body: {
          MdmsCriteria: {
            tenantId: tenantId,
            schemaCode: `${moduleName}.${masterName}`,
            filters: {
              project: campaignNumber, 
              name: flowId
            },
            limit: 1000,
            isActive: true,
          },
        },
      });

      if (response?.mdms && response.mdms.length > 0) {
        // Find the flow object with matching flowId in data.name
        const targetFlow = response.mdms.find((item) => item?.data?.name === flowId);
        
        if (targetFlow && targetFlow.data && targetFlow.data.flows) {
          // Extract flows (not individual pages) as options
          const flowOptions = targetFlow.data.flows.map((subFlow) => {
            return {
              name: subFlow.name || subFlow.id, // Use flow name
              displayName: subFlow.name || subFlow.id,
              type: subFlow.type || "form", // Default to "form" if type not specified
              order: subFlow.order || 999,
              flowId: subFlow.id,
              // Include other flow-level properties
              roles: subFlow.roles || [],
              project: subFlow.project,
              indexRoute: subFlow.indexRoute,
              // Store the pages array in case needed for reference
              pages: subFlow.pages || []
            };
          });
          
          // Sort flows by order if order property exists
          flowOptions.sort((a, b) => {
            const orderA = a.order || 999;
            const orderB = b.order || 999;
            return orderA - orderB;
          });
          
          return flowOptions;
        }
      }

      console.warn(`No flow found with id: ${flowId}`);
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
    pages: [], // Note: This will now contain flows, not individual pages
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