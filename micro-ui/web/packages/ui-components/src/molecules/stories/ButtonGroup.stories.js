import React from "react";
import { Button } from "../../atoms";
import { ButtonGroup } from "../../atoms";
import { Iframe } from "../../atoms";

export default {
  title: "Molecules/Button Group",
  component: ButtonGroup,
  argTypes: {
    size: {
      control: "select",
      options: ["large", "medium", "small"],
    },
    buttonsArray: { table: { disable: true } },
    sortButtons: {
      control: "boolean",
      name: "Auto Sort",
    },
    equalButtons: {
      control: "boolean",
      name: "Equal Buttons",
    },
  },
};

const commonArgs = {
  sortButtons:false,
  size:"large",
  equalButtons:true
}

const largebuttons = [
  <Button
    type={"button"}
    size={"large"}
    variation={"teritiary"}
    label="ButtonTeritiary"
    onClick={() => console.log("Clicked Button 1")}
  />,
  <Button
    type={"button"}
    size={"large"}
    variation={"primary"}
    label="ButtonPrimary"
    onClick={() => console.log("Clicked Button 1")}
  />,
  <Button
    type={"button"}
    size={"large"}
    variation={"secondary"}
    label="Button"
    onClick={() => console.log("Clicked Button 2")}
  />,
];

const mediumbuttons = [
  <Button
    type={"button"}
    size={"medium"}
    variation={"teritiary"}
    label="ButtonTeritiary"
    onClick={() => console.log("Clicked Button 1")}
  />,
  <Button
    type={"button"}
    size={"medium"}
    variation={"primary"}
    label="ButtonPrimary"
    onClick={() => console.log("Clicked Button 1")}
  />,
  <Button
    type={"button"}
    size={"medium"}
    variation={"secondary"}
    label="Buttons"
    onClick={() => console.log("Clicked Button 2")}
  />,
];
const smallbuttons = [
  <Button
    type={"button"}
    size={"small"}
    variation={"teritiary"}
    label="ButtonTeritiary"
    onClick={() => console.log("Clicked Button 1")}
  />,
  <Button
    type={"button"}
    size={"small"}
    variation={"primary"}
    label="ButtonPrimary"
    onClick={() => console.log("Clicked Button 1")}
  />,
  <Button
    type={"button"}
    size={"small"}
    variation={"secondary"}
    label="Buttons"
    onClick={() => console.log("Clicked Button 2")}
  />,
];

const Template = (args) => {
  const { size, ...rest } = args;
  return (
    <ButtonGroup
      buttonsArray={
        args.size === "medium"
          ? mediumbuttons
          : args?.size === "small"
          ? smallbuttons
          : largebuttons
      }
      {...rest}
    />
  );
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="ButtonGroup Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  size: { table: { disable: true } },
  sortButtons: { table: { disable: true }},
  equalButtons: { table: { disable: true }},
};

export const Basic = Template.bind({});
Basic.args = {
  ...commonArgs
};
