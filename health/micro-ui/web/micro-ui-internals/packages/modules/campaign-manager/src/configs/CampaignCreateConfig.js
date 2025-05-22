export const CampaignCreateConfig = (totalFormData, editName ) => {
  return [
    {
      form: [
        {
          stepCount: "1",
          key: "1",
          name: "HCM_CAMPAIGN_TYPE",
          head: "HCM_SELECT_CAMPAIGN_TYPE_QUES",
          subHead: "HCM_CAMPAIGN_TYPE_DESC",
          sectionSubHeadClassName : "SubHeadingClass",
          body: [
            {
              isMandatory: true,
              key: "CampaignType",
              type: "dropdown",
              label: "HCM_SELECT_CAMPAIGN_TYPE",
              disable: editName,
              populators: {
                name: "CampaignType",
                optionsKey: "code", 
                error: "Required",
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
                error: "ES__REQUIRED",
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
          sectionSubHeadClassName : "SubHeadingClass",
          body: [
            {
              isMandatory: true,
              key: "CampaignName",
              type: "text",
              label: "HCM_SELECT_CAMPAIGN_NAME",
              placeholder: "HCM_CAMPAIGNNAME_DATE_MONTH_YEAR",
              disable: false,
              populators: {
                name: "CampaignName",
                error: "ES__REQUIRED",
                required: "true"
              },
            },
          ], 
        },
        {
          stepCount: "3",
          key: "3",
          name: "HCM_CAMPAIGN_DATE",
          subHead: "HCM_CAMPAIGN_DATE_DESC",
          sectionSubHeadClassName : "SubHeadingClass",
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
                sessionData: totalFormData
              },
              populators: {
                name: "DateSelection",
                // optionsKey: "code",
                error: "ES__REQUIRED",
                required: true,
              },
            },
          ],
        },
      ],
    },
  ];
};
