import React from "react";
import SummaryCard from "../SummaryCard";
import { Tag } from "../../atoms";

export default {
  title: "Molecules/Card/Summary Card",
  component: SummaryCard,
  argTypes: {
    className: {
      control: "text",
      table: { disable: true },
    },
    style: {
      control: { type: "object" },
      table: { disable: true },
    },
    type: {
      control: "select",
      options: ["Primary", "Secondary"],
      name: "Card Style",
      mapping: { Primary: "primary", Secondary: "secondary" },
    },
    header: { control: "text", table: { disable: true } },
    subHeader: { control: "text", table: { disable: true } },
    sections: {
      control: "array",
      table: { disable: true },
    },
    layout: {
      control: { type: "number", min: 1, max: 2 },
      name: "Columns",
    },
    inline: {
      control: { type: "select", options: ["Horizontal", "Vertical"] },
      name: "Layout",
    },
    withDivider: { control: "boolean", name: "Divider" },
    withSectionDivider: { control: "boolean", name: "Section Divider" },
    showSectionsAsMultipleCards: {
      control: "boolean",
      name: "Show Sections As Seperate Cards",
    },
    asSeperateCards: { control: "boolean", name: "Show As Seperate Cards" },
  },
};

const VerticalSections = [
  {
    header: "Personal Information",
    subHeader: "Basic details",
    fieldPairs: [
      { label: "Name", value: "John Doe", inline: false, type: "text" },
      { label: "Age", value: "28", inline: false },
      {
        label: "Profile Picture",
        value: {
          src:
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
          alt: "Profile",
          width: "50px",
          height: "50px",
        },
        type: "image",
        inline: false,
      },
    ],
    cardType: "primary",
  },
  {
    header: "Contact Information",
    subHeader: "How to reach me",
    fieldPairs: [
      { label: "Email", value: "john.doe@example.com", inline: false },
      {
        label: "Phone",
        value: {
          label: "+1 123-456-7890",
          onClick: () => alert("Action Clicked..."),
          variation: "link",
          size: "medium",
          style: {},
          icon: "Call",
        },
        type: "action",
        inline: false,
      },
    ],
    cardType: "primary",
  },
  {
    header: "Address",
    subHeader: "Where I live",
    fieldPairs: [
      { label: "Street", value: "123 Main St", inline: false },
      { label: "City", value: "Los Angeles", inline: false },
      { label: "State", value: "CA", inline: false },
      { label: "Zip Code", value: "90001", inline: false },
    ],
    cardType: "primary",
  },
  {
    header: "Other Details",
    fieldPairs: [
      {
        label: "Resume",
        value: {
          onClick: (e) => {
            console.log(e);
          },
        },
        type: "document",
        inline: false,
      },
      {
        label: "Custom",
        value: <Tag showIcon={true} label="Tag" stroke type="success" />,
        type: "custom",
        inline: false,
        renderCustomContent: (value) => value,
      },
    ],
    cardType: "primary",
  },
];

const sections = [
  {
    header: "Personal Information",
    subHeader: "Basic details",
    fieldPairs: [
      { label: "Name", value: "John Doe", inline: true, type: "text" },
      { label: "Age", value: "28", inline: true },
      {
        label: "Profile Picture",
        value: {
          src:
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
          alt: "Profile",
          width: "50px",
          height: "50px",
        },
        type: "image",
        inline: true,
      },
    ],
    cardType: "primary",
  },
  {
    header: "Contact Information",
    subHeader: "How to reach me",
    fieldPairs: [
      { label: "Email", value: "john.doe@example.com", inline: true },
      {
        label: "Phone",
        value: {
          label: "+1 123-456-7890",
          onClick: () => alert("Action Clicked..."),
          variation: "link",
          size: "medium",
          style: {},
          icon: "Call",
        },
        type: "action",
        inline: true,
      },
    ],
    cardType: "primary",
  },
  {
    header: "Address",
    subHeader: "Where I live",
    fieldPairs: [
      { label: "Street", value: "123 Main St", inline: true },
      { label: "City", value: "Los Angeles", inline: true },
      { label: "State", value: "CA", inline: true },
      { label: "Zip Code", value: "90001", inline: true },
    ],
    cardType: "primary",
  },
  {
    header: "Other Details",
    fieldPairs: [
      {
        label: "Resume",
        value: {
          onClick: (e) => {
            console.log(e);
          },
        },
        type: "document",
        inline: true,
      },
      {
        label: "Custom",
        value: <Tag showIcon={true} label="Tag" stroke type="success" />,
        type: "custom",
        inline: true,
        renderCustomContent: (value) => value,
      },
    ],
    cardType: "primary",
  },
];

const Template = (args) => {
  const { inline, sections, ...rest } = args;
  return (
    <SummaryCard
      {...rest}
      sections={inline === "Horizontal" ? sections : VerticalSections}
    />
  );
};

const commonArgs = {
  className: "",
  style: {},
  type: "Primary",
  header: "Heading",
  subHeader: "Subheading",
  withDivider: false,
  layout: 1,
  sections: sections,
  withSectionDivider: false,
  showSectionsAsMultipleCards: false,
  asSeperateCards: true,
  inline: "Horizontal",
};

export const Basic = Template.bind({});
Basic.args = {
  ...commonArgs,
};
Basic.storyName = "Summary Card";