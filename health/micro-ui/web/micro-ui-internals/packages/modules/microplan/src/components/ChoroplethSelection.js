// Importing necessary modules
import { Button, RadioButtons } from "@egovernments/digit-ui-components";
import "leaflet/dist/leaflet.css";
import React, { memo, useCallback } from "react";
import * as DigitSvgs from "@egovernments/digit-ui-svg-components";

const ChoroplethSelection = memo(
  ({
    choroplethProperties,
    showChoroplethOptions,
    showChoroplethOptionRef,
    setShowChoroplethOptions,
    choroplethProperty,
    setChoroplethProperty,
    t,
  }) => {
    const handleChange = useCallback(
      (value) => {
        setChoroplethProperty(value?.code);
      },
      [choroplethProperties]
    );

    return (
      <div className="choropleth-section" ref={showChoroplethOptionRef}>
        <div
          className="icon-rest virtualization-icon"
          onClick={() => setShowChoroplethOptions((previous) => !previous)}
          onKeyUp={() => setShowChoroplethOptions((previous) => !previous)}
          tabIndex={0}
          style={{display:"flex"}}
        >
          <p>{t("VISUALIZATIONS")}</p>
          <div className="icon">
            {DigitSvgs.FilterAlt && <DigitSvgs.FilterAlt width={"1.667rem"} height={"1.667rem"} fill={"rgba(255, 255, 255, 1)"} />}
          </div>
        </div>
        {showChoroplethOptions && (
          <div className="choropleth-section-option-wrapper">
            <div className="custom-box-wrapper">
              <RadioButtons
                additionalWrapperClass="custom-box"
                innerStyles={{ borderBottom: "0.063rem solid rgba(214, 213, 212, 1)" }}
                options={choroplethProperties.map((item) => ({ name: item, id: item, code: item }))}
                optionsKey="name"
                onSelect={handleChange}
                selectedOption={choroplethProperty}
              />
            </div>
            <Button
              variation="secondary"
              textStyles={{ width: "fit-content", fontSize: "0.875rem", fontWeight: "600", display: "flex", alignItems: "center" }}
              className="button-primary"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                border: 0,
                padding: "0 0.7rem 0 0.7rem",
                height: "2.5rem",
                maxHeight: "2.5rem",
                backgroundColor: "rgba(250, 250, 250, 1)",
              }}
              icon={"AutoRenew"}
              label={t("CLEAR_FILTER")}
              title={t("CLEAR_FILTER")}
              onClick={() => setChoroplethProperty()}
            />
          </div>
        )}
      </div>
    );
  }
);

export default ChoroplethSelection;
