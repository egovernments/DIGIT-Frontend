import React, { useMemo } from "react";
import { Loader, SelectionTag } from "@egovernments/digit-ui-components";

const SelectionCard = ({ field, t, props }) => {
  const selectionField = field || props?.field;
  const isMdmsEnabled = !!selectionField?.isMdms && !!selectionField?.schemaCode;

  // Check if this is a resourceCard field
  const isResourceCard = (field?.format === "custom" || props?.field?.format === "custom")
    && (field?.fieldName?.toLowerCase()?.includes("resource")
      || props?.field?.fieldName?.toLowerCase()?.includes("resource")
      || field?.fieldName?.toLowerCase()?.includes("product")
      || props?.field?.fieldName?.toLowerCase()?.includes("product"));

  // Fetch product variants from session storage for resourceCard
  const productVariants = useMemo(() => {
    if (!isResourceCard) return [];

    try {
      const sessionData = Digit.SessionStorage.get("HCM_ADMIN_CONSOLE_UPLOAD_DATA");
      if (!sessionData) return [];

      const deliveryData = sessionData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule;

      if (!deliveryData || !Array.isArray(deliveryData)) return [];

      // Extract all product variants from all cycles and deliveries
      const variantsMap = new Map();

      deliveryData?.forEach((campaign) => {
        if (campaign?.cycles && Array.isArray(campaign.cycles)) {
          campaign.cycles.forEach((cycle) => {
            if (cycle?.deliveries && Array.isArray(cycle.deliveries)) {
              cycle.deliveries.forEach((delivery) => {
                if (delivery?.doseCriteria && Array.isArray(delivery.doseCriteria)) {
                  delivery.doseCriteria.forEach((criteria) => {
                    if (criteria?.ProductVariants && Array.isArray(criteria.ProductVariants)) {
                      criteria.ProductVariants.forEach((variant) => {
                        if (variant?.productVariantId && variant?.name) {
                          // Use productVariantId as key to avoid duplicates
                          variantsMap.set(variant.productVariantId, {
                            code: variant.productVariantId,
                            name: variant.name,
                            productVariantId: variant.productVariantId,
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });

      return Array.from(variantsMap.values());
    } catch (error) {
      console.error("Error extracting product variants:", error);
      return [];
    }
  }, [isResourceCard]);


  const { isLoading, data } = Digit?.Hooks.useCustomMDMS(
    Digit?.ULBService?.getStateId(),
    selectionField?.schemaCode?.split(".")[0],
    [{ name: selectionField?.schemaCode?.split(".")[1] }],
    {
      select: (data) => {
        const optionsData = _.get(data, `${selectionField?.schemaCode?.split(".")[0]}.${selectionField?.schemaCode?.split(".")[1]}`, []);
        return optionsData
          .filter((opt) => (opt?.hasOwnProperty("active") ? opt.active : true))
          .map((opt) => ({
            ...opt,
            name: `${Digit.Utils.locale.getTransformedLocale(opt.code)}`,
          }));
      },
      enabled: isMdmsEnabled,
    },
    isMdmsEnabled // mdmsv2
  );

  if (isLoading) return <Loader />;

  // Determine options based on field type
  const options = isResourceCard
    ? productVariants
    : !!selectionField?.isMdms && !!selectionField?.schemaCode && data
      ? data
      : selectionField?.enums?.filter((o) => o.isActive !== false) || [];

  return (
    <SelectionTag
      errorMessage=""
      onSelectionChanged={() => { }}
      options={options}
      optionsKey={"name"}
      selected={[]}
      withContainer={true}
      populators={{
        t: isResourceCard ? t : field ? t : props?.t,
      }
      }
    />
  );
};

export default SelectionCard;