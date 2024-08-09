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
    title: "Explore you Application",
    label:
      "iuhdais haifna haiojsl  ashfio a,sduhioafsn hioasjo mfhaiojfl hiajfo fsk hioafsm afsbifsahoafs  afs",
  },
  {
    actionId: 12,
    order: 45,
    buttonName: "TestButton1--Testing",
    navigationURL: "https://www.google.com",
    iconName: "Atm",
    name: "Home",
    module: "Module1",
    title: "Explore you Application",
    label:
      "iuhdais haifna haiojsl  ashfio a,sduhioafsn hioasjo mfhaiojfl hiajfo fsk hioafsm afsbifsahoafs  afs",
  },
  {
    actionId: 13,
    order: 46,
    buttonName: "Button2",
    navigationURL: "https://www.example.com",
    iconName: "DSOTruck",
    name: "Settings",
    module: "Module2",
    title: "Explore you Work",
    label:
      "iuhdais haifna haiojsl  ashfio a,sduhioafsn hioasjo mfhaiojfl hiajfo fsk hioafsm afsbifsahoafs  afs",
  },
  {
    actionId: 13,
    order: 46,
    buttonName: "Button2",
    navigationURL: "https://www.example.com",
    iconName: "MyLocation",
    name: "Settings",
    module: "Module2",
    title: "Explore you Application",
    label:
      "iuhdais haifna haiojsl  ashfio a,sduhioafsn hioasjo mfhaiojfl hiajfo fsk hioafsm afsbifsahoafs  afs",
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
