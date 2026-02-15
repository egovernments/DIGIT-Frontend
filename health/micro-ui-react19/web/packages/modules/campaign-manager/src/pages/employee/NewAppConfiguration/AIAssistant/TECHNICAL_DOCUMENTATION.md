# AI Configuration Copilot — Technical Documentation

## What Is It?

The **AI Configuration Copilot** is a **domain-specific LLM-powered copilot** embedded directly into a form configuration tool. It allows non-technical users to configure mobile app forms using natural language instead of manually navigating complex property panels.

### The Correct Technical Term

This system is best described as an **AI Copilot** (not an "AI Agent"):

| Term | Definition | Does It Apply? |
|------|-----------|---------------|
| **AI Agent** | Autonomous system that plans, decides, and acts independently | No — user must approve every action |
| **AI Assistant** | General-purpose conversational helper (like ChatGPT) | Partially — but this is domain-specific with structured output |
| **AI Copilot** | Domain-specific LLM embedded in a tool, augmenting user capabilities with human-in-the-loop control | **Yes — this is the correct term** |
| **Agentic Copilot** | Copilot with planning capabilities and multi-step action execution | Yes — it generates multi-action plans and executes them atomically |

**Why "Copilot"?**
- It understands the **domain context** (form fields, validation rules, localization)
- It translates **natural language → structured actions** (not free-form text)
- It has a **human-in-the-loop approval step** (propose → review → apply)
- It is **embedded in the application UI** (not a separate tool)
- It enforces **business rules and constraints** before execution

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│  ┌───────────────────┐    ┌──────────────────────────┐  │
│  │  Form Builder UI   │    │   AI Copilot Panel       │  │
│  │  (SidePanelApp)    │◄──►│   (AIAssistantChat)      │  │
│  │                    │    │   ┌──────────────────┐   │  │
│  │  Field List        │    │   │ Chat Messages     │   │  │
│  │  Property Drawer   │    │   │ Field Preview     │   │  │
│  │  Drag & Drop       │    │   │ Action Cards      │   │  │
│  │                    │    │   │ Apply / Dismiss    │   │  │
│  └────────┬───────────┘    │   └──────────────────┘   │  │
│           │                └───────────┬──────────────┘  │
└───────────┼────────────────────────────┼────────────────┘
            │                            │
            ▼                            ▼
┌───────────────────────┐    ┌──────────────────────────┐
│     Redux Store        │    │   LLM API Layer          │
│  ┌─────────────────┐  │    │  (aiService.js)           │
│  │ remoteConfig     │  │    │                          │
│  │ (currentData)    │◄─┼────┤  Anthropic / OpenAI /    │
│  │                  │  │    │  Custom (OpenAI-compat)   │
│  ├─────────────────┤  │    └──────────┬───────────────┘
│  │ fieldPanelMaster │  │               │
│  │ (panelConfig)    │  │               ▼
│  ├─────────────────┤  │    ┌──────────────────────────┐
│  │ localization     │  │    │   System Prompt Builder   │
│  │ (i18n entries)   │  │    │  (systemPrompt.js)        │
│  ├─────────────────┤  │    │                          │
│  │ aiAssistant      │  │    │  Dynamic prompt from:     │
│  │ (chat state)     │  │    │  • Current page config    │
│  └─────────────────┘  │    │  • Field types            │
│           ▲            │    │  • Localization data      │
│           │            │    │  • Property reference     │
│           │            │    │  • Page type rules        │
│           │            │    └──────────────────────────┘
│           │            │
│           ▼            │    ┌──────────────────────────┐
│  ┌─────────────────┐  │    │   Action Executor         │
│  │ Action Dispatch  │◄─┼────┤  (actionExecutor.js)      │
│  │ (Redux actions)  │  │    │                          │
│  └─────────────────┘  │    │  Validates → Dispatches   │
└────────────────────────┘    │  8 action types           │
                              │  Multi-layer validation   │
                              └──────────────────────────┘
