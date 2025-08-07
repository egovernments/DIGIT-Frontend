export const CampaignCreateConfig = (totalFormData, editName) => {
  return [
    {
      form: [
        {
          stepCount: "1",
          key: "1",
          name: "HCM_CAMPAIGN_TYPE",
          head: "HCM_SELECT_CAMPAIGN_TYPE_QUES",
          subHead: "HCM_CAMPAIGN_TYPE_DESC",
          sectionSubHeadClassName: "SubHeadingClass",
          body: [
            {
              isMandatory: true,
              key: "CampaignType",
              type: "dropdown",
              label: "HCM_SELECT_CAMPAIGN_TYPE",
              disable: editName,
              populators: {
                name: "CampaignType",
                fieldPairClassName: "boldLabel",
                optionsKey: "code",
                customStyle: {
                  marginBottom: 0,
                },
                error: "ES__REQUIRED_CAMPAIGN_TYPE",
                mdmsv2: true,
                mdmsConfig: {
                  masterName: "projectTypes",
                  moduleName: "HCM-PROJECT-TYPES",
                },
              },
            },
            {
              isMandatory: false,
              key: "CycleSelection",
              type: "component",
              component: "CycleSelection",
              label: "",
              disable: editName,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                disabled: editName,
              },
              populators: {
                name: "CycleSelection",
                // optionsKey: "code",
                error: "ES__REQUIRED_SELECTION",
                required: true,
              },
            },
          ],
        },
        {
          stepCount: "2",
          key: "2",
          name: "HCM_CAMPAIGN_NAME",
          head: "HCM_CAMPAIGN_NAME_QUES",
          subHead: "HCM_CAMPAIGN_NAME_DESC",
          disable: false,
          callAPI: "true",
          sectionSubHeadClassName: "SubHeadingClass",
          body: [
            {
              isMandatory: true,
              key: "CampaignName",
              type: "text",
              label: "HCM_SELECT_CAMPAIGN_NAME",
              placeholder: "HCM_CAMPAIGNNAME_DATE_MONTH_YEAR",
              disable: false,
              // populators: { name: "salutation", error: "Required", validation: { pattern: /^[A-Za-z]+$/i , maxlength:5} },
              populators: {
                fieldPairClassName: "boldLabel withoutMargin",
                name: "CampaignName",
                error: "ES__REQUIRED_NAME_AND_LENGTH",
                // required: "true",
                validation: {
                  // required: true,
                  error: "ES__REQUIRED_LENGTH",
                  pattern: /^(?!.*[ _-]{2})(?=^[^\s_-])(?!.*[\s_-]$)(?=^[\p{L}][\p{L}0-9 _\-\(\)]{4,29}$)^.*$/u,
                  // maxlength: 30,
                },
              },
            },
          ],
        },
        {
          stepCount: "2",
          key: "2",
          name: "HCM_CAMPAIGN_INFO",
          body: [
            {
              isMandatory: false,
              key: "CampaignNameInfo",
              type: "component",
              component: "CampaignNameInfo",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
              },
              populators: {
                name: "CampaignNameInfo",
                // optionsKey: "code",
                error: "ES__REQUIRED_DATE",
                required: true,
              },
            },
          ],
        },
        {
          stepCount: "3",
          key: "3",
          name: "HCM_CAMPAIGN_DATE",
          subHead: "HCM_CAMPAIGN_DATE_DESC",
          sectionSubHeadClassName: "SubHeadingClass",
          last: true,
          body: [
            {
              isMandatory: false,
              key: "DateSelection",
              type: "component",
              component: "DateSelection",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
              },
              populators: {
                name: "DateSelection",
                // optionsKey: "code",
                error: "ES__REQUIRED_DATE",
                required: true,
              },
            },
          ],
        },
      ],
    },
  ];
};
