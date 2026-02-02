import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const mdmsContext = window.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
// Async thunk to fetch page configuration (fields and metadata)
export const fetchPageFields = createAsyncThunk(
  "pageFields/fetch",
  async ({ tenantId, flow, campaignNumber, pageName, moduleName = "HCM-ADMIN-CONSOLE" }, { getState, rejectWithValue }) => {
    try {
      // Check if we already have this page's data cached
      const existing = getState()?.pageFields?.byPage?.[pageName];
      if (existing) {
        return { pageName, pageData: existing };
      }

      const response = await Digit.CustomService.getResponse({
        url: `/${mdmsContext}/v2/_search`,
        body: {
          MdmsCriteria: {
            tenantId: tenantId,
            schemaCode: `${moduleName}.TransformedFormConfig`,
            filters: {
              flow: flow,
              project: campaignNumber,
              page: pageName,
            },
            limit: 1000,
            isActive: true,
          },
        },
      });


      if (response?.mdms && response.mdms.length > 0) {
        // Extract the complete page data from MDMS response
        const pageData = response.mdms[0]?.data || {};
        return { pageName, pageData };
      }

      return { pageName, pageData: { body: [{ fields: [] }] } };
    } catch (err) {
      console.error(`Error fetching config for page ${pageName}:`, err);
      return rejectWithValue({ pageName, error: err.message });
    }
  }
);

const pageFieldsSlice = createSlice({
  name: "pageFields",
  initialState: {
    byPage: {}, // Store complete page data by page name
    loadingPages: {}, // Track loading state per page
    errors: {}, // Track errors per page
  },
  reducers: {
    clearPageFields(state, action) {
      if (action.payload) {
        // Clear specific page
        delete state.byPage[action.payload];
        delete state.loadingPages[action.payload];
        delete state.errors[action.payload];
      } else {
        // Clear all
        state.byPage = {};
        state.loadingPages = {};
        state.errors = {};
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPageFields.pending, (state, action) => {
        const pageName = action.meta.arg.pageName;
        state.loadingPages[pageName] = true;
        delete state.errors[pageName];
      })
      .addCase(fetchPageFields.fulfilled, (state, action) => {
        const { pageName, pageData } = action.payload;
        state.byPage[pageName] = pageData;
        state.loadingPages[pageName] = false;
      })
      .addCase(fetchPageFields.rejected, (state, action) => {
        const { pageName, error } = action.payload || {};
        if (pageName) {
          state.loadingPages[pageName] = false;
          state.errors[pageName] = error || "Failed to fetch page configuration";
        }
      });
  },
});

export const { clearPageFields } = pageFieldsSlice.actions;
export default pageFieldsSlice.reducer;