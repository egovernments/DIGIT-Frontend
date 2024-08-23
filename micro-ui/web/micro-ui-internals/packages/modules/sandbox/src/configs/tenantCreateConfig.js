export const tenantCreateConfig = [
  {
    head: null,
    body: [
      {
        inline: true,
        label: "SANDBOX_CREATE_TENANT_NAME_LABEL",
        isMandatory: true,
        key: "tenantName",
        type: "text",
        disable: false,
        populators: { name: "tenantName", error: "Required", validation: { pattern: /^[A-Za-z0-9]+$/i } },
      },
      {
        inline: true,
        label: "SANDBOX_CREATE_TENANT_EMAIL_LABEL",
        isMandatory: true,
        key: "emailId",
        type: "text",
        disable: false,
        populators: { name: "emailId", error: "Required", validation: { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i } },
      },
      {
        isMandatory: false,
        key: "isActive",
        type: "dropdown",
        label: "SANDBOX_CREATE_TENANT_ACTIVE_LABEL",
        disable: false,
        populators: {
          name: "isActive",
          optionsKey: "name",
          error: " Required",
          required: true,
          options: [
            {
              code: "true",
              name: "TRUE",
              active: true,
            },
            {
              code: "false",
              name: "FALSE",
              active: true,
            },
          ],
        },
      },
    ],
  },
];
