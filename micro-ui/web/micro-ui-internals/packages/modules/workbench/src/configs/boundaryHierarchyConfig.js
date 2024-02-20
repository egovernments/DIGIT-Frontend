export const addBoundaryHierarchyConfig = [
  {
    body: [
      {
        label: "WBH_HIERARCHY_TYPE_CODE",
        type: "text",
        isMandatory: false,
        disable: false,
        populators: {
          name: "hierarchyType",
        },
      },
    ],
  },
  // {
  //   body: [
  //     {
  //       label: "Level 1",
  //       type: "text",
  //       isMandatory: false,
  //       disable: false,
  //       populators: {
  //         name: "Level 1",
  //       },
  //     },
  //   ],
  // },
  {
    body: [
        {
    isMandatory: true,
    key: "levelcards",
    type: "component",
    component: "LevelCards",
    withoutLabel: true,
    disable: false,
    customProps: {
      module: "HCM",
    },
    populators: {
      name: "levelcards",
      // optionsKey: "code",
      error: "ES__REQUIRED",
      required: true,
    },
  },
    ]
  },
];
