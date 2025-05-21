import React from "react";
import { Button } from "../../atoms";
import {ButtonsGroup} from "../../atoms";

export default {
  title: "Atoms/ButtonsGroup",
  component: ButtonsGroup,
  argTypes: {
  },
};

const Template = (args) => <ButtonsGroup {...args} />;

const buttons = [
    <Button type={"button"} size={"large"} variation={"primary"} label="ButtonPrimary" onClick={() => console.log("Clicked Button 1")} />,
    <Button type={"button"} size={"large"} variation={"primary"} label="Buttons" onClick={() => console.log("Clicked Button 2")} />,
  ];

  const sortThisbuttons = [
    <Button type={"button"} size={"large"} variation={"teritiary"} label="ButtonPrimary" onClick={() => console.log("Clicked Button 1")} />,
    <Button type={"button"} size={"large"} variation={"primary"} label="ButtonPrimary" onClick={() => console.log("Clicked Button 1")} />,
    <Button type={"button"} size={"large"} variation={"secondary"} label="Buttons" onClick={() => console.log("Clicked Button 2")} />,
  ];

  const sortThisbuttonsMedium = [
    <Button type={"button"} size={"medium"} variation={"teritiary"} label="ButtonPrimary" onClick={() => console.log("Clicked Button 1")} />,
    <Button type={"button"} size={"medium"} variation={"primary"} label="ButtonPrimary" onClick={() => console.log("Clicked Button 1")} />,
    <Button type={"button"} size={"medium"} variation={"secondary"} label="Buttons" onClick={() => console.log("Clicked Button 2")} />,
  ];

  const sortThisbuttonsSmall = [
    <Button type={"button"} size={"small"} variation={"teritiary"} label="ButtonPrimary" onClick={() => console.log("Clicked Button 1")} />,
    <Button type={"button"} size={"small"} variation={"primary"} label="ButtonPrimary" onClick={() => console.log("Clicked Button 1")} />,
    <Button type={"button"} size={"small"} variation={"secondary"} label="Buttons" onClick={() => console.log("Clicked Button 2")} />,
  ];


export const Default = Template.bind({});
Default.args = {
  buttonsArray: buttons,
};

export const ButtonsGroupWithUnSortedButtons = Template.bind({});
ButtonsGroupWithUnSortedButtons.args = {
  buttonsArray: sortThisbuttons,
  sortButtons:false
};

export const ButtonsGroupWithSortedButtons = Template.bind({});
ButtonsGroupWithSortedButtons.args = {
  buttonsArray: sortThisbuttons,
  sortButtons:true
};

export const ButtonsGroupWithUnSortedButtonsMedium = Template.bind({});
ButtonsGroupWithUnSortedButtonsMedium.args = {
  buttonsArray: sortThisbuttonsMedium,
  sortButtons:false
};

export const ButtonsGroupWithSortedButtonsMedium = Template.bind({});
ButtonsGroupWithSortedButtonsMedium.args = {
  buttonsArray: sortThisbuttonsMedium,
  sortButtons:true
};

export const ButtonsGroupWithUnSortedButtonsSmall= Template.bind({});
ButtonsGroupWithUnSortedButtonsSmall.args = {
  buttonsArray: sortThisbuttonsSmall,
  sortButtons:false
};

export const ButtonsGroupWithSortedButtonsSmall = Template.bind({});
ButtonsGroupWithSortedButtonsSmall.args = {
  buttonsArray: sortThisbuttonsSmall,
  sortButtons:true
};