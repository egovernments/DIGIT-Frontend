import React, { Fragment, useEffect, useState } from "react";
// import { dummyMaster } from "../../../configs/dummyMaster";
//production mode
import { Loader, useCustomT } from "@egovernments/digit-ui-components";
import AppLocalisationWrapper from "./AppLocalisationWrapper";
//development mode
import AppPreview from "../../../components/AppPreview";

function ImpelComponentWrapper({ variant, screenConfig, submit, back, showBack, parentDispatch, localeModule, pageTag, formName, formDescription, onFormNameChange, onFormDescriptionChange, ...props }) {
  const MODULE_CONSTANTS = "Studio";
  const searchParams = new URLSearchParams(location.search);
  const fieldMasterName = searchParams.get("fieldType");
  const { isLoading: isLoadingAppConfigMdmsData, data: AppConfigMdmsData } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    MODULE_CONSTANTS,
    [{ name: fieldMasterName, limit: 100 }],
    {
      cacheTime: Infinity,
      staleTime: Infinity,
      select: (data) => {
        return data?.[MODULE_CONSTANTS]?.[fieldMasterName];
      },
    },
    { schemaCode: "APP_FIELD_TYPE_FETCH_IMPE" } //mdmsv2
  );

  if (isLoadingAppConfigMdmsData) return <Loader page={true} variant={"PageLoader"} />;
  // const AppConfigMdmsData = dummyMaster?.[MODULE_CONSTANTS]?.[fieldMasterName];
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

  const formBuilderRestructure = (data, api, mdms) => {
    const correctField = (key) => {
      switch (key) {
        case "textInput":
          return "text";
        case "datePicker":
          return "date";
        case "dropdown":
          if (api) return "APIDropdown";
          if (mdms) return "MDMSDropdown";
          return "dropdown";
        default:
          return key;
      }
    };

    const addingValidations = (field) => {
      switch (field.type) {
        case "number":
          if (!field.min && !field.max) return {};
          return {
            validation: {
              min: field.min,
              max: field.max,
            },
          };
          break;
        case "datePicker":
          if (!field.endDate && !field.startDate) return {};
          return {
            min: Digit.Utils.date.convertEpochToDate(field.startDate),
            max: Digit.Utils.date.convertEpochToDate(field.endDate),
          };
          break;

        default:
          break;
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
            type: correctField(field.type, field.isApi, field.isMdms),
            isMandatory: field.required || false,
            jsonPath: field.jsonPath,
            populators: {
              isMandatory: field.required || false,
              name: field.id || field.jsonPath,
              options: field?.dropDownOptions || [],
              optionsKey: field?.optionsKey || "name",
              reqCriteria: field.isApi ? field?.reqCriteria : null,
              ...addingValidations(field),
              ...field.metaData,
            },
            inline: field?.inline || true,
          };
        }),
      };
    });
    return formConfig;
  };

  function convertToJSONSchema(input) {
    const schema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "Generated schema for Root",
      type: "object",
      properties: {},
      required: [],
    };

    // Extract schema label
    if (input.cards && input.cards.length > 0) {
      const headerFields = input.cards[0].headerFields || [];
      const schemaLabelField = headerFields.find((field) => field.jsonPath === "ScreenHeading");
      if (schemaLabelField) {
        schema.title = schemaLabelField.value || "Generated schema for Root";
      }
    }

    // Extract fields
    if (input.cards && input.cards.length > 0) {
      input.cards.forEach((card) => {
        card.fields.forEach((field) => {
          const key = field.label;
          const typeMapping = {
            boolean: "boolean",
            array: "array",
            text: "string",
            number: "number",
          };

          schema.properties[key] = {
            type: typeMapping[field.type] || "string",
          };

          if (field.required || field.Mandatory) {
            schema.required.push(key);
          }
        });
      });
    }

    return JSON.stringify(schema, null, 2);
  }

  const onSubmit = (state, finalSubmit) => {
    const restructuredData =
      variant === "web"
        ? formBuilderRestructure(state?.screenData)
        : variant === "schema"
        ? convertToJSONSchema(state?.screenData?.[0])
        : state?.screenData;
    submit(restructuredData, finalSubmit);
  };

  // if (process.env.NODE_ENV === "development") {
  //   return (
  //     //development mode
  //     <AppLocalisationWrapperDev
  //       onSubmit={onSubmit}
  //       back={back}
  //       showBack={showBack}
  //       screenConfig={screenConfig}
  //       parentDispatch={parentDispatch}
  //       localeModule={localeModule}
  //       pageTag={pageTag}
  //     />
  //   );
  // }
  return (
    //production mode
    <AppLocalisationWrapper
      onSubmit={onSubmit}
      back={back}
      showBack={showBack}
      screenConfig={screenConfig}
      parentDispatch={parentDispatch}
      localeModule={localeModule}
      pageTag={pageTag}
      formName={formName}
      formDescription={formDescription}
      onFormNameChange={onFormNameChange}
      onFormDescriptionChange={onFormDescriptionChange}
    >
      <AppPreview />
    </AppLocalisationWrapper>
  );
}

export default React.memo(ImpelComponentWrapper);