```

---

## Data Flow (Request Lifecycle)

```
User types: "Add a phone number field with help text"
                    │
                    ▼
            ┌───────────────┐
            │ 1. BUILD       │  systemPrompt.js
            │    CONTEXT     │  Reads Redux state, builds dynamic
            │                │  system prompt with current config,
            │                │  field types, property reference,
            │                │  localization data, page rules
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │ 2. CALL LLM   │  aiService.js
            │                │  Sends conversation history +
            │                │  system prompt to configured
            │                │  LLM provider (Anthropic/OpenAI)
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │ 3. PARSE       │  aiService.js → parseAIResponse()
            │    RESPONSE    │  Extracts JSON from ```json block
            │                │  Returns { message, actions, preview }
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │ 4. PRESENT     │  AIAssistantChat.js
            │    TO USER     │  Shows AI message, action cards
            │                │  with previews, Apply/Dismiss buttons
            └───────┬───────┘
                    │
              User clicks "Apply"
                    │
                    ▼
            ┌───────────────┐
            │ 5. VALIDATE    │  actionExecutor.js
            │    ACTIONS     │  Per-action validation:
            │                │  • Format-property compatibility
            │                │  • Localization completeness
            │                │  • Range constraints
            │                │  • isMdms rules
            │                │  • Display logic blocking
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │ 6. EXECUTE     │  actionExecutor.js → Redux dispatch
            │    ACTIONS     │  selectField → updateSelectedField
            │                │  → deselectField (same path as
            │                │  manual UI editing)
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │ 7. REPORT      │  AIAssistantChat.js
            │    RESULTS     │  Shows success/failure per action
            │                │  UI re-renders from Redux state
            └───────────────┘
```

---

## File Structure & Responsibilities

```
AIAssistant/
├── aiAssistantSlice.js      # Redux state management
├── AIAssistantChat.js        # React UI component
├── aiService.js              # LLM API abstraction layer
├── systemPrompt.js           # Dynamic prompt builder
├── actionExecutor.js         # Action validation & execution
├── aiAssistantStyles.js      # Scoped CSS-in-JS styles
└── TECHNICAL_DOCUMENTATION.md
```

### 1. `aiAssistantSlice.js` — State Management

Redux Toolkit slice managing the copilot's state:

```javascript
{
  messages: [],          // Chat history [{ role, content, timestamp }]
  isLoading: false,      // API call in progress
  isOpen: false,         // Panel visibility toggle
  error: null,           // Last error message
  pendingActions: [],    // Actions awaiting user approval
  previewField: null,    // Field preview data from AI response
  currentPageName: null, // Auto-clears chat on page navigation
  aiConfig: {            // Provider configuration (persisted to localStorage)
    provider: "anthropic",
    model: "claude-sonnet-4-20250514",
    apiKey: "",
    baseUrl: "",
    maxTokens: 2048,
  },
  showSettings: false,
}
```

**Key behaviors:**
- `setCurrentPageName` — Auto-clears all chat state when user navigates to a different screen
- `setAIConfig` — Merges config updates and persists to `localStorage`
- Config loading uses `{ ...defaults, ...saved }` for forward-compatible defaults

### 2. `AIAssistantChat.js` — UI Component

React component that renders the embedded chat interface:

