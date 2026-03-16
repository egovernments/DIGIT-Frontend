export const attendanceUploadConfig = ({ totalFormData, campaignData }) => {
  return [
    {
      form: [
        {
          stepCount: "1",
          key: "1",
          name: "HCM_CAMPAIGN_UPLOAD_ATTENDANCE_REGISTER_DATA",
          last: true,
          body: [
            {
              isMandatory: false,
              key: "uploadAttendanceRegister",
              type: "component",
              component: "DataUploadWrapper",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                campaignData: campaignData,
                type: "attendanceRegister",
              },
              populators: {
                name: "uploadAttendanceRegister",
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
