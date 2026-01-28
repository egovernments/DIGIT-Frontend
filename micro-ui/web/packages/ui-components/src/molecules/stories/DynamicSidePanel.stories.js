import React from "react";
import SidePanel from "../../atoms/SidePanel";
import Button from "../../atoms/Button";
import { SVG } from "../../atoms/SVG";

export default {
  title: "Molecules/Side Panel/Dynamic",
  component: SidePanel,
  argTypes: {
    className: { control: "text" ,table:{disable:true}},
    styles: { control: "object",table:{disable:true} },
    type: { control: "select", options: ["static", "dynamic"] ,table:{disable:true}},
    position: { control: "select", options: ["left", "right"] ,name:"Position"},
    children: {
      control: "object",table:{disable:true}
    },
    header: {
      control: "object",table:{disable:true}
    },
    footer: {
      control: "object",table:{disable:true}
    },
    bgActive: { control: "boolean" ,name:'Background Active'},
    isOverlay: { control: "boolean",table:{disable:true} },
    hideArrow: { control: "boolean" ,name:'With Nudge',mapping:{
      true:false,
      false:true
    }},
    hideScrollIcon: { control: "boolean",table:{disable:true} },
    isDraggable: { control: "boolean" ,name:"Draggable"},
    defaultClosedWidth: { control: "text" ,table:{disable:true}},
    defaultOpenWidth: { control: "text" ,table:{disable:true}},
    addClose: { control: "boolean",name:"With Close" },
    closedHeader: { control: "object" ,table:{disable:true}},
    closedFooter: { control: "object",table:{disable:true} },
    closedContents: { control: "object",table:{disable:true} },
    sections: {control:'boolean',name:"With Sections" },
    closedSections:{table:{disable:true}},
    transitionDuration:{table:{disable:true}}
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
      label={"Dynamic SidePanel"}
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
      label={"Dynamic SidePanel"}
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
      label={"Dynamic SidePanel"}
      icon={"Edit"}
      variation={"secondary"}
    />,
  ],
];

const Template = (args) => {
  const {sections,...rest} = args;
  return (<SidePanel {...rest} sections={sections ? sectionsToShow : []} />)
};

const commonArgs = {
  className: "",
  styles: {},
  type: "dynamic",
  position: "right",
  children: [],
  header: [],
  footer: [],
  bgActive: true,
  isOverlay: false,
  isDraggable: true,
  hideScrollIcon: true,
  sections: [],
  defaultClosedWidth: "",
  defaultOpenWidth: "",
  addClose:false,
  closedContents:[],
  closedSections:[],
  closedHeader:[],
  closedFooter:[],
  hideArrow:true
};

const children = [
  <div className="typography heading-s">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div>
];

