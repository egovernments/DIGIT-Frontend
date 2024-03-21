export const addBoundaryHierarchyConfig = [
    {
      body: [
        {
          label: "WBH_HIERARCHY_NAME",
          type: "text",
          isMandatory: true,
          disable: false,
          populators: {
            name: "hierarchyType",
            customStyle: {"alignItems": "baseline"}
          },
        },
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
              required: true,
            },
          },
      ],
    },
  ];
   