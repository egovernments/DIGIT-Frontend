import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const MODULE_CONSTANTS = "HCM-ADMIN-CONSOLE";

// Async thunk to fetch localization data
export const fetchLocalization = createAsyncThunk("localization/fetch", async ({ tenantId, localeModule, currentLocale }, { rejectWithValue }) => {
  try {
    // Get current locale from parameter or session storage
    const locale = currentLocale || Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage;
    const localeString = typeof locale === 'string' ? locale : String(locale);

    const response = await Digit.CustomService.getResponse({
      url: "/localization/messages/v1/_search",
      params: { tenantId, module: localeModule, locale: localeString },
      body: {},
    });

    const result = [];
    response?.messages?.forEach(({ code, message, module }) => {
      let item = { code, module };
      item[localeString] = message;
      result.push(item);
    });

    return result;
  } catch (error) {
    return rejectWithValue(error.message || "Failed to fetch localization data");
  }
});

// Async thunk to fetch app screen localization config
export const fetchAppScreenConfig = createAsyncThunk("localization/fetchAppScreenConfig", async ({ tenantId }, { rejectWithValue }) => {
  try {
    const mdmsContext = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "egov-mdms-service";
    const url = `/${mdmsContext}/v1/_search`;

    const response = await Digit.CustomService.getResponse({
      url,
      body: {
        MdmsCriteria: {
          tenantId,
          moduleDetails: [
            {
              moduleName: MODULE_CONSTANTS,
              masterDetails: [
                {
                  name: "AppScreenLocalisationConfig",
                  limit: 1000,
                },
              ],
            },
          ],
        },
      },
    });
    const data = response?.MdmsRes?.[MODULE_CONSTANTS]?.["AppScreenLocalisationConfig"]?.[0] || null;
    return data;
  } catch (error) {
    return rejectWithValue(error.message || "Failed to fetch app screen config");
  }
});

// Async thunk to upsert localization
export const upsertLocalization = createAsyncThunk(
  "localization/upsert",
  async ({ tenantId, localeModule, currentLocale, data }, { rejectWithValue }) => {
    try {
      const response = await Digit.Hooks.campaign.useUpsertLocalisationParallel(tenantId, localeModule, currentLocale)(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to upsert localization");
    }
  }
);

const localizationSlice = createSlice({
  name: "localization",
  initialState: {
    data: [],
    appScreenConfig: null,
    currentLocale: null,
    localeModule: null,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
    screenConfigStatus: "idle",
    screenConfigError: null,
  },
  reducers: {
    setLocalizationData(state, action) {
      state.data = action.payload.localisationData || [];
      // Ensure currentLocale is a string
      state.currentLocale = typeof action.payload.currentLocale === 'string'
        ? action.payload.currentLocale
        : String(action.payload.currentLocale);
      state.localeModule = action.payload.localeModule;
    },
    addMissingKey(state, action) {
      const { code } = action.payload;
      const existing = state.data.find((item) => item.code === code);
      if (!existing) {
        // Use only currentLocale from state instead of enabledModules
        const localeKey = typeof state.currentLocale === 'string' ? state.currentLocale : String(state.currentLocale);
        const newEntry = { code, [localeKey]: "" };
        state.data.push(newEntry);
      }
    },
    updateLocalizationEntry(state, action) {
      const { code, locale, message } = action.payload;
      // Ensure locale is a string
      const localeKey = typeof locale === 'string' ? locale : String(locale);
      const existingIndex = state.data.findIndex((item) => item.code === code);

      if (existingIndex !== -1) {
        state.data[existingIndex][localeKey] = message;
      } else {
        state.data.push({ code, [localeKey]: message });
      }
    },
    removeLocalizationKey(state, action) {
      const { code } = action.payload;
      state.data = state.data.filter((item) => item.code !== code);
    },
    clearLocalizationData(state) {
      state.data = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch localization
      .addCase(fetchLocalization.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLocalization.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload || [];
      })
      .addCase(fetchLocalization.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      // Fetch app screen config
      .addCase(fetchAppScreenConfig.pending, (state) => {
        state.screenConfigStatus = "loading";
        state.screenConfigError = null;
      })
      .addCase(fetchAppScreenConfig.fulfilled, (state, action) => {
        state.screenConfigStatus = "succeeded";
        state.appScreenConfig = action.payload;
      })
      .addCase(fetchAppScreenConfig.rejected, (state, action) => {
        state.screenConfigStatus = "failed";
        state.screenConfigError = action.payload || action.error.message;
      })
      // Upsert localization
      .addCase(upsertLocalization.pending, (state) => {
        // Could add a separate loading state for upsert if needed
      })
      .addCase(upsertLocalization.fulfilled, (state, action) => {
        // Handle successful upsert if needed
      })
      .addCase(upsertLocalization.rejected, (state, action) => {
        // Handle upsert error if needed
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  setLocalizationData,
  addMissingKey,
  updateLocalizationEntry,
  removeLocalizationKey,
  clearLocalizationData,
} = localizationSlice.actions;

export default localizationSlice.reducer;
