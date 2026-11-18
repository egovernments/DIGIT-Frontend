import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@egovernments/digit-ui-components";
import transformMdmsToAppConfig from "./transformers/mdmsToAppConfig";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";

/*
 * "Preview in app": runs the field worker app's real flow screens (the HCM
 * flow preview, a Flutter web build) in an iframe on the current draft,
 * without publishing it to HCM-ADMIN-CONSOLE.FormConfig.
 *
 * The preview is served on the console's own domain (default /flow-preview/,
 * or globalConfigs HCM_FLOW_PREVIEW_PATH) and is driven over postMessage,
 * same origin only. Protocol (see apps/flow_preview/README.md in
 * health-campaign-field-worker-app):
 *   preview -> console  {type: "hcm-preview:ready"}
 *   console -> preview  {type: "hcm-preview:init", session, campaignNumber, config}
 *   console -> preview  {type: "hcm-preview:config", config}
 *   preview -> console  {type: "hcm-preview:status", state, message?}
 */

const mdmsContext = window.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
const previewPath = window.globalConfigs?.getConfig("HCM_FLOW_PREVIEW_PATH") || "/flow-preview/";

const mdmsSearch = (tenantId, schemaCode, filters) =>
  Digit.CustomService.getResponse({
    url: `/${mdmsContext}/v2/_search`,
    body: {
      MdmsCriteria: { tenantId, schemaCode, filters, limit: 1000, isActive: true },
    },
  });

/**
 * The module's FormConfig as it would be published now: the saved record
 * (or a new one) with flows rebuilt from the draft screens, the same way
 * AppConfigSaveLoader builds them. Nothing is written.
 */
export const buildDraftFormConfig = async ({ tenantId, campaignNumber, flowModule }) => {
  const [drafts, saved] = await Promise.all([
    mdmsSearch(tenantId, "HCM-ADMIN-CONSOLE.TransformedFormConfig", { project: campaignNumber, module: flowModule }),
    mdmsSearch(tenantId, "HCM-ADMIN-CONSOLE.FormConfig", { project: campaignNumber, name: flowModule }),
  ]);
  const screens = (drafts?.mdms || []).map((item) => item.data);
  if (screens.length === 0) {
    throw new Error("NO_DRAFT_SCREENS");
  }
  const existing = saved?.mdms?.[0]?.data;
  const flows = transformMdmsToAppConfig(screens, existing?.version || 0, existing?.flows);
  return {
    ...(existing || { name: flowModule, project: campaignNumber }),
    flows,
  };
};

const previewUrl = () => {
  const url = new URL(previewPath, window.location.origin);
  url.searchParams.set("embed", "1");
  return url;
};

/**
 * Right-hand drawer with the preview.
 *
 * @param {() => Promise<boolean>} prepare  saves the screen being edited
 *   (returns false when it has validation errors); called before every
 *   draft is built.
 */
