import {  Loader,Dropdown } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const BoundaryComponent = ({ t, config, onSelect, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data: childrenData, isLoading: isBoundaryLoading } = Digit.Hooks.pgr.useFetchBoundaries(tenantId);

  const boundaryHierarchy = Digit.SessionStorage.get("boundaryHierarchyOrder")?.map((item) => item.code) || [];
  const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "HIERARCHYTEST";

  // State to manage selected values and dropdown options
  const [selectedValues, setSelectedValues] = useState({});
  const [value, setValue] = useState({});

  // Effect to initialize dropdowns when data loads
  useEffect(() => {
    if (childrenData && childrenData.length > 0) {
      const firstBoundaryType = childrenData[0]?.boundary[0].boundaryType;
      setValue({ [firstBoundaryType]: [childrenData[0]?.boundary[0]] });
    }
  }, [childrenData]);

  /**
   * Handle dropdown selection.
   * - Stores the selected boundary.
   * - Clears all children dropdowns.
   * - Loads children of the selected boundary.
   */
  const handleSelection = (selectedBoundary) => {
    if (!selectedBoundary) return;

    const boundaryType = selectedBoundary.boundaryType;

    // Reset all child selections
    const index = boundaryHierarchy.indexOf(boundaryType);
    const newSelectedValues = { ...selectedValues };
    const newValue = { ...value };

    for (let i = index + 1; i < boundaryHierarchy.length; i++) {
      delete newSelectedValues[boundaryHierarchy[i]]; // Clear selected children
      delete newValue[boundaryHierarchy[i]]; // Clear child dropdowns
    }

    // Update selected values
    newSelectedValues[boundaryType] = selectedBoundary;
    setSelectedValues(newSelectedValues);
    setValue(newValue);
    // always sending the last selected boundary code

    onSelect(config.key, selectedBoundary);

    // Load child boundaries
    if (selectedBoundary.children && selectedBoundary.children.length > 0) {
      newValue[selectedBoundary.children[0].boundaryType] = selectedBoundary.children;
      setValue(newValue);
    }
  };

  /**
   * Check if a boundary type is allowed to be selected.
   */

  if (isBoundaryLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>

        {boundaryHierarchy.map((key) => {
          if (value[key]?.length > 0) {
            return (
              <BoundaryDropdown
                key={key}
                label={`${t(`${hierarchyType}_${key}`)}`}
                data={value[key]}
                onChange={(selectedValue) => handleSelection(selectedValue)}
                selected={formData?.locality || formData?.SelectedBoundary ? selectedValues[key] : null}
              />
            );
          }
          return null;
        })}
    </React.Fragment>
  );
};

/**
 * BoundaryDropdown Component
 */
const BoundaryDropdown = ({ label, data, onChange, selected }) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <div className="comment-label">{t(label)}</div>
      <div className='digit-text-input-field'>
      <Dropdown style={{width: "100%", maxWidth : "37.5rem"}} selected={selected} t={t} option={data} optionKey={"code"} select={(value) => onChange(value)} />
    </div>
    </React.Fragment>
  );
};

export default BoundaryComponent;