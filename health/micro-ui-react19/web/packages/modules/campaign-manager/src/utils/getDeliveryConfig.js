import { useProductVariantSearch } from "../hooks/useProductVariantSearch";
const getDeliveryConfig = ({ data, projectType }) => {
  function parseCondition(condition) {
    let operatorValue = "";
    let value = "";

    const betweenRegex = /(\d+)\s*<=?\s*([a-zA-Z]+)\s*<=?\s*(\d+)/;
    const operatorRegex = /([a-zA-Z_]+)\s*(==|<=?|>=?|=|<|>)\s*([a-zA-Z0-9_]+)/;

    if (betweenRegex.test(condition)) {
      const match = condition.match(betweenRegex);
      const minValue = match[1];
      const variable = match[2];
      const maxValue = match[3];
      operatorValue = "IN_BETWEEN";
      value = { minValue, maxValue, variable };
    } else if (operatorRegex.test(condition)) {
      const match = condition.match(operatorRegex);
      const variable = match[1];
      const operator = match[2];
      const comparisonValue = match[3];

      switch (operator) {
        case "==":
        case "=":
          operatorValue = "EQUAL_TO";
          break;
        case "<=":
          operatorValue = "LESS_THAN_EQUAL_TO";
          break;
        case ">=":
          operatorValue = "GREATER_THAN_EQUAL_TO";
          break;
        case "<":
          operatorValue = "LESS_THAN";
          break;
        case ">":
          operatorValue = "GREATER_THAN";
          break;
        default:
          operatorValue = "UNKNOWN";
      }
      value = { variable, comparisonValue };
    } else {
      console.warn("Failed to parse condition:", condition);
    }

    return { operatorValue, value };
  }

const generateConfig = (data) => {
  
  return data?.deliveries?.map(delivery => {
    const conditionConfig = delivery.doseCriteria.map((dose, index) => {
      const productConfig = dose.ProductVariants.map(variant => ({
        key: 1,
        name: variant.name,
        quantity: variant.quantity || 1,
        value: variant.productVariantId
      }));
      
      // Normalize and split the condition by 'and' to handle multiple conditions
      // Replace all "and" with " and " to ensure proper splitting
      const normalizedCondition = dose.condition
        .replace(/and/gi, ' and ')  // Replace all "and" with " and " (with spaces)
        .replace(/\s+/g, ' ')       // Collapse multiple spaces into single space
        .trim();                     // Remove leading/trailing spaces

      const conditions = normalizedCondition.split(' and ').filter(c => c.trim());

      const attributeConfigs = [];
      const processedIndices = new Set();

      for (let ci = 0; ci < conditions.length; ci++) {
        if (processedIndices.has(ci)) continue;
        const condition = conditions[ci].trim();

        // Check for single-expression IN_BETWEEN: "3<=age<=11"
        const { operatorValue, value } = parseCondition(condition);
        if (operatorValue === "IN_BETWEEN") {
          attributeConfigs.push({
            key: index + 1,
            label: "Custom",
            attrType: value?.variable,
            attrValue: value?.variable,
            operatorValue: "IN_BETWEEN",
            fromValue: Number(value.minValue),
            toValue: Number(value.maxValue),
          });
          continue;
        }

        // Check consecutive pair IN_BETWEEN: "3<=age" + "age<=11"
        if (ci + 1 < conditions.length) {
          const nextCondition = conditions[ci + 1].trim();
          const lowerMatch = condition.match(/^(\d+(?:\.\d+)?)\s*(<=|<)\s*(.+)$/);
          const upperMatch = nextCondition.match(/^(.+?)\s*(<=|<)\s*(\d+(?:\.\d+)?)$/);

          if (lowerMatch && upperMatch && lowerMatch[3].trim().toLowerCase() === upperMatch[1].trim().toLowerCase()) {
            attributeConfigs.push({
              key: index + 1,
              label: "Custom",
              attrType: lowerMatch[3].trim(),
              attrValue: lowerMatch[3].trim(),
              operatorValue: "IN_BETWEEN",
              fromValue: Number(lowerMatch[1]),
              toValue: Number(upperMatch[3]),
            });
            processedIndices.add(ci + 1);
            continue;
          }
        }

        // Regular condition
        if (operatorValue && operatorValue !== "UNKNOWN") {
          attributeConfigs.push({
            key: index + 1,
            label: "Custom",
            attrType: value?.variable,
            attrValue: value?.variable,
            operatorValue: operatorValue,
            value: value?.comparisonValue,
            ...(value?.comparisonValue !== undefined && !isNaN(Number(value.comparisonValue)) && { fromValue: Number(value.comparisonValue) }),
          });
        }
      }

      return {
        deliveryType: delivery.deliveryStrategy,
        productConfig,
        attributeConfig: attributeConfigs, // Use the array of attributeConfigs
        disableDeliveryType: index === 0
      };
    });


    return {
      delivery: delivery.id,
      conditionConfig
    };
  });
};

  const deliveryConfig = ({ data, projectType }) => {
    return generateConfig(data?.cycles?.[0], projectType);
  };

  function convertToConfig(data) {
    return {
      beneficiaryType: data?.beneficiaryType,
      code: data?.code,
      projectType: data?.code,
      attrAddDisable: data?.attrAddDisable || false,
      // attrAddDisable : false,
      deliveryAddDisable: data?.deliveryAddDisable || false,
      customAttribute: data?.customAttribute || true,
      productCountHide: data?.productCountHide || false,
      eligibilityCriteria: data?.eligibilityCriteria,
      dashboardUrls: data?.dashboardUrls,
      taskProcedure: data?.taskProcedure,
      resources: data?.resources,
      IsCycleDisable: data?.IsCycleDisable,
      cycleConfig: {
        cycle: data?.cycles?.length || 1,
        deliveries: data?.cycles?.[0]?.deliveries?.length || 1,
        IsDisable: data?.IsCycleDisable || false,
      },
      deliveryConfig: deliveryConfig({ data, projectType: data?.code }),
    };
  }
  return convertToConfig(data?.projectTypes?.filter((e) => e.code == projectType)?.[0]);
};
export default getDeliveryConfig;
