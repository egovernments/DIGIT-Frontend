export const newConfig = [
    {
   head: "Create Agency",   
    body: [
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
        label: "Organization Number",
        isMandatory: false,
        key: "org_number",
        type: "text",
        disable: false,
        populators: { name: "org_number", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        inline: true,
        label: "Agency Type",
        isMandatory: false,
        key: "agency_type",
        type: "text",
        disable: false,
        populators: { name: "agency_type", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
      }

      ],
    },
   
  ];