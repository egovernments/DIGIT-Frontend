/**
 * Provider-agnostic AI service.
 * Supports Anthropic, OpenAI, and any OpenAI-compatible endpoint (e.g. Ollama, Azure, Together, etc.)
 */

const PROVIDER_DEFAULTS = {
  anthropic: {
    baseUrl: "https://api.anthropic.com/v1/messages",
    model: "claude-sonnet-4-20250514",
    envKey: "REACT_APP_ANTHROPIC_API_KEY",
  },
  openai: {
    baseUrl: "https://api.openai.com/v1/chat/completions",
    model: "gpt-4o",
    envKey: "REACT_APP_OPENAI_API_KEY",
  },
  custom: {
    baseUrl: "",
    model: "",
    envKey: "",
  },
};

/**
 * Calls the configured AI provider.
 * @param {Object} config - { provider, model, apiKey, baseUrl, maxTokens }
 * @param {Array} conversationHistory - [{ role, content }]
 * @param {string} systemPrompt
 * @returns {{ message: string, actions: Array }}
 */
export async function callAI(config, conversationHistory, systemPrompt) {
  const { provider } = config;

  const resolvedApiKey = config.apiKey || getEnvKey(provider);
  if (!resolvedApiKey) {
    const envName = PROVIDER_DEFAULTS[provider]?.envKey || "";
    throw new Error(
      `No API key configured. Set it in AI settings${envName ? ` or via ${envName} env variable` : ""}.`
    );
  }

  const resolvedConfig = { ...config, apiKey: resolvedApiKey };

  if (provider === "anthropic") {
    return callAnthropic(resolvedConfig, conversationHistory, systemPrompt);
  }

  // OpenAI and custom both use the OpenAI chat completions format
  return callOpenAICompatible(resolvedConfig, conversationHistory, systemPrompt);
}

function getEnvKey(provider) {
  const envName = PROVIDER_DEFAULTS[provider]?.envKey;
  if (!envName) return "";
  return process.env[envName] || "";
}

// ── Anthropic ──────────────────────────────────────────────────────

async function callAnthropic(config, conversationHistory, systemPrompt) {
  const baseUrl = config.baseUrl || PROVIDER_DEFAULTS.anthropic.baseUrl;
  const model = config.model || PROVIDER_DEFAULTS.anthropic.model;
  const maxTokens = config.maxTokens || 2048;

  const messages = conversationHistory.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    throw await buildHttpError("Anthropic", response);
  }

  const data = await response.json();
  const textContent = data.content?.find((block) => block.type === "text")?.text || "";
  return parseAIResponse(textContent);
}

// ── OpenAI / OpenAI-compatible ─────────────────────────────────────

async function callOpenAICompatible(config, conversationHistory, systemPrompt) {
  const defaults = PROVIDER_DEFAULTS[config.provider] || PROVIDER_DEFAULTS.openai;
  const baseUrl = config.baseUrl || defaults.baseUrl;
  const model = config.model || defaults.model;
  const maxTokens = config.maxTokens || 2048;

  if (!baseUrl) {
    throw new Error("Custom provider requires a Base URL. Set it in AI settings.");
  }

  const messages = [
    { role: "system", content: systemPrompt },
    ...conversationHistory.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  ];

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages,
    }),
  });

  if (!response.ok) {
    throw await buildHttpError(config.provider, response);
  }

  const data = await response.json();
  const textContent = data.choices?.[0]?.message?.content || "";
  return parseAIResponse(textContent);
}

// ── Shared helpers ─────────────────────────────────────────────────

async function buildHttpError(provider, response) {
  const status = response.status;
  if (status === 401) return new Error(`Invalid API key for ${provider}. Check your settings.`);
  if (status === 429) return new Error("Rate limit exceeded. Please wait a moment and try again.");
  if (status === 500 || status === 503) return new Error(`${provider} API is temporarily unavailable. Try again later.`);
  const body = await response.text().catch(() => "");
  return new Error(`${provider} API error (${status}): ${body || response.statusText}`);
}

/**
 * Extracts { message, actions, preview } JSON from the AI's text response.
 * Looks for a ```json code block, falls back to treating entire text as message.
 */
function parseAIResponse(text) {
  const jsonBlockRegex = /```json\s*([\s\S]*?)```/;
  const match = text.match(jsonBlockRegex);

  if (match) {
    try {
      const parsed = JSON.parse(match[1].trim());
      return {
        message: parsed.message || "",
        actions: Array.isArray(parsed.actions) ? parsed.actions : [],
        preview: parsed.preview || null,
      };
    } catch (e) {
      return { message: text, actions: [], preview: null };
    }
  }

  try {
    const parsed = JSON.parse(text);
    return {
      message: parsed.message || "",
      actions: Array.isArray(parsed.actions) ? parsed.actions : [],
      preview: parsed.preview || null,
    };
  } catch (e) {
    return { message: text, actions: [], preview: null };
  }
}
