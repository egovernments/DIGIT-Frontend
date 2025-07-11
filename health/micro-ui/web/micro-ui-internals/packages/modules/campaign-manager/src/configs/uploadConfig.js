import { last } from "lodash";

export const uploadConfig = (totalFormData, campaignData, dataParams, isSubmitting, summaryErrors, hierarchyData) => {
  return [
    {
      form: [
        {
          stepCount: "1",
          key: "1",
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
              },
              populators: {
                name: "uploadFacility",
                required: true,
                customStyle: {
                  background: "none",
                },
              },
            },
          ],
        },
        // {
        //   stepCount: "2",
        //   key: "2",
        //   name: "HCM_CAMPAIGN_UPLOAD_FACILITY_DATA_MAPPING",
        //   body: [
        //     {
        //       isMandatory: false,
        //       key: "uploadFacilityMapping",
        //       type: "component",
        //       component: "DataUploadWrapper",
        //       withoutLabel: true,
        //       withoutLabelFieldPair: true,
        //       disable: false,
        //       customProps: {
        //         module: "HCM",
        //         dataParams: dataParams,
        //         sessionData: totalFormData,
        //         hierarchyData: hierarchyData,
        //         type: "facilityWithBoundaryMapping",
        //         validationType: "facilityWithBoundary"
        //       },
        //       populators: {
        //         name: "uploadFacilityMapping",
        //         required: true,
        //       },
        //     },
        //   ],
        // },
        {
          stepCount: "2",
          key: "2",
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
              },
              populators: {
                name: "uploadUser",
                required: true,
                customStyle: {
                  background: "none",
                },
              },
            },
          ],
        },
        // {
        //   stepCount: "4",
        //   key: "4",
        //   name: "HCM_CAMPAIGN_UPLOAD_USER_DATA_MAPPING",
        //   body: [
        //     {
        //       isMandatory: false,
        //       key: "uploadUserMapping",
        //       type: "component",
        //       component: "DataUploadWrapper",
        //       withoutLabel: true,
        //       withoutLabelFieldPair: true,
        //       disable: false,
        //       customProps: {
        //         module: "HCM",
        //         dataParams: dataParams,
        //         sessionData: totalFormData,
        //         hierarchyData: hierarchyData,
        //         type: "userMapping",
        //         validationType: "userWithBoundary"
        //       },
        //       populators: {
        //         name: "uploadUserMapping",
        //         required: true,
        //       },
        //     },
        //   ],
        // },
        {
          stepCount: "3",
          key: "3",
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
              },
              populators: {
                name: "uploadBoundary",
                // optionsKey: "code",
                // error: "ES__REQUIRED",
                required: true,
                customStyle: {
                  background: "none",
                },
              },
            },
          ],
        },
        {
          stepCount: "4",
          key: "4",
          last: true,
          body: [
            {
              isMandatory: false,
              last: true,
              key: "DataUploadSummary",
              type: "component",
              component: "DataUploadSummary",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                campaignData: campaignData,
                summaryErrors: summaryErrors,
              },
              populators: {
                name: "DataUploadSummary",
                // optionsKey: "code",
                // error: "ES__REQUIRED",
                required: true,
                customStyle: {
                  background: "none",
                },
              },
            },
          ],
        },
      ],
    },
  ];
};
