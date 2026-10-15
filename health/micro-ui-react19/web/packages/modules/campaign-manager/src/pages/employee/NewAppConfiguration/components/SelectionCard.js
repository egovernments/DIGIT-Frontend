import React, { useMemo } from "react";
import { Loader, SelectionTag } from "@egovernments/digit-ui-components";
import { useCustomT, useCustomTranslate } from "../hooks/useCustomT";

const SelectionCard = ({ field, t, props, data }) => {
  const selectionField = field || props?.field;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const customT = useCustomTranslate();
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  // The module this screen belongs to (e.g. "HOUSEHOLDSTRATEGY") - saved campaigns stamp the
  // same code onto each delivery as `deliveryMethod`, so this is what ties a resource card back
  // to the delivery condition it should show products for.
  const flow = data?.flow || searchParams.get("flow");

  // Check if this is a resourceCard field
  const isResourceCard = (field?.format === "custom" || props?.field?.format === "custom")
    && (field?.fieldName?.toLowerCase()?.includes("resource")
      || props?.field?.fieldName?.toLowerCase()?.includes("resource")
      || field?.fieldName?.toLowerCase()?.includes("product")
      || props?.field?.fieldName?.toLowerCase()?.includes("product"));

  // Fetch the saved campaign directly - the preview isn't guaranteed to be opened right after the
  // delivery-rule step, so it can't rely on whatever happens to still be in the client-side wizard
  // cache. Same campaign-search endpoint and call convention LocalisationAdd.js already uses.
  const { data: campaignData } = Digit.Hooks.campaign.useSearchCampaign({
    tenantId,
    filter: { campaignNumber },
    config: {
      enabled: isResourceCard && !!campaignNumber,
      select: (campaigns) => campaigns?.[0],
    },
  });

  // Read product variants from the saved campaign's delivery rules, scoped to this screen's module
  const productVariants = useMemo(() => {
    if (!isResourceCard) return [];

    try {
      const deliveryRules = campaignData?.deliveryRules;
      if (!Array.isArray(deliveryRules)) return [];

      // Extract product variants from deliveries belonging to this screen's module only
      const variantsMap = new Map();

      deliveryRules.forEach((ruleSet) => {
        if (!Array.isArray(ruleSet?.cycles)) return;
        ruleSet.cycles.forEach((cycle) => {
          if (!Array.isArray(cycle?.deliveries)) return;
          cycle.deliveries.forEach((delivery) => {
            if (flow && delivery?.deliveryMethod !== flow) return;
            if (!Array.isArray(delivery?.doseCriteria)) return;
            delivery.doseCriteria.forEach((criteria) => {
              if (!Array.isArray(criteria?.ProductVariants)) return;
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
            });
          });
        });
      });

      return Array.from(variantsMap.values());
    } catch (error) {
      console.error("Error extracting product variants:", error);
      return [];
    }
  }, [isResourceCard, campaignData, flow]);

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
  } else if (selectionField?.isMdms) {
    // The app renders the config's enums (its per-campaign selection of the master options,
    // filtered by isActive) — mirror that here so the preview matches the device. Fall back to
    // the full master list only when the config carries no selection yet.
    options = hasValidEnums
      ? selectionField.enums.filter((o) => o?.isActive !== false)
      : hasValidMdmsData
      ? mdmsData
      : [];
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
      allowMultipleSelection={selectionField?.isMultiSelect || false}
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