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
                sessionData: totalFormData,  //!session data
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
                sessionData: totalFormData,  //!Session data again
                isSubmitting: isSubmitting,
              },
              populators: {
                name: "projectType",
              },
            },
          ],
        }
      ]
    }
  ]
}