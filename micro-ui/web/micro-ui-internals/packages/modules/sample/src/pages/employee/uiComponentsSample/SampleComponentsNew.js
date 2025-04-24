import {
    AlertCard,
    Stepper,
    Button,
    Timeline,
    InfoButton,
    Accordion,
    HeaderComponent,
    AccordionList,
    BackLink,
    BreadCrumb,
    CheckBox,
    Chip,
    Divider,
    Panels,
    OTPInput,
    SelectionTag,
    TooltipWrapper,
    Tag,
    Tab,
    Switch,
    TextBlock,
    CustomSVG,
    Toggle,
    Loader,
    MultiSelectDropdown,
    LabelFieldPair,
    PopUp,
  } from "@egovernments/digit-ui-components";
  import React, { Fragment, useState } from "react";
  import { useTranslation } from "react-i18next";
  
  const SampleComponentsNew = () => {
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedOptions, setSlectedOptions] = useState([]);
  
    const onStepClick = (step) => {
      console.log("step", step);
      setCurrentStep(step);
    };
  
    const commonDivStyle = {
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      backgroundColor: "#FFFFFF",
      padding: "24px",
      marginBottom: "24px",
      borderRadius: "4px",
    };
  
    const textStyles ={
      color:"#0B4B66",
      fontWeight:"700",
      fontSize:"32px"
    }
  
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
  
    return (
      <React.Fragment>
        {/* <HeaderComponent styles={textStyles}>{"New Components"}</HeaderComponent> */}
        <div style={{ ...commonDivStyle, marginTop: "24px" }}>
          {/* <HeaderComponent styles={textStyles}>{"Accordion"}</HeaderComponent> */}
          <Accordion
            icon="Accessibility"
            number={1}
            onToggle={(e) => {
              console.log(e, "Accordion toggled");
            }}
            title="Section Header"
          >
            <Accordion isChild={true} title="Nested Accordion">
              This is a nested accordion demonstrating component composition. The
              isChild prop ensures proper styling and behavior.
            </Accordion>
          </Accordion>
        </div>
        <div style={commonDivStyle}>
          {/* <HeaderComponent styles={textStyles}>
            {"Accordion List"}
          </HeaderComponent> */}
          <AccordionList addDivider>
            <Accordion number={1} title="Accordion 1">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry
            </Accordion>
            <Accordion number={2} title="Accordion 2">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry
            </Accordion>
            <Accordion number={3} title="Accordion 3">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry
            </Accordion>
            <Accordion number={4} title="Accordion 4">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry
            </Accordion>
          </AccordionList>
        </div>
        <div style={commonDivStyle}>
          <HeaderComponent styles={textStyles}>{"Action Button"}</HeaderComponent>
          <Button
              wrapperClassName='sample-action-button'
              wrapperStyles={{width:"fit-content"}}
              iconFill=""
              isSearchable
              label="ActionButton"
              onClick={(e) => {
                console.log(e);
              }}
              onOptionSelect={(e) => {
                console.log(e);
              }}
              options={[
                {
                  code: "Actiona",
                  name: "Action A",
                },
                {
                  code: "Actionb",
                  name: "Action B",
                },
                {
                  code: "Actionc",
                  name: "Action C",
                },
              ]}
              optionsKey="name"
              showBottom
              style={{}}
              title=""
              type="actionButton"
            />
        </div>
        <div style={commonDivStyle}>
          <HeaderComponent styles={textStyles}>{"Alert Card"}</HeaderComponent>
          <AlertCard
            populators={{
              name: "infocard",
            }}
            variant="default"
            text={
              "Application process will take a minute to complete. It might cost around Rs.500/- to Rs.1000/- to clean your septic tank and you can expect theservice to get completed in 24 hrs from the time of payment."
            }
            label={"Info"}
          />
          <AlertCard
            populators={{
              name: "infocardsuccess",
            }}
            variant="success"
            text={
              "Application process will take a minute to complete. It might cost around Rs.500/- to Rs.1000/- to clean your septic tank and you can expect theservice to get completed in 24 hrs from the time of payment."
            }
            label={"Success"}
          />
          <AlertCard
            populators={{
              name: "infocardwarning",
            }}
            variant="warning"
            text={
              "Application process will take a minute to complete. It might cost around Rs.500/- to Rs.1000/- to clean your septic tank and you can expect theservice to get completed in 24 hrs from the time of payment."
            }
            label={"Warning"}
          />
          <AlertCard
            populators={{
              name: "infocarderror",
            }}
            variant="error"
            text={
              "Application process will take a minute to complete. It might cost around Rs.500/- to Rs.1000/- to clean your septic tank and you can expect theservice to get completed in 24 hrs from the time of payment."
            }
            label={"Error"}
          />
  
          <AlertCard
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
  
          <AlertCard
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
        <div style={commonDivStyle}>
          <HeaderComponent styles={textStyles}>{"BackLink"}</HeaderComponent>
          <BackLink
            iconFill=""
            label="Back"
            onClick={(e) => {
              console.log(e);
            }}
            style={{}}
            variant="primary"
          />
          <BackLink
            iconFill=""
            label="Back"
            onClick={(e) => {
              console.log(e);
            }}
            style={{}}
            variant="secondary"
          />
          <BackLink
            iconFill=""
            label="Back"
            onClick={(e) => {
              console.log(e);
            }}
            style={{}}
            variant="teritiary"
          />
        </div>
        <div style={commonDivStyle}>
          <HeaderComponent styles={textStyles}>{"BreadCrumb"}</HeaderComponent>
          <BreadCrumb
            crumbs={[
              {
                content: "Home",
                internalLink: "/home",
                show: true,
              },
              {
                content: "Previous1",
                internalLink: "/previous1",
                show: true,
              },
              {
                content: "Previous2",
                internalLink: "/previous2",
                show: true,
              },
              {
                content: "Previous3",
                internalLink: "/previous3",
                show: true,
              },
              {
                content: "Current",
                internalLink: "/current",
                show: true,
              },
            ]}
            maxItems={3}
          />
        </div>
        <div style={commonDivStyle}>
          <HeaderComponent styles={textStyles}>
            {"Large Sized Buttons"}
          </HeaderComponent>
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
          <HeaderComponent styles={textStyles}>
            {"Medium Sized Buttons"}
          </HeaderComponent>
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
          <HeaderComponent styles={textStyles}>
            {"Small Sized Buttons"}
          </HeaderComponent>
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
          <HeaderComponent styles={textStyles}>{"Checkbox"}</HeaderComponent>
          <CheckBox
            label="Label"
            onChange={(e) => {
              console.log(e);
            }}
            style={{}}
            styles={{}}
          />
          <CheckBox
            isIntermediate
            label="Label"
            onChange={(e) => {
              console.log(e);
            }}
            style={{}}
            styles={{}}
          />
          <CheckBox
            checked
            label="Label"
            onChange={(e) => {
              console.log(e);
            }}
            style={{}}
            styles={{}}
          />
        </div>
        <div style={commonDivStyle}>
          <HeaderComponent styles={textStyles}>{"Chip"}</HeaderComponent>
          <div className="digit-tag-container">
            <Chip
              className=""
              error=""
              extraStyles={{}}
              hideClose={false}
              iconReq="Edit"
              onClick={(e) => {
                console.log(e);
              }}
              onTagClick={(e) => {
                console.log(e);
              }}
              text="Chip"
            />
          </div>
          <div className="digit-tag-container">
            <Chip
              className=""
              error="ErrorMessage"
              extraStyles={{}}
              hideClose={false}
              iconReq="Edit"
              isErrorTag
              onClick={(e) => {
                console.log(e);
              }}
              onTagClick={(e) => {
                console.log(e);
              }}
              text="ErrorChipWithError"
            />
          </div>
        </div>
        <div style={commonDivStyle}>
          <HeaderComponent styles={textStyles}>{"Divider"}</HeaderComponent>
          <Divider className="" style={{}} variant="small" />
          <Divider className="" style={{}} variant="medium" />
          <Divider className="" style={{}} variant="large" />
        </div>
        <div style={commonDivStyle}>
          <HeaderComponent styles={textStyles}>{"Panels"}</HeaderComponent>
          <Panels
            animationProps={{
              height: 100,
              noAutoplay: false,
              width: 100,
            }}
            className=""
            customIcon=""
            iconFill=""
            info="Description"
            message="Success Message!"
            multipleResponses={[]}
            response="949749795479"
            style={{}}
          />
          <Panels
            animationProps={{
              loop: false,
              noAutoplay: false,
            }}
            className=""
            customIcon=""
            iconFill=""
            info="Description "
            message="Success Message!"
            multipleResponses={["949749795469", "949749795579", "949749795499"]}
            response="949749795479"
            style={{}}
            type="error"
          />
        </div>
        <div style={commonDivStyle}>
          <HeaderComponent styles={textStyles}>{"Loader"}</HeaderComponent>
          <Loader
            animationStyles={{}}
            className=""
            loaderText="loading"
            style={{}}
            variant="Basic"
          ></Loader>
        </div>
        <div style={commonDivStyle}>
        <HeaderComponent styles={textStyles}>
          {"Multiselect Dropdown"}
        </HeaderComponent>
        <LabelFieldPair
          removeMargin={true}
          className={`digit-formcomposer-fieldpair`}
        >
          {
            <HeaderComponent className={`label`}>
              <div className={`label-container`}>
                <label className={`label-styles`}>
                  {"MultiSelect Dropdown"}
                </label>
              </div>
            </HeaderComponent>
          }
          <div className="digit-field">
            <MultiSelectDropdown
              onClose={(values) => {
                setSlectedOptions(values);
              }}
              defaultLabel="" // Default label for selected
              defaultUnit="" // Default unit for selected
              props={{
                className:'', // custom class name for digit-multiselectdropdown-wrap
                style:{} // custom styles for digit-multiselectdropdown-wrap
              }} 
              isPropsNeeded={false}
              ServerStyle={{}} // custom styles for digit-multiselectdropdown-server
              config={{
                clearLabel: "", // label for clear all chip , default label is "Clear All"
                isDropdownWithChip: true, // falg to show chips
                showIcon: true, // flag to add icons for each options
                numberOfChips: 4, // count of the chips to be showna , if more selected adds + chip
              }}
              disabled={false} // disable multiselect dropdown
              selectAllLabel="" // label for select all
              categorySelectAllLabel="" // label for category level select all
              restrictSelection={false} // restricts to select any option
              isSearchable={true} // flag to make multiselect dropdown selectable
              chipsKey="" // what to be shown as label for chips
              frozenData={[
                {
                  code: "Category A.Option A",
                  name: "Option A",
                  icon: "Article",
                },
              ]} 
              // can add frozen data 
              handleViewMore={(e) => {
                setShowPopup(true);
              }} // when clicked on + chip this is called
              showTooltip={true} // flag to show the tooltip for labels and options on hover
              variant={"nestedmultiselect"} // varinat ("treemultiselect","nestedmultiselect","nestedtextmultiselect")
              onSelect={() => {}} // mandatory prop
              selected={[]} // selected array
              addSelectAllCheck={true} // flag to add select all check
              addCategorySelectAllCheck={true} // flag to add category select all check
              options={[
                {
                  name: "Category A",
                  options: [
                    {
                      code: "Category A.Option A",
                      name: "Option A",
                      icon: "Article",
                    },
                    {
                      code: "Category A.Option B",
                      name: "Option B",
                      icon: "Article",
                    },
                    {
                      code: "Category A.Option C",
                      name: "Option C",
                      icon: "Article",
                    },
                  ],
                  code: "Category A",
                },
                {
                  name: "Category B",
                  options: [
                    {
                      code: "Category B.Option 1",
                      name: "Option 1",
                      icon: "Article",
                    },
                    {
                      code: "Category B.Option 2",
                      name: "Option 2",
                      icon: "Article",
                    },
                    {
                      code: "Category B.Option 3",
                      name: "Option 3",
                      icon: "Article",
                    },
                  ],
                  code: "Category B",
                },
              ]} // options to be shown
              optionsKey={"code"} // key for the options
            ></MultiSelectDropdown>
          </div>
        </LabelFieldPair>
        {showPopup && (
          <PopUp
            className={""}
            type={"default"} // type of popup
            heading={"Popup header"} // popup heading
            children={[
              <div
                className="digit-tag-container"
                style={{ maxWidth: "100%", margin: "0rem" }}
              >
                {selectedOptions?.length > 0 &&
                  selectedOptions?.map((value, index) => {
                    console.log(value, "value");
                    return (
                      <Chip
                        key={index}
                        text={value[1].code}
                        onClick={() => {}}
                        className="multiselectdropdown-tag"
                      />
                    );
                  })}
              </div>,
            ]} // elements inside popup
            onOverlayClick={() => {
              setShowPopup(false);
            }} // on click of overlay
            onClose={() => {
              setShowPopup(false);
            }} // on click of close
            footerChildren={[
              <Button
                type={"button"}
                size={"large"}
                variation={"primary"}
                label={"Close"}
                onClick={() => {
                  setShowPopup(false);
                }}
              />,
            ]}
            sortFooterChildren={true}
          ></PopUp>
        )}
      </div>
        <div style={commonDivStyle}>
          <HeaderComponent styles={textStyles}>{"OTPInput"}</HeaderComponent>
          <OTPInput
            label="Enter OTP"
            length={6}
            onChange={() => {}}
            style={{}}
            type="alphanumeric"
          />
        </div>
        <div style={commonDivStyle}>
          <HeaderComponent styles={textStyles}>{"SelectionTag"}</HeaderComponent>
          <SelectionTag
            allowMultipleSelection
            errorMessage=""
            onSelectionChanged={function noRefCheck() {}}
            options={[
              {
                code: "option1",
                name: "Option 1",
                prefixIcon: "",
                suffixIcon: "",
              },
              {
                code: "option2",
                name: "Option 2",
                prefixIcon: "",
                suffixIcon: "",
              },
              {
                code: "option3",
                name: "Option 3",
                prefixIcon: "",
                suffixIcon: "",
              },
            ]}
            selected={[]}
            withContainer
          />
        </div>
        <div style={commonDivStyle}>
          <HeaderComponent styles={textStyles}>{"Stepper"}</HeaderComponent>
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
          <HeaderComponent styles={textStyles}>{"Switch"}</HeaderComponent>
          <Switch
            label="Switch"
            onToggle={(e) => {
              console.log(e);
            }}
            shapeOnOff={true}
          />
        </div>
        <div style={commonDivStyle}>
          <HeaderComponent styles={textStyles}>{"Tab"}</HeaderComponent>
          <Tab
            Tab1Label=""
            Tab2Label=""
            Tab3Label=""
            Tab4Label=""
            activeLink="Tab 2"
            configItemKey="code"
            configNavItems={[
              {
                code: "Tab 1",
                name: "Tab 1",
              },
              {
                code: "Tab 2",
                name: "Tab 2",
              },
              {
                code: "Tab 3",
                name: "Tab 3",
              },
              {
                code: "Tab 4",
                name: "Tab 4",
              },
            ]}
            itemStyle={{}}
            navStyles={{}}
            onTabClick={(e) => {
              console.log(e);
            }}
            setActiveLink={(e) => {
              console.log(e);
            }}
            showNav
            style={{}}
          />
        </div>
        <div style={commonDivStyle}>
          <HeaderComponent styles={textStyles}>{"Tag"}</HeaderComponent>
          <Tag icon="" label="Tag" labelStyle={{}} showIcon={false} style={{}} />
          <Tag
            icon=""
            label="Tag"
            labelStyle={{}}
            showIcon={false}
            style={{}}
            type="success"
          />
          <Tag
            icon=""
            label="Tag"
            labelStyle={{}}
            showIcon={false}
            style={{}}
            type="error"
          />
          <Tag
            icon=""
            label="Tag"
            labelStyle={{}}
            showIcon={false}
            style={{}}
            type="warning"
          />
        </div>
        <div style={commonDivStyle}>
          <HeaderComponent styles={textStyles}>{"TextBlock"}</HeaderComponent>
          <TextBlock
            body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            caption="Caption"
            header="Heading"
            subHeader="Subheading"
          />
        </div>
        <div style={commonDivStyle}>
          <HeaderComponent styles={textStyles}>{"Timeline"}</HeaderComponent>
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
        <div style={commonDivStyle}>
          <HeaderComponent styles={textStyles}>{"Toggle"}</HeaderComponent>
          <Toggle
            Toggle1Label=""
            Toggle2Label=""
            Toggle3Label=""
            additionalWrapperClass=""
            errorStyle={null}
            innerStyles={{}}
            inputRef={null}
            label=""
            name="toggleOptions"
            numberOfToggleItems={3}
            onChange={(e) => {
              console.log(e);
            }}
            onSelect={(e) => {
              console.log(e);
            }}
            options={[
              {
                code: "Toggle1",
                name: "Toggle 1",
              },
              {
                code: "Toggle2",
                name: "Toggle 2",
              },
              {
                code: "Toggle3",
                name: "Toggle 3",
              },
            ]}
            optionsKey="name"
            selectedOption=""
            style={{}}
            type="toggle"
            value=""
          />
        </div>
        <div style={commonDivStyle}>
          <HeaderComponent styles={textStyles}>{"Tooltip"}</HeaderComponent>
          <div
            style={{
              alignItems: "center",
              color: "#363636",
              display: "flex",
              justifyContent: "center",
              top: "50%",
            }}
          >
            <TooltipWrapper
              arrow={false}
              content={
                <>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt <hr />
                  <CustomSVG.PlaceholderSvg height="200px" width="200px" />
                </>
              }
              enterDelay={100}
              header="Tooltip Header"
              leaveDelay={0}
              placement="top"
              style={{}}
            >
              <Button label="Dark theme..." />
            </TooltipWrapper>
          </div>
          <div
            style={{
              alignItems: "center",
              color: "#363636",
              display: "flex",
              justifyContent: "center",
              top: "50%",
            }}
          >
            <TooltipWrapper
              arrow={false}
              content={
                <>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt <hr />
                  <CustomSVG.PlaceholderSvg height="200px" width="200px" />
                </>
              }
              enterDelay={100}
              header="Tooltip Header"
              leaveDelay={0}
              placement="top"
              style={{}}
              theme={"light"}
            >
              <Button label="Light theme..." />
            </TooltipWrapper>
          </div>
        </div>
      </React.Fragment>
    );
  };
  
  export default SampleComponentsNew;
  