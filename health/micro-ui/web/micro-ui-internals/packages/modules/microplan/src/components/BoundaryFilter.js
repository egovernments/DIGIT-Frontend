import React, { memo, useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, Button, MultiSelectDropdown, TooltipWrapper, Tooltip } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { InfoIconOutline, CardLabel } from "@egovernments/digit-ui-react-components";
// import { fetchDropdownValues } from "../utils/processHierarchyData";
import { useMyContext } from "../utils/context";

export function checkTruthyKeys(obj) {
  for (let key in obj) {
    if (Object.hasOwn(obj, key)) {
      if (obj[key] && !(Array.isArray(obj[key]) && obj[key].length === 0)) {
        return true;
      }
    }
  }
  return false;
}

export function generateHierarchyOptions(boundaryHierarchy, boundaryArray, hierarchyConfig) {
  const { highestHierarchy } = hierarchyConfig;

  // Initialize the options object
  const options = {};

  // Create a map for easy lookup of boundaries by code
  const boundaryMap = new Map();
  boundaryArray.forEach((boundary) => {
    boundaryMap.set(boundary.code, boundary);
  });

  // Helper function to create formatted options
  const createOptions = (parentCode, childType) => {
    return boundaryArray
      .filter((boundary) => boundary.type === childType && boundary.parent === parentCode)
      .map((boundary) => ({
        code: `${parentCode}.${boundary.code}`,
        name: boundary.name,
      }));
  };

  // Process the highest level (Country)
  options[highestHierarchy] = boundaryArray
    .filter((boundary) => boundary.type === highestHierarchy)
    .map((boundary) => ({
      code: boundary.code,
      name: boundary.name,
    }));

  // Process each hierarchy level from Province to Village
  boundaryHierarchy.slice(1).forEach(({ boundaryType, parentBoundaryType }) => {
    options[boundaryType] = boundaryArray
      .filter((boundary) => boundary.type === parentBoundaryType)
      .map((parentBoundary) => ({
        name: parentBoundary.name,
        code: parentBoundary.code,
        options: createOptions(parentBoundary.code, boundaryType),
      }));
  });

  return options;
}

const BoundaryFilter = ({
  t,
  boundary,
  setBoundary,
  hierarchy,
  isboundarySelectionSelected,
  setIsboundarySelectionSelected,
  boundarySelections,
  setBoundarySelections,
}) => {
  const [processedHierarchy, setProcessedHierarchy] = useState([]);
  const itemRefs = useRef([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const scrollContainerRef = useRef(null);
  const [changedBoundaryType, setChangedBoundaryType] = useState("");
  const [isScrollable, setIsScrollable] = useState(false);
  const { state, dispatch } = useMyContext();

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  // Filtering out dropdown values
  useEffect(() => {
    if (!boundary || !hierarchy) return;

    // First, generate the hierarchy options
    const hierarchyOptions = generateHierarchyOptions(state?.boundaryHierarchy, boundary, state?.hierarchyConfig[0]);

    // Now, reorder processedHierarchy based on the generated options
    const processedHierarchyTemp = reorderProcessedHierarchy(hierarchyOptions);
    setProcessedHierarchy(processedHierarchyTemp);
    // setIsLoading(false);
  }, [boundary, hierarchy]);

  // Function to reorder processedHierarchy
  const reorderProcessedHierarchy = (hierarchyOptions) => {
    // Reorder based on hierarchyOptions, not on the state value directly
    return state?.boundaryHierarchy.map((level) => ({
      boundaryType: level.boundaryType,
      options: hierarchyOptions[level.boundaryType] || [],
    }));
  };

  // Function to update boundarySelections
  const handleSelect = (selectedOptions, boundaryType) => {
    // Extract only the second element (item[1]) from each array in selectedOptions
    const transformedOptions = selectedOptions.map((option) => option[1]);
  
    // Now use the transformed options in your logic
    setBoundarySelections((prevSelections) => {
      const selectionsArray = Array.isArray(prevSelections) ? prevSelections : [];
  
      // Find the index of the existing selection for this boundaryType
      const index = selectionsArray.findIndex((item) => item.boundaryType === boundaryType);
  
      // Create a new selection object
      const newSelection = {
        boundaryType,
        options: transformedOptions, // Use the extracted options
      };
  
      // If the boundaryType already exists, update it; otherwise, add a new entry
      if (index !== -1) {
        const updatedSelections = [...selectionsArray];
        updatedSelections[index] = newSelection;
        return updatedSelections;
      } else {
        return [...selectionsArray, newSelection];
      }
    });
  };
  

  const renderDropdowns = () => {
    return processedHierarchy.map(({ boundaryType, options }) => (
      <div key={boundaryType} className="hierarchy-selection-element">
        <CardLabel style={{ padding: 0, margin: 0 }}>{t(boundaryType)}</CardLabel>
        <MultiSelectDropdown
          defaultLabel={t("SELECT_HIERARCHY", { heirarchy: t(boundaryType) })}
          style={{ maxWidth: "23.75rem", margin: 0 }}
          ServerStyle={options.length > 5 ? { height: "13.75rem" } : {}}
          type="multiselectdropdown"
          t={t}
          options={options}
          optionsKey="name"
          addSelectAllCheck={boundaryType === state?.hierarchyConfig[0]?.highestHierarchy ? undefined : true}
          variant={boundaryType === state?.hierarchyConfig[0]?.highestHierarchy ? undefined : "nestedmultiselect"}
          onSelect={(e) => handleSelect(e, boundaryType)}
        />
      </div>
    ));
  };

  return (
    <div className={`map-filter-by-boundary`}>
      <Button
        icon="FilterAlt"
        variation="secondary"
        className="button-primary"
        title={t("BUTTON_FILTER_BY_BOUNDARY")}
        label={t("BUTTON_FILTER_BY_BOUNDARY")}
        onClick={() => setIsboundarySelectionSelected((previous) => !previous)}
      />
      <Card
        className={`map-filter-boundary-selection ${!isboundarySelectionSelected ? "display-none" : ""}
        `}
      >
        <div className="map-header-section">
          <div className="map-header-section-header">{t("SELECT_A_BOUNDARY")}</div>
          <TooltipWrapper content={t("SELECT_A_BOUNDARY_TOOLTIP")} placement={"top-end"}>
            <InfoIconOutline width="1.75rem" height="1.75rem" fill="#363636" />
          </TooltipWrapper>
        </div>
        <div
          className={`hierarchy-selection-container ${isScrollable ? "scrollable" : ""}`}
          // style={checkTruthyKeys(boundarySelections) ? { maxHeight: "20rem" } : {}}
          ref={scrollContainerRef}
        >
          {renderDropdowns()}
        </div>
        {
          <Button
            variation="secondary"
            icon={"AutoRenew"}
            title={t("CLEAR_ALL_FILTERS")}
            label={t("CLEAR_ALL_FILTERS")}
            // onClick={handleClearAll}
          />
        }
      </Card>
    </div>
  );
};

export default BoundaryFilter;
