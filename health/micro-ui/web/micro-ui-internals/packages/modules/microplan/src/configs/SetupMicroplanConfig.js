export const MicroplanConfig = (totalFormData, dataParams, isSubmitting, summaryErrors) => {
  return [
    {
      form:[
        {
          stepCount: "1",
          key: "1",
          name: "CAMPAIGN_DETAILS",
          body: [
            {
              isMandatory: false,
              key: "campaignDetails",
              type: "component",
              skipAPICall: false,
              resourceToUpdate:"CAMPAIGN",//which api to call enum ["CAMPAIGN","PLAN"]
              component: "CampaignDetails",
              withoutLabel: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                isSubmitting: isSubmitting,
              },
              populators: {
                name: "campaignDetails",
              },
            },
          ],
        },
        {
          stepCount: "2",
          key: "2",
          name: "MICROPLAN_DETAILS",
          body: [
            {
              isMandatory: false,
              key: "microplanDetails",
              type: "component",
              skipAPICall: false,
              resourceToUpdate:"PLAN",
              component: "MicroplanDetails",
              withoutLabelFieldPair: true,
              withoutLabel: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                isSubmitting: isSubmitting,
              },
              populators: {
                name: "projectType",
              },
            },
          ],
        },
        {
          stepCount: "3",
          key: "3",
          name: "MP_MICROPLAN_DETAILS",
          body: [
            {
              isMandatory: false,
              key: "microplanDetails",
              type: "component",
              skipAPICall: false,
              resourceToUpdate:"PLAN",
              component: "MicroplanDetails",
              withoutLabelFieldPair: true,
              withoutLabel: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                isSubmitting: isSubmitting,
              },
              populators: {
                name: "projectType",
              },
            },
          ],
        },
        {
          stepCount: "4",
          key: "4",
          name: "MP_MICROPLAN_DETAILS",
          body: [
            {
              isMandatory: false,
              key: "microplanDetails",
              type: "component",
              skipAPICall: false,
              resourceToUpdate:"PLAN",
              component: "MicroplanDetails",
              withoutLabel: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                isSubmitting: isSubmitting,
              },
              populators: {
                name: "projectType",
              },
            },
          ],
        },
        {
          stepCount: "5",
          key: "5",
          name: "MP_MICROPLAN_DETAILS",
          body: [
            {
              isMandatory: false,
              key: "microplanDetails",
              type: "component",
              skipAPICall: false,
              resourceToUpdate:"PLAN",
              component: "MicroplanDetails",
              withoutLabel: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                isSubmitting: isSubmitting,
              },
              populators: {
                name: "projectType",
              },
            },
          ],
        },
        {
          stepCount: "6",
          key: "6",
          name: "MP_MICROPLAN_DETAILS",
          body: [
            {
              isMandatory: false,
              key: "microplanDetails",
              type: "component",
              skipAPICall: false,
              resourceToUpdate:"PLAN",
              component: "MicroplanDetails",
              withoutLabel: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                isSubmitting: isSubmitting,
              },
              populators: {
                name: "projectType",
              },
            },
          ],
        },
        {
          stepCount: "7",
          key: "7",
          name: "MP_MICROPLAN_DETAILS",
          body: [
            {
              isMandatory: false,
              key: "microplanDetails",
              type: "component",
              skipAPICall: false,
              resourceToUpdate:"PLAN",
              component: "MicroplanDetails",
              withoutLabel: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                isSubmitting: isSubmitting,
              },
              populators: {
                name: "projectType",
              },
            },
          ],
        },
        
      ]
    }
  ]
}