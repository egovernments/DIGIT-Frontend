// Importing necessary modules
import { Button, CheckBox } from "@egovernments/digit-ui-components";
import "leaflet/dist/leaflet.css";
import React, { memo, useCallback } from "react";
import * as DigitSvgs from "@egovernments/digit-ui-svg-components";

const FilterSection = memo(
  ({ filterProperties, showFilterOptionRef, showFilterOptions, setShowFilterOptions, filterSelections, setFilterSelections, t }) => {
    const handleChange = useCallback(
      (e, item) => {
        let tempFilterSelections = [...filterSelections]; // Clone the array to avoid mutating state directly
        if (filterSelections.includes(item)) {
          tempFilterSelections = tempFilterSelections.filter((element) => element !== item);
        } else {
          tempFilterSelections.push(item);
        }
        setFilterSelections(tempFilterSelections);
      },
      [filterSelections]
    );

    return (
      <div className="filter-section" ref={showFilterOptionRef}>
        <div
          className="icon-rest filter-icon"
          onClick={() => setShowFilterOptions((previous) => !previous)}
          onKeyUp={() => setShowFilterOptions((previous) => !previous)}
          tabIndex={0}
          style={{display:"flex"}}
        >
          <p>{t("FILTERS")}</p>
          <div className="filter-icon">
            {DigitSvgs.FilterAlt && <DigitSvgs.FilterAlt width={"1.667rem"} height={"1.667rem"} fill={"rgba(255, 255, 255, 1)"} />}
          </div>
        </div>
        {showFilterOptions && (
          <div className="filter-section-option-wrapper">
            <div className="custom-box-wrapper">
              {filterProperties?.map((item) => (
                <div id={item} key={item} className="custom-box">
                  <CheckBox
                    onChange={(e) => handleChange(e, item)}
                    label={t(item)}
                    checked={!!filterSelections.includes(item)}
                    mainClassName="mainClassName"
                    labelClassName="labelClassName"
                    inputWrapperClassName="inputWrapperClassName"
                    inputClassName="inputClassName"
                    inputIconClassname="inputIconClassname"
                    iconFill={"#C84C0E"}
                    onLabelClick={(e) => handleChange(e, item)}
                  />
                </div>
              ))}
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
              label={t("CLEAR_ALL_FILTERS")}
              title={t("CLEAR_ALL_FILTERS")}
              onClick={() => setFilterSelections([])}
            />
          </div>
        )}
      </div>
    );
  }
);
export default FilterSection;
