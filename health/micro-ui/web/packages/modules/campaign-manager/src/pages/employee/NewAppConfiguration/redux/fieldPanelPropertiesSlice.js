import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Dummy panel properties config with tab structure
const dummyPanelConfig = {
  content: [
    {
      id: "label",
      tab: "content",
      label: "label",
      order: 1,
      bindTo: "label",
      tabOrder: 1,
      fieldType: "text",
      defaultValue: "",
      conditionalField: [],
      showFieldOnToggle: false,
      visibilityEnabledFor: [],
    },
    {
      id: "helpText",
      tab: "content",
      label: "helpText",
      order: 2,
      bindTo: "helpText",
      tabOrder: 1,
      fieldType: "text",
      defaultValue: "",
      conditionalField: [],
      showFieldOnToggle: false,
      visibilityEnabledFor: [],
    },
    {
      tab: "content",
      label: "Mandatory",
      order: 3,
      bindTo: "required",
      tabOrder: 1,
      fieldType: "toggle",
      defaultValue: false,
      conditionalField: [
        {
          type: "text",
          label: "APPCONFIG_ERRORMESSAGE",
          bindTo: "required.message",
        },
      ],
      showFieldOnToggle: true,
      disableForRequired: true,
      visibilityEnabledFor: [
        "checkbox",
        "numeric",
        "dob",
        "date",
        "select",
        "dropdown",
        "mobileNumber",
        "number",
        "textArea",
        "text",
        "latLng",
        "administrativeArea",
        "searchableDropdown",
      ],
    },
    {
      id: "prefixText",
      tab: "content",
      label: "prefixText",
      order: 3,
      bindTo: "prefixText",
      tabOrder: 1,
      fieldType: "text",
      defaultValue: false,
      conditionalField: [],
      showFieldOnToggle: true,
      visibilityEnabledFor: ["numeric", "mobileNumber", "number", "text", "text", "latLng", "dropdown", "administrativeArea"],
    },
    {
      id: "suffixText",
      tab: "content",
      label: "suffixText",
      order: 4,
      bindTo: "suffixText",
      tabOrder: 1,
      fieldType: "text",
      defaultValue: false,
      conditionalField: [],
      showFieldOnToggle: true,
      visibilityEnabledFor: ["numeric", "mobileNumber", "number", "textArea", "text", "latLng", "dropdown", "administrativeArea"],
    },
    {
      id: "minSearchChars",
      tab: "content",
      label: "minSearchChars",
      order: 5,
      bindTo: "toArray.minSearchChars",
      tabOrder: 1,
      fieldType: "number",
      defaultValue: false,
      conditionalField: [],
      showFieldOnToggle: true,
      visibilityEnabledFor: ["searchBar"],
    },
    {
      id: "filter",
      tab: "content",
      label: "filter",
      order: 6,
      bindTo: "dropDownOptions",
      tabOrder: 1,
      fieldType: "toggle",
      defaultValue: false,
      conditionalField: [
        {
          type: "filters",
          label: "APPCONFIG_SELECT_SCHEMA",
          bindTo: "dropDownOptions",
          condition: true,
          mdmsOptions: [
            {
              masterName: "SEARCH_HOUSEHOLD_FILTERS",
              moduleName: "HCM",
              schemaCode: "HCM.SEARCH_HOUSEHOLD_FILTERS",
            },
          ],
        },
        {
          type: "options",
          bindTo: "dropDownOptions",
          condition: false,
        },
      ],
      showFieldOnToggle: true,
      visibilityEnabledFor: ["filter"],
    },
    {
      id: "helpText",
      tab: "advanced",
      label: "helpText",
      order: 1,
      bindTo: "helpText",
      tabOrder: 3,
      fieldType: "text",
      defaultValue: "",
      conditionalField: [],
      showFieldOnToggle: false,
      visibilityEnabledFor: [],
    },
    {
      id: "tooltip",
      tab: "advanced",
      label: "tooltip",
      order: 2,
      bindTo: "tooltip",
      tabOrder: 3,
      fieldType: "text",
      defaultValue: "",
      conditionalField: [],
      showFieldOnToggle: false,
      visibilityEnabledFor: [],
    },
    {
      id: "infoText",
      tab: "advanced",
      label: "infoText",
      order: 3,
      bindTo: "infoText",
      tabOrder: 3,
      fieldType: "text",
      defaultValue: "",
      conditionalField: [],
      showFieldOnToggle: false,
      visibilityEnabledFor: [],
    },
  ],
  validation: [
    {
      id: "required",
      tab: "validation",
      label: "required",
      order: 1,
      bindTo: "required",
      tabOrder: 2,
      fieldType: "toggle",
      defaultValue: false,
      conditionalField: [],
      showFieldOnToggle: false,
      visibilityEnabledFor: [],
    },
    {
      id: "readOnly",
      tab: "validation",
      label: "readOnly",
      order: 2,
      bindTo: "readOnly",
      tabOrder: 2,
      fieldType: "toggle",
      defaultValue: false,
      conditionalField: [],
      showFieldOnToggle: false,
      visibilityEnabledFor: [],
    },
    {
      id: "hidden",
      tab: "validation",
      label: "hidden",
      order: 3,
      bindTo: "hidden",
      tabOrder: 2,
      fieldType: "toggle",
      defaultValue: false,
      conditionalField: [],
      showFieldOnToggle: false,
      visibilityEnabledFor: [],
    },
    {
      id: "scannerRegex",
      tab: "validation",
      label: "ScannerRegexPattern",
      order: 4,
      bindTo: "toArray.pattern",
      tabOrder: 2,
      fieldType: "toggle",
      defaultValue: false,
      conditionalField: [
        {
          type: "text",
          label: "APPCONFIG_CUSTOM_PATTERN",
          bindTo: "toArray.pattern",
        },
        {
          type: "text",
          label: "APPCONFIG_ERRORMESSAGE",
          bindTo: "toArray.pattern.message",
        },
      ],
      showFieldOnToggle: true,
      visibilityEnabledFor: ["scanner"],
    },
    {
      id: "dependencyFieldWrapper",
      tab: "validation",
      label: "dependencyFieldWrapper",
      order: 5,
      bindTo: "visibilityCondition.expression",
      tabOrder: 2,
      fieldType: "toggle",
      defaultValue: false,
      conditionalField: [
        {
          type: "dependencyFieldWrapper",
          bindTo: "visibilityCondition.expression",
        },
      ],
      showFieldOnToggle: true,
      visibilityEnabledFor: [],
    },
  ],
};

// Async thunk with status/error tracking
export const getFieldPanelMaster = createAsyncThunk(
  "fieldPanelMaster/fetch",
  async ({ tenantId, moduleName, name, limit = 1000, mdmsContext }, { getState, rejectWithValue }) => {
    try {
      const existing = getState()?.fieldPanelMaster?.byName?.[name];
      if (existing) return existing;

      // For development, use dummy data
      if (name === "FieldPropertiesPanelConfig") {
        return dummyPanelConfig;
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
      // Fallback to dummy data on error
      if (name === "FieldPropertiesPanelConfig") {
        return dummyPanelConfig;
      }
      return rejectWithValue(err?.message || "Failed to fetch field master");
    }
  }
);

const fieldPanelMasterSlice = createSlice({
  name: "fieldPanelMaster",
  initialState: {
    byName: {},
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    clearFieldPanelMasterData(state) {
      state.byName = {};
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFieldPanelMaster.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getFieldPanelMaster.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { name } = action.meta.arg;
        state.byName[name] = action.payload;
      })
      .addCase(getFieldPanelMaster.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearFieldMasterData } = fieldPanelMasterSlice.actions;
export default fieldPanelMasterSlice.reducer;
