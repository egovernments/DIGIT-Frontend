export const MicroplanConfig = (totalFormData, dataParams, isSubmitting, summaryErrors,hierarchyData) => {
  return [
    {
      form:[
        // TODO: Do no update this object key:1 
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
        // TODO: Do no update this object key:2
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
              showPopupOnSubmission:true,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                isSubmitting: isSubmitting,
              },
              populators: {
                name: "microplanDetails",
              },
            },
          ],
        },
        // TODO: Do no update this object key:3
        {
          stepCount: "3",
          key: "3",
          name: "BOUNDARY",
          body: [
            {
              isMandatory: false,
              key: "boundarySelection",
              type: "component",
              skipAPICall: false,
              resourceToUpdate:"PLAN",
              component: "BoundarySelection",
              withoutLabelFieldPair: true,
              withoutLabel: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                isSubmitting: isSubmitting,
                hierarchyData
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