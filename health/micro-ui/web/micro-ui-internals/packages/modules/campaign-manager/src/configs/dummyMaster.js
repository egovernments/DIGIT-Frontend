export const dummyMaster = {
  "HCM-ADMIN-CONSOLE": {
    AppFieldType: [
      {
        type: "dobPicker",
        appType: "dateFormPicker",
        metadata: {
          formDataType: "DateTime",
        },
      },
      {
        type: "datePicker",
        appType: "dobPicker",
        metadata: {
          formDataType: "DateTime",
        },
      },
      {
        type: "counter",
        appType: "integerFormPicker",
        metadata: {
          maximum: 10,
          minimum: 0,
          formDataType: "int",
          initialValue: 0,
        },
      },
      {
        type: "checkbox",
        appType: "selectionbox",
        metadata: {
          formDataType: "List<String>",
          allowMultipleSelection: true,
        },
        fieldRenameMap: {
          options: "menuItems",
        },
      },
      {
        type: "dropDown",
        appType: "dropdown",
        metadata: {
          formDataType: "String",
        },
        attributeToDelete: [],
        attributeToRename: {
          to: "menuItems",
          from: "options",
          optionalFunction: null,
        },
      },
      {
        type: "number",
        appType: "textField",
        metadata: {
          validation: [
            {
              key: "onlyDigits",
              pattern: "^\\d+$",
              errorMessage: "Digits only",
            },
          ],
          formDataType: "String",
          keyboardType: "number",
        },
      },
      {
        type: "textInput",
        appType: "textField",
        metadata: {
          validation: [
            {
              key: "onlyDigits",
              pattern: "^\\d+$",
              errorMessage: "Digits only",
            },
          ],
          formDataType: "String",
        },
      },
    ],
    AppScreenConfigTemplateSchema: [
      {
        name: "INDIVIDUAL_LOCATION",
        cards: [
          {
            fields: [],
            header: "Header",
            description: "Desc",
            headerFields: [
              {
                type: "text",
                label: "SECTION_HEADING",
                active: true,
                jsonPath: "SectionHeading",
                metaData: {},
                required: true,
              },
              {
                type: "text",
                label: "SECTION_DESCRIPTION",
                active: true,
                jsonPath: "Description",
                metaData: {},
                required: true,
              },
            ],
          },
        ],
        order: 4,
        config: {
          enableComment: true,
          enableFieldAddition: true,
          allowFieldsAdditionAt: ["body"],
          enableSectionAddition: true,
          allowCommentsAdditionAt: ["body"],
        },
        parent: "REGISTRATION",
        headers: [],
      },
      {
        name: "INDIVIDUAL_DETAIL",
        cards: [
          {
            fields: [],
            header: "Header",
            description: "Desc",
            headerFields: [
              {
                type: "text",
                label: "SECTION_HEADING",
                active: true,
                jsonPath: "SectionHeading",
                metaData: {},
                required: true,
              },
              {
                type: "text",
                label: "SECTION_DESCRIPTION",
                active: true,
                jsonPath: "Description",
                metaData: {},
                required: true,
              },
            ],
          },
        ],
        order: 3,
        config: {
          enableComment: true,
          enableFieldAddition: true,
          allowFieldsAdditionAt: ["body"],
          enableSectionAddition: true,
          allowCommentsAdditionAt: ["body"],
        },
        parent: "REGISTRATION",
        headers: [],
      },
      {
        name: "HOUSEHOLD_DETAILS",
        cards: [
          {
            fields: [
              {
                type: "text",
                label: "Apartment",
                active: true,
                jsonPath: "apartment",
                metaData: {},
                required: true,
                deleteFlag: false,
              },
            ],
            header: "Header",
            description: "Desc",
            headerFields: [
              {
                type: "text",
                label: "SCREEN_HEADING",
                active: true,
                jsonPath: "ScreenHeading",
                metaData: {},
                required: true,
              },
              {
                type: "text",
                label: "SCREEN_DESCRIPTION",
                active: true,
                jsonPath: "Description",
                metaData: {},
                required: true,
              },
            ],
          },
        ],
        order: 2,
        config: {
          enableComment: false,
          enableFieldAddition: true,
          allowFieldsAdditionAt: ["body"],
          enableSectionAddition: false,
          allowCommentsAdditionAt: ["body"],
        },
        parent: "REGISTRATION",
        headers: [],
      },
      {
        name: "HOUSEHOLD_LOCATION",
        cards: [
          {
            fields: [
              {
                type: "text",
                label: "Address Line 1",
                active: true,
                jsonPath: "addressLine1",
                metaData: {},
                required: true,
                deleteFlag: false,
              },
            ],
            header: "Header",
            description: "Desc",
            headerFields: [
              {
                type: "text",
                label: "SCREEN_HEADING",
                active: true,
                jsonPath: "ScreenHeading",
                metaData: {},
                required: true,
              },
              {
                type: "text",
                label: "SCREEN_DESCRIPTION",
                active: true,
                jsonPath: "Description",
                metaData: {},
                required: true,
              },
            ],
          },
        ],
        order: 1,
        config: {
          enableComment: false,
          enableFieldAddition: true,
          allowFieldsAdditionAt: ["body"],
          enableSectionAddition: false,
          allowCommentsAdditionAt: ["body"],
        },
        parent: "REGISTRATION",
        headers: [
          {
            type: "header",
            label: "KJHSJKDHKJH",
          },
          {
            type: "info",
            label: "KJHSJKDHKJH",
          },
          {
            type: "description",
            label: "KJHSJKDHKJH",
          },
        ],
      },
    ],
    DrawerPanelConfig: [
      {
        label: "innerLabel",
        fieldType: "toggle",
        defaultValue: false,
        visibilityEnabledFor: [],
      },
      {
        label: "helpText",
        fieldType: "toggle",
        defaultValue: false,
        visibilityEnabledFor: [],
      },
      {
        label: "label",
        fieldType: "toggle",
        defaultValue: false,
        visibilityEnabledFor: [],
      },
      {
        label: "Mandatory",
        fieldType: "toggle",
        defaultValue: false,
        visibilityEnabledFor: ["textInput", "dropDown"],
      },
      {
        label: "componentType",
        fieldType: "dropdown",
        defaultValue: false,
        visibilityEnabledFor: [],
      },
    ],
    AppScreenLocalisationConfig: [
      {
        fields: [
          {
            fieldType: "dropdown",
            localisableProperties: ["label", "options", "placeholder"],
          },
          {
            fieldType: "toggle",
            applicableFieldTypes: ["textField", "dropDown"],
          },
        ],
        screenName: "appScreenConfig",
        moduleVersion: "3",
        minModuleVersion: "1",
        LocalisationModule: "configure-app",
      },
    ],
  },
};
