import { Dropdown, TextBlock } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScreenTypeEnum } from "../utils/constants";

const BoundaryComponent = ({ reset, makeReset, initialValue, updateSeeeionStorage, selectedProject, onChange, lowestLevel, isRequired }) => {
  const kk = Digit.SessionStorage.get("boundaryHierarchyOrder").map((item) => item.code);

  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const defaultBoundaryData = kk.reduce((acc, curr) => {
    acc[curr] = false;
    return acc;
  }, {});

  const defaultSelectData = kk.reduce((acc, curr) => {
    acc[curr] = null;
    return acc;
  }, {});

  const [boundaryData, setBoundaryData] = useState(defaultBoundaryData);
  const [value, setValue] = useState(
    kk.reduce((acc, curr) => {
      acc[curr] = [];
      return acc;
    }, {})
  );

  const [selectedValues, setSelectedValues] = useState(defaultSelectData);

  const [lowest, setLowest] = useState(lowestLevel);

  // useEffect(() => {
  //   debugger;
  //   if (initialValue) {
  //     setSelectedValues(JSON.parse(initialValue));
  //     const data = JSON.parse(initialValue);
  //     const updatedValues = kk.reduce((acc, boundary) => {
  //       acc[boundary] = data[boundary] ? [data[boundary]] : [];
  //       return acc;
  //     }, {});

  //     debugger;
  //     setValue(updatedValues);
  //   }
  // }, []);
  useEffect(() => {
    if (initialValue) {
      const parsedData = JSON.parse(initialValue);

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

  const { isLoading: childrenDataLoading, data: childrenData } = Digit.Hooks.payments.useAttendanceBoundarySearch(reqCriteriaResource);

  // useEffect(() => {
  //   if (selectedProject) {
  //     setSelectedValues(defaultSelectData);
  //     setValue(
  //       kk.reduce((acc, curr) => {
  //         acc[curr] = [];
  //         return acc;
  //       }, {})
  //     );
  //     setBoundaryData(defaultBoundaryData);

  //     // if (updateSeeeionStorage) {
  //     //   updateSeeeionStorage(defaultSelectData);
  //     // }
  //   }
  // }, [selectedProject]);

  useEffect(() => {
    if (childrenData && childrenData.length > 0) {
      setValue((prevState) => ({
        ...prevState,
        [childrenData[0]?.boundary[0].boundaryType]: [childrenData[0]?.boundary[0]],
      }));

      const formattedData = createFormattedData(childrenData[0]?.boundary[0].boundaryType);
      setBoundaryData(formattedData);
    }
  }, [childrenData]);

  useEffect(() => {
    if (reset == true) {
      setSelectedValues(defaultSelectData);
      Digit.SessionStorage.del("Digit.paymentInbox");
      Digit.SessionStorage.del("selectedValues");
      makeReset(false);
      onChange(null);
    }
  }, [reset]);

  const createFormattedData = (activeBoundary) => {
    const index = kk.indexOf(activeBoundary);
    return kk.reduce((acc, key, i) => {
      acc[key] = i >= index;
      return acc;
    }, {});
  };

  const handleButtonClick = (value) => {
    onChange(value);
    handleDropdownOptions(value);
  };
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

  const resetChildrenSelectedValues = (boundaryType) => {
    const index = kk.indexOf(boundaryType);
    const newSelectedValues = { ...selectedValues };

    for (let i = index + 1; i < kk.length; i++) {
      newSelectedValues[kk[i]] = null;
    }

    setSelectedValues(newSelectedValues);
  };

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
                isRequired={isRequired == ScreenTypeEnum.BILL ? true : key == "DISTRICT" ? true : false}
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

const BoundaryDropdown = ({ label, data, onChange, selected, setSelected, isRequired }) => {
  const { t } = useTranslation();

  return (
    <div style={{ width: "100%", marginTop: "14px" }}>
      <TextBlock body={isRequired == true ? `${t(label)}*` : t(label)} />
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
