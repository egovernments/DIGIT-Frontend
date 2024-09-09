export const checklistCreateConfig = [
  {
    head: "",
    body: [
      {
        type: "component",
        component: "CreateQuestion",
        withoutLabel: true,
        key: "createQuestion",
        validation: {},
        populators: {
          validation: {},
        },
        customProps: {
          module: "Campaign",
        },
      },
    ],
  },
];
