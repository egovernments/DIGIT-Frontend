import React from "react";
import { Button } from "../../atoms";
import { ActionBar } from "../../atoms";

export default {
  title: "Atoms/Footer",
  component: ActionBar,
  argTypes: {
    className: {
      control: "text",
    },
    style: {
      control: { type: "object" },
    },
    actionFields: {
      control: { type: "object" },
    },
    setactionFieldsToRight: {
      control: { type: "boolean" },
    },
    setactionFieldsToLeft: {
      control: { type: "boolean" },
    },
    maxActionFieldsAllowed: {
      control: { type: "number" },
    },
    sortActionFields: {
      control: { type: "boolean" },
    },
    setChildrenLeft: {
      control: { type: "boolean" },
    },
  },
};

const Template = (args) => <ActionBar {...args} />;

const commonArgs = {
  className: "",
  style: {},
  actionFields: [],
  setactionFieldsToRight: false,
  setactionFieldsToLeft: false,
  maxActionFieldsAllowed: 5,
  sortActionFields: true,
  setChildrenLeft: false,
};

const footeractionFields = [
  <Button
    type={"button"}
    size={"large"}
    variation={"secondary"}
    label="Back"
    icon={"ArrowBack"}
    onClick={() => console.log("Moving to previous page")}
  />,
  <Button
    type={"button"}
    size={"large"}
    variation={"primary"}
    label="Next"
    isSuffix={true}
    icon={"ArrowForward"}
    onClick={() => console.log("Moving To next page")}
  />,
];

const footeractionFieldsWithSearchableDropdown = [
  <Button
    type={"button"}
    size={"large"}
    variation={"secondary"}
    label="Back"
    icon={"ArrowBack"}
    onClick={() => console.log("Moving to previous page")}
  />,
  <Button
    type={"actionButton"}
    options={[
      { name: "Action A", code: "Actiona" },
      { name: "Action B", code: "Actionb" },
      { name: "Action C", code: "Actionc" },
    ]}
    label={"Actions"}
    variation={"primary"}
    optionsKey={"name"}
    isSearchable={true}
    onOptionSelect={(option)=>{console.log(option)}}
  ></Button>,
];

const footeractionFieldsWithUnSearchableDropdown = [
  <Button
    type={"button"}
    size={"large"}
    variation={"secondary"}
    label="Back"
    icon={"ArrowBack"}
    onClick={() => console.log("Moving to previous page")}
  />,
  <Button
    type={"actionButton"}
    options={[
      { name: "Action A", code: "Actiona" },
      { name: "Action B", code: "Actionb" },
      { name: "Action C", code: "Actionc" },
    ]}
    label={"Actions"}
    variation={"primary"}
    optionsKey={"name"}
    isSearchable={false}
    onOptionSelect={(option)=>{console.log(option)}}
  ></Button>,
];

export const Default = Template.bind({});
Default.args = {
  ...commonArgs,
  actionFields: footeractionFields,
};

export const actionFieldsSetToRight = Template.bind({});
actionFieldsSetToRight.args = {
  ...commonArgs,
  actionFields: footeractionFields,
  setactionFieldsToRight: true,
};

export const actionFieldsSetToLeft = Template.bind({});
actionFieldsSetToLeft.args = {
  ...commonArgs,
  actionFields: footeractionFields,
  setactionFieldsToLeft: true,
};

export const WithSearchableDropdown = Template.bind({});
WithSearchableDropdown.args = {
  ...commonArgs,
  actionFields: footeractionFieldsWithSearchableDropdown,
};

export const WithUnsearchableDropdown = Template.bind({});
WithUnsearchableDropdown.args = {
  ...commonArgs,
  actionFields: footeractionFieldsWithUnSearchableDropdown,
};
