import React, { useEffect, useState, useMemo } from "react";
import { Dropdown, Loader, ErrorMessage } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";

const HierarchyDropdown = (props) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  // Support both direct props and FormComposerV2 config structure
  const config = props?.config || {};
  const populators = config?.populators || {};

  // Extract props - check populators first, then config, then direct props
  const hierarchyType = populators?.hierarchyType || config?.hierarchyType || props?.hierarchyType;
  const highestHierarchy = populators?.highestHierarchy || config?.highestHierarchy || props?.highestHierarchy;
  const lowestHierarchy = populators?.lowestHierarchy || config?.lowestHierarchy || props?.lowestHierarchy;
  const autoSelect = populators?.autoSelect !== undefined ? populators.autoSelect
    : (config?.autoSelect !== undefined ? config.autoSelect
    : (props?.autoSelect !== undefined ? props.autoSelect : false));
  const preSelected = populators?.preSelected || config?.preSelected || props?.preSelected || {};

  // Extract required prop for validation
  const isRequired = populators?.required !== undefined ? populators.required
    : (config?.required !== undefined ? config.required
    : (props?.required !== undefined ? props.required : false));

  const onChange = props?.onChange;
  const setValue = props?.setValue;
  const setError = props?.setError;
  const clearErrors = props?.clearErrors;
  const formState = props?.formState;
  const errors = props?.errors;

  const fieldName = populators?.name || config?.name || "hierarchyDropdown";

  const existingFormData = props?.data?.[fieldName];

  const [selectedValues, setSelectedValues] = useState({});
  const [levelOptions, setLevelOptions] = useState({});
  // Flag to track if we've initialized/restored data
  const [hasInitialized, setHasInitialized] = useState(false);
  // Track validation error state
  const [validationError, setValidationError] = useState(null);

  // Fetch hierarchy definition (order of levels)
  const hierarchyDefReq = {
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    changeQueryName: `hierarchyDef_${hierarchyType}`,
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId: tenantId,
        limit: 10,
        offset: 0,
        hierarchyType: hierarchyType,
      },
    },
    config: {
      enabled: !!hierarchyType,
      select: (data) => data?.BoundaryHierarchy?.[0]?.boundaryHierarchy || [],
    },
  };

  const {
    isLoading: hierarchyDefLoading,
    data: hierarchyDef,
  } = Digit.Hooks.useCustomAPIHook(hierarchyDefReq);

  // Fetch boundary relationships (actual boundary data with parent-child)
  const boundaryRelReq = {
    url: `/boundary-service/boundary-relationships/_search`,
    changeQueryName: `boundaryRel_${hierarchyType}`,
    params: {
      tenantId: tenantId,
      hierarchyType: hierarchyType,
      includeChildren: true,
    },
    body: {},
    config: {
      enabled: !!hierarchyType,
      select: (data) => {
        // Process hierarchy and attach paths
        const processHierarchy = (nodes, parentPath = "") => {
          return nodes.map((node) => {
            const currentPath = parentPath ? `${parentPath}.${node.code}` : node.code;
            if (node.children && node.children.length > 0) {
              node.children = processHierarchy(node.children, currentPath);
            }
            return { ...node, path: currentPath };
          });
        };
        return processHierarchy(data?.TenantBoundary?.[0]?.boundary || []);
      },
    },
  };

  const {
    isLoading: boundaryLoading,
    data: boundaryData,
  } = Digit.Hooks.useCustomAPIHook(boundaryRelReq);

  // Get levels to display (between highest and lowest)
  const displayLevels = useMemo(() => {
    if (!hierarchyDef) return [];

    const highestIndex = hierarchyDef.findIndex(
      (item) => item?.boundaryType === highestHierarchy
    );
    const lowestIndex = hierarchyDef.findIndex(
      (item) => item?.boundaryType === lowestHierarchy
    );

    if (highestIndex === -1 || lowestIndex === -1) return [];

    return hierarchyDef.slice(highestIndex, lowestIndex + 1);
  }, [hierarchyDef, highestHierarchy, lowestHierarchy]);

  // Validate that all levels are selected when required
  const validateAllLevelsSelected = (values, levels) => {
    if (!isRequired || levels.length === 0) return true;

    // Check if all levels have a selected value
    for (const level of levels) {
      if (!values[level.boundaryType]) {
        return false;
      }
    }
    return true;
  };

  // Get missing levels for error message
  const getMissingLevels = (values, levels) => {
    const missing = [];
    for (const level of levels) {
      if (!values[level.boundaryType]) {
        missing.push(level.boundaryType);
      }
    }
    return missing;
  };

  // Validate on form submission (when isSubmitting becomes true)
  useEffect(() => {
    if (!isRequired || displayLevels.length === 0) return;
    if (!formState?.isSubmitting) return;

    const isValid = validateAllLevelsSelected(selectedValues, displayLevels);

    if (!isValid) {
      const errorMessage = t("SELECT_ALL_HIERARCHY_LEVELS");
      setValidationError(errorMessage);

      // Set error in form state if setError is available - this should block form submission
      if (setError) {
        setError(fieldName, {
          type: "required",
          message: errorMessage,
        });
      }
    } else {
      setValidationError(null);
      if (clearErrors) {
        clearErrors(fieldName);
      }
    }
  }, [formState?.isSubmitting, selectedValues, displayLevels, isRequired, fieldName, setError, clearErrors, t]);

  // Clear error when all levels are selected
  useEffect(() => {
    if (!isRequired || displayLevels.length === 0) return;

    const isValid = validateAllLevelsSelected(selectedValues, displayLevels);
    if (isValid && validationError) {
      setValidationError(null);
      if (clearErrors) {
        clearErrors(fieldName);
      }
    }
  }, [selectedValues, displayLevels, isRequired, validationError, fieldName, clearErrors]);

  // Check if parent form has errors for this field
  const hasParentError = errors && errors[fieldName];

  // Find children of a node by path
  const findChildrenByPath = (nodes, targetPath) => {
    if (!nodes || nodes.length === 0) return [];

    for (const node of nodes) {
      if (node.path === targetPath) {
        return node.children?.map((child) => ({
          code: child.code,
          name: t(child.code),
          path: child.path,
          boundaryType: child.boundaryType,
        })) || [];
      }
      if (node.children && node.children.length > 0) {
        const result = findChildrenByPath(node.children, targetPath);
        if (result.length > 0) return result;
      }
    }
    return [];
  };

  // Find root level options
  const findRootOptions = (nodes, boundaryType) => {
    if (!nodes || nodes.length === 0) return [];

    // If first node matches the boundaryType, return it
    if (nodes[0]?.boundaryType === boundaryType) {
      return nodes.map((node) => ({
        code: node.code,
        name: t(node.code),
        path: node.path,
        boundaryType: node.boundaryType,
      }));
    }

    // Otherwise search in children
    let results = [];
    for (const node of nodes) {
      if (node.children) {
        results = [...results, ...findRootOptions(node.children, boundaryType)];
      }
    }
    return results;
  };

  // Helper function to find a node by code in the boundary tree
  const findNodeByCode = (nodes, code) => {
    if (!nodes || nodes.length === 0) return null;

    for (const node of nodes) {
      if (node.code === code) {
        return {
          code: node.code,
          name: t(node.code),
          path: node.path,
          boundaryType: node.boundaryType,
        };
      }
      if (node.children && node.children.length > 0) {
        const result = findNodeByCode(node.children, code);
        if (result) return result;
      }
    }
    return null;
  };

  useEffect(() => {
    if (hasInitialized) return;
    if (!boundaryData || !hierarchyDef || displayLevels.length === 0) return;

    const highestLevelType = displayLevels[0]?.boundaryType;
    const rootOptions = findRootOptions(boundaryData, highestLevelType);

    // Check if we have existing form data to restore
    if (existingFormData && typeof existingFormData === 'object' && Object.keys(existingFormData).length > 0) {
      const newSelectedValues = {};
      const newLevelOptions = { [highestLevelType]: rootOptions };
      let hasValues = false;

      displayLevels.forEach((level, index) => {
        const existingValue = existingFormData[level.boundaryType];
        if (existingValue) {
          const code = typeof existingValue === 'string' ? existingValue : existingValue.code;
          if (code) {
            let selectedOption = newLevelOptions[level.boundaryType]?.find((opt) => opt.code === code);

            if (!selectedOption) {
              selectedOption = findNodeByCode(boundaryData, code);
            }

            if (selectedOption) {
              newSelectedValues[level.boundaryType] = selectedOption;
              hasValues = true;

              if (index < displayLevels.length - 1) {
                const nextLevel = displayLevels[index + 1];
                const children = findChildrenByPath(boundaryData, selectedOption.path);
                newLevelOptions[nextLevel.boundaryType] = children;
              }
            }
          }
        }
      });

      if (hasValues) {
        setLevelOptions(newLevelOptions);
        setSelectedValues(newSelectedValues);
        setHasInitialized(true);
        return;
      }
    }

    if (!autoSelect) {
      setLevelOptions({ [highestLevelType]: rootOptions });
      setHasInitialized(true);
      return;
    }

    const newSelectedValues = {};
    const newLevelOptions = { [highestLevelType]: rootOptions };

    if (rootOptions && rootOptions.length > 0) {
      const firstOption = rootOptions[0];
      newSelectedValues[highestLevelType] = firstOption;

      if (displayLevels.length > 1) {
        const nextLevel = displayLevels[1];
        const children = findChildrenByPath(boundaryData, firstOption.path);
        newLevelOptions[nextLevel.boundaryType] = children;
      }
    }

    setLevelOptions(newLevelOptions);
    setSelectedValues(newSelectedValues);
    setHasInitialized(true);

    if (onChange && Object.keys(newSelectedValues).length > 0) {
      onChange(newSelectedValues);
    }
  }, [boundaryData, hierarchyDef, displayLevels, autoSelect, existingFormData, hasInitialized]);

  const handleSelect = (level, levelIndex, selected) => {
    const newSelectedValues = { ...selectedValues };

    displayLevels.slice(levelIndex).forEach((lvl) => {
      delete newSelectedValues[lvl.boundaryType];
    });

    newSelectedValues[level.boundaryType] = selected;
    setSelectedValues(newSelectedValues);

    if (levelIndex < displayLevels.length - 1) {
      const nextLevel = displayLevels[levelIndex + 1];
      const children = findChildrenByPath(boundaryData, selected.path);

      setLevelOptions((prev) => {
        const newOptions = { ...prev };
        // Clear options for levels below the next level
        displayLevels.slice(levelIndex + 2).forEach((lvl) => {
          delete newOptions[lvl.boundaryType];
        });
        newOptions[nextLevel.boundaryType] = children;
        return newOptions;
      });
    }

    // Update form state using setValue (this persists the data)
    if (setValue) {
      setValue(fieldName, newSelectedValues);
    }

    if (onChange) {
      onChange(newSelectedValues);
    }
  };

  // Handle preSelected values - only applies if preSelected has values and not already initialized
  useEffect(() => {
    if (hasInitialized) return;
    if (!preSelected || Object.keys(preSelected).length === 0) return;
    if (!boundaryData || displayLevels.length === 0) return;
    if (Object.keys(levelOptions).length === 0) return; // Wait for options to be loaded first

    const newSelectedValues = {};
    const newLevelOptions = { ...levelOptions };

    displayLevels.forEach((level, index) => {
      const preSelectedCode = preSelected[level.boundaryType];
      if (preSelectedCode) {
        const options = newLevelOptions[level.boundaryType] || [];
        let selectedOption = options.find((opt) => opt.code === preSelectedCode);

        if (!selectedOption) {
          selectedOption = findNodeByCode(boundaryData, preSelectedCode);
        }

        if (selectedOption) {
          newSelectedValues[level.boundaryType] = selectedOption;

          if (index < displayLevels.length - 1) {
            const nextLevel = displayLevels[index + 1];
            const children = findChildrenByPath(boundaryData, selectedOption.path);
            newLevelOptions[nextLevel.boundaryType] = children;
          }
        }
      }
    });

    if (Object.keys(newSelectedValues).length > 0) {
      setSelectedValues(newSelectedValues);
      setLevelOptions(newLevelOptions);
    }
  }, [preSelected, boundaryData, displayLevels, levelOptions, hasInitialized]);

  if (hierarchyDefLoading || boundaryLoading) {
    return <Loader />;
  }

  if (!hierarchyDef || !boundaryData) {
    return <div>{t("NO_HIERARCHY_DATA")}</div>;
  }

  if (displayLevels.length === 0) {
    return <div>{t("INVALID_HIERARCHY_LEVELS")}</div>;
  }

  // Check if validation has been triggered (either by submit or parent error)
  const showValidationErrors = validationError || hasParentError || formState?.isSubmitting || formState?.isSubmitted;

  // Check if a specific level has error (required but not selected after form submission)
  const hasLevelError = (level) => {
    if (!isRequired || !showValidationErrors) return false;
    return !selectedValues[level.boundaryType];
  };

  return (
    <div className="hierarchy-dropdown-container">
      {displayLevels.map((level, index) => {
        const options = levelOptions[level.boundaryType] || [];
        const selected = selectedValues[level.boundaryType] || null;
        const isDisabled = index > 0 && !selectedValues[displayLevels[index - 1]?.boundaryType];
        const showError = hasLevelError(level) && !isDisabled;

        return (
          <div key={level.boundaryType} className="hierarchy-dropdown-item" style={{ marginBottom: "16px" }}>
            <Dropdown
              option={options}
              optionKey="name"
              selected={selected}
              select={(value) => handleSelect(level, index, value)}
              placeholder={t("SELECT") + " " + t(level.boundaryType)}
              disabled={isDisabled}
              t={t}
              variant={showError ? "digit-field-error" : ""}
            />
            {showError && (
              <ErrorMessage
                style={{ fontStyle: "normal", color: "#D4351C", marginTop: "4px" }}
                message={t("REQUIRED_FIELD")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HierarchyDropdown;
