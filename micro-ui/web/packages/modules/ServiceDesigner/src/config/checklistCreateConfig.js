export const checklistCreateConfig = (data, time, typeOfCall) => [
  {
    head: "",
    body: [
      {
        type: "component",
        component: "CreateQuestionContext",
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
          module: "studio",
          data: data, 
          time: time,
          typeOfCall: typeOfCall
        },
      },
    ],
  },
];
