import React from "react";
import { Header } from "../../atoms";
import { SVG } from "../../atoms";
import { Dropdown } from "../../atoms";

export default {
  title: "Molecules/Header/Dark",
  component: Header,
  argTypes: {
    className: {
      control: "text",
    },
    theme: {
      control: "select",
      options: ["light", "dark"],
    },
    style: {
      control: { type: "object" },
    },
    onImageClick: {
      control: "function",
    },
    onHamburgerClick: {
      control: "function",
    },
    onLogoClick: {
      control: "function",
    },
    props: {
      control: "object",
    },
    setImageToLeft: {
      control: "boolean",
    },
    img: {
      control: "text",
    },
    logo: {
      control: "text",
    },
    ulb: {
      control: "text",
    },
    actionFields: {
      control: {
        type: "array",
        separator: ",",
      },
    },
  },
};

const darkthemefields = [
  <Dropdown
    optionKey={"name"}
    option={[
      { name: "Option A", code: "a", icon: "MyLocation" },
      { name: "Option B", code: "b", icon: "MyLocation" },
      { name: "Option C", code: "c", icon: "MyLocation" },
      { name: "Option D", code: "d", icon: "MyLocation" },
      { name: "Option E", code: "e", icon: "MyLocation" },
      { name: "Option F", code: "f", icon: "MyLocation" },
      { name: "Option G", code: "g", icon: "MyLocation" },
      { name: "Option H", code: "h", icon: "MyLocation" },
      { name: "Option I", code: "i", icon: "MyLocation" },
      { name: "Option J", code: "j", icon: "MyLocation" },
      { name: "Option K", code: "k", icon: "MyLocation" },
      { name: "Option L", code: "l", icon: "MyLocation" },
      { name: "Option M", code: "m", icon: "MyLocation" },
      { name: "Option N", code: "n", icon: "MyLocation" },
      { name: "Option O", code: "o", icon: "MyLocation" },
    ]}
    select={(option) => console.log(option, "Option selected")}
    customSelector={"City"}
    theme={"dark"}
  />,
];

const DarkThemeFields = [
  <Dropdown
    optionKey={"name"}
    option={[
      { name: "City A", code: "citya" },
      { name: "City B", code: "cityb" },
      { name: "City C", code: "cityc" },
    ]}
    select={(option) => console.log(option, "Option selected")}
    customSelector={"City"}
    theme={"dark"}
  />,
  <Dropdown
    optionKey={"name"}
    option={[
      { name: "English", code: "English" },
      { name: "Hindi", code: "Hindi" },
    ]}
    select={(option) => console.log(option, "Option selected")}
    selected={{ name: "English", code: "English" }}
    customSelector={"Language"}
    theme={"dark"}
  />,
  <Dropdown
    optionKey={"name"}
    option={[
      { name: "Edit Profile", code: "editProfile", icon: "Edit" },
      { name: "Logout", code: "logout", icon: "Logout" },
    ]}
    select={(option) => console.log(option, "Option selected")}
    showArrow={false}
    profilePic={"P"}
    theme={"dark"}
  />,
];

const DarkThemeFieldsWithProfileAsImg = [
  <Dropdown
    optionKey={"name"}
    option={[
      { name: "City A", code: "citya" },
      { name: "City B", code: "cityb" },
      { name: "City C", code: "cityc" },
    ]}
    select={(option) => console.log(option, "Option selected")}
    customSelector={"City"}
    theme={"dark"}
  />,
  <Dropdown
    optionKey={"name"}
    option={[
      { name: "English", code: "English" },
      { name: "Hindi", code: "Hindi" },
    ]}
    select={(option) => console.log(option, "Option selected")}
    selected={{ name: "English", code: "English" }}
    customSelector={"Language"}
    theme={"dark"}
  />,
  <Dropdown
    optionKey={"name"}
    option={[
      { name: "Edit Profile", code: "editProfile", icon: "Edit" },
      { name: "Logout", code: "logout", icon: "Logout" },
    ]}
    select={(option) => console.log(option, "Option selected")}
    showArrow={false}
    profilePic={
      <img
        alt="Powered by DIGIT"
        src={"https://egov-dev-assets.s3.ap-south-1.amazonaws.com/digit.png"}
      />
    }
    theme={"dark"}
  />,
];

