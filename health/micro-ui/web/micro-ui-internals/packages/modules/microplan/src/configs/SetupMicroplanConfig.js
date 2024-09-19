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
          stepCount: "3",
          key: "6",
          name: "HYPOTHESIS",
          body: [
            {
              isMandatory: true,
              key: "hypothesis",
              type: "component",
              skipAPICall: false,
              component: "HypothesisWrapper",
              withoutLabel: true,
              disable: false,
              withoutLabelFieldPair: true,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                isSubmitting: isSubmitting,

              },
              populators: {
                name: "hypothesis",
                required: true,
              },
            },
          ],
        },

        // {
        //   stepCount: "4",
        //   key: "4",
        //   name: "FORMULA_CONFIGURATION",
        //   body: [
        //     {
        //       isMandatory: true,
        //       key: "formulaConfiguration",
        //       type: "component",
        //       skipAPICall: false,
        //       component: "FormulaConfiguration",
        //       withoutLabel: true,
        //       withoutLabelFieldPair: true,
        //       disable: false,
        //       customProps: {
        //         module: "HCM",
        //         sessionData: totalFormData,
        //         isSubmitting: isSubmitting,
        //       },
        //       populators: {
        //         name: "formulaConfiguration",
        //         required: true,
        //       },
        //     },
        //   ],
        // },
        
      ]
    }
  ]
}