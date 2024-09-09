export const UpdateBoundaryConfig = (totalFormData , hierarchyType) => {
    return [
      {
        form: [
            {
                key: "1",
                name: "HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA",
                body: [
                  {
                    isMandatory: false,
                    key: "boundaryType",
                    type: "component",
                    component: "UpdateBoundaryWrapper",
                    withoutLabelFieldPair: true,
                    withoutLabel: true,
                    disable: false,
                    customProps: {
                      module: "HCM",
                      sessionData: totalFormData,
                      hierarchyType : hierarchyType
                    },
                    populators: {
                      name: "boundaryType",
                      // optionsKey: "code",
                      error: "ES__REQUIRED",
                      required: true,
                    },
                  },
                ],
              },
          {
            key: "2",
            name: "HCM_SIDE_EFFECT_TYPE",
            body: [
                {
                    isMandatory: false,
                    key: "sideEffectType",
                    type: "component",
                    // skipAPICall: true,
                    component: "SideEffectType",
                    withoutLabel: true,
                    disable: false,
                    customProps: {
                      module: "HCM",
                      sessionData: totalFormData,
                    },
                    populators: {
                      name: "sideEffectType",
                    },
                  },
              
            ],
          },
        ],
      },
    ];
  };
  