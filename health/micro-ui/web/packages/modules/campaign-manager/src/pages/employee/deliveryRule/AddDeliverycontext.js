import React, { useRef, useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  RadioButtons,
  TextInput,
  Chip,
  Button,
  LabelFieldPair,
  Dropdown,
  CardLabel,
  Card,
  CardHeader,
  PopUp,
  Loader,
} from "@egovernments/digit-ui-components";
import { useDeliveryRules } from './useDeliveryRules';
import AddProducts from "./AddProductscontext";
import { PRIMARY_COLOR } from "../../../utils";
import getMDMSUrl from "../../../utils/getMDMSUrl";

const DustbinIcon = React.memo(() => (
  <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0.999837 13.8333C0.999837 14.75 1.74984 15.5 2.6665 15.5L9.33317 15.5C10.2498 15.5 10.9998 14.75 10.9998 13.8333L10.9998 3.83333L0.999837 3.83333L0.999837 13.8333ZM11.8332 1.33333L8.9165 1.33333L8.08317 0.5L3.9165 0.5L3.08317 1.33333L0.166504 1.33333L0.166504 3L11.8332 3V1.33333Z"
      fill={PRIMARY_COLOR}
    />
  </svg>
));

const useDropdownOptions = (schemaCode, tenantId) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOptions = useCallback(async (code) => {
    if (!code) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const url = getMDMSUrl(true);
      const response = await Digit.CustomService.getResponse({
        url: `${url}/v1/_search`,
        body: {
          MdmsCriteria: {
            tenantId: tenantId,
            moduleDetails: [{
              moduleName: code.split(".")[0],
              masterDetails: [{
                name: code.split(".")[1],
              }],
            }],
          },
        },
      });
      
      const moduleName = code.split(".")[0];
      const schemaName = code.split(".")[1];
      const data = response?.MdmsRes?.[moduleName]?.[schemaName] || [];
      setOptions(data);
    } catch (error) {
      console.error("Error fetching dropdown options:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  return { options, loading, fetchOptions };
};

const AddAttributeField = React.memo(({
  rule,
  attribute,
  attributeConfig,
  operatorConfig,
  projectConfig,
  canDelete,
  onDelete,
}) => {
  const { updateAttributeField } = useDeliveryRules();
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  
  const { options: dropdownOptions, loading: optionsLoading, fetchOptions } = useDropdownOptions(null, tenantId);

  // Memoize selected attribute and operator
  const selectedAttribute = useMemo(() => {
    const found = attributeConfig?.find(item => item.code === attribute?.attribute?.code) || null;
    return found;
  }, [attributeConfig, attribute?.attribute?.code]);

  const selectedOperator = useMemo(() => {
    const found = operatorConfig?.find(item => item.code === attribute?.operator?.code) || null;
    return found;
  }, [operatorConfig, attribute?.operator?.code]);

  // Memoize available attributes (exclude already selected ones)
  const availableAttributes = useMemo(() => {
    const usedCodes = rule.attributes
      .filter(attr => attr.key !== attribute.key && attr.attribute?.code)
      .map(attr => attr.attribute.code);
    
    const available = attributeConfig?.filter(item => !usedCodes.includes(item.code)) || [];
    return available;
  }, [attributeConfig, rule.attributes, attribute.key]);

  // Memoize allowed operators for selected attribute
  const allowedOperators = useMemo(() => {
    if (!selectedAttribute?.allowedOperators) {
      return operatorConfig || [];
    }
    const filtered = operatorConfig?.filter(op => selectedAttribute.allowedOperators.includes(op.code)) || [];
    return filtered;
  }, [selectedAttribute, operatorConfig]);

  const selectedDropdownValue = useMemo(() => {
  if (!attribute?.value) return null;
  
  // If value is already an object with code, use it
  if (typeof attribute.value === 'object' && attribute.value.code) {
    return attribute.value;
  }
  
  // If value is a string, find the matching option
  if (typeof attribute.value === 'string' && dropdownOptions.length > 0) {
    // Try to find by code first
    const matchedOption = dropdownOptions.find(opt => opt.code === attribute.value);
    if (matchedOption) {
      return matchedOption;
    }
    
    // If no exact code match, try case-insensitive match
    const caseInsensitiveMatch = dropdownOptions.find(
      opt => opt.code?.toLowerCase() === attribute.value.toLowerCase()
    );
    if (caseInsensitiveMatch) {
      return caseInsensitiveMatch;
    }
  }
  
  return null;
}, [attribute?.value, dropdownOptions]);

  // Fetch dropdown options when attribute changes
  React.useEffect(() => {
    if (selectedAttribute?.valuesSchema) {
      fetchOptions(selectedAttribute.valuesSchema);
    }
  }, [selectedAttribute?.valuesSchema, fetchOptions]);

  const handleAttributeChange = useCallback((value) => {
    updateAttributeField(rule.ruleKey, attribute.key, 'attribute', value);
  }, [updateAttributeField, rule.ruleKey, attribute.key]);

  const handleOperatorChange = useCallback((value) => {
    updateAttributeField(rule.ruleKey, attribute.key, 'operator', value);
  }, [updateAttributeField, rule.ruleKey, attribute.key]);

  const handleValueChange = useCallback((e) => {
    let val = e.target.value;
    val = val.replace(/[^\d.]/g, "");
    val = val.match(/^\d*\.?\d{0,2}/)[0] || "";
    
    if (isNaN(val) || [" ", "e", "E"].some(f => val.includes(f))) {
      return;
    }
    
    updateAttributeField(rule.ruleKey, attribute.key, 'value', val);
  }, [updateAttributeField, rule.ruleKey, attribute.key]);

  const handleDropdownValueChange = useCallback((value) => {
    updateAttributeField(rule.ruleKey, attribute.key, 'value', value?.code);
  }, [updateAttributeField, rule.ruleKey, attribute.key]);

  const handleRangeValueChange = useCallback((e, range) => {
    let val = e.target.value;
    val = val.replace(/[^\d.]/g, "");
    val = val.match(/^\d*\.?\d{0,2}/)[0] || "";
    
    if (isNaN(val) || [" ", "e", "E"].some(f => val.includes(f))) {
      return;
    }
    
    const field = range === "to" ? "toValue" : "fromValue";
    updateAttributeField(rule.ruleKey, attribute.key, field, val);
  }, [updateAttributeField, rule.ruleKey, attribute.key]);

  const isRangeOperator = attribute?.operator?.code === "IN_BETWEEN";
  const isDropdownValue = selectedAttribute?.valuesSchema || 
    (typeof attribute?.value === "string" && /^[a-zA-Z]+$/.test(attribute?.value));


  return (
    <div className="attribute-field-wrapper">
      <LabelFieldPair style={{ marginBottom: "0rem" }}>
        <CardLabel isMandatory className="card-label-smaller">
          {t("CAMPAIGN_ATTRIBUTE_LABEL")}
        </CardLabel>
        <Dropdown
          className="form-field"
          showToolTip
          selected={selectedAttribute}
          disable={false}
          isMandatory
          option={availableAttributes}
          select={handleAttributeChange}
          optionKey="i18nKey"
          t={t}
        />
      </LabelFieldPair>

      <LabelFieldPair style={{ marginBottom: "0rem" }}>
        <CardLabel isMandatory className="card-label-smaller">
          {t("CAMPAIGN_OPERATOR_LABEL")}
        </CardLabel>
        <Dropdown
          className="form-field"
          selected={selectedOperator}
          isMandatory
          option={allowedOperators}
          showToolTip
          select={handleOperatorChange}
          optionKey="code"
          t={t}
        />
      </LabelFieldPair>

      {isRangeOperator ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <LabelFieldPair style={{ marginBottom: "0rem" }}>
            <CardLabel className="card-label-smaller">{t("CAMPAIGN_FROM_LABEL")}</CardLabel>
            <TextInput
              value={attribute?.fromValue || ""}
              onChange={(e) => handleRangeValueChange(e, "from")}
              disable={false}
            />
          </LabelFieldPair>
          <LabelFieldPair style={{ marginBottom: "0rem" }}>
            <CardLabel className="card-label-smaller">{t("CAMPAIGN_TO_LABEL")}</CardLabel>
            <TextInput
              value={attribute?.toValue || ""}
              onChange={(e) => handleRangeValueChange(e, "to")}
              disable={false}
            />
          </LabelFieldPair>
        </div>
      ) : (
        <LabelFieldPair style={{ marginBottom: "0rem" }}>
          <CardLabel className="card-label-smaller">{t("CAMPAIGN_VALUE_LABEL")}</CardLabel>
          <div className="field" style={{ display: "flex", width: "100%" }}>
            {isDropdownValue ? (
              optionsLoading ? (
                <Loader />
              ) : (
                <Dropdown
                  className="form-field"
                  selected={selectedDropdownValue}
                  disable={false}
                  isMandatory
                  option={dropdownOptions}
                  select={handleDropdownValueChange}
                  optionKey="code"
                  t={t}
                />
              )
            ) : (
              <TextInput
                textInputStyle={{ width: "100%" }}
                value={attribute?.value || ""}
                onChange={handleValueChange}
                disable={false}
              />
            )}
          </div>
        </LabelFieldPair>
      )}

      {canDelete && (
        <Button
          variation="link"
          style={{ marginTop: "3rem" }}
          label={t("CAMPAIGN_DELETE_ROW_TEXT")}
          title={t("CAMPAIGN_DELETE_ROW_TEXT")}
          icon="Delete"
          onClick={onDelete}
        />
      )}
    </div>
  );
});

const AddAttributeWrapper = React.memo(({ 
  rule, 
  attributeConfig, 
  operatorConfig, 
  projectConfig 
}) => {
  const { addAttributeToRule, removeAttributeFromRule } = useDeliveryRules();
  const { t } = useTranslation();

  const handleAddAttribute = useCallback(() => {
    addAttributeToRule(rule.ruleKey);
  }, [addAttributeToRule, rule.ruleKey]);

  const handleRemoveAttribute = useCallback((attributeKey) => {
    removeAttributeFromRule(rule.ruleKey, attributeKey);
  }, [removeAttributeFromRule, rule.ruleKey]);

  const canAddMore = !projectConfig?.attrAddDisable && 
    rule.attributes.length < (attributeConfig?.length || 0);

  return (
    <Card className="attribute-container">
      {rule.attributes.map((attribute) => (
        <AddAttributeField
          key={attribute.key}
          rule={rule}
          attribute={attribute}
          attributeConfig={attributeConfig}
          operatorConfig={operatorConfig}
          projectConfig={projectConfig}
          canDelete={rule.attributes.length > 1}
          onDelete={() => handleRemoveAttribute(attribute.key)}
        />
      ))}
      
      {canAddMore && (
        <Button
          variation="secondary"
          label={t("CAMPAIGN_ADD_MORE_ATTRIBUTE_TEXT")}
          title={t("CAMPAIGN_ADD_MORE_ATTRIBUTE_TEXT")}
          className="add-attribute hover"
          icon="AddIcon"
          onClick={handleAddAttribute}
        />
      )}
    </Card>
  );
});

const AddDeliveryRule = React.memo(({ 
  rule, 
  attributeConfig, 
  operatorConfig, 
  deliveryTypeConfig,
  projectConfig,
  canDelete,
  onDelete 
}) => {

  const { updateRuleProducts, updateRuleDeliveryType } = useDeliveryRules();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const prodRef = useRef();

  const handleRemoveProduct = useCallback((productItem) => {
    const updatedProducts = rule.products
      .filter(product => product.value !== productItem.value)
      .map((product, index) => ({ ...product, key: index + 1 }));
    
    updateRuleProducts(rule.ruleKey, updatedProducts);
  }, [rule.products, rule.ruleKey, updateRuleProducts]);


  const confirmResources = useCallback(() => {
    const products = prodRef.current || [];
    const isValid = products.every(item => item?.quantity && item?.value);
    
    if (!isValid) {
      // Handle validation error
      return;
    }
    
    updateRuleProducts(rule.ruleKey, products);
    setShowModal(false);
  }, [rule.ruleKey, updateRuleProducts]);

  return (
    <>
      <Card className="delivery-rule-container">
        <CardHeader styles={{ display: "flex", justifyContent: "space-between" }} className="card-header-delivery">
          <p className="title">
            {t("CAMPAIGN_DELIVERY_RULE_LABEL")} {rule.ruleKey}
          </p>
          {canDelete && (
            <div
              className="hover"
              onClick={onDelete}
              style={{
                fontWeight: "600",
                fontSize: "1rem",
                color: PRIMARY_COLOR,
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <DustbinIcon /> {t("CAMPAIGN_DELETE_CONDITION_LABEL")}
            </div>
          )}
        </CardHeader>

        {/* {deliveryTypeConfig && deliveryTypeConfig?.length > 0 && (
          <LabelFieldPair style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }} className="delivery-type-radio">
            <div className="deliveryType-labelfield">
              <span className="bold">{t("HCM_DELIVERY_TYPE")}</span>
            </div>
            <RadioButtons
              options={deliveryTypeConfig}
              selectedOption={selectedDeliveryType}
              optionsKey="code"
              value={selectedDeliveryType?.code}
              onSelect={handleDeliveryTypeChange}
              t={t}
              disabled={false}
            />
          </LabelFieldPair>
        )} */}

        <AddAttributeWrapper
          rule={rule}
          attributeConfig={attributeConfig}
          operatorConfig={operatorConfig}
          projectConfig={projectConfig}
        />

        <div className="product-tag-container digit-tag-container">
          {rule.products?.map((product) => (
            product?.value && product?.quantity ? (
              <Chip
                key={product.key}
                text={product?.name}
                onClick={() => handleRemoveProduct(product)}
                className="multiselectdropdown-tag"
                hideClose={false}
              />
            ) : null
          ))}
        </div>

        <Button
          variation="secondary"
          className="add-product-btn hover"
          label={t("CAMPAIGN_ADD_PRODUCTS_BUTTON_TEXT")}
          title={t("CAMPAIGN_ADD_PRODUCTS_BUTTON_TEXT")}
          icon="AppRegistration"
          onClick={() => setShowModal(true)}
        />
      </Card>

      {showModal && (
        <PopUp
          className="campaign-product-wrapper"
          type="default"
          heading={t("CAMPAIGN_PRODUCTS_MODAL_HEADER_TEXT")}
          onOverlayClick={() => setShowModal(false)}
          onClose={() => setShowModal(false)}
          footerChildren={[
            <Button
              key="confirm"
              type="button"
              size="large"
              variation="primary"
              label={t("CAMPAIGN_PRODUCTS_MODAL_SUBMIT_TEXT")}
              title={t("CAMPAIGN_PRODUCTS_MODAL_SUBMIT_TEXT")}
              onClick={confirmResources}
            />,
          ]}
        >
          <AddProducts
            stref={prodRef}
            selectedDelivery={rule}
            confirmResources={confirmResources}
            selectedProducts={rule?.products || []}
            projectConfig={projectConfig}
          />
        </PopUp>
      )}
    </>
  );
});

const AddDeliveryRuleWrapper = React.memo(({
  projectConfig,
  attributeConfig,
  operatorConfig,
  deliveryTypeConfig
}) => {
  const {
    activeDeliveryRules,
    activeDelivery,
    addRule,
    removeRule,
    updateDeliveryTypeForEachDelivery,
    campaignData,
  } = useDeliveryRules();
  const { t } = useTranslation();

  // Filter deliveryTypeConfig based on current projectType
  const filteredDeliveryTypeConfig = useMemo(() => {
    if (!deliveryTypeConfig || !Array.isArray(deliveryTypeConfig)) {
      return [];
    }

    const currentProjectType = projectConfig?.code;

    // If no projectType is set, return all delivery types
    if (!currentProjectType) {
      return deliveryTypeConfig;
    }

    // Filter delivery types that include the current projectType in their projectTypes array
    return deliveryTypeConfig.filter((deliveryType) => {
      // If deliveryType has no projectTypes array, include it by default
      if (!deliveryType.projectTypes || !Array.isArray(deliveryType.projectTypes)) {
        return true;
      }
      // Check if current projectType is in the projectTypes array
      return deliveryType.projectTypes.includes(currentProjectType);
    });
  }, [deliveryTypeConfig, projectConfig?.code]);

  const handleAddRule = useCallback(() => {
    addRule();
  }, [addRule]);

  const handleRemoveRule = useCallback((ruleKey) => {
    removeRule(ruleKey);
  }, [removeRule]);

   const handleDeliveryTypeChange = useCallback((value) => {
    updateDeliveryTypeForEachDelivery(value?.code);
  }, [updateDeliveryTypeForEachDelivery]);

  const selectedDeliveryType = useMemo(() =>
    filteredDeliveryTypeConfig?.find(item => item.code === (activeDelivery?.deliveryType || activeDelivery?.deliveryStrategy) ) ||
    filteredDeliveryTypeConfig?.[0] // default to first option
  , [filteredDeliveryTypeConfig, activeDelivery?.deliveryType]);

  // Calculate if we can add more rules
  const canAddMore = useMemo(() => {
    if (projectConfig?.projectType === "IRS-mz") {
      const selectedStructureCodes = campaignData
        ?.flatMap(cycle => cycle?.deliveries?.flatMap(delivery =>
          delivery?.deliveryRules?.flatMap(rule =>
            rule?.attributes?.map(attribute => attribute?.value)
          )
        )) || [];
      return selectedStructureCodes.length < 4;
    }

    return !projectConfig?.deliveryAddDisable;
  }, [projectConfig, activeDeliveryRules.length, campaignData]);

  if (!attributeConfig || !operatorConfig) {
    return <Loader page variant="PageLoader" />;
  }
return (
    <>
     {filteredDeliveryTypeConfig && filteredDeliveryTypeConfig?.length > 0 && (
        <Card className="delivery-type-container">
          <LabelFieldPair style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }} className="delivery-type-radio">
            <div className="deliveryType-labelfield">
              <span className="bold">{t("HCM_DELIVERY_TYPE")}</span>
            </div>
            <RadioButtons
              options={filteredDeliveryTypeConfig}
              selectedOption={selectedDeliveryType}
              optionsKey="code"
              value={selectedDeliveryType?.code}
              onSelect={handleDeliveryTypeChange}
              t={t}
              disabled={false}
            />
          </LabelFieldPair>
        </Card>
      )}
      {activeDeliveryRules.map((rule) => (
        <AddDeliveryRule
          key={rule.ruleKey}
          rule={rule}
          attributeConfig={attributeConfig}
          operatorConfig={operatorConfig}
          deliveryTypeConfig={deliveryTypeConfig}
          projectConfig={projectConfig}
          canDelete={activeDeliveryRules.length > 1}
          onDelete={() => handleRemoveRule(rule.ruleKey)}
        />
      ))}
      
      {canAddMore && (
        <Button
          variation="secondary"
          label={t("CAMPAIGN_ADD_MORE_DELIVERY_BUTTON")}
          title={t("CAMPAIGN_ADD_MORE_DELIVERY_BUTTON")}
          className="add-rule-btn hover"
          icon="AddIcon"
          onClick={handleAddRule}
        />
      )}
    </>
  );
});

export default AddDeliveryRuleWrapper;