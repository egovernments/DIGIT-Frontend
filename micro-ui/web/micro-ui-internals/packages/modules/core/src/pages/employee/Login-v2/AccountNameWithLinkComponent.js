import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@egovernments/digit-ui-components";

const AccountNameWithLinkComponent = ({ onSelect, formData, control, formState, ...props }) => {
  const { t } = useTranslation();
  const [showTip, setShowTip] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowTip(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ width: "100%", maxWidth: "540px", marginTop: "-0.5rem", position: "relative" }}>
      {/* Forgot Organization Name link - aligned to the right */}
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "flex-end",
          width: "100%"
        }}
      >
        <Button
          label={t(`SB_FORGOTORGANIZATION_TOOLTIP`)}
          variation={"link"}
          size={"small"}
          onClick={() => setShowTip((prev) => !prev)}
          style={{
            padding: "0",
            whiteSpace: "nowrap"
          }}
        />
      </div>
      {showTip && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: "0",
            transform: "translateY(4px)",
            backgroundColor: "#0b4b66",
            color: "white",
            padding: "6px 10px",
            borderRadius: "4px",
            whiteSpace: "normal",
            wordBreak: "break-word",
            maxWidth: "20rem",
            zIndex: 1000,
            fontSize: "0.875rem"
          }}
        >
          {t("SB_FORGOTORGANIZATION_TOOLTIP_TEXT")}
        </div>
      )}
    </div>
  );
};

export default AccountNameWithLinkComponent;
