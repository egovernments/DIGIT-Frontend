export const MicroplanConfig = (totalFormData, dataParams, isSubmitting, summaryErrors, hierarchyData) => {
  return [
    {
      form: [
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
              resourceToUpdate: "CAMPAIGN",//which api to call enum ["CAMPAIGN","PLAN"]
              component: "CampaignDetails",
              withoutLabel: true,
              disable: false,
              // showPopupOnSubmission: {
              //   alertMessage: "ALERT_MESSAGE_CAMPAIGN",
              //   alertHeader: "ALERT_HEADER_CAMPAIGN"
              // },
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
          stepCount: "1",
          key: "2",
          name: "MICROPLAN_DETAILS",
          body: [
            {
              isMandatory: false,
              key: "microplanDetails",
              type: "component",
              skipAPICall: false,
              resourceToUpdate: "PLAN",
              component: "MicroplanDetails",
              withoutLabelFieldPair: true,
              withoutLabel: true,
              disable: false,
              showPopupOnSubmission: {
                alertMessage: "ALERT_MESSAGE_MICROPLAN",
                alertHeader: "ALERT_HEADER_MICROPLAN"
              },
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
          stepCount: "2",
          key: "3",
          name: "BOUNDARY",
          body: [
            {
              isMandatory: false,
              key: "boundarySelection",
              type: "component",
              skipAPICall: false,
              resourceToUpdate: "PLAN",
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
          stepCount: "3",
          key: "4",
          name: "UPLOADBOUNDARYDATA",
          body: [
            {
              isMandatory: false,
              key: "boundary",
              type: "component",
              skipAPICall: false,
              component: "UploadDataCustom",
              withoutLabel: true,
              disable: false,
              withoutLabelFieldPair: true,
              customProps: {
                module: "HCM",
                type: "boundary",
                sessionData: totalFormData,
                isSubmitting: isSubmitting
              },
              populators: {
                name: "boundary"
              },
            },
          ],
        },
        {
          stepCount: "3",
          key: "5",
          name: "UPLOADFACILITYDATA",
          body: [
            {
              isMandatory: false,
              key: "facilityWithBoundary",
              type: "component",
              skipAPICall: false,
              component: "UploadDataCustom",
              withoutLabel: true,
              disable: false,
              withoutLabelFieldPair: true,
              customProps: {
                module: "HCM",
                type: "facilityWithBoundary",
                sessionData: totalFormData,
                isSubmitting: isSubmitting
              },
              populators: {
                name: "facilityWithBoundary"
              },
            },
          ],
        },
        {
          stepCount: "4",
          key: "6",
          name: "ASSUMPTIONS_FORM",
          body: [
            {
              isMandatory: false,
              key: "assumptionsForm",
              type: "component",
              skipAPICall: false,
              component: "AssumptionsForm",
              withoutLabel: true,
              disable: false,
              withoutLabelFieldPair: true,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                isSubmitting: isSubmitting,

              },
              populators: {
                name: "assumptionsForm",
                required: true,
              },
            },
          ],
        },
        {
          stepCount: "4",
          key: "7",
          name: "HYPOTHESIS",
          body: [
            {
              isMandatory: true,
              key: "Assumptions",
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
        key: "8",
        name: "FORMULA_CONFIGURATION",
        body: [
          {
            isMandatory: false,
            key: "formulaConfiguration",
            type: "component",
            skipAPICall: false,
            component: "FormulaConfigWrapper",
            withoutLabel: true,
            withoutLabelFieldPair: true,
            disable: false,
            customProps: {
              module: "HCM",
              sessionData: totalFormData,
              isSubmitting: isSubmitting,
            },
            populators: {
              name: "formulaConfiguration",
              required: true,
            },
          },
        ],
      },
      {
        stepCount: "6",
        key: "9",
        name: "NEW_COLUMNS",
        body: [
          {
            isMandatory: false,
            key: "newColumns",
            type: "component",
            skipAPICall: false,
            component: "AddColumnsWrapper",
            withoutLabel: true,
            withoutLabelFieldPair: true,
            disable: false,
            customProps: {
              module: "HCM",
              sessionData: totalFormData,
              isSubmitting: isSubmitting,
            },
            populators: {
              name: "newColumns", 
              required: true,
            },
          },
        ],
      },
      {
        stepCount: "7",
        key: "10",
        name: "ROLE_ACCESS_CONFIGURATION",
        body: [
          {
            isMandatory: false,
            key: "roleAccessConfiguration",
            type: "component",
            skipAPICall: false,
            component: "UserAccessWrapper",
            withoutLabel: true,
            withoutLabelFieldPair: true,
            disable: false,
            customProps: {
              module: "HCM",
              sessionData: totalFormData,
              isSubmitting: isSubmitting,
              hierarchyData
            },
            populators: {
              name: "roleAccessConfiguration",
              required: true,
            },
          },
        ],
      },
        {
          stepCount: "8",
          key: "11",
          name: "SUMMARY_SCREEN",
          body: [
            {
              isMandatory: false,
              key: "summaryscreen",
              type: "component",
              skipAPICall: false,
              resourceToUpdate: "PLAN",
              component: "SummaryScreen",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              isLast:true,
              customProps: {
                module: "HCM",
                sessionData: totalFormData,
                isSubmitting: false,
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