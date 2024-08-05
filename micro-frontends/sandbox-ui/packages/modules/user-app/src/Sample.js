import React, { useState }  from "react"
import {
    InfoCard,
    Stepper,
    Button,
    Timeline,
    InfoButton
  } from "@egovernments/digit-ui-components";
import SampleTwo from "./SampleTwo";
const commonDivStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    backgroundColor: "#FFFFFF",
    padding: "16px",
    marginBottom: "64px",
    borderRadius: "4px",
  };


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

const Sample=()=>{
    const [currentStep, setCurrentStep] = useState(0);

    const onStepClick = (step) => {
      console.log("step", step);
      setCurrentStep(step);
    };
return (<div>
<div style={commonDivStyle}>
<Button variation="primary" label={"Primary"} type="button"   size={"large"}/>
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

<Button variation="secondary" label={"Secondary"} type="button"   size={"large"}/>
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

<Button variation="teritiary" label={"Teritiary"} type="button"   size={"large"} />
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

<Button variation="link" label={"Link"} type="button"   size={"large"}/>
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
  label={
    "Linkdoesnothaveanyrestrictionforthenumberofcharacters"
  }
  type="button"
  icon="MyLocation"
  isSuffix={true}
  size={"large"}
/>
</div>
<div style={commonDivStyle}>
<Button variation="primary" label={"Primary"} type="button"   size={"medium"} />
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

<Button variation="secondary" label={"Secondary"} type="button" size={"medium"}/>
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

<Button variation="teritiary" label={"Teritiary"} type="button" size={"medium"}/>
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

<Button variation="link" label={"Link"} type="button" size={"medium"}/>
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
  label={
    "Linkdoesnothaveanyrestrictionforthenumberofcharacters"
  }
  type="button"
  icon="MyLocation"
  isSuffix={true}
  size={"medium"}
/>
</div>
<div style={commonDivStyle}>
<Button variation="primary" label={"Primary"} type="button" size={"small"}/>
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

<Button variation="secondary" label={"Secondary"} type="button" size={"small"}/>
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

<Button variation="teritiary" label={"Teritiary"} type="button" size={"small"}/>
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

<Button variation="link" label={"Link"} type="button" size={"small"}/>
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
  label={
    "Linkdoesnothaveanyrestrictionforthenumberofcharacters"
  }
  type="button"
  icon="MyLocation"
  isSuffix={true}
  size={"small"}
/>
</div>
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
<InfoButton label={"Button"} size="large" isDisabled={false}></InfoButton>,

</div>
<SampleTwo />
</div>)
}


export default Sample;