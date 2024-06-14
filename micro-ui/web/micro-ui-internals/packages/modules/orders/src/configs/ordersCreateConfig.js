 export const configs = [
    {
   head: "Order 1",   
    body: [
      {
        isMandatory: true,
        key: "Order Type",
        type: "dropdown",
        label: "order type",
        disable: false,
        populators: {
          name: "genders",
          optionsKey: "name",
          error: "required ",
          mdmsConfig: {
            masterName: "GenderType",
            moduleName: "common-masters",
            localePrefix: "COMMON_GENDER",
          },
        },
      },
      {
        isMandatory: true,
        key: "Document Type",
        type: "dropdown",
        label: "document type",
        disable: false,
        populators: {
          name: "genders",
          optionsKey: "name",
          error: "required ",
          mdmsConfig: {
            masterName: "GenderType",
            moduleName: "common-masters",
            localePrefix: "COMMON_GENDER",
          },
        },
      },
      {
        isMandatory: true,
        key: "Party / parties to make submission",
        type: "dropdown",
        label: "Order for document Submission",
        disable: false,
        populators: {
          name: "genders",
          optionsKey: "name",
          error: "required ",
          mdmsConfig: {
            masterName: "GenderType",
            moduleName: "common-masters",
            localePrefix: "COMMON_GENDER",
          },
        },
      },
        {
          inline: true,
          label: "deadline for submission",
          isMandatory: false,
          key: "dob",
          type: "date",
          disable: false,
          populators: { name: "dob", error: "Required"},
        },

        {
          label: "Additional notes",
          isMandatory: true,
          key: "phno",
          type: "number",
          disable: false,
          populators: { name: "phno", error: "Required", validation: { min: 0, max: 9999999999 } },
        },
      ],
    },
  ];