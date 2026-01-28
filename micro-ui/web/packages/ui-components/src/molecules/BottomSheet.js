import React, { useState, useRef, useEffect } from "react";

const BottomSheet = ({
  children,
  initialState = "closed",
  enableActions,
  actions,
  equalWidthButtons,
  className,
  style,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [currentSheetState, setCurrentSheetState] = useState(initialState);
  const [height, setHeight] = useState(
    enableActions && actions ? "fit-content" : "40px"
  );
  const sheetRef = useRef(null);

  const handleDragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrag = (e) => {
    if (isDragging) {
      const defaultMInHeight = enableActions && actions ? 96 : 40;
      const newHeight = Math.min(
        Math.max(window.innerHeight - e.clientY, defaultMInHeight),
        window.innerHeight
      );
      setHeight(newHeight + "px");
      if (newHeight === window.innerHeight) {
        setCurrentSheetState("full");
        setHeight(window.innerHeight);
      } else if (newHeight >= window.innerHeight * 0.75) {
        setCurrentSheetState("intermediate");
        setHeight(window.innerHeight * 0.75);
      } else if (newHeight >= window.innerHeight * 0.5) {
        setCurrentSheetState("quarter");
        setHeight(window.innerHeight * 0.5);
      } else if (newHeight >= window.innerHeight * 0.3) {
        setCurrentSheetState("fixed");
        setHeight(window.innerHeight * 0.3)
      } else if (
        (newHeight > 40 && !enableActions) ||
        (newHeight > 96 && enableActions)
      ) {
        setCurrentSheetState("fixed");
        setHeight(window.innerHeight * 0.3)
      } else {
        setCurrentSheetState("closed");
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", handleDragEnd);
    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isDragging]);

  const setHeightState = (state) => {
    switch (state) {
      case "fixed":
        setHeight(`${window.innerHeight * 0.3}px`);
        break;
      case "quarter":
        setHeight(`${window.innerHeight * 0.5}px`);
        break;
      case "intermediate":
        setHeight(`${window.innerHeight * 0.75}px`);
        break;
      case "full":
        setHeight(`${window.innerHeight}px`);
        break;
      default:
        setHeight(enableActions && actions ? "fit-content" : "40px");
    }
  };

  useEffect(() => {
    setHeightState(initialState);
  }, [initialState]);

  return (
    <div
      className={`digit-bottom-sheet ${currentSheetState} ${
        enableActions ? "actionsEnabled" : ""
      } ${className || ""}`}
      style={{ ...style, height }}
      ref={sheetRef}
      role="dialog"
      aria-label="Bottom Sheet"
    >
      <div
        className={`digit-bottom-sheet-header ${currentSheetState} ${
          enableActions ? "actionsEnabled" : ""
        }`}
      >
        <div
          className="digit-bottom-sheet-drag-cursor"
          onMouseDown={handleDragStart}
          role="separator"
          aria-label="Drag to resize the bottom sheet"
        />
        <div
          className="digit-bottom-sheet-handle-indicator"
          aria-hidden="true"
        ></div>
      </div>
      {currentSheetState !== "closed" && (
        <div
          className={`digit-bottom-sheet-content ${
            enableActions ? "actionsEnabled" : ""
          }`}
          role="region"
          aria-label="Bottom sheet content"
        >
          {children}
        </div>
      )}
      {enableActions && actions && (
        <div
          className={`digit-bottom-sheet-actions ${currentSheetState} ${
            equalWidthButtons ? "equalButtons" : ""
          }`}
          role="group"
          aria-label="Bottom sheet actions"
        >
          {actions}
        </div>
      )}
    </div>
  );
};

export default BottomSheet;
