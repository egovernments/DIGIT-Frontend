export const createRegistersConfig = ({ totalFormData, campaignData }) => {
  return [
    {
      form: [
        {
          stepCount: "1",
          key: "1",
          name: "HCM_CAMPAIGN_CREATE_REGISTERS",
          last: true,
          body: [
            {
              isMandatory: false,
              key: "uploadRegisters",
              type: "component",
              component: "CreateRegistersData",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                campaignData: campaignData,
                type: "registers",
              },
              populators: {
                name: "uploadRegisters",
                required: true,
                customStyle: {
                  background: "none",
                },
              },
            },
          ],
        },
      ],
    },
  ];
};
