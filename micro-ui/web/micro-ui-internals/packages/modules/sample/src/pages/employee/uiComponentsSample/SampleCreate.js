import { FormComposerV2, HeaderComponent } from "@egovernments/digit-ui-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { createConfig } from "../../../configs/uiComponentsConfigs/createConfig";

const SampleCreate = () => {
  const { t } = useTranslation();

  const defaultValues = {
    "text-Default": "Sample Text Input",
    "text-Noneditable": "Sample Text Input Noneditable",
    "text-Required Field": "Sample Text Input Error",
    "text-With Description": "Sample Text Input with description",
    "text-With CharCount": "Sample Text Input with charcount",
    "text-With Des&CharCount": "Sample Text Input with des&charcount",
    "text-Required Field With Des": "Sample Text Input with Des&Err",
    "text-Required": "Sample Text Input Mandatory",
    "text-With Info": "Sample Text Input with infomessage",
    "text-Info&Mandatory": "Sample Text Input mandatory&infomessage",
    "text-With Innerlabel": "Sample Text Input With Innerlabel",
    "text-With Validation": "S",
    "text-Without Label": "Sample Text Input Without Label",
    "text-Complete": "Sample Text Input Complete",

    "textarea-Default": "Sample TextArea",
    "textarea-Noneditable": "Sample TextArea Noneditable",
    "textarea-Required Field": "Sample TextArea Error",
    "textarea-With Description": "Sample TextArea with description",
    "textarea-With CharCount": "Sample TextArea with charcount",
    "textarea-With Des&CharCount": "Sample TextArea with des&charcount",
    "textarea-Required Field With Des": "Sample TextArea with des&err",
    "textarea-Mandatory": "Sample TextArea mandatory",
    "textarea-With Info": "Sample TextArea with infomessage",
    "textarea-Info&Mandatory": "Sample TextArea mandatory&infomessage",
    "textarea-Withoutlabel": "Sample TextArea withoutlabel",
    "textarea-With Validation": "Sample",
    "textarea-Complete": "Sample TextArea complete",

    "numeric-Default": 0,
    "numeric-With Step Value": 0,
    "numeric-Noneditable": 0,
    "numeric-Required Field": 0,
    "numeric-With InfoMessage": 0,

    "prefix-Default": 1000,
    "prefix-Noneditable": 1000,
    "prefix-Required Field": 1000,
    "prefix-With Description": 1000,
    "prefix-With InfoMessage": 1000,

    "suffix-Default": 1000,
    "suffix-Noneditable": 1000,
    "suffix-Required Field": 1000,
    "suffix-With Description": 1000,
    "suffix-With Info": 1000,

    "password-Default": "password",
    "password-Noneditable": "password",
    "password-Required Field": "password",
    "password-With Description": "password",
    "password-With InfoMessage": "password",

    "date-Noneditable": "2024-04-03",
    "time-Noneditable": "03:00",
  };

  const onSubmit = (data) => {
    console.log(data, "data");
  };

  const onFormValueChange = (setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
    console.log(formData, "formData");
  };

  const configs = createConfig;

  return (
    <React.Fragment>
      <HeaderComponent className="digit-inbox-search-composer-header" styles={{marginBottom:"1.5rem"}}>{"New Components"}</HeaderComponent>
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
        onFormValueChange={onFormValueChange}
        labelfielddirectionvertical={false}
      />
    </React.Fragment>
  );
};

export default SampleCreate;
