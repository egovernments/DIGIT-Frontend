import { Loader } from "@egovernments/digit-ui-components";
import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

function transformSchema(data) {
  return Object.keys(data.properties).map((key) => {
    // Check if the key is required to set isMandatory
    const isMandatory = data.required.includes(key);

    return {
      body: [
        {
          label: key, // The key itself is used as the label
          type: "text", // Hardcoded type to "text"
          isMandatory: isMandatory,
          disable: false, // Assuming "disable" is always false
          populators: {
            name: key,
            value: data.properties[key].type || "", // Default value from the schema
          }, // Empty populators object
        },
      ],
    };
  });
}
const SchemaBuilder = () => {
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(location.search);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const moduleName = searchParams.get("moduleName");
  const masterName = searchParams.get("masterName");
  const formId = searchParams.get("formId");
  const module = "dummy-localisation";

  const { isLoading: isLoadingFormBuilderConfig, data: formBuilderConfig } = Digit.Hooks.campaign.useMDMSV2Search({
    tenantId: tenantId,
    moduleName: moduleName,
    masterName: masterName,
    formId: formId,
    config: {
      enabled: true,
      staleTime: 0,
      cacheTime: 0,
      select: (data) => {
        return data?.[0]?.data ? transformSchema(data?.[0]?.data) : null;
      },
    },
  });

  if (isLoadingFormBuilderConfig) {
    return <Loader />;
  }

  return (
    <div>
      <FormComposerV2
        config={formBuilderConfig?.map((c) => {
          return {
            ...c,
          };
        })}
        onSubmit={() => {}}
        label={t("SUBMIT_BUTTON")}
        showMultipleCardsWithoutNavs={true}
        fieldStyle={{ marginRight: 0 }}
        noBreakLine={true}
        cardClassName={"page-padding-fix"}
        onFormValueChange={() => {}}
        actionClassName={"addProductActionClass"}
        showSecondaryLabel={false}
      />
    </div>
  );
};

export default SchemaBuilder;
