import React from "react";
import { Drawer } from "components";

const mdmsData = [
  {
    actionId: 12,
    order: 45,
    buttonName: "TestButton1--Testing",
    navigationURL: "https://www.google.com",
    iconName: "AccountBox",
    name: "Home",
    module: "Module1",
    buttonLabel: "TestButton1--Testing",
    title: "TITLE_HEADER_1",
    label: "TITLE_HEADER_1_LABEL",
  },
  {
    actionId: 12,
    order: 45,
    buttonName: "TestButton1--Testing",
    navigationURL: "https://www.google.com",
    iconName: "Atm",
    name: "Home",
    module: "Module1",
  },
  {
    actionId: 13,
    order: 46,
    buttonName: "Button2",
    navigationURL: "https://www.example.com",
    iconName: "DSOTruck",
    name: "Settings",
    module: "Module2",
  },
  {
    actionId: 13,
    order: 46,
    buttonName: "Button2",
    navigationURL: "https://www.example.com",
    iconName: "MyLocation",
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
