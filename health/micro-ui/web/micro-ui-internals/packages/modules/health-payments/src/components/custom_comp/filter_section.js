import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CheckBox, Divider, SubmitBar } from "@egovernments/digit-ui-components";
import BoundaryComponent from "../sample";
import { Card, SVG, Button, ButtonGroup, TextBlock, Dropdown, Toast } from "@egovernments/digit-ui-components";
import { lowerBoundaryDefaultSet } from "../../utils/constants";

// CustomFilter component handles filtering logic for a specific UI context
const CustomFilter = ({ resetTable, isRequired, onFilterChange }) => {
  const { t } = useTranslation();

  // State variables to manage filter state and project data
  const [reset, setReset] = useState(false); // Tracks reset state

  const [boundary, setBoundary] = useState(""); // Selected boundary

  const [project, setProject] = useState([]); // List of projects

  const [isDistrictSelected, setIsDistrictSelected] = useState(false); // Tracks if a district is selected

  // Preselected project from session storage
  const [projectSelected, setProjectSelected] = useState(() => Digit.SessionStorage.get("selectedProject") || {});

  // Updates boundary state and sets district selection flag if applicable
  const onChangeId = (value) => {
    setBoundary(value);
    if (value?.boundaryType === "DISTRICT") {
      setIsDistrictSelected(true); // Set flag if district is selected
    }
  };

  // Handles applying the filter and invoking the parent callback
  const handleApplyFilter = () => {
    onFilterChange(boundary, isDistrictSelected);
  };

  // Fetches selected project from session storage on component mount
  useEffect(() => {
    const data = Digit.SessionStorage.get("paymentInbox");
    if (data?.selectedProject) {
      setProjectSelected(data?.selectedProject);
    }
  }, []);

  // Populates the project list if it is empty, using data from session storage
  useEffect(() => {
    if (project.length == 0) {
      let datak =
        Digit?.SessionStorage.get("staffProjects") ||
        [].map((target) => ({
          code: target.id,
          projectType: target.projectType,
          name: target.name,
          boundary: target?.address?.boundary,
          boundaryType: target?.address?.boundaryType,
          projectHierarchy: target.projectHierarchy,
        }));
      setProject(datak);
    }
  }, []);

  // Resets the filter table if the reset flag is set
  useEffect(() => {
    if (reset == true) {
      //setProjectSelected(null);
      resetTable();
    }
  }, [reset]);

  return (
    <Card
      className="inbox-search-links-container"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          flexGrow: 1, // Ensures this section grows to take available space
          overflowY: "auto", // Enables scrolling if content exceeds available space
        }}
      >
        <div className="bill-boundary-filter">
          <div style={{ display: "flex", alignItems: "center" }}>
            <SVG.FilterAlt width={"32px"} height={"32px"} fill={"#c84c0e"} />
            <span className="custom-inbox-filter-heading">{t("HCM_AM_FILTER")}</span>
          </div>

          {/* Reset button */}
          <span
            onClick={() => {
              setReset(true);
            }}
            className="on-icon-reset-proximity"
          >
            <svg width="17" height="17" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 5V8L12 4L8 0V3C3.58 3 0 6.58 0 11C0 12.57 0.46 14.03 1.24 15.26L2.7 13.8C2.25 12.97 2 12.01 2 11C2 7.69 4.69 5 8 5ZM14.76 6.74L13.3 8.2C13.74 9.04 14 9.99 14 11C14 14.31 11.31 17 8 17V14L4 18L8 22V19C12.42 19 16 15.42 16 11C16 9.43 15.54 7.97 14.76 6.74Z"
                fill="#505A5F"
              />
            </svg>
          </span>
        </div>

        <div className="label-pair">{t(`HCM_AM_CHOOSE_BOUNDARY_DESCRIPTION`)}</div>
        {/* Boundary selection component */}
        {projectSelected?.address?.boundary && (
          <BoundaryComponent
            reset={reset}
            makeReset={() => {
              setReset(false);
            }}
            isRequired={isRequired}
            initialValue={Digit.SessionStorage.get("selectedValues")}
            updateSeeeionStorage={(newSelectedValues) => {
              Digit.SessionStorage.set("selectedValues", newSelectedValues);
            }}
            onChange={onChangeId}
            selectedProject={projectSelected}
            lowestLevel={Digit.SessionStorage.get("paymentConfig")?.lowestLevelBoundary || lowerBoundaryDefaultSet}
          ></BoundaryComponent>
        )}
      </div>
      {/* Apply filter button */}
      <div
        style={{
          justifyContent: "center",
          marginTop: "auto", // Pushes this section to the bottom
          paddingTop: "16px", // Adds spacing above the button
        }}
      >
        <SubmitBar onSubmit={handleApplyFilter} className="w-fullwidth" label={t("HCM_AM_COMMON_APPLY")} />
      </div>
    </Card>
  );
};

export default CustomFilter;
