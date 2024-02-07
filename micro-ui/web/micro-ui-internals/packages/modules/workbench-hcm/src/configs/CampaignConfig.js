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
                  label: "CAMPAIGN_NAME",
                  populators: {
                    name: "campaignName",
                    error: "ES_TQM_REQUIRED",
                    required: true,
                  },
                }
              ],
        },
        {
            stepCount:"2",
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
                    key: "campaignName",
                    type: "text",
                    label: "CAMPAIGN_NAME",
                  //   di sable: false,
                  //   stepCount: "1",
                    populators: {
                      name: "campaignName",
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
                    key: "campaignName",
                    type: "text",
                    label: "CAMPAIGN_NAME",
                  //   di sable: false,
                  //   stepCount: "1",
                    populators: {
                      name: "campaignName",
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
                  //   di sable: false,
                  //   stepCount: "1",
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
                ]
        },

    ]
  
  }
];
