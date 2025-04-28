import { LabelFieldPair, CardLabel, Loader } from "@egovernments/digit-ui-components";
import { Dropdown } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const BoundaryComponent = ({ t, config, onSelect, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data: childrenData, isBoundaryLoading } = Digit.Hooks.hrms.useBoundriesFetch(tenantId);

  const boundaryHierarchy = Digit.SessionStorage.get("boundaryHierarchyOrder")?.map((item) => item.code) || [];

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
    const lastSelectedCode = selectedBoundary.code;

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
  const isBoundaryAllowed = (boundaryType) => {
    if (!lowestLevelBoundaryType) return true;
    return boundaryHierarchy.indexOf(boundaryType) <= boundaryHierarchy.indexOf(lowestLevelBoundaryType);
  };

  if (isBoundaryLoading) {
    return <Loader />;
  }

  return (
    <LabelFieldPair>
      <CardLabel style={{ width: "50.1%" }} className="digit-card-label-smaller">
        {t("HRM_BOUNDARY_LABEL")} *{/*input.isMandatory ? " * " : null*/}
      </CardLabel>

      <div style={{ width: "100%" }}>
        {boundaryHierarchy.map((key) => {
          if (value[key]?.length > 0) {
            return (
              <BoundaryDropdown
                key={key}
                label={
                  `${t(key)}`
                  // `ATTENDANCE_${key}`
                }
                data={value[key]}
                onChange={(selectedValue) => handleSelection(selectedValue)}
                selected={selectedValues[key] || null}
              />
            );
          }
          return null;
        })}
      </div>
    </LabelFieldPair>
  );
};

/**
 * BoundaryDropdown Component
 */
const BoundaryDropdown = ({ label, data, onChange, selected }) => {
  const { t } = useTranslation();
  return (
    <div style={{ width: "100%", marginTop: "0px", paddingLeft: "0%" }}>
      <div className="comment-label">{t(label)}</div>
      <Dropdown
        style={{ width: "100%", maxWidth: "37.5rem" }}
        selected={selected}
        t={t}
        option={data}
        optionKey={"code"}
        select={(value) => onChange(value)}
      />
    </div>
  );
};

export default BoundaryComponent;
