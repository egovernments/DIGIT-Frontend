export const newConfig = [
    {
   head: "Create Sanction",   
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
        label: "Project Code",
        isMandatory: false,
        key: "project_code",
        type: "text",
        disable: false,
        populators: { name: "project_code", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        inline: true,
        label: "Net Amount",
        isMandatory: false,
        key: "net_amount",
        type: "number",
        disable: false,
        populators: { name: "net_amount", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        inline: true,
        label: "Gross Amount",
        isMandatory: false,
        key: "gross_amount",
        type: "number",
        disable: false,
        populators: { name: "gross_amount", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        inline: true,
        label: "Available Amount",
        isMandatory: false,
        key: "available_amount",
        type: "number",
        disable: false,
        populators: { name: "available_amount", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
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

      ],
    }
  ];