import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const TooltipPortal = ({ text, targetRef, visible }) => {
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (targetRef.current && visible) {
      const rect = targetRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + window.scrollY - 50, // 35px above the element
      });
    }
  }, [targetRef, visible]);

  if (!visible) return null;

  return ReactDOM.createPortal(
    <div
      style={{
        position: "absolute",
        width: "22rem",
        right: "2rem",
        top: coords.top,
        left: coords.left,
        backgroundColor: "#333",
        color: "#fff",
        padding: "6px 10px",
        borderRadius: "4px",
        fontSize: "12px",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      {text}
    </div>,
    document.body
  );
};

export default TooltipPortal;
