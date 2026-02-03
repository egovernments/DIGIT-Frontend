import React, { useState, useEffect ,Fragment} from "react";
import { useTranslation } from "react-i18next";
export const ProgressBar = ({ steps, currentStep }) => {
  const { t } = useTranslation();
    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ background: "#e0e0e0", height: "8px", borderRadius: "4px" }}>
          <div
            style={{
              width: `${progress}%`,
              background: "#0b7285",
              height: "100%",
              borderRadius: "4px",
              transition: "width 0.5s ease-in-out",
            }}
          />
        </div>
        <p style={{ marginTop: "0.5rem", fontSize: "14px", textAlign: "center" }}>
             ({t(steps[currentStep])})
        </p>
      </div>
    );
  };
  