import { useProductVariantSearch } from "../hooks/useProductVariantSearch";
const getDeliveryConfig = ({ data, projectType }) => {
  function parseCondition(condition) {
    let operatorValue = "";
    let value = "";

    const betweenRegex = /(\d+)\s*<=\s*([a-zA-Z]+)\s*<=\s*(\d+)/;
    const operatorRegex = /([a-zA-Z_]+)\s*(<=?|>=?|=|<|>)\s*([a-zA-Z0-9_]+)/;

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
        case "=":
          operatorValue = "EQUAL_TO";
          break;
        default:
          operatorValue = "UNKNOWN";
      }
      value = { variable, comparisonValue };
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
      
      // Split the condition by 'and' to handle multiple conditions
      const conditions = dose.condition.split('and');
      
      const attributeConfigs = conditions.map(condition => {
        // Use the parseCondition function to extract operatorValue and value
        const { operatorValue, value } = parseCondition(condition);
        let fromValue = null;
            let toValue = null;
            if (operatorValue === "IN_BETWEEN") {
              fromValue = Number(value.minValue);
              toValue = Number(value.maxValue);
            } else {
              fromValue = Number(value.comparisonValue);
              toValue = null;
            }

            return {
              key: index + 1,
              label: "Custom",
              attrType: value?.variable,
              attrValue: value?.variable,
              operatorValue: operatorValue,
              value: value?.comparisonValue,
              ...(fromValue !== null && { fromValue }),
              ...(toValue !== null && { toValue }),
            };
      });

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
