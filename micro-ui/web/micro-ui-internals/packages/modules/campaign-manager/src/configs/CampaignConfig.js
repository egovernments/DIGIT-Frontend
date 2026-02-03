export const CampaignConfig = (totalFormData, dataParams, isSubmitting, summaryErrors, hierarchyData) => {
  return [
    {
      form: [
        {
          stepCount: "1",
          key: "1",
          name: "HCM_CAMPAIGN_TYPE",
          body: [
            {
              isMandatory: false,
              key: "projectType",
              type: "component",
              skipAPICall: true,
              component: "CampaignSelection",
              withoutLabel: true,
              withoutLabelFieldPair: true,
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
          stepCount: "1",
          key: "2",
          name: "HCM_CAMPAIGN_NAME",
          body: [
            {
              isMandatory: false,
              key: "campaignName",
              type: "component",
              component: "CampaignName",
              mandatoryOnAPI: true,
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                isSubmitting: isSubmitting,
              },
              populators: {
                name: "campaignName",
                required: true,
              },
            },
          ],
        },
        {
          stepCount: "1",
          key: "3",
          name: "HCM_CAMPAIGN_DATE",
          body: [
            {
              isMandatory: false,
              key: "campaignDates",
              type: "component",
              component: "CampaignDates",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                isSubmitting: isSubmitting,
              },
              populators: {
                name: "campaignDates",
                // optionsKey: "code",
                // error: "ES__REQUIRED",
                required: true,
              },
            },
          ],
        },
        {
          stepCount: "1",
          key: "4",
          body: [
            {
              isMandatory: false,
              key: "CampaignDetailsSummary",
              type: "component",
              component: "CampaignDetailsSummary",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                summaryErrors: summaryErrors,
              },
              populators: {
                name: "CampaignDetailsSummary",
                // optionsKey: "code",
                // error: "ES__REQUIRED",
                required: true,
              },
            },
          ],
        },
        {
          stepCount: "2",
          key: "5",
          name: "HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA",
          body: [
            {
              isMandatory: false,
              key: "boundaryType",
              type: "component",
              component: "SelectingBoundariesDuplicate",
              withoutLabelFieldPair: true,
              withoutLabel: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                dataParams: dataParams,
                hierarchyData: hierarchyData,
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
        {
          stepCount: "2",
          key: "6",
          body: [
            {
              isMandatory: false,
              key: "BoundarySummary",
              type: "component",
              component: "BoundarySummary",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                summaryErrors: summaryErrors,
              },
              populators: {
                name: "BoundarySummary",
                // optionsKey: "code",
                // error: "ES__REQUIRED",
                required: true,
              },
            },
          ],
        },
        {
          stepCount: "3",
          key: "7",
          name: "HCM_CAMPAIGN_CYCLE_CONFIGURE",
          body: [
            {
              isMandatory: false,
              key: "cycleConfigure",
              type: "component",
              component: "CycleConfiguration",
              withoutLabelFieldPair: true,
              withoutLabel: true,
              disable: false,
              customProps: {
                module: "HCM",
              },
              populators: {
                name: "cycleConfiguration",
                sessionData: totalFormData,
                // optionsKey: "code",
                error: "ES__REQUIRED",
                required: true,
              },
            },
          ],
        },
        {
          stepCount: "3",
          key: "8",
          name: "HCM_CAMPAIGN_DELIVERY_DATA",
          body: [
            {
              isMandatory: false,
              key: "deliveryRule",
              type: "component",
              component: "DeliveryRule",
              withoutLabelFieldPair: true,
              withoutLabel: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
              },
              populators: {
                name: "deliveryRule",
                // optionsKey: "code",
                error: "ES__REQUIRED",
                required: true,
              },
            },
          ],
        },
        {
          stepCount: "3",
          key: "9",
          body: [
            {
              isMandatory: false,
              key: "DeliveryDetailsSummary",
              type: "component",
              component: "DeliveryDetailsSummary",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                summaryErrors: summaryErrors,
              },
              populators: {
                name: "DeliveryDetailsSummary",
                // optionsKey: "code",
                // error: "ES__REQUIRED",
                required: true,
              },
            },
          ],
        },
        
        {
          stepCount: "4",
          key: "10",
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
                type: "facilityWithBoundary",
              },
              populators: {
                name: "uploadFacility",
                required: true,
              },
            },
          ],
        },
        {
          stepCount: "4",
          key: "11",
          name: "HCM_CAMPAIGN_UPLOAD_FACILITY_DATA_MAPPING",
          body: [
            {
              isMandatory: false,
              key: "uploadFacilityMapping",
              type: "component",
              component: "DataUploadWrapper",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              customProps: {
                module: "HCM",
                dataParams: dataParams,
                sessionData: totalFormData,
                hierarchyData: hierarchyData,
                type: "facilityWithBoundaryMapping",
                validationType: "facilityWithBoundary"
              },
              populators: {
                name: "uploadFacilityMapping",
                required: true,
              },
            },
          ],
        },
        {
          stepCount: "4",
          key: "12",
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
                type: "userWithBoundary",
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
          key: "13",
          name: "HCM_CAMPAIGN_UPLOAD_USER_DATA_MAPPING",
          body: [
            {
              isMandatory: false,
              key: "uploadUserMapping",
              type: "component",
              component: "DataUploadWrapper",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              customProps: {
                module: "HCM",
                dataParams: dataParams,
                sessionData: totalFormData,
                hierarchyData: hierarchyData,
                type: "userMapping",
                validationType: "userWithBoundary"
              },
              populators: {
                name: "uploadUserMapping",
                required: true,
              },
            },
          ],
        },
        {
          stepCount: "4",
          key: "14",
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
                type: "boundary",
              },
              populators: {
                name: "uploadBoundary",
                // optionsKey: "code",
                // error: "ES__REQUIRED",
                required: true,
              },
            },
          ],
        },
        {
          stepCount: "4",
          key: "15",
          body: [
            {
              isMandatory: false,
              key: "DataUploadSummary",
              type: "component",
              component: "DataUploadSummary",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                summaryErrors: summaryErrors,
              },
              populators: {
                name: "DataUploadSummary",
                // optionsKey: "code",
                // error: "ES__REQUIRED",
                required: true,
              },
            },
          ],
        },
        {
          stepCount: "5",
          key: "16",
          isLast: true,
          body: [
            {
              isMandatory: false,
              key: "summary",
              type: "component",
              component: "CampaignSummary",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                summaryErrors: summaryErrors,
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
