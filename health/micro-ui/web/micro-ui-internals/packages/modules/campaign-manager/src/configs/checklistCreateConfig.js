export const checklistCreateConfig = (data, time) => [
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
          data: data, 
          time: time
        },
      },
    ],
  },
];
