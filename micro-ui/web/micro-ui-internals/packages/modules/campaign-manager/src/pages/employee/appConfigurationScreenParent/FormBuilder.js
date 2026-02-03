import { Loader } from "@egovernments/digit-ui-components";
import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const FormBuilder = () => {
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(location.search);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const moduleName = searchParams.get("moduleName");
  const masterName = searchParams.get("masterName");
  const formId = searchParams.get("formId");
  const module = "dummy-localisation";
  const { data: storeData, isLoading: isStoreLoading } = Digit.Hooks.useStore.getInitData();

  const initData =  Digit.SessionStorage.get("cachingService") ;
  

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
        return data;
      },
    },
  });

  if (isLoadingFormBuilderConfig) {
    return <Loader />;
  }

  return (
    <div>
      <FormComposerV2
        config={[formBuilderConfig?.[0]?.data]?.map((c) => {
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

export default FormBuilder;
