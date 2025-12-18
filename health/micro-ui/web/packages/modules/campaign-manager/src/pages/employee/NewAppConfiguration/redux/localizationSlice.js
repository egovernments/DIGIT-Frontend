import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch localization data
export const fetchLocalization = createAsyncThunk(
  "localization/fetch",
  async ({ tenantId, localeModule, currentLocale }, { rejectWithValue }) => {
    try {
      const locale = currentLocale || Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage;

      const localeString = typeof locale === "string" ? locale : String(locale);

      const response = await Digit.CustomService.getResponse({
        url: "/localization/messages/v1/_search",
        params: {
          tenantId,
          module: localeModule,
          locale: localeString,
        },
        body: {},
      });

      return response?.messages || [];
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch localization");
    }
  }
);

// Async thunk to upsert localization
export const upsertLocalization = createAsyncThunk(
  "localization/upsert",
  async ({ tenantId, localeModule, currentLocale, data }, { rejectWithValue }) => {
    try {
      const response = await Digit.Hooks.campaign.useUpsertLocalisationParallel(tenantId, localeModule, currentLocale)(data);

      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to upsert localization");
    }
  }
);

const localizationSlice = createSlice({
  name: "localization",
  initialState: {
    data: [],
    currentLocale: null,
    localeModule: null,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    setLocalizationData(state, action) {
      state.data = action.payload.localisationData || [];
      state.currentLocale =
        typeof action.payload.currentLocale === "string" ? action.payload.currentLocale : String(action.payload.currentLocale);
      state.localeModule = action.payload.localeModule;
    },

    addMissingKey(state, action) {
      const { code } = action.payload;
      const exists = state.data.find((item) => item.code === code);

      if (!exists) {
        const localeKey = typeof state.currentLocale === "string" ? state.currentLocale : String(state.currentLocale);

        state.data.push({ code, [localeKey]: "" });
      }
    },

    updateLocalizationEntry(state, action) {
      const { code, locale, message } = action.payload;
      const localeKey = typeof locale === "string" ? locale : String(locale);

      const index = state.data.findIndex((item) => item.code === code);

      if (index !== -1) {
        state.data[index][localeKey] = message;
      } else {
        state.data.push({ code, [localeKey]: message });
      }
    },

    removeLocalizationKey(state, action) {
      state.data = state.data.filter((item) => item.code !== action.payload.code);
    },

    clearLocalizationData(state) {
      state.data = [];
      state.status = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchLocalization.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLocalization.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchLocalization.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(upsertLocalization.rejected, (state, action) => {
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