- **Field list** — Shows all editable fields on the current screen (mirrors `NewAppFieldScreenWrapper`'s logic)
- **Chat messages** — User/assistant message bubbles with auto-scroll
- **Field preview cards** — Visual mock of field types (dropdown arrow, date icon, radio circle, etc.)
- **Action cards** — Color-coded cards showing proposed changes with Apply/Dismiss buttons
- **Settings panel** — Provider, model, API key, base URL, max tokens configuration
- **Template awareness** — Shows different welcome message and placeholder for template vs form screens

**Key design decision:** Uses `useStore().getState()` for fresh Redux state during action execution (not stale React selector closures), enabling multi-action batches where later actions reference state modified by earlier actions.

### 3. `aiService.js` — LLM API Layer

Provider-agnostic service supporting:

| Provider | API Format | Auth Header | Response Path |
|----------|-----------|-------------|---------------|
| Anthropic | Messages API | `x-api-key` | `content[].text` |
| OpenAI | Chat Completions | `Authorization: Bearer` | `choices[0].message.content` |
| Custom | OpenAI-compatible | `Authorization: Bearer` | `choices[0].message.content` |

**Response parsing:** Extracts `{ message, actions, preview }` from the LLM's JSON code block (` ```json ... ``` `). Falls back to treating the entire response as a message if no JSON is found.

### 4. `systemPrompt.js` — Dynamic Prompt Builder

Builds a context-rich system prompt from live Redux state:

```
┌──────────────────────────────────────────────────┐
│                 System Prompt                      │
│                                                    │
│  ┌──────────────────┐  ┌───────────────────────┐  │
│  │ Current Config    │  │ Available Field Types  │  │
│  │ (live page state) │  │ (from fieldTypeMaster) │  │
│  └──────────────────┘  └───────────────────────┘  │
│                                                    │
│  ┌──────────────────┐  ┌───────────────────────┐  │
│  │ Localization Data │  │ Properties Reference   │  │
│  │ (i18n entries)    │  │ (from panelConfig)     │  │
│  └──────────────────┘  └───────────────────────┘  │
│                                                    │
│  ┌──────────────────┐  ┌───────────────────────┐  │
│  │ Page Type Rules   │  │ Action Schema          │  │
│  │ (template/form)   │  │ (8 action types)       │  │
│  └──────────────────┘  └───────────────────────┘  │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │ Business Rules                                │  │
│  │ • Localization rules (localisable properties) │  │
│  │ • isMdms rules (format restrictions)          │  │
│  │ • Validation rules (range, length, etc.)      │  │
│  │ • Display logic blocking                      │  │
│  │ • Format-property compatibility               │  │
│  └──────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

**Template field extraction:** For template screens, recursively walks nested component trees (`child`, `children`, `primaryAction`, `secondaryAction`) to find all editable fields — same logic as the main UI.

### 5. `actionExecutor.js` — Validation & Execution Engine

The most critical file. Handles 8 action types with multi-layer validation:

#### Action Types

| Action | Description | Allowed On |
|--------|-------------|-----------|
| `ADD_FIELD` | Add a new field to a section | Form only |
| `UPDATE_FIELD` | Update basic field properties | Form only |
| `DELETE_FIELD` | Remove a field | Form only |
| `HIDE_FIELD` | Toggle field visibility | Form + Template |
| `REORDER_FIELDS` | Move field within a section | Form only |
| `UPDATE_LOCALIZATION` | Set localization display text | Form + Template |
| `ADD_SECTION` | Add a new card/section | Form only |
| `UPDATE_FIELD_PROPERTY` | Set drawer panel properties | Form only |

#### Validation Pipeline

```
Action arrives
    │
    ▼
┌─────────────────────────────┐
│ 1. Page Type Enforcement     │  Template screens can only
│                              │  HIDE_FIELD + UPDATE_LOCALIZATION
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ 2. Display Logic Blocking    │  visibilityCondition properties
│                              │  redirected to Logic Tab UI
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ 3. Format-Property           │  Dynamically built from panelConfig
│    Compatibility             │  visibilityEnabledFor arrays.
│                              │  e.g., helpText not on radio
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ 4. Localisable Property      │  Ensures UPDATE_LOCALIZATION
│    Completeness              │  actions exist for label,
│                              │  helpText, tooltip, innerLabel,
│                              │  error messages, dropdown options
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ 5. isMdms Format Check       │  Only for dropdown, radio,
│                              │  select, idPopulator,
│                              │  searchableDropdown
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ 6. Range Constraints         │  min <= max for range,
│                              │  lengthRange, ageRange,
│                              │  prefix/suffix max 5 chars
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ 7. Dropdown Options          │  Non-empty array with valid
│    Validation                │  name codes when isMdms=false
└──────────────┬──────────────┘
               │
               ▼
           DISPATCH
```

**Dynamic property config:** `buildPropertyConfigFromPanel(panelConfig)` parses the drawer panel configuration to build:
- `formatMap` — Which properties are available for which field formats
- `localisableProps` — Which properties store localization codes and need `UPDATE_LOCALIZATION`

This means the validation is **data-driven**, not hardcoded — if the panelConfig changes, the validation automatically adapts.

### 6. `aiAssistantStyles.js` — Scoped Styles

CSS-in-JS string injected via `<style>` tag. All classes prefixed with `ai-` to avoid conflicts. Styled for the embedded panel layout (370px width).

---

## Key Design Patterns

### 1. Dynamic Context Injection (Grounding)

The system prompt is rebuilt on every message send with **live application state**. This grounds the LLM in reality — it knows exactly which fields exist, their types, formats, properties, and current localization entries. This eliminates hallucination about non-existent fields.

### 2. Structured Output Contract

The LLM must respond with a specific JSON schema:
```json
{
  "message": "Human-readable explanation",
  "actions": [
    { "type": "ACTION_TYPE", "payload": { ... } }
  ],
  "preview": {
    "fieldName": "...",
    "format": "text",
    "showPreview": true
  }
}
```

This is enforced by the system prompt and parsed by `parseAIResponse()`. If the LLM returns malformed JSON, the response degrades gracefully to a text-only message with no actions.

### 3. Human-in-the-Loop (Propose → Review → Apply)

```
LLM proposes actions → User sees action cards → User clicks Apply/Dismiss
```

The user **always** has the final say. Actions are never auto-executed. This is critical for a configuration tool where mistakes could affect deployed mobile apps.

### 4. Same-Path Execution

Action execution follows the **exact same Redux dispatch path** as manual UI editing:
```javascript
dispatch(selectField({ field, screen, card, cardIndex }));
dispatch(updateSelectedField(properties));
dispatch(deselectField());
```

This ensures the AI-modified state is identical to manually-edited state — no special codepaths, no state divergence.

### 5. Data-Driven Validation

Property compatibility and localisability rules are **derived from the panelConfig at runtime**, not hardcoded. When the panelConfig is updated with new properties or format support, the copilot's validation automatically adapts.

### 6. Provider Abstraction

The AI service layer abstracts away provider differences:
- Different auth header formats
- Different request body structures (system prompt placement)
- Different response shapes

Switching from Anthropic to OpenAI to a self-hosted Ollama instance requires only changing the settings dropdown — no code changes.

---

## How It Differs from "Pure" AI Agents

| Aspect | Autonomous Agent | This Copilot |
|--------|-----------------|-------------|
| **Decision making** | Agent decides and acts | LLM proposes, human decides |
| **Execution** | Autonomous multi-step | Batch execution after approval |
| **Error recovery** | Agent retries/replans | Shows errors, user adjusts prompt |
| **State access** | Agent queries as needed | Full state injected in system prompt |
| **Scope** | Open-ended tasks | Constrained to 8 action types |
| **Validation** | Agent validates itself | Multi-layer server-side validation |
| **Safety** | Guardrails, sandboxing | Human-in-the-loop + validation |

---

## Configuration

### LLM Provider Settings

Configured via the settings gear icon in the copilot panel:

| Setting | Description | Default |
|---------|-------------|---------|
| Provider | Anthropic, OpenAI, or Custom | Anthropic |
| Model | Model identifier | claude-sonnet-4-20250514 |
| API Key | Provider API key | (from env or UI) |
| Base URL | Custom endpoint URL | Provider default |
| Max Tokens | Response token limit | 2048 |

Settings persist to `localStorage` under `ai_assistant_config`.

### Environment Variables (Fallback)

| Variable | Provider |
|----------|----------|
| `REACT_APP_ANTHROPIC_API_KEY` | Anthropic |
| `REACT_APP_OPENAI_API_KEY` | OpenAI |

---

## Security Considerations

1. **API keys** — Stored in browser `localStorage` (per-user, per-browser). Never committed to source code. Environment variables used as fallback.
2. **Direct browser access** — Uses `anthropic-dangerous-direct-browser-access` header for client-side Anthropic calls. In production, consider proxying through a backend.
3. **No server-side execution** — All actions dispatch to the client-side Redux store. No server calls are made by the executor.
4. **Validation-first** — All actions are validated before dispatch. Invalid actions throw errors and are not applied.
5. **Human approval** — No action executes without explicit user approval.

---

## Limitations

1. **Display logic** — `visibilityCondition` configuration is intentionally blocked; users must use the Logic Tab UI.
2. **Template screens** — Only `HIDE_FIELD` and `UPDATE_LOCALIZATION` are allowed (structural changes forbidden).
3. **Client-side API calls** — API keys are exposed in browser network traffic. Production deployments should use a proxy backend.
4. **Context window** — Very large forms with many fields + localization entries may approach LLM context limits (mitigated by truncating localization to 50 entries).
5. **No undo** — Actions that are applied cannot be individually undone through the copilot (standard app undo mechanisms apply).

---

## Glossary

| Term | Meaning |
|------|---------|
| **panelConfig** | JSON schema defining which properties are available per field format |
| **visibilityEnabledFor** | Array in panelConfig specifying which field formats support a property |
| **localisable property** | A property whose value is a localization code (needs display text) |
| **isMdms** | Flag indicating whether a dropdown/radio field gets options from MDMS (master data) or manual list |
| **fieldTypeMaster** | Configuration defining available field types and their editability |
| **template screen** | Pre-defined screen layout where only visibility and labels can be changed |
| **form screen** | Fully editable screen where fields can be added, removed, and reordered |
