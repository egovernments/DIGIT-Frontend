import { createSlice } from "@reduxjs/toolkit";
import dummyConfig from "../configs/dummyConfig.json";

// Slice for storing app config data
const remoteConfigSlice = createSlice({
  name: "remoteConfig",
  initialState: {
    remoteData: null,
    parentData: [],
    pageType: "object", // "object" or "template"
    // Drawer state for field selection and editing
    selectedField: null,
    selectedFieldPath: { cardIndex: null, fieldIndex: null }, // Store field path for O(1) updates
    currentScreen: null,
    currentCard: null,
    isFieldSelected: false,
    showAddFieldPopup: false,
  },
  reducers: {
    initializeConfig(state, action) {
      const pageConfig = action.payload;
      if (pageConfig) {
        state.remoteData = pageConfig;
        state.currentData = pageConfig;
        state.pageType = pageConfig.type || "object"; // Extract pageType from config
      } else {
        state.remoteData = dummyConfig;
        state.currentData = dummyConfig || {};
        state.pageType = dummyConfig?.type || "object";
      }
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
      // Use passed indices if available, otherwise try to find them
      let finalCardIndex = cardIndex;
      let finalFieldIndex = fieldIndex;

      if (finalCardIndex === undefined || finalCardIndex === null) {
        // Fallback: try to find by ID or reference
        finalCardIndex = state.currentData?.cards?.findIndex((c) => c.id === card?.id || c === card) ?? -1;
      }

      if (finalFieldIndex === undefined || finalFieldIndex === null) {
        // Fallback: try to find by ID or reference
        finalFieldIndex = card?.fields?.findIndex((f) => f.id === field?.id || f === field) ?? -1;
      }

      state.selectedField = field;
      state.selectedFieldPath = { cardIndex: finalCardIndex, fieldIndex: finalFieldIndex };
      state.currentScreen = screen;
      state.currentCard = card;
      state.isFieldSelected = true;
    },
    deselectField(state) {
      state.selectedField = null;
      state.selectedFieldPath = { cardIndex: null, fieldIndex: null };
      state.currentScreen = null;
      state.currentCard = null;
      state.isFieldSelected = false;
    },
    updateSelectedField(state, action) {
      if (!state.selectedField || !action?.payload) return;
      const updates = action.payload;
      const { cardIndex, fieldIndex } = state.selectedFieldPath;

      // Update selected field
      for (const key in updates) {
        state.selectedField[key] = updates[key];
      }

      // Also update the field in currentData using stored path (O(1) instead of O(n*m))
      if (state.currentData?.cards && cardIndex !== null && cardIndex !== -1 && fieldIndex !== null && fieldIndex !== -1) {
        for (const key in updates) {
          state.currentData.cards[cardIndex].fields[fieldIndex][key] = updates[key];
        }
      }
    },
    // Field management actions
    deleteField(state, action) {
      const { fieldIndex, cardIndex } = action.payload;
      if (state.currentData && state.currentData.cards && state.currentData.cards[cardIndex]) {
        state.currentData.cards[cardIndex].fields.splice(fieldIndex, 1);
        // Ensure reactivity by creating new reference
        state.currentData = { ...state.currentData };
      }
    },
    hideField(state, action) {
      const { fieldIndex, cardIndex } = action.payload;
      if (
        state.currentData &&
        state.currentData.cards &&
        state.currentData.cards[cardIndex] &&
        state.currentData.cards[cardIndex].fields[fieldIndex]
      ) {
        state.currentData.cards[cardIndex].fields[fieldIndex].hidden = !state.currentData.cards[cardIndex].fields[fieldIndex].hidden;
        // Ensure reactivity by creating new reference
        state.currentData = { ...state.currentData };
      }
    },
    reorderFields(state, action) {
      const { cardIndex, fromIndex, toIndex } = action.payload;
      if (state.currentData && state.currentData.cards && state.currentData.cards[cardIndex]) {
        const fields = state.currentData.cards[cardIndex].fields;
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
      if (state.currentData && state.currentData.cards && state.currentData.cards[cardIndex]) {
        const newField = {
          ...fieldData,
          id: crypto.randomUUID(),
          deleteFlag: true,
          active: true,
        };
        state.currentData.cards[cardIndex].fields.push(newField);
        // Ensure reactivity by creating new reference
        state.currentData = { ...state.currentData };
      }
    },
    addSection(state) {
      if (state.currentData && state.currentData.cards) {
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
        state.currentData.cards.push(newCard);
        // Ensure reactivity by creating new reference
        state.currentData = { ...state.currentData };
      }
    },
    updateHeaderField(state, action) {
      const { cardIndex, fieldIndex, value } = action.payload;
      if (
        state.currentData &&
        state.currentData.cards &&
        state.currentData.cards[cardIndex] &&
        state.currentData.cards[cardIndex].headerFields &&
        state.currentData.cards[cardIndex].headerFields[fieldIndex]
      ) {
        state.currentData.cards[cardIndex].headerFields[fieldIndex].value = value;
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
    updatePageRoles(state, action) {
      const { roles } = action.payload;
      if (state.currentData) {
        state.currentData.roles = roles;
        // Ensure reactivity by creating new reference
        state.currentData = { ...state.currentData };
      }
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
  updatePageRoles,
  handleShowAddFieldPopup,
} = remoteConfigSlice.actions;
export default remoteConfigSlice.reducer;
