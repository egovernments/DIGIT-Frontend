import React from "react";
import Button from "../../atoms/Button";
import { Card } from "../../atoms";

export default {
  title: "Molecules/Card/ActionCard",
  component: Card,
  argTypes: {},
};

export const PrimaryActionCard = () => (
  <Card type={"primary"} variant={"action"}>
    <Button
      type={"button"}
      size={"large"}
      variation={"secondary"}
      icon={"Person"}
      label="Assign as household head"
      onClick={() => console.log("Clicked Button 1")}
    />
    <Button
      type={"button"}
      size={"large"}
      variation={"secondary"}
      label="Edit  Individual Details"
      icon={"Edit"}
      onClick={() => console.log("Clicked Button 2")}
    />
    <Button
      type={"button"}
      size={"large"}
      variation={"secondary"}
      label="Delete Individual"
      icon={"DeleteOutline"}
      onClick={() => console.log("Clicked Button 3")}
    />
  </Card>
);

export const SecondaryActionCard = () => (
  <Card type={"secondary"} variant={"action"}>
    <Button
      type={"button"}
      size={"large"}
      variation={"secondary"}
      icon={"Person"}
      label="Assign as household head"
      onClick={() => console.log("Clicked Button 1")}
    />
    <Button
      type={"button"}
      size={"large"}
      variation={"secondary"}
      label="Edit  Individual Details"
      icon={"Edit"}
      onClick={() => console.log("Clicked Button 2")}
    />
    <Button
      type={"button"}
      size={"large"}
      variation={"secondary"}
      label="Delete Individual"
      icon={"DeleteOutline"}
      onClick={() => console.log("Clicked Button 3")}
    />
  </Card>
);
