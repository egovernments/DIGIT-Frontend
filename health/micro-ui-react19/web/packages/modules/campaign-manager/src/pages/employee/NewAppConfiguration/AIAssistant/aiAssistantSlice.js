import { createSlice } from "@reduxjs/toolkit";

// Try to restore saved config from localStorage
const STORAGE_KEY = "ai_assistant_config";
function loadSavedConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return null;
}

const defaultConfig = {
  provider: "anthropic",       // "anthropic" | "openai" | "custom"
  model: "claude-sonnet-4-20250514",
  apiKey: "",
  baseUrl: "",                 // only for "custom" provider
  maxTokens: 2048,
};

const aiAssistantSlice = createSlice({
  name: "aiAssistant",
  initialState: {
    messages: [],
    isLoading: false,
    isOpen: false,
    error: null,
    pendingActions: [],
    previewField: null,
    currentPageName: null,
    aiConfig: { ...defaultConfig, ...(loadSavedConfig() || {}) },
    showSettings: false,
  },
  reducers: {
    addMessage(state, action) {
      const { role, content } = action.payload;
      state.messages.push({
        role,
        content,
        timestamp: Date.now(),
      });
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    toggleChat(state) {
      state.isOpen = !state.isOpen;
    },
    clearChat(state) {
      state.messages = [];
      state.error = null;
      state.pendingActions = [];
      state.previewField = null;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setPendingActions(state, action) {
      state.pendingActions = action.payload;
    },
    clearPendingActions(state) {
      state.pendingActions = [];
    },
    setPreviewField(state, action) {
      state.previewField = action.payload;
    },
    clearPreviewField(state) {
      state.previewField = null;
    },
    setAIConfig(state, action) {
      const updated = { ...state.aiConfig, ...action.payload };
      state.aiConfig = updated;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (_) {}
    },
    toggleSettings(state) {
      state.showSettings = !state.showSettings;
    },
    setCurrentPageName(state, action) {
      const newPage = action.payload;
      if (newPage !== state.currentPageName) {
        state.currentPageName = newPage;
        state.messages = [];
        state.pendingActions = [];
        state.previewField = null;
        state.error = null;
        state.isOpen = false;
      }
    },
  },
});

export const {
  addMessage,
  setLoading,
  toggleChat,
  clearChat,
  setError,
  setPendingActions,
  clearPendingActions,
  setPreviewField,
  clearPreviewField,
  setAIConfig,
  toggleSettings,
  setCurrentPageName,
} = aiAssistantSlice.actions;

export default aiAssistantSlice.reducer;
