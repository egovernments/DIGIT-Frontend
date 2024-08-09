import React from "react";
import { LabelFieldPair, TextBlock } from "../../atoms";
import { Card } from "../../atoms";
import { ViewCardFieldPair } from "../../atoms";
import { Button } from "../../atoms";
import { TextInput } from "../../atoms";

export default {
  title: "Molecules/Card/ViewCard",
  component: Card,
  argTypes: {
    className: {
      control: "text",
    },
    style: {
      control: { type: "object" },
    },
    children: {
      control: "object",
    },
    type: { control: "select", options: ["primary", "secondary"] },
    onClick: {
      control: "function",
    },
    props: {
      control: "object",
    },
  },
};

const Template = (args) => <Card {...args} />;

const options = [
  { code: "MALE", name: "MALE" },
  { code: "FEMALE", name: "FEMALE" },
  { code: "TRANSGENDER", name: "TRANSGENDER" },
];

export const ExampleViewCard = () => (
  <Card
    type={"primary"}
    variant="viewcard"
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "64px",
    }}
  >
    <Card
      type={"primary"}
      style={{
        boxShadow: "none",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "0px",
      }}
    >
      <TextBlock header="Heading" headerClasName=""></TextBlock>
      <Card
        type={"primary"}
        style={{
          boxShadow: "none",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "0px",
        }}
      >
        <TextBlock subHeader="Details" subHeaderClasName=""></TextBlock>
        <ViewCardFieldPair
          label={"Start Date"}
          value={"12 August 2023"}
          inline={true}
        ></ViewCardFieldPair>
        <ViewCardFieldPair
          label={"Birthday"}
          value={"12 August 2023"}
          inline={false}
        ></ViewCardFieldPair>
      </Card>
    </Card>
    <Card
      type={"primary"}
      style={{
        boxShadow: "none",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "0px",
      }}
    >
      <TextBlock
        subHeader="Add your start and end dates for cycles"
        subHeaderClasName=""
      ></TextBlock>
      <Card type={"secondary"}>
        <div
          style={{
            maxWidth: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: "8px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              flexGrow: 1,
            }}
          >
            <TextBlock body="Attribute" bodyClasName=""></TextBlock>
            <TextInput type="text"></TextInput>
          </div>
          <div
            style={{
              flexGrow: 1,
            }}
          >
            <TextBlock body="Operator" bodyClasName=""></TextBlock>
            <TextInput type="text"></TextInput>
          </div>
          <div
            style={{
              flexGrow: 1,
            }}
          >
            <TextBlock body="Value" bodyClasName=""></TextBlock>
            <TextInput type="text"></TextInput>
          </div>
          <Button
            label={"Delete Row"}
            variation={"teritiary"}
            icon="Delete"
            style={{ flexShrink: 0 }}
          ></Button>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            label={"Add More Attributes"}
            variation={"secondary"}
            icon="AddNewFill"
            style={{ width: "100%" }}
          ></Button>
        </div>
      </Card>
    </Card>
    <Card
      type={"primary"}
      style={{
        boxShadow: "none",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "0px",
      }}
    >
      <TextBlock
        subHeader="Add your start and end dates for cycles"
        subHeaderClasName=""
      ></TextBlock>
      <LabelFieldPair
        style={{
          display: "flex",
          gap: "24px",
          alignItems: "center",
          marginBottom: "0px",
        }}
      >
        <TextBlock
          body="Field 1"
          bodyClasName=""
          style={{ width: "100%" }}
        ></TextBlock>
        <TextInput type="text" placeholder={"Value"}></TextInput>
      </LabelFieldPair>
      <LabelFieldPair
        style={{
          display: "flex",
          gap: "24px",
          alignItems: "center",
          marginBottom: "0px",
        }}
      >
        <TextBlock
          body="Field 2"
          bodyClasName=""
          style={{ width: "100%" }}
        ></TextBlock>
        <TextInput type="text" placeholder={"Value"}></TextInput>
      </LabelFieldPair>
      <LabelFieldPair
        style={{
          display: "flex",
          gap: "24px",
          alignItems: "center",
          marginBottom: "0px",
        }}
      >
        <TextBlock
          body="Field 3"
          bodyClasName=""
          style={{ width: "100%" }}
        ></TextBlock>
        <TextInput type="text" placeholder={"Value"}></TextInput>
      </LabelFieldPair>
    </Card>
  </Card>
);
