export const attendanceUploadConfig = ({ totalFormData, campaignData }) => {
  return [
    {
      form: [
        {
          stepCount: "1",
          key: "1",
          name: "HCM_CAMPAIGN_UPLOAD_ATTENDANCE_DATA",
          last: true,
          body: [
            {
              isMandatory: false,
              key: "uploadAttendance",
              type: "component",
              component: "AttendanceUploadData",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                campaignData: campaignData,
                type: "attendance",
              },
              populators: {
                name: "uploadAttendance",
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
