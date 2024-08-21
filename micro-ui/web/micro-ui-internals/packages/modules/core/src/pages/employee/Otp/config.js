export const OtpConfig = [
    {
      texts: {
        header: "CORE_COMMON_OTP_LABEL",
        submitButtonLabel: "CORE_COMMON_SUBMIT",
      },
      body: [
        {
          type: "component",
          component: "OtpComponent",
          key: "OtpComponent",
          withoutLabel: true,
          isMandatory: false,
          customProps: {
          },
          populators: {
            required: true,
          },
        },
      ],
    },
  ];
  