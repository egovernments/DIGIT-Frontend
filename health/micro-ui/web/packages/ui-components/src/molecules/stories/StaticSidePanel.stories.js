import React from "react";
import SidePanel from "../../atoms/SidePanel";
import Button from "../../atoms/Button";

export default {
  title: "Molecules/Side Panel/Static",
  component: SidePanel,
  argTypes: {
    className: { control: "text", table: { disable: true } },
    styles: { control: "object", table: { disable: true } },
    type: {
      control: "select",
      options: ["static", "dynamic"],
      table: { disable: true },
    },
    position: {
      control: "select",
      options: ["left", "right"],
      name: "Position",
    },
    children: {
      control: "object",
      table: { disable: true },
    },
    header: {
      control: "object",
      table: { disable: true },
    },
    footer: {
      control: "object",
      table: { disable: true },
    },
    bgActive: { control: "boolean", name: "Background Active" },
    isOverlay: { control: "boolean", table: { disable: true } },
    hideArrow: { control: "boolean", table: { disable: true } },
    hideScrollIcon: { control: "boolean", table: { disable: true } },
    isDraggable: { control: "boolean", table: { disable: true } },
    defaultClosedWidth: { control: "text", table: { disable: true } },
    defaultOpenWidth: { control: "text", table: { disable: true } },
    addClose: { control: "boolean", name: "With Close" },
    closedContents: { control: "object", table: { disable: true } },
    closedHeader: { control: "object", table: { disable: true } },
    closedFooter: { control: "object", table: { disable: true } },
    sections: { control: "boolean", name: "With Sections" },
    closedSections: { table: { disable: true } },
    transitionDuration: { table: { disable: true } },
  },
};

const sectionsToShow = [
  [
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div className="typography heading-s" style={{ color: "#0B4B66" }}>
        Subheading1
      </div>
    </div>,
    <div className="typography body-s">
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the
      1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book.
    </div>,
    <Button
      onClick={() => {
        console.log("clicked");
      }}
      size={"medium"}
      style={{ width: "100%" }}
      label={"Static SidePanel"}
      icon={"Edit"}
      variation={"secondary"}
    />,
  ],
  [
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div className="typography heading-s" style={{ color: "#0B4B66" }}>
        Subheading2
      </div>
    </div>,
    <div className="typography body-s">
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the
      1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book.
    </div>,
    <Button
      onClick={() => {
        console.log("clicked");
      }}
      size={"medium"}
      style={{ width: "100%" }}
      label={"Static SidePanel"}
      icon={"Edit"}
      variation={"secondary"}
    />,
  ],
  [
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div className="typography heading-s" style={{ color: "#0B4B66" }}>
        Subheading3
      </div>
    </div>,
    <div className="typography body-s">
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the
      1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book.
    </div>,
    <Button
      onClick={() => {
        console.log("clicked");
      }}
      size={"medium"}
      style={{ width: "100%" }}
      label={"Static SidePanel"}
      icon={"Edit"}
      variation={"secondary"}
    />,
  ],
];

const Template = (args) => {
  const { sections, ...rest } = args;
  return <SidePanel {...rest} sections={sections ? sectionsToShow : []} />;
};

const commonArgs = {
  className: "",
  styles: {},
  type: "static",
  position: "right",
  children: [],
  header: [],
  footer: [],
  bgActive: true,
  isOverlay: false,
  isDraggable: false,
  hideScrollIcon: true,
  sections: [],
  defaultClosedWidth: "",
  defaultOpenWidth: "",
  addClose: false,
  closedContents: [],
  closedSections: [],
  closedHeader: [],
  closedFooter: [],
  hideArrow: false,
};

const children = [
  <div>This is static content on the right!</div>,
  <div className="typography heading-s">
    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
    Lorem Ipsum has been the industry's standard dummy text ever since the
    1500s, when an unknown printer took a galley of type and scrambled it to
    make a type specimen book. It has survived not only five centuries, but also
    the leap into electronic typesetting, remaining essentially unchanged. It
    was popularised in the 1960s with the release of Letraset sheets containing
    Lorem Ipsum passages, and more recently with desktop publishing software
    like Aldus PageMaker including versions of Lorem Ipsum.
  </div>,
];

const header = [
  <div className="typography heading-m" style={{ color: "#0B4B66" }}>
    Header
  </div>,
];

const footer = [
  <Button
    onClick={() => {
      console.log("clicked");
    }}
    size={"medium"}
    style={{ width: "100%" }}
    label={"Static Sidepanel"}
    icon={"Edit"}
    variation={"primary"}
  />,
];

export const Basic = Template.bind({});
Basic.args = {
  ...commonArgs,
  type: "static",
  position: "right",
  children: children,
  header: header,
  footer: footer,
};

export const Custom = Template.bind({});
Custom.args = {
  ...commonArgs,
  type: "static",
  position: "right",
  children: children,
  header: header,
  footer: footer,
  defaultOpenWidth: 600,
};