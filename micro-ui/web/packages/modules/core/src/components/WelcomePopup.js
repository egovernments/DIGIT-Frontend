import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

/**
 * WelcomePopup
 *
 * Shown once after login when:
 *  1. `showPopup` is true (caller controls this via `justLoggedIn` state)
 *  2. The global config key `GET_STARTED_ENABLED` is truthy
 *
 * Props:
 *  - onClose : () => void   – called when the user dismisses the popup
 */
const WelcomePopup = ({ onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Guard: only render when globalConfig explicitly enables the popup
  const isEnabled = window?.globalConfigs?.getConfig?.("GET_STARTED_ENABLED");
  if (!isEnabled) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "1150px",
          height: "519px",
          maxWidth: "92%",
          background: "#fff",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 30px 90px rgba(0,0,0,0.18)",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
        }}
      >
        {/* LOGO SECTION */}
        <div>
          <img
            src="https://egov-dev-assets.s3.ap-south-1.amazonaws.com/digit_image.png"
            alt={t("DIGIT_LOGO_ALT")}
            style={{ height: "32px" }}
          />
        </div>

        {/* MAIN CONTENT SECTION */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "60px",
            height: "378px",
          }}
        >
          {/* TEXT BLOCK */}
          <div style={{ width: "608px" }}>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 300,
                color: "#0B4B66",
                marginBottom: "16px",
                lineHeight: "40px",
                fontFamily: "Roboto",
              }}
            >
              {t("DIGIT_STUDIO_WELCOME_HEADING")}
            </h1>

            <p
              style={{
                fontSize: "18px",
                color: "rgba(11, 75, 102, 1)",
                lineHeight: "26px",
                marginBottom: "28px",
                fontWeight: "400",
                fontFamily: "Roboto",
              }}
            >
              {t("DIGIT_STUDIO_WELCOME_DESCRIPTION")}
            </p>

            <button
              onClick={() => {
                onClose();
                navigate(`/${window.contextPath}/employee/servicedesigner/LandingPage`);
              }}
              style={{
                background: "#C2410C",
                color: "#fff",
                border: "none",
                padding: "8px 24px",
                fontSize: "16px",
                fontWeight: 600,
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              {t("DIGIT_STUDIO_GET_STARTED")}
            </button>
          </div>

          {/* IMAGE SECTION */}
          <img
            src={
              window?.globalConfigs?.getConfig?.("WELCOME_POPUP_IMAGE")?.trim()
                ? window?.globalConfigs?.getConfig?.("WELCOME_POPUP_IMAGE")
                : `https://egov-dev-assets.s3.ap-south-1.amazonaws.com/designer-image.png`
            }
            alt={t("DIGIT_STUDIO_PREVIEW_ALT")}
            style={{
              width: "520px",
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;