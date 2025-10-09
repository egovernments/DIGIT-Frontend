import React, { useState, useEffect, Fragment } from "react";
import { Card, HeaderComponent, LabelFieldPair, Dropdown, TextInput, ErrorMessage, CardLabel, Button, Toast } from "@egovernments/digit-ui-components";

const PTAssessmentDetails = ({ t, config, onSelect, formData = {}, errors, userType, register }) => {
  // Get propertyType and usageCategory from parent form data
  const propertyType = formData?.propertyType;
  const usageCategory = formData?.usageCategory;

  // Mono-ui logic: Determine fields based on property type code
  // 1. VACANT: Show only plot size in sq yards
  // 2. INDEPENDENTPROPERTY: Show plot size + no. of floors, then generate floor cards with units
  // 3. SHAREDPROPERTY: Show only unit details with floor selection

  const propertyTypeCode = propertyType?.[0]?.code || "";
  const usageCategoryCode = usageCategory?.[0]?.code || "";

  const isVacant = propertyTypeCode === "VACANT";
  const isIndependent = propertyTypeCode === "INDEPENDENTPROPERTY";
  const isShared = propertyTypeCode === "SHAREDPROPERTY";

  // State for managing floors and units
  const [floors, setFloors] = useState([]);
  const [floorsData, setFloorsData] = useState(formData?.conditionalFields?.floors || []);
  const [units, setUnits] = useState(formData?.conditionalFields?.units || []);
  const [unitsData, setUnitsData] = useState(formData?.conditionalFields?.units || []);
  const [plotSize, setPlotSize] = useState(formData?.conditionalFields?.plotSize || "");
  const [previousUsageCategory, setPreviousUsageCategory] = useState(null);
  const [previousPropertyType, setPreviousPropertyType] = useState(null);
  const [renderKey, setRenderKey] = useState(0);

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [showToast, setShowToast] = useState(null);

  // MDMS data for dropdowns
  const { data: mdmsData } = Digit.Hooks.useCommonMDMS(tenantId, "PropertyTax", [
    "UsageCategoryDetail",
    "UsageCategorySubMinor",
    "UsageCategoryMinor",
    "OccupancyType",
    "UsageCategoryMajor",
    "Floor"
  ]);

  const usageCategoryDetailData = mdmsData?.PropertyTax?.UsageCategoryDetail || [];
  const usageCategorySubMinorData = mdmsData?.PropertyTax?.UsageCategorySubMinor || [];
  const usageCategoryMinorData = mdmsData?.PropertyTax?.UsageCategoryMinor || [];
  const occupancyData = mdmsData?.PropertyTax?.OccupancyType || [];
  const usageCategoryMajorData = mdmsData?.PropertyTax?.UsageCategoryMajor || [];
  const floorMasterData = mdmsData?.PropertyTax?.Floor || [];

  // Filter sub usage type based on selected usage category (matching mono-ui logic)
  const getFilteredSubUsageType = () => {
    if (!usageCategoryCode) return [];

    // Get the minor category for the selected major category
    const usageCategoryMinor = usageCategoryMinorData.find(
      minor => minor.code === usageCategoryCode
    );

    if (!usageCategoryMinor) return [];

    // Filter UsageCategorySubMinor based on usageCategoryMinor
    const filteredSubMinor = usageCategorySubMinorData.filter(
      subMinor => subMinor.usageCategoryMinor === usageCategoryMinor.code
    );

    if (filteredSubMinor.length === 0) return [];

    // Filter UsageCategoryDetail based on filtered SubMinor
    const subMinorCodes = filteredSubMinor.map(sm => sm.code);
    const filteredDetails = usageCategoryDetailData.filter(
      detail => subMinorCodes.includes(detail.usageCategorySubMinor)
    );

    // Merge SubMinor and Detail data
    const merged = [
      ...filteredSubMinor.map(sm => ({
        code: sm.code,
        name: sm.name,
        i18nKey: sm.code,
        usageCategorySubMinor: sm.code
      })),
      ...filteredDetails.map(detail => ({
        code: detail.code,
        name: detail.name,
        i18nKey: detail.code,
        usageCategorySubMinor: detail.usageCategorySubMinor
      }))
    ];

    // Remove duplicates
    const uniqueData = merged.reduce((acc, current) => {
      const exists = acc.find(item => item.code === current.code);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);

    return uniqueData;
  };

  const subUsageTypeData = getFilteredSubUsageType();

  const floorCountOptions = Array.from({ length: 25 }, (_, i) => ({
    code: (i + 1).toString(),
    name: (i + 1).toString(),
    i18nKey: (i + 1).toString()
  }));

  const floorOptions = [
    { code: "-1", name: "Basement", i18nKey: "PROPERTYTAX_FLOOR_BASEMENT" },
    { code: "0", name: "Ground Floor", i18nKey: "PROPERTYTAX_FLOOR_GROUNDFLOOR" },
    ...Array.from({ length: 15 }, (_, i) => ({
      code: (i + 1).toString(),
      name: `Floor ${i + 1}`,
      i18nKey: `PROPERTYTAX_FLOOR_${i + 1}`
    }))
  ];

  // Sync all data to parent under "conditionalFields" key whenever any field changes
  useEffect(() => {
    const allData = {
      plotSize,
      noOfFloors: formData?.conditionalFields?.noOfFloors,
      floors: floorsData,
      units: unitsData
    };
    onSelect("conditionalFields", allData);
  }, [plotSize, floorsData, unitsData, formData?.conditionalFields?.noOfFloors]);

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
  useEffect(() => {
    if (isIndependent && floorsData.length > 0 && floors.length === 0) {
      const initialFloors = floorsData.map((floorData, i) => ({
        floorNumber: i,
        units: (floorData.units || []).map((_, unitIdx) => ({ id: `floor_${i}_unit_${unitIdx}` }))
      }));
      setFloors(initialFloors);
    }
  }, [floorsData, isIndependent]);

  // Initialize shared property with one unit if none exist
  useEffect(() => {
    if (isShared && units.length === 0) {
      setUnits([{}]);
      handleFieldChange("units", [{}]);
    }
  }, [isShared]);

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
    handleFieldChange("noOfFloors", value);
    const floorCount = parseInt(value?.code || value);

    // Generate floor cards based on floor count
    const newFloors = Array.from({ length: floorCount }, (_, i) => ({
      floorNumber: i,
      units: [{ id: `floor_${i}_unit_0` }] // Each floor starts with one unit
    }));

    setFloors(newFloors);

    // Initialize units array
    const initialUnits = newFloors.map((floor, floorIdx) => ({
      floorNo: floorIdx.toString(),
      units: [{}]
    }));

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

    // Update formData with the new unit structure
    const currentFloorData = formData?.floors?.[floorIndex] || { floorNo: floorIndex.toString(), units: [] };
    const updatedUnits = [...(currentFloorData.units || []), {}];
    handleFieldChange(`floors[${floorIndex}].units`, updatedUnits);
  };

  // Remove unit from a specific floor
  const handleRemoveUnit = (floorIndex, unitIndex) => {
    const newFloors = [...floors];
    if (newFloors[floorIndex].units.length > 1) {
      newFloors[floorIndex].units.splice(unitIndex, 1);
      setFloors(newFloors);

      // Update formData after removing unit
      const currentFloorData = formData?.floors?.[floorIndex] || { floorNo: floorIndex.toString(), units: [] };
      const updatedUnits = (currentFloorData.units || []).filter((_, idx) => idx !== unitIndex);
      handleFieldChange(`floors[${floorIndex}].units`, updatedUnits);
    }
  };

  // Add unit for Shared property
  const handleAddSharedUnit = () => {
    setUnits([...units, {}]);
    handleFieldChange("units", [...units, {}]);
  };

  // Remove unit for Shared property
  const handleRemoveSharedUnit = (unitIndex) => {
    if (units.length > 1) {
      const newUnits = units.filter((_, idx) => idx !== unitIndex);
      setUnits(newUnits);
      handleFieldChange("units", newUnits);
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

    // Find the minor category for the selected unit usage type
    const usageCategoryMinor = usageCategoryMinorData.find(
      minor => minor.code === unitUsageTypeCode
    );

    if (!usageCategoryMinor) return [];

    // Filter UsageCategorySubMinor based on usageCategoryMinor
    const filteredSubMinor = usageCategorySubMinorData.filter(
      subMinor => subMinor.usageCategoryMinor === usageCategoryMinor.code
    );

    if (filteredSubMinor.length === 0) return [];

    // Filter UsageCategoryDetail based on filtered SubMinor
    const subMinorCodes = filteredSubMinor.map(sm => sm.code);
    const filteredDetails = usageCategoryDetailData.filter(
      detail => subMinorCodes.includes(detail.usageCategorySubMinor)
    );

    // Merge SubMinor and Detail data
    const merged = [
      ...filteredSubMinor.map(sm => ({
        code: sm.code,
        name: sm.name,
        i18nKey: sm.code,
        usageCategorySubMinor: sm.code
      })),
      ...filteredDetails.map(detail => ({
        code: detail.code,
        name: detail.name,
        i18nKey: detail.code,
        usageCategorySubMinor: detail.usageCategorySubMinor
      }))
    ];

    // Remove duplicates
    return merged.reduce((acc, current) => {
      const exists = acc.find(item => item.code === current.code);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);
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
              option={floorOptions}
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
          <LabelFieldPair style={{ marginBottom: "8px" }}>
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
              optionKey="code"
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
      const message = `${t("PT_VALIDATION_MISSING_FIELDS") || "Please fill all mandatory fields"}`;
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
                        option={floorMasterData || []}
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
