import { FormComposerV2 } from "@egovernments/digit-ui-components-core";
import React from "react";
import { useTranslation } from "react-i18next";
import { newConfig } from "../../configs/SampleConfig";

const Create = () => {
  const { t } = useTranslation();

  const defaultValues = {
    "text-Default": "Sample Text Input",
    "text-Noneditable": "Sample Text Input Noneditable",
    "text-Error": "Sample Text Input Error",
    "text-With Description": "Sample Text Input with description",
    "text-With CharCount": "Sample Text Input with charcount",
    "text-With Des&CharCount": "Sample Text Input with des&charcount",
    "text-With Des&Err": "Sample Text Input with Des&Err",
    "text-Mandatory": "Sample Text Input Mandatory",
    "text-With Info": "Sample Text Input with infomessage",
    "text-Info&Mandatory": "Sample Text Input mandatory&infomessage",
    "text-With Innerlabel": "Sample Text Input With Innerlabel",
    "text-With Validation": "S",
    "text-Without Label": "Sample Text Input Without Label",
    "text-Complete": "Sample Text Input Complete",

    "textarea-Default": "Sample TextArea",
    "textarea-Noneditable": "Sample TextArea Noneditable",
    "textarea-Error": "Sample TextArea Error",
    "textarea-With Description": "Sample TextArea with description",
    "textarea-With CharCount": "Sample TextArea with charcount",
    "textarea-With Des&CharCount": "Sample TextArea with des&charcount",
    "textarea-With Des&Err": "Sample TextArea with des&err",
    "textarea-Mandatory": "Sample TextArea mandatory",
    "textarea-With Info": "Sample TextArea with infomessage",
    "textarea-Info&Mandatory": "Sample TextArea mandatory&infomessage",
    "textarea-With InnerLabel": "Sample TextArea with innerlabel",
    "textarea-Withoutlabel": "Sample TextArea withoutlabel",
    "textarea-With Validation": "Sample",
    "textarea-Complete": "Sample TextArea complete",

    "numeric-Default": 0,
    "numeric-With Step Value": 0,
    "numeric-Noneditable": 0,
    "numeric-Error": 0,
    "numeric-With InfoMessage": 0,

    "prefix-Default": 1000,
    "prefix-Noneditable": 1000,
    "prefix-Error": 1000,
    "prefix-With Description": 1000,
    "prefix-With InfoMessage": 1000,

    "suffix-Default": 1000,
    "suffix-Noneditable": 1000,
    "suffix-Error": 1000,
    "suffix-With Description": 1000,
    "suffix-With Info": 1000,

    "password-Default": "password",
    "password-Noneditable": "password",
    "password-Error": "password",
    "password-With Description": "password",
    "password-With InfoMessage": "password",
  };

  const onSubmit = (data) => {
    console.log(data, "data");
  };

  const configs = newConfig;

  return (
    <FormComposerV2
      label={t("Submit")}
      config={configs.map((config) => {
        return {
          ...config,
          body: config.body.filter((a) => !a.hideInEmployee),
        };
      })}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
    />
  );
};

export default Create;