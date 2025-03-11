import React, { useState } from "react";
import Button from "../../atoms/Button";
import TextInput from "../../atoms/TextInput";
import {
  CheckBox,
  Dropdown,
  LabelFieldPair,
  RadioButtons,
  TextBlock,
} from "../../atoms";
import FormCard from "../FormCard";

export default {
  title: "Molecules/Card/Form Card",
  component: FormCard,
  argTypes: {
    className: {
      control: "text",
      table: { disable: true },
    },
    variant: {
      table: { disable: true },
    },
    headerData: {
      table: { disable: true },
    },
    equalWidthButtons: {
      table: { disable: true },
    },
    footerData: {
      table: { disable: true },
    },
    style: {
      control: { type: "object", table: { disable: true } },
    },
    children: {
      control: "object",
      table: { disable: true },
    },
    type: { control: "select", table: { disable: true } },
    layout: {
      control: "select",
      name: "Columns",
      options: [1, 2],
      mapping: { 1: "", 2: "2*2" },
    },
    props: {
      control: "object",
      table: { disable: true },
    },
    withDivider: {
      control: "boolean",
      name: "Divider",
    },
  },
};

const FormCardWrapper = (args) => {
  const [selectedGender, setSelectedGender] = useState(null);
  const [isSameAsPropertyAddress, setIsSameAsPropertyAddress] = useState(false);

  const [isMobileView, setIsMobileView] = React.useState(
    window.innerWidth / window.innerHeight <= 9 / 16
  );
  const onResize = () => {
    if (window.innerWidth / window.innerHeight <= 9 / 16) {
      if (!isMobileView) {
        setIsMobileView(true);
      }
    } else {
      if (isMobileView) {
        setIsMobileView(false);
      }
    }
  };
  React.useEffect(() => {
    window.addEventListener("resize", () => {
      onResize();
    });
    return () => {
      window.addEventListener("resize", () => {
        onResize();
      });
    };
  });

  const handleGenderSelect = (option) => {
    setSelectedGender(option.code);
  };

  const handleCheckboxChange = (event) => {
    setIsSameAsPropertyAddress(event.target.checked);
  };

  const textBlockStyle = {
    width: isMobileView ? "100%" : "30%",
  };

  const updatedChildren = [
    <LabelFieldPair key="name">
      <TextBlock style={textBlockStyle} body={"Name"}></TextBlock>
      <TextInput type="text"></TextInput>
    </LabelFieldPair>,
    <LabelFieldPair key="gender">
      <TextBlock style={textBlockStyle} body={"Gender"}></TextBlock>
      <RadioButtons
        options={[
          { code: "M", name: "Male" },
          { code: "F", name: "Female" },
          { code: "O", name: "Others" },
        ]}
        optionsKey="name"
        name="gender"
        selectedOption={selectedGender}
        onSelect={handleGenderSelect}
        style={{
          width: "100%",
          justifyContent: "unset",
          ...(isMobileView ? {} : { gap: "24px" }),
        }}
      />
    </LabelFieldPair>,
    <LabelFieldPair>
      <TextBlock style={textBlockStyle} body={"Mobile Number"}></TextBlock>
      <TextInput
        type="text"
        populators={{
          prefix: "+91",
        }}
      />
    </LabelFieldPair>,
    <LabelFieldPair>
      <TextBlock
        style={textBlockStyle}
        body={"Alternate Mobile number"}
      ></TextBlock>
      <TextInput
        type="text"
        populators={{
          prefix: "+91",
        }}
      />
    </LabelFieldPair>,
    <LabelFieldPair>
      <TextBlock style={textBlockStyle} body={"Guardian"}></TextBlock>
      <TextInput type="text"></TextInput>
    </LabelFieldPair>,
    <LabelFieldPair>
      <TextBlock style={textBlockStyle} body={"Special Category"}></TextBlock>
      <div style={{ width: "100%" }}>
        <Dropdown
          option={[
            { code: "1", name: "Below Poverty Line" },
            { code: "2", name: "Above Poverty Line" },
          ]}
          optionKey={"name"}
          selected={{ code: "1", name: "Below Poverty Line" }}
        ></Dropdown>
      </div>
    </LabelFieldPair>,
    <LabelFieldPair>
      <TextBlock style={textBlockStyle} body={"Document ID"}></TextBlock>
      <TextInput type="text"></TextInput>
    </LabelFieldPair>,
    <LabelFieldPair>
      <TextBlock style={textBlockStyle} body={"Document Type"}></TextBlock>
      <div style={{ width: "100%" }}>
        <Dropdown
          option={[
            { code: "1", name: "BPL Certificate" },
            { code: "2", name: "CertificateTwo" },
          ]}
          optionKey={"name"}
          selected={{ code: "1", name: "BPL Certificate" }}
        ></Dropdown>
      </div>
    </LabelFieldPair>,
    <LabelFieldPair>
      <TextBlock style={textBlockStyle} body={"Email ID"}></TextBlock>
      <TextInput type="text"></TextInput>
    </LabelFieldPair>,
    <LabelFieldPair>
      <TextBlock
        style={textBlockStyle}
        body={"Correspondance Address"}
      ></TextBlock>
      <TextInput type="text"></TextInput>
    </LabelFieldPair>,
    <CheckBox
      key="checkbox"
      label={"Same as Property Address"}
      checked={isSameAsPropertyAddress}
      onChange={handleCheckboxChange}
    ></CheckBox>,
  ];

  return <FormCard {...args} children={updatedChildren} />;
};

const Template = (args) => <FormCardWrapper {...args} />;

const headerData = [<TextBlock header={"Enter Details"}></TextBlock>];
const FooterChild = [
  <Button
    type={"button"}
    size={"large"}
    variation={"secondary"}
    icon={""}
    label="Cancel"
    onClick={() => console.log("Clicked cancel")}
  />,
  <Button
    type={"submit"}
    size={"large"}
    variation={"primary"}
    icon={""}
    label="Submit"
    onClick={() => console.log("Clicked submit")}
  />,
];

const commonArgs = {
  layout: 1,
  type: "primary",
  variant: "form",
  headerData: headerData,
  footerData: FooterChild,
  equalWidthButtons: true,
  withDivider: true,
};

export const Basic = Template.bind({});
Basic.args = {
  ...commonArgs,
};
Basic.storyName = `Form Card`;
Basic.argTypes = {
  style: { table: { disable: true } },
};