import { FormComposerV2, Stepper } from "@egovernments/digit-ui-components-core";
import React from "react";
import { useTranslation } from "react-i18next";
import { newConfig } from "../../configs/SampleConfig";
import { Button } from "@egovernments/digit-ui-components-core";
import { useState } from "react";

const Create = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);

  const onStepClick = (step) => {
    console.log("step", step);
    setCurrentStep(step);
  };

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
    <React.Fragment>
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          backgroundColor: "#FFFFFF",
          padding: "16px",
          marginBottom: "64px",
          borderRadius: "4px",
        }}
      >
        <Button variation="primary" label={"Primary"} type="button" />
        <Button variation="primary" label={"Primary"} type="button" icon="MyLocation" />
        <Button variation="primary" label={"Primary"} type="button" icon="MyLocation" isSuffix={true} />
        <Button variation="primary" label={"Primary"} type="button" isDisabled={true} />
        <Button variation="primary" label={"PrimaryWithsixtyfourcharactersPrimaryWithsixtyfourcharacterschar"} type="button" />
        <Button variation="primary" label={"PrimaryWithmorethansixtyfourcharactersPrimaryWithsixtyfourcharacters"} type="button" />
        <Button
          variation="primary"
          label={"PrimaryWithmorethansixtyfourcharactersandwithiconPrimaryWithsixtyfourcharacters"}
          type="button"
          icon="MyLocation"
        />
        <Button
          variation="primary"
          label={"PrimaryWithmorethansixtyfourcharactersandwithiconPrimaryWithsixtyfourcharacters"}
          type="button"
          icon="MyLocation"
          isSuffix={true}
        />

        <Button variation="secondary" label={"Secondary"} type="button" />
        <Button variation="secondary" label={"Secondary"} type="button" icon="MyLocation" />
        <Button variation="secondary" label={"Secondary"} type="button" icon="MyLocation" isSuffix={true} />
        <Button variation="secondary" label={"Secondary"} type="button" isDisabled={true} />
        <Button variation="secondary" label={"SecondaryWithsixtyfourcharactersSecondaryWithsixtyfourcharacters"} type="button" />
        <Button variation="secondary" label={"SecondaryWithmorethansixtyfourcharactersSecondaryWithsixtyfourcharacters"} type="button" />
        <Button
          variation="secondary"
          label={"SecondaryWithmorethansixtyfourcharactersandwithiconSecondaryWithsixtyfourcharacters"}
          type="button"
          icon="MyLocation"
        />
        <Button
          variation="secondary"
          label={"SecondaryWithmorethansixtyfourcharactersandwithiconSecondaryWithsixtyfourcharacters"}
          type="button"
          icon="MyLocation"
          isSuffix={true}
        />

        <Button variation="teritiary" label={"Teritiary"} type="button" />
        <Button variation="teritiary" label={"Teritiary"} type="button" icon="MyLocation" />
        <Button variation="teritiary" label={"Teritiary"} type="button" icon="MyLocation" isSuffix={true} />
        <Button variation="teritiary" label={"Teritiary"} type="button" isDisabled={true} />
        <Button variation="teritiary" label={"TeritiaryWithsixtyfourcharactersTeritiaryWithsixtyfourcharacters"} type="button" />
        <Button variation="teritiary" label={"TeritiaryWithmorethansixtyfourcharactersTeritiaryWithsixtyfourcharacters"} type="button" />
        <Button
          variation="teritiary"
          label={"TeritiaryWithmorethansixtyfourcharactersandwithiconTeritiaryWithsixtyfourcharacters"}
          type="button"
          icon="MyLocation"
        />
        <Button
          variation="teritiary"
          label={"TeritiaryWithmorethansixtyfourcharactersandwithiconTeritiaryWithsixtyfourcharacters"}
          type="button"
          icon="MyLocation"
          isSuffix={true}
        />

        <Button variation="link" label={"Link"} type="button" />
        <Button variation="link" label={"Link"} type="button" icon="MyLocation" />
        <Button variation="link" label={"Link"} type="button" icon="MyLocation" isSuffix={true} />
        <Button variation="link" label={"Link"} type="button" isDisabled={true} />
        <Button
          variation="link"
          label={
            "LinkdoesnothaveanyrestrictionforthenumberofcharactersitcanhaveanynumberofcharactersLinkdoesnothaveanyrestrictionforthenumberofcharactersitcanhaveanynumberofcharactersLinkdoesnothaveanyrestrictionforthenumberofcharactersitcanhaveanynumberofcharactersLinkdoesnothaveanyrestrictionforthenumberofcharactersitcanhaveanynumberofcharacters"
          }
          type="button"
        />
        <Button
          variation="link"
          label={
            "LinkdoesnothaveanyrestrictionforthenumberofcharactersitcanhaveanynumberofcharactersLinkdoesnothaveanyrestrictionforthenumberofcharactersitcanhaveanynumberofcharactersLinkdoesnothaveanyrestrictionforthenumberofcharactersitcanhaveanynumberofcharactersLinkdoesnothaveanyrestrictionforthenumberofcharactersitcanhaveanynumberofcharacters"
          }
          type="button"
          icon="MyLocation"
        />
        <Button
          variation="link"
          label={
            "LinkdoesnothaveanyrestrictionforthenumberofcharactersitcanhaveanynumberofcharactersLinkdoesnothaveanyrestrictionforthenumberofcharactersitcanhaveanynumberofcharactersLinkdoesnothaveanyrestrictionforthenumberofcharactersitcanhaveanynumberofcharactersLinkdoesnothaveanyrestrictionforthenumberofcharactersitcanhaveanynumberofcharacters"
          }
          type="button"
          icon="MyLocation"
          isSuffix={true}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          backgroundColor: "#FFFFFF",
          padding: "16px",
          marginBottom: "64px",
          borderRadius: "4px",
        }}
      >
        <Stepper
          populators={{
            name: "stepper",
          }}
          type="stepper"
          currentStep={currentStep+1}
          customSteps={{}}
          totalSteps={5}
          direction="horizontal"
          onStepClick={onStepClick}
        />
        <Stepper
          populators={{
            name: "stepper",
          }}
          type="stepper"
          currentStep={3}
          customSteps={{}}
          totalSteps={5}
          direction="horizontal"
          onStepClick={() => {
            console.log("step clicked");
          }}
        />
      </div>
    </React.Fragment>
  );
};

export default Create;
