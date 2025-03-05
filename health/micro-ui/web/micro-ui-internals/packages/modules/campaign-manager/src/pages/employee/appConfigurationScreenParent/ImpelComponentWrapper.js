import React, { Fragment, useEffect, useState } from "react";
import AppLocalisationWrapper from "./AppLocalisationWrapper";

function ImpelComponentWrapper({ variant, screenConfig, submit, back, showBack, parentDispatch, ...props }) {
  const MODULE_CONSTANTS = "HCM-ADMIN-CONSOLE";
  const searchParams = new URLSearchParams(location.search);
  const fieldMasterName = searchParams.get("fieldType");
  const { isLoading: isLoadingAppConfigMdmsData, data: AppConfigMdmsData } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    MODULE_CONSTANTS,
    [{ name: fieldMasterName }],
    {
      cacheTime: Infinity,
      staleTime: Infinity,
      select: (data) => {
        return data?.[MODULE_CONSTANTS]?.[fieldMasterName];
      },
    },
    { schemaCode: "APP_FIELD_TYPE_FETCH_IMPE" } //mdmsv2
  );

  function restructure(temp) {
    const xx = temp.map((item, index, arr) => {
      return {
        type: "page",
        name: item?.name,
        components: item?.cards?.map((m, n, o) => {
          return {
            title: m?.headerFields?.find((i) => i.jsonPath === "SectionHeading")?.value,
            order: n + 1,
            description: m?.headerFields?.find((i) => i.jsonPath === "Description")?.value,
            attributes: m?.fields?.map((p, q, r) => {
              return {
                name: p.label,
                label: p.label,
                type: "additionalField",
                attribute: p.type,
                order: q + 1,
                ...(AppConfigMdmsData?.AppFieldType?.find((i) => i.type === p.type)?.metadata || {}),
              };
            }),
          };
        }),
      };
    });

    return xx;
  }

  const formBuilderRestructure = (data) => {
    const correctField = (key) => {
      switch (key) {
        case "textInput":
          return "text";
        case "datePicker":
          return "date";
        default:
          return key;
      }
    };

    const formConfig = data?.[0]?.cards?.map((item) => {
      return {
        head: item?.headerFields?.find((i) => i.jsonPath === "ScreenHeading")?.value,
        description: item?.headerFields?.find((i) => i.jsonPath === "Description")?.value,
        body: item.fields.map((field) => {
          return {
            key: field.id || field.jsonPath,
            label: field.label,
            type: correctField(field.type),
            isMandatory: field.required || false,
            jsonPath: field.jsonPath,
            populators: {
              isMandatory: field.required || false,
              name: field.id || field.jsonPath,
              options: field?.dropDownOptions || [],
              optionsKey: field?.optionsKey || "name",
              ...field.metaData,
            },
            inline: field?.inline || true,
          };
        }),
      };
    });
    return formConfig;
  };
  const onSubmit = (state) => {
    const restructuredData = variant === "web" ? formBuilderRestructure(state?.screenData) : restructure(state?.screenData);
    console.log("restructuredData", restructuredData);
    submit(restructuredData);
  };

  // onSubmit();
  return <AppLocalisationWrapper onSubmit={onSubmit} back={back} showBack={showBack} screenConfig={screenConfig} parentDispatch={parentDispatch} />;
}

export default ImpelComponentWrapper;
