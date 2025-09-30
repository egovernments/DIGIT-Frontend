import { createSlice } from "@reduxjs/toolkit";
import dummyConfig from "../configs/dummyConfig.json";

// Slice for storing app config data
const remoteConfigSlice = createSlice({
  name: "remoteConfig",
  initialState: {
    remoteData: null,
    parentData: [],
    // Drawer state for field selection and editing
    selectedField: null,
    currentScreen: null,
    currentCard: null,
    isFieldSelected: false,
    showAddFieldPopup: false,
  },
  reducers: {
    initializeConfig(state) {
      state.remoteData = dummyConfig;
      state.currentData = dummyConfig || {};
    },
    setRemoteData(state, action) {
      state.remoteData = action.payload;
    },
    setCurrentData(state, action) {
      state.currentData = action.payload || [];
    },
    // Field selection actions
    selectField(state, action) {
      const { field, screen, card } = action.payload;
      state.selectedField = field;
      state.currentScreen = screen;
      state.currentCard = card;
      state.isFieldSelected = true;
    },
    deselectField(state) {
      state.selectedField = null;
      state.currentScreen = null;
      state.currentCard = null;
      state.isFieldSelected = false;
    },
    updateSelectedField(state, action) {
      if (!state.selectedField || !action?.payload) return;
      const updates = action.payload;

      // Update selected field
      for (const key in updates) {
        state.selectedField[key] = updates[key];
      }

      // Also update the field in currentData
      if (state.currentData && state.currentData.cards) {
        const cardIndex = state.currentData.cards.findIndex((card) => card.fields && card.fields.some((field) => field === state.selectedField));

        if (cardIndex !== -1) {
          const fieldIndex = state.currentData.cards[cardIndex].fields.findIndex((field) => field === state.selectedField);

          if (fieldIndex !== -1) {
            // Update the field in currentData
            for (const key in updates) {
              state.currentData.cards[cardIndex].fields[fieldIndex][key] = updates[key];
            }
            // Ensure reactivity by creating new reference
            state.currentData = { ...state.currentData };
          }
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
  handleShowAddFieldPopup,
} = remoteConfigSlice.actions;
export default remoteConfigSlice.reducer;
