export const mapAttendeesConfig = ({ totalFormData, campaignData, resourceDetails }) => {
  return [
    {
      form: [
        {
          stepCount: "1",
          key: "1",
          name: "HCM_CAMPAIGN_UPLOAD_ATTENDEE_DATA",
          last: true,
          body: [
            {
              isMandatory: false,
              key: "uploadAttendanceRegisterAttendee",
              type: "component",
              component: "DataUploadWrapper",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                campaignData: campaignData,
                screenType: "attendanceRegisterAttendee",
                resourceDetails: resourceDetails,
              },
              populators: {
                name: "uploadAttendanceRegisterAttendee",
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
