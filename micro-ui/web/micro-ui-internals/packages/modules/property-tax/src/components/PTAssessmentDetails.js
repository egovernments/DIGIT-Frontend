import React, { useState, useEffect, Fragment } from "react";
import { Card, HeaderComponent, LabelFieldPair, Dropdown, TextInput, ErrorMessage, CardLabel, Button, Toast } from "@egovernments/digit-ui-components";

const PTAssessmentDetails = ({ t, config, onSelect, formData = {}, errors, userType, register, isUpdateMode }) => {
  // Get propertyType and usageCategory from parent form data
  const propertyType = formData?.propertyType;
  const usageCategory = formData?.usageCategory;

  // Mono-ui logic: Determine fields based on property type code
  // 1. VACANT: Show only plot size in sq yards
  // 2. INDEPENDENTPROPERTY: Show plot size + no. of floors, then generate floor cards with units
  // 3. SHAREDPROPERTY: Show only unit details with floor selection

  const propertyTypeCode = propertyType?.[0]?.code || "";

  // Construct full usage category code from major + minor
  // usageCategory[0] has: { code: "COMMERCIAL", usageCategoryMajor: "NONRESIDENTIAL" }
  // We need: "NONRESIDENTIAL.COMMERCIAL"
  const usageCategoryObj = usageCategory?.[0] || {};
  const usageCategoryMinorCode = usageCategoryObj?.code || "";
  const usageCategoryMajorCode = usageCategoryObj?.usageCategoryMajor || "";

  let usageCategoryCode = "";
  if (usageCategoryMajorCode && usageCategoryMinorCode) {
    usageCategoryCode = `${usageCategoryMajorCode}.${usageCategoryMinorCode}`;
  } else if (usageCategoryMinorCode) {
    // For single-level categories like "RESIDENTIAL"
    usageCategoryCode = usageCategoryMinorCode;
  }

  const isVacant = propertyTypeCode === "VACANT";
  const isIndependent = propertyTypeCode === "INDEPENDENTPROPERTY";
  const isShared = propertyTypeCode === "SHAREDPROPERTY";

  // State for managing floors and units
  const [floors, setFloors] = useState([]);
  const [floorsData, setFloorsData] = useState(formData?.conditionalFields?.floors || []);
  const [units, setUnits] = useState(formData?.conditionalFields?.units || []);
  const [unitsData, setUnitsData] = useState(formData?.conditionalFields?.units || []);
  const [plotSize, setPlotSize] = useState(formData?.conditionalFields?.plotSize || "");
  const [noOfFloors, setNoOfFloors] = useState(formData?.conditionalFields?.noOfFloors || null);
  const [previousUsageCategory, setPreviousUsageCategory] = useState(null);
  const [previousPropertyType, setPreviousPropertyType] = useState(null);
  const [renderKey, setRenderKey] = useState(0);

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [showToast, setShowToast] = useState(null);

  // MDMS data for dropdowns
  const { data: mdmsData } = Digit.Hooks.useCommonMDMS(tenantId, "PropertyTax", [
    "UsageCategory",
    "UsageCategoryDetail",
    "UsageCategorySubMinor",
    "UsageCategoryMinor",
    "OccupancyType",
    "UsageCategoryMajor",
    "Floor"
  ]);

  const usageCategoryFullData = mdmsData?.PropertyTax?.UsageCategory || [];
  const usageCategoryDetailData = mdmsData?.PropertyTax?.UsageCategoryDetail || [];
  const usageCategorySubMinorData = mdmsData?.PropertyTax?.UsageCategorySubMinor || [];
  const usageCategoryMinorData = mdmsData?.PropertyTax?.UsageCategoryMinor || [];
  const occupancyData = mdmsData?.PropertyTax?.OccupancyType || [];
  const usageCategoryMajorData = mdmsData?.PropertyTax?.UsageCategoryMajor || [];
  const floorMasterData = mdmsData?.PropertyTax?.Floor || [];

  // Build subUsageType from UsageCategory (matching mono-ui logic)
  const subUsageTypeMasterData = React.useMemo(() => {
    let array1 = [];
    let array2 = [];

    usageCategoryFullData.forEach(item => {
      if (!item || !item.code) return;
      const itemCode = item.code.split(".");
      const codeLength = itemCode.length;
      if (codeLength > 3) {
        array1.push(item);
      } else if (codeLength === 3) {
        array2.push(item);
      }
    });

    array1.forEach(item => {
      array2 = array2.filter(item1 => {
        return (!(item.code.includes(item1.code)));
      });
    });

    const result = array2.concat(array1);
    return result;
  }, [usageCategoryFullData]);

  // Filter sub usage type based on selected usage category (matching mono-ui logic)
  const subUsageTypeData = React.useMemo(() => {
    if (!usageCategoryCode) {
      return [];
    }

    // Mono-ui approach: filter subUsageType master where code starts with usageCategoryCode
    // usageCategoryCode = "NONRESIDENTIAL.COMMERCIAL"
    // Filter for codes like "NONRESIDENTIAL.COMMERCIAL.RETAIL.RETAIL", "NONRESIDENTIAL.COMMERCIAL.BANK.BANK", etc.
    const filtered = subUsageTypeMasterData.filter(item => {
      return item.code && item.code.startsWith(usageCategoryCode);
    });

    return filtered;
  }, [usageCategoryCode, subUsageTypeMasterData]);

  const floorCountOptions = Array.from({ length: 25 }, (_, i) => ({
    code: (i + 1).toString(),
    name: (i + 1).toString(),
    i18nKey: (i + 1).toString()
  }));

  // Sync all data to parent under "conditionalFields" key whenever any field changes
  // Use useRef to track if this is the initial render to avoid calling onSelect on mount
  const isInitialMount = React.useRef(true);
  const prevDataRef = React.useRef({ plotSize, noOfFloors, floorsData, unitsData });

  useEffect(() => {
    // Skip on initial mount when data is being loaded from formData
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevDataRef.current = { plotSize, noOfFloors, floorsData, unitsData };
      return;
    }

    // Only call onSelect if data actually changed (deep comparison for arrays)
    const prevData = prevDataRef.current;
    const hasChanged =
      plotSize !== prevData.plotSize ||
      noOfFloors !== prevData.noOfFloors ||
      JSON.stringify(floorsData) !== JSON.stringify(prevData.floorsData) ||
      JSON.stringify(unitsData) !== JSON.stringify(prevData.unitsData);

    if (hasChanged) {
      const allData = {
        plotSize,
        noOfFloors,
        floors: floorsData,
        units: unitsData
      };
      onSelect("conditionalFields", allData);
      prevDataRef.current = { plotSize, noOfFloors, floorsData, unitsData };
    }
  }, [plotSize, noOfFloors, floorsData, unitsData, onSelect]);

  // Handle prop fallback (sometimes passed in customProps via config)
  const _isUpdateMode = isUpdateMode || config?.customProps?.isUpdateMode;

  const handleFieldChange = (fieldName, value) => {
    // Don't call onSelect directly anymore - let the useEffect handle it
    // Just update local state and useEffect will sync to parent
    if (fieldName === "floors") {
      setFloorsData(value);
    } else if (fieldName === "units") {
      setUnitsData(value);
    } else if (fieldName.startsWith("floors[")) {
      // Handle nested floor updates like floors[0].units
      setFloorsData(prev => {
        const newFloors = [...prev];
        // Extract index and update accordingly
        return newFloors;
      });
    }
    // For other fields like propertyType, usageCategory, they're handled by parent form
  };

  // Handle plot size change
  const handlePlotSizeChange = (value) => {
    setPlotSize(value);
  };

  // Initialize floors state from floorsData when data is loaded (for update mode)
  // Also convert string floorNo to object matching floorMasterData
  const hasInitializedFloors = React.useRef(false);
  const hasInitializedSharedUnits = React.useRef(false);

  // Robust Data Normalization Effect
  // Converts string values in floorsData/unitsData to objects using MDMS data
  // Runs whenever data or MDMS updates, preventing race conditions
  useEffect(() => {
    // Helper to normalize a single unit
    const normalizeUnit = (unit) => {
      let modified = false;
      const newUnit = { ...unit };

      // 1. Normalize Floor No
      if (unit.floorNo && typeof unit.floorNo === 'string' && floorMasterData.length > 0) {
        const floorObj = floorMasterData.find(f => String(f.code) === unit.floorNo);
        if (floorObj) {
          newUnit.floorNo = floorObj;
          modified = true;
        }
      }

      // 2. Normalize Occupancy
      if (unit.occupancy && typeof unit.occupancy === 'string' && occupancyData.length > 0) {
        const occupancyObj = occupancyData.find(o => o.code === unit.occupancy);
        if (occupancyObj) {
          newUnit.occupancy = occupancyObj;
          modified = true;
        }
      }

      // 3. Normalize Usage Type
      if (unit.usageType && typeof unit.usageType === 'string') {
        const allUsageTypes = [...usageCategoryMajorData, ...usageCategoryMinorData];
        if (allUsageTypes.length > 0) {
          const usageObj = allUsageTypes.find(u => u.code === unit.usageType);
          if (usageObj) {
            newUnit.usageType = usageObj;
            modified = true;
          }
        }
      }

      // 4. Normalize Sub Usage Type
      if (unit.subUsageType && typeof unit.subUsageType === 'string' && subUsageTypeMasterData.length > 0) {
        const subUsageObj = subUsageTypeMasterData.find(u => u.code === unit.subUsageType);
        if (subUsageObj) {
          newUnit.subUsageType = subUsageObj;
          modified = true;
        }
      }

      return { unit: newUnit, modified };
    };

    if (isIndependent && floorsData.length > 0) {
      let listModified = false;
      const newFloorsData = floorsData.map(floor => {
        let floorModified = false;
        const newFloor = { ...floor };

        // Normalize Floor No (on floor object)
        if (newFloor.floorNo && typeof newFloor.floorNo === 'string' && floorMasterData.length > 0) {
          const floorObj = floorMasterData.find(f => String(f.code) === newFloor.floorNo);
          if (floorObj) {
            newFloor.floorNo = floorObj;
            floorModified = true;
          }
        }

        // Normalize Units
        if (newFloor.units) {
          const newUnits = newFloor.units.map(unit => {
            const { unit: normUnit, modified } = normalizeUnit(unit);
            if (modified) floorModified = true;
            return normUnit;
          });
          newFloor.units = newUnits;
        }

        if (floorModified) listModified = true;
        return newFloor;
      });

      if (listModified) {
        setFloorsData(newFloorsData);
      }

      // Initialize UI Cards if needed (only once)
      if (floors.length === 0) {
        const initialFloors = newFloorsData.map((floorData, i) => ({
          floorNumber: i,
          units: (floorData.units || []).map((_, unitIdx) => ({ id: `floor_${i}_unit_${unitIdx}` }))
        }));
        setFloors(initialFloors);
      }
    }

    if (isShared && unitsData.length > 0) {
      let listModified = false;
      const newUnitsData = unitsData.map(unit => {
        const { unit: normUnit, modified } = normalizeUnit(unit);
        if (modified) listModified = true;
        return normUnit;
      });

      if (listModified) {
        setUnitsData(newUnitsData);
      }

      // Initialize UI Cards if needed (only once)
      if (units.length === 0) {
        setUnits(unitsData.map((_, i) => ({ id: i }))); // Simple ID mapping for shared units
      }
    }

    // Initialize shared property with one unit if absolutely empty
    if (isShared && units.length === 0 && unitsData.length === 0 && !hasInitializedSharedUnits.current) {
      // Initialize empty unit only once
      setUnits([{}]);
      setUnitsData([{}]); // Also init data state
      handleFieldChange("units", [{}]);
      hasInitializedSharedUnits.current = true;
    }

  }, [
    isIndependent,
    isShared,
    floorsData,
    unitsData,
    floorMasterData,
    occupancyData,
    usageCategoryMajorData,
    usageCategoryMinorData,
    subUsageTypeMasterData,
    floors.length,
    units.length
  ]);

  // Set default usage type to RESIDENTIAL when usage category is RESIDENTIAL
  useEffect(() => {
    if (usageCategoryCode === "RESIDENTIAL") {
      // Set default for Independent property floors
      if (isIndependent && floors.length > 0) {
        floors.forEach((floor, floorIndex) => {
          floor.units.forEach((unit, unitIndex) => {
            const currentUsageType = formData?.floors?.[floorIndex]?.units?.[unitIndex]?.usageType;
            if (!currentUsageType) {
              handleUnitFieldChange(floorIndex, unitIndex, "usageType", { code: "RESIDENTIAL", name: "Residential" });
            }
          });
        });
      }
      // Set default for Shared property units
      if (isShared && units.length > 0) {
        units.forEach((unit, unitIndex) => {
          const currentUsageType = formData?.units?.[unitIndex]?.usageType;
          if (!currentUsageType) {
            handleUnitFieldChange(null, unitIndex, "usageType", { code: "RESIDENTIAL", name: "Residential" });
          }
        });
      }
    }
  }, [usageCategoryCode, floors.length, units.length]);

  // Alert and reset when usage category changes
  useEffect(() => {
    if (usageCategory?.[0]?.code && previousUsageCategory &&
      usageCategory[0].code !== previousUsageCategory) {

      // Check if there's any data filled
      const hasFilledData = formData?.noOfFloors ||
        plotSize ||
        (isIndependent && floors.length > 0) ||
        (isShared && units.length > 0 &&
          (units.some(u => u.floorNo || u.usageType || u.subUsageType || u.occupancy || u.builtUpArea)));

      if (hasFilledData) {
        const confirmReset = window.confirm(
          t("PT_USAGE_CATEGORY_CHANGE_WARNING") ||
          "Changing the Property Usage Type will clear all filled unit details. Do you want to continue?"
        );

        if (confirmReset) {
          // Reset all assessment details data
          // Just update state - useEffect will sync to parent
          setFloors([]);
          setFloorsData([]);
          setUnits([{}]);
          setUnitsData([{}]);
          setPlotSize("");
        } else {
          // Revert to previous usage category
          handleFieldChange("usageCategory", [{ code: previousUsageCategory }]);
          return;
        }
      }
    }

    // Update previous usage category
    if (usageCategory?.[0]?.code) {
      setPreviousUsageCategory(usageCategory[0].code);
    }
  }, [usageCategory]);

  // Alert and reset when property type changes
  useEffect(() => {
    if (propertyType?.[0]?.code && previousPropertyType &&
      propertyType[0].code !== previousPropertyType) {

      // Check if there's any data filled
      const hasFilledData = formData?.noOfFloors ||
        plotSize ||
        (isIndependent && floors.length > 0) ||
        (isShared && units.length > 0 &&
          (units.some(u => u.floorNo || u.usageType || u.subUsageType || u.occupancy || u.builtUpArea)));

      if (hasFilledData) {
        const confirmReset = window.confirm(
          t("PT_PROPERTY_TYPE_CHANGE_WARNING") ||
          "Changing the Property Type will clear all filled details. Do you want to continue?"
        );

        if (confirmReset) {
          // Reset all assessment details data
          // Just update state - useEffect will sync to parent
          setFloors([]);
          setFloorsData([]);
          setUnits([{}]);
          setUnitsData([{}]);
          setPlotSize("");
        } else {
          // Revert to previous property type
          handleFieldChange("propertyType", [{ code: previousPropertyType }]);
          return;
        }
      }
    }

    // Update previous property type
    if (propertyType?.[0]?.code) {
      setPreviousPropertyType(propertyType[0].code);
    }
  }, [propertyType]);

  // Handle floor count change for Independent property
  const handleFloorCountChange = (value) => {
    setNoOfFloors(value);
    const floorCount = parseInt(value?.code || value);

    // Generate floor cards based on floor count
    const newFloors = Array.from({ length: floorCount }, (_, i) => ({
      floorNumber: i,
      units: [{ id: `floor_${i}_unit_0` }] // Each floor starts with one unit
    }));

    setFloors(newFloors);

    // Initialize units array
    const initialUnits = newFloors.map((floor, floorIdx) => {
      let floorNoValue = floorIdx.toString();

      // If only 1 floor, auto-select Ground Floor
      if (floorCount === 1 && floorMasterData?.length > 0) {
        const groundFloor = floorMasterData.find(f => f.code === "0" || f.code === 0);
        if (groundFloor) {
          floorNoValue = groundFloor;
        }
      }

      return {
        floorNo: floorNoValue,
        units: [{}]
      };
    });

    // Update local state
    setFloorsData(initialUnits);

    // Update formData
    handleFieldChange("floors", initialUnits);
  };

  // Add unit to a specific floor (for Independent property)
  const handleAddUnit = (floorIndex) => {
    const newFloors = [...floors];
    const unitId = `floor_${floorIndex}_unit_${newFloors[floorIndex].units.length}`;
    newFloors[floorIndex].units.push({ id: unitId });
    setFloors(newFloors);

    // Update floorsData with the new unit structure (use floorsData not formData)
    const updatedFloorsData = [...floorsData];
    if (!updatedFloorsData[floorIndex]) {
      updatedFloorsData[floorIndex] = { floorNo: floorIndex.toString(), units: [] };
    }
    if (!updatedFloorsData[floorIndex].units) {
      updatedFloorsData[floorIndex].units = [];
    }
    updatedFloorsData[floorIndex].units.push({});
    setFloorsData(updatedFloorsData);
    // Sync to parent formData
    handleFieldChange("floors", updatedFloorsData);
  };

  // Remove unit from a specific floor
  const handleRemoveUnit = (floorIndex, unitIndex) => {
    const newFloors = [...floors];
    if (newFloors[floorIndex].units.length > 1) {
      newFloors[floorIndex].units.splice(unitIndex, 1);
      setFloors(newFloors);

      // Update floorsData after removing unit (use floorsData not formData)
      const updatedFloorsData = [...floorsData];
      if (updatedFloorsData[floorIndex] && updatedFloorsData[floorIndex].units) {
        updatedFloorsData[floorIndex].units = updatedFloorsData[floorIndex].units.filter((_, idx) => idx !== unitIndex);
        setFloorsData(updatedFloorsData);
        // Sync to parent formData
        handleFieldChange("floors", updatedFloorsData);
      }
    }
  };

  // Add unit for Shared property
  const handleAddSharedUnit = () => {
    // Update UI state
    setUnits([...units, {}]);
    // Update data state
    const updatedUnitsData = [...unitsData, {}];
    setUnitsData(updatedUnitsData);
    // Sync to parent formData
    handleFieldChange("units", updatedUnitsData);
  };

  // Remove unit for Shared property
  const handleRemoveSharedUnit = (unitIndex) => {
    if (units.length > 1) {
      // Update UI state
      const newUnits = units.filter((_, idx) => idx !== unitIndex);
      setUnits(newUnits);
      // Update data state
      const newUnitsData = unitsData.filter((_, idx) => idx !== unitIndex);
      setUnitsData(newUnitsData);
      // Sync to parent formData
      handleFieldChange("units", newUnitsData);
    }
  };

  // Handle unit field change
  const handleUnitFieldChange = (floorIndex, unitIndex, fieldName, value) => {
    if (isIndependent) {
      // For independent property, update the floors array
      const currentFloors = [...floorsData];

      // Ensure floor exists
      if (!currentFloors[floorIndex]) {
        currentFloors[floorIndex] = { floorNo: floorIndex.toString(), units: [] };
      }

      // Ensure units array exists
      if (!currentFloors[floorIndex].units) {
        currentFloors[floorIndex].units = [];
      }

      // Ensure unit exists
      if (!currentFloors[floorIndex].units[unitIndex]) {
        currentFloors[floorIndex].units[unitIndex] = {};
      }

      // Update the field
      currentFloors[floorIndex].units[unitIndex][fieldName] = value;

      // Update local state
      setFloorsData(currentFloors);

      // Update formData
      handleFieldChange("floors", currentFloors);

      // Force re-render if usage type changed
      if (fieldName === "usageType") {
        setRenderKey(prev => prev + 1);
      }
    } else {
      // For shared property, update the units array
      const currentUnits = [...unitsData];

      // Ensure unit exists
      if (!currentUnits[unitIndex]) {
        currentUnits[unitIndex] = {};
      }

      // Update the field
      currentUnits[unitIndex][fieldName] = value;
      // Update local state
      setUnitsData(currentUnits);

      // Update formData
      handleFieldChange("units", currentUnits);

      // Force re-render if usage type changed
      if (fieldName === "usageType") {
        setRenderKey(prev => prev + 1);
      }
    }
  };

  // Handle floor selection for Independent property
  const handleFloorSelection = (floorIndex, value) => {
    const currentFloors = [...floorsData];

    // Ensure floor exists
    if (!currentFloors[floorIndex]) {
      currentFloors[floorIndex] = { units: [] };
    }

    // Update the floor number
    currentFloors[floorIndex].floorNo = value;

    // Update local state
    setFloorsData(currentFloors);

    // Update formData
    handleFieldChange("floors", currentFloors);
  };

  // Determine which fields to show based on usage category
  const shouldShowSubUsageType = (unitUsageType = null) => {
    // For MIXED: show sub usage type based on selected unit usage type
    if (usageCategoryCode === "MIXED" && unitUsageType) {
      return true; // Show sub usage type when unit usage type is selected
    }
    // For RESIDENTIAL, don't show sub usage type
    if (usageCategoryCode === "RESIDENTIAL") {
      return false;
    }
    // For others (COMMERCIAL, INDUSTRIAL, etc.), show sub usage type
    return !["RESIDENTIAL", "MIXED"].includes(usageCategoryCode);
  };

  const shouldShowUsageType = () => {
    // Show usage type for RESIDENTIAL (disabled) and MIXED (enabled)
    return ["RESIDENTIAL", "MIXED"].includes(usageCategoryCode);
  };

  const isUsageTypeDisabled = () => {
    // Disable for RESIDENTIAL, enable for MIXED
    // Also disable if we are in update mode
    if (_isUpdateMode) return true;

    return usageCategoryCode === "RESIDENTIAL";
  };

  // Get filtered usage types for MIXED (merge Major and Minor, exclude "MIXED" option)
  const getFilteredUsageTypes = () => {
    if (usageCategoryCode === "MIXED") {
      // Merge UsageCategoryMajor and UsageCategoryMinor (matching mono-ui logic)
      const majorTypes = usageCategoryMajorData.map(item => ({
        code: item.code,
        name: item.name,
        i18nKey: item.code
      }));

      const minorTypes = usageCategoryMinorData.map(item => ({
        code: item.code,
        name: item.name,
        i18nKey: item.code
      }));

      // Merge and remove duplicates
      const allTypes = [...majorTypes, ...minorTypes];
      const uniqueTypes = allTypes.reduce((acc, current) => {
        const exists = acc.find(item => item.code === current.code);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);

      // Filter out "MIXED"
      return uniqueTypes.filter(type => type.code !== "MIXED");
    }
    return usageCategoryMajorData;
  };

  // Get sub usage type based on selected unit usage type (for MIXED)
  const getSubUsageTypeForUnitUsage = (unitUsageTypeCode) => {
    if (!unitUsageTypeCode) return [];

    // Mono-ui approach: filter subUsageType master where code starts with unitUsageTypeCode
    // For MIXED property: unitUsageTypeCode could be "COMMERCIAL", "RESIDENTIAL", "INDUSTRIAL", etc.
    // We need to handle both simple codes and full paths
    // If unitUsageTypeCode is just "COMMERCIAL", we need to construct possible prefixes
    // Check if it's already a full path or just a minor category
    const filtered = subUsageTypeMasterData.filter(item => {
      if (!item.code) return false;
      // Check if it starts with the unitUsageTypeCode directly
      if (item.code.startsWith(unitUsageTypeCode)) {
        return true;
      }
      // Also check if it matches when we add NONRESIDENTIAL prefix
      // This handles cases where unitUsageTypeCode = "COMMERCIAL" but codes are "NONRESIDENTIAL.COMMERCIAL.*"
      if (item.code.startsWith(`NONRESIDENTIAL.${unitUsageTypeCode}`)) {
        return true;
      }

      return false;
    });

    return filtered;
  };

  // Render unit fields based on usage category
  const renderUnitFields = (floorIndex = null, unitIndex, isSharedProp = false) => {
    const showUsageType = shouldShowUsageType();
    const usageTypeDisabled = isUsageTypeDisabled();

    // Get current unit usage type (for MIXED to determine sub usage type)
    const unitUsageTypeObj = isSharedProp
      ? unitsData?.[unitIndex]?.usageType
      : floorsData?.[floorIndex]?.units?.[unitIndex]?.usageType;

    // Extract code from object or use the value directly
    let currentUnitUsageType = null;
    if (unitUsageTypeObj) {
      currentUnitUsageType = typeof unitUsageTypeObj === 'object' ? unitUsageTypeObj.code : unitUsageTypeObj;
    }

    const showSubUsageType = shouldShowSubUsageType(currentUnitUsageType);

    // Get appropriate sub usage type data
    const unitSubUsageTypeData = usageCategoryCode === "MIXED" && currentUnitUsageType
      ? getSubUsageTypeForUnitUsage(currentUnitUsageType)
      : subUsageTypeData;

    return (
      <Card type="secondary">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <CardLabel style={{ fontSize: "16px", fontWeight: "bold", margin: "0rem" }}>
            {t("PT_FORM2_UNIT")} {unitIndex + 1}
          </CardLabel>
          {((isIndependent && floorIndex !== null && floors[floorIndex]?.units?.length > 1) ||
            (isSharedProp && units.length > 1)) && (
              <Button
                label={t("PT_COMMON_REMOVE")}
                variation="secondary"
                size="small"
                onClick={() =>
                  isSharedProp
                    ? handleRemoveSharedUnit(unitIndex)
                    : handleRemoveUnit(floorIndex, unitIndex)
                }
              />
            )}
        </div>

        {/* Floor Selection - only for Shared property */}
        {isSharedProp && (
          <LabelFieldPair>
            <HeaderComponent className="label" style={{ margin: "0rem" }}>
              <div className={`label-container`}>
                <label className={`label-styles`}>
                  {t("PT_FORM2_SELECT_FLOOR")}
                </label>
                <div style={{ color: "#B91900" }}>{" * "}</div>
              </div>
            </HeaderComponent>
            <Dropdown

              t={t}
              option={floorMasterData || []}
              optionKey="name"
              optionCardStyles={{ maxHeight: "15vh" }}
              selected={unitsData?.[unitIndex]?.floorNo}
              select={(value) => handleUnitFieldChange(null, unitIndex, "floorNo", value)}
              placeholder={t("PT_COMMONS_SELECT_PLACEHOLDER")}
            />
          </LabelFieldPair>
        )}

        {/* Usage Type - shown for RESIDENTIAL and MIXED */}
        {showUsageType && (
          <LabelFieldPair style={(_isUpdateMode && isSharedProp && usageCategoryCode === "RESIDENTIAL") ? { pointerEvents: "none", opacity: 0.5, marginBottom: "8px" } : { marginBottom: "8px" }}>
            <HeaderComponent className="label" style={{ margin: "0rem" }}>
              <div className={`label-container`}>
                <label className={`label-styles`}>
                  {t("PT_FORM2_USAGE_TYPE")}
                </label>
                <div style={{ color: "#B91900" }}>{" * "}</div>
              </div>
            </HeaderComponent>
            <Dropdown

              t={t}
              option={getFilteredUsageTypes() || []}
              optionKey="code"
              selected={
                isSharedProp
                  ? unitsData?.[unitIndex]?.usageType || (usageCategoryCode === "RESIDENTIAL" ? { code: "RESIDENTIAL" } : null)
                  : floorsData?.[floorIndex]?.units?.[unitIndex]?.usageType || (usageCategoryCode === "RESIDENTIAL" ? { code: "RESIDENTIAL" } : null)
              }
              select={(value) => {
                handleUnitFieldChange(floorIndex, unitIndex, "usageType", value);
                // Reset sub usage type when unit usage type changes (for MIXED)
                if (usageCategoryCode === "MIXED") {
                  handleUnitFieldChange(floorIndex, unitIndex, "subUsageType", null);
                }
              }}
              placeholder={t("PT_COMMONS_SELECT_PLACEHOLDER")}
              disable={usageTypeDisabled}
            />
          </LabelFieldPair>
        )}

        {/* Sub Usage Type - shown for other categories or MIXED with unit usage type selected */}
        {showSubUsageType && (
          <LabelFieldPair style={{ marginBottom: "8px" }}>
            <HeaderComponent className="label" style={{ margin: "0rem" }}>
              <div className={`label-container`}>
                <label className={`label-styles`}>
                  {t("PT_FORM2_SUB_USAGE_TYPE")}
                </label>
                <div style={{ color: "#B91900" }}>{" * "}</div>
              </div>
            </HeaderComponent>
            <Dropdown

              t={t}
              option={unitSubUsageTypeData || []}
              optionKey="name"
              selected={
                isSharedProp
                  ? unitsData?.[unitIndex]?.subUsageType
                  : floorsData?.[floorIndex]?.units?.[unitIndex]?.subUsageType
              }
              select={(value) => handleUnitFieldChange(floorIndex, unitIndex, "subUsageType", value)}
              placeholder={t("PT_COMMONS_SELECT_PLACEHOLDER")}
            />
          </LabelFieldPair>
        )}

        {/* Occupancy */}
        <LabelFieldPair style={{ marginBottom: "8px" }}>
          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div className={`label-container`}>
              <label className={`label-styles`}>
                {t("PT_FORM2_OCCUPANCY")}
              </label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <Dropdown
            t={t}
            option={occupancyData || []}
            optionKey="name"
            selected={
              isSharedProp
                ? unitsData?.[unitIndex]?.occupancy
                : floorsData?.[floorIndex]?.units?.[unitIndex]?.occupancy
            }
            select={(value) => handleUnitFieldChange(floorIndex, unitIndex, "occupancy", value)}
            placeholder={t("PT_COMMONS_SELECT_PLACEHOLDER")}
          />
        </LabelFieldPair>
        {/* Show ARV and rented fields when occupancy is RENTED */}
        {((isSharedProp && unitsData?.[unitIndex]?.occupancy?.code === "RENTED") ||
          (!isSharedProp && floorsData?.[floorIndex]?.units?.[unitIndex]?.occupancy?.code === "RENTED")) && (
            <>
              {/* ARV (Annual Rental Value) */}
              <LabelFieldPair style={{ marginBottom: "8px" }}>
                <HeaderComponent className="label" style={{ margin: "0rem" }}>
                  <div className={`label-container`}>
                    <label className={`label-styles`}>
                      {t("PT_FORM2_TOTAL_ANNUAL_RENT")}
                    </label>
                    <div style={{ color: "#B91900" }}>{" * "}</div>
                  </div>
                </HeaderComponent>
                <div className="digit-field">
                  <TextInput
                    type="number"
                    t={t}
                    value={
                      isSharedProp
                        ? unitsData?.[unitIndex]?.arv || ""
                        : floorsData?.[floorIndex]?.units?.[unitIndex]?.arv || ""
                    }
                    onChange={(e) => handleUnitFieldChange(floorIndex, unitIndex, "arv", e.target.value)}
                    placeholder={t("PT_FORM2_TOTAL_ANNUAL_RENT_PLACEHOLDER")}
                  />
                </div>
              </LabelFieldPair>
              {/* Rented for Months */}
              <LabelFieldPair style={{ marginBottom: "8px" }}>
                <HeaderComponent className="label" style={{ margin: "0rem" }}>
                  <div className={`label-container`}>
                    <label className={`label-styles`}>
                      {t("PT_FORM2_RENTED_FOR_MONTHS")}
                    </label>
                  </div>
                </HeaderComponent>
                <div className="digit-field">
                  <TextInput
                    type="number"
                    t={t}
                    value={
                      isSharedProp
                        ? unitsData?.[unitIndex]?.rentedForMonths || ""
                        : floorsData?.[floorIndex]?.units?.[unitIndex]?.rentedForMonths || ""
                    }
                    onChange={(e) => handleUnitFieldChange(floorIndex, unitIndex, "rentedForMonths", e.target.value)}
                    placeholder={t("PT_FORM2_RENTED_FOR_MONTHS_PLACEHOLDER")}
                  />
                </div>
              </LabelFieldPair>
              {/* Usage for Due Months (Dropdown) */}
              <LabelFieldPair style={{ marginBottom: "8px" }}>
                <HeaderComponent className="label" style={{ margin: "0rem" }}>
                  <div className={`label-container`}>
                    <label className={`label-styles`}>
                      {t("PT_FORM2_USAGE_FOR_DUE_MONTHS")}
                    </label>
                  </div>
                </HeaderComponent>
                <Dropdown
                  t={t}
                  option={[
                    { code: "UNOCCUPIED", name: t("PT_UNOCCUPIED") || "Unoccupied" },
                    { code: "SELFOCCUPIED", name: t("PT_SELFOCCUPIED") || "Self Occupied" }
                  ]}
                  optionKey="name"
                  selected={
                    isSharedProp
                      ? unitsData?.[unitIndex]?.usageForDueMonths
                      : floorsData?.[floorIndex]?.units?.[unitIndex]?.usageForDueMonths
                  }
                  select={(value) => handleUnitFieldChange(floorIndex, unitIndex, "usageForDueMonths", value)}
                  placeholder={t("PT_COMMONS_SELECT_PLACEHOLDER")}
                />
              </LabelFieldPair>
            </>
          )}
        {/* Built Area */}
        <LabelFieldPair>
          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div className={`label-container`}>
              <label className={`label-styles`}>
                {t("PT_FORM2_BUILT_AREA")}
              </label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <div className="digit-field">
            <TextInput
              type="number"
              t={t}
              value={
                isSharedProp
                  ? unitsData?.[unitIndex]?.builtUpArea || ""
                  : floorsData?.[floorIndex]?.units?.[unitIndex]?.builtUpArea || ""
              }
              onChange={(e) => handleUnitFieldChange(floorIndex, unitIndex, "builtUpArea", e.target.value)}
              placeholder={t("PT_FORM2_BUILT_UP_AREA_PLACEHOLDER")}
            />
          </div>
        </LabelFieldPair>
      </Card>
    );
  };

  // Validation function
  const validateFields = () => {
    const missingFields = [];

    // VACANT validation
    if (isVacant) {
      const plotSizeStr = String(plotSize || "").trim();
      if (!plotSizeStr) {
        missingFields.push(t("PT_FORM2_PLOT_SIZE"));
      }
    }

    // INDEPENDENT validation
    if (isIndependent) {
      const plotSizeStr = String(plotSize || "").trim();
      if (!plotSizeStr) {
        missingFields.push(t("PT_FORM2_PLOT_SIZE"));
      }
      if (!formData?.conditionalFields?.noOfFloors) {
        missingFields.push(t("PT_FORM2_NUMBER_OF_FLOORS"));
      }

      // Validate each floor
      if (floors.length > 0) {
        floors.forEach((floor, floorIndex) => {
          // Check floor selection
          if (!floorsData?.[floorIndex]?.floorNo) {
            missingFields.push(`${t("PT_FORM2_FLOOR")} ${floorIndex + 1} - ${t("PT_FORM2_SELECT_FLOOR")}`);
          }

          // Validate each unit in the floor
          floor.units.forEach((unit, unitIndex) => {
            const unitData = floorsData?.[floorIndex]?.units?.[unitIndex];
            const prefix = `${t("PT_FORM2_FLOOR")} ${floorIndex + 1}, ${t("PT_FORM2_UNIT")} ${unitIndex + 1}`;

            // Usage type validation (for RESIDENTIAL/MIXED)
            if (shouldShowUsageType() && !unitData?.usageType) {
              missingFields.push(`${prefix} - ${t("PT_FORM2_USAGE_TYPE")}`);
            }

            // Sub usage type validation
            const unitUsageType = unitData?.usageType?.code || unitData?.usageType;
            if (shouldShowSubUsageType(unitUsageType) && !unitData?.subUsageType) {
              missingFields.push(`${prefix} - ${t("PT_FORM2_SUB_USAGE_TYPE")}`);
            }

            // Occupancy validation
            if (!unitData?.occupancy) {
              missingFields.push(`${prefix} - ${t("PT_FORM2_OCCUPANCY")}`);
            }

            // Built area validation
            const builtUpAreaStr = String(unitData?.builtUpArea || "").trim();
            if (!builtUpAreaStr) {
              missingFields.push(`${prefix} - ${t("PT_FORM2_BUILT_AREA")}`);
            }
          });
        });
      }
    }

    // SHARED validation
    if (isShared) {
      units.forEach((unit, unitIndex) => {
        const unitData = unitsData?.[unitIndex];
        const prefix = `${t("PT_FORM2_UNIT")} ${unitIndex + 1}`;

        // Floor selection validation
        if (!unitData?.floorNo) {
          missingFields.push(`${prefix} - ${t("PT_FORM2_SELECT_FLOOR")}`);
        }

        // Usage type validation (for RESIDENTIAL/MIXED)
        if (shouldShowUsageType() && !unitData?.usageType) {
          missingFields.push(`${prefix} - ${t("PT_FORM2_USAGE_TYPE")}`);
        }

        // Sub usage type validation
        const unitUsageType = unitData?.usageType?.code || unitData?.usageType;
        if (shouldShowSubUsageType(unitUsageType) && !unitData?.subUsageType) {
          missingFields.push(`${prefix} - ${t("PT_FORM2_SUB_USAGE_TYPE")}`);
        }

        // Occupancy validation
        if (!unitData?.occupancy) {
          missingFields.push(`${prefix} - ${t("PT_FORM2_OCCUPANCY")}`);
        }

        // Built area validation
        const builtUpAreaStr = String(unitData?.builtUpArea || "").trim();
        if (!builtUpAreaStr) {
          missingFields.push(`${prefix} - ${t("PT_FORM2_BUILT_AREA")}`);
        }
      });
    }

    if (missingFields.length > 0) {
      const message = `${t("PT_VALIDATION_MISSING_FIELDS") || "Please fill all mandatory fields"} ${missingFields} are missing`;
      setShowToast({ type: "error", label: message });
      return false;
    }

    return true;
  };

  // Expose validation function to parent via config
  useEffect(() => {
    if (config?.populators?.validation) {
      config.populators.validation.validateAssessmentDetails = validateFields;
    }
  }, [plotSize, floors, floorsData, units, unitsData, isVacant, isIndependent, isShared]);

  // If both property type and usage category are not selected yet, don't show any conditional fields
  if (!propertyType || !usageCategory) {
    return null;
  }

  const getFloorOptions = (index) => {
    if (!floorMasterData) return [];
    const floorCount = parseInt(noOfFloors?.code || noOfFloors || 0);
    if (floorCount > 1 && index === 0) {
      return floorMasterData.filter(floor => floor.code === "0" || floor.code === 0);
    }
    return floorMasterData;
  };

  return (
    <>
      {showToast && (
        <Toast
          label={showToast.label}
          type={showToast.type}
          onClose={() => setShowToast(null)}
        />
      )}
      <Card type="secondary">
        {/* VACANT: Show only plot size */}
        {isVacant && (
          <LabelFieldPair removeMargin={true}>
            <HeaderComponent className="label" style={{ margin: "0rem" }}>
              <div className={`label-container`}>
                <label className={`label-styles`}>
                  {t("PT_FORM2_PLOT_SIZE")}
                </label>
                <div style={{ color: "#B91900" }}>{" * "}</div>
              </div>
            </HeaderComponent>
            <div className="digit-field">
              <TextInput
                type="number"
                t={t}
                value={plotSize}
                onChange={(e) => handlePlotSizeChange(e.target.value)}
                placeholder={t("PT_FORM2_PLOT_SIZE_PLACEHOLDER")}
              />
            </div>
            {errors?.plotSize && <ErrorMessage message={t(errors.plotSize)}></ErrorMessage>}
          </LabelFieldPair>
        )}

        {/* INDEPENDENTPROPERTY: Plot size + Floor count + Floor cards with units */}
        {isIndependent && (
          <>
            {/* Plot Size */}
            <LabelFieldPair removeMargin={true}>
              <HeaderComponent className="label" style={{ margin: "0rem" }}>
                <div className={`label-container`}>
                  <label className={`label-styles`}>
                    {t("PT_FORM2_PLOT_SIZE")}
                  </label>
                  <div style={{ color: "#B91900" }}>{" * "}</div>
                </div>
              </HeaderComponent>
              <div className="digit-field">
                <TextInput
                  type="number"
                  t={t}
                  value={plotSize}
                  onChange={(e) => handlePlotSizeChange(e.target.value)}
                  placeholder={t("PT_FORM2_PLOT_SIZE_PLACEHOLDER")}
                />
              </div>
              {errors?.plotSize && <ErrorMessage message={t(errors.plotSize)}></ErrorMessage>}
            </LabelFieldPair>

            {/* No. of Floors */}
            <LabelFieldPair>
              <HeaderComponent className="label" style={{ margin: "0rem" }}>
                <div className={`label-container`}>
                  <label className={`label-styles`}>
                    {t("PT_FORM2_NUMBER_OF_FLOORS")}
                  </label>
                  <div style={{ color: "#B91900" }}>{" * "}</div>
                </div>
              </HeaderComponent>
              <Dropdown
                t={t}
                option={floorCountOptions}
                optionKey="code"
                selected={formData?.conditionalFields?.noOfFloors}
                optionCardStyles={{ maxHeight: "15vh" }}
                select={handleFloorCountChange}
                placeholder={t("PT_COMMONS_SELECT_PLACEHOLDER")}
              />
              {errors?.noOfFloors && <ErrorMessage message={t(errors.noOfFloors)}></ErrorMessage>}
            </LabelFieldPair>

            {/* Floor Cards - Generated based on floor count */}
            {floors.length > 0 && (
              <div>
                {floors.map((floor, floorIndex) => (
                  <Card key={floorIndex} style={{ marginBottom: "1.5rem" }}>
                    <CardLabel style={{ fontSize: "18px", fontWeight: "bold", margin: "0rem" }}>
                      {t("PT_FORM2_FLOOR")} {floorIndex + 1}
                    </CardLabel>

                    {/* Select Floor Dropdown */}
                    <LabelFieldPair style={{ marginBottom: "8px" }}>
                      <HeaderComponent className="label" style={{ margin: "0rem" }}>
                        <div className={`label-container`}>
                          <label className={`label-styles`}>
                            {t("PT_FORM2_SELECT_FLOOR")}
                          </label>
                          <div style={{ color: "#B91900" }}>{" * "}</div>
                        </div>
                      </HeaderComponent>
                      <Dropdown
                        t={t}
                        option={getFloorOptions(floorIndex)}
                        optionKey="name"
                        optionCardStyles={{ maxHeight: "15vh" }}
                        selected={floorsData?.[floorIndex]?.floorNo}
                        select={(value) => handleFloorSelection(floorIndex, value)}
                        placeholder={t("PT_COMMONS_SELECT_PLACEHOLDER")}
                      />
                    </LabelFieldPair>

                    {/* Units in this floor */}
                    {floor.units.map((unit, unitIndex) => {
                      const unitKey = `${unit.id}_${renderKey}_${floorsData?.[floorIndex]?.units?.[unitIndex]?.usageType?.code || 'no-usage'}`;
                      return (
                        <Fragment key={unitKey}>
                          {renderUnitFields(floorIndex, unitIndex, false)}
                        </Fragment>
                      );
                    })}

                    {/* Add Unit Button */}
                    <div>
                      <Button
                        label={t("PT_COMMON_ADD_UNIT")}
                        variation="secondary"
                        onClick={() => handleAddUnit(floorIndex)}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* SHAREDPROPERTY: Show only units with floor selection */}
        {isShared && (
          <div>
            {units.map((unit, unitIndex) => {
              const unitKey = `shared_${unitIndex}_${renderKey}_${unitsData?.[unitIndex]?.usageType?.code || 'no-usage'}`;
              return (
                <Fragment key={unitKey}>
                  {renderUnitFields(null, unitIndex, true)}
                </Fragment>
              );
            })}

            {/* Add Unit Button */}
            <div style={{ marginTop: "1rem" }}>
              <Button
                label={t("PT_COMMON_ADD_UNIT")}
                variation="secondary"
                onClick={handleAddSharedUnit}
              />
            </div>
          </div>
        )}
      </Card>
    </>
  );
};

export default PTAssessmentDetails;
