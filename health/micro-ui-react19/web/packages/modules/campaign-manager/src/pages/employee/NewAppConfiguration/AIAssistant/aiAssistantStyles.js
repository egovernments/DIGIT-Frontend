export const AI_ASSISTANT_STYLES = `
/* Embedded AI assistant container */
.ai-assistant-embedded {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

/* Panel header */
.ai-assistant-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #0b4b66;
  color: #fff;
  flex-shrink: 0;
}
.ai-assistant-header-title {
  font-size: 0.9375rem;
  font-weight: 600;
}
.ai-assistant-header-actions {
  display: flex;
  gap: 0.25rem;
}
.ai-assistant-header-btn {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.85;
}
.ai-assistant-header-btn:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.15);
}

/* Messages area */
.ai-assistant-messages {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: #f7f8fa;
}

/* AI button in side panel header */
.ai-assistant-sidepanel-btn {
  background: none;
  border: 1px solid #0b4b66;
  color: #0b4b66;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  transition: background 0.15s ease, color 0.15s ease;
}
.ai-assistant-sidepanel-btn:hover {
  background: #0b4b66;
  color: #fff;
}
.ai-assistant-sidepanel-btn.active {
  background: #0b4b66;
  color: #fff;
}
.ai-assistant-sidepanel-btn svg {
  width: 1rem;
  height: 1rem;
  fill: currentColor;
}

/* Message bubbles */
.ai-msg {
  max-width: 85%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  font-size: 0.8125rem;
  line-height: 1.45;
  word-wrap: break-word;
  white-space: pre-wrap;
}
.ai-msg--user {
  align-self: flex-end;
  background: #0b4b66;
  color: #fff;
  border-bottom-right-radius: 0.2rem;
}
.ai-msg--assistant {
  align-self: flex-start;
  background: #fff;
  color: #333;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 0.2rem;
}

/* Markdown rendering in messages */
.ai-msg strong {
  font-weight: 600;
}
.ai-msg em {
  font-style: italic;
}
.ai-msg .ai-msg-code {
  background: #f0f0f0;
  padding: 0.1rem 0.3rem;
  border-radius: 0.2rem;
  font-family: monospace;
  font-size: 0.75rem;
}
.ai-msg--user .ai-msg-code {
  background: rgba(255, 255, 255, 0.2);
}
.ai-msg .ai-msg-list {
  margin: 0.25rem 0;
  padding-left: 1.25rem;
  list-style: disc;
  white-space: normal;
}
.ai-msg .ai-msg-list li {
  margin-bottom: 0.125rem;
  line-height: 1.4;
}

/* Pending actions preview */
.ai-assistant-actions-preview {
  padding: 0.5rem 0.75rem;
  border-top: 1px solid #e0e0e0;
  background: #fafbfc;
  flex-shrink: 0;
  max-height: 14rem;
  overflow-y: auto;
}
.ai-assistant-actions-preview-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 0.375rem;
}
.ai-action-card {
  padding: 0.375rem 0.5rem;
  margin-bottom: 0.25rem;
  border-radius: 0.375rem;
  border-left: 3px solid #0b4b66;
  background: #fff;
  font-size: 0.75rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}
.ai-action-card--ADD_FIELD,
.ai-action-card--ADD_SECTION {
  border-left-color: #2e7d32;
}
.ai-action-card--DELETE_FIELD {
  border-left-color: #c62828;
}
.ai-action-card--UPDATE_FIELD,
.ai-action-card--UPDATE_LOCALIZATION {
  border-left-color: #ef6c00;
}
.ai-action-card--HIDE_FIELD {
  border-left-color: #6a1b9a;
}
.ai-action-card--REORDER_FIELDS {
  border-left-color: #1565c0;
}
.ai-action-type {
  font-weight: 600;
  font-size: 0.6875rem;
  text-transform: uppercase;
  color: #555;
  min-width: 5.5rem;
}
.ai-action-detail {
  flex: 1;
  color: #333;
}
.ai-assistant-actions-btns {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.ai-assistant-actions-btns button {
  flex: 1;
  padding: 0.375rem 0;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 600;
}
.ai-btn-apply {
  background: #0b4b66;
  color: #fff;
}
.ai-btn-apply:hover {
  background: #083d54;
}
.ai-btn-dismiss {
  background: #e0e0e0;
  color: #333;
}
.ai-btn-dismiss:hover {
  background: #ccc;
}

/* Input area */
.ai-assistant-input-area {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-top: 1px solid #e0e0e0;
  background: #fff;
  flex-shrink: 0;
  gap: 0.5rem;
}
.ai-assistant-input {
  flex: 1;
  border: 1px solid #d0d0d0;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  outline: none;
  resize: none;
  min-height: 2rem;
  max-height: 4rem;
  font-family: inherit;
}
.ai-assistant-input:focus {
  border-color: #0b4b66;
}
.ai-assistant-send-btn {
  background: #0b4b66;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  width: 2.25rem;
  height: 2.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ai-assistant-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.ai-assistant-send-btn svg {
  width: 1rem;
  height: 1rem;
  fill: #fff;
}

/* Loading dots */
.ai-loading-dots {
  display: flex;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  align-self: flex-start;
}
.ai-loading-dots span {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #999;
  animation: ai-dot-bounce 1.2s infinite ease-in-out;
}
.ai-loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}
.ai-loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes ai-dot-bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

/* Error display */
.ai-assistant-error {
  padding: 0.375rem 0.75rem;
  background: #fdecea;
  color: #c62828;
  font-size: 0.75rem;
  border-top: 1px solid #f5c6cb;
  flex-shrink: 0;
}

/* Field preview card */
.ai-field-preview {
  background: #fff;
  border: 1px solid #e8eaed;
  border-radius: 0.5rem;
  padding: 0;
  margin-top: 0.375rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}
.ai-field-preview-title-bar {
  background: #f1f3f5;
  padding: 0.25rem 0.625rem;
  font-size: 0.625rem;
  font-weight: 600;
  color: #777;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid #e8eaed;
}
.ai-field-preview-header {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.625rem 0.25rem;
}
.ai-field-preview-badge {
  display: inline-block;
  padding: 0.125rem 0.4375rem;
  border-radius: 0.75rem;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  flex-shrink: 0;
}
.ai-field-preview-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.125rem;
}
.ai-field-preview-required {
  color: #c62828;
  font-weight: 700;
  font-size: 0.8125rem;
}
.ai-field-preview-input {
  border: 1px solid #d0d5dd;
  border-radius: 0.375rem;
  padding: 0.4375rem 0.5rem;
  font-size: 0.6875rem;
  color: #999;
  background: #fafbfc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 1.75rem;
  margin: 0 0.625rem;
}
.ai-field-preview-input svg {
  width: 0.875rem;
  height: 0.875rem;
  fill: #999;
  flex-shrink: 0;
}
.ai-field-preview-props {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  padding: 0.375rem 0.625rem 0.5rem;
}
.ai-field-preview-prop {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  border-radius: 0.75rem;
  font-weight: 600;
}

/* Action card for UPDATE_FIELD_PROPERTY */
.ai-action-card--UPDATE_FIELD_PROPERTY {
  border-left-color: #00695c;
}

/* Available fields list in welcome area */
.ai-field-list {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.ai-field-list-title {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 0.125rem;
}
.ai-field-list-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.375rem;
  border-radius: 0.25rem;
  background: #f7f8fa;
  font-size: 0.6875rem;
  color: #333;
}
.ai-field-list-item--hidden {
  opacity: 0.55;
}
.ai-field-list-format {
  display: inline-block;
  padding: 0.0625rem 0.3125rem;
  border-radius: 0.1875rem;
  background: #e3f2fd;
  color: #1565c0;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: lowercase;
  flex-shrink: 0;
}
.ai-field-list-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ai-field-list-badge {
  display: inline-block;
  padding: 0.0625rem 0.25rem;
  border-radius: 0.1875rem;
  background: #fdecea;
  color: #c62828;
  font-size: 0.5625rem;
  font-weight: 700;
  text-transform: uppercase;
  flex-shrink: 0;
}

/* AI Settings panel */
.ai-settings-panel {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #e0e0e0;
  background: #fafbfc;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.ai-settings-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.ai-settings-label {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #555;
  min-width: 4.5rem;
  flex-shrink: 0;
}
.ai-settings-input,
.ai-settings-select {
  flex: 1;
  border: 1px solid #d0d0d0;
  border-radius: 0.375rem;
  padding: 0.3rem 0.5rem;
  font-size: 0.75rem;
  font-family: inherit;
  outline: none;
  background: #fff;
}
.ai-settings-input:focus,
.ai-settings-select:focus {
  border-color: #0b4b66;
}
.ai-settings-hint {
  font-size: 0.625rem;
  color: #888;
  line-height: 1.3;
}
`;
