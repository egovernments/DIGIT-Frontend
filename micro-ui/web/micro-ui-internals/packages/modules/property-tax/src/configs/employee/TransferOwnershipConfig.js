export const TransferOwnershipConfig = (totalFormData, propertyData, isSubmitting) => {
  return [
    {
      form: [
        {
          stepCount: "1",
          key: "1",
          name: "PT_TRANSFEREE_DETAILS",
          body: [
            {
              isMandatory: true,
              key: "transfereeDetails",
              type: "component",
              skipAPICall: false,
              resourceToUpdate: "PROPERTY",
              component: "PTTransfereeDetails",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              customProps: {
                module: "PT",
                sessionData: totalFormData,
                isSubmitting: isSubmitting,
                propertyData: propertyData,
              },
              populators: {
                name: "transfereeDetails",
                required: true,
              },
            },
          ],
        },
        {
          stepCount: "2",
          key: "2",
          name: "PT_DOCUMENT_DETAILS",
          body: [
            {
              isMandatory: true,
              key: "documents",
              type: "component",
              skipAPICall: false,
              resourceToUpdate: "PROPERTY",
              component: "PTDocumentUpload",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              customProps: {
                module: "PT",
                sessionData: totalFormData,
                isSubmitting: isSubmitting,
                propertyData: propertyData,
              },
              populators: {
                name: "documents",
                required: true,
                documentTypes: [
                  {
                    code: "ADDRESSPROOF",
                    label: "PT_ADDRESS_PROOF",
                    required: true,
                  },
                  {
                    code: "IDENTITYPROOF",
                    label: "PT_IDENTITY_PROOF",
                    required: true,
                  },
                  {
                    code: "TRANSFERREASONPROOF",
                    label: "PT_TRANSFER_REASON_PROOF",
                    required: true,
                  },
                  {
                    code: "SPECIALCATEGORYPROOF",
                    label: "PT_SPECIAL_CATEGORY_PROOF",
                    required: false,
                  },
                ],
              },
            },
          ],
        },
        {
          stepCount: "3",
          key: "3",
          name: "PT_REVIEW_DETAILS",
          body: [
            {
              isMandatory: false,
              key: "review",
              type: "component",
              skipAPICall: false,
              resourceToUpdate: "PROPERTY",
              component: "PTTransferReview",
              withoutLabel: true,
              withoutLabelFieldPair: true,
              disable: false,
              isLast: true,
              customProps: {
                module: "PT",
                sessionData: totalFormData,
                isSubmitting: false,
                propertyData: propertyData,
              },
              populators: {
                name: "review",
              },
            },
          ],
        },
      ],
    },
  ];
};