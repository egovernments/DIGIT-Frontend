import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
import { Loader, Button, Toast, Card, LabelFieldPair, CardLabel, TextInput, DatePicker, Dropdown } from "@egovernments/digit-ui-components";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";

const DeliveryCyclesComponent = (props) => {
  const { t } = useTranslation();
  const url = getProjectServiceUrl();
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [cycles, setCycles] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedCycle, setExpandedCycle] = useState(null);
  
  // MDMS data for operators, attributes and products
  const [operatorConfig, setOperatorConfig] = useState([]);
  const [attributeConfig, setAttributeConfig] = useState([]);
  const [productVariants, setProductVariants] = useState([]);

  // Fetch project data
  const fetchProjectData = async () => {
    setIsLoading(true);
    try {
      const response = await Digit.CustomService.getResponse({
        url: `${url}/v1/_search`,
        params: {
          tenantId,
          offset: 0,
          limit: 100,
        },
        body: {
          Projects: [
            {
              tenantId,
              id: props.projectId,
            },
          ],
          apiOperation: "SEARCH",
        },
      });

      if (response?.Project?.[0]) {
        const project = response.Project[0];
        setProjectData(project);
        
        // Extract cycles from project data
        const projectCycles = project?.additionalDetails?.projectType?.cycles || [];
        setCycles(JSON.parse(JSON.stringify(projectCycles))); // Deep clone
      }
    } catch (error) {
      console.error("Error fetching project data:", error);
      setShowToast({ key: "error", label: t("ERROR_FETCHING_PROJECT_DATA") });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (props.projectId) {
      fetchProjectData();
    }
  }, [props.projectId]);

  // Fetch MDMS data for operators and product variants
  useEffect(() => {
    fetchMDMSData();
  }, []);

  const fetchMDMSData = async () => {
    try {
      // Fetch operators config
      const operatorResponse = await Digit.CustomService.getResponse({
        url: `/mdms-v2/v1/_search`,
        body: {
          MdmsCriteria: {
            tenantId,
            moduleDetails: [
              {
                moduleName: "HCM-ADMIN-CONSOLE",
                masterDetails: [
                  {
                    name: "operatorConfig"
                  }
                ]
              }
            ]
          }
        }
      });

      if (operatorResponse?.MdmsRes?.["HCM-ADMIN-CONSOLE"]?.operatorConfig) {
        setOperatorConfig(operatorResponse.MdmsRes["HCM-ADMIN-CONSOLE"].operatorConfig);
      } else {
        // Fallback to static config
        setOperatorConfig([
          { code: "GREATER_THAN_EQUAL_TO", name: "Greater than or equal to (≥)" },
          { code: "GREATER_THAN", name: "Greater than (>)" },
          { code: "LESSER_THAN_EQUAL_TO", name: "Less than or equal to (≤)" },
          { code: "LESS_THAN", name: "Less than (<)" },
          { code: "EQUAL_TO", name: "Equal to (=)" },
          { code: "IN_BETWEEN", name: "In between" }
        ]);
      }

      // Fetch attribute config
      const attributeResponse = await Digit.CustomService.getResponse({
        url: `/mdms-v2/v1/_search`,
        body: {
          MdmsCriteria: {
            tenantId,
            moduleDetails: [
              {
                moduleName: "HCM-ADMIN-CONSOLE",
                masterDetails: [
                  {
                    name: "attributeConfig"
                  }
                ]
              }
            ]
          }
        }
      });

      if (attributeResponse?.MdmsRes?.["HCM-ADMIN-CONSOLE"]?.attributeConfig) {
        setAttributeConfig(attributeResponse.MdmsRes["HCM-ADMIN-CONSOLE"].attributeConfig);
      } else {
        // Fallback attribute config
        setAttributeConfig([
          { code: "AGE", name: "Age", dataType: "number", allowFormula: true },
          { code: "GENDER", name: "Gender", dataType: "select", options: ["MALE", "FEMALE", "OTHER"] },
          { code: "WEIGHT", name: "Weight (kg)", dataType: "number", allowFormula: true },
          { code: "HEIGHT", name: "Height (cm)", dataType: "number", allowFormula: true },
          { code: "MEMBER_COUNT", name: "Member Count", dataType: "number" },
          { code: "HOUSEHOLD_SIZE", name: "Household Size", dataType: "number" },
          { code: "PREGNANT", name: "Is Pregnant", dataType: "boolean" },
          { code: "LACTATING", name: "Is Lactating", dataType: "boolean" }
        ]);
      }

      // Fetch product variants
      const productResponse = await Digit.CustomService.getResponse({
        url: `/mdms-v2/v1/_search`,
        body: {
          MdmsCriteria: {
            tenantId,
            moduleDetails: [
              {
                moduleName: "PRODUCT",
                masterDetails: [
                  {
                    name: "ProductVariant"
                  }
                ]
              }
            ]
          }
        }
      });

      if (productResponse?.MdmsRes?.PRODUCT?.ProductVariant) {
        setProductVariants(productResponse.MdmsRes.PRODUCT.ProductVariant.map(variant => ({
          code: variant.id || variant.code,
          name: variant.name || variant.variation,
          ...variant
        })));
      }
    } catch (error) {
      console.error("Error fetching MDMS data:", error);
      // Set fallback configs
      setOperatorConfig([
        { code: "GREATER_THAN_EQUAL_TO", name: "Greater than or equal to (≥)" },
        { code: "GREATER_THAN", name: "Greater than (>)" },
        { code: "LESSER_THAN_EQUAL_TO", name: "Less than or equal to (≤)" },
        { code: "LESS_THAN", name: "Less than (<)" },
        { code: "EQUAL_TO", name: "Equal to (=)" },
        { code: "IN_BETWEEN", name: "In between" }
      ]);
      setAttributeConfig([
        { code: "AGE", name: "Age", dataType: "number", allowFormula: true },
        { code: "GENDER", name: "Gender", dataType: "select", options: ["MALE", "FEMALE", "OTHER"] },
        { code: "WEIGHT", name: "Weight (kg)", dataType: "number", allowFormula: true },
        { code: "HEIGHT", name: "Height (cm)", dataType: "number", allowFormula: true },
        { code: "MEMBER_COUNT", name: "Member Count", dataType: "number" },
        { code: "HOUSEHOLD_SIZE", name: "Household Size", dataType: "number" },
        { code: "PREGNANT", name: "Is Pregnant", dataType: "boolean" },
        { code: "LACTATING", name: "Is Lactating", dataType: "boolean" }
      ]);
    }
  };

  // Common formula templates for quick selection
  const getFormulaTemplates = () => {
    return [
      { 
        name: "Member-based Tiered Delivery", 
        formula: "IF(memberCount <= 2, 1, IF(memberCount <= 6, 3, 6))",
        description: "≤2 members: 1 unit, 3-6 members: 3 units, >6 members: 6 units"
      },
      { 
        name: "Basic Count Formula", 
        formula: "MIN(CEIL(memberCount/2), 4)",
        description: "Minimum of half member count (rounded up) and 4"
      },
      { 
        name: "Linear Member Scale", 
        formula: "MIN(MAX(CEIL(memberCount/2), 1), 10)",
        description: "Half member count, minimum 1, maximum 10"
      },
      { 
        name: "Age-based Formula", 
        formula: "IF(age >= 18, 2, 1)",
        description: "2 units for adults, 1 for children"
      },
      { 
        name: "Weight-based Formula", 
        formula: "CEIL(weight/10)",
        description: "Units based on weight divided by 10"
      },
      { 
        name: "BMI Calculation", 
        formula: "weight / POW(height/100, 2)",
        description: "Body Mass Index calculation"
      },
      { 
        name: "Stepped Household Distribution", 
        formula: "IF(householdSize <= 3, 1, IF(householdSize <= 7, 2, IF(householdSize <= 12, 4, 6)))",
        description: "1-3: 1 unit, 4-7: 2 units, 8-12: 4 units, >12: 6 units"
      },
      { 
        name: "Gender Conditional", 
        formula: "IF(gender == 'FEMALE' && age >= 15 && age <= 49, 2, 1)",
        description: "2 units for women of reproductive age, 1 otherwise"
      },
      { 
        name: "Complex Multi-factor", 
        formula: "MIN(MAX(CEIL(age/10), 1), 5) * IF(pregnant == true, 1.5, 1)",
        description: "Age-based with pregnancy multiplier"
      },
      { 
        name: "Progressive Member Allocation", 
        formula: "IF(memberCount == 1, 1, IF(memberCount <= 4, 2, IF(memberCount <= 8, 4, MIN(CEIL(memberCount/2), 12))))",
        description: "1 member: 1, 2-4: 2, 5-8: 4, 9+: half count (max 12)"
      }
    ];
  };

  // Formula builder state management
  const [showFormulaBuilder, setShowFormulaBuilder] = useState(false);
  const [formulaBuilderMode, setFormulaBuilderMode] = useState('simple'); // 'simple' or 'advanced'

  // Initialize condition builder structure
  const createNewCondition = () => ({
    id: Date.now() + Math.random(),
    attribute: null,
    operator: null,
    value: '',
    fromValue: '',
    toValue: ''
  });

  const createNewConditionGroup = () => ({
    id: Date.now() + Math.random(),
    logicalOperator: 'AND', // 'AND' or 'OR'
    conditions: [createNewCondition()]
  });

  // Convert condition builder to formula string
  const convertBuilderToFormula = (conditionGroups) => {
    if (!conditionGroups || conditionGroups.length === 0) {
      return '';
    }

    const groupFormulas = conditionGroups.map(group => {
      const conditionFormulas = group.conditions
        .filter(condition => condition.attribute && condition.operator)
        .map(condition => {
          const attr = condition.attribute.code;
          const op = condition.operator.code;
          
          switch (op) {
            case 'GREATER_THAN':
              return `${attr} > ${condition.value}`;
            case 'GREATER_THAN_EQUAL_TO':
              return `${attr} >= ${condition.value}`;
            case 'LESS_THAN':
              return `${attr} < ${condition.value}`;
            case 'LESSER_THAN_EQUAL_TO':
              return `${attr} <= ${condition.value}`;
            case 'EQUAL_TO':
              return condition.attribute.dataType === 'select' || condition.attribute.dataType === 'boolean' 
                ? `${attr} == '${condition.value}'` 
                : `${attr} == ${condition.value}`;
            case 'IN_BETWEEN':
              return `(${attr} >= ${condition.fromValue} && ${attr} <= ${condition.toValue})`;
            default:
              return `${attr} >= ${condition.value}`;
          }
        });

      if (conditionFormulas.length === 0) return '';
      if (conditionFormulas.length === 1) return conditionFormulas[0];
      
      const operator = group.logicalOperator === 'OR' ? ' || ' : ' && ';
      return `(${conditionFormulas.join(operator)})`;
    }).filter(formula => formula);

    if (groupFormulas.length === 0) return '';
    if (groupFormulas.length === 1) return `IF(${groupFormulas[0]}, 1, 0)`;
    
    return `IF(${groupFormulas.join(' || ')}, 1, 0)`;
  };

  // Parse formula string back to builder (basic implementation)
  const parseFormulaToBuilder = (formula) => {
    // This is a simplified parser - in production, you'd want a more robust solution
    if (!formula || typeof formula !== 'string') {
      return [createNewConditionGroup()];
    }

    // For now, return default structure
    return [createNewConditionGroup()];
  };

  // Validate formula syntax (basic validation)
  const validateFormula = (formula) => {
    if (!formula || typeof formula !== 'string') {
      return { isValid: false, error: 'Formula is required' };
    }
    
    // Check for balanced parentheses
    let openCount = 0;
    for (let char of formula) {
      if (char === '(') openCount++;
      if (char === ')') openCount--;
      if (openCount < 0) {
        return { isValid: false, error: 'Unmatched closing parenthesis' };
      }
    }
    
    if (openCount > 0) {
      return { isValid: false, error: 'Unmatched opening parenthesis' };
    }
    
    // Check for valid function names and operators
    const validPattern = /^[a-zA-Z_][a-zA-Z0-9_]*|[0-9]+\.?[0-9]*|[+\-*/()\s<>=!&|,.'"]/;
    const invalidChars = formula.split('').filter(char => 
      !validPattern.test(char) && !/[a-zA-Z0-9+\-*/()\s<>=!&|,.'"_]/.test(char)
    );
    
    if (invalidChars.length > 0) {
      return { isValid: false, error: `Invalid characters: ${[...new Set(invalidChars)].join(', ')}` };
    }
    
    return { isValid: true };
  };

  // Handle cycle field changes
  const handleCycleChange = (cycleIndex, field, value) => {
    const updatedCycles = [...cycles];
    
    if (field === 'startDate' || field === 'endDate') {
      // Convert date to epoch if it's a Date object
      const epochValue = value instanceof Date ? value.getTime() : value;
      updatedCycles[cycleIndex] = {
        ...updatedCycles[cycleIndex],
        [field]: epochValue
      };
    } else if (field.includes('.')) {
      // Handle nested fields like delivery.0.mandatoryWaitSinceLastDeliveryInDays
      const fields = field.split('.');
      if (fields[0] === 'deliveries' && fields[2]) {
        const deliveryIndex = parseInt(fields[1]);
        if (fields[2] === 'doseCriteria' && fields[3]) {
          // Handle dose criteria updates
          const criteriaIndex = parseInt(fields[3]);
          const criteriaField = fields[4];
          if (!updatedCycles[cycleIndex].deliveries[deliveryIndex].doseCriteria) {
            updatedCycles[cycleIndex].deliveries[deliveryIndex].doseCriteria = [];
          }
          if (criteriaField === 'ProductVariants' && fields[5]) {
            // Handle product variants array
            const variantIndex = parseInt(fields[5]);
            const variantField = fields[6];
            updatedCycles[cycleIndex].deliveries[deliveryIndex].doseCriteria[criteriaIndex].ProductVariants[variantIndex] = {
              ...updatedCycles[cycleIndex].deliveries[deliveryIndex].doseCriteria[criteriaIndex].ProductVariants[variantIndex],
              [variantField]: value
            };
          } else if (criteriaField) {
            updatedCycles[cycleIndex].deliveries[deliveryIndex].doseCriteria[criteriaIndex] = {
              ...updatedCycles[cycleIndex].deliveries[deliveryIndex].doseCriteria[criteriaIndex],
              [criteriaField]: value
            };
          }
        } else {
          updatedCycles[cycleIndex].deliveries[deliveryIndex] = {
            ...updatedCycles[cycleIndex].deliveries[deliveryIndex],
            [fields[2]]: value
          };
        }
      }
    } else {
      updatedCycles[cycleIndex] = {
        ...updatedCycles[cycleIndex],
        [field]: value
      };
    }
    
    setCycles(updatedCycles);
  };

  // Add new cycle
  const addNewCycle = () => {
    const newCycle = {
      id: `cycle-${Date.now()}`,
      startDate: Date.now(),
      endDate: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
      active: true,
      deliveries: [
        {
          id: `delivery-${Date.now()}`,
          active: true,
          deliveryStrategy: "DIRECT",
          mandatoryWaitSinceLastDeliveryInDays: 0,
          doseCriteria: []
        }
      ]
    };
    setCycles([...cycles, newCycle]);
  };

  // Remove cycle
  const removeCycle = (cycleIndex) => {
    const updatedCycles = cycles.filter((_, index) => index !== cycleIndex);
    setCycles(updatedCycles);
  };

  // Add delivery to cycle
  const addDeliveryToCycle = (cycleIndex) => {
    const updatedCycles = [...cycles];
    const newDelivery = {
      id: `delivery-${Date.now()}`,
      active: true,
      deliveryStrategy: "DIRECT",
      mandatoryWaitSinceLastDeliveryInDays: 0,
      doseCriteria: []
    };
    
    if (!updatedCycles[cycleIndex].deliveries) {
      updatedCycles[cycleIndex].deliveries = [];
    }
    
    updatedCycles[cycleIndex].deliveries.push(newDelivery);
    setCycles(updatedCycles);
  };

  // Remove delivery from cycle
  const removeDeliveryFromCycle = (cycleIndex, deliveryIndex) => {
    const updatedCycles = [...cycles];
    updatedCycles[cycleIndex].deliveries = updatedCycles[cycleIndex].deliveries.filter(
      (_, index) => index !== deliveryIndex
    );
    setCycles(updatedCycles);
  };

  // Add dose criteria to delivery
  const addDoseCriteria = (cycleIndex, deliveryIndex) => {
    const updatedCycles = [...cycles];
    const newCriteria = {
      condition: "MIN(CEIL(memberCount/2), 4)",
      ProductVariants: [
        {
          productVariantId: "",
          quantity: 1,
          isBaseUnitVariant: false
        }
      ]
    };
    
    if (!updatedCycles[cycleIndex].deliveries[deliveryIndex].doseCriteria) {
      updatedCycles[cycleIndex].deliveries[deliveryIndex].doseCriteria = [];
    }
    
    updatedCycles[cycleIndex].deliveries[deliveryIndex].doseCriteria.push(newCriteria);
    setCycles(updatedCycles);
  };

  // Remove dose criteria from delivery
  const removeDoseCriteria = (cycleIndex, deliveryIndex, criteriaIndex) => {
    const updatedCycles = [...cycles];
    updatedCycles[cycleIndex].deliveries[deliveryIndex].doseCriteria = 
      updatedCycles[cycleIndex].deliveries[deliveryIndex].doseCriteria.filter(
        (_, index) => index !== criteriaIndex
      );
    setCycles(updatedCycles);
  };

  // Add product variant to dose criteria
  const addProductVariant = (cycleIndex, deliveryIndex, criteriaIndex) => {
    const updatedCycles = [...cycles];
    const newVariant = {
      productVariantId: "",
      quantity: 1,
      isBaseUnitVariant: false
    };
    
    if (!updatedCycles[cycleIndex].deliveries[deliveryIndex].doseCriteria[criteriaIndex].ProductVariants) {
      updatedCycles[cycleIndex].deliveries[deliveryIndex].doseCriteria[criteriaIndex].ProductVariants = [];
    }
    
    updatedCycles[cycleIndex].deliveries[deliveryIndex].doseCriteria[criteriaIndex].ProductVariants.push(newVariant);
    setCycles(updatedCycles);
  };

  // Remove product variant from dose criteria
  const removeProductVariant = (cycleIndex, deliveryIndex, criteriaIndex, variantIndex) => {
    const updatedCycles = [...cycles];
    updatedCycles[cycleIndex].deliveries[deliveryIndex].doseCriteria[criteriaIndex].ProductVariants = 
      updatedCycles[cycleIndex].deliveries[deliveryIndex].doseCriteria[criteriaIndex].ProductVariants.filter(
        (_, index) => index !== variantIndex
      );
    setCycles(updatedCycles);
  };

  // Save changes
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Prepare updated project data
      const updatedProject = {
        ...projectData,
        additionalDetails: {
          ...projectData.additionalDetails,
          projectType: {
            ...projectData.additionalDetails.projectType,
            cycles: cycles
          }
        }
      };

      // Call project update API
      const response = await Digit.CustomService.getResponse({
        url: `${url}/v1/_update`,
        body: {
          Projects: [updatedProject],
          apiOperation: "UPDATE"
        }
      });

      if (response?.Project?.[0]) {
        setShowToast({ key: "success", label: t("DELIVERY_CYCLES_UPDATED_SUCCESSFULLY") });
        setIsEditMode(false);
        fetchProjectData(); // Refresh data
      }
    } catch (error) {
      console.error("Error updating project:", error);
      setShowToast({ key: "error", label: t("ERROR_UPDATING_DELIVERY_CYCLES") });
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel changes
  const handleCancel = () => {
    // Reset to original data
    const originalCycles = projectData?.additionalDetails?.projectType?.cycles || [];
    setCycles(JSON.parse(JSON.stringify(originalCycles)));
    setIsEditMode(false);
  };

  // Format date for display
  const formatDate = (epochTime) => {
    if (!epochTime) return "NA";
    return new Date(epochTime).toLocaleDateString();
  };

  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <div className="override-card" style={{ overflow: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <Header className="works-header-view">{t("DELIVERY_CYCLES")}</Header>
        <div style={{ display: "flex", gap: "12px" }}>
          {isEditMode ? (
            <>
              <Button
                label={t("CANCEL")}
                variation="secondary"
                onClick={handleCancel}
                isDisabled={isSaving}
              />
              <Button
                label={t("SAVE_CHANGES")}
                variation="primary"
                onClick={handleSave}
                isDisabled={isSaving}
              />
            </>
          ) : (
            <Button
              label={t("EDIT_CYCLES")}
              variation="secondary"
              onClick={() => setIsEditMode(true)}
            />
          )}
        </div>
      </div>

      {cycles.length === 0 ? (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h3>{t("NO_DELIVERY_CYCLES")}</h3>
          {isEditMode && (
            <Button
              label={t("ADD_CYCLE")}
              variation="primary"
              onClick={addNewCycle}
              style={{ marginTop: "16px" }}
            />
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {cycles.map((cycle, cycleIndex) => (
            <Card key={cycle.id || cycleIndex} style={{ padding: "16px" }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                marginBottom: "16px",
                cursor: "pointer",
                padding: "8px",
                backgroundColor: expandedCycle === cycleIndex ? "#f0f0f0" : "transparent",
                borderRadius: "4px"
              }}
              onClick={() => setExpandedCycle(expandedCycle === cycleIndex ? null : cycleIndex)}
              >
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
                  {t("CYCLE")} {cycleIndex + 1}
                </h3>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ fontSize: "14px", color: "#666" }}>
                    {formatDate(cycle.startDate)} - {formatDate(cycle.endDate)}
                  </span>
                  {isEditMode && (
                    <Button
                      label={t("REMOVE")}
                      variation="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCycle(cycleIndex);
                      }}
                      style={{ padding: "4px 8px", fontSize: "12px" }}
                    />
                  )}
                </div>
              </div>

              {(expandedCycle === cycleIndex || isEditMode) && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Cycle Details */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <LabelFieldPair>
                      <CardLabel>{t("START_DATE")}</CardLabel>
                      {isEditMode ? (
                        <DatePicker
                          date={new Date(cycle.startDate)}
                          onDateChange={(date) => handleCycleChange(cycleIndex, 'startDate', date)}
                        />
                      ) : (
                        <div style={{ padding: "8px", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
                          {formatDate(cycle.startDate)}
                        </div>
                      )}
                    </LabelFieldPair>

                    <LabelFieldPair>
                      <CardLabel>{t("END_DATE")}</CardLabel>
                      {isEditMode ? (
                        <DatePicker
                          date={new Date(cycle.endDate)}
                          onDateChange={(date) => handleCycleChange(cycleIndex, 'endDate', date)}
                        />
                      ) : (
                        <div style={{ padding: "8px", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
                          {formatDate(cycle.endDate)}
                        </div>
                      )}
                    </LabelFieldPair>
                  </div>

                  {/* Deliveries */}
                  <div style={{ marginTop: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "600" }}>
                      {t("DELIVERIES")}
                    </h4>
                    {cycle.deliveries?.map((delivery, deliveryIndex) => (
                      <div key={delivery.id || deliveryIndex} 
                        style={{ 
                          padding: "12px", 
                          backgroundColor: "#f9f9f9", 
                          borderRadius: "4px",
                          marginBottom: "8px",
                          border: "1px solid #e0e0e0"
                        }}
                      >
                        <div style={{ 
                          display: "flex", 
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "12px"
                        }}>
                          <h5 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>
                            {t("DELIVERY")} {deliveryIndex + 1}
                          </h5>
                          {isEditMode && (
                            <Button
                              label={t("REMOVE")}
                              variation="secondary"
                              onClick={() => removeDeliveryFromCycle(cycleIndex, deliveryIndex)}
                              style={{ padding: "2px 6px", fontSize: "11px" }}
                            />
                          )}
                        </div>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                          <LabelFieldPair>
                            <CardLabel style={{ fontSize: "13px" }}>{t("DELIVERY_STRATEGY")}</CardLabel>
                            {isEditMode ? (
                              <select
                                value={delivery.deliveryStrategy}
                                onChange={(e) => handleCycleChange(
                                  cycleIndex, 
                                  `deliveries.${deliveryIndex}.deliveryStrategy`, 
                                  e.target.value
                                )}
                                style={{
                                  padding: "6px",
                                  borderRadius: "4px",
                                  border: "1px solid #ccc",
                                  width: "100%"
                                }}
                              >
                                <option value="DIRECT">Direct</option>
                                <option value="INDIRECT">Indirect</option>
                              </select>
                            ) : (
                              <div style={{ padding: "6px", backgroundColor: "#fff", borderRadius: "4px" }}>
                                {delivery.deliveryStrategy}
                              </div>
                            )}
                          </LabelFieldPair>

                          <LabelFieldPair>
                            <CardLabel style={{ fontSize: "13px" }}>{t("WAIT_DAYS")}</CardLabel>
                            {isEditMode ? (
                              <TextInput
                                type="number"
                                value={delivery.mandatoryWaitSinceLastDeliveryInDays || 0}
                                onChange={(e) => handleCycleChange(
                                  cycleIndex,
                                  `deliveries.${deliveryIndex}.mandatoryWaitSinceLastDeliveryInDays`,
                                  parseInt(e.target.value) || 0
                                )}
                              />
                            ) : (
                              <div style={{ padding: "6px", backgroundColor: "#fff", borderRadius: "4px" }}>
                                {delivery.mandatoryWaitSinceLastDeliveryInDays || 0} days
                              </div>
                            )}
                          </LabelFieldPair>
                        </div>

                        {/* Dose Criteria Section */}
                        <div style={{ marginTop: "12px" }}>
                          <h6 style={{ 
                            margin: "0 0 8px 0", 
                            fontSize: "13px", 
                            fontWeight: "600",
                            color: "#333"
                          }}>
                            {t("DOSE_CRITERIA")}
                          </h6>
                          
                          {delivery.doseCriteria?.map((criteria, criteriaIndex) => (
                            <div key={criteriaIndex} style={{
                              padding: "10px",
                              backgroundColor: "#fff",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              marginBottom: "8px"
                            }}>
                              <div style={{ 
                                display: "flex", 
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "8px"
                              }}>
                                <span style={{ fontSize: "12px", fontWeight: "600" }}>
                                  {t("CRITERIA")} {criteriaIndex + 1}
                                </span>
                                {isEditMode && (
                                  <Button
                                    label={t("REMOVE")}
                                    variation="secondary"
                                    onClick={() => removeDoseCriteria(cycleIndex, deliveryIndex, criteriaIndex)}
                                    style={{ padding: "2px 4px", fontSize: "10px" }}
                                  />
                                )}
                              </div>

                              {/* Formula Input Mode Selection */}
                              {isEditMode && (
                                <div style={{ marginBottom: "12px" }}>
                                  <div style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
                                    <Button
                                      label={t("FORMULA_TEMPLATES")}
                                      variation={formulaBuilderMode === 'simple' ? "primary" : "secondary"}
                                      onClick={() => setFormulaBuilderMode('simple')}
                                      style={{ fontSize: "11px", padding: "4px 8px" }}
                                    />
                                    <Button
                                      label={t("CONDITION_BUILDER")}
                                      variation={formulaBuilderMode === 'advanced' ? "primary" : "secondary"}
                                      onClick={() => {
                                        setFormulaBuilderMode('advanced');
                                        setShowFormulaBuilder(true);
                                      }}
                                      style={{ fontSize: "11px", padding: "4px 8px" }}
                                    />
                                    <Button
                                      label={t("DIRECT_FORMULA")}
                                      variation={formulaBuilderMode === 'direct' ? "primary" : "secondary"}
                                      onClick={() => setFormulaBuilderMode('direct')}
                                      style={{ fontSize: "11px", padding: "4px 8px" }}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Formula Template Selection */}
                              {isEditMode && formulaBuilderMode === 'simple' && (
                                <div style={{ marginBottom: "8px" }}>
                                  <CardLabel style={{ fontSize: "12px" }}>{t("FORMULA_TEMPLATES")}</CardLabel>
                                  <Dropdown
                                    t={t}
                                    option={getFormulaTemplates()}
                                    optionKey="formula"
                                    select={(value) => handleCycleChange(
                                      cycleIndex,
                                      `deliveries.${deliveryIndex}.doseCriteria.${criteriaIndex}.condition`,
                                      value?.formula
                                    )}
                                    selected={null}
                                    placeholder={t("SELECT_TEMPLATE")}
                                    style={{ fontSize: "12px" }}
                                  />
                                  <div style={{ fontSize: "10px", color: "#666", marginTop: "2px" }}>
                                    Select a pre-built formula template
                                  </div>
                                </div>
                              )}

                              {/* Condition Builder */}
                              {isEditMode && formulaBuilderMode === 'advanced' && showFormulaBuilder && (
                                <ConditionBuilder
                                  attributeConfig={attributeConfig}
                                  operatorConfig={operatorConfig}
                                  onFormulaChange={(formula) => handleCycleChange(
                                    cycleIndex,
                                    `deliveries.${deliveryIndex}.doseCriteria.${criteriaIndex}.condition`,
                                    formula
                                  )}
                                  initialFormula={criteria.condition}
                                  onClose={() => setShowFormulaBuilder(false)}
                                  t={t}
                                />
                              )}

                              {/* Direct Formula Input */}
                              {formulaBuilderMode === 'direct' && (
                                <div style={{ marginBottom: "8px" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                    <CardLabel style={{ fontSize: "12px", margin: 0 }}>{t("CONDITION_FORMULA")}</CardLabel>
                                    {isEditMode && validateFormula(criteria.condition).isValid && (
                                      <span style={{ fontSize: "10px", color: "#28a745", fontWeight: "600" }}>✓ Valid</span>
                                    )}
                                    {isEditMode && !validateFormula(criteria.condition).isValid && (
                                      <span style={{ fontSize: "10px", color: "#dc3545", fontWeight: "600" }}>✗ Invalid</span>
                                    )}
                                  </div>
                                  
                                  {isEditMode ? (
                                    <div>
                                      <textarea
                                        value={criteria.condition || ""}
                                        onChange={(e) => handleCycleChange(
                                          cycleIndex,
                                          `deliveries.${deliveryIndex}.doseCriteria.${criteriaIndex}.condition`,
                                          e.target.value
                                        )}
                                        placeholder="Enter formula like: MIN(CEIL(memberCount/2), 4)"
                                        style={{
                                          width: "100%",
                                          minHeight: "60px",
                                          fontSize: "12px",
                                          fontFamily: "monospace",
                                          padding: "6px",
                                          border: `1px solid ${validateFormula(criteria.condition).isValid ? '#28a745' : '#dc3545'}`,
                                          borderRadius: "4px",
                                          backgroundColor: "#f8f9fa",
                                          resize: "vertical"
                                        }}
                                      />
                                      {!validateFormula(criteria.condition).isValid && (
                                        <div style={{ fontSize: "10px", color: "#dc3545", marginTop: "2px" }}>
                                          {validateFormula(criteria.condition).error}
                                        </div>
                                      )}
                                      <div style={{ fontSize: "10px", color: "#666", marginTop: "4px" }}>
                                        <strong>Available functions:</strong> MIN, MAX, CEIL, FLOOR, POW, IF, ROUND<br/>
                                        <strong>Available variables:</strong> {attributeConfig.map(attr => attr.code.toLowerCase()).join(', ')}
                                      </div>
                                    </div>
                                  ) : (
                                    <div style={{ 
                                      padding: "8px", 
                                      backgroundColor: "#f8f9fa", 
                                      borderRadius: "4px", 
                                      fontSize: "12px",
                                      fontFamily: "monospace",
                                      border: "1px solid #e9ecef",
                                      wordBreak: "break-all"
                                    }}>
                                      {criteria.condition || "No formula defined"}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Current Formula Display for Builder Modes */}
                              {(formulaBuilderMode === 'simple' || formulaBuilderMode === 'advanced') && (
                                <div style={{ marginBottom: "8px" }}>
                                  <CardLabel style={{ fontSize: "12px" }}>{t("GENERATED_FORMULA")}</CardLabel>
                                  <div style={{ 
                                    padding: "6px", 
                                    backgroundColor: "#e3f2fd", 
                                    borderRadius: "4px", 
                                    fontSize: "11px",
                                    fontFamily: "monospace",
                                    border: "1px solid #bbdefb",
                                    wordBreak: "break-all",
                                    color: "#1565c0"
                                  }}>
                                    {criteria.condition || "No formula generated"}
                                  </div>
                                </div>
                              )}

                              {/* Product Variants */}
                              <div>
                                <div style={{ 
                                  display: "flex", 
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  marginBottom: "6px"
                                }}>
                                  <CardLabel style={{ fontSize: "12px", margin: 0 }}>{t("PRODUCT_VARIANTS")}</CardLabel>
                                  {isEditMode && (
                                    <Button
                                      label={t("ADD_PRODUCT")}
                                      variation="secondary"
                                      onClick={() => addProductVariant(cycleIndex, deliveryIndex, criteriaIndex)}
                                      style={{ padding: "2px 6px", fontSize: "10px" }}
                                    />
                                  )}
                                </div>
                                
                                {criteria.ProductVariants?.map((variant, variantIndex) => (
                                  <div key={variantIndex} style={{
                                    padding: "6px",
                                    backgroundColor: "#fafafa",
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "3px",
                                    marginBottom: "4px"
                                  }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 80px auto", gap: "6px", alignItems: "center" }}>
                                      {isEditMode ? (
                                        <>
                                          {productVariants.length > 0 ? (
                                            <Dropdown
                                              t={t}
                                              option={productVariants}
                                              optionKey="code"
                                              select={(value) => handleCycleChange(
                                                cycleIndex,
                                                `deliveries.${deliveryIndex}.doseCriteria.${criteriaIndex}.ProductVariants.${variantIndex}.productVariantId`,
                                                value?.code
                                              )}
                                              selected={productVariants.find(p => p.code === variant.productVariantId)}
                                              placeholder={t("SELECT_PRODUCT")}
                                              style={{ fontSize: "12px" }}
                                            />
                                          ) : (
                                            <TextInput
                                              placeholder="Product ID"
                                              value={variant.productVariantId || ""}
                                              onChange={(e) => handleCycleChange(
                                                cycleIndex,
                                                `deliveries.${deliveryIndex}.doseCriteria.${criteriaIndex}.ProductVariants.${variantIndex}.productVariantId`,
                                                e.target.value
                                              )}
                                              style={{ fontSize: "12px", padding: "4px" }}
                                            />
                                          )}
                                          <TextInput
                                            type="number"
                                            placeholder="Qty"
                                            value={variant.quantity || 0}
                                            onChange={(e) => handleCycleChange(
                                              cycleIndex,
                                              `deliveries.${deliveryIndex}.doseCriteria.${criteriaIndex}.ProductVariants.${variantIndex}.quantity`,
                                              parseInt(e.target.value) || 0
                                            )}
                                            style={{ fontSize: "12px", padding: "4px" }}
                                          />
                                          <label style={{ fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
                                            <input
                                              type="checkbox"
                                              checked={variant.isBaseUnitVariant || false}
                                              onChange={(e) => handleCycleChange(
                                                cycleIndex,
                                                `deliveries.${deliveryIndex}.doseCriteria.${criteriaIndex}.ProductVariants.${variantIndex}.isBaseUnitVariant`,
                                                e.target.checked
                                              )}
                                            />
                                            Base
                                          </label>
                                          <Button
                                            label="×"
                                            variation="secondary"
                                            onClick={() => removeProductVariant(cycleIndex, deliveryIndex, criteriaIndex, variantIndex)}
                                            style={{ padding: "2px 6px", fontSize: "14px" }}
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <span style={{ fontSize: "12px" }}>
                                            <strong>Product:</strong> {
                                              productVariants.find(p => p.code === variant.productVariantId)?.name || 
                                              variant.productVariantId || 
                                              "NA"
                                            }
                                          </span>
                                          <span style={{ fontSize: "12px" }}>
                                            <strong>Qty:</strong> {variant.quantity || 0}
                                          </span>
                                          <span style={{ fontSize: "12px" }}>
                                            {variant.isBaseUnitVariant ? "✓ Base" : ""}
                                          </span>
                                          <span></span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                          
                          {isEditMode && (
                            <Button
                              label={t("ADD_DOSE_CRITERIA")}
                              variation="secondary"
                              onClick={() => addDoseCriteria(cycleIndex, deliveryIndex)}
                              style={{ marginTop: "6px", fontSize: "12px", padding: "4px 8px" }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {isEditMode && (
                      <Button
                        label={t("ADD_DELIVERY")}
                        variation="secondary"
                        onClick={() => addDeliveryToCycle(cycleIndex)}
                        style={{ marginTop: "8px" }}
                      />
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}

          {isEditMode && (
            <Button
              label={t("ADD_NEW_CYCLE")}
              variation="primary"
              onClick={addNewCycle}
              style={{ marginTop: "16px" }}
            />
          )}
        </div>
      )}

      {showToast && (
        <Toast
          type={showToast.key === "error" ? "error" : "success"}
          label={t(showToast.label)}
          onClose={() => setShowToast(null)}
        />
      )}
    </div>
  );
};

// Condition Builder Component
const ConditionBuilder = ({ attributeConfig, operatorConfig, onFormulaChange, initialFormula, onClose, t }) => {
  const [conditionGroups, setConditionGroups] = useState([createNewConditionGroup()]);
  const [previewFormula, setPreviewFormula] = useState('');

  // Update preview formula whenever conditions change
  useEffect(() => {
    const formula = convertBuilderToFormula(conditionGroups);
    setPreviewFormula(formula);
  }, [conditionGroups]);

  // Add new condition to a group
  const addCondition = (groupId) => {
    setConditionGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, conditions: [...group.conditions, createNewCondition()] }
        : group
    ));
  };

  // Remove condition from a group
  const removeCondition = (groupId, conditionId) => {
    setConditionGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, conditions: group.conditions.filter(c => c.id !== conditionId) }
        : group
    ).filter(group => group.conditions.length > 0));
  };

  // Add new condition group
  const addConditionGroup = () => {
    setConditionGroups(prev => [...prev, createNewConditionGroup()]);
  };

  // Remove condition group
  const removeConditionGroup = (groupId) => {
    if (conditionGroups.length > 1) {
      setConditionGroups(prev => prev.filter(group => group.id !== groupId));
    }
  };

  // Update condition field
  const updateCondition = (groupId, conditionId, field, value) => {
    setConditionGroups(prev => prev.map(group => 
      group.id === groupId 
        ? {
            ...group,
            conditions: group.conditions.map(condition => 
              condition.id === conditionId 
                ? { ...condition, [field]: value }
                : condition
            )
          }
        : group
    ));
  };

  // Update group logical operator
  const updateGroupOperator = (groupId, operator) => {
    setConditionGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, logicalOperator: operator }
        : group
    ));
  };

  // Apply formula and close builder
  const applyFormula = () => {
    onFormulaChange(previewFormula);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'auto',
        minWidth: '600px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>{t('CONDITION_BUILDER')}</h3>
          <Button label="×" variation="secondary" onClick={onClose} style={{ padding: '4px 8px' }} />
        </div>

        {conditionGroups.map((group, groupIndex) => (
          <div key={group.id} style={{
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '12px',
            backgroundColor: '#fafafa'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{t('GROUP')} {groupIndex + 1}</span>
                {group.conditions.length > 1 && (
                  <Dropdown
                    t={t}
                    option={[{ code: 'AND', name: 'AND' }, { code: 'OR', name: 'OR' }]}
                    optionKey="code"
                    selected={{ code: group.logicalOperator, name: group.logicalOperator }}
                    select={(value) => updateGroupOperator(group.id, value.code)}
                    style={{ fontSize: '12px', minWidth: '80px' }}
                  />
                )}
              </div>
              {conditionGroups.length > 1 && (
                <Button 
                  label={t('REMOVE_GROUP')} 
                  variation="secondary" 
                  onClick={() => removeConditionGroup(group.id)}
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                />
              )}
            </div>

            {group.conditions.map((condition, conditionIndex) => (
              <div key={condition.id} style={{
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 2fr 1fr auto',
                gap: '8px',
                alignItems: 'end',
                marginBottom: '8px',
                padding: '8px',
                backgroundColor: 'white',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}>
                {/* Attribute Selection */}
                <div>
                  <CardLabel style={{ fontSize: '11px' }}>{t('ATTRIBUTE')}</CardLabel>
                  <Dropdown
                    t={t}
                    option={attributeConfig}
                    optionKey="code"
                    selected={condition.attribute}
                    select={(value) => updateCondition(group.id, condition.id, 'attribute', value)}
                    placeholder={t('SELECT_ATTRIBUTE')}
                    style={{ fontSize: '12px' }}
                  />
                </div>

                {/* Operator Selection */}
                <div>
                  <CardLabel style={{ fontSize: '11px' }}>{t('OPERATOR')}</CardLabel>
                  <Dropdown
                    t={t}
                    option={operatorConfig}
                    optionKey="code"
                    selected={condition.operator}
                    select={(value) => updateCondition(group.id, condition.id, 'operator', value)}
                    placeholder={t('SELECT_OPERATOR')}
                    style={{ fontSize: '12px' }}
                  />
                </div>

                {/* Value Input */}
                <div>
                  <CardLabel style={{ fontSize: '11px' }}>{t('VALUE')}</CardLabel>
                  {condition.operator?.code === 'IN_BETWEEN' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                      <TextInput
                        placeholder="From"
                        value={condition.fromValue}
                        onChange={(e) => updateCondition(group.id, condition.id, 'fromValue', e.target.value)}
                        style={{ fontSize: '12px', padding: '4px' }}
                      />
                      <TextInput
                        placeholder="To"
                        value={condition.toValue}
                        onChange={(e) => updateCondition(group.id, condition.id, 'toValue', e.target.value)}
                        style={{ fontSize: '12px', padding: '4px' }}
                      />
                    </div>
                  ) : condition.attribute?.dataType === 'select' ? (
                    <Dropdown
                      t={t}
                      option={condition.attribute.options?.map(opt => ({ code: opt, name: opt })) || []}
                      optionKey="code"
                      selected={condition.value ? { code: condition.value, name: condition.value } : null}
                      select={(value) => updateCondition(group.id, condition.id, 'value', value?.code)}
                      placeholder={t('SELECT_VALUE')}
                      style={{ fontSize: '12px' }}
                    />
                  ) : condition.attribute?.dataType === 'boolean' ? (
                    <Dropdown
                      t={t}
                      option={[{ code: 'true', name: 'Yes' }, { code: 'false', name: 'No' }]}
                      optionKey="code"
                      selected={condition.value ? { code: condition.value, name: condition.value === 'true' ? 'Yes' : 'No' } : null}
                      select={(value) => updateCondition(group.id, condition.id, 'value', value?.code)}
                      placeholder={t('SELECT_VALUE')}
                      style={{ fontSize: '12px' }}
                    />
                  ) : (
                    <TextInput
                      type={condition.attribute?.dataType === 'number' ? 'number' : 'text'}
                      value={condition.value}
                      onChange={(e) => updateCondition(group.id, condition.id, 'value', e.target.value)}
                      style={{ fontSize: '12px', padding: '4px' }}
                    />
                  )}
                </div>

                {/* Logical Connector */}
                <div style={{ fontSize: '12px', textAlign: 'center', color: '#666' }}>
                  {conditionIndex < group.conditions.length - 1 && group.logicalOperator}
                </div>

                {/* Remove Condition */}
                <div>
                  {group.conditions.length > 1 && (
                    <Button
                      label="×"
                      variation="secondary"
                      onClick={() => removeCondition(group.id, condition.id)}
                      style={{ fontSize: '16px', padding: '4px 8px' }}
                    />
                  )}
                </div>
              </div>
            ))}

            <Button
              label={t('ADD_CONDITION')}
              variation="secondary"
              onClick={() => addCondition(group.id)}
              style={{ fontSize: '12px', marginTop: '8px' }}
            />
          </div>
        ))}

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <Button
            label={t('ADD_GROUP')}
            variation="secondary"
            onClick={addConditionGroup}
            style={{ fontSize: '12px' }}
          />
        </div>

        {/* Formula Preview */}
        <div style={{ marginBottom: '20px' }}>
          <CardLabel style={{ fontSize: '14px', fontWeight: '600' }}>{t('PREVIEW_FORMULA')}</CardLabel>
          <div style={{
            padding: '12px',
            backgroundColor: '#f0f8ff',
            border: '1px solid #bbdefb',
            borderRadius: '4px',
            fontSize: '13px',
            fontFamily: 'monospace',
            color: '#1565c0',
            wordBreak: 'break-all'
          }}>
            {previewFormula || 'No conditions defined'}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button
            label={t('CANCEL')}
            variation="secondary"
            onClick={onClose}
          />
          <Button
            label={t('APPLY_FORMULA')}
            variation="primary"
            onClick={applyFormula}
            isDisabled={!previewFormula}
          />
        </div>
      </div>
    </div>
  );
};

// Helper functions for condition builder
function createNewCondition() {
  return {
    id: Date.now() + Math.random(),
    attribute: null,
    operator: null,
    value: '',
    fromValue: '',
    toValue: ''
  };
}

function createNewConditionGroup() {
  return {
    id: Date.now() + Math.random(),
    logicalOperator: 'AND',
    conditions: [createNewCondition()]
  };
}

// Convert condition builder to formula string
function convertBuilderToFormula(conditionGroups) {
  if (!conditionGroups || conditionGroups.length === 0) {
    return '';
  }

  const groupFormulas = conditionGroups.map(group => {
    const conditionFormulas = group.conditions
      .filter(condition => condition.attribute && condition.operator)
      .map(condition => {
        const attr = condition.attribute.code.toLowerCase();
        const op = condition.operator.code;
        
        switch (op) {
          case 'GREATER_THAN':
            return `${attr} > ${condition.value}`;
          case 'GREATER_THAN_EQUAL_TO':
            return `${attr} >= ${condition.value}`;
          case 'LESS_THAN':
            return `${attr} < ${condition.value}`;
          case 'LESSER_THAN_EQUAL_TO':
            return `${attr} <= ${condition.value}`;
          case 'EQUAL_TO':
            return condition.attribute.dataType === 'select' || condition.attribute.dataType === 'boolean' 
              ? `${attr} == '${condition.value}'` 
              : `${attr} == ${condition.value}`;
          case 'IN_BETWEEN':
            return `(${attr} >= ${condition.fromValue} && ${attr} <= ${condition.toValue})`;
          default:
            return `${attr} >= ${condition.value}`;
        }
      });

    if (conditionFormulas.length === 0) return '';
    if (conditionFormulas.length === 1) return conditionFormulas[0];
    
    const operator = group.logicalOperator === 'OR' ? ' || ' : ' && ';
    return `(${conditionFormulas.join(operator)})`;
  }).filter(formula => formula);

  if (groupFormulas.length === 0) return '';
  if (groupFormulas.length === 1) return `MIN(MAX(CEIL(${groupFormulas[0]} ? 1 : 0), 1), 4)`;
  
  return `MIN(MAX(CEIL((${groupFormulas.join(' || ')}) ? 1 : 0), 1), 4)`;
}

export default DeliveryCyclesComponent;