import React from "react";
import { MapLayerIcon } from "./MapLayerIcon";

export default {
  tags: ['autodocs'],
  argTypes: {
    className: {
        options: ['custom-class'],
        control: { type: 'check' },
    }
  },
  title: "MapLayerIcon",
  component: MapLayerIcon,
};

export const Default = () => <MapLayerIcon />;
export const Fill = () => <MapLayerIcon fill="blue" />;
export const Size = () => <MapLayerIcon height="50" width="50" />;
export const CustomStyle = () => <MapLayerIcon style={{ border: "1px solid red" }} />;
export const CustomClassName = () => <MapLayerIcon className="custom-class" />;

export const Clickable = () => <MapLayerIcon onClick={()=>console.log("clicked")} />;

const Template = (args) => <MapLayerIcon {...args} />;

export const Playground = Template.bind({});
Playground.args = {
  className: "custom-class",
  style: { border: "3px solid green" }
};
