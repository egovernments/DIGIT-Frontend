export const Login2fa = [
    {
      texts: {
        header: "CORE_COMMON_LOGIN",
        submitButtonLabel: "CORE_COMMON_CONTINUE",
      },
      inputs: [
        // {
        //   label: "CORE_SIGNUP_EMAILID",
        //   type: "text",
        //   key: "email",
        //   isMandatory: true,
        //   populators: {
        //     name: "email",
        //     validation: {
        //       required: true,
        //       pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        //     },
        //     error: "ERR_EMAIL_REQUIRED",
        //   },
        // },
        {
          label: "CORE_LOGIN_USERNAME",
          type: "text",
          key: "username",
          isMandatory: true,
          populators: {
            name: "username",
            validation: {
              required: true,
            },
            error: "ERR_USERNAME_REQUIRED",
          },
        },
        {
          label: "CORE_LOGIN_PASSWORD",
          type: "password",
          key: "password",
          isMandatory: true,
          populators: {
            name: "password",
            validation: {
              required: true,
            },
            error: "ERR_PASSWORD_REQUIRED",
          },
        },
        {
          isMandatory: false,
          key: "check",
          type: "component",
          component: "PrivacyComponent",
          withoutLabel: true,
          disable: false,
          customProps: {
            module: "Sandbox",
          },
          populators: {
            name: "check",
          },
        },
      ],
    },
  ];
  