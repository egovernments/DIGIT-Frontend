import React from "react";
import SidePanel from "../../atoms/SidePanel";
import Iframe from "../../atoms/Iframe";

export default {
  title: "Molecules/Side Panel",
  component: SidePanel,
  argTypes: {
    className: { control: "text" ,table:{disable:true}},
    styles: { control: "object",table:{disable:true} },
    type: { control: "select", options: ["static", "dynamic"] ,table:{disable:true}},
    position: { control: "select", options: ["left", "right"] ,name:"Position",table:{disable:true}},
    children: {
      control: "object",table:{disable:true}
    },
    header: {
      control: "object",table:{disable:true}
    },
    footer: {
      control: "object",table:{disable:true}
    },
    bgActive: { control: "boolean" ,name:'Background Active',table:{disable:true}},
    isOverlay: { control: "boolean",table:{disable:true} },
    hideArrow: { control: "boolean" ,name:'With Nudge',mapping:{
      true:false,
      false:true
    },table:{disable:true}},
    hideScrollIcon: { control: "boolean",table:{disable:true} },
    isDraggable: { control: "boolean" ,name:"Draggable",table:{disable:true}},
    defaultClosedWidth: { control: "text" ,table:{disable:true}},
    defaultOpenWidth: { control: "text" ,table:{disable:true}},
    addClose: { control: "boolean",name:"With Close" ,table:{disable:true}},
    closedHeader: { control: "object" ,table:{disable:true}},
    closedFooter: { control: "object",table:{disable:true} },
    closedContents: { control: "object",table:{disable:true} },
    sections: {control:'boolean',name:"With Sections",table:{disable:true} },
    closedSections:{table:{disable:true}},
    transitionDuration:{table:{disable:true}}
  },
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="SidePanel Documentation"
  />
);

Documentation.storyName = "Docs";