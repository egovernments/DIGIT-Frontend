import React, { useState, useRef, useEffect, useCallback } from "react";
import { Fragment } from "react";
import { Button, PopUp } from "@egovernments/digit-ui-components";
import QuickStart from "./QuickStart";
import { useTranslation } from "react-i18next";
import { CustomSVG } from "@egovernments/digit-ui-components";

const InfiniteCanvas = ({ 
  elements = [], 
  onElementClick, 
  onElementDrag, 
  connections, 
  connecting, 
  canvasPoints, 
  onConnectionLabelClick, 
  onClear, 
  onLoadSample,
  labelOffsets: initialLabelOffsets = {},
  onLabelOffsetChange
}) => {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggedElement, setDraggedElement] = useState(null);
  const [elementDragStart, setElementDragStart] = useState({ x: 0, y: 0 });
  
  const [draggedLabel, setDraggedLabel] = useState(null);
  const [labelDragStart, setLabelDragStart] = useState({ x: 0, y: 0 });
  const [labelOffsets, setLabelOffsets] = useState(initialLabelOffsets);
  const [warningModal, setwarningModal] = useState(false);
  
  const canvasRef = useRef(null);
  const viewportRef = useRef(null);

  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 3;
  const ZOOM_STEP = 0.1;

  useEffect(() => {
    if (onLabelOffsetChange) {
      onLabelOffsetChange(labelOffsets);
    }
  }, [labelOffsets, onLabelOffsetChange]);

  // NEW: Function to create path from node to label
  const createNodeToLabelPath = useCallback((fromX, fromY, labelX, labelY) => {
    const cornerRadius = 20;
    const midX = (fromX + labelX) / 2;
    const midY = (fromY + labelY) / 2;

    // Calculate distance
    const dx = labelX - fromX;
    const dy = labelY - fromY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // For very short distances, use straight line
    if (distance < 50) {
      return `M ${fromX} ${fromY} L ${labelX} ${labelY}`;
    }

    if (Math.abs(dy) < 5) {
      // Horizontal line
      return `M ${fromX} ${fromY} L ${labelX} ${labelY}`;
    } else if (labelX > fromX) {
      const yDiff = Math.abs(labelY - fromY);
      const effectiveRadius = Math.min(cornerRadius, yDiff / 2.5);

      if (effectiveRadius < 3) {
        const controlY = (fromY + labelY) / 2 + (labelY > fromY ? -20 : 20);
        return `M ${fromX} ${fromY} Q ${midX} ${controlY} ${labelX} ${labelY}`;
      }

      if (labelY > fromY) {
        return `M ${fromX} ${fromY} 
                L ${midX - effectiveRadius} ${fromY} 
                Q ${midX} ${fromY} ${midX} ${fromY + effectiveRadius} 
                L ${midX} ${labelY - effectiveRadius} 
                Q ${midX} ${labelY} ${midX + effectiveRadius} ${labelY} 
                L ${labelX} ${labelY}`;
      } else {
        return `M ${fromX} ${fromY} 
                L ${midX - effectiveRadius} ${fromY} 
                Q ${midX} ${fromY} ${midX} ${fromY - effectiveRadius} 
                L ${midX} ${labelY + effectiveRadius} 
                Q ${midX} ${labelY} ${midX + effectiveRadius} ${labelY} 
                L ${labelX} ${labelY}`;
      }
    } else {
      const xDiff = Math.abs(labelX - fromX);
      const yDiff = Math.abs(labelY - fromY);
      const effectiveRadiusX = Math.min(cornerRadius, xDiff / 2.5);
      const effectiveRadiusY = Math.min(cornerRadius, yDiff / 2.5);
      const effectiveRadius = Math.min(effectiveRadiusX, effectiveRadiusY);

      if (effectiveRadius < 3) {
        const controlX = (fromX + labelX) / 2 - 30;
        return `M ${fromX} ${fromY} Q ${controlX} ${midY} ${labelX} ${labelY}`;
      }

      if (labelY > fromY) {
        return `M ${fromX} ${fromY} 
                L ${fromX} ${midY - effectiveRadius} 
                Q ${fromX} ${midY} ${fromX - effectiveRadius} ${midY} 
                L ${labelX + effectiveRadius} ${midY} 
                Q ${labelX} ${midY} ${labelX} ${midY + effectiveRadius} 
                L ${labelX} ${labelY}`;
      } else {
        return `M ${fromX} ${fromY} 
                L ${fromX} ${midY + effectiveRadius} 
                Q ${fromX} ${midY} ${fromX - effectiveRadius} ${midY} 
                L ${labelX + effectiveRadius} ${midY} 
                Q ${labelX} ${midY} ${labelX} ${midY - effectiveRadius} 
                L ${labelX} ${labelY}`;
      }
    }
  }, []);

  // Function to create X-Y only connection paths (for self-loops and initial positioning)
  const createXYConnectionPath = useCallback((fromX, fromY, toX, toY) => {
    const cornerRadius = 20;
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;
    if (toY === fromY) {
      if (toX > fromX) {
        return `M ${fromX} ${fromY} L ${toX} ${toY}`;
      } else {
        const detourY = Math.min(fromY, toY) - 90;
        return `M ${fromX} ${fromY} 
                L ${fromX} ${detourY + cornerRadius} 
                Q ${fromX} ${detourY} ${fromX - cornerRadius} ${detourY} 
                L ${toX + cornerRadius} ${detourY} 
                Q ${toX} ${detourY} ${toX} ${detourY + cornerRadius} 
                L ${toX} ${toY}`;
      }
    } else if (toX > fromX) {
      const yDiff = Math.abs(toY - fromY);
      const effectiveRadius = Math.min(cornerRadius, yDiff / 2.5);

      if (effectiveRadius < 3) {
        const controlY = (fromY + toY) / 2 + (toY > fromY ? -20 : 20);
        return `M ${fromX} ${fromY} Q ${midX} ${controlY} ${toX} ${toY}`;
      }

      if (toY > fromY) {
        return `M ${fromX} ${fromY} 
                L ${midX - effectiveRadius} ${fromY} 
                Q ${midX} ${fromY} ${midX} ${fromY + effectiveRadius} 
                L ${midX} ${toY - effectiveRadius} 
                Q ${midX} ${toY} ${midX + effectiveRadius} ${toY} 
                L ${toX} ${toY}`;
      } else {
        return `M ${fromX} ${fromY} 
                L ${midX - effectiveRadius} ${fromY} 
                Q ${midX} ${fromY} ${midX} ${fromY - effectiveRadius} 
                L ${midX} ${toY + effectiveRadius} 
                Q ${midX} ${toY} ${midX + effectiveRadius} ${toY} 
                L ${toX} ${toY}`;
      }
    } else {
      const xDiff = Math.abs(toX - fromX);
      const yDiff = Math.abs(toY - fromY);
      const effectiveRadiusX = Math.min(cornerRadius, xDiff / 2.5);
      const effectiveRadiusY = Math.min(cornerRadius, yDiff / 2.5);
      const effectiveRadius = Math.min(effectiveRadiusX, effectiveRadiusY);

      if (effectiveRadius < 3) {
        const controlX = (fromX + toX) / 2 - 30;
        return `M ${fromX} ${fromY} Q ${controlX} ${midY} ${toX} ${toY}`;
      }

      if (toY > fromY) {
        return `M ${fromX} ${fromY} 
                L ${fromX} ${midY - effectiveRadius} 
                Q ${fromX} ${midY} ${fromX - effectiveRadius} ${midY} 
                L ${toX + effectiveRadius} ${midY} 
                Q ${toX} ${midY} ${toX} ${midY + effectiveRadius} 
                L ${toX} ${toY}`;
      } else {
        return `M ${fromX} ${fromY} 
                L ${fromX} ${midY + effectiveRadius} 
                Q ${fromX} ${midY} ${fromX - effectiveRadius} ${midY} 
                L ${toX + effectiveRadius} ${midY} 
                Q ${toX} ${midY} ${toX} ${midY - effectiveRadius} 
                L ${toX} ${toY}`;
      }
    }
  }, []);

  // Function to calculate label position for X-Y paths
  const calculateXYLabelPosition = useCallback((fromX, fromY, toX, toY, pathType = 'auto') => {
    const labelX = (fromX + toX) / 2;
    const labelY = (fromY + toY) / 2;
    return { x: labelX, y: labelY };
  }, []);

  const handleClick = useCallback((e) => {
    if (!isDragging && !draggedElement && !draggedLabel) {
      const rect = viewportRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - transform.x) / transform.scale;
      const y = (e.clientY - rect.top - transform.y) / transform.scale;
      canvasPoints(x, y);
    }
  }, [isDragging, draggedElement, draggedLabel, transform, canvasPoints]);

  const handleMouseDown = useCallback(
    (e) => {
      if (e.button === 0 && !draggedElement && !draggedLabel) {
        setIsDragging(true);
        setDragStart({
          x: e.clientX - transform.x,
          y: e.clientY - transform.y,
        });
        e.preventDefault();
      }
    },
    [transform, draggedElement, draggedLabel]
  );

  const handleElementMouseDown = useCallback((element, e) => {
    e.stopPropagation();
    if (e.button === 0) {
      setDraggedElement(element);
      const rect = viewportRef.current.getBoundingClientRect();
      setElementDragStart({
        x: (e.clientX - rect.left - transform.x) / transform.scale - element.position.x,
        y: (e.clientY - rect.top - transform.y) / transform.scale - element.position.y,
      });
      e.preventDefault();
    }
  }, [transform]);

  const handleLabelMouseDown = useCallback((connection, labelPos, e) => {
    e.stopPropagation();
    if (e.button === 0) {
      setDraggedLabel(connection);
      const rect = viewportRef.current.getBoundingClientRect();
      
      const currentOffset = labelOffsets[connection.id] || { x: 0, y: 0 };
      
      setLabelDragStart({
        x: (e.clientX - rect.left - transform.x) / transform.scale - labelPos.x - currentOffset.x,
        y: (e.clientY - rect.top - transform.y) / transform.scale - labelPos.y - currentOffset.y,
      });
      e.preventDefault();
    }
  }, [transform, labelOffsets]);

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging && !draggedElement && !draggedLabel) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        setTransform((prev) => ({ ...prev, x: newX, y: newY }));
      } else if (draggedElement) {
        const rect = viewportRef.current.getBoundingClientRect();
        const newX = (e.clientX - rect.left - transform.x) / transform.scale - elementDragStart.x;
        const newY = (e.clientY - rect.top - transform.y) / transform.scale - elementDragStart.y;
        if (onElementDrag) {
          onElementDrag(draggedElement, { x: newX, y: newY });
        }
      } else if (draggedLabel) {
        const rect = viewportRef.current.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left - transform.x) / transform.scale;
        const mouseY = (e.clientY - rect.top - transform.y) / transform.scale;
        
        const fromEl = elements.find((el) => el.id === draggedLabel.from);
        const toEl = elements.find((el) => el.id === draggedLabel.to);
        
        if (fromEl && toEl) {
          const fromX = fromEl.position.x + 225;
          const fromY = fromEl.position.y + 78;
          const toX = toEl.position.x + 10;
          const toY = toEl.position.y + 78;
          
          const naturalPos = calculateXYLabelPosition(fromX, fromY, toX, toY, 'auto');
          
          const offsetX = mouseX - labelDragStart.x - naturalPos.x;
          const offsetY = mouseY - labelDragStart.y - naturalPos.y;
          
          setLabelOffsets(prev => ({
            ...prev,
            [draggedLabel.id]: { x: offsetX, y: offsetY }
          }));
        }
      }
    },
    [isDragging, draggedElement, draggedLabel, dragStart, elementDragStart, labelDragStart, transform, onElementDrag, elements, calculateXYLabelPosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDraggedElement(null);
    setDraggedLabel(null);
  }, []);

  const handleWheel = useCallback(
    (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();

        const rect = viewportRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
        const newScale = Math.min(
          Math.max(transform.scale + delta, MIN_ZOOM),
          MAX_ZOOM
        );

        if (newScale !== transform.scale) {
          const zoomPointX = (mouseX - transform.x) / transform.scale;
          const zoomPointY = (mouseY - transform.y) / transform.scale;

          const newX = mouseX - zoomPointX * newScale;
          const newY = mouseY - zoomPointY * newScale;

          setTransform({ x: newX, y: newY, scale: newScale });
        }
      }
    },
    [transform]
  );

  useEffect(() => {
    if (isDragging || draggedElement || draggedLabel) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, draggedElement, draggedLabel, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport) {
      viewport.addEventListener("wheel", handleWheel, { passive: false });
      return () => viewport.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);

  const zoomToFit = useCallback((e) => {
    if (elements.length === 0) {
      setTransform({ x: 0, y: 0, scale: 1 });
    }
    else {
      const viewport = viewportRef.current.getBoundingClientRect();
      const padding = 50;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

      elements.forEach(element => {
        const { x, y } = element.position;
        const elementWidth = 235;
        const elementHeight = 180;

        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x + elementWidth);
        maxY = Math.max(maxY, y + elementHeight);
      });
      const contentWidth = maxX - minX;
      const contentHeight = maxY - minY;
      const availableWidth = viewport.width - padding * 2;
      const availableHeight = viewport.height - padding * 2;
      const scaleX = availableWidth / contentWidth;
      const scaleY = availableHeight / contentHeight;
      const scale = Math.min(scaleX, scaleY, 1);
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      const x = viewport.width / 2 - centerX * scale;
      const y = viewport.height / 2 - centerY * scale;

      setTransform({ x, y, scale });
    }
  }, [elements]);

  const generateGrid = () => {
    const gridSize = 50 * transform.scale;
    const offsetX = transform.x % gridSize;
    const offsetY = transform.y % gridSize;

    return (
      <defs>
        <pattern
          id="grid"
          width={gridSize}
          height={gridSize}
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
            opacity="0.5"
          />
        </pattern>
      </defs>
    );
  };

  const handleElementClick = useCallback((element, e) => {
    e.stopPropagation();
    if (onElementClick && !draggedElement) {
      onElementClick(element);
    }
  }, [onElementClick, draggedElement]);

  const handleConnectionLabelClick = useCallback((connection, e) => {
    e.stopPropagation();
    if (onConnectionLabelClick && !draggedLabel) {
      onConnectionLabelClick(connection);
    }
  }, [onConnectionLabelClick, draggedLabel]);

  return (
    <div className="canvas-container" style={{height:"100vh"}}>
      <div className="canvas-buttons">
        <Button
          variation="secondary"
          label={
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <CustomSVG.ClearWorkflowIcon width={16} height={16} />
              {t("CLEAR_CANVAS")}
            </div>
          }
          type="button"
          className="secondary-button"
          style={{ margin: "0 8px", borderRadius: "6px" }}
          onClick={() => {
            setwarningModal(true);
          }}
          size={"small"}
        />
        <Button
          variation="secondary"
          label={
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <CustomSVG.ZoomToFitIcon width={16} height={16} />
              {t("ZOOM_TO_FIT")}
            </div>
          }
          type="button"
          className="secondary-button"
          style={{ margin: "0 8px", borderRadius: "6px" }}
          onClick={zoomToFit}
          size={"small"}
        />
        <Button
          variation="secondary"
          label={
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <CustomSVG.LoadSampleIcon width={16} height={16} />
              {t("LOAD_SAMPLE")}
            </div>
          }
          type="button"
          className="secondary-button"
          style={{ margin: "0 8px", borderRadius: "6px" }}
          onClick={onLoadSample}
          size={"small"}
        />
      </div>
      <div className="canvas-child">
        <div
          ref={viewportRef}
          className="viewport"
          onMouseDown={handleMouseDown}
          onClick={handleClick}
          style={{
            cursor: isDragging ? "grabbing" : (draggedElement || draggedLabel) ? "grabbing" : "grab"
          }}
        >
          <svg className="canvas-overlay">
            {generateGrid()}
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          <div
            ref={canvasRef}
            className="canvas"
            style={{
              transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
              transformOrigin: "0 0",
              transition: isDragging || draggedElement || draggedLabel ? "none" : "transform 0.1s ease-out",
              position: "relative",
              overflow: "visible"
            }}
          >
            <svg
              className="canvas-non-overlay"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "10000px",
                height: "10000px",
                zIndex: 1,
                pointerEvents: "none",
                overflow: "visible"
              }}
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
                </marker>
              </defs>

              {connecting && (() => {
                const fromEl = elements.find(el => el.id === connecting.from);
                if (!fromEl) return null;

                const fromX = fromEl.position.x + 225;
                const fromY = fromEl.position.y + 78;
                const pathD = createXYConnectionPath(fromX, fromY, connecting.x2, connecting.y2);

                return (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#6b7280"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                );
              })()}

              {/* UPDATED: Dynamic connection paths that follow labels */}
              {connections?.map((conn, idx) => {
                const fromEl = elements.find((el) => el.id === conn.from);
                const toEl = elements.find((el) => el.id === conn.to);

                if (!fromEl || !toEl) return null;

                const fromX = fromEl.position.x + 225;
                const fromY = fromEl.position.y + 78;
                const toX = toEl.position.x + 10;
                const toY = toEl.position.y + 78;

                // Calculate label position with offset
                let labelPos = calculateXYLabelPosition(fromX, fromY, toX, toY, 'auto');
                
                const isSelfLoop = conn.from === conn.to;
                if (isSelfLoop) {
                  const detourY = Math.min(fromY, toY) - 90;
                  const midX = (fromX + toX) / 2;
                  labelPos = {
                    x: midX,
                    y: detourY
                  };
                }

                const offset = labelOffsets[conn.id] || { x: 0, y: 0 };
                const finalLabelX = labelPos.x + offset.x;
                const finalLabelY = labelPos.y + offset.y;

                // Create two paths: from node to label, and from label to node
                const path1D = createNodeToLabelPath(fromX, fromY, finalLabelX, finalLabelY);
                const path2D = createNodeToLabelPath(finalLabelX, finalLabelY, toX, toY);

                return (
                  <g key={idx}>
                    {/* First segment: from source node to label */}
                    <path
                      d={path1D}
                      fill="none"
                      stroke="#6b7280"
                      strokeWidth="2"
                    />
                    {/* Second segment: from label to target node */}
                    <path
                      d={path2D}
                      fill="none"
                      stroke="#6b7280"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                  </g>
                );
              })}
            </svg>

            <div
              className="interactive-canvas-container"
              style={{
                position: "relative",
                zIndex: 100,
                pointerEvents: "none"
              }}
            >
              {elements.length === 0 ? (
                <div
                  style={{
                    zIndex: 5,
                    pointerEvents: "all"
                  }}
                >
                  <QuickStart />
                </div>
              ) : (
                elements.map((element) => (
                  <div
                    key={element.id}
                    style={{
                      position: "absolute",
                      left: element.position.x,
                      top: element.position.y,
                      zIndex: 110,
                      cursor: draggedElement?.id === element.id ? "grabbing" : "grab",
                      opacity: draggedElement?.id === element.id ? 0.7 : 1,
                      transition: draggedElement?.id === element.id ? "none" : "opacity 0.2s ease",
                      pointerEvents: "all"
                    }}
                    onMouseDown={(e) => handleElementMouseDown(element, e)}
                    onClick={(e) => handleElementClick(element, e)}
                  >
                    {element.component}
                  </div>
                ))
              )}
            </div>

            <svg
              className="canvas-labels-overlay"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "10000px",
                height: "10000px",
                zIndex: 120,
                pointerEvents: "none",
                overflow: "visible"
              }}
            >
              {connections?.map((conn, idx) => {
                const paddingX = 8;
                const paddingY = 4;
                const displayLabel = conn.label && conn.label.trim() !== "" ? conn.label : "Action";
                const textWidth = displayLabel.length * 12;
                const textHeight = 24;
                const fromEl = elements.find((el) => el.id === conn.from);
                const toEl = elements.find((el) => el.id === conn.to);

                if (!fromEl || !toEl) return null;

                const fromX = fromEl.position.x + 225;
                const fromY = fromEl.position.y + 78;
                const toX = toEl.position.x + 10;
                const toY = toEl.position.y + 78;

                let labelPos = calculateXYLabelPosition(fromX, fromY, toX, toY, 'auto');

                const isSelfLoop = conn.from === conn.to;
                if (isSelfLoop) {
                  const detourY = Math.min(fromY, toY) - 90;
                  const midX = (fromX + toX) / 2;
                  labelPos = {
                    x: midX,
                    y: detourY
                  };
                }

                const offset = labelOffsets[conn.id] || { x: 0, y: 0 };
                const finalX = labelPos.x + offset.x;
                const finalY = labelPos.y + offset.y;

                return (
                  <g key={idx}>
                    <rect
                      x={finalX - (textWidth / 2) - paddingX}
                      y={finalY - (textHeight / 2) - paddingY}
                      width={textWidth + paddingX * 2}
                      height={textHeight + paddingY * 2}
                      fill="white"
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      rx="4"
                      style={{ 
                        cursor: draggedLabel?.id === conn.id ? 'grabbing' : 'grab',
                        pointerEvents: 'all',
                        filter: 'drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.1))',
                        opacity: draggedLabel?.id === conn.id ? 0.7 : 1,
                        transition: draggedLabel?.id === conn.id ? 'none' : 'opacity 0.2s ease'
                      }}
                      onMouseDown={(e) => handleLabelMouseDown(conn, labelPos, e)}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!draggedLabel) {
                          handleConnectionLabelClick(conn, e);
                        }
                      }}
                    />
                    <text
                      x={finalX}
                      y={finalY + 4}
                      textAnchor="middle"
                      fontSize="20"
                      fill="#374151"
                      fontWeight="500"
                      style={{
                        pointerEvents: 'none',
                        userSelect: 'none'
                      }}
                    >
                      {displayLabel}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
      {warningModal && (
  <PopUp
    type="info"
    heading={t("CLEAR_CANVAS_HEADING")}
    description={t("CLEAR_CANVAS_DESCRIPTION")}
    childrenStyle={{ flexDirection: "row", justifyContent: "flex-end", gap: "1rem" }}
    onOverlayClick={() => setwarningModal(false)}
    onClose={() => setwarningModal(false)}
    style={{ zIndex: 9999 }}
  >
    <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
      <Button
        label={t("CORE_COMMON_CANCEL")}
        variation="secondary"
        type="button"
        onClick={() => setwarningModal(false)}
      />

      <Button
        label={t("YES_CLEAR")}
        variation="primary"
        type="button"
        onClick={() => {
          setwarningModal(false);
          onClear(); // Your original clear function
        }}
      />
    </div>
  </PopUp>
)}


    </div>
  );
};

export default InfiniteCanvas;