import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Dummy panel properties config with tab structure
const dummyPanelConfig = {
  id: "NewPanelConfig",
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
      visibilityEnabledFor: ["numeric", "number", "text", "latLng", "dropdown", "administrativeArea"],
    },
    {
      id: "showCountryCode",
      label: "showCountryCode",
      order: 5,
      bindTo: "showCountryCodeDropdown",
      fieldType: "toggle",
      defaultValue: false,
      conditionalField: [
        {
          type: "text",
          label: "APPCONFIG_CUSTOM_PREFIX",
          bindTo: "prefixText",
          isLocalisable: false,
          // Prefix belongs with the country code being shown - surfacing it when
          // the toggle is OFF read as reversed behaviour
          condition: true,
        },
      ],
      showFieldOnToggle: true,
      visibilityEnabledFor: ["mobileNumber"],
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
      "id": "labelPairList",
      "label": "labelPairList",
      "order": 3,
      "bindTo": "data",
      "fieldType": "labelPairList",
      "defaultValue": "",
      "conditionalField": [],
      "showFieldOnToggle": false,
      "visibilityEnabledFor": [
        "labelPairList"
      ]
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
    {
      label: "isMdms",
      order: 12,
      fieldType: "toggle",
      defaultValue: false,
      bindTo: "isMdms",
      conditionalField: [
        {
          type: "dropdown",
          label: "APPCONFIG_SELECT_SCHEMA",
          bindTo: "schemaCode",
          jsonPath: "schemaCode",
          condition: true,
          options: [
            {
              masterName: "GenderType",
              moduleName: "common-masters",
              schemaCode: "common-masters.GenderType",
            },
            {
              masterName: "HOUSE_STRUCTURE_TYPES",
              moduleName: "HCM",
              schemaCode: "HCM.HOUSE_STRUCTURE_TYPES",
            },
            {
              masterName: "ID_TYPE_OPTIONS_POPULATOR",
              moduleName: "HCM",
              schemaCode: "HCM.ID_TYPE_OPTIONS_POPULATOR",
            },
            {
              masterName: "DELIVERY_COMMENT_OPTIONS_POPULATOR",
              moduleName: "HCM",
              schemaCode: "HCM.DELIVERY_COMMENT_OPTIONS_POPULATOR",
            },
            {
              masterName: "ServiceDefs",
              moduleName: "RAINMAKER-PGR",
              schemaCode: "RAINMAKER-PGR.ServiceDefs",
            },
            {
              masterName: "REFERRAL_REASONS",
              moduleName: "HCM",
              schemaCode: "HCM.REFERRAL_REASONS",
            },
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
      visibilityEnabledFor: ["dropdown", "radio", "select", "searchableDropdown"],
    },
    {
      id: "min",
      label: "min",
      order: 13,
      bindTo: "min",
      fieldType: "toggle",
      defaultValue: "",
      conditionalField: [
        {
          type: "number",
          bindTo: "min",
        },
      ],
      showFieldOnToggle: true,
      visibilityEnabledFor: [],
    },
    {
      id: "max",
      label: "max",
      order: 14,
      bindTo: "max",
      fieldType: "toggle",
      defaultValue: "",
      conditionalField: [
        {
          type: "number",
          bindTo: "max",
        },
      ],
      showFieldOnToggle: true,
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

// Property panels the console needs but that the MDMS master does not carry yet.
// A noResultCard (e.g. "Beneficiary Not Found" on the search screens) appears in
// Template Elements with nothing but the disabled field-type dropdown, so its
// heading and description cannot be edited at all. These are merged in only when
// the master has no entry with the same id, so the block turns into a no-op once
// FieldPropertiesPanelConfig is updated server-side.
const supplementalContentProperties = [
  {
    id: "noResultCardTitle",
    label: "noResultCardTitle",
    order: 33,
    bindTo: "label",
    fieldType: "text",
    maxLength: 40,
    defaultValue: "",
    isLocalisable: true,
    conditionalField: [],
    showFieldOnToggle: false,
    visibilityEnabledFor: ["noResultCard"],
  },
  {
    id: "noResultCardDescription",
    label: "noResultCardDescription",
    order: 34,
    bindTo: "description",
    fieldType: "textarea",
    maxLength: 150,
    defaultValue: "",
    isLocalisable: true,
    conditionalField: [],
    showFieldOnToggle: false,
    visibilityEnabledFor: ["noResultCard"],
  },
];

// Returns only content and validation: every other key becomes a tab in the drawer.
const withSupplementalProperties = (config) => {
  const content = config?.content || [];
  const missing = supplementalContentProperties.filter((item) => !content.some((existing) => existing?.id === item.id));
  return { content: [...content, ...missing], validation: config?.validation || [] };
};

// Async thunk with status/error tracking
export const getFieldPanelMaster = createAsyncThunk(
  "fieldPanelMaster/fetch",
  async (
    { tenantId, moduleName = "HCM-ADMIN-CONSOLE", name = "AppPanelMasters", limit = 1000, mdmsContext },
    { getState, rejectWithValue }
  ) => {
    try {
      // Always check for 'drawerPanelConfig' regardless of the master name
      const existing = getState()?.fieldPanelMaster?.byName?.drawerPanelConfig;
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
                  },
                ],
              },
            ],
          },
        },
      });
      const data = response?.MdmsRes?.[moduleName]?.[name] || [];

      // Extract the actual config from the MDMS response
      // MDMS returns an array with an object containing label, content, and validation
      // We only want content and validation, not the label (which would show up as a tab)
      if (Array.isArray(data) && data.length > 0 && data[0]?.content && data[0]?.validation) {
        const { content, validation } = data[0];
        return withSupplementalProperties({ content, validation });
      }

      // An empty master is as unusable as a failed call - the drawer would render no
      // tabs and no properties at all - so fall back rather than storing the empty array.
      return withSupplementalProperties(dummyPanelConfig);
    } catch (err) {
      // Fallback to dummy data on error
      console.error("Failed to fetch from MDMS, using fallback:", err);
      return withSupplementalProperties(dummyPanelConfig);
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
        // Always save as 'drawerPanelConfig' regardless of the master name
        state.byName.drawerPanelConfig = action.payload;
      })
      .addCase(getFieldPanelMaster.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearFieldMasterData } = fieldPanelMasterSlice.actions;
export default fieldPanelMasterSlice.reducer;
