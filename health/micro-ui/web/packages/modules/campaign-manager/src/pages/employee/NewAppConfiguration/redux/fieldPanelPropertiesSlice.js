import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Dummy panel properties config with tab structure
const dummyPanelConfig = {
  content: [
    {
      label: "fieldType",
      order: 1,
      fieldType: "fieldTypeDropdown",
      disableForRequired: true,
      visibilityEnabledFor: [],
    },
    {
      id: "label",
      label: "label",
      order: 2,
      bindTo: "label",
      fieldType: "text",
      defaultValue: "",
      conditionalField: [],
      showFieldOnToggle: false,
      visibilityEnabledFor: [],
    },
    {
      id: "helpText",
      label: "helpText",
      order: 3,
      bindTo: "helpText",
      fieldType: "toggle",
      defaultValue: "",
      conditionalField: [
        {
          type: "text",
          bindTo: "helpText",
        },
      ],
      showFieldOnToggle: true,
      visibilityEnabledFor: [],
    },
    {
      id: "required",
      label: "Mandatory",
      order: 4,
      bindTo: "required",
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
      label: "prefixText",
      order: 5,
      bindTo: "prefixText",
      fieldType: "toggle",
      conditionalField: [
        {
          type: "text",
          bindTo: "prefixText",
        },
      ],
      defaultValue: "",
      showFieldOnToggle: true,
      visibilityEnabledFor: ["numeric", "mobileNumber", "number", "text", "latLng", "dropdown", "administrativeArea"],
    },
    {
      id: "suffixText",
      label: "suffixText",
      order: 6,
      bindTo: "suffixText",
      fieldType: "toggle",
      conditionalField: [
        {
          type: "text",
          bindTo: "suffixText",
        },
      ],
      defaultValue: "",
      showFieldOnToggle: true,
      visibilityEnabledFor: ["numeric", "mobileNumber", "number", "textArea", "text", "latLng", "dropdown", "administrativeArea"],
    },
    {
      id: "minSearchChars",
      label: "minSearchChars",
      order: 7,
      bindTo: "toArray.minSearchChars",
      fieldType: "number",
      defaultValue: 0,
      conditionalField: [],
      showFieldOnToggle: true,
      visibilityEnabledFor: ["searchBar"],
    },
    {
      id: "filter",
      label: "filter",
      order: 8,
      bindTo: "dropDownOptions",
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
      id: "tooltip",
      label: "tooltip",
      order: 9,
      bindTo: "tooltip",
      fieldType: "toggle",
      conditionalField: [
        {
          type: "text",
          bindTo: "tooltip",
        },
      ],
      defaultValue: "",
      showFieldOnToggle: true,
      visibilityEnabledFor: [],
    },
    {
      id: "readOnly",
      label: "readOnly",
      order: 10,
      bindTo: "readOnly",
      fieldType: "toggle",
      defaultValue: false,
      conditionalField: [],
      showFieldOnToggle: false,
      visibilityEnabledFor: [],
    },
    {
      id: "hidden",
      label: "hidden",
      order: 11,
      bindTo: "hidden",
      fieldType: "toggle",
      defaultValue: false,
      conditionalField: [],
      showFieldOnToggle: false,
      visibilityEnabledFor: [],
    },
  ],
  validation: [
    {
      id: "scannerRegex",
      label: "ScannerRegexPattern",
      order: 1,
      bindTo: "toArray.pattern",
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
      label: "dependencyFieldWrapper",
      order: 2,
      bindTo: "visibilityCondition.expression",
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
    {
      id: "regex",
      label: "RegexPattern",
      order: 3,
      bindTo: "pattern",
      fieldType: "toggle",
      conditionalField: [
        {
          type: "radioOptions",
          label: "APPCONFIG_PATTERN",
          bindTo: "pattern",
          options: [
            {
              code: "CHARACTERONLY",
              pattern: "^[a-zA-Z]+$",
              description: "Alphabets only (uppercase and lowercase)",
            },
            {
              code: "NUMBERONLY",
              pattern: "^\\d+$",
              description: "Numbers only (0-9)",
            },
            {
              code: "ALPHANUMERICONLY",
              pattern: "^[a-zA-Z0-9]+$",
              description: "Letters and numbers only (no special characters)",
            },
          ],
          jsonPath: "pattern",
        },
        {
          type: "text",
          label: "APPCONFIG_CUSTOM_PATTERN",
          bindTo: "pattern",
        },
        {
          type: "text",
          label: "APPCONFIG_ERRORMESSAGE",
          bindTo: "pattern.message",
        },
      ],
      showFieldOnToggle: true,
      visibilityEnabledFor: ["text"],
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
