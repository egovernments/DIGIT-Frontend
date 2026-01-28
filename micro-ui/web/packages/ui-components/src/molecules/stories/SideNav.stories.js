import React, { Children } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { SideNav } from "../../atoms";
import {Iframe} from "../../atoms";

export default {
  title: "Molecules/Side Nav",
  component: SideNav,
  argTypes: {
    items: { control: "object" ,table:{disable:true}},
    collapsedWidth: { control: "text",table:{disable:true} },
    expandedWidth: { control: "text" ,table:{disable:true}},
    transitionDuration: { control: "number" ,table:{disable:true}},
    theme: { control: "select", options: ["dark", "light"],table:{disable:true} },
    variant: { control: "select", options: ["Complementary", "Analogous"],mapping:{"Complementary":"primary","Analogous":"secondary"},name:"Selection color"},
    hideAccessbilityTools: { control: "boolean",name:"Universal actions",mapping:{true:false,false:true} },
    onSelect:{ action: "onChange",table:{disable:true} },
    onBottomItemClick:{action:"onChange",table:{disable:true}},
    enableSearch:{control:"boolean",name:"Enable Search"},
    styles:{table:{disable:true}}
  },
};

const Template = (args) => (
  <Router>
    <SideNav {...args} />
  </Router>
);

const darkThemeitems = [
  {
    label: "Home",
    icon: {
      icon: "Home",
    },
  },
  {
    label: "Module 1",
    icon: {
      icon: "ChatBubble",
    },
    children: [
      {
        path: "/",
        label: "SubModule 1",
        icon: {
          icon: "Work",
        },
      },
      {
        path: "/",
        label: "SubModule 2",
        icon: {
          icon: "Person",
        },
      },
    ],
  },
  {
    label: "Module 2",
    icon: {
      icon: "CheckCircle",
    },
    children: [
      {
        path: "/",
        label: "SubModule 1",
        icon: {
          icon: "Info",
        },
        children: [
          {
            path: "/",
            label: "InnerModule 1",
            icon: {
              icon: "LabelImportant",
            },
          },
          {
            path: "/",
            label: "InnerModule 2",
            icon: {
              icon: "Lock",
            },
          },
        ],
      },
      {
        path: "/",
        label: "SubModule 2",
        icon: {
          icon: "Accessibility",
        },
      },
    ],
  },
  {
    label: "Module 3",
    icon: {
      icon: "Delete",
    },
  },
  {
    label: "Module 4",
    icon: {
      icon: "DriveFileMove",
    },
  },
  {
    label: "Module 5",
    icon: {
      icon: "Label",
    },
  },
  {
    label: "Module 6",
    icon: {
      icon: "Lightbulb",
    },
  },
];

const onSelect = (e)  =>{
  console.log(e,"selected")
}
const onBottomItemClick =(e) => {
  console.log(e,"onAccessibilityClick")
}

const commonArgs = {
  items: darkThemeitems,
  transitionDuration: 0.5,
  onSelect:onSelect,
  onBottomItemClick:onBottomItemClick,
  hideAccessbilityTools:true,
  variant: "Complementary",
  enableSearch:true
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="SideNav Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  variant:{table:{disable:true}},
  hideAccessbilityTools:{table:{disable:true}},
  enableSearch:{table:{disable:true}},
}

export const Dark = Template.bind({});
Dark.args = {
  ...commonArgs,
  theme: "dark",
};

export const Light = Template.bind({});
Light.args = {
  ...commonArgs,
  theme: "light",
};

export const Custom = Template.bind({});
Custom.args = {
  ...commonArgs,
  collapsedWidth: "80px",
  expandedWidth: "250px",
};