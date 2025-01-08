export const newConfig = [
    {
      head: "Create Facility",
      body: [
        {
          inline: true,
          label: "Facility Name",
          isMandatory: false,
          key: "facilityname",
          type: "text",
          disable: false,
          populators: { name: "facilityname", error: "write a valid name", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
          inline: true,
          label: "Storage Capacity",
          isMandatory: false,
          key: "storage",
          type: "number",
          disable: false,
          populators: { name: "storage", error: "Required" },
        },
        {
          inline: true,
          label: "Address Id",
          isMandatory: false,
          key: "addressid",
          type: "text",
          disable: false,
          populators: { name: "addressid", error: "Required" },
        },
        {
          inline: true,
          label: "Tenant Id",
          isMandatory: false,
          key: "tenantid",
          type: "text",
          disable: false,
          populators: { name: "tenantid", error: "Required" },
        },
        {
          key: "usage",
          type: "text",
          label: "Usage",
          disable: false,
          populators: {
            name: "usage",
            error: "required ",
          },
        },
        {
          isMandatory: false,
          type: "dropdown",
          key: "permanent",
          label: "is Permanent",
          disable: false,
          populators: {
            name: "is Permanent",
            optionsKey: "value",
            error: "",
            required: true,
            showIcon: true,
            isSearchable: true,
            options: [
              {
                code: "1",
                value: "true",
              },
              {
                code: "2",
                value: "false"
              }
            ],
          }
        },
        {
          type: "component",
          component: "MyTable",
          withoutLabel: true,
          key: "MyTable",
        },
      ],
    },
  ];