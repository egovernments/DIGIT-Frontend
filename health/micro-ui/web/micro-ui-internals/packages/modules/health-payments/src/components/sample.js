import { Dropdown, TextBlock } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScreenTypeEnum } from "../utils/constants";

const BoundaryComponent = ({ reset, makeReset, initialValue, updateSeeeionStorage, selectedProject, onChange, lowestLevel, isRequired }) => {
  // Retrieve boundary hierarchy order from session storage
  const kk = Digit.SessionStorage.get("boundaryHierarchyOrder").map((item) => item.code);

  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  // Lowest level boundary
  const lowestLevelBoundaryType = Digit.SessionStorage.get("paymentConfig")?.lowestLevelBoundary || "DISTRICT";

  // Initialize boundary data state
  const defaultBoundaryData = kk.reduce((acc, curr) => {
    acc[curr] = false;
    return acc;
  }, {});

  // Initialize selected data state
  const defaultSelectData = kk.reduce((acc, curr) => {
    acc[curr] = null;
    return acc;
  }, {});

  const [boundaryData, setBoundaryData] = useState(defaultBoundaryData);
  const [value, setValue] = useState(
    kk.reduce((acc, curr) => {
      acc[curr] = []; // Initialize with empty array for boundary options
      return acc;
    }, {})
  );

  const [selectedValues, setSelectedValues] = useState(defaultSelectData);

  const [lowest, setLowest] = useState(lowestLevel);

  // Populate dropdown values and selected states based on `initialValue`
  useEffect(() => {
    if (initialValue) {
      const parsedData = initialValue;

      // Initialize selected values
      setSelectedValues(parsedData);

      // Dynamically populate `value` based on hierarchy
      const updatedValues = kk.reduce((acc, boundary, index) => {
        // Get parent boundary's selected value
        const parentBoundary = kk[index - 1];
        const parentSelectedValue = index > 0 ? parsedData[parentBoundary] : null;

        // Load current boundary options based on parent boundary's children
        acc[boundary] = parentSelectedValue?.children?.filter((child) => child.boundaryType === boundary) || [];

        return acc;
      }, {});

      setValue(updatedValues);
    }
  }, []);

  // Request configuration for fetching boundary data
  const reqCriteriaResource = {
    url: `/boundary-service/boundary-relationships/_search`,
    params: {
      tenantId: tenantId,
      hierarchyType: selectedProject?.address?.boundary.split("_")[0],
      includeChildren: true,
      codes: selectedProject?.address?.boundary,
      boundaryType: selectedProject?.address?.boundaryType,
    },
    config: {
      enabled: true,
      select: (data) => data,
    },
  };

  // Fetch boundary data using a custom hook
  const { isLoading: childrenDataLoading, data: childrenData } = Digit.Hooks.payments.useAttendanceBoundarySearch(reqCriteriaResource);

  // Handle fetched boundary data
  useEffect(() => {
    if (childrenData && childrenData.length > 0) {
      setValue((prevState) => ({
        ...prevState,
        [childrenData[0]?.boundary[0].boundaryType]: [childrenData[0]?.boundary[0]],
      }));

      const formattedData = createFormattedData(childrenData[0]?.boundary[0].boundaryType);
      setBoundaryData(formattedData);
      handleButtonClick(childrenData[0]?.boundary[0]);
    }
  }, [childrenData]);

  // Reset dropdowns when the reset flag is set
  useEffect(() => {
    if (reset == true) {
      setSelectedValues(defaultSelectData);
      Digit.SessionStorage.del("paymentInbox");
      Digit.SessionStorage.del("selectedValues");
      makeReset(false);
      onChange(null);
    }
  }, [reset]);

  // Create a formatted boundary data object
  const createFormattedData = (activeBoundary) => {
    const index = kk.indexOf(activeBoundary);
    return kk.reduce((acc, key, i) => {
      acc[key] = i >= index;
      return acc;
    }, {});
  };

  // Handle dropdown selection
  const handleButtonClick = (value) => {
    onChange(value); // Call the callback with the selected value
    handleDropdownOptions(value); // Update dropdown options
  };

  // Populate child dropdown options based on selection
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
        if (updateSeeeionStorage) {
          updateSeeeionStorage(newSelectedValues);
        }
        return newSelectedValues;
      });
    }
  };

  // Add a new option to a dropdown
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
  // Remove an option from a dropdown
  const handleDeletion = (boundaryType, valueToRemove) => {
    setValue((prevState) => {
      const newState = { ...prevState };
      newState[boundaryType] = newState[boundaryType]?.filter((item) => item !== valueToRemove) || [];
      return newState;
    });

    resetChildrenSelectedValues(boundaryType);
  };

  // Reset selected values for child boundaries
  const resetChildrenSelectedValues = (boundaryType) => {
    const index = kk.indexOf(boundaryType);
    const newSelectedValues = { ...selectedValues };

    for (let i = index + 1; i < kk.length; i++) {
      newSelectedValues[kk[i]] = null;
    }

    setSelectedValues(newSelectedValues);
  };
  // Check if a boundary is allowed for selection
  const isBoundaryAllowed = (boundaryType) => {
    if (!lowestLevel) {
      return true;
    }

    const boundaryIndex = kk.indexOf(boundaryType);
    const lowestLevelIndex = kk.indexOf(lowestLevel);

    return boundaryIndex <= lowestLevelIndex;
  };

  return (
    <React.Fragment>
      <div>
        {kk.map((key) => {
          if (boundaryData[key] && isBoundaryAllowed(key)) {
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
              />
            );
          }
          return null;
        })}
      </div>
    </React.Fragment>
  );
};

// Reusable dropdown component
const BoundaryDropdown = ({ label, data, onChange, selected, setSelected, isRequired }) => {
  const { t } = useTranslation();

  return (
    <div style={{ width: "100%", marginTop: "14px" }}>
      <div className="comment-label">
        {t(label)}
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
      />
    </div>
  );
};

export default BoundaryComponent;
