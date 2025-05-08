export const CampaignCreateConfig = (totalFormData, dataParams, isSubmitting, summaryErrors, hierarchyData) => {
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
              disable: false,
              populators: {
                name: "CampaignType",
                optionsKey: "code", 
                error: "Required",
                mdmsConfig: {
                  masterName: "projectTypes", 
                  moduleName: "HCM-PROJECT-TYPES",
                },
              },
            },
            {
              isMandatory: false,
              key: "BeneficiarySelection",
              type: "component",
              component: "BeneficiarySelection",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                isSubmitting: isSubmitting,
              },
              populators: {
                name: "BeneficiarySelection",
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
          sectionSubHeadClassName : "SubHeadingClass",
          body: [
            {
              isMandatory: true,
              key: "CampaignName",
              type: "text",
              label: "HCM_SELECT_CAMPAIGN_NAME",
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
          isLast: true,
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
                isSubmitting: isSubmitting,
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