const closedSections = [
  <div style={{ display: "flex", alignItems: "center" ,flexDirection:"column",gap:"4px"}}>
    <div
      style={{
        border: "1px solid #d6d5d4",
        borderTopLeftRadius: "2px",
        borderBottomLeftRadius: "2px",
        backgroundColor: "#eeeeee",
        color: "#363636",
        padding: "10px",
      }}
      className="typography heading-s"
    >
      R1
    </div>
    <div
      style={{
        border: "1px solid #d6d5d4",
        borderTopLeftRadius: "2px",
        borderBottomLeftRadius: "2px",
        backgroundColor: "#eeeeee",
        color: "#363636",
        padding: "10px",
      }}
      className="typography heading-s"
    >
      R2
    </div>
    <div
      style={{
        border: "1px solid #d6d5d4",
        borderTopLeftRadius: "2px",
        borderBottomLeftRadius: "2px",
        backgroundColor: "#eeeeee",
        color: "#363636",
        padding: "10px",
      }}
      className="typography heading-s"
    >
      R3
    </div>
  </div>,
    <div style={{ display: "flex", alignItems: "center" ,flexDirection:"column",gap:"4px"}}>
    <div
      style={{
        border: "1px solid #d6d5d4",
        borderTopLeftRadius: "2px",
        borderBottomLeftRadius: "2px",
        backgroundColor: "#eeeeee",
        color: "#363636",
        padding: "10px",
      }}
      className="typography heading-s"
    >
      R1
    </div>
    <div
      style={{
        border: "1px solid #d6d5d4",
        borderTopLeftRadius: "2px",
        borderBottomLeftRadius: "2px",
        backgroundColor: "#eeeeee",
        color: "#363636",
        padding: "10px",
      }}
      className="typography heading-s"
    >
      R2
    </div>
    <div
      style={{
        border: "1px solid #d6d5d4",
        borderTopLeftRadius: "2px",
        borderBottomLeftRadius: "2px",
        backgroundColor: "#eeeeee",
        color: "#363636",
        padding: "10px",
      }}
      className="typography heading-s"
    >
      R3
    </div>
  </div>,
    <div style={{ display: "flex", alignItems: "center" ,flexDirection:"column",gap:"4px"}}>
    <div
      style={{
        border: "1px solid #d6d5d4",
        borderTopLeftRadius: "2px",
        borderBottomLeftRadius: "2px",
        backgroundColor: "#eeeeee",
        color: "#363636",
        padding: "10px",
      }}
      className="typography heading-s"
    >
      R1
    </div>
    <div
      style={{
        border: "1px solid #d6d5d4",
        borderTopLeftRadius: "2px",
        borderBottomLeftRadius: "2px",
        backgroundColor: "#eeeeee",
        color: "#363636",
        padding: "10px",
      }}
      className="typography heading-s"
    >
      R2
    </div>
    <div
      style={{
        border: "1px solid #d6d5d4",
        borderTopLeftRadius: "2px",
        borderBottomLeftRadius: "2px",
        backgroundColor: "#eeeeee",
        color: "#363636",
        padding: "10px",
      }}
      className="typography heading-s"
    >
      R3
    </div>
  </div>,
];

const closedContents = [
  <div style={{ display: "flex", alignItems: "center" }}>
    <div
      style={{
        border: "1px solid #d6d5d4",
        borderTopLeftRadius: "2px",
        borderBottomLeftRadius: "2px",
        backgroundColor: "#eeeeee",
        color: "#363636",
        padding: "4px",
      }}
      className="typography heading-s"
    >
      R1
    </div>
  </div>,
  <div style={{ display: "flex", alignItems: "center" }}>
    <div
      style={{
        border: "1px solid #d6d5d4",
        borderTopLeftRadius: "2px",
        borderBottomLeftRadius: "2px",
        backgroundColor: "#eeeeee",
        color: "#363636",
        padding: "4px",
      }}
      className="typography heading-s"
    >
      R2
    </div>
  </div>,
  <div style={{ display: "flex", alignItems: "center" }}>
    <div
      style={{
        border: "1px solid #d6d5d4",
        borderTopLeftRadius: "2px",
        borderBottomLeftRadius: "2px",
        backgroundColor: "#eeeeee",
        color: "#363636",
        padding: "4px",
      }}
      className="typography heading-s"
    >
      R3
    </div>
  </div>
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
    label={"Dynamic SidePanel"}
    icon={"Edit"}
    variation={"primary"}
  />,
];

const closedFooter = [
<SVG.Edit></SVG.Edit>
];

const closedHeader = [
  <div
  style={{
    border: "1px solid #d6d5d4",
    borderTopLeftRadius: "2px",
    borderBottomLeftRadius: "2px",
    backgroundColor: "#eeeeee",
    color: "#0B4B66",
    width:"100%",
    lineHeight:"normal",
    height:"fit-content",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}
  className="typography heading-l"
>
  H
</div>
]

export const Basic = Template.bind({});
Basic.args = {
  ...commonArgs,
  type: "dynamic",
  position: "right",
  children: children,
  header: header,
  footer: footer,
  closedContents:closedContents,
  closedHeader:closedHeader,
  closedFooter:closedFooter
};

export const Custom = Template.bind({});
Custom.args = {
  ...commonArgs,
  type: "dynamic",
  position: "right",
  children: children,
  header: header,
  footer: footer,
  defaultClosedWidth: 100,
  defaultOpenWidth: 600,
  closedSections:closedSections,
  closedContents:closedContents,
  closedHeader:closedHeader,
  closedFooter:closedFooter
};
