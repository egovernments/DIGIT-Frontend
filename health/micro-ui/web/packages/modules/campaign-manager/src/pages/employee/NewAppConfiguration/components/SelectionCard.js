import React, { useMemo } from "react";
import { Loader, SelectionTag } from "@egovernments/digit-ui-components";
import { useCustomT, useCustomTranslate } from "../hooks/useCustomT";

const SelectionCard = ({ field, t, props }) => {
  const selectionField = field || props?.field;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const customT = useCustomTranslate();

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

  // Parse schemaCode to get moduleName and masterName
  const { moduleName, masterName, isValidSchema } = useMemo(() => {
    if (!selectionField?.isMdms || !selectionField?.schemaCode || typeof selectionField.schemaCode !== 'string') {
      return { moduleName: null, masterName: null, isValidSchema: false };
    }

    const schemaParts = selectionField.schemaCode.split(".");
    if (schemaParts.length < 2) {
      return { moduleName: null, masterName: null, isValidSchema: false };
    }

    return {
      moduleName: schemaParts[0]?.trim(),
      masterName: schemaParts[1]?.trim(),
      isValidSchema: true,
    };
  }, [selectionField?.isMdms, selectionField?.schemaCode]);

  // Fetch MDMS data if field has valid MDMS configuration
  const { isLoading, data: mdmsData } = Digit?.Hooks.useCustomMDMS(
    tenantId,
    moduleName,
    [{ name: masterName }],
    {
      enabled: isValidSchema && !!moduleName && !!masterName,
      select: (data) => {
        // Extract the data from the MDMS response
        if (data && moduleName && masterName) {
          const optionsData = data?.[moduleName]?.[masterName] || [];
          return optionsData
            .filter((opt) => (opt?.hasOwnProperty("active") ? opt.active : true))
            .map((opt) => ({
              ...opt,
              name: `${Digit.Utils.locale.getTransformedLocale(opt.code)}`,
            }));
        }
        return [];
      },
    },
    {
      schemaCode: isValidSchema ? `${moduleName}.${masterName}` : undefined,
    }
  );

  if (isLoading) return <Loader />;

  // Helper function to generate fallback options based on label
  const generateFallbackOptions = (label) => {
    if (!label) return [];
    const baseLabel = label;
    return [
      { code: `${baseLabel}_OPTION_1`, name: `${customT(baseLabel)} 1` },
      { code: `${baseLabel}_OPTION_2`, name: `${customT(baseLabel)} 2` },
      { code: `${baseLabel}_OPTION_3`, name: `${customT(baseLabel)} 3` },
    ];
  };

  // Check if we have valid static data
  const hasValidEnums = Array.isArray(selectionField?.enums) && selectionField.enums.length > 0;
  const hasValidDropdownOptions = Array.isArray(selectionField?.dropDownOptions) && selectionField.dropDownOptions.length > 0;
  const hasValidMdmsData = isValidSchema && mdmsData && mdmsData.length > 0;
  const hasValidResourceData = isResourceCard && productVariants && productVariants.length > 0;

  // Determine options based on field type
  let options = [];

  if (isResourceCard) {
    if (hasValidResourceData) {
      options = productVariants;
    }
    else {
      options = generateFallbackOptions(selectionField?.label || selectionField?.fieldName);
    }
  } else if (hasValidMdmsData) {
    options = mdmsData;
  } else if (hasValidEnums) {
    options = selectionField.enums.filter((o) => o.isActive !== false);
  } else if (hasValidDropdownOptions) {
    options = selectionField.dropDownOptions.filter((o) => o?.isActive !== false);
  } else {
    // No valid static data - generate fallback options from label
    options = [];
  }

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