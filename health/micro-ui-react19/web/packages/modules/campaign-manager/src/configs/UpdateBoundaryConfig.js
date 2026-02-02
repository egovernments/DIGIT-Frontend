export const UpdateBoundaryConfig = ({ totalFormData, hierarchyType, projectType, summaryErrors, campaignData, isUnifiedCampaign }) => {
  const uploadSteps = isUnifiedCampaign
    ? [
        {
          stepCount: "2",
          key: "2",
          name: "HCM_CAMPAIGN_UPLOAD_UNIFIED_DATA",
          body: [
            {
              isMandatory: false,
              key: "uploadUnified",
              type: "component",
              component: "DataUploadWrapper",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                campaignData: campaignData,
                type: "unified-console",
              },
              populators: {
                name: "uploadUnified",
                required: true,
                customStyle: {
                  background: "none",
                },
              },
            },
          ],
        },
      ]
    : [
        {
          stepCount: "2",
          key: "2",
          name: "HCM_CAMPAIGN_UPLOAD_FACILITY_DATA",
          body: [
            {
              isMandatory: false,
              key: "uploadFacility",
              type: "component",
              component: "DataUploadWrapper",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                campaignData: campaignData,
                type: "facility",
                projectType: projectType,
              },
              populators: {
                name: "uploadFacility",
                required: true,
              },
            },
          ],
        },
        {
          stepCount: "3",
          key: "3",
          name: "HCM_CAMPAIGN_UPLOAD_USER_DATA",
          body: [
            {
              isMandatory: false,
              key: "uploadUser",
              type: "component",
              component: "DataUploadWrapper",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                campaignData: campaignData,
                type: "user",
                projectType: projectType,
              },
              populators: {
                name: "uploadUser",
                required: true,
              },
            },
          ],
        },
        {
          stepCount: "4",
          key: "4",
          name: "HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA",
          body: [
            {
              isMandatory: false,
              key: "uploadBoundary",
              type: "component",
              component: "DataUploadWrapper",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                campaignData: campaignData,
                type: "boundary",
                projectType: projectType,
              },
              populators: {
                name: "uploadBoundary",
                required: true,
              },
            },
          ],
        },
      ];

  const summaryStepCount = isUnifiedCampaign ? "3" : "5";
  const summaryKey = isUnifiedCampaign ? "3" : "5";

  return [
    {
      form: [
        {
          key: "1",
          stepCount: "1",
          name: "HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA",
          body: [
            {
              isMandatory: false,
              key: "boundaryType",
              type: "component",
              component: "UpdateBoundaryWrapper",
              mandatoryOnAPI: true,
              withoutLabelFieldPair: true,
              withoutLabel: true,
              // skipAPICall: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                hierarchyType: hierarchyType,
              },
              populators: {
                name: "boundaryType",
                // optionsKey: "code",
                error: "ES__REQUIRED",
                required: true,
              },
            },
          ],
        },
        ...uploadSteps,
        {
          stepCount: summaryStepCount,
          key: summaryKey,
          name: "HCM_CAMPAIGN_SUMMARY",
          isLast: true,
          body: [
            {
              isMandatory: false,
              key: "summary",
              type: "component",
              component: "CampaignUpdateSummary",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                campaignData: campaignData,
                summaryErrors: summaryErrors,
                hierarchyType: hierarchyType,
              },
              populators: {
                name: "summary",
                // optionsKey: "code",
                // error: "ES__REQUIRED",
                required: true,
              },
            },
          ],
        },
      ],
    },
  ];
};
