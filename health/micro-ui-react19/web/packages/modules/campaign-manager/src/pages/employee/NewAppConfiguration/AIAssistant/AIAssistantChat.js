import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch, useStore } from "react-redux";
import {
  addMessage,
  setLoading,
  clearChat,
  setError,
  setPendingActions,
  clearPendingActions,
  setPreviewField,
  clearPreviewField,
  setAIConfig,
  toggleSettings,
} from "./aiAssistantSlice";
import { callAI } from "./aiService";
import { buildSystemPrompt, extractTemplateFields, isFieldEditable } from "./systemPrompt";
import { executeActions } from "./actionExecutor";
import { AI_ASSISTANT_STYLES } from "./aiAssistantStyles";
import { useCustomTranslate } from "../hooks/useCustomT";

/**
 * Converts a subset of markdown (bold, italic, bullets) to safe HTML.
 * Only parses known patterns — no arbitrary HTML injection.
 */
function renderMarkdown(text) {
  if (!text) return "";
  // Escape HTML entities first
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold: **text**
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Italic: *text* (but not inside bold tags)
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");
  // Inline code: `text`
  html = html.replace(/`([^`]+?)`/g, '<code class="ai-msg-code">$1</code>');

  // Process line by line for bullet lists
  const lines = html.split("\n");
  const result = [];
  let inList = false;

  for (const line of lines) {
    const bulletMatch = line.match(/^(\s*)-\s+(.+)/);
    if (bulletMatch) {
      if (!inList) {
        result.push('<ul class="ai-msg-list">');
        inList = true;
      }
      result.push(`<li>${bulletMatch[2]}</li>`);
    } else {
      if (inList) {
        result.push("</ul>");
        inList = false;
      }
      result.push(line);
    }
  }
  if (inList) result.push("</ul>");

  return result.join("\n");
}

/**
 * Format badge color mapping for field types.
 */
const FORMAT_BADGE_COLORS = {
  text: { bg: "#e8f5e9", color: "#2e7d32" },
  textarea: { bg: "#e8f5e9", color: "#2e7d32" },
  number: { bg: "#fff3e0", color: "#e65100" },
  numeric: { bg: "#fff3e0", color: "#e65100" },
  mobileNumber: { bg: "#fff3e0", color: "#e65100" },
  dropdown: { bg: "#e3f2fd", color: "#1565c0" },
  select: { bg: "#e3f2fd", color: "#1565c0" },
  searchableDropdown: { bg: "#e3f2fd", color: "#1565c0" },
  radio: { bg: "#f3e5f5", color: "#7b1fa2" },
  checkbox: { bg: "#f3e5f5", color: "#7b1fa2" },
  date: { bg: "#fce4ec", color: "#c62828" },
  dob: { bg: "#fce4ec", color: "#c62828" },
  scanner: { bg: "#e0f2f1", color: "#00695c" },
  qrScanner: { bg: "#e0f2f1", color: "#00695c" },
  idPopulator: { bg: "#efebe9", color: "#4e342e" },
};

/** Human-readable format display names */
const FORMAT_DISPLAY_NAMES = {
  text: "Text",
  textarea: "Text Area",
  number: "Number",
  numeric: "Numeric",
  mobileNumber: "Phone",
  dropdown: "Dropdown",
  select: "Select",
  searchableDropdown: "Search Dropdown",
  radio: "Radio",
  checkbox: "Checkbox",
  date: "Date Picker",
  dob: "Date of Birth",
  scanner: "Barcode Scanner",
  qrScanner: "QR Scanner",
  idPopulator: "ID Populator",
};

/** Property tag category colors */
const PROP_TAG_COLORS = {
  validation: { bg: "#fce4ec", color: "#c62828" },
  content: { bg: "#e3f2fd", color: "#1565c0" },
  data: { bg: "#e8f5e9", color: "#2e7d32" },
  display: { bg: "#f3e5f5", color: "#7b1fa2" },
};

function getPropTagCategory(tag) {
  const validationTags = ["required", "pattern", "range", "lengthRange", "scanLimit"];
  const dataTags = ["MDMS", "GS1", "multiSelect"];
  const displayTags = ["readOnly", "systemDate"];
  if (validationTags.includes(tag)) return "validation";
  if (dataTags.includes(tag)) return "data";
  if (displayTags.includes(tag)) return "display";
  return "content";
}

/**
 * Lightweight inline field preview card.
 * Shows format badge, label, required asterisk, and a mini visual mock of the field type.
 */
const FieldPreviewCard = ({ fieldName, format, label, required, properties }) => {
  const getFieldMock = () => {
    switch (format) {
      case "dropdown":
      case "select":
        return (
          <div className="ai-field-preview-input">
            <span>Select...</span>
            <svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
          </div>
        );
      case "date":
      case "dob":
        return (
          <div className="ai-field-preview-input">
            <span>dd/mm/yyyy</span>
            <svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" /></svg>
          </div>
        );
      case "checkbox":
        return (
          <div className="ai-field-preview-input">
            <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" /></svg>
            <span>{label || fieldName}</span>
          </div>
        );
      case "radio":
        return (
          <div className="ai-field-preview-input">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" /></svg>
            <span>Option</span>
          </div>
        );
      case "scanner":
      case "qrScanner":
        return (
          <div className="ai-field-preview-input">
            <span>Scan barcode</span>
            <svg viewBox="0 0 24 24"><path d="M4 4h4V2H2v6h2V4zm16-2h-4v2h4v4h2V2h-2zM4 16H2v6h6v-2H4v-4zm16 4h-4v2h6v-6h-2v4zM12 6a6 6 0 100 12 6 6 0 000-12z" /></svg>
          </div>
        );
      case "number":
      case "numeric":
      case "mobileNumber":
        return (
          <div className="ai-field-preview-input">
            <span>0</span>
          </div>
        );
      case "textarea":
        return (
          <div className="ai-field-preview-input" style={{ minHeight: "2.5rem", alignItems: "flex-start" }}>
            <span>Enter text...</span>
          </div>
        );
      default:
        return (
          <div className="ai-field-preview-input">
            <span>Enter text...</span>
          </div>
        );
    }
  };

  const propTags = [];
  if (properties) {
    if (properties.readOnly) propTags.push("readOnly");
    if (properties.helpText) propTags.push("helpText");
    if (properties.tooltip) propTags.push("tooltip");
    if (properties.pattern || properties["pattern"]) propTags.push("pattern");
    if (properties["range.min"] !== undefined || properties["range.max"] !== undefined) propTags.push("range");
    if (properties["lengthRange.minLength"] !== undefined || properties["lengthRange.maxLength"] !== undefined) propTags.push("lengthRange");
    if (properties.isMdms) propTags.push("MDMS");
    if (properties.isGS1) propTags.push("GS1");
    if (properties.scanLimit) propTags.push("scanLimit");
    if (properties.systemDate) propTags.push("systemDate");
    if (properties.isMultiSelect) propTags.push("multiSelect");
    if (properties.prefixText) propTags.push(`prefix: ${properties.prefixText}`);
    if (properties.suffixText) propTags.push(`suffix: ${properties.suffixText}`);
  }

  const badgeColor = FORMAT_BADGE_COLORS[format] || { bg: "#e3f2fd", color: "#1565c0" };
  const displayFormat = FORMAT_DISPLAY_NAMES[format] || format || "Text";

  return (
    <div className="ai-field-preview">
      <div className="ai-field-preview-title-bar">Field Preview</div>
      <div className="ai-field-preview-header">
        <span
          className="ai-field-preview-badge"
          style={{ background: badgeColor.bg, color: badgeColor.color }}
        >
          {displayFormat}
        </span>
        <span className="ai-field-preview-label">
          {label || fieldName}
          {required && <span className="ai-field-preview-required"> *</span>}
        </span>
      </div>
      {getFieldMock()}
      {propTags.length > 0 && (
        <div className="ai-field-preview-props">
          {propTags.map((tag, i) => {
            const category = getPropTagCategory(tag.split(":")[0].trim());
            const tagColor = PROP_TAG_COLORS[category];
            return (
              <span
                key={i}
                className="ai-field-preview-prop"
                style={{ background: tagColor.bg, color: tagColor.color }}
              >
                {tag}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

const AIAssistantChat = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const { messages, isLoading, error, pendingActions, previewField, aiConfig, showSettings } = useSelector((state) => state.aiAssistant);
  const currentData = useSelector((state) => state.remoteConfig?.currentData);
  const fieldTypeMaster = useSelector((state) => state.fieldTypeMaster?.byName?.fieldTypeMappingConfig);
  const localizationData = useSelector((state) => state.localization?.data);
  const pageType = useSelector((state) => state.remoteConfig?.currentData?.type || "object");
  const panelConfig = useSelector((state) => state.fieldPanelMaster?.byName?.drawerPanelConfig);

  const customTranslate = useCustomTranslate();

  // Compute available fields — mirrors NewAppFieldScreenWrapper's extractTemplateFields + isFieldEditable
  const availableFields = useMemo(() => {
    if (!currentData?.body) return [];
    const isTemplatePage = currentData.type === "template";
    const result = [];

    currentData.body.forEach((section, cardIndex) => {
      const bodyFields = isTemplatePage
        ? extractTemplateFields(section.fields)
        : (section.fields || []);

      bodyFields
        .filter((f) => isFieldEditable(f, fieldTypeMaster))
        .forEach((f) => result.push({ ...f, _cardIndex: cardIndex }));
    });

    // Footer fields (only for template screens — same as NewAppFieldScreenWrapper)
    if (isTemplatePage && currentData.footer) {
      extractTemplateFields(currentData.footer)
        .filter((f) => isFieldEditable(f, fieldTypeMaster))
        .forEach((f) => result.push({ ...f, _cardIndex: -1 }));
    }

    return result;
  }, [currentData, fieldTypeMaster]);

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when component mounts
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // Use the real store's getState so action executor always sees fresh state
  // (e.g. after ADD_FIELD dispatches, UPDATE_FIELD_PROPERTY can find the new field)
  const getStoreState = useCallback(() => store.getState(), [store]);

  const handleSend = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    setInputValue("");
    dispatch(addMessage({ role: "user", content: text }));
    dispatch(setLoading(true));
    dispatch(setError(null));
    dispatch(clearPendingActions());
    dispatch(clearPreviewField());

    try {
      const systemPrompt = buildSystemPrompt(currentData, fieldTypeMaster, localizationData, pageType, panelConfig);

      // Build conversation history including the new message
      const conversationHistory = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: text },
      ];

      const response = await callAI(aiConfig, conversationHistory, systemPrompt);
      const { message: aiMessage, actions } = response;

      dispatch(addMessage({ role: "assistant", content: aiMessage }));

      // Handle preview from AI response
      if (response.preview && response.preview.showPreview) {
        dispatch(setPreviewField(response.preview));
      }

      if (actions && actions.length > 0) {
        dispatch(setPendingActions(actions));
      }
    } catch (err) {
      dispatch(setError(err.message));
      dispatch(addMessage({ role: "assistant", content: "Sorry, I encountered an error. Please try again." }));
    } finally {
      dispatch(setLoading(false));
    }
  }, [inputValue, isLoading, messages, currentData, fieldTypeMaster, localizationData, pageType, panelConfig, aiConfig, dispatch]);

  const handleApplyActions = useCallback(() => {
    if (pendingActions.length === 0) return;

    const getState = () => getStoreState();
    const { success, results } = executeActions(pendingActions, dispatch, getState);

    const summary = results
      .map((r) => (r.success ? `${r.detail}` : `Failed: ${r.error}`))
      .join("\n");

    dispatch(addMessage({
      role: "assistant",
      content: success
        ? `Applied ${results.length} action(s) successfully:\n${summary}`
        : `Some actions failed:\n${summary}`,
    }));
    dispatch(clearPendingActions());
    dispatch(clearPreviewField());
  }, [pendingActions, dispatch, getStoreState]);

  const handleDismissActions = useCallback(() => {
    dispatch(clearPendingActions());
    dispatch(clearPreviewField());
    dispatch(addMessage({ role: "assistant", content: "Actions dismissed." }));
  }, [dispatch]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const getActionSummary = (action) => {
    const { type, payload } = action;
    switch (type) {
      case "ADD_FIELD":
        return `Add "${payload?.fieldData?.fieldName || "field"}" to section ${payload?.cardIndex ?? 0}`;
      case "UPDATE_FIELD":
        return `Update "${payload?.fieldName}" - ${Object.keys(payload?.updates || {}).join(", ")}`;
      case "DELETE_FIELD":
        return `Remove "${payload?.fieldName}"`;
      case "HIDE_FIELD":
        return `Toggle visibility of "${payload?.fieldName}"`;
      case "REORDER_FIELDS":
        return `Move field ${payload?.fromIndex} to ${payload?.toIndex} in section ${payload?.cardIndex}`;
      case "UPDATE_LOCALIZATION":
        return `Set "${payload?.code}" = "${payload?.message}"`;
      case "ADD_SECTION":
        return "Add new section";
      case "UPDATE_FIELD_PROPERTY":
        return `Set properties on "${payload?.fieldName}": ${Object.keys(payload?.properties || {}).join(", ")}`;
      default:
        return type;
    }
  };

  /**
   * Extracts preview data from an action for inline rendering.
   */
  const getActionPreview = (action) => {
    if (action.type === "ADD_FIELD" && action.payload?.fieldData) {
      const fd = action.payload.fieldData;
      return {
        fieldName: fd.fieldName,
        format: fd.format || "text",
        label: fd.label,
        required: fd.required,
        properties: fd,
      };
    }
    if (action.type === "UPDATE_FIELD_PROPERTY" && action.payload) {
      return {
        fieldName: action.payload.fieldName,
        format: null, // We'll resolve from existing field below
        label: action.payload.fieldName,
        required: action.payload.properties?.required,
        properties: action.payload.properties,
      };
    }
    return null;
  };

  /**
   * Resolves the format for a fieldName from currentData.
   */
  const resolveFieldFormat = (fieldName) => {
    if (!currentData?.body) return null;
    for (const card of currentData.body) {
      if (card.fields) {
        const field = card.fields.find((f) => f.fieldName === fieldName);
        if (field) return field.format;
      }
    }
    if (currentData.footer) {
      const field = currentData.footer.find((f) => f.fieldName === fieldName);
      if (field) return field.format;
    }
    return null;
  };

  const isTemplate = pageType === "template";

  const welcomeMessage = isTemplate
    ? `Hi! This is a template screen. I can help you hide/show fields and update labels.`
    : `Hi! I can help you configure form fields. Try things like:\n- "Add a phone number field"\n- "Make the name field required"\n- "Remove the address field"`;

  return (
    <React.Fragment>
    <style>{AI_ASSISTANT_STYLES}</style>
    <div className="ai-assistant-embedded">
      {/* Compact header row with clear + settings buttons */}
      <div className="ai-assistant-header">
        <span className="ai-assistant-header-title">AI Config Assistant</span>
        <div className="ai-assistant-header-actions">
          <button className="ai-assistant-header-btn" onClick={() => dispatch(toggleSettings())} title="AI Settings">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1115.6 12 3.6 3.6 0 0112 15.6z" />
            </svg>
          </button>
          <button className="ai-assistant-header-btn" onClick={() => dispatch(clearChat())} title="Clear chat">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="ai-settings-panel">
          <div className="ai-settings-row">
            <label className="ai-settings-label">Provider</label>
            <select
              className="ai-settings-select"
              value={aiConfig.provider}
              onChange={(e) => {
                const provider = e.target.value;
                const presets = { anthropic: "claude-sonnet-4-20250514", openai: "gpt-4o", custom: "" };
                dispatch(setAIConfig({ provider, model: presets[provider] || "", baseUrl: "" }));
              }}
            >
              <option value="anthropic">Anthropic (Claude)</option>
              <option value="openai">OpenAI</option>
              <option value="custom">Custom (OpenAI-compatible)</option>
            </select>
          </div>
          <div className="ai-settings-row">
            <label className="ai-settings-label">Model</label>
            <input
              className="ai-settings-input"
              type="text"
              value={aiConfig.model}
              placeholder={aiConfig.provider === "anthropic" ? "claude-sonnet-4-20250514" : aiConfig.provider === "openai" ? "gpt-4o" : "model-name"}
              onChange={(e) => dispatch(setAIConfig({ model: e.target.value }))}
            />
          </div>
          <div className="ai-settings-row">
            <label className="ai-settings-label">API Key</label>
            <input
              className="ai-settings-input"
              type="password"
              value={aiConfig.apiKey}
              placeholder="sk-..."
              onChange={(e) => dispatch(setAIConfig({ apiKey: e.target.value }))}
            />
          </div>
          {aiConfig.provider === "custom" && (
            <div className="ai-settings-row">
              <label className="ai-settings-label">Base URL</label>
              <input
                className="ai-settings-input"
                type="text"
                value={aiConfig.baseUrl}
                placeholder="https://api.example.com/v1/chat/completions"
                onChange={(e) => dispatch(setAIConfig({ baseUrl: e.target.value }))}
              />
            </div>
          )}
          <div className="ai-settings-row">
            <label className="ai-settings-label">Max Tokens</label>
            <input
              className="ai-settings-input"
              type="number"
              value={aiConfig.maxTokens}
              min={256}
              max={16384}
              onChange={(e) => dispatch(setAIConfig({ maxTokens: parseInt(e.target.value, 10) || 2048 }))}
            />
          </div>
          <div className="ai-settings-hint">
            Settings are saved to browser localStorage.
            {aiConfig.provider !== "custom" && ` Falls back to env variable if API key is empty.`}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="ai-assistant-messages">
        <div className="ai-msg ai-msg--assistant">
          {welcomeMessage}
        </div>
        {availableFields.length > 0 && (
          <div className="ai-field-list">
            <div className="ai-field-list-title">Fields on this screen ({availableFields.length}):</div>
            {availableFields.map((f, i) => {
              const displayLabel = customTranslate(f.label)?.trim() || customTranslate(f.fieldName)?.trim() || f.fieldName;
              return (
                <div key={f.fieldName || i} className={`ai-field-list-item${f.hidden ? " ai-field-list-item--hidden" : ""}`}>
                  <span className="ai-field-list-format">{f.format || "text"}</span>
                  <span className="ai-field-list-label">{displayLabel}</span>
                  {f.hidden && <span className="ai-field-list-badge">HIDDEN</span>}
                </div>
              );
            })}
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`ai-msg ai-msg--${msg.role}`}>
            <span dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
          </div>
        ))}
        {/* Inline preview from AI response */}
        {previewField && previewField.showPreview && (
          <div className="ai-msg ai-msg--assistant">
            <FieldPreviewCard
              fieldName={previewField.fieldName}
              format={previewField.format || "text"}
              label={previewField.label || previewField.fieldName}
              required={previewField.required}
              properties={previewField.properties}
            />
          </div>
        )}
        {isLoading && (
          <div className="ai-loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Pending Actions Preview */}
      {pendingActions.length > 0 && (
        <div className="ai-assistant-actions-preview">
          <div className="ai-assistant-actions-preview-title">Proposed Changes ({pendingActions.length})</div>
          {pendingActions.map((action, idx) => {
            const preview = getActionPreview(action);
            return (
              <div key={idx} className={`ai-action-card ai-action-card--${action.type}`}>
                <span className="ai-action-type">{action.type.replace(/_/g, " ")}</span>
                <span className="ai-action-detail">
                  {getActionSummary(action)}
                  {preview && (
                    <FieldPreviewCard
                      fieldName={preview.fieldName}
                      format={preview.format || resolveFieldFormat(preview.fieldName) || "text"}
                      label={preview.label}
                      required={preview.required}
                      properties={preview.properties}
                    />
                  )}
                </span>
              </div>
            );
          })}
          <div className="ai-assistant-actions-btns">
            <button className="ai-btn-apply" onClick={handleApplyActions}>
              Apply All
            </button>
            <button className="ai-btn-dismiss" onClick={handleDismissActions}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && <div className="ai-assistant-error">{error}</div>}

      {/* Input */}
      <div className="ai-assistant-input-area">
        <textarea
          ref={inputRef}
          className="ai-assistant-input"
          placeholder={isTemplate ? "Ask me to hide/show fields..." : "Ask me to configure fields..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isLoading}
        />
        <button className="ai-assistant-send-btn" onClick={handleSend} disabled={isLoading || !inputValue.trim()}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
    </React.Fragment>
  );
};

export default AIAssistantChat;
