import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const data = (campaign) => {
  const { t } = useTranslation();

  return {
    cards: [
      {
        sections: [
          {
            type: "DATA",
            values: [
              {
                key: "WORKBENCH_CAMPAIGN_NUMBER",
                value: campaign?.CampaignDetails?.[0]?.campaignnumber || "NA",
              },
              {
                key: "WORKBENCH_CAMPAIGN_NAME",
                value:  campaign?.CampaignDetails?.[0]?.campaignname || "NA",
              },
              {
                key: "WORKBENCH_CAMPAIGN_TYPE",
                value:  campaign?.CampaignDetails?.[0]?.campaigntype || "NA",
              },
              {
                key: "WORKBENCH_PROJECT_TYPE_ID",
                value:  campaign?.CampaignDetails?.[0]?.projecttypeid || "NA",
              },
              {
                key: "WORKBENCH_CAMPAIGN_CREATED_TIME",
                value: Digit.DateUtils.ConvertEpochToDate( campaign?.CampaignDetails?.[0]?.createdtime) || "NA",
              },
              {
                key: "WORKBENCH_CAMPAIGN_STATUS",
                value:  campaign?.CampaignDetails?.[0]?.status || "NA",
              },
            ],
          },
        ],
      },
      {
        sections: [
          {
            type: "COMPONENT",
            component: "ViewIngestionComponent",
            props: { campaignnumber:campaign?.CampaignDetails?.[0]?.campaignnumber},
          },
        ],
      },
    ]
  };
};
