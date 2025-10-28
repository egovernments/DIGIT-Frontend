export const SignUpConfig = [
  {
    texts: {
      header: "CORE_COMMON_SIGN_UP",
      submitButtonLabel: "CORE_COMMON_SIGN_UP_BUTTON",
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
            maxLength: 64,
          },
          error: "ERR_EMAIL_REQUIRED",
        },
      },
      {
        label: "CORE_SIGNUP_ACCOUNT_NAME",
        type: "text",
        key: "accountName",
        isMandatory: true,
        populators: {
          name: "accountName",
          validation: {
            required: true,
            pattern: /^[A-Za-z]+( [A-Za-z]+)*$/,
            maxLength: 50,
          },
          error: "ERR_ACCOUNT_NAME_REQUIRED",
        },
        infoMessage:"SANDBOX_SIGNUP_ACCOUNT_NAME_TOOLTIP"
      },
      {
        isMandatory: false,
        key: "check",
        type: "component",
        component: "PrivacyComponent",
        withoutLabel: true,
        disable: false,
        customProps: {
          module: "SandboxSignUp",
        },
        populators: {
          name: "check",
        },
      },
    ],
    bannerImages: [{
      id: 1,
      image: 'https://images.unsplash.com/photo-1746277121508-f44615ff09bb',
      title: 'A digital partner for frontline workers',
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio nobis temporibus provident expedita consequuntur, repudiandae pariatur! Deleniti molestias vero, cumque vel error labore ipsam totam?"
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9',
      title: 'Feature 2 Title',
      description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Exercitationem esse doloribus molestiae fugiat eos adipisci sequi cumque sit, laboriosam dolores blanditiis nobis assumenda quasi nemo consectetur. Officia nesciunt quibusdam molestiae."
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1624555130581-1d9cca783bc0',
      title: 'Feature 3 Title',
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate aut autem aperiam et modi saepe obcaecati doloremque voluptatem iusto quidem!"
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1547481887-a26e2cacb5b2',
      title: 'Feature 4 Title',
      description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Exercitationem esse doloribus molestiae fugiat eos adipisci sequi cumque sit, laboriosam dolores blanditiis nobis assumenda quasi nemo consectetur. Officia nesciunt quibusdam molestiae."
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1536782376847-5c9d14d97cc0',
      title: 'Feature 5 Title',
      description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Exercitationem esse doloribus molestiae fugiat eos adipisci sequi cumque sit, laboriosam dolores blanditiis nobis assumenda quasi nemo consectetur. Officia nesciunt quibusdam molestiae."
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94',
      title: 'Feature 6 Title',
      description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Exercitationem esse doloribus molestiae fugiat eos adipisci sequi cumque sit, laboriosam dolores blanditiis nobis assumenda quasi nemo consectetur. Officia nesciunt quibusdam molestiae."
    },
  ],
  },
];
