import React from "react";
import { Drawer } from "components";

const mdmsData = [
  {
    actionId: 12,
    order: 45,
    buttonName: "TestButton1--Testing",
    navigationURL: "https://www.google.com",
    iconName: "icon-home",
    name: "Home",
    module: "Module1",
  },
  {
    actionId: 12,
    order: 45,
    buttonName: "TestButton1--Testing",
    navigationURL: "https://www.google.com",
    iconName: "icon-home",
    name: "Home",
    module: "Module1",
  },
  {
    actionId: 13,
    order: 46,
    buttonName: "Button2",
    navigationURL: "https://www.example.com",
    iconName: "icon-settings",
    name: "Settings",
    module: "Module2",
  },
  {
    actionId: 13,
    order: 46,
    buttonName: "Button2",
    navigationURL: "https://www.example.com",
    iconName: "icon-settings",
    name: "Settings",
    module: "Module2",
  },
];

function DrawerTest() {
  return (
    <div className="slider-test">
      <Drawer drawerDirection="right" mdmsData={mdmsData} />
    </div>
  );
}

export default DrawerTest;
