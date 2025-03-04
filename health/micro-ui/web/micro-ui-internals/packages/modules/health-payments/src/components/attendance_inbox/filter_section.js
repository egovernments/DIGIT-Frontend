import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import BoundaryComponent from "../BoundaryComponent";
import { Card, SVG, SubmitBar } from "@egovernments/digit-ui-components";
import { lowerBoundaryDefaultSet } from "../../utils/constants";

const CustomFilter = ({ resetTable, isRequired, onFilterChange }) => {

  const { t } = useTranslation();
  const lowestLevelBoundaryType = Digit.SessionStorage.get("paymentsConfig")?.lowestLevelBoundary || "DISTRICT";

  // State variables
  const [reset, setReset] = useState(false);
  const [boundary, setBoundary] = useState(Digit.SessionStorage.get("selectedBoundary") || '');
  const [project, setProject] = useState([]);
  const [isDistrictSelected, setIsDistrictSelected] = useState(false);
  const [projectSelected, setProjectSelected] = useState(() => Digit.SessionStorage.get("selectedProject") || {});

  const onChangeId = (value) => {
    setBoundary(value);
    Digit.SessionStorage.set("selectedBoundary", value);
    if (value?.boundaryType === lowestLevelBoundaryType) {
      setIsDistrictSelected(true); // Set flag if district is selected
    }
  };

  const handleApplyFilter = () => {
    onFilterChange(boundary, isDistrictSelected);
  };

  useEffect(() => {
    const data = Digit.SessionStorage.get("paymentInbox");
    if (data?.selectedProject) {
      setProjectSelected(data?.selectedProject);
    }
  }, []);

  useEffect(() => {
    if (project.length == 0) {
      const projectData =
        Digit?.SessionStorage.get("staffProjects") ||
        [].map((target) => ({
          code: target.id,
          projectType: target.projectType,
          name: target.name,
          boundary: target?.address?.boundary,
          boundaryType: target?.address?.boundaryType,
          projectHierarchy: target.projectHierarchy,
        }));
      setProject(projectData);
    }
  }, []);

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
        <div
          style={{
            alignItems: "center",
            gap: ".75rem",
            marginBottom: "24px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <SVG.FilterAlt width={"32px"} height={"32px"} fill={"#c84c0e"} />
            <span className="custom-inbox-filter-heading">{t("HCM_AM_FILTER")}</span>
          </div>

          <span
            onClick={() => {
              setReset(true);
            }}
            style={{ border: "1px solid #e0e0e0", padding: "6px", marginBottom: "10px", cursor: "pointer" }}
          >
            <SVG.AutoRenew width={"24px"} height={"24px"} fill={"#c84c0e"} />
          </span>
        </div>

        <div className="label-pair">
          {t(`HCM_AM_CHOOSE_BOUNDARY_DESCRIPTION`)}
        </div>

        {projectSelected?.address?.boundary && (
          <BoundaryComponent
            reset={reset}
            makeReset={() => {
              setReset(false);
            }}
            isRequired={isRequired}
            initialValue={Digit.SessionStorage.get("selectedValues")}
            updateSessionStorage={(newSelectedValues) => {
              Digit.SessionStorage.set("selectedValues", newSelectedValues);
            }}
            onChange={onChangeId}
            selectedProject={projectSelected}
            lowestLevel={Digit.SessionStorage.get("paymentsConfig")?.lowestLevelBoundary || lowerBoundaryDefaultSet}
          ></BoundaryComponent>
        )}
      </div>

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
