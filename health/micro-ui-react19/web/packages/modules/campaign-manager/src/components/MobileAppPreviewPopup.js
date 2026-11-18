import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18N_KEYS } from "../utils/i18nKeyConstants";

/*
 * "Preview mobile app" on a campaign card (My campaigns: ongoing, upcoming,
 * completed): a popup running the field worker app's real flow screens (the
 * HCM flow preview, a Flutter web build) for the campaign's published app
 * configuration.
 *
 * The preview is served on the console's own domain (default /flow-preview/,
 * or globalConfigs HCM_FLOW_PREVIEW_PATH) and is driven over postMessage,
 * same origin only. Protocol (apps/flow_preview/README.md in
 * health-campaign-field-worker-app):
 *   preview -> console  {type: "hcm-preview:ready"}
 *   console -> preview  {type: "hcm-preview:init", session, campaignNumber}
 *   preview -> console  {type: "hcm-preview:status", state, message?}
 * With no `config` in init, the preview opens the campaign's project and
 * lists every published module (HCM-ADMIN-CONSOLE.FormConfig) on its home
 * screen, as the app does.
 */

const previewPath = window.globalConfigs?.getConfig("HCM_FLOW_PREVIEW_PATH") || "/flow-preview/";

const previewUrl = () => {
  const url = new URL(previewPath, window.location.origin);
  url.searchParams.set("embed", "1");
  return url;
};

const MobileAppPreviewPopup = ({ tenantId, campaignNumber, campaignName, onClose }) => {
  const { t } = useTranslation();
  const iframeRef = useRef(null);
  const closeRef = useRef(null);
  // starting | ready | error
  const [phase, setPhase] = useState("starting");
  const [message, setMessage] = useState(null);

  const url = previewUrl();
  const sameOrigin = url.origin === window.location.origin;

  const sendInit = useCallback(() => {
    const user = Digit.UserService.getUser();
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "hcm-preview:init",
        session: {
          token: user?.access_token,
          userInfo: user?.info,
          tenantId,
          locale: Digit.StoreData.getCurrentLanguage(),
        },
        campaignNumber,
      },
      window.location.origin
    );
  }, [tenantId, campaignNumber]);

  // Messages from the preview (same origin, this iframe only).
  useEffect(() => {
    const onMessage = (e) => {
      if (e.origin !== window.location.origin || e.source !== iframeRef.current?.contentWindow) return;
      const msg = e.data || {};
      if (msg.type === "hcm-preview:ready") {
        // Also after a reload of the preview: start a new session.
        setPhase("starting");
        setMessage(null);
        sendInit();
      } else if (msg.type === "hcm-preview:status") {
        if (msg.state === "ready") {
          setPhase("ready");
          setMessage(null);
        } else if (msg.state === "loading") {
          setPhase("starting");
        } else if (msg.state === "error") {
          setPhase("error");
          setMessage(msg.message || t(I18N_KEYS.COMPONENTS.PREVIEW_MOBILE_APP_FAILED));
        }
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [sendInit, t]);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const isError = phase === "error" || !sameOrigin;
  const status = !sameOrigin
    ? t(I18N_KEYS.COMPONENTS.PREVIEW_MOBILE_APP_NOT_AVAILABLE)
    : phase === "starting"
    ? t(I18N_KEYS.COMPONENTS.PREVIEW_MOBILE_APP_STARTING)
    : phase === "error"
    ? message
    : null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="mobile-app-preview-title" style={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.titles}>
            <h2 id="mobile-app-preview-title" style={styles.title}>
              {t(I18N_KEYS.COMPONENTS.PREVIEW_MOBILE_APP)}
            </h2>
            {campaignName && <span style={styles.subtitle}>{campaignName}</span>}
          </div>
          <button
            ref={closeRef}
            type="button"
            style={styles.close}
            onClick={onClose}
            aria-label={t(I18N_KEYS.COMPONENTS.PREVIEW_MOBILE_APP_CLOSE)}
            title={t(I18N_KEYS.COMPONENTS.PREVIEW_MOBILE_APP_CLOSE)}
          >
            ×
          </button>
        </div>
        <p style={styles.note}>{t(I18N_KEYS.COMPONENTS.PREVIEW_MOBILE_APP_NOTE)}</p>
        {status && (
          <div role={isError ? "alert" : "status"} style={isError ? styles.error : styles.status}>
            {status}
          </div>
        )}
        {sameOrigin && (
          <iframe ref={iframeRef} title={t(I18N_KEYS.COMPONENTS.PREVIEW_MOBILE_APP)} src={url.toString()} style={styles.frame} />
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
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  },
  popup: {
    width: "min(28rem, 100%)",
    height: "min(52rem, 100%)",
    background: "#FFFFFF",
    borderRadius: "0.5rem",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 0.5rem 2rem rgba(0, 0, 0, 0.24)",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.5rem",
    padding: "0.75rem 0.75rem 0.5rem 1rem",
    borderBottom: "1px solid #D6D5D4",
  },
  titles: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column" },
  title: { margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#0B4B66" },
  subtitle: { fontSize: "0.875rem", color: "#505A5F", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
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

export default MobileAppPreviewPopup;
