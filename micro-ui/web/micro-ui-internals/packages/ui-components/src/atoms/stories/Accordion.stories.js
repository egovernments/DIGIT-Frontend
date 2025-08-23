import React from "react";
import { Accordion } from "../Accordion";
import Iframe from "../Iframe";

export default {
  title: "Atoms/Accordion",
  component: Accordion,
  argTypes: {
    title: { control: "text",name:"Title" },
    children: { control: "text",name:"Content" },
    isOpenInitially: { control: "boolean" ,table: { disable: true } },
    customClassName: { control: "text" ,table: { disable: true } },
    customStyles: { control: "object" ,table: { disable: true } },
    onToggle: { action: "onToggle",table: { disable: true }  },
    icon: { control: "text" ,name:"Icon"},
    number: { control: "number",name:"Number" },
    hideCardBorder: { control: "boolean",name:"Hide Border" },
    hideDivider: { control: "boolean" ,name:"Hide Divider" },
    hideCardBg: { control: "boolean",name:"Hide Background"  },
    hideBorderRadius: { control: "boolean" ,name:"Hide Border Radius" },
    iconFill: { table: { disable: true } },
    isClosed: { table: { disable: true } },
    iconWidth: { table: { disable: true } },
    iconHeight: { table: { disable: true } },
  },
};

const Template = (args) => <Accordion {...args} />;

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="Accordion Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  title: { table: { disable: true } },
  icon: { table: { disable: true }},
  number: { table: { disable: true }},
  hideCardBorder: {table: { disable: true } },
  hideDivider: { table: { disable: true } },
  hideCardBg: { table: { disable: true }},
  hideBorderRadius: { table: { disable: true }},
  children: { table: { disable: true }},
  isOpenInitially: { table: { disable: true }},
};

export const Basic = Template.bind({});
Basic.args = {
  title: "Section Header",
  children: `Dummy text refers to the bits of content that are used to fill a website. This text helps web designers better envision how the website will look as a finished product. It is important to understand that dummy text has no meaning whatsoever. Its sole purpose is to fill out blank spaces with “word-like” content, without making any copyright infringements. 
  Dummy text refers to the bits of content that are used to fill a website. This text helps web designers better envision how the website will look as a finished product. It is important to understand that dummy text has no meaning whatsoever. Its sole purpose is to fill out blank spaces with “word-like” content, without making any copyright infringements.`,
  isOpenInitially: false,
  hideCardBorder: true,
  hideDivider: true,
  hideCardBg: true,
  hideBorderRadius: true,
  icon:"",
  number:""
};

export const Nested = Template.bind({});
Nested.args = {
  isOpenInitially: false,
  hideCardBorder: false,
  hideDivider: false,
  hideCardBg: false,
  hideBorderRadius: false,
  title: "Section Header",
  children: (
    <Accordion title="Nested Accordion" isChild={true}>
      This is a nested accordion demonstrating component composition. The
      isChild prop ensures proper styling and behavior.
    </Accordion>
  ),
  icon:"",
  number:""
};

export const Custom = Template.bind({});
Custom.args = {
  title: "Section Header",
  children: `Dummy text refers to the bits of content that are used to fill a website. This text helps web designers better envision how the website will look as a finished product. It is important to understand that dummy text has no meaning whatsoever. Its sole purpose is to fill out blank spaces with “word-like” content, without making any copyright infringements. 
  Dummy text refers to the bits of content that are used to fill a website. This text helps web designers better envision how the website will look as a finished product. It is important to understand that dummy text has no meaning whatsoever. Its sole purpose is to fill out blank spaces with “word-like” content, without making any copyright infringements.`,
  customClassName: "custom-accordion",
  customStyles: {
    borderColor: "#C84C0E",
    backgroundColor: "#FFFFFF",
  },
  hideCardBorder: false,
  hideDivider: false,
  hideCardBg: false,
  hideBorderRadius: false,
  icon:"",
  number:"",
  isOpenInitially: false,
};