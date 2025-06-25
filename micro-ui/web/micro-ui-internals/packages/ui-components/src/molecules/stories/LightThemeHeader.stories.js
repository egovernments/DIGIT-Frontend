import React from "react";
import { Header } from "../../atoms";
import { SVG } from "../../atoms";
import { Dropdown } from "../../atoms";

export default {
  title: "Molecules/Header/Light",
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

const fields = [
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
    theme={"light"}
  />,
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
  theme={"light"}
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
  theme={"light"}
/>,
];

const LightThemeFields = [
  <Dropdown
    optionKey={"name"}
    option={[
      { name: "City A", code: "citya" },
      { name: "City B", code: "cityb" },
      { name: "City C", code: "cityc" },
    ]}
    select={(option) => console.log(option, "Option selected")}
    customSelector={"City"}
    theme={"light"}
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
    theme={"light"}
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
    theme={"light"}
  />,
];

const LightThemeFieldsWithProfileAsImg = [
  <Dropdown
    optionKey={"name"}
    option={[
      { name: "City A", code: "citya" },
      { name: "City B", code: "cityb" },
      { name: "City C", code: "cityc" },
    ]}
    select={(option) => console.log(option, "Option selected")}
    customSelector={"City"}
    theme={"light"}
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
    theme={"light"}
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
        src={
          "https://egov-uat-assets.s3.ap-south-1.amazonaws.com/hcm/mseva-white-logo.png"
        }
      />
    }
    theme={"light"}
  />,
];

const LightThemeFieldsWithProfileAsSvg = [
  <Dropdown
    optionKey={"name"}
    option={[
      { name: "City A", code: "citya" },
      { name: "City B", code: "cityb" },
      { name: "City C", code: "cityc" },
    ]}
    select={(option) => console.log(option, "Option selected")}
    customSelector={"City"}
    theme={"light"}
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
    theme={"light"}
  />,
  <Dropdown
    optionKey={"name"}
    option={[
      { name: "Edit Profile", code: "editProfile", icon: "Edit" },
      { name: "Logout", code: "logout", icon: "Logout" },
    ]}
    select={(option) => console.log(option, "Option selected")}
    showArrow={false}
    profilePic={<SVG.Person fill={"#0B4B66"}></SVG.Person>}
    theme={"light"}
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

export const LightThemeHeader = Template.bind({});
LightThemeHeader.args = {
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
};

export const LightThemeHeaderWithImageOnLeft = Template.bind({});
LightThemeHeaderWithImageOnLeft.args = {
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
};

export const WithActionFields = Template.bind({});
WithActionFields.args = {
  ...commonArgs,
  ulb: "Logo Placeholder",
  onImageClick: () => {
    console.log("image is clicked");
  },
  onLogoClick: () => {
    console.log("logo is clicked");
  },
  onHamburgerClick: () => {
    console.log("hamburger clicked");
  },
  actionFields: LightThemeFields,
};

export const WithProfileAsImage = Template.bind({});
WithProfileAsImage.args = {
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
  actionFields: LightThemeFieldsWithProfileAsImg,
};

export const WithProfileAsSvg = Template.bind({});
WithProfileAsSvg.args = {
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
  actionFields: LightThemeFieldsWithProfileAsSvg,
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
  actionFields: fields,
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
  actionFields: LightThemeFields,
  setImageToLeft: true,
};