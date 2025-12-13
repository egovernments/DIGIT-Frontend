import { Dropdown, TextBlock } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScreenTypeEnum } from "../utils/constants";

/**
 * BoundaryComponent allows users to select boundaries based on the hierarchy.
 * It manages the selected boundaries, updates session storage, and fetches child boundaries.
 *
 * @param {object} props - Component props.
 */

const BoundaryComponent = ({
  reset,
  makeReset,
  initialValue,
  updateSessionStorage,
  selectedProject,
  onChange,
  lowestLevel,
  isRequired,
  disableChildOptions,
}) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "NEWTEST00222";
  // Get the hierarchy and boundary configurations from session storage
  const boundaryHierarchy = Digit.SessionStorage.get("boundaryHierarchyOrder").map((item) => item.code);
  const lowestLevelBoundaryType = Digit.SessionStorage.get("paymentsConfig")?.lowestLevelBoundary || "DISTRICT";

  // State to manage boundary data visibility, values, and selected boundaries
  const defaultBoundaryData = boundaryHierarchy.reduce((acc, curr) => {
    acc[curr] = false;
    return acc;
  }, {});
  const defaultSelectData = boundaryHierarchy.reduce((acc, curr) => {
    acc[curr] = null;
    return acc;
  }, {});
  const [value, setValue] = useState(
    boundaryHierarchy.reduce((acc, curr) => {
      acc[curr] = [];
      return acc;
    }, {})
  );
  const [boundaryData, setBoundaryData] = useState(defaultBoundaryData);
  const [selectedValues, setSelectedValues] = useState(defaultSelectData);

  // Effect to initialize the boundary values based on the provided initial value
  useEffect(() => {
    if (initialValue) {
      const parsedData = initialValue;

      // Initialize selected values
      setSelectedValues(parsedData);

      // Dynamically populate `value` based on hierarchy
      const updatedValues = boundaryHierarchy.reduce((acc, boundary, index) => {
        // Get parent boundary's selected value
        const parentBoundary = boundaryHierarchy[index - 1];
        const parentSelectedValue = index > 0 ? parsedData[parentBoundary] : null;

        // Load current boundary options based on parent boundary's children
        acc[boundary] = parentSelectedValue?.children?.filter((child) => child.boundaryType === boundary) || [];

        return acc;
      }, {});

      setValue(updatedValues);
    }
  }, []);

  // Fetch boundary data for children when a boundary is selected
  const reqCriteriaResource = {
    url: `/boundary-service/boundary-relationships/_search`,
    params: {
      tenantId: tenantId,
      hierarchyType: hierarchyType,
      includeChildren: true,
      codes: selectedProject?.address?.boundary,
      boundaryType: selectedProject?.address?.boundaryType,
    },
    config: {
      enabled: true,
      select: (data) => data,
    },
  };

  const { isLoading: childrenDataLoading, data: childrenData } = Digit.Hooks.payments.useAttendanceBoundarySearch(reqCriteriaResource);

  // Update the dropdown options and state when children data is fetched
  useEffect(() => {
    if (childrenData && childrenData.length > 0) {
      setValue((prevState) => ({
        ...prevState,
        [childrenData[0]?.boundary[0].boundaryType]: [childrenData[0]?.boundary[0]],
      }));

      const formattedData = createFormattedData(childrenData[0]?.boundary[0].boundaryType);
      setBoundaryData(formattedData);
      if (!initialValue) {
        handleButtonClick(childrenData[0]?.boundary[0]);
      }
    }
  }, [childrenData]);

  // Reset boundaries and session storage when the reset prop is triggered
  useEffect(() => {
    if (reset) {
      setSelectedValues(defaultSelectData);
      Digit.SessionStorage.del("paymentInbox");
      Digit.SessionStorage.del("selectedValues");
      makeReset(false);
      onChange(null);
    }
  }, [reset]);

  /**
   * Create formatted boundary data for displaying dropdown options
   * @param {string} activeBoundary - The active boundary type
   * @returns {object} - Formatted boundary data
   */
  const createFormattedData = (activeBoundary) => {
    const index = boundaryHierarchy.indexOf(activeBoundary);
    return boundaryHierarchy.reduce((acc, key, i) => {
      acc[key] = i >= index;
      return acc;
    }, {});
  };

  // Handle the selection change in a dropdown
  const handleButtonClick = (value) => {
    onChange(value);
    handleDropdownOptions(value);
  };

  // Update the dropdown options based on the selected boundary value
  const handleDropdownOptions = (value) => {
    if (value?.children && value.children.length > 0) {
      const updatedState = value.children.reduce((acc, child) => {
        const boundaryType = child?.boundaryType;
        if (boundaryType) {
          acc[boundaryType] = [...(acc[boundaryType] || []), child];
        }
        return acc;
      }, {});

      setValue((prevState) => ({
        ...prevState,
        ...updatedState,
      }));

      setSelectedValues((prev) => {
        const newSelectedValues = { ...prev, [value?.boundaryType]: value };
        if (updateSessionStorage) {
          updateSessionStorage(newSelectedValues);
        }
        return newSelectedValues;
      });
    }
  };

  // Reset the selected values of child boundaries
  const handleInsertion = (boundaryType, newValue) => {
    setValue((prevState) => {
      const newState = { ...prevState };
      const currentBoundary = newState[boundaryType] || [];
      if (!currentBoundary.find((item) => item === newValue)) {
        newState[boundaryType] = [...currentBoundary, newValue];
      }
      return newState;
    });

    resetChildrenSelectedValues(boundaryType);
  };

  const handleDeletion = (boundaryType, valueToRemove) => {
    setValue((prevState) => {
      const newState = { ...prevState };
      newState[boundaryType] = newState[boundaryType]?.filter((item) => item !== valueToRemove) || [];
      return newState;
    });

    resetChildrenSelectedValues(boundaryType);
  };

  // Check if a boundary is allowed to be selected
  const resetChildrenSelectedValues = (boundaryType) => {
    const index = boundaryHierarchy.indexOf(boundaryType);
    const newSelectedValues = { ...selectedValues };

    for (let i = index + 1; i < boundaryHierarchy.length; i++) {
      newSelectedValues[boundaryHierarchy[i]] = null;
    }
    setSelectedValues(newSelectedValues);
  };

  const isBoundaryAllowed = (boundaryType) => {
    if (!lowestLevel) {
      return true;
    }

    const boundaryIndex = boundaryHierarchy.indexOf(boundaryType);
    const lowestLevelIndex = boundaryHierarchy.indexOf(lowestLevel);

    return boundaryIndex <= lowestLevelIndex;
  };

  return (
    <React.Fragment>
      <div>
        {boundaryHierarchy.map((key, index) => {
          if (boundaryData[key] && isBoundaryAllowed(key)) {
            const parentBoundary = index > 0 ? boundaryHierarchy[index - 1] : null;
            const isDisabled = parentBoundary ? !selectedValues[parentBoundary] : false;

            return (
              <BoundaryDropdown
                isRequired={isRequired == ScreenTypeEnum.BILL ? true : key == lowestLevelBoundaryType ? true : false}
                key={key}
                label={`ATTENDANCE_${key}`}
                data={value[key]}
                onChange={(selectedValue) => handleButtonClick(selectedValue)}
                selected={selectedValues[key]}
                setSelected={(newValue) => {
                  setSelectedValues((prev) => ({
                    ...prev,
                    [key]: newValue,
                  }));
                  if (newValue) {
                    handleInsertion(key, newValue);
                  } else {
                    handleDeletion(key, selectedValues[key]);
                  }
                }}
                disabled={isDisabled && disableChildOptions}
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
 * BoundaryDropdown is a reusable component for displaying dropdowns for boundaries
 *
 * @param {object} props - Component props
 */
const BoundaryDropdown = ({ label, data, onChange, selected, setSelected, isRequired, disabled }) => {
  const { t } = useTranslation();
  Digit.SessionStorage.set("paymentInbox", selected);
  return (
    <div style={{ width: "100%", marginTop: "1.5rem" }}>
      <div className="comment-label">
        {t(label)}
        {/* {temp disbale for boundary in v2} */}
        {isRequired && <span className="required"> *</span>}
      </div>
      <Dropdown
        selected={selected}
        t={t}
        option={data}
        optionKey={"code"}
        select={(value) => {
          setSelected(value);
          onChange(value);
        }}
        disabled={disabled || (data.length === 1 && selected != null)}
      />
    </div>
  );
};

export default BoundaryComponent;
