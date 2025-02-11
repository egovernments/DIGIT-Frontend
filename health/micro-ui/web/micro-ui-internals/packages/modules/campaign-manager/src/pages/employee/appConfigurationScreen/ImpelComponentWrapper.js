import React, { Fragment, useEffect, useState } from "react";
import AppLocalisationWrapper from "./AppLocalisationWrapper";

function ImpelComponentWrapper() {
  const MODULE_CONSTANTS = "HCM-ADMIN-CONSOLE";
  const [impelState, setImpelState] = useState(null);
  const { isLoading: isLoadingAppConfigMdmsData, data: AppConfigMdmsData } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    MODULE_CONSTANTS,
    [{ name: "AppScreenConfigTemplateSchema" }, { name: "AppFieldType" }, { name: "DrawerPanelConfig" }, { name: "AppScreenLocalisationConfig" }],
    {
      cacheTime: Infinity,
      staleTime: Infinity,
      select: (data) => {
        return data?.[MODULE_CONSTANTS];
      },
    },
    { schemaCode: "BASE_APP_MASTER_DATA2" } //mdmsv2
  );

  useEffect(() => {
    if (!isLoadingAppConfigMdmsData && AppConfigMdmsData) {
    }
  }, [AppConfigMdmsData, isLoadingAppConfigMdmsData]);

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
  const onSubmit = (data) => {
    // const dummy = [
    //   {
    //     name: "INDIVIDUAL_LOCATION",
    //     cards: [
    //       {
    //         fields: [
    //           {
    //             id: "7513c01b-b774-450a-8b92-7087c3c3974b",
    //             type: "textInput",
    //             label: "MR_DN_REGISTRATION_INDIVIDUAL_LOCATION_label_7513c01b-b774-450a-8b92-7087c3c3974b",
    //             active: true,
    //           },
    //         ],
    //         header: "Header",
    //         description: "Desc",
    //         headerFields: [
    //           {
    //             type: "text",
    //             label: "SECTION_HEADING",
    //             active: true,
    //             jsonPath: "SectionHeading",
    //             metaData: {},
    //             required: true,
    //             value: "MR_DN_REGISTRATION_INDIVIDUAL_LOCATION_SECTION_HEADING",
    //           },
    //           {
    //             type: "text",
    //             label: "SECTION_DESCRIPTION",
    //             active: true,
    //             jsonPath: "Description",
    //             metaData: {},
    //             required: true,
    //             value: "MR_DN_REGISTRATION_INDIVIDUAL_LOCATION_SECTION_DESCRIPTION",
    //           },
    //         ],
    //       },
    //     ],
    //     order: 4,
    //     config: {
    //       enableComment: true,
    //       enableFieldAddition: true,
    //       allowFieldsAdditionAt: ["body"],
    //       enableSectionAddition: true,
    //       allowCommentsAdditionAt: ["body"],
    //     },
    //     parent: "REGISTRATION",
    //     headers: [],
    //   },
    //   {
    //     name: "INDIVIDUAL_DETAIL",
    //     cards: [
    //       {
    //         fields: [
    //           {
    //             id: "30b77072-4102-4a75-932e-50a528b48862",
    //             type: "textInput",
    //             label: "MR_DN_REGISTRATION_INDIVIDUAL_DETAIL_label_30b77072-4102-4a75-932e-50a528b48862",
    //             active: true,
    //           },
    //         ],
    //         header: "Header",
    //         description: "Desc",
    //         headerFields: [
    //           {
    //             type: "text",
    //             label: "SECTION_HEADING",
    //             active: true,
    //             jsonPath: "SectionHeading",
    //             metaData: {},
    //             required: true,
    //             value: "MR_DN_REGISTRATION_INDIVIDUAL_DETAIL_SECTION_HEADING",
    //           },
    //           {
    //             type: "text",
    //             label: "SECTION_DESCRIPTION",
    //             active: true,
    //             jsonPath: "Description",
    //             metaData: {},
    //             required: true,
    //             value: "MR_DN_REGISTRATION_INDIVIDUAL_DETAIL_SECTION_DESCRIPTION",
    //           },
    //         ],
    //       },
    //       {
    //         fields: [
    //           {
    //             id: "3636d193-1942-4f9a-9190-2ea75ddb3f91",
    //             type: "counter",
    //             label: "MR_DN_REGISTRATION_INDIVIDUAL_DETAIL_label_3636d193-1942-4f9a-9190-2ea75ddb3f91",
    //             active: true,
    //           },
    //         ],
    //         header: "Header",
    //         description: "Desc",
    //         headerFields: [
    //           {
    //             type: "text",
    //             label: "SCREEN_HEADING",
    //             active: true,
    //             jsonPath: "ScreenHeading",
    //             metaData: {},
    //             required: true,
    //             value: "MR_DN_REGISTRATION_INDIVIDUAL_DETAIL_SCREEN_HEADING",
    //           },
    //           {
    //             type: "text",
    //             label: "SCREEN_DESCRIPTION",
    //             active: true,
    //             jsonPath: "Description",
    //             metaData: {},
    //             required: true,
    //             value: "MR_DN_REGISTRATION_INDIVIDUAL_DETAIL_SCREEN_DESCRIPTION",
    //           },
    //         ],
    //       },
    //     ],
    //     order: 3,
    //     config: {
    //       enableComment: true,
    //       enableFieldAddition: true,
    //       allowFieldsAdditionAt: ["body"],
    //       enableSectionAddition: true,
    //       allowCommentsAdditionAt: ["body"],
    //     },
    //     parent: "REGISTRATION",
    //     headers: [],
    //   },
    //   {
    //     name: "HOUSEHOLD_DETAILS",
    //     cards: [
    //       {
    //         fields: [
    //           {
    //             type: "number",
    //             label: "MR_DN_REGISTRATION_HOUSEHOLD_DETAILS_label_undefined",
    //             active: true,
    //             jsonPath: "apartment",
    //             metaData: {},
    //             required: true,
    //             deleteFlag: false,
    //             Mandatory: true,
    //           },
    //         ],
    //         header: "Header",
    //         description: "Desc",
    //         headerFields: [
    //           {
    //             type: "text",
    //             label: "SCREEN_HEADING",
    //             active: true,
    //             jsonPath: "ScreenHeading",
    //             metaData: {},
    //             required: true,
    //             value: "MR_DN_REGISTRATION_HOUSEHOLD_DETAILS_SCREEN_HEADING",
    //           },
    //           {
    //             type: "text",
    //             label: "SCREEN_DESCRIPTION",
    //             active: true,
    //             jsonPath: "Description",
    //             metaData: {},
    //             required: true,
    //             value: "MR_DN_REGISTRATION_HOUSEHOLD_DETAILS_SCREEN_DESCRIPTION",
    //           },
    //         ],
    //       },
    //     ],
    //     order: 2,
    //     config: {
    //       enableComment: false,
    //       enableFieldAddition: true,
    //       allowFieldsAdditionAt: ["body"],
    //       enableSectionAddition: false,
    //       allowCommentsAdditionAt: ["body"],
    //     },
    //     parent: "REGISTRATION",
    //     headers: [],
    //   },
    //   {
    //     name: "HOUSEHOLD_LOCATION",
    //     cards: [
    //       {
    //         fields: [
    //           {
    //             type: "textInput",
    //             label: "MR_DN_REGISTRATION_HOUSEHOLD_LOCATION_label_undefined",
    //             active: true,
    //             jsonPath: "addressLine1",
    //             metaData: {},
    //             required: true,
    //             deleteFlag: false,
    //             Mandatory: true,
    //           },
    //         ],
    //         header: "Header",
    //         description: "Desc",
    //         headerFields: [
    //           {
    //             type: "text",
    //             label: "SCREEN_HEADING",
    //             active: true,
    //             jsonPath: "ScreenHeading",
    //             metaData: {},
    //             required: true,
    //             value: "MR_DN_REGISTRATION_HOUSEHOLD_LOCATION_SCREEN_HEADING",
    //           },
    //           {
    //             type: "text",
    //             label: "SCREEN_DESCRIPTION",
    //             active: true,
    //             jsonPath: "Description",
    //             metaData: {},
    //             required: true,
    //             value: "MR_DN_REGISTRATION_HOUSEHOLD_LOCATION_SCREEN_DESCRIPTION",
    //           },
    //         ],
    //       },
    //     ],
    //     order: 1,
    //     config: {
    //       enableComment: false,
    //       enableFieldAddition: true,
    //       allowFieldsAdditionAt: ["body"],
    //       enableSectionAddition: false,
    //       allowCommentsAdditionAt: ["body"],
    //     },
    //     parent: "REGISTRATION",
    //     headers: [
    //       {
    //         type: "header",
    //         label: "KJHSJKDHKJH",
    //       },
    //       {
    //         type: "info",
    //         label: "KJHSJKDHKJH",
    //       },
    //       {
    //         type: "description",
    //         label: "KJHSJKDHKJH",
    //       },
    //     ],
    //   },
    // ];
    const restructureData = restructure(data?.screenData);
    setImpelState(restructureData);
  };

  // onSubmit();
  return <AppLocalisationWrapper onSubmit={onSubmit} />;
}

export default ImpelComponentWrapper;
