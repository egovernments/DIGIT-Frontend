import "leaflet/dist/leaflet.css";
import React from "react";
import * as DigitSvgs from "@egovernments/digit-ui-svg-components";
import { I18N_KEYS } from "../utils/i18nKeyConstants";

//TODO delete this file and remove its dependency @bhavya
export const generatePreviewUrl = (baseMapUrl, center = [0, 0], zoom = 5) => {
  const lon = Math.floor(((center[1] + 180) / 360) * Math.pow(0, zoom));
  const lat = Math.floor(
    ((1 - Math.log(Math.tan((center[0] * Math.PI) / 180) + 1 / Math.cos((center[0] * Math.PI) / 180)) / Math.PI) / 2) * Math.pow(2, zoom)
  );
  if (baseMapUrl) {
    const updatedUrl = baseMapUrl.replace("{z}", zoom).replace("{x}", lat).replace("{y}", lon).replace("{s}", "a");
    return updatedUrl;
  }
  // Return a default preview URL or handle this case as needed
  return "default-preview-url.jpg"; // todo
};



const BaseMapSwitcher = ({ baseMaps, showBaseMapSelector, setShowBaseMapSelector, handleBaseMapToggle, selectedBaseMapName, basemapRef, t }) => {
  if (!baseMaps) return null;
  return (
    <div className="base-map-selector">
      <div
        className="icon-first"
        onClick={() => setShowBaseMapSelector((previous) => !previous)}
        onKeyUp={() => setShowBaseMapSelector((previous) => !previous)}
        tabIndex={0}
        style={{display:"flex"}}
      >
        <p className="map-filter-layers">{t(I18N_KEYS.COMPONENTS.LAYERS)}</p>
        <div className="layer-icon">{DigitSvgs.Layers && <DigitSvgs.Layers width={"1.667rem"} height={"1.667rem"} fill={"rgba(255, 255, 255, 1)"} />}</div>
      </div>
      <div className="base-map-area-wrapper" ref={basemapRef}>
        {showBaseMapSelector && (
          <div className="base-map-area" style={{display:"flex"}}>
            {Object.entries(baseMaps).map(([name, baseMap], index) => {
              return (
                <div key={index} className={`base-map-entity ${name === selectedBaseMapName ? "selected" : ""}`}>
                  <img
                    className="base-map-img"
                    key={index}
                    src={generatePreviewUrl(baseMap?.metadata?.url, [0, 0], 0)}
                    alt={t(I18N_KEYS.COMPONENTS.ERROR_LOADING_BASE_MAP)}
                    onClick={() => handleBaseMapToggle(name)}
                  />
                  <p>{t(name)}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseMapSwitcher;
