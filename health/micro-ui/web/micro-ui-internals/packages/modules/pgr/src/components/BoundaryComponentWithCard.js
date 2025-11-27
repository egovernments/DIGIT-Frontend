import {  Loader,Dropdown,Card } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const BoundaryComponentWithCard = ({ t, config, onSelect, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const hierarchy = Digit.SessionStorage.get("HIERARCHY_TYPE_SELECTED");
  const { data: childrenData, isLoading: isBoundaryLoading } = Digit.Hooks.pgr.useFetchBoundaries({
    tenantId, hierarchyType: hierarchy?.hierarchyType, config: { enabled: !!hierarchy?.hierarchyType } });

  const boundaryHierarchy = hierarchy?.boundaryHierarchy?.map((item) => item.boundaryType) || [];


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

  // Effect to reset to country level when formData.locality is cleared (Clear All is pressed)
  useEffect(() => {
    if (!formData?.locality && childrenData && childrenData.length > 0) {
      // Reset to initial state - only show country level
      const firstBoundaryType = childrenData[0]?.boundary[0].boundaryType;
      setValue({ [firstBoundaryType]: [childrenData[0]?.boundary[0]] });
      setSelectedValues({});
    }
  }, [formData?.locality, childrenData]);

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

    // Build hierarchical boundary code path (Country_code.Next_child_code.Next_next_child_code)
    const boundaryCodePath = boundaryHierarchy
      .slice(0, index + 1)
      .map(type => newSelectedValues[type]?.code)
      .filter(code => code)
      .join('.');

    // Create modified boundary object with full path and original code
    const boundaryWithPath = {
      ...selectedBoundary,
      code: boundaryCodePath,
      localityCode: selectedBoundary.code // Store original code for extraction
    };

    onSelect(config.key, boundaryWithPath);

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
    return <Loader variant={"PageLoader"} className={"digit-center-loader"} />
  }

  // Get the first boundary key that has data
  const firstBoundaryKey = boundaryHierarchy.find((key) => value[key]?.length > 0);

  return (
    <React.Fragment>
      <div className="boundary-dropdown-container">
        {boundaryHierarchy.map((key) => {
          if (value[key]?.length > 0) {
            return (
              <BoundaryDropdown
                key={key}
                label={`${t(`${hierarchy?.hierarchyType}_${key}`)}`}
                data={value[key]}
                onChange={(selectedValue) => handleSelection(selectedValue)}
                selected={formData?.locality || formData?.SelectedBoundary ? selectedValues[key] : null}
                isMandatory={config?.isMandatory && key === firstBoundaryKey}
              />
            );
          }
          return null;
        })}
      </div>
    </React.Fragment>
  );
};

/**
 * BoundaryDropdown Component
 */
const BoundaryDropdown = ({ label, data, onChange, selected, isMandatory }) => {
  const { t } = useTranslation();

  return (
    <div className="boundary-dropdown-wrapper">
      <div className="comment-label-without-card">
        {label}
        {isMandatory && <span style={{ color: "#d4351c" }}> *</span>}
      </div>
      <div className='digit-text-input-field-without-card'>
        <Dropdown style={{}} selected={selected} t={t} option={data} optionKey={"code"} select={(value) => onChange(value)} />
      </div>
    </div>
  );
};

export default BoundaryComponentWithCard;