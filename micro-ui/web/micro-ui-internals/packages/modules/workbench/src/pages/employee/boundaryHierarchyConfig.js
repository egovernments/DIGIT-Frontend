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
  {
    body: [
      {
        label: "Level 1",
        type: "text",
        labelChildren: "Popopopopopo",
        isMandatory: false,
        disable: false,
        populators: {
          name: "Level 1",
        },
      },
    ],
  },
];
