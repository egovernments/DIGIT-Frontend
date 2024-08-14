export const tenantCreateConfig = [
  {
 head: "Create Tenant",   
  body: [
      {
        inline: true,
        label: "Tenant Name",
        isMandatory: false,
        key: "tenantName",
        type: "text",
        disable: false,
        populators: { name: "tenantName", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        inline: true,
        label: "Tenant code",
        isMandatory: false,
        key: "tenantCode",
        type: "text",
        disable: false,
        populators: { name: "tenantCode", error: "Required", validation: { pattern: /^[A-Za-z]+$/i} },
      },
      {
        inline: true,
        label: "Email Id",
        isMandatory: false,
        key: "emaildId",
        type: "text",
        disable: false,
        populators: { name: "emailId", error: "Required", validation: { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i } },
      },
    ],
  }
];