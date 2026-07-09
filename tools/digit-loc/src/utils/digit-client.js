/**
 * DIGIT API client for localization operations.
 *
 * Handles authentication, fetching translations, and upserting payloads
 * against a DIGIT environment's localization service.
 */

"use strict";

const DEFAULT_LOCALE = "en_IN";
const DEFAULT_TENANT = "default";
const BATCH_SIZE = 50;

/**
 * Create a DIGIT API client bound to a specific environment.
 *
 * @param {object} options
 * @param {string} options.envUrl - Base URL (e.g., https://uat.digit.org)
 * @param {string} [options.token] - Auth token (or set DIGIT_AUTH_TOKEN env)
 * @param {string} [options.tenant] - Tenant ID
 * @param {string} [options.locale] - Locale code
 */
function createClient(options = {}) {
  const envUrl = (options.envUrl || "").replace(/\/+$/, "");
  const token = options.token || process.env.DIGIT_AUTH_TOKEN || "";
  const tenant = options.tenant || DEFAULT_TENANT;
  const locale = options.locale || DEFAULT_LOCALE;

  if (!envUrl) throw new Error("envUrl is required");

  /**
   * Make an authenticated API request.
   */
  async function request(path, method, body) {
    const url = `${envUrl}${path}`;
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const opts = { method, headers };
    if (body) {
      opts.body = JSON.stringify(body);
    }

    const resp = await fetch(url, opts);
    const contentType = resp.headers.get("content-type") || "";

    let data;
    if (contentType.includes("json")) {
      data = await resp.json();
    } else {
      data = await resp.text();
    }

    if (!resp.ok) {
      const errMsg = typeof data === "object" ? JSON.stringify(data) : data;
      throw new Error(`API error ${resp.status}: ${errMsg}`);
    }

    return data;
  }

  /**
   * Search for localization messages.
   *
   * @param {string} module - Module name (e.g., "hcm-base-campaign")
   * @param {object} [opts]
   * @param {string} [opts.locale] - Override locale
   * @param {string} [opts.tenantId] - Override tenant
   * @returns {Promise<Array<{code, message, module, locale}>>}
   */
  async function searchMessages(module, opts = {}) {
    const searchLocale = opts.locale || locale;
    const searchTenant = opts.tenantId || tenant;

    const body = {
      RequestInfo: {
        apiId: "Rainmaker",
        authToken: token,
      },
      MsgCriteria: {
        tenantId: searchTenant,
        locale: searchLocale,
        module,
      },
    };

    const result = await request(
      "/localization/messages/v1/_search",
      "POST",
      body
    );

    return (result.messages || []).map((m) => ({
      code: m.code,
      message: m.message,
      module: m.module,
      locale: m.locale,
    }));
  }

  /**
   * Upsert localization messages.
   *
   * @param {Array<{code, message, module, locale}>} messages
   * @param {object} [opts]
   * @param {string} [opts.tenantId] - Override tenant
   * @returns {Promise<object>} API response
   */
  async function upsertMessages(messages, opts = {}) {
    const upsertTenant = opts.tenantId || tenant;
    const results = [];

    // Batch to avoid payload limits
    for (let i = 0; i < messages.length; i += BATCH_SIZE) {
      const batch = messages.slice(i, i + BATCH_SIZE);

      const body = {
        RequestInfo: {
          apiId: "Rainmaker",
          authToken: token,
        },
        tenantId: upsertTenant,
        messages: batch.map((m) => ({
          code: m.code,
          message: m.message,
          module: m.module,
          locale: m.locale || locale,
        })),
      };

      const result = await request(
        "/localization/messages/v1/_upsert",
        "POST",
        body
      );

      results.push(result);

      // Rate limiting between batches
      if (i + BATCH_SIZE < messages.length) {
        await new Promise((r) => setTimeout(r, 200));
      }
    }

    return results;
  }

  /**
   * Fetch all messages for multiple modules.
   *
   * @param {string[]} modules - Array of module names
   * @returns {Promise<Map<string, string>>} Map of code -> message
   */
  async function fetchAllMessages(modules) {
    const allMessages = new Map();

    for (const mod of modules) {
      const messages = await searchMessages(mod);
      for (const m of messages) {
        allMessages.set(m.code, m.message);
      }
    }

    return allMessages;
  }

  return {
    searchMessages,
    upsertMessages,
    fetchAllMessages,
    envUrl,
    tenant,
    locale,
  };
}

module.exports = { createClient, DEFAULT_LOCALE, DEFAULT_TENANT, BATCH_SIZE };
