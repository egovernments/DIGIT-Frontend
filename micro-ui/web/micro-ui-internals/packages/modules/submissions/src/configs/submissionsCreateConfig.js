 export const configs = [
    {
   head: "CREATE_SUBMISSION",   
    body: [
        {
          inline: true,
          label: "SUBMISSION_ID",
          isMandatory: false,
          key: "filingNumber",
          type: "text",
          disable: true,
          populators: { name: "filingNumber"},
        },
        {
          isMandatory: true,
          key: "submissionType",
          type: "dropdown",
          label: "SUBMISSION_TYPE",
          disable: false,
          populators: {
            name: "submissionType",
            optionsKey: "type",
            error: "required ",
            mdmsConfig: { //Used application type for timebeing since Submission type MDMS data is not defined
              masterName: "ApplicationType",
              moduleName: "Application",
              localePrefix: "SUBMISSION_TYPE",
            },
          },
        },
        {
          isMandatory: true,
          key: "applicationType",
          type: "dropdown",
          label: "APPLICATION_TYPE",
          disable: false,
          populators: {
            name: "applicationType",
            optionsKey: "type",
            error: "required ",
            mdmsConfig: {
              masterName: "ApplicationType",
              moduleName: "Application",
              localePrefix: "APPLICATION_TYPE",
            },
          },
        },
        {
          isMandatory: false,
          key: "referenceId",
          type: "dropdown",
          label: "ORDER",
          disable: false,
          populators: {
            name: "ORDER",
            optionsKey: "type",
            error: "required ",
          },
        },
        {
          inline: true,
          label: "DATE_PARTY_AVAILABLE",
          isMandatory: true,
          key: "datePartyAvailable",
          type: "date",
          disable: false,
          populators: { name: "datePartyAvailable", error: "Required"},
        },
        {
          inline: true,
          label: "DELAY_REASON",
          isMandatory: true,
          key: "delayReason",
          type: "textarea",
          disable: false,
          populators: { name: "delayReason", error: " Required ", validation: { pattern: /^[A-Za-z]+$/i } },
        },
         {
          inline: true,
          label: "SUPPORTING_DOCUMENTS_OPTIONAL",
          isMandatory: false,
          name: "documentUpload",
          type: "documentUpload",
          disable: false,
          module:"SUBMISSION",
          mdmsModuleName :"pucar-ui",
          localePrefix: "SUBMISSION",
          populators: { name: "documentUpload", error: "Required", 
          validation: { pattern: /^[A-Za-z]+$/i } },
        }
      ]
    }
  ];