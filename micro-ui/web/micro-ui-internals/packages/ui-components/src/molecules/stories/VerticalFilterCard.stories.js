import React, { useState ,Fragment} from "react";
import FilterCard from "../FilterCard";
import { LabelFieldPair } from "../../atoms";
import { RadioButtons } from "../../atoms";
import { TextBlock } from "../../atoms";
import { TextInput } from "../../atoms";
import { Button } from "../../atoms";

// Story metadata
export default {
  title: "Molecules/Filter Card/Vertical",
  component: FilterCard,
  argTypes: {
    title: { control: "boolean" ,name:"Heading"},
    titleIcon: { table:{disable:true} },
    primaryActionLabel: { control: "text" },
    secondaryActionLabel: { control: "text" },
    layoutType: {
      control: {
        type: "select",
        options: ["horizontal", "vertical"],
      },
    },
    equalWidthButtons: { control: "boolean" ,table:{disable:true}},
    addClose: { control: "boolean",name:"With Close" },
    className: { control: "text",table:{disable:true} },
    style: { control: "object" ,table:{disable:true}},
    hideIcon: { control: "boolean" ,name:"Header Icon"},
    isPopup: { control: "boolean" ,table:{disable:true}},
    onClose: { action: "onChange" ,table:{disable:true}},
    onOverlayClick: {
      control: "function",table:{disable:true}
    },
    children:{table:{disable:true}},
    primaryActionLabel:{table:{disable:true}},
    secondaryActionLabel:{table:{disable:true}},
    onPrimaryPressed:{table:{disable:true}},
    onSecondaryPressed:{table:{disable:true}},
    layoutType:{table:{disable:true}}
  },
};

// Template for the story
const Template = (args) => {
  const {title,...rest} = args;
  return (<FilterCard {...rest} title={title ? "Filter" : ""} />);};

const genderOptions = [
  { code: "M", name: "Male" },
  { code: "F", name: "Female" },
  { code: "O", name: "Others" },
];

const children = [
  <LabelFieldPair vertical={true}>
    <TextBlock body={"Name"}></TextBlock>
    <TextInput type="text"></TextInput>
  </LabelFieldPair>,
  <LabelFieldPair vertical={true}>
    <TextBlock body={"Value"}></TextBlock>
    <TextInput type="text"></TextInput>
  </LabelFieldPair>,
  <LabelFieldPair vertical={true}>
    <TextBlock body={"Gender"}></TextBlock>
    <RadioButtons
      alignVertical={true}
      options={genderOptions}
      optionsKey="name"
      name="gender"
      onSelect={(e) => {
        console.log(e);
      }}
      style={{
        width: "100%",
      }}
    />
  </LabelFieldPair>,
];

export const Basic = Template.bind({});
Basic.args = {
  title: true,
  addClose: false,
  children: children,
  primaryActionLabel: "ApplyFilters",
  secondaryActionLabel: "Clear Filters",
  onPrimaryPressed: () => alert("Primary action clicked!"),
  onSecondaryPressed: () => alert("Secondary action clicked!"),
  layoutType: "vertical",
  equalWidthButtons: true,
  hideIcon: false,
};

export const Custom = Template.bind({});
Custom.args = {
  title: true,
  addClose: true,
  children: children,
  primaryActionLabel: "ApplyFilters",
  secondaryActionLabel: "Clear Filters",
  onPrimaryPressed: () => alert("Primary action clicked!"),
  onSecondaryPressed: () => alert("Secondary action clicked!"),
  layoutType: "vertical",
  equalWidthButtons: true,
  hideIcon: false,
  style: {
    width: "500px",
    backgroundColor:"#fafafa",
    border:"1px solid black"
  },
};

export const AsPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  const onClose = () => {
    setShowPopup(false);
  };

  const onOverlayClick = () => {
    setShowPopup(false);
  };

  const commonStyles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    color: "#363636",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: "translate(-50%, -50%)",
  };

  return (
    <>
      <div style={commonStyles}>
        {
          <Button
            label={"Show FilterCard"}
            variation={"secondary"}
            onClick={() => setShowPopup(true)}
          />
        }
      </div>
      {showPopup && (
        <FilterCard
          title={"Filter"}
          addClose={true}
          primaryActionLabel={"ApplyFilters"}
          secondaryActionLabel={"Clear Filters"}
          onPrimaryPressed={() => alert("Primary action clicked!")}
          onSecondaryPressed={() => alert("Secondary action clicked!")}
          layoutType={"vertical"}
          equalWidthButtons={true}
          hideIcon={false}
          isPopup={true}
          onClose={onClose}
          onOverlayClick={onOverlayClick}
        >
          <LabelFieldPair vertical={true}>
            <TextBlock body={"Name"}></TextBlock>
            <TextInput type="text"></TextInput>
          </LabelFieldPair>
          <LabelFieldPair vertical={true}>
            <TextBlock body={"Value"}></TextBlock>
            <TextInput type="text"></TextInput>
          </LabelFieldPair>
          <LabelFieldPair vertical={true}>
            <TextBlock body={"Gender"}></TextBlock>
            <RadioButtons
              options={genderOptions}
              optionsKey="name"
              name="gender"
              onSelect={(e) => {
                console.log(e);
              }}
              style={{
                width: "100%",
              }}
            />
          </LabelFieldPair>
        </FilterCard>
      )}
    </>
  );
};
AsPopup.argTypes=  {
  title: { table:{disable:true}},
  hideIcon: { table:{disable:true} },
  addClose: {  table:{disable:true} },
}


