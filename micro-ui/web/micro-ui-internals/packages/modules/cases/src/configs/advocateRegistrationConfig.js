export const advocateRegistrationConfig = [
    {
   head: "PUCAR_JOIN_A_CASE",   
    body: [
        {
          inline: true,
          label: "PUCAR_FIRST_NAME",
          isMandatory: false,
          key: "firstName",
          type: "text",
          disable: false,
          populators: { name: "firstName", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
            inline: true,
            label: "PUCAR_MIDDLE_NAME",
            isMandatory: false,
            key: "middleName",
            type: "text",
            disable: false,
            populators: { name: "middleName", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
          },
          {
            inline: true,
            label: "PUCAR_LAST_NAME",
            isMandatory: false,
            key: "lastName",
            type: "text",
            disable: false,
            populators: { name: "lastName", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
          },
          {
            inline: true,
            label: "PUCAR_UPLOADER",
            isMandatory: false,
            key: "documentUpload",
            type: "uploader",
            disable: false,
            populators: { name: "documentUpload", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
          },
          {
            inline: true,
            label: "PUCAR_ENTER_CODE",
            isMandatory: false,
            key: "enterCode",
            type: "text",
            disable: false,
            populators: { name: "enterCode", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
          }
      ],
    },
  ];