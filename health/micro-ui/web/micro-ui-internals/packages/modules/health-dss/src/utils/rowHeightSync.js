import React, { createContext, useContext, useRef, useState, useCallback, useEffect, useMemo } from "react";

const RowHeightSyncContext = createContext(null);

// Equalizes the height of same-index slots (header, legend, item rows, etc.) across
// sibling cards in a row, so wrapped labels/titles/legends don't push a single
// card's content out of alignment with its neighbours.
export const RowHeightSyncProvider = ({ children }) => {
  const nodesRef = useRef({});
  const [heights, setHeights] = useState({});

  const recompute = useCallback(() => {
    const next = {};
    Object.keys(nodesRef.current).forEach((slotKey) => {
      const nodes = Object.values(nodesRef.current[slotKey] || {});
      const max = nodes.reduce((m, node) => (node ? Math.max(m, node.getBoundingClientRect().height) : m), 0);
      if (max > 0) next[slotKey] = max;
    });
    setHeights((prev) => {
      const changed =
        Object.keys(next).some((k) => Math.abs((prev[k] || 0) - next[k]) > 0.5) || Object.keys(prev).length !== Object.keys(next).length;
      return changed ? next : prev;
    });
  }, []);

  const registerNode = useCallback(
    (slotKey, cardId, node) => {
      if (!nodesRef.current[slotKey]) nodesRef.current[slotKey] = {};
      nodesRef.current[slotKey][cardId] = node;
      recompute();
    },
    [recompute]
  );

  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => recompute());
    Object.values(nodesRef.current).forEach((cards) => {
      Object.values(cards).forEach((node) => node && observer.observe(node));
    });
    window.addEventListener("resize", recompute);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", recompute);
    };
  }, [heights, recompute]);

  const value = useMemo(() => ({ registerNode, heights }), [registerNode, heights]);

  return <RowHeightSyncContext.Provider value={value}>{children}</RowHeightSyncContext.Provider>;
};

// Registers `node` under `slotKey` (e.g. "header", "item-0") for this card instance,
// and returns the synced min-height (tallest sibling in that slot) to apply.
export const useSyncedSlotHeight = (slotKey, cardId) => {
  const sync = useContext(RowHeightSyncContext);
  const ref = useCallback(
    (node) => {
      if (sync && node) sync.registerNode(slotKey, cardId, node);
    },
    [sync, slotKey, cardId]
  );
  const syncedHeight = sync?.heights?.[slotKey];
  return [ref, syncedHeight];
};
