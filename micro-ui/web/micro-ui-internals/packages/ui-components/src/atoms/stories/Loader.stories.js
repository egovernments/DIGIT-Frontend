import React from "react";
import Loader from "../Loader";
import theLoaderPrimary from "../../constants/animations/theLoaderPrimary.json";
import Iframe from "../Iframe";

export default {
  title: "Atoms/Loader",
  component: Loader,
  argTypes: {
    variant: {
      control: "select",
      options: ["Basic", "PageLoader", "OverlayLoader"],
      table:{disable:true}
    },
    className: {
      control: "text",
      table:{disable:true}
    },
    hideEllipsis: {
      table:{disable:true}
    },
    style: {
      control: { type: "object" },
      table:{disable:true}
    },
    animationStyles: {
      control: { type: "object" },
      table:{disable:true}
    },
    loaderText: {
      control: "text",
      name:"Loader Text"
    },
  },
};

const Template = (args) => <Loader {...args} />;

const commonArgs = {
  className: "",
  style: {},
  variant: "Basic",
  animationStyles: {},
  loaderText:"Loading",
  hideEllipsis:false
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="Loader Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  loaderText: { table: { disable: true } },
};

export const Basic = Template.bind({});
Basic.args = {
  ...commonArgs,
  variant: "Basic",
};

export const PageLoader = Template.bind({});
PageLoader.args = {
  ...commonArgs,
  variant: "PageLoader",
};

export const OverlayLoader = Template.bind({});
OverlayLoader.args = {
  ...commonArgs,
  variant: "OverlayLoader",
};

export const Custom = Template.bind({});
Custom.args = {
  ...commonArgs,
  variant: "Basic",
  style: {
    width: "100%",
    height: "300px",
    alignItems: "center",
  },
  loaderText: "This page is loading",
  animationStyles: {
    width: "50px",
    height: "50px",
    animationData: theLoaderPrimary,
  },
  className: "custom-loader-example",
};