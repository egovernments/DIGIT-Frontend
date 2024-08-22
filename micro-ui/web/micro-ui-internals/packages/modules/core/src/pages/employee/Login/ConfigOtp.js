export const LoginOtpConfig = [
    {
      texts: {
        header: "CORE_COMMON_LOGIN",
        submitButtonLabel: "CORE_COMMON_CONTINUE",
      },
      inputs: [
        {
          label: "CORE_SIGNUP_EMAILID",
          type: "text",
          key: "email",
          isMandatory: true,
          populators: {
            name: "email",
            validation: {
              required: true,
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            },
            error: "ERR_EMAIL_REQUIRED",
          },
        }
      ],
    },
  ];
  