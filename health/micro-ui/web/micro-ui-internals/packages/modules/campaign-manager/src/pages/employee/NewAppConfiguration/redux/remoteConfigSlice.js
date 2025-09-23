import { createSlice } from "@reduxjs/toolkit";
import dummyConfig from "../dummyConfig.json";

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
        const cardIndex = state.currentData.cards.findIndex(card =>
          card.fields && card.fields.some(field => field === state.selectedField)
        );

        if (cardIndex !== -1) {
          const fieldIndex = state.currentData.cards[cardIndex].fields.findIndex(
            field => field === state.selectedField
          );

          if (fieldIndex !== -1) {
            // Update the field in currentData
            for (const key in updates) {
              state.currentData.cards[cardIndex].fields[fieldIndex][key] = updates[key];
            }
          }
        }
      }
    },
  },
});

// slice to store field type

// slice to store field panel properties

// slice to store localisation data

export const { initializeConfig, setRemoteData, setCurrentData, selectField, deselectField, updateSelectedField } = remoteConfigSlice.actions;
export default remoteConfigSlice.reducer;
