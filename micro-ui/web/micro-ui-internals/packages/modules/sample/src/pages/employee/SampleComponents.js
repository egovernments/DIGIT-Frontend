import {
    FormComposerV2,
    InfoCard,
    Stepper,
    Button,
    Timeline,
    InfoButton,
    PopUp,
  } from "@egovernments/digit-ui-components";
  import { Header } from "@egovernments/digit-ui-react-components";
  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { useTranslation } from "react-i18next";
  import { SampleConfig } from "../../configs/SampleConfig";
  
  const Create = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [showpopup, setShowpopup] = useState(false);
    const [showalert, setShowalert] = useState(false);
  
    const onStepClick = (step) => {
      setCurrentStep(step);
    };
  
    const commonDivStyle = {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      backgroundColor: "#FFFFFF",
      padding: "16px",
      marginBottom: "64px",
      borderRadius: "4px",
    };
  
    const additionalElementsforTimeline = [
      <div key="1">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        Lorem Ipsum has been the industry's
      </div>,
      <Button variation="link" label={"Click on the link"} type="button" />,
      <img
        key="2"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"
        alt="Additional Element 2"
      />,
      <img
        key="3"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"
        alt="Additional Element 3"
      />,
      <img
        key="4"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"
        alt="Additional Element 4"
      />,
      <img
        key="5"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"
        alt="Additional Element 5"
      />,
      <img
        key="6"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"
        alt="Additional Element 6"
      />,
      <img
        key="7"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"
        alt="Additional Element 7"
      />,
      <img
        key="8"
        src="https://digit.org/wp-content/uploads/2023/06/Digit-Logo-1.png"
        alt="Additional Element 8"
      />,
      <Button
        variation="primary"
        label={"Button"}
        type="button"
        icon="MyLocation"
      />,
      <Button
        variation="secondary"
        label={"Button"}
        type="button"
        icon="MyLocation"
        isSuffix={true}
      />,
    ];
  
    const subElements = [
      "26 / 03 / 2024",
      "11:00 PM",
      "26 / 03 / 2024 11:00 PM",
      "26 / 03 / 2024 11:00 PM Mon",
      "+91 **********",
    ];
  
    const additionalElementsforInfoCard = [
      <p key="1">Additional Element 1</p>,
      <img
        key="2"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"
        alt="Additional Element 2"
      />,
      <img
        key="3"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"
        alt="Additional Element 3"
      />,
      <img
        key="4"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"
        alt="Additional Element 4"
      />,
      <img
        key="5"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"
        alt="Additional Element 5"
      />,
      <img
        key="6"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"
        alt="Additional Element 6"
      />,
      <img
        key="7"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"
        alt="Additional Element 7"
      />,
      <img
        key="8"
        src="https://digit.org/wp-content/uploads/2023/06/Digit-Logo-1.png"
        alt="Additional Element 8"
      />,
      <InfoButton label={"Button"} size="large" isDisabled={false}></InfoButton>,
    ];
  
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
  
    useEffect(() => {}, [showalert, showpopup]);
  
    const children = [
      <div>This is the content of the Popup</div>,
      <InfoCard
        variant={"error"}
        text={"This is an error"}
        className={"popup-info-card"}
      />,
    ];
  
    const footerChildren = [
      <Button
        type={"button"}
        size={"large"}
        variation={"secondary"}
        label="Button"
      />,
      <Button
        type={"button"}
        size={"large"}
        variation={"primary"}
        label="Button"
      />,
    ];
  
    const showPopupComponent = () => {
      setShowpopup(true);
    };
  
    const showAlertPopupComponent = () => {
      setShowalert(true);
    };
  
    const onSubmit = (data) => {
      navigate(`/${window.contextPath}/employee/sample/sample-success`);
    };
  
  
    return (
      <React.Fragment>
        <div style={commonDivStyle}>
          <Stepper
            populators={{
              name: "stepper",
            }}
            currentStep={currentStep + 1}
            customSteps={{}}
            totalSteps={5}
            direction="horizontal"
            onStepClick={onStepClick}
          />
        </div>
        <div style={commonDivStyle}>
          <InfoCard
            populators={{
              name: "infocard",
            }}
            variant="default"
            text={
              "Application process will take a minute to complete. It might cost around Rs.500/- to Rs.1000/- to clean your septic tank and you can expect theservice to get completed in 24 hrs from the time of payment."
            }
            label={"Info"}
          />
          <InfoCard
            populators={{
              name: "infocardsuccess",
            }}
            variant="success"
            text={
              "Application process will take a minute to complete. It might cost around Rs.500/- to Rs.1000/- to clean your septic tank and you can expect theservice to get completed in 24 hrs from the time of payment."
            }
            label={"Success"}
          />
          <InfoCard
            populators={{
              name: "infocardwarning",
            }}
            variant="warning"
            text={
              "Application process will take a minute to complete. It might cost around Rs.500/- to Rs.1000/- to clean your septic tank and you can expect theservice to get completed in 24 hrs from the time of payment."
            }
            label={"Warning"}
          />
          <InfoCard
            populators={{
              name: "infocarderror",
            }}
            variant="error"
            text={
              "Application process will take a minute to complete. It might cost around Rs.500/- to Rs.1000/- to clean your septic tank and you can expect theservice to get completed in 24 hrs from the time of payment."
            }
            label={"Error"}
          />
  
          <InfoCard
            populators={{
              name: "infocardwithelements",
            }}
            variant="default"
            text={
              "Application process will take a minute to complete. It might cost around Rs.500/- to Rs.1000/- to clean your septic tank and you can expect the service to get completed in 24 hrs from the time of payment."
            }
            label={"Info"}
            additionalElements={additionalElementsforInfoCard}
          />
  
          <InfoCard
            populators={{
              name: "infocardwithelements",
            }}
            variant="default"
            text={
              "Application process will take a minute to complete. It might cost around Rs.500/- to Rs.1000/- to clean your septic tank and you can expect the service to get completed in 24 hrs from the time of payment."
            }
            label={"Info"}
            inline={true}
            additionalElements={additionalElementsforInfoCard}
          />
        </div>
        <Header styles={{ marginLeft: "16px" }}>{"New Components"}</Header>
        <FormComposerV2
          label={t("Submit")}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          labelfielddirectionvertical={false}
          config={SampleConfig().SampleConfig[0]?.form?.filter((a) => (!a.hasOwnProperty('forOnlyUpdate') || props?.isUpdate)).map((config) => {
            return {
              ...config,
              body: config.body.filter((a) => !a.hideInEmployee),
            };
          })}
          fieldStyle={{ marginRight: 0 }}
          showMultipleCardsWithoutNavs={true}
          noBreakLine={true}
        />
        <div style={commonDivStyle}>
          <Button
            variation="primary"
            label={"Primary"}
            type="button"
            size={"large"}
          />
          <Button
            variation="primary"
            label={"Primary"}
            type="button"
            icon="MyLocation"
            size={"large"}
          />
          <Button
            variation="primary"
            label={"Primary"}
            type="button"
            icon="MyLocation"
            isSuffix={true}
            size={"large"}
          />
          <Button
            variation="primary"
            label={"Primary"}
            type="button"
            isDisabled={true}
            size={"large"}
          />
          <Button
            variation="primary"
            label={
              "PrimaryWithsixtyfourcharactersPrimaryWithsixtyfourcharacterschar"
            }
            type="button"
            size={"large"}
          />
          <Button
            variation="primary"
            label={
              "PrimaryWithmorethansixtyfourcharactersPrimaryWithsixtyfourcharacters"
            }
            type="button"
            size={"large"}
          />
          <Button
            variation="primary"
            label={
              "PrimaryWithmorethansixtyfourcharactersandwithiconPrimaryWithsixtyfourcharacters"
            }
            type="button"
            icon="MyLocation"
            size={"large"}
          />
          <Button
            variation="primary"
            label={
              "PrimaryWithmorethansixtyfourcharactersandwithiconPrimaryWithsixtyfourcharacters"
            }
            type="button"
            icon="MyLocation"
            isSuffix={true}
            size={"large"}
          />
  
          <Button
            variation="secondary"
            label={"Secondary"}
            type="button"
            size={"large"}
          />
          <Button
            variation="secondary"
            label={"Secondary"}
            type="button"
            icon="MyLocation"
            size={"large"}
          />
          <Button
            variation="secondary"
            label={"Secondary"}
            type="button"
            icon="MyLocation"
            isSuffix={true}
            size={"large"}
          />
          <Button
            variation="secondary"
            label={"Secondary"}
            type="button"
            isDisabled={true}
            size={"large"}
          />
          <Button
            variation="secondary"
            label={
              "SecondaryWithsixtyfourcharactersSecondaryWithsixtyfourcharacters"
            }
            type="button"
            size={"large"}
          />
          <Button
            variation="secondary"
            label={
              "SecondaryWithmorethansixtyfourcharactersSecondaryWithsixtyfourcharacters"
            }
            type="button"
            size={"large"}
          />
          <Button
            variation="secondary"
            label={
              "SecondaryWithmorethansixtyfourcharactersandwithiconSecondaryWithsixtyfourcharacters"
            }
            type="button"
            icon="MyLocation"
            size={"large"}
          />
          <Button
            variation="secondary"
            label={
              "SecondaryWithmorethansixtyfourcharactersandwithiconSecondaryWithsixtyfourcharacters"
            }
            type="button"
            icon="MyLocation"
            isSuffix={true}
            size={"large"}
          />
  
          <Button
            variation="teritiary"
            label={"Teritiary"}
            type="button"
            size={"large"}
          />
          <Button
            variation="teritiary"
            label={"Teritiary"}
            type="button"
            icon="MyLocation"
            size={"large"}
          />
          <Button
            variation="teritiary"
            label={"Teritiary"}
            type="button"
            icon="MyLocation"
            isSuffix={true}
            size={"large"}
          />
          <Button
            variation="teritiary"
            label={"Teritiary"}
            type="button"
            isDisabled={true}
            size={"large"}
          />
          <Button
            variation="teritiary"
            label={
              "TeritiaryWithsixtyfourcharactersTeritiaryWithsixtyfourcharacters"
            }
            type="button"
            size={"large"}
          />
          <Button
            variation="teritiary"
            label={
              "TeritiaryWithmorethansixtyfourcharactersTeritiaryWithsixtyfourcharacters"
            }
            type="button"
            size={"large"}
          />
          <Button
            variation="teritiary"
            label={
              "TeritiaryWithmorethansixtyfourcharactersandwithiconTeritiaryWithsixtyfourcharacters"
            }
            type="button"
            icon="MyLocation"
            size={"large"}
          />
          <Button
            variation="teritiary"
            label={
              "TeritiaryWithmorethansixtyfourcharactersandwithiconTeritiaryWithsixtyfourcharacters"
            }
            type="button"
            icon="MyLocation"
            isSuffix={true}
            size={"large"}
          />
  
          <Button variation="link" label={"Link"} type="button" size={"large"} />
          <Button
            variation="link"
            label={"Link"}
            type="button"
            icon="MyLocation"
            size={"large"}
          />
          <Button
            variation="link"
            label={"Link"}
            type="button"
            icon="MyLocation"
            isSuffix={true}
            size={"large"}
          />
          <Button
            variation="link"
            label={"Link"}
            type="button"
            isDisabled={true}
            size={"large"}
          />
          <Button
            variation="link"
            label={
              "Linkdoesnothaveanyrestrictionforthenumberofcharactersitcanhaveanynumberofcharacters"
            }
            type="button"
            size={"large"}
          />
          <Button
            variation="link"
            label={
              "Linkdoesnothaveanyrestrictionforthenumberofcharactersitcanhaveanynumberofcharacters"
            }
            type="button"
            icon="MyLocation"
            size={"large"}
          />
          <Button
            variation="link"
            label={"Linkdoesnothaveanyrestrictionforthenumberofcharacters"}
            type="button"
            icon="MyLocation"
            isSuffix={true}
            size={"large"}
          />
        </div>
        <div style={commonDivStyle}>
          <Button
            variation="primary"
            label={"Primary"}
            type="button"
            size={"medium"}
          />
          <Button
            variation="primary"
            label={"Primary"}
            type="button"
            icon="MyLocation"
            size={"medium"}
          />
          <Button
            variation="primary"
            label={"Primary"}
            type="button"
            icon="MyLocation"
            isSuffix={true}
            size={"medium"}
          />
          <Button
            variation="primary"
            label={"Primary"}
            type="button"
            isDisabled={true}
            size={"medium"}
          />
          <Button
            variation="primary"
            label={
              "PrimaryWithsixtyfourcharactersPrimaryWithsixtyfourcharacterschar"
            }
            type="button"
            size={"medium"}
          />
          <Button
            variation="primary"
            label={
              "PrimaryWithmorethansixtyfourcharactersPrimaryWithsixtyfourcharacters"
            }
            type="button"
            size={"medium"}
          />
          <Button
            variation="primary"
            label={
              "PrimaryWithmorethansixtyfourcharactersandwithiconPrimaryWithsixtyfourcharacters"
            }
            type="button"
            icon="MyLocation"
            size={"medium"}
          />
          <Button
            variation="primary"
            label={
              "PrimaryWithmorethansixtyfourcharactersandwithiconPrimaryWithsixtyfourcharacters"
            }
            type="button"
            icon="MyLocation"
            isSuffix={true}
            size={"medium"}
          />
  
          <Button
            variation="secondary"
            label={"Secondary"}
            type="button"
            size={"medium"}
          />
          <Button
            variation="secondary"
            label={"Secondary"}
            type="button"
            icon="MyLocation"
            size={"medium"}
          />
          <Button
            variation="secondary"
            label={"Secondary"}
            type="button"
            icon="MyLocation"
            isSuffix={true}
            size={"medium"}
          />
          <Button
            variation="secondary"
            label={"Secondary"}
            type="button"
            isDisabled={true}
            size={"medium"}
          />
          <Button
            variation="secondary"
            label={
              "SecondaryWithsixtyfourcharactersSecondaryWithsixtyfourcharacters"
            }
            type="button"
            size={"medium"}
          />
          <Button
            variation="secondary"
            label={
              "SecondaryWithmorethansixtyfourcharactersSecondaryWithsixtyfourcharacters"
            }
            type="button"
            size={"medium"}
          />
          <Button
            variation="secondary"
            label={
              "SecondaryWithmorethansixtyfourcharactersandwithiconSecondaryWithsixtyfourcharacters"
            }
            type="button"
            icon="MyLocation"
            size={"medium"}
          />
          <Button
            variation="secondary"
            label={
              "SecondaryWithmorethansixtyfourcharactersandwithiconSecondaryWithsixtyfourcharacters"
            }
            type="button"
            icon="MyLocation"
            isSuffix={true}
            size={"medium"}
          />
  
          <Button
            variation="teritiary"
            label={"Teritiary"}
            type="button"
            size={"medium"}
          />
          <Button
            variation="teritiary"
            label={"Teritiary"}
            type="button"
            icon="MyLocation"
            size={"medium"}
          />
          <Button
            variation="teritiary"
            label={"Teritiary"}
            type="button"
            icon="MyLocation"
            isSuffix={true}
            size={"medium"}
          />
          <Button
            variation="teritiary"
            label={"Teritiary"}
            type="button"
            isDisabled={true}
            size={"medium"}
          />
          <Button
            variation="teritiary"
            label={
              "TeritiaryWithsixtyfourcharactersTeritiaryWithsixtyfourcharacters"
            }
            type="button"
            size={"medium"}
          />
          <Button
            variation="teritiary"
            label={
              "TeritiaryWithmorethansixtyfourcharactersTeritiaryWithsixtyfourcharacters"
            }
            type="button"
            size={"medium"}
          />
          <Button
            variation="teritiary"
            label={
              "TeritiaryWithmorethansixtyfourcharactersandwithiconTeritiaryWithsixtyfourcharacters"
            }
            type="button"
            icon="MyLocation"
            size={"medium"}
          />
          <Button
            variation="teritiary"
            label={
              "TeritiaryWithmorethansixtyfourcharactersandwithiconTeritiaryWithsixtyfourcharacters"
            }
            type="button"
            icon="MyLocation"
            isSuffix={true}
            size={"medium"}
          />
  
          <Button variation="link" label={"Link"} type="button" size={"medium"} />
          <Button
            variation="link"
            label={"Link"}
            type="button"
            icon="MyLocation"
            size={"medium"}
          />
          <Button
            variation="link"
            label={"Link"}
            type="button"
            icon="MyLocation"
            isSuffix={true}
            size={"medium"}
          />
          <Button
            variation="link"
            label={"Link"}
            type="button"
            isDisabled={true}
            size={"medium"}
          />
          <Button
            variation="link"
            label={
              "Linkdoesnothaveanyrestrictionforthenumberofcharactersitcanhaveanynumberofcharacters"
            }
            type="button"
            size={"medium"}
          />
          <Button
            variation="link"
            label={
              "Linkdoesnothaveanyrestrictionforthenumberofcharactersitcanhaveanynumberofcharacters"
            }
            type="button"
            icon="MyLocation"
            size={"medium"}
          />
          <Button
            variation="link"
            label={"Linkdoesnothaveanyrestrictionforthenumberofcharacters"}
            type="button"
            icon="MyLocation"
            isSuffix={true}
            size={"medium"}
          />
        </div>
        <div style={commonDivStyle}>
          <Button
            variation="primary"
            label={"Primary"}
            type="button"
            size={"small"}
          />
          <Button
            variation="primary"
            label={"Primary"}
            type="button"
            icon="MyLocation"
            size={"small"}
          />
          <Button
            variation="primary"
            label={"Primary"}
            type="button"
            icon="MyLocation"
            isSuffix={true}
            size={"small"}
          />
          <Button
            variation="primary"
            label={"Primary"}
            type="button"
            isDisabled={true}
            size={"small"}
          />
          <Button
            variation="primary"
            label={
              "PrimaryWithsixtyfourcharactersPrimaryWithsixtyfourcharacterschar"
            }
            type="button"
            size={"small"}
          />
          <Button
            variation="primary"
            label={
              "PrimaryWithmorethansixtyfourcharactersPrimaryWithsixtyfourcharacters"
            }
            type="button"
            size={"small"}
          />
          <Button
            variation="primary"
            label={
              "PrimaryWithmorethansixtyfourcharactersandwithiconPrimaryWithsixtyfourcharacters"
            }
            type="button"
            icon="MyLocation"
            size={"small"}
          />
          <Button
            variation="primary"
            label={
              "PrimaryWithmorethansixtyfourcharactersandwithiconPrimaryWithsixtyfourcharacters"
            }
            type="button"
            icon="MyLocation"
            isSuffix={true}
            size={"small"}
          />
  
          <Button
            variation="secondary"
            label={"Secondary"}
            type="button"
            size={"small"}
          />
          <Button
            variation="secondary"
            label={"Secondary"}
            type="button"
            icon="MyLocation"
            size={"small"}
          />
          <Button
            variation="secondary"
            label={"Secondary"}
            type="button"
            icon="MyLocation"
            isSuffix={true}
            size={"small"}
          />
          <Button
            variation="secondary"
            label={"Secondary"}
            type="button"
            isDisabled={true}
            size={"small"}
          />
          <Button
            variation="secondary"
            label={
              "SecondaryWithsixtyfourcharactersSecondaryWithsixtyfourcharacters"
            }
            type="button"
            size={"small"}
          />
          <Button
            variation="secondary"
            label={
              "SecondaryWithmorethansixtyfourcharactersSecondaryWithsixtyfourcharacters"
            }
            type="button"
            size={"small"}
          />
          <Button
            variation="secondary"
            label={
              "SecondaryWithmorethansixtyfourcharactersandwithiconSecondaryWithsixtyfourcharacters"
            }
            type="button"
            icon="MyLocation"
            size={"small"}
          />
          <Button
            variation="secondary"
            label={
              "SecondaryWithmorethansixtyfourcharactersandwithiconSecondaryWithsixtyfourcharacters"
            }
            type="button"
            icon="MyLocation"
            isSuffix={true}
            size={"small"}
          />
  
          <Button
            variation="teritiary"
            label={"Teritiary"}
            type="button"
            size={"small"}
          />
          <Button
            variation="teritiary"
            label={"Teritiary"}
            type="button"
            icon="MyLocation"
            size={"small"}
          />
          <Button
            variation="teritiary"
            label={"Teritiary"}
            type="button"
            icon="MyLocation"
            isSuffix={true}
            size={"small"}
          />
          <Button
            variation="teritiary"
            label={"Teritiary"}
            type="button"
            isDisabled={true}
            size={"small"}
          />
          <Button
            variation="teritiary"
            label={
              "TeritiaryWithsixtyfourcharactersTeritiaryWithsixtyfourcharacters"
            }
            type="button"
            size={"small"}
          />
          <Button
            variation="teritiary"
            label={
              "TeritiaryWithmorethansixtyfourcharactersTeritiaryWithsixtyfourcharacters"
            }
            type="button"
            size={"small"}
          />
          <Button
            variation="teritiary"
            label={
              "TeritiaryWithmorethansixtyfourcharactersandwithiconTeritiaryWithsixtyfourcharacters"
            }
            type="button"
            icon="MyLocation"
            size={"small"}
          />
          <Button
            variation="teritiary"
            label={
              "TeritiaryWithmorethansixtyfourcharactersandwithiconTeritiaryWithsixtyfourcharacters"
            }
            type="button"
            icon="MyLocation"
            isSuffix={true}
            size={"small"}
          />
  
          <Button variation="link" label={"Link"} type="button" size={"small"} />
          <Button
            variation="link"
            label={"Link"}
            type="button"
            icon="MyLocation"
            size={"small"}
          />
          <Button
            variation="link"
            label={"Link"}
            type="button"
            icon="MyLocation"
            isSuffix={true}
            size={"small"}
          />
          <Button
            variation="link"
            label={"Link"}
            type="button"
            isDisabled={true}
            size={"small"}
          />
          <Button
            variation="link"
            label={
              "Linkdoesnothaveanyrestrictionforthenumberofcharactersitcanhaveanynumberofcharacters"
            }
            type="button"
            size={"small"}
          />
          <Button
            variation="link"
            label={
              "Linkdoesnothaveanyrestrictionforthenumberofcharactersitcanhaveanynumberofcharacters"
            }
            type="button"
            icon="MyLocation"
            size={"small"}
          />
          <Button
            variation="link"
            label={"Linkdoesnothaveanyrestrictionforthenumberofcharacters"}
            type="button"
            icon="MyLocation"
            isSuffix={true}
            size={"small"}
          />
        </div>
        <div style={commonDivStyle}>
          <Timeline
            label={"Upcoming"}
            variant={"upcoming"}
            subElements={subElements}
            additionalElements={additionalElementsforTimeline}
            inline={false}
          />
          <Timeline
            label={"Inprogress"}
            variant={"inprogress"}
            subElements={subElements}
            additionalElements={additionalElementsforTimeline}
            inline={false}
          />
          <Timeline
            label={"Completed"}
            variant={"completed"}
            subElements={subElements}
            additionalElements={additionalElementsforTimeline}
            inline={false}
          />
        </div>
        <div
          style={{
            ...commonDivStyle,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variation="secondary"
            label={"Show Popup"}
            type="button"
            size={"large"}
            onClick={() => showPopupComponent()}
          />
        </div>
        <div
          style={{
            ...commonDivStyle,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variation="secondary"
            label={"Show Alert Popup"}
            type="button"
            size={"large"}
            onClick={() => showAlertPopupComponent()}
          />
        </div>
        {showpopup && (
          <PopUp
            type="default"
            onClose={() => setShowpopup(false)}
            onOverlayClick={() => setShowpopup(false)}
            heading="Heading"
            subheading="Subheading"
            description="description of the popup"
            showIcon={true}
            children={children}
            footerChildren={footerChildren}
          ></PopUp>
        )}
        {showalert && (
          <PopUp
            type="alert"
            onClose={() => setShowalert(false)}
            onOverlayClick={() => setShowalert(false)}
            children={children}
            footerChildren={footerChildren}
            alertHeading={"Alert!"}
            alertMessage="description of alert"
          ></PopUp>
        )}
      </React.Fragment>
    );
  };
  
  export default Create;
  