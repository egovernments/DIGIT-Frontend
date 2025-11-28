import { createSlice } from "@reduxjs/toolkit";
import dummyConfig from "../configs/dummyConfig.json";

// Slice for storing app config data
const remoteConfigSlice = createSlice({
  name: "remoteConfig",
  initialState: {
    remoteData: null,
    parentData: [],
    pageType: "object", // "object" or "template"
    responseData: null, // Store full MDMS response for updates
    // Drawer state for field selection and editing
    selectedField: null,
    selectedFieldPath: { cardIndex: null, fieldIndex: null }, // Store field path for O(1) updates
    currentScreen: null,
    currentCard: null,
    isFieldSelected: false,
    showAddFieldPopup: false,
    // Popup preview state for actionPopup fields
    showPopupPreview: false,
  },
  reducers: {
    initializeConfig(state, action) {
      const { pageConfig, responseData } = action.payload;
      if (pageConfig) {
        state.remoteData = pageConfig;
        state.currentData = pageConfig;
        state.pageType = pageConfig.type || "object"; // Extract pageType from config
        state.responseData = responseData || null; // Store full MDMS response
      } else {
        state.remoteData = dummyConfig;
        state.currentData = dummyConfig || {};
        state.pageType = dummyConfig?.type || "object";
        state.responseData = null;
      }
      // Clear field selection state when initializing new page config
      state.selectedField = null;
      state.selectedFieldPath = { cardIndex: null, fieldIndex: null };
      state.currentScreen = null;
      state.currentCard = null;
      state.isFieldSelected = false;
    },
    setRemoteData(state, action) {
      state.remoteData = action.payload;
    },
    setCurrentData(state, action) {
      state.currentData = action.payload || [];
    },
    // Field selection actions
    selectField(state, action) {
      const { field, screen, card, cardIndex, fieldIndex } = action.payload;

      // Check if this field is in footer
      const isFooterField =  field?.fieldName && state.currentData?.footer?.some(
        (f) => f.fieldName === field?.fieldName || f === field
      );

      let finalCardIndex = cardIndex;
      let finalFieldIndex = fieldIndex;

      if (isFooterField) {
        // For footer fields, use special markers
        finalCardIndex = -1; // Special marker for footer
        finalFieldIndex = state.currentData.footer.findIndex(
          (f) => f.fieldName === field?.fieldName || f === field
        );
      } else {
        // For body fields, use existing logic
        if (finalCardIndex === undefined || finalCardIndex === null) {
          finalCardIndex = state.currentData?.body?.findIndex(
            (c) => c.id === card?.id || c === card
          ) ?? -1;
        }

        if (finalFieldIndex === undefined || finalFieldIndex === null) {
          finalFieldIndex = card?.fields?.findIndex(
            (f) => f.id === field?.id || f === field
          ) ?? -1;
        }
      }

      state.selectedField = field;
      state.selectedFieldPath = {
        cardIndex: finalCardIndex,
        fieldIndex: finalFieldIndex,
        isFooterField
      };
      state.currentScreen = screen;
      state.currentCard = card;
      state.isFieldSelected = true;

      // Auto-show popup preview if field is actionPopup type
      if (field?.format === "actionPopup") {
        state.showPopupPreview = true;
      }
    },
    deselectField(state) {
      state.selectedField = null;
      state.selectedFieldPath = {
        cardIndex: null,
        fieldIndex: null,
        isFooterField: false
      };
      state.currentScreen = null;
      state.currentCard = null;
      state.isFieldSelected = false;
      // Hide popup preview when field is deselected
      state.showPopupPreview = false;
    },
    updateSelectedField(state, action) {
      if (!state.selectedField || !action?.payload) return;
      const updates = action.payload;
      const { cardIndex, fieldIndex, isFooterField } = state.selectedFieldPath;

      // Update the selectedField reference
      for (const key in updates) {
        state.selectedField[key] = updates[key];
      }

      // Check if this is a template type page
      const isTemplate = state.currentData?.type === "template";

      // Handle footer field updates
      if (isFooterField && state.currentData?.footer) {
        if (isTemplate) {
          // Recursive function to find and update the field in nested template structures
          const updateFieldInTree = (node) => {
            if (!node) return false;

            // Handle arrays
            if (Array.isArray(node)) {
              for (const item of node) {
                if (updateFieldInTree(item)) return true;
              }
              return false;
            }

            // Handle objects
            if (typeof node === "object") {
              // Check if this is the selected field (by reference or fieldName)
              if (node === state.selectedField || node.fieldName === state.selectedField.fieldName) {
                // Update all properties
                for (const key in updates) {
                  node[key] = updates[key];
                }
                return true;
              }

              // Check primaryAction and secondaryAction
              if (node.primaryAction && updateFieldInTree(node.primaryAction)) return true;
              if (node.secondaryAction && updateFieldInTree(node.secondaryAction)) return true;

              // Recursively search in child and children (template-specific)
              if (node.child && updateFieldInTree(node.child)) return true;
              if (node.children && updateFieldInTree(node.children)) return true;
            }

            return false;
          };

          // Search through footer recursively for templates
          updateFieldInTree(state.currentData.footer);
        } else {
          // For non-template footer (direct array access)
          if (fieldIndex !== null && fieldIndex !== -1 && state.currentData.footer[fieldIndex]) {
            for (const key in updates) {
              state.currentData.footer[fieldIndex][key] = updates[key];
            }
          }
        }
        return;
      }

      // Handle body field updates (existing logic)
      if (isTemplate) {
        // Recursive function to find and update the field in nested template structures
        const updateFieldInTree = (node) => {
          if (!node) return false;

          // Handle arrays
          if (Array.isArray(node)) {
            for (const item of node) {
              if (updateFieldInTree(item)) return true;
            }
            return false;
          }

          // Handle objects
          if (typeof node === "object") {
            // Check if this is the selected field (by reference or fieldName)
            if (node === state.selectedField || node.fieldName === state.selectedField.fieldName) {
              // Update all properties
              for (const key in updates) {
                node[key] = updates[key];
              }
              return true;
            }

            // Check primaryAction and secondaryAction
            if (node.primaryAction && updateFieldInTree(node.primaryAction)) return true;
            if (node.secondaryAction && updateFieldInTree(node.secondaryAction)) return true;

            // Recursively search in child and children (template-specific)
            if (node.child && updateFieldInTree(node.child)) return true;
            if (node.children && updateFieldInTree(node.children)) return true;
          }

          return false;
        };

        // Search through body fields recursively for templates
        if (state.currentData?.body && cardIndex !== null && cardIndex !== -1) {
          const card = state.currentData.body[cardIndex];
          if (Array.isArray(card?.fields)) {
            updateFieldInTree(card.fields);
          }
        }
      } else {
        // For non-template types (forms), use simple direct path access
        if (state.currentData?.body && cardIndex !== null && cardIndex !== -1 && fieldIndex !== null && fieldIndex !== -1) {
          const card = state.currentData.body[cardIndex];
          if (Array.isArray(card?.fields) && card.fields[fieldIndex]) {
            for (const key in updates) {
              card.fields[fieldIndex][key] = updates[key];
            }
          }
        }
      }
    },
    // Field management actions
    deleteField(state, action) {
      const { fieldIndex, cardIndex } = action.payload;

      // Check if this is a footer field (cardIndex === -1)
      if (cardIndex === -1) {
        // Delete from footer
        if (state.currentData?.footer && Array.isArray(state.currentData.footer)) {
          state.currentData.footer.splice(fieldIndex, 1);
          state.currentData = { ...state.currentData };
        }
      } else {
        // Delete from body (existing logic)
        if (state.currentData?.body?.[cardIndex]?.fields) {
          state.currentData.body[cardIndex].fields.splice(fieldIndex, 1);
          state.currentData = { ...state.currentData };
        }
      }
    },
    hideField(state, action) {
      const { fieldName, cardIndex } = action.payload;

      // Check if this is a template type page
      const isTemplate = state.currentData?.type === "template";

      if (!isTemplate) {
        // For non-template types, use existing logic
        const card = state.currentData?.body?.[cardIndex];
        if (!card) return;

        if (Array.isArray(card.fields)) {
          const field = card.fields.find((f) => f.fieldName === fieldName);
          if (field) {
            field.hidden = !field.hidden;
          }
        }
      } else {
        // For template types, search in both body and footer
        // Recursive function to toggle visibility in nested template structures
        const toggleByFieldName = (node) => {
          if (!node) return false;

          // Handle arrays
          if (Array.isArray(node)) {
            for (const item of node) {
              if (toggleByFieldName(item)) return true;
            }
            return false;
          }

          // Handle objects
          if (typeof node === "object") {
            // Check if this node has the matching fieldName
            if (node.fieldName === fieldName) {
              node.hidden = !node.hidden;
              return true;
            }

            // Check primaryAction and secondaryAction
            if (node.primaryAction && toggleByFieldName(node.primaryAction)) return true;
            if (node.secondaryAction && toggleByFieldName(node.secondaryAction)) return true;

            // Recursively search in child and children (template-specific)
            if (node.child && toggleByFieldName(node.child)) return true;
            if (node.children && toggleByFieldName(node.children)) return true;
          }

          return false;
        };

        // Search in body fields
        const card = state.currentData?.body?.[cardIndex];
        if (card && Array.isArray(card.fields)) {
          if (toggleByFieldName(card.fields)) {
            state.currentData = { ...state.currentData };
            return;
          }
        }

        // If not found in body, search in footer
        if (state.currentData?.footer && Array.isArray(state.currentData.footer)) {
          if (toggleByFieldName(state.currentData.footer)) {
            state.currentData = { ...state.currentData };
            return;
          }
        }
      }

      state.currentData = { ...state.currentData };
    },
    reorderFields(state, action) {
      const { cardIndex, fromIndex, toIndex } = action.payload;
      if (state.currentData && state.currentData.body && state.currentData.body[cardIndex]) {
        const fields = state.currentData.body[cardIndex].fields;
        if (fromIndex >= 0 && toIndex >= 0 && fromIndex < fields.length && toIndex < fields.length) {
          const [movedField] = fields.splice(fromIndex, 1);
          fields.splice(toIndex, 0, movedField);

          // Update order property
          fields.forEach((field, index) => {
            field.order = index + 1;
          });

          // Ensure reactivity by creating new reference
          state.currentData = { ...state.currentData };
        }
      }
    },
    handleShowAddFieldPopup(state, action) {
      if (!action.payload) {
        state.showAddFieldPopup = false;
      } else {
        const { currentCard, card } = action.payload;
        state.showAddFieldPopup = { currentCard, card };
      }
    },
    addField(state, action) {
      const { cardIndex, fieldData } = action.payload;
      if (state.currentData && state.currentData.body && state.currentData.body[cardIndex]) {
        const newField = {
          ...fieldData,
          id: crypto.randomUUID(),
          deleteFlag: true,
          active: true,
        };

        // Add showLabel: false for scanner format fields
        if (fieldData?.format === "scanner" || fieldData?.format === "qrScanner") {
          newField.showLabel = false;
        }

        state.currentData.body[cardIndex].fields.push(newField);
        // Ensure reactivity by creating new reference
        state.currentData = { ...state.currentData };
      }
    },
    addSection(state) {
      if (state.currentData && state.currentData.body) {
        const newCard = {
          fields: [],
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
        };
        state.currentData.body.push(newCard);
        // Ensure reactivity by creating new reference
        state.currentData = { ...state.currentData };
      }
    },
    updateHeaderField(state, action) {
      const { cardIndex, fieldIndex, value } = action.payload;
      if (
        state.currentData &&
        state.currentData.body &&
        state.currentData.body[cardIndex] &&
        state.currentData.body[cardIndex].headerFields &&
        state.currentData.body[cardIndex].headerFields[fieldIndex]
      ) {
        state.currentData.body[cardIndex].headerFields[fieldIndex].value = value;
        // Ensure reactivity by creating new reference
        state.currentData = { ...state.currentData };
      }
    },
    updateActionLabel(state, action) {
      const { value } = action.payload;
      if (state.currentData) {
        state.currentData.actionLabel = value;
        // Ensure reactivity by creating new reference
        state.currentData = { ...state.currentData };
      }
    },
    updateHeaderProperty(state, action) {
      const { fieldKey, value } = action.payload;
      if (state.currentData && fieldKey) {
        state.currentData[fieldKey] = value;
        // Ensure reactivity by creating new reference
        state.currentData = { ...state.currentData };
      }
    },
    // Navigation logic actions
    updatePageConditionalNav(state, action) {
      const { data } = action.payload;
      if (state.currentData) {
        state.currentData.conditionalNavigateTo = data;
        // Ensure reactivity by creating new reference
        state.currentData = { ...state.currentData };
      }
    },
    // Popup preview actions
    setShowPopupPreview(state, action) {
      state.showPopupPreview = action.payload;
    },
  },
});

// slice to store field type

// slice to store field panel properties

// slice to store localisation data

export const {
  initializeConfig,
  setRemoteData,
  setCurrentData,
  selectField,
  deselectField,
  updateSelectedField,
  deleteField,
  hideField,
  reorderFields,
  addField,
  addSection,
  updateHeaderField,
  updateActionLabel,
  updateHeaderProperty,
  handleShowAddFieldPopup,
  updatePageConditionalNav,
  setShowPopupPreview,
} = remoteConfigSlice.actions;
export default remoteConfigSlice.reducer;