export const AsPopupWithMoreChildren = () => {
  const [showPopup, setShowPopup] = useState(false);

  const onClose = () => {
    setShowPopup(false);
  };

  const onOverlayClick = () => {
    setShowPopup(false);
  };

  const commonStyles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    color: "#363636",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: "translate(-50%, -50%)",
  };

  return (
    <>
      <div style={commonStyles}>
        {
          <Button
            label={"Show FilterCard"}
            variation={"secondary"}
            onClick={() => setShowPopup(true)}
          />
        }
      </div>
      {showPopup && (
        <FilterCard
          title={"Filter"}
          addClose={true}
          primaryActionLabel={"ApplyFilters"}
          secondaryActionLabel={"Clear Filters"}
          onPrimaryPressed={() => alert("Primary action clicked!")}
          onSecondaryPressed={() => alert("Secondary action clicked!")}
          layoutType={"vertical"}
          equalWidthButtons={true}
          hideIcon={false}
          isPopup={true}
          onClose={onClose}
          onOverlayClick={onOverlayClick}
        >
          <LabelFieldPair vertical={true}>
            <TextBlock body={"Name"}></TextBlock>
            <TextInput type="text"></TextInput>
          </LabelFieldPair>
          <LabelFieldPair vertical={true}>
            <TextBlock body={"Value"}></TextBlock>
            <TextInput type="text"></TextInput>
          </LabelFieldPair>
          <LabelFieldPair vertical={true}>
            <TextBlock body={"Name"}></TextBlock>
            <TextInput type="text"></TextInput>
          </LabelFieldPair>
          <LabelFieldPair vertical={true}>
            <TextBlock body={"Value"}></TextBlock>
            <TextInput type="text"></TextInput>
          </LabelFieldPair>
          <LabelFieldPair vertical={true}>
            <TextBlock body={"Name"}></TextBlock>
            <TextInput type="text"></TextInput>
          </LabelFieldPair>
          <LabelFieldPair vertical={true}>
            <TextBlock body={"Value"}></TextBlock>
            <TextInput type="text"></TextInput>
          </LabelFieldPair>
          <LabelFieldPair vertical={true}>
            <TextBlock body={"Name"}></TextBlock>
            <TextInput type="text"></TextInput>
          </LabelFieldPair>
          <LabelFieldPair vertical={true}>
            <TextBlock body={"Value"}></TextBlock>
            <TextInput type="text"></TextInput>
          </LabelFieldPair>
          <LabelFieldPair vertical={true}>
            <TextBlock body={"Name"}></TextBlock>
            <TextInput type="text"></TextInput>
          </LabelFieldPair>
          <LabelFieldPair vertical={true}>
            <TextBlock body={"Value"}></TextBlock>
            <TextInput type="text"></TextInput>
          </LabelFieldPair>
          <LabelFieldPair vertical={true}>
            <TextBlock body={"Name"}></TextBlock>
            <TextInput type="text"></TextInput>
          </LabelFieldPair>
          <LabelFieldPair vertical={true}>
            <TextBlock body={"Value"}></TextBlock>
            <TextInput type="text"></TextInput>
          </LabelFieldPair>
          <LabelFieldPair vertical={true}>
            <TextBlock body={"Name"}></TextBlock>
            <TextInput type="text"></TextInput>
          </LabelFieldPair>
          <LabelFieldPair vertical={true}>
            <TextBlock body={"Value"}></TextBlock>
            <TextInput type="text"></TextInput>
          </LabelFieldPair>
        </FilterCard>
      )}
    </>
  );
};
AsPopupWithMoreChildren.argTypes=  {
  title: { table:{disable:true}},
  hideIcon: { table:{disable:true} },
  addClose: {  table:{disable:true} },
}