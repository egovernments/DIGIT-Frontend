import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const TooltipPortal = ({ text, targetRef, visible }) => {
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (targetRef.current && visible) {
      const rect = targetRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + window.scrollY - 35, // 35px above the element
        left: rect.left + rect.width / 2 + window.scrollX,
      });
    }
  }, [targetRef, visible]);

  if (!visible) return null;

  return ReactDOM.createPortal(
    <div
      style={{
        position: "absolute",
        top: coords.top,
        left: coords.left,
        transform: "translateX(-50%)",
        backgroundColor: "#333",
        color: "#fff",
        padding: "6px 10px",
        borderRadius: "4px",
        fontSize: "12px",
        zIndex: 9999,
        whiteSpace: "nowrap",
        pointerEvents: "none",
      }}
    >
      {text}
    </div>,
    document.body
  );
};

export default TooltipPortal;
