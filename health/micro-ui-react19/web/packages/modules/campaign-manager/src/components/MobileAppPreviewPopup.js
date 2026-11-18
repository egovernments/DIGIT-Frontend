import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18N_KEYS } from "../utils/i18nKeyConstants";

/*
 * "Preview mobile app" on a campaign card (My campaigns: ongoing, upcoming,
 * completed): a popup running the field worker app's real screens (the HCM
 * flow preview, a Flutter web build served on the console's domain at
 * /flow-preview/, or globalConfigs HCM_FLOW_PREVIEW_PATH).
 *
 * It starts like the app on a phone: the login screen. The user signs in with
 * a field worker account; with ?campaign=<campaign number>, a user assigned to
 * this campaign goes straight to it, otherwise they choose a project as in the
 * app. Then boundary selection and home with the campaign's published modules.
 */

const previewPath = window.globalConfigs?.getConfig("HCM_FLOW_PREVIEW_PATH") || "/flow-preview/";

// The app is rendered at a real phone's logical size and scaled down to fit
// the window, so every screen keeps the layout field workers see.
const PHONE = { width: 412, height: 915 };
const HEADER_HEIGHT = 56;
const MARGIN = 16;

const previewUrl = (campaignNumber) => {
  const url = new URL(previewPath, window.location.origin);
  // The popup is the phone; the preview should not draw another frame.
  url.searchParams.set("frame", "off");
  if (campaignNumber) url.searchParams.set("campaign", campaignNumber);
  return url;
};

const fitScale = () =>
  Math.min(
    1,
    (window.innerHeight - 2 * MARGIN - HEADER_HEIGHT) / PHONE.height,
    (window.innerWidth - 2 * MARGIN) / PHONE.width
  );

const MobileAppPreviewPopup = ({ campaignNumber, campaignName, onClose }) => {
  const { t } = useTranslation();
  const closeRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(fitScale);

  const url = previewUrl(campaignNumber);
  // Same domain only: the preview signs in against this domain's APIs.
  const sameOrigin = url.origin === window.location.origin;

  useEffect(() => {
    const onResize = () => setScale(fitScale());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const status = !sameOrigin
    ? t(I18N_KEYS.COMPONENTS.PREVIEW_MOBILE_APP_NOT_AVAILABLE)
    : !loaded
    ? t(I18N_KEYS.COMPONENTS.PREVIEW_MOBILE_APP_STARTING)
    : null;

  const width = Math.round(PHONE.width * scale);
  const height = Math.round(PHONE.height * scale);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-app-preview-title"
        style={{ ...styles.popup, width }}
        onClick={(e) => e.stopPropagation()}
      >
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
        <div style={{ ...styles.screen, width, height }}>
          {sameOrigin && (
            <iframe
              title={t(I18N_KEYS.COMPONENTS.PREVIEW_MOBILE_APP)}
              src={url.toString()}
              onLoad={() => setLoaded(true)}
              style={{ ...styles.frame, transform: `scale(${scale})` }}
            />
          )}
          {status && (
            <div role={sameOrigin ? "status" : "alert"} style={sameOrigin ? styles.status : styles.error}>
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const overlay = {
  position: "absolute",
  left: "0.5rem",
  right: "0.5rem",
  bottom: "0.5rem",
  padding: "0.5rem 0.75rem",
  borderRadius: "0.25rem",
  fontSize: "0.875rem",
  boxShadow: "0 0.125rem 0.5rem rgba(0, 0, 0, 0.16)",
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
    padding: MARGIN,
  },
  popup: {
    background: "#FFFFFF",
    borderRadius: "0.5rem",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 0.5rem 2rem rgba(0, 0, 0, 0.24)",
  },
  header: {
    height: HEADER_HEIGHT,
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0 0.25rem 0 1rem",
    borderBottom: "1px solid #D6D5D4",
  },
  titles: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column" },
  title: { margin: 0, fontSize: "1rem", fontWeight: 700, color: "#0B4B66", lineHeight: 1.25 },
  subtitle: { fontSize: "0.75rem", color: "#505A5F", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
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
  // The phone screen: the iframe is laid out at phone size and scaled into it.
  screen: { position: "relative", overflow: "hidden", flex: "none" },
  frame: {
    width: PHONE.width,
    height: PHONE.height,
    border: 0,
    display: "block",
    transformOrigin: "top left",
  },
  // Loading messages float over the screen instead of taking space.
  status: { ...overlay, color: "#0B4B66", background: "#E6F0F5" },
  error: { ...overlay, color: "#B91900", background: "#FCECE9" },
};

export default MobileAppPreviewPopup;
