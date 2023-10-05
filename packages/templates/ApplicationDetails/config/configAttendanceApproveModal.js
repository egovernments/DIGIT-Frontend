
const configAttendanceApproveModal = ({ t, action }) => {
    if (action?.applicationStatus === "APPROVED") {
      return {
        label: {
          heading: t("APPROVE_MUSTOR_ROLL"),
          submit: t("ATM_APPROVE"),
          cancel: t("ES_COMMON_CANCEL"),
        },
        form: [
          {
            body: [
              {
                label: " ",
                type: "checkbox",
                disable: false,
                populators: {
                  name: "acceptTerms",
                  title: "MUSTOR_APPROVAL_CHECKBOX",
                  isMandatory: true,
                  // styles:{"marginLeft":"38px"},
                  labelStyles: {marginLeft:"40px"},
                  customLabelMarkup: true
                }
              },
              {
                label: t("WF_COMMON_COMMENTS"),
                type: "textarea",
                populators: {
                  name: "comments",
                },
              },
            ],
          },
        ]
      };
    }
  };
  
  export default configAttendanceApproveModal;