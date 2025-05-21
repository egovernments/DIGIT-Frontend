import React from "react";
import InfoCard from "../../atoms/InfoCard";
import Button from "../../atoms/Button";
import TextArea from "../../atoms/TextArea";
import MultiSelectDropdown from "../../atoms/MultiSelectDropdown";
import Dropdown from "../../atoms/Dropdown";
import TextInput from "../../atoms/TextInput";
import ButtonsGroup from "../../atoms/ButtonsGroup";
import { TextBlock } from "../../atoms";
import { Card } from "../../atoms";

export default {
  title: "Molecules/Card/SecondaryCard",
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
    variant: {
      control: "select",
      options: [
        "empty",
        "form",
        "viewform",
        "filter1",
        "filter2",
        "menu",
        "kpi",
        "action",
        "search",
      ],
    },
    onClick: {
      control: "function",
    },
    props: {
      control: "object",
    },
  },
};

const Template = (args) => <Card {...args} />;

//mock options data
const options = [
  { code: "MALE", name: "MALE" },
  { code: "FEMALE", name: "FEMALE" },
  { code: "TRANSGENDER", name: "TRANSGENDER" },
];

const buttons = [
  <Button
    type={"button"}
    size={"large"}
    variation={"teritiary"}
    label="Clear Search"
    onClick={() => console.log("Clicked Button 1")}
  />,
  <Button
    type={"button"}
    size={"large"}
    variation={"primary"}
    label="Search"
    onClick={() => console.log("Clicked Button 2")}
  />,
];

export const SecondaryEmptyCard = Template.bind({});
SecondaryEmptyCard.args = {
  type: "secondary",
};

export const SecondaryCardWithElements = () => (
  <Card type={"secondary"}>
    <div>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Orci a scelerisque
      purus semper. Suspendisse potenti nullam ac tortor vitae. Dictum at tempor
      commodo ullamcorper a. Amet cursus sit amet dictum sit amet justo.
    </div>
    <TextArea
      type="textarea"
      disabled={false}
      populators={{ resizeSmart: true }}
    ></TextArea>
    <MultiSelectDropdown
      options={options}
      optionsKey={"code"}
      onSelect={(value) => {
        console.log(value, "value");
      }}
      addSelectAllCheck={true}
      selected={options}
    />
    <Dropdown
      option={options}
      optionKey={"code"}
      selected={{ code: "FEMALE", name: "FEMALE" }}
      select={(value) => {
        console.log(value);
      }}
    />
    <InfoCard
      populators={{
        name: "infocard",
      }}
      variant="default"
      text={
        "Application process will take a minute to complete. It might cost around Rs.500/- to Rs.1000/- to clean your septic tank and you can expect theservice to get completed in 24 hrs from the time of payment."
      }
      label={"Info"}
    />
    <Button variation="primary" label={"Button"} type="button" size="large" />
    <Button variation="primary" label={"Button"} type="button" size="medium" />
    <Button variation="primary" label={"Button"} type="button" size="small" />
    <Button variation="secondary" label={"Button"} type="button" size="large" />
    <Button
      variation="secondary"
      label={"Button"}
      type="button"
      size="medium"
    />
    <Button variation="secondary" label={"Button"} type="button" size="small" />
    <Button variation="teritiary" label={"Button"} type="button" size="large" />
    <Button
      variation="teritiary"
      label={"Button"}
      type="button"
      size="medium"
    />
    <Button variation="teritiary" label={"Button"} type="button" size="small" />
    <Button variation="link" label={"link"} type="button" size="large" />
    <Button variation="link" label={" link"} type="button" size="medium" />
    <Button variation="link" label={"link"} type="button" size="small" />
  </Card>
);

export const SecondaryCardWithTextBlock = () => (
  <Card type={"secondary"}>
    <TextBlock
      caption="Caption"
      captionClassName=""
      header="Header"
      headerClasName=""
      subHeader="Sub Header"
      subHeaderClasName=""
      body="Body"
      bodyClasName=""
    ></TextBlock>
  </Card>
);

export const SecondarySearchCard = () => (
  <Card type={"secondary"} variant="search">
    <div style={{ maxWidth: "100%", width: "100%" }}>
      <TextBlock body={"Field Name"}></TextBlock>
      <TextInput type="text"></TextInput>
    </div>
    <div style={{ maxWidth: "100%", width: "100%" }}>
      <TextBlock body={"Field Type"}></TextBlock>
      <Dropdown
        option={options}
        optionKey={"code"}
        select={(value) => {
          console.log(value);
        }}
      />
    </div>
    <ButtonsGroup buttonsArray={buttons}></ButtonsGroup>
  </Card>
);
