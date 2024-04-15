import React, { memo, useCallback,  } from "react";
import { useTranslation } from "react-i18next";

const ZoomControl = memo(({ map }) => {
  if (!map) return <div></div>;

  const zoomIn = useCallback(() => {
    map.zoomIn();
  }, [map]);

  const zoomOut = useCallback(() => {
    map.zoomOut();
  }, [map]);

  return (
    <div className="zoom-control">
      <button className="zoom-button" onClick={zoomIn}>
        +
      </button>
      <button className="zoom-button" onClick={zoomOut}>
        -
      </button>
    </div>
  );
});

export default ZoomControl;
