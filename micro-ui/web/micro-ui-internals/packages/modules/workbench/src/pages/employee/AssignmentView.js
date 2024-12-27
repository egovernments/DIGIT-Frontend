import React from 'react'
import { Loader, FormComposerV2 as FormComposer, Toast } from "@egovernments/digit-ui-react-components";

const newConfig = [
  {
    head: "Create Individual",
    body: [
      {
        inline: true,
        label: "Applicant Name",
        isMandatory: false,
        key: "applicantname",
        type: "text",
        disable: true,
        populators: { name: "applicantname", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        inline: true,
        label: "date of birth",
        isMandatory: false,
        key: "dob",
        type: "date",
        disable: true,
        populators: { name: "dob", error: "Required" },
      },
      {
        isMandatory: true,
        key: "genders",
        type: "dropdown",
        label: "Enter Gender",
        disable: true,
        populators: {
          name: "genders",
          optionsKey: "name",
          error: "required ",
          mdmsConfig: {
            masterName: "GenderType",
            moduleName: "common-masters",
            localePrefix: "COMMON_GENDER",
          },
        },
      },

      {
        label: "Phone number",
        isMandatory: true,
        key: "phno",
        type: "number",
        disable: true,
        populators: { name: "phno", error: "Required", validation: { min: 0, max: 9999999999 } },
      },
    ],
  },
];

const defVal = {
  "applicantname":"Piyush",
  "dob":"2024-12-11",
  "genders[name]":"male",
  "phno":"1234567890"
}

const AssignmentView = () => {
  return (
    <FormComposer
    label={"PROCEED"}
    config={newConfig}
    defaultValues={defVal}
    // onFormValueChange={onFormValueChange}
    onSubmit={(e)=>console.log(e.target.value)}
    fieldStyle={{ marginRight: 0 }}
    className="form-no-margin"
    labelBold={true}
    />
  )
}

export default AssignmentView