const AppPreviewDrawer = ({ tenantId, campaignNumber, flowModule, prepare, onClose }) => {
  const { t } = useTranslation();
  const iframeRef = useRef(null);
  const closeRef = useRef(null);
  const readyRef = useRef(false);
  const initSentRef = useRef(false);
  // The preview accepted init (it answers "ready"); until then a new draft
  // goes in a new init, not a config update.
  const sessionReadyRef = useRef(false);
  const configRef = useRef(null);
  // building | starting | ready | error
  const [phase, setPhase] = useState("building");
  const [message, setMessage] = useState(null);

  const url = previewUrl();
  const sameOrigin = url.origin === window.location.origin;

  const post = useCallback((msg) => {
    iframeRef.current?.contentWindow?.postMessage(msg, window.location.origin);
  }, []);

  // init once both the preview is listening and the draft is built.
  const sendInitIfReady = useCallback(() => {
    if (!readyRef.current || !configRef.current || initSentRef.current) return;
    const user = Digit.UserService.getUser();
    initSentRef.current = true;
    post({
      type: "hcm-preview:init",
      session: {
        token: user?.access_token,
        userInfo: user?.info,
        tenantId,
        locale: Digit.StoreData.getCurrentLanguage(),
      },
      campaignNumber,
      config: configRef.current,
    });
  }, [post, tenantId, campaignNumber]);

  const loadDraft = useCallback(async () => {
    setPhase("building");
    setMessage(null);
    try {
      if (prepare && !(await prepare())) {
        setPhase("error");
        setMessage(t(I18N_KEYS.APP_CONFIGURATION.PREVIEW_IN_APP_FIX_ERRORS));
        return;
      }
      const config = await buildDraftFormConfig({ tenantId, campaignNumber, flowModule });
      configRef.current = config;
      if (sessionReadyRef.current) {
        post({ type: "hcm-preview:config", config });
      } else {
        initSentRef.current = false;
        setPhase("starting");
        sendInitIfReady();
      }
    } catch (e) {
      console.error("App preview: could not build the draft", e);
      setPhase("error");
      setMessage(
        e?.message === "NO_DRAFT_SCREENS"
          ? t(I18N_KEYS.APP_CONFIGURATION.PREVIEW_IN_APP_NO_DRAFT)
          : t(I18N_KEYS.APP_CONFIGURATION.PREVIEW_IN_APP_FAILED)
      );
    }
  }, [prepare, tenantId, campaignNumber, flowModule, post, sendInitIfReady, t]);

  // Messages from the preview (same origin, this iframe only).
  useEffect(() => {
    const onMessage = (e) => {
      if (e.origin !== window.location.origin || e.source !== iframeRef.current?.contentWindow) return;
      const msg = e.data || {};
      if (msg.type === "hcm-preview:ready") {
        // A reload of the preview starts a new session.
        readyRef.current = true;
        initSentRef.current = false;
        sessionReadyRef.current = false;
        sendInitIfReady();
      } else if (msg.type === "hcm-preview:status") {
        if (msg.state === "ready" || msg.state === "config-applied") {
          sessionReadyRef.current = true;
          setPhase("ready");
          setMessage(null);
        } else if (msg.state === "loading") {
          setPhase("starting");
        } else if (msg.state === "error") {
          setPhase("error");
          setMessage(msg.message || t(I18N_KEYS.APP_CONFIGURATION.PREVIEW_IN_APP_FAILED));
        }
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [sendInitIfReady, t]);

  useEffect(() => {
    if (sameOrigin) loadDraft();
    closeRef.current?.focus();
    // Build once on open; "Reload draft" rebuilds.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const status =
    !sameOrigin
      ? t(I18N_KEYS.APP_CONFIGURATION.PREVIEW_IN_APP_NOT_SAME_ORIGIN)
      : phase === "building"
      ? t(I18N_KEYS.APP_CONFIGURATION.PREVIEW_IN_APP_BUILDING)
      : phase === "starting"
      ? t(I18N_KEYS.APP_CONFIGURATION.PREVIEW_IN_APP_STARTING)
      : phase === "error"
      ? message
      : null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-preview-drawer-title"
        style={styles.drawer}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.header}>
          <h2 id="app-preview-drawer-title" style={styles.title}>
            {t(I18N_KEYS.APP_CONFIGURATION.PREVIEW_IN_APP)}
          </h2>
          <Button
            variation="secondary"
            size="small"
            icon="Preview"
            label={t(I18N_KEYS.APP_CONFIGURATION.PREVIEW_IN_APP_RELOAD)}
            title={t(I18N_KEYS.APP_CONFIGURATION.PREVIEW_IN_APP_RELOAD)}
            isDisabled={!sameOrigin || phase === "building"}
            onClick={loadDraft}
          />
          <button ref={closeRef} type="button" style={styles.close} onClick={onClose} aria-label={t(I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_CLOSE_PANEL)}>
            ×
          </button>
        </div>
        <p style={styles.note}>{t(I18N_KEYS.APP_CONFIGURATION.PREVIEW_IN_APP_NOTE)}</p>
        {status && (
          <div role={phase === "error" || !sameOrigin ? "alert" : "status"} style={phase === "error" || !sameOrigin ? styles.error : styles.status}>
            {status}
          </div>
        )}
        {sameOrigin && (
          <iframe
            ref={iframeRef}
            title={t(I18N_KEYS.APP_CONFIGURATION.PREVIEW_IN_APP)}
            src={url.toString()}
            style={styles.frame}
          />
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(11, 12, 12, 0.4)",
    zIndex: 10000,
    display: "flex",
    justifyContent: "flex-end",
  },
  drawer: {
    width: "min(30rem, 100vw)",
    height: "100%",
    background: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    boxShadow: "-0.25rem 0 1rem rgba(0, 0, 0, 0.16)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1rem",
    borderBottom: "1px solid #D6D5D4",
  },
  title: { flex: 1, margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#0B4B66" },
  close: {
    border: 0,
    background: "transparent",
    fontSize: "1.5rem",
    lineHeight: 1,
    minWidth: "2.75rem",
    minHeight: "2.75rem",
    cursor: "pointer",
    color: "#505A5F",
  },
  note: { margin: 0, padding: "0.5rem 1rem", fontSize: "0.875rem", color: "#505A5F" },
  status: { padding: "0 1rem 0.5rem", fontSize: "0.875rem", color: "#0B4B66" },
  error: { padding: "0 1rem 0.5rem", fontSize: "0.875rem", color: "#B91900" },
  frame: { flex: 1, width: "100%", border: 0 },
};

export default AppPreviewDrawer;
