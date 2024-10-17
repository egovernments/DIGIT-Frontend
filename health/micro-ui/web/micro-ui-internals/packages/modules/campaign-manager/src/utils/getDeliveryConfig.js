import { useProductVariantSearch } from "../hooks/useProductVariantSearch";
const getDeliveryConfig = ({ data, projectType }) => {
  function parseCondition(condition) {
    let operatorValue = "";
    let value = "";

    const betweenRegex = /(\d+)\s*<=?\s*([a-zA-Z]+)\s*<\s*(\d+)/;
    const operatorRegex = /([a-zA-Z_]+)\s*(<=?|>=?|=|<|>)\s*([a-zA-Z0-9_]+)/;

    const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    if (betweenRegex.test(condition)) {
      const match = condition.match(betweenRegex);
      const minValue = match[1];
      const variable = capitalizeFirstLetter(match[2]);
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

  const generateBednetConfig = (deliveries, projectType) => {
    return deliveries?.map((delivery) => {
      const productSet = new Set();
      const productConfig = [];
      delivery.doseCriteria.forEach((criteria) => {
        criteria.ProductVariants.forEach((variant) => {
          if (!productSet.has(variant.productVariantId)) {
            productSet.add(variant.productVariantId);
            productConfig.push({
              key: productConfig.length + 1,
              count: variant.quantity || 1,
              value: variant.productVariantId,
              name: variant.name,
            });
          }
        });
      });
      const attributeConfig = delivery.doseCriteria.map((criteria, index) => {
        const conditions = criteria.condition.split("and");
        return conditions.map((conditionPart, subIndex) => {
          const { operatorValue, value } = parseCondition(conditionPart.trim()); 
  
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
            key: index + 1 + subIndex,
            label: "Custom",
            attrType: criteria.attrType,
            attrValue: value?.variable,
            operatorValue: operatorValue,
            value: value?.comparisonValue,
          };
        });
      }).flat(); 
  
      return {
        attributeConfig: attributeConfig,
        productConfig: productConfig,
      };
    });
  };
  

  const generateMRDNConfig = (deliveries) => {
    const deliveryConfig = deliveries.map((delivery, deliveryIndex) => {
      return {
        delivery: delivery.id, 
        conditionConfig: delivery.deliveries.map((deliveryItem, conditionIndex) => {
          return {
            disableDeliveryType: deliveryItem.deliveryStrategy === "DIRECT",
            deliveryType: deliveryItem.deliveryStrategy,
            attributeConfig: deliveryItem.doseCriteria.map((criteria, attrIndex) => {
              const { operatorValue, value } = parseCondition(criteria.condition);
  
              return {
                key: `${conditionIndex + 1}-${attrIndex + 1}`, 
                label: "Custom",
                attrType: criteria.attrType || "dropdown",
                attrValue: value.variable, 
                operatorValue,
                fromValue: Number(value.minValue),
                toValue: Number(value.maxValue) - 1
              };
            }),
            productConfig: deliveryItem.doseCriteria.flatMap((criteria, prodIndex) => {
              return criteria.ProductVariants.map((variant, varIndex) => {
                // if(variant?.productVariantId){
                //   productName = useProductVariantSearch({ variantId: variant.productVariantId, tenantId: "mz" });
                // }
                // const productName = useProductVariantSearch({ variantId: variant.productVariantId, tenantId: "mz" });
  
                return {
                  key: `${conditionIndex + 1}-${varIndex + 1}`,
                  count: variant.quantity,
                  value: variant.productVariantId,
                  name: variant.name
                };
              });
            })
          };
        })
      };
    });
    return deliveryConfig;
  };
  
  const deliveryConfig = ({ data, projectType }) => {
    switch (projectType) {
      case "MR-DN":
        return generateMRDNConfig(data?.cycles, projectType);
      case "LLIN-mz":
      case "IRS-mz":
        return generateBednetConfig(data?.cycles?.[0]?.deliveries, projectType);
      default:
        return [];
    }
  };

  function convertToConfig(data) {
    return {
      beneficiaryType: data?.beneficiaryType, 
      code: data?.code,
      projectType: data?.code,
      attrAddDisable: data?.attrAddDisable || false,
      deliveryAddDisable: data?.deliveryAddDisable || false,
      customAttribute: data?.customAttribute || true,
      productCountHide: data?.productCountHide || false,
      eligibilityCriteria: data?.eligibilityCriteria,
      dashboardUrls: data?.dashboardUrls,
      taskProcedure: data?.taskProcedure,
      resources: data?.resources,
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
