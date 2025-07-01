const fsmCustomizations = {
  getEmployeeApplicationCustomization: (config, t) => {
    const employeeConfig = [
      {
        name: "applicationDetails",
      
        allFields: true, 
        addFields: [
          {
            name: "example",
            label: t("EXAMPLE"),
            type: "text",
            isMandatory: true,
            populators: { 
              name: "example",
              validation: {
                required: true,
                pattern: /[A-Za-z]/,
              },
            },
          },
        ],
      },
    ];

    return {
      config: employeeConfig,
      defaultConfig: true, 
    };
  },
};

const fsmComponents = {};

export { fsmCustomizations, fsmComponents };
