 export const newConfig = [
    {
   head: "Create Project",   
    body: [
      {
        inline: true,
        label: "Name",
        isMandatory: false,
        key: "name",
        type: "text",
        disable: false,
        populators: { name: "name", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        inline: true,
        label: "Description",
        isMandatory: false,
        key: "description",
        type: "text",
        disable: false,
        populators: { name: "description", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        inline: true,
        label: "Program Code",
        isMandatory: false,
        key: "program_code",
        type: "text",
        disable: false,
        populators: { name: "program_code", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        inline: true,
        label: "Status Code",
        isMandatory: false,
        key: "status_code",
        type: "text",
        disable: false,
        populators: { name: "status_code", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        inline: true,
        label: "Agency Code",
        isMandatory: false,
        key: "agency_code",
        type: "text",
        disable: false,
        populators: { name: "agency_code", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },

        // {
        //   isMandatory: true,
        //   key: "receiver_id",
        //   type: "dropdown",
        //   label: "Receiver Id",
        //   disable: false,
        //   populators: {
        //     name: "receiver_id",
        //     optionsKey: "name",
        //     error: "required ",
        //     mdmsConfig: {
        //       masterName: "ExchangeServers",
        //       moduleName: "exchange",
        //       localePrefix: "",
        //     },
        //   },
        // },


        // {
        //   isMandatory: true,
        //   key: "genders",
        //   type: "dropdown",
        //   label: "Enter Gender",
        //   disable: false,
        //   populators: {
        //     name: "genders",
        //     optionsKey: "name",
        //     error: "required ",
        //     mdmsConfig: {
        //       masterName: "GenderType",
        //       moduleName: "common-masters",
        //       localePrefix: "COMMON_GENDER",
        //     },
        //   },
        // },

      ],
    },
  ];