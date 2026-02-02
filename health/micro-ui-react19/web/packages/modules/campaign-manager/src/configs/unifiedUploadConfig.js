export const unifiedUploadConfig = ({ totalFormData, campaignData }) => {
  return [
    {
      form: [
        {
          stepCount: "1",
          key: "1",
          name: "HCM_CAMPAIGN_UPLOAD_UNIFIED_DATA",
          last: true,
          body: [
            {
              isMandatory: false,
              key: "uploadUnified",
              type: "component",
              component: "DataUploadWrapper",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                campaignData: campaignData,
                type: "unified-console",
              },
              populators: {
                name: "uploadUnified",
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
