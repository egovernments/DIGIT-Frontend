import React from "react";
import TextBlock from "../TextBlock";
import Iframe from "../Iframe";

export default {
  title: "Atoms/Text Block",
  component: TextBlock,
  argTypes: {
    headerContentClassName: {
      table: { disable: true },
    },
    headerClassName: {
      table: { disable: true },
    },
    captionClassName: {
      table: { disable: true },
    },
    subHeaderClassName: {
      table: { disable: true },
    },
    bodyClassName: {
      table: { disable: true },
    },
    wrapperClassName: {
      table: { disable: true },
    },
    style: {
      table: { disable: true },
    },
    caption: {
      control: "boolean",name:"Caption"
    },
    header: {
      control: "boolean",name:"Heading"
    },
    subHeader: {
      control: "boolean",name:"Subheading"
    },
    body: {
      control: "boolean",name:"Body"
    },
  },
};

const Template = (args) => {
  const { caption, body, header, subHeader, ...rest } = args;
  return (
    <TextBlock
      {...rest}
      caption={caption ? "Caption" : ""}
      body={
        body
          ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          : ""
      }
      header={header ? "Heading" : ""}
      subHeader={subHeader ? "Subheading" : ""}
    />
  );
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="TextBlock Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  caption: { table: { disable: true } },
  header: { table: { disable: true }},
  subHeader: {table:{disable:true}},
  body: {table:{disable:true}},
};

const commonArgs = {
  headerContentClassName: "",
  caption: true,
  captionClassName: "",
  header: true,
  headerClassName: "",
  subHeader: true,
  subHeaderClassName: "",
  body: true,
  bodyClassName: "",
};

export const Basic = Template.bind({});
Basic.args = {
  ...commonArgs,
};

export const Custom = Template.bind({});
Custom.args = {
  ...commonArgs,
  style:{
    border:"1px solid black",
    padding:"24px",
    backgroundColor:"#fafafa",
    textColor:"red"
  }
};