const DarkThemeFieldsWithProfileAsSvg = [
  <Dropdown
    optionKey={"name"}
    option={[
      { name: "City A", code: "citya" },
      { name: "City B", code: "cityb" },
      { name: "City C", code: "cityc" },
    ]}
    select={(option) => console.log(option, "Option selected")}
    customSelector={"City"}
    theme={"dark"}
  />,
  <Dropdown
    optionKey={"name"}
    option={[
      { name: "English", code: "English" },
      { name: "Hindi", code: "Hindi" },
    ]}
    select={(option) => console.log(option, "Option selected")}
    selected={{ name: "English", code: "English" }}
    customSelector={"Language"}
    theme={"dark"}
  />,
  <Dropdown
    optionKey={"name"}
    option={[
      { name: "Edit Profile", code: "editProfile", icon: "Edit" },
      { name: "Logout", code: "logout", icon: "Logout" },
    ]}
    select={(option) => console.log(option, "Option selected")}
    showArrow={false}
    profilePic={<SVG.Person fill={"#FFFFFF"}></SVG.Person>}
    theme={"dark"}
  />,
];

const Template = (args) => <Header {...args} />;
const commonArgs = {
  img: "",
  className: "",
  style: {},
  theme: "light",
  setImageToLeft: false,
  props: {},
  ulb: "",
  showDeafultImg: true,
  logo:
    "",
};

export const HeaderExample = Template.bind({});
HeaderExample.args = {
  ...commonArgs,
  theme: "dark",
  ulb: "Logo Placeholder",
  language: "English",
  onImageClick: () => {
    console.log("image is clicked");
  },
  onLogoClick: () => {
    console.log("logo is clicked");
  },
  onHamburgerClick: () => {
    console.log("hamburger clicked");
  },
};
HeaderExample.storyName="Header";

export const HeaderWithImageOnLeft = Template.bind({});
HeaderWithImageOnLeft.args = {
  ...commonArgs,
  ulb: "Logo Placeholder",
  language: "English",
  onImageClick: () => {
    console.log("image is clicked");
  },
  onLogoClick: () => {
    console.log("logo is clicked");
  },
  onHamburgerClick: () => {
    console.log("hamburger clicked");
  },
  setImageToLeft: true,
  theme: "dark",
};

export const WithActionFields = Template.bind({});
WithActionFields.args = {
  ...commonArgs,
  ulb: "Logo Placeholder",
  language: "English",
  onImageClick: () => {
    console.log("image is clicked");
  },
  onLogoClick: () => {
    console.log("logo is clicked");
  },
  onHamburgerClick: () => {
    console.log("hamburger clicked");
  },
  actionFields: DarkThemeFields,
  theme: "dark",
};

export const ActionFieldsWithProfileAsImg = Template.bind({});
ActionFieldsWithProfileAsImg.args = {
  ...commonArgs,
  ulb: "Logo Placeholder",
  language: "English",
  onImageClick: () => {
    console.log("image is clicked");
  },
  onLogoClick: () => {
    console.log("logo is clicked");
  },
  onHamburgerClick: () => {
    console.log("hamburger clicked");
  },
  actionFields: DarkThemeFieldsWithProfileAsImg,
  theme: "dark",
};

export const WithActionFieldsWithProfileAsSvg = Template.bind({});
WithActionFieldsWithProfileAsSvg.args = {
  ...commonArgs,
  ulb: "Logo Placeholder",
  language: "English",
  onImageClick: () => {
    console.log("image is clicked");
  },
  onLogoClick: () => {
    console.log("logo is clicked");
  },
  onHamburgerClick: () => {
    console.log("hamburger clicked");
  },
  actionFields: DarkThemeFieldsWithProfileAsSvg,
  theme: "dark",
};

export const WithDropdownMoreOptions = Template.bind({});
WithDropdownMoreOptions.args = {
  ...commonArgs,
  ulb: "Logo Placeholder",
  language: "English",
  onImageClick: () => {
    console.log("image is clicked");
  },
  onLogoClick: () => {
    console.log("logo is clicked");
  },
  onHamburgerClick: () => {
    console.log("hamburger clicked");
  },
  actionFields: darkthemefields,
  theme:"dark"
};

export const WithActionFieldsAndImageOnLeft = Template.bind({});
WithActionFieldsAndImageOnLeft.args = {
  ...commonArgs,
  ulb: "Logo Placeholder",
  language: "English",
  onImageClick: () => {
    console.log("image is clicked");
  },
  onLogoClick: () => {
    console.log("logo is clicked");
  },
  onHamburgerClick: () => {
    console.log("hamburger clicked");
  },
  actionFields: DarkThemeFields,
  setImageToLeft: true,
  theme: "dark",
};