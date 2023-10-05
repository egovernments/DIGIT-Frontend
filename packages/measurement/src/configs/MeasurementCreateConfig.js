export const CreateConfig = ({ defaultValue }) => {
    return {
      CreateConfig: [
        {
          defaultValues: defaultValue, // Use the default values here
  
          form: [
            {
              head: "",
              subHead: "",
              body: [
                {
                  inline: true,
                  label: "MB_WORK_ORDER_NUMBER",
                  isMandatory: false,
                  key: "contractNumber",
                  type: "paragraph",
                  disable: true,
                  appendColon: false,
                  populators: {
                    name: "contractNumber",
                    // "customClass": "fc-header-texts"
                  },
                },
                {
                  inline: true,
                  label: "MB_PROJECT_ID",
                  isMandatory: false,
                  key: "projectID",
                  type: "paragraph",
                  disable: true,
                  appendColon: false,
                  populators: {
                    name: "projectID",
                    // "customClass": "fc-header-texts"
                  },
                },
                {
                  inline: true,
                  label: "MB_PROJECT_DATE",
                  isMandatory: false,
                  key: "sanctionDate",
                  type: "paragraph",
                  disable: true,
                  appendColon: false,
                  populators: {
                    name: "sanctionDate",
                    // "customClass": "fc-header-texts"
                  },
                },
                {
                  inline: true,
                  label: "MB_PROJECT_NAME",
                  isMandatory: false,
                  key: "projectName",
                  type: "paragraph",
                  disable: true,
                  appendColon: false,
                  populators: {
                    name: "projectName",
                    customClass: "",
                  },
                },
                {
                  inline: true,
                  label: "MB_PROJECT_DESC",
                  isMandatory: false,
                  key: "projectDesc",
                  type: "paragraph",
                  disable: true,
                  appendColon: false,
                  populators: {
                    name: "projectDesc",
                    customClass: "",
                  },
                },
                {
                  inline: true,
                  label: "ES_COMMON_LOCATION",
                  isMandatory: false,
                  key: "projectLocation",
                  type: "paragraph",
                  disable: true,
                  appendColon: false,
                  populators: {
                    name: "projectLocation",
                    customClass: "",
                  },
                },
              ],
            },
            {
              head: "MB_SORS",
              subHead: "",
              body: [
                {
                  type: "component",
                  component: "MeasureTable",
                  withoutLabel: true,
                  key: "SOR",
                  mode: "CREATE",
                },
              ],
            },
            {
              head: "MB_NONSOR",
              subHead: "",
              body: [
                {
                  type: "component",
                  component: "MeasureTable",
                  withoutLabel: true,
                  key: "NONSOR",
                  mode: "CREATE",
                },
              ],
            },
            {
              head: "",
              subHead: "",
              body: [
                {
                  type: "component",
                  component: "ViewOnlyCard",
                  withoutLabel: true,
                  key: "viewAmount",
                },
              ],
            },
            {
              // "navLink": "Work Details",
              // "head": "Worksite Photos",
              body: [
                {
                  type: "documentUpload",
                  withoutLabel: true,
                  module: "Measurement",
                  error: "WORKS_REQUIRED_ERR",
                  name: "uploadedDocs",
                  key: "documentDetails",
                  customClass: "my doc",
                  localePrefix: "MB_MEASUREMENT_DOC",
                },
              ],
            },
          ],
        },
      ],
    };
  };