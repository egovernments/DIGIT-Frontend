import React from "react";
import AlertCard from "../../atoms/AlertCard";
import Button from "../../atoms/Button";
import TextArea from "../../atoms/TextArea";
import MultiSelectDropdown from "../../atoms/MultiSelectDropdown";
import Dropdown from "../../atoms/Dropdown";
import { Card } from "../../atoms";

export default {
  title: "Molecules/Card/Basic",
  component: Card,
  argTypes: {
    className: {
      control: "text",table:{disable:true}
    },
    style: {
      control: { type: "object" },table:{disable:true}
    },
    children: {
      control: "object",table:{disable:true}
    },
    type: { control: "select", mapping:{"Primary":"primary","Secondary":"secondary"} ,options: ["Primary", "Secondary"],name:"Card Style" },
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
      table:{disable:true}
    },
    onClick: {
      control: "function",table:{disable:true}
    },
    props: {
      control: "object",table:{disable:true}
    },
  },
};
// Mock options data
const options = [
  { code: "MALE", name: "MALE" },
  { code: "FEMALE", name: "FEMALE" },
  { code: "TRANSGENDER", name: "TRANSGENDER" },
];

const Template = (args) => (
  <Card type={args.type}>
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
    <AlertCard
      populators={{
        name: "infocard",
      }}
      variant="default"
      text={
        "Application process will take a minute to complete. It might cost around Rs.500/- to Rs.1000/- to clean your septic tank and you can expect the service to get completed in 24 hrs from the time of payment."
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

export const Basic = Template.bind({});
Basic.args = {
  type: "Primary", 
};