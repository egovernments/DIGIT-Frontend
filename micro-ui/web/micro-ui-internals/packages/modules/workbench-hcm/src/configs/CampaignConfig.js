export const CampaignConfig = [
  {
    form: [
        {
            stepCount:"1",
            body: [
                {
                  isMandatory: false,
                  key: "campaignName",
                  type: "text",
                  label: "WBH_NAME_CAMPAIGN",
                  populators: {
                    name: "campaignName",
                    error: "ES_TQM_REQUIRED",
                    required: true,
                  },
                },
                {
                  isMandatory: false,
                  key: "description",
                  type: "textarea",
                  label: "WBH_CAMPAIGN_DESCRIPTION",
                  populators: {
                    name: "description",
                    error: "ES_TQM_REQUIRED",
                    required: true,
                  },
                },
                {
                  isMandatory: false,
                  key: "startDate",
                  type: "date",
                  label: "WBH_CAMPAIGN_START_DATE",
                  populators: {
                    name: "startDate",
                    error: "ES_TQM_REQUIRED",
                    required: true,
                  },
                },
                {
                  isMandatory: false,
                  key: "endDate",
                  type: "date",
                  label: "WBH_CAMPAIGN_END_DATE",
                  populators: {
                    name: "endDate",
                    error: "ES_TQM_REQUIRED",
                    required: true,
                  },
                },
                {
                  isMandatory: false,
                  key: "beneficiaryType",
                  type: "dropdown",
                  label: "WBH_CAMPAIGN_BENEFICIARY_TYPE",
                  populators: {
                    name: "beneficiaryType",
                    error: "ES_TQM_REQUIRED",
                    required: true,
                  },
                },
                {
                  isMandatory: false,
                  key: "campaignType",
                  type: "dropdown",
                  label: "WBH_CAMPAIGN_TYPE",
                  populators: {
                    name: "campaignType",
                    error: "ES_TQM_REQUIRED",
                    required: true,
                  },
                },
                {
                  isMandatory: false,
                  key: "resourceType",
                  type: "dropdown",
                  label: "WBH_CAMPAIGN_RESOURCE_TYPE",
                  populators: {
                    name: "resourceType",
                    error: "ES_TQM_REQUIRED",
                    required: true,
                  },
                },
              ],
        },
        {
            stepCount:"2",
            "body": [
                {
                  isMandatory: false,
                  key: "campaignName2",
                  type: "text",
                  label: "CAMPAIGN_NAME",
                  populators: {
                    name: "campaignName2",
                    error: "ES_TQM_REQUIRED",
                    required: true,
                  },
                }, 
                {
                    isMandatory: false,
                    key: "campaignType2",
                    type: "text",
                    label: "CAMPAIGN_TYPE",
                    populators: {
                      name: "campaignType2",
                      error: "ES_TQM_REQUIRED",
                      required: true,
                    },
                  },
              ],
        },
        {
            stepCount:"2",
            "body": [
                {
                  isMandatory: false,
                  key: "campaignName1",
                  type: "text",
                  label: "CAMPAIGN_NAME",
                  populators: {
                    name: "campaignName1",
                    error: "ES_TQM_REQUIRED",
                    required: true,
                  },
                }, 
                {
                    isMandatory: false,
                    key: "campaigntType1",
                    type: "text",
                    label: "CAMPAIGN_TYPE",
                    populators: {
                      name: "campaigntType1",
                      error: "ES_TQM_REQUIRED",
                      required: true,
                    },
                  },
              ],
        },
        {
            stepCount:"3",
            "body": [
                {
                  isMandatory: false,
                  key: "cycleNumber",
                  type: "number",
                  label: "HCM_NUMBER_OF_CYCLES",
                  populators: {
                    name: "cycleNumber",
                    error: "ES_TQM_REQUIRED",
                    required: true,
                  },
                }, 
                {
                    isMandatory: false,
                    key: "deliveryNumber",
                    type: "number",
                    label: "HCM_NO_OF_DELIVERIES",
                    populators: {
                      name: "deliveryNumber",
                      error: "ES_TQM_REQUIRED",
                      required: true,
                    },
                  },
              ],
        },
        {
            stepCount:"3",
            
                "head": "",
                "subHead": "",
                "navLink": "Delivery 1",
                "body": [
                    {
                        isMandatory: false,
                        key: "campaignName",
                        type: "text",
                        label: "CAMPAIGN_NAME",
                        populators: {
                          name: "campaignName",
                          error: "ES_TQM_REQUIRED",
                          required: true,
                        },
                      }, 
                      {
                        isMandatory: false,
                        key: "campaigntype",
                        type: "text",
                        label: "CAMPAIGN_TYPE",
                        populators: {
                          name: "campaigntype",
                          error: "ES_TQM_REQUIRED",
                          required: true,
                        },
                      }, 
                ]
        },

    ]
  
  }
];
