import React from "react";
import MenuCardWrapper from "../MenuCardWrapper";
import MenuCard from "../MenuCard";
import { Iframe } from "../../atoms";

export default {
  title: "MoleculeGroup/Menu Card Wrapper",
  component: MenuCardWrapper,
  argTypes: {
    numberOfCards: {
      control: { type: "number", min: 1 },
      defaultValue: 3,
      name: "No of Cards",
      description: "Number of LandingPageCards to display",
    },
    className: { table: { disable: true } },
    styles: { table: { disable: true } },
    children: { table: { disable: true } },
  },
};

const Template = (args) => {
  const { numberOfCards, ...rest } = args;

  const generateCards = (count) => {
    return Array.from({ length: count }, (_, index) => (
      <MenuCard
        icon={"Article"}
        menuName={`Card ${index + 1}`}
        description={
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
        }
        className={""}
        styles={{}}
        onClick={(e) => {
          console.log(e);
        }}
        key={index}
      />
    ));
  };

  return (
    <MenuCardWrapper {...rest}>{generateCards(numberOfCards)}</MenuCardWrapper>
  );
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="MenuCardWrapper Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  numberOfCards: { table: { disable: true } },
};

// Default story showing a group of MenuCards
export const Basic = Template.bind({});
Basic.args = {};

// MenuCardWrapper with custom styles
export const Custom = Template.bind({});
Custom.args = {
  styles: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    padding: "16px",
    backgroundColor: "#f4f4f4",
  },
};