export const checklistCreateConfig = (data) => [
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
          customStyle:{
            background:"transparent"
          }
        },
        customProps: {
          module: "Campaign",
          data: data
        },
      },
    ],
  },
];
