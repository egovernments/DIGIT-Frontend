export const loginConfig = [
  {
    texts: {
      header: "CORE_COMMON_LOGIN",
      submitButtonLabel: "CORE_COMMON_LOGIN",
      secondaryButtonLabel: "CORE_COMMON_FORGOT_PASSWORD",
    },
    inputs: [
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
        isMandatory: true,
        type: "dropdown",
        key: "city",
        label: "CORE_COMMON_CITY",
        disable: false,
        populators: {
          name: "city",
          optionsKey: "name",
          error: "ERR_HRMS_INVALID_CITY",
          mdmsConfig: {
            masterName: "tenants",
            moduleName: "tenant",
            localePrefix: "TENANT_TENANTS",
            select:
              "(data)=>{ return Array.isArray(data['tenant'].tenants) && Digit.Utils.getUnique(data['tenant'].tenants).map(ele=>({code:ele.code,name:Digit.Utils.locale.getTransformedLocale('TENANT_TENANTS_'+ele.code)}))}",
          },
        },
      },
      {
        key: "check",
        type: "component",
        disable: false,
        component: "PrivacyComponent",
        populators: {
          name: "check"
        },
        customProps: {
          module: "HCM"
        },
        isMandatory: false,
        withoutLabel: true
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

// export const loginConfig = [
//   {
//     "texts": {
//       "header": "CORE_COMMON_LOGIN",
//       "submitButtonLabel": "CORE_COMMON_CONTINUE",
//       "secondaryButtonLabel": "CORE_COMMON_FORGOT_PASSWORD"
//     },
//     "title": "login",
//     "inputs": [
//       {
//         "key": "username",
//         "type": "text",
//         "label": "CORE_LOGIN_USERNAME",
//         "populators": {
//           "name": "username",
//           "error": "ERR_USERNAME_REQUIRED",
//           "validation": {
//             "required": true
//           }
//         },
//         "isMandatory": true
//       },
//       {
//         "key": "password",
//         "type": "password",
//         "label": "CORE_LOGIN_PASSWORD",
//         "populators": {
//           "name": "password",
//           "error": "ERR_PASSWORD_REQUIRED",
//           "validation": {
//             "required": true
//           }
//         },
//         "isMandatory": true
//       },
//       {
//         "key": "city",
//         "type": "dropdown",
//         "label": "CORE_COMMON_CITY",
//         "disable": false,
//         "populators": {
//           "name": "city",
//           "error": "ERR_HRMS_INVALID_CITY",
//           "mdmsConfig": {
//             "select": "(data)=>{ return Array.isArray(data['tenant'].tenants) && Digit.Utils.getUnique(data['tenant'].tenants).map(ele=>({code:ele.code,name:Digit.Utils.locale.getTransformedLocale('TENANT_TENANTS_'+ele.code)}))}",
//             "masterName": "tenants",
//             "moduleName": "tenant",
//             "localePrefix": "TENANT_TENANTS"
//           },
//           "optionsKey": "name"
//         },
//         "isMandatory": true
//       },
//       {
//         "key": "check",
//         "type": "component",
//         "disable": false,
//         "component": "PrivacyComponent",
//         "populators": {
//           "name": "check"
//         },
//         "customProps": {
//           "module": "HCM"
//         },
//         "isMandatory": false,
//         "withoutLabel": true
//       },
//     ],
//     bannerImages: [{
//         id: 1,
//         image: 'https://images.unsplash.com/photo-1746277121508-f44615ff09bb',
//         title: 'A digital partner for frontline workers',
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio nobis temporibus provident expedita consequuntur, repudiandae pariatur! Deleniti molestias vero, cumque vel error labore ipsam totam?"
//       },
//       {
//         id: 2,
//         image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9',
//         title: 'Feature 2 Title',
//         description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Exercitationem esse doloribus molestiae fugiat eos adipisci sequi cumque sit, laboriosam dolores blanditiis nobis assumenda quasi nemo consectetur. Officia nesciunt quibusdam molestiae."
//       },
//       {
//         id: 3,
//         image: 'https://images.unsplash.com/photo-1624555130581-1d9cca783bc0',
//         title: 'Feature 3 Title',
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate aut autem aperiam et modi saepe obcaecati doloremque voluptatem iusto quidem!"
//       },
//       {
//         id: 4,
//         image: 'https://images.unsplash.com/photo-1547481887-a26e2cacb5b2',
//         title: 'Feature 4 Title',
//         description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Exercitationem esse doloribus molestiae fugiat eos adipisci sequi cumque sit, laboriosam dolores blanditiis nobis assumenda quasi nemo consectetur. Officia nesciunt quibusdam molestiae."
//       },
//       {
//         id: 5,
//         image: 'https://images.unsplash.com/photo-1536782376847-5c9d14d97cc0',
//         title: 'Feature 5 Title',
//         description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Exercitationem esse doloribus molestiae fugiat eos adipisci sequi cumque sit, laboriosam dolores blanditiis nobis assumenda quasi nemo consectetur. Officia nesciunt quibusdam molestiae."
//       },
//       {
//         id: 6,
//         image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94',
//         title: 'Feature 6 Title',
//         description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Exercitationem esse doloribus molestiae fugiat eos adipisci sequi cumque sit, laboriosam dolores blanditiis nobis assumenda quasi nemo consectetur. Officia nesciunt quibusdam molestiae."
//       },
//       ],
//   }
// ]