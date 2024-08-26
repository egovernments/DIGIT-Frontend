export const tenantCreateConfig = [
  {
 head: "Create Tenant",   
  body: [
      {
        inline: true,
        label: "Tenant Name",
        isMandatory: true,
        key: "tenantName",
        type: "text",
        disable: false,
        populators: { name: "tenantName", error: "Required", validation: { pattern: /^[A-Za-z0-9]+$/i } },
      },
      {
        inline: true,
        label: "Email Id",
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
        label: "isActive",
        disable: false,
        populators: {
          name: "isActive",
          optionsKey: "name",
          error: " Required",
          required: true,
          options: [
            {
                "code": "true",
                "name": "true",
                "active": true
            },
            {
                "code": "false",
                "name": "false",
                "active": true
            }
        ],
        },
      },


    ],
  }